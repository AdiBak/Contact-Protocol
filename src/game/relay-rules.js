import { signalForRound } from '../content/signals.js';

export function publicRelayState(state) {
  const safe = { ...state, connections: {} };
  safe.players = state.players.map((player) => {
    const copy = { ...player };
    if (state.phase === 'relay') {
      copy.stationLocked = player.stationChoice !== null;
      copy.stationChoice = null;
    }
    if (state.phase === 'decode') {
      copy.responseLocked = player.answer !== null;
      copy.answer = null;
    }
    return copy;
  });
  return JSON.parse(JSON.stringify(safe));
}

export function activePlayers(state) {
  return state.players.filter((player) => player.connected);
}

export function allSubmitted(state, key) {
  const players = activePlayers(state);
  return players.length > 0 && players.every((player) => player[key] !== null && player[key] !== undefined);
}

export function fragmentForPlayer(state, playerId, catalog) {
  const signal = signalForRound(state, catalog);
  const players = activePlayers(state);
  const index = Math.max(0, players.findIndex((player) => player.id === playerId));
  return signal.fragments[index % signal.fragments.length];
}

export function resolveStations(state, catalog) {
  state.relayResults = activePlayers(state).map((player) => {
    const fragment = fragmentForPlayer(state, player.id, catalog);
    const correct = player.stationChoice === fragment.correct;
    return {
      playerId: player.id,
      playerName: player.name,
      role: fragment.role,
      icon: fragment.icon,
      correct,
      token: correct ? fragment.token : 'STATIC'
    };
  });
}

export function resolveSignal(state, catalog) {
  const signal = signalForRound(state, catalog);
  const players = activePlayers(state);
  const votes = new Map();
  players.forEach((player) => votes.set(player.answer, (votes.get(player.answer) || 0) + 1));
  const ranked = [...votes.keys()].sort((a, b) => votes.get(b) - votes.get(a) || a - b);
  const leading = ranked[0] ?? null;
  const crewAnswer = leading !== null && votes.get(leading) > players.length / 2 ? leading : null;
  const correctVotes = players.filter((player) => player.answer === signal.correct).length;
  const crewWon = correctVotes > players.length / 2;
  const stationPoints = (state.relayResults || []).filter((result) => result.correct).length;
  const responsePoints = crewWon ? 3 : 0;
  const roundPoints = stationPoints + responsePoints;
  const roundMax = players.length + 3;

  state.teamScore += roundPoints;
  state.maxScore += roundMax;
  state.lastResult = {
    crewAnswer,
    crewWon,
    correctVotes,
    total: players.length,
    stationPoints,
    responsePoints,
    roundPoints,
    roundMax,
    votes: Object.fromEntries(votes)
  };
  state.journeyLog[state.round] = {
    title: signal.title,
    conclusion: crewAnswer === null ? 'No majority response' : signal.responses[crewAnswer],
    correct: crewWon,
    stations: stationPoints,
    stationTotal: players.length,
    points: roundPoints,
    maxPoints: roundMax
  };
}

export function relayOutcome(score, maxScore) {
  const ratio = maxScore ? score / maxScore : 0;
  if (ratio >= .85) return { title: 'Contact established', detail: 'Your crew recovered the signals, shared the right details, and answered with care.' };
  if (ratio >= .6) return { title: 'The channel is open', detail: 'The relay held. Some fragments remain unresolved, but another exchange is possible.' };
  return { title: 'Signal lost—for now', detail: 'The transmission faded, but your relay log will make the next contact attempt stronger.' };
}

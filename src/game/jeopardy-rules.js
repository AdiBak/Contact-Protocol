import { CATEGORIES, MAX_ROUNDS } from '../content/clues.js';

export function connectedPlayers(state) {
  return state.players.filter((player) => player.connected);
}

export function createGame(players) {
  return {
    phase: 'board',
    score: 0,
    roundNumber: 0,
    maxRounds: MAX_ROUNDS,
    used: [],
    captainId: players[0]?.id || null,
    current: null,
    history: []
  };
}

export function clueByKey(key) {
  const [categoryId, clueIndexText] = String(key).split(':');
  const category = CATEGORIES.find((candidate) => candidate.id === categoryId);
  const clue = category?.clues[Number(clueIndexText)];
  return category && clue ? { category, clue } : null;
}

export function selectClue(game, key, players, now = Date.now()) {
  if (game.phase !== 'board' || game.used.includes(key)) return false;
  const found = clueByKey(key);
  if (!found || players.length < 1) return false;

  const { category, clue } = found;
  const corruptPlayerIndex = game.roundNumber % players.length;
  const trueFragments = clue.fragments.filter((_, index) => index !== clue.corrupt);
  let trueIndex = game.roundNumber;
  const assignments = players.map((player, index) => {
    const corrupted = index === corruptPlayerIndex;
    const text = corrupted
      ? clue.fragments[clue.corrupt].replace(/^CORRUPTED:\s*/i, '')
      : trueFragments[trueIndex++ % trueFragments.length];
    return { playerId: player.id, text, corrupted };
  });

  game.current = {
    key,
    category: category.name,
    icon: category.icon,
    value: clue.value,
    prompt: clue.prompt,
    display: clue.display,
    options: [...clue.options],
    correctOption: clue.answer,
    explanation: clue.explanation,
    assignments,
    votes: {},
    startedAt: now,
    duration: 45_000,
    anomaly: game.roundNumber === 3,
    result: null
  };
  game.phase = 'clue';
  return true;
}

export function submitVote(game, playerId, answer, suspectId) {
  if (game.phase !== 'clue' || !game.current) return false;
  if (!game.current.assignments.some((assignment) => assignment.playerId === playerId)) return false;
  const option = Number(answer);
  if (!Number.isInteger(option) || option < 0 || option >= game.current.options.length) return false;
  if (!game.current.assignments.some((assignment) => assignment.playerId === suspectId)) return false;
  game.current.votes[playerId] = { answer: option, suspectId };
  return true;
}

export function allVoted(game, players) {
  return players.length > 0 && players.every((player) => game.current?.votes[player.id]);
}

function uniquePlurality(values) {
  const counts = new Map();
  values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  if (!sorted.length || (sorted[1] && sorted[0][1] === sorted[1][1])) return null;
  return sorted[0][0];
}

export function revealClue(game) {
  if (game.phase !== 'clue' || !game.current) return false;
  const votes = Object.values(game.current.votes);
  const crewAnswer = uniquePlurality(votes.map((vote) => vote.answer));
  const crewSuspect = uniquePlurality(votes.map((vote) => vote.suspectId));
  const corruptPlayer = game.current.assignments.find((assignment) => assignment.corrupted)?.playerId;
  const answerCorrect = crewAnswer === game.current.correctOption;
  const glitchCorrect = crewSuspect === corruptPlayer;
  const multiplier = game.current.anomaly ? 2 : 1;
  const answerPoints = answerCorrect ? game.current.value * multiplier : -Math.ceil(game.current.value / 4);
  const glitchPoints = glitchCorrect ? Math.ceil(game.current.value / 2) : 0;
  const points = answerPoints + glitchPoints;

  game.score = Math.max(0, game.score + points);
  game.current.result = {
    crewAnswer,
    crewSuspect,
    corruptPlayer,
    answerCorrect,
    glitchCorrect,
    points
  };
  game.history.push({
    key: game.current.key,
    value: game.current.value,
    answerCorrect,
    glitchCorrect,
    points
  });
  game.used.push(game.current.key);
  game.roundNumber += 1;
  game.phase = 'reveal';
  return true;
}

export function advanceRound(game, players) {
  if (game.phase !== 'reveal') return false;
  if (game.roundNumber >= game.maxRounds || game.used.length >= 16) {
    game.phase = 'result';
    game.current = null;
    return true;
  }
  const currentCaptainIndex = Math.max(0, players.findIndex((player) => player.id === game.captainId));
  game.captainId = players[(currentCaptainIndex + 1) % players.length]?.id || null;
  game.current = null;
  game.phase = 'board';
  return true;
}

export function gameRank(game) {
  if (game.score >= 2600) return { title: 'First Contact Legends', grade: 'S', detail: 'You read the room—and the stars—perfectly.' };
  if (game.score >= 1800) return { title: 'Master Signalbreakers', grade: 'A', detail: 'Your crew turned scattered evidence into a clear signal.' };
  if (game.score >= 1000) return { title: 'Trusted Interpreters', grade: 'B', detail: 'Strong teamwork carried the transmission home.' };
  return { title: 'Promising Cadets', grade: 'C', detail: 'The archive has more mysteries ready for your next crew.' };
}

export function stateForPlayer(state, viewerId) {
  const safe = JSON.parse(JSON.stringify(state, (key, value) => key === 'connections' ? undefined : value));
  if (safe.game?.phase === 'clue' && safe.game.current) {
    safe.game.current.assignments.forEach((assignment) => {
      if (assignment.playerId !== viewerId) delete assignment.text;
      delete assignment.corrupted;
    });
    Object.entries(safe.game.current.votes).forEach(([playerId, vote]) => {
      if (playerId !== viewerId) safe.game.current.votes[playerId] = { locked: Boolean(vote) };
    });
    delete safe.game.current.correctOption;
    delete safe.game.current.explanation;
  }
  return safe;
}

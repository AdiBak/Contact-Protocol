import { missionForRound } from '../content/missions.js';

export const RESEARCH_BUDGET = 4;

export function publicState(state) {
  const safe = { ...state, connections: {} };
  safe.players = state.players.map((player) => {
    const copy = { ...player };
    if (state.phase === 'investigate') {
      copy.investigationLocked = player.investigation !== null;
      copy.investigation = null;
    }
    if (state.phase === 'predict') {
      copy.hypothesisLocked = player.answer !== null;
      copy.answer = null;
      copy.confidence = null;
    }
    return copy;
  });
  return JSON.parse(JSON.stringify(safe));
}

export function allDone(state, key) {
  const active = state.players.filter((player) => player.connected);
  return active.length > 0 && active.every((player) => player[key] !== null && player[key] !== undefined);
}

export function majorityReached(state, key) {
  const active = state.players.filter((player) => player.connected);
  if (!active.length) return false;
  const ready = active.filter((player) => player[key] === true).length;
  return ready >= Math.floor(active.length / 2) + 1;
}

export function resolveScans(state, missions) {
  const mission = missionForRound(state, missions);
  const counts = new Map();
  state.players.filter((player) => player.connected).forEach((player) => {
    if (Number.isInteger(player.investigation)) counts.set(player.investigation, (counts.get(player.investigation) || 0) + 1);
  });

  const ranked = [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a) || a - b);
  let energy = RESEARCH_BUDGET;
  const funded = [];
  ranked.forEach((index) => {
    const cost = mission.tests[index]?.cost ?? 1;
    if (cost <= energy) {
      funded.push(index);
      energy -= cost;
    }
  });
  state.fundedScans = funded;
  state.energyUsed = RESEARCH_BUDGET - energy;
  state.scanVotes = Object.fromEntries(counts);
}

export function resolveRound(state, missions) {
  const mission = missionForRound(state, missions);
  const connected = state.players.filter((player) => player.connected);
  const answerCounts = new Map();
  connected.forEach((player) => answerCounts.set(player.answer, (answerCounts.get(player.answer) || 0) + 1));
  const rankedAnswers = [...answerCounts.keys()].sort((a, b) => answerCounts.get(b) - answerCounts.get(a) || a - b);
  const leadingAnswer = rankedAnswers[0] ?? null;
  const crewAnswer = leadingAnswer !== null && answerCounts.get(leadingAnswer) > connected.length / 2 ? leadingAnswer : null;
  const correctVotes = connected.filter((player) => player.answer === mission.correct).length;
  const crewWon = correctVotes > connected.length / 2;
  const averageConfidence = connected.length
    ? connected.reduce((sum, player) => sum + (player.confidence || 1), 0) / connected.length
    : 1;
  const scanPoints = state.fundedScans.filter((index) => mission.tests[index]?.value >= 2).length;
  const conclusionPoints = crewWon ? 2 : 0;
  const calibrationPoints = averageConfidence >= 2.5 ? (crewWon ? 1 : -1) : 0;
  const roundPoints = conclusionPoints + scanPoints + calibrationPoints;
  state.teamScore = Math.max(0, state.teamScore + roundPoints);
  state.lastResult = {
    crewAnswer,
    correctVotes,
    total: connected.length,
    crewWon,
    answerVotes: Object.fromEntries(answerCounts),
    averageConfidence,
    conclusionPoints,
    scanPoints,
    calibrationPoints,
    roundPoints,
    used: [...state.fundedScans],
    energyUsed: state.energyUsed
  };
  state.journeyLog = state.journeyLog || [];
  state.journeyLog[state.round] = {
    title: mission.title,
    tag: mission.tag,
    conclusion: crewAnswer === null ? 'No majority conclusion' : mission.answers[crewAnswer],
    correct: crewWon,
    discoveries: (state.discoveries || []).length,
    scans: [...state.fundedScans],
    points: roundPoints
  };
}

export function expeditionOutcome(score) {
  if (score >= 18) return { title: 'Scientific breakthrough', detail: 'Your crew built a strong picture of the unknown by testing ideas carefully together.' };
  if (score >= 10) return { title: 'Promising signal', detail: 'Your crew found meaningful evidence and learned where the next observations should go.' };
  return { title: 'The investigation continues', detail: 'The unknown remains, but your open questions give the next crew a place to begin.' };
}

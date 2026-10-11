import { CASE_LIBRARY, caseById, categoryById, roundCount } from '../content/case-library.js';

export function connectedPlayers(state) {
  return state.players.filter((player) => player.connected);
}

export function createSelection() {
  return {
    stage: 'category',
    candidates: CASE_LIBRARY.map((category) => category.id),
    votes: {},
    runoff: false,
    runoffRound: 0,
    selectedCategoryId: null,
    selectedCaseId: null
  };
}

function validSelectionChoice(selection, choiceId) {
  if (!selection.candidates.includes(choiceId)) return false;
  if (selection.stage === 'category') return Boolean(categoryById(choiceId));
  if (selection.stage === 'case') {
    return Boolean(categoryById(selection.selectedCategoryId)?.cases.some((caseFile) => caseFile.id === choiceId));
  }
  return false;
}

function resolveBallot(selection, players) {
  const connectedIds = new Set(players.map((player) => player.id));
  const votes = Object.entries(selection.votes).filter(([playerId]) => connectedIds.has(playerId));
  if (!players.length || votes.length < players.length) return false;

  const counts = new Map(selection.candidates.map((candidate) => [candidate, 0]));
  votes.forEach(([, choiceId]) => counts.set(choiceId, (counts.get(choiceId) || 0) + 1));
  const highest = Math.max(...counts.values());
  let winners = [...counts.entries()].filter(([, count]) => count === highest).map(([choiceId]) => choiceId);

  if (winners.length > 1 && selection.runoffRound > 0) {
    const host = players.find((player) => player.host) || players[0];
    const hostVote = selection.votes[host?.id];
    winners = [winners.includes(hostVote) ? hostVote : winners.sort()[0]];
  }

  if (winners.length > 1) {
    selection.candidates = winners;
    selection.votes = {};
    selection.runoff = true;
    selection.runoffRound += 1;
    return true;
  }

  const winner = winners[0];
  if (selection.stage === 'category') {
    const category = categoryById(winner);
    selection.stage = 'case';
    selection.selectedCategoryId = winner;
    selection.candidates = category.cases.map((caseFile) => caseFile.id);
    selection.votes = {};
    selection.runoff = false;
    selection.runoffRound = 0;
  } else {
    selection.stage = 'complete';
    selection.selectedCaseId = winner;
    selection.candidates = [];
    selection.votes = {};
    selection.runoff = false;
  }
  return true;
}

export function castSelectionVote(selection, playerId, choiceId, players) {
  if (!selection || selection.stage === 'complete' || selection.votes[playerId]) return false;
  if (!players.some((player) => player.id === playerId) || !validSelectionChoice(selection, choiceId)) return false;
  selection.votes[playerId] = choiceId;
  resolveBallot(selection, players);
  return true;
}

export function resolveSelectionAfterDisconnect(selection, players) {
  if (!selection || selection.stage === 'complete') return false;
  return resolveBallot(selection, players);
}

export function createGame(players, caseId) {
  const caseFile = caseById(caseId);
  if (!caseFile) return null;
  return {
    caseId: caseFile.id,
    categoryId: caseFile.categoryId,
    phase: 'board',
    score: 0,
    roundNumber: 0,
    maxRounds: roundCount(caseFile),
    used: [],
    captainId: players[0]?.id || null,
    current: null,
    history: [],
    finalResult: null
  };
}

export function clueByKey(game, key) {
  const [sectionId, clueIndexText] = String(key).split(':');
  const caseFile = caseById(game.caseId);
  const section = caseFile?.sections.find((candidate) => candidate.id === sectionId);
  const clue = section?.rounds[Number(clueIndexText)];
  return caseFile && section && clue ? { caseFile, section, clue } : null;
}

export function selectClue(game, key, players, now = Date.now()) {
  if (game.phase !== 'board' || game.used.includes(key)) return false;
  const found = clueByKey(game, key);
  if (!found || players.length < 1) return false;

  const { section, clue } = found;
  const assignments = players.map((player, index) => ({
    playerId: player.id,
    text: clue.fragments[index % clue.fragments.length]
  }));

  game.current = {
    key,
    category: section.name,
    icon: section.icon,
    value: clue.value,
    prompt: clue.prompt,
    display: clue.display,
    options: [...clue.options],
    correctOption: clue.answer,
    explanation: clue.explanation,
    evidence: clue.evidence,
    assignments,
    startedAt: now,
    duration: 45_000,
    anomaly: game.roundNumber === 3,
    result: null
  };
  game.phase = 'clue';
  return true;
}

export function answerClue(game, playerId, answer) {
  if (game.phase !== 'clue' || !game.current) return false;
  if (game.captainId !== playerId) return false;
  const option = Number(answer);
  if (!Number.isInteger(option) || option < 0 || option >= game.current.options.length) return false;
  return revealClue(game, option);
}

export function revealClue(game, crewAnswer = null) {
  if (game.phase !== 'clue' || !game.current) return false;
  const answerCorrect = crewAnswer === game.current.correctOption;
  const multiplier = game.current.anomaly ? 2 : 1;
  const points = answerCorrect ? game.current.value * multiplier : -Math.ceil(game.current.value / 4);

  game.score = Math.max(0, game.score + points);
  game.current.result = {
    crewAnswer,
    answerCorrect,
    points
  };
  game.history.push({
    key: game.current.key,
    category: game.current.category,
    value: game.current.value,
    answerCorrect,
    points,
    evidence: game.current.evidence
  });
  game.used.push(game.current.key);
  game.roundNumber += 1;
  game.phase = 'reveal';
  return true;
}

export function advanceRound(game, players) {
  if (game.phase !== 'reveal') return false;
  const currentCaptainIndex = Math.max(0, players.findIndex((player) => player.id === game.captainId));
  game.captainId = players[(currentCaptainIndex + 1) % players.length]?.id || null;
  if (game.roundNumber >= game.maxRounds) {
    game.phase = 'finale';
    game.current = null;
    return true;
  }
  game.current = null;
  game.phase = 'board';
  return true;
}

export function submitFinalAccusation(game, playerId, guess) {
  if (game.phase !== 'finale' || game.captainId !== playerId || !guess) return false;
  const caseFile = caseById(game.caseId);
  if (!caseFile) return false;
  const correct = {};
  for (const part of caseFile.finale.parts) {
    if (!part.options.some((option) => option.id === guess[part.id])) return false;
    correct[part.id] = guess[part.id] === part.answer;
  }
  const solvedParts = Object.values(correct).filter(Boolean).length;
  const bonus = solvedParts * 200 + (solvedParts === caseFile.finale.parts.length ? 600 : 0);
  game.score += bonus;
  game.finalResult = {
    guess: Object.fromEntries(caseFile.finale.parts.map((part) => [part.id, guess[part.id]])),
    correct,
    solvedParts,
    solved: solvedParts === caseFile.finale.parts.length,
    bonus
  };
  game.phase = 'result';
  return true;
}

export function gameRank(game) {
  const caseFile = caseById(game.caseId);
  if (game.finalResult?.solved && game.history.every((round) => round.answerCorrect)) return { title: caseFile?.successTitle || 'Outcome Achieved', grade: 'S', detail: 'Every deduction and final finding matched the evidence.' };
  if (game.finalResult?.solved) return { title: caseFile?.successTitle || 'Outcome Achieved', grade: 'A', detail: 'Your final conclusion matches the complete evidence trail.' };
  if (game.finalResult?.solvedParts >= 2) return { title: 'Near Breakthrough', grade: 'B', detail: 'Most of the final outcome was right, but one finding needs review.' };
  return { title: 'Outcome Unresolved', grade: 'C', detail: 'Review the reconstruction and compare it with your final choices.' };
}

export function stateForPlayer(state, viewerId) {
  const safe = JSON.parse(JSON.stringify(state, (key, value) => key === 'connections' ? undefined : value));
  if (safe.selection && safe.selection.stage !== 'complete') {
    Object.keys(safe.selection.votes).forEach((playerId) => {
      if (playerId !== viewerId) safe.selection.votes[playerId] = true;
    });
  }
  if (safe.game?.phase === 'clue' && safe.game.current) {
    safe.game.current.assignments.forEach((assignment) => {
      if (assignment.playerId !== viewerId) delete assignment.text;
    });
    delete safe.game.current.correctOption;
    delete safe.game.current.explanation;
    delete safe.game.current.evidence;
  }
  return safe;
}

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
  const assignments = players.map((player, index) => ({
    playerId: player.id,
    text: clue.fragments[(game.roundNumber + index) % clue.fragments.length]
  }));

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
    value: game.current.value,
    answerCorrect,
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
    });
    delete safe.game.current.correctOption;
    delete safe.game.current.explanation;
  }
  return safe;
}

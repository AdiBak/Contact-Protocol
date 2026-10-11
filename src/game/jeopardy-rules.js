import { BOARD_SIZE, CASE_FILE, CATEGORIES, MAX_ROUNDS } from '../content/case-clues.js';

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
    history: [],
    finalResult: null
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
    text: clue.fragments[index % clue.fragments.length]
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
  if (game.roundNumber >= game.maxRounds || game.used.length >= BOARD_SIZE) {
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
  const validSuspect = CASE_FILE.suspects.some((option) => option.id === guess.suspect);
  const validMethod = CASE_FILE.methods.some((option) => option.id === guess.method);
  const validLocation = CASE_FILE.locations.some((option) => option.id === guess.location);
  if (!validSuspect || !validMethod || !validLocation) return false;

  const correct = {
    suspect: guess.suspect === CASE_FILE.solution.suspect,
    method: guess.method === CASE_FILE.solution.method,
    location: guess.location === CASE_FILE.solution.location
  };
  const solvedParts = Object.values(correct).filter(Boolean).length;
  const bonus = solvedParts * 200 + (solvedParts === 3 ? 600 : 0);
  game.score += bonus;
  game.finalResult = {
    guess: { suspect: guess.suspect, method: guess.method, location: guess.location },
    correct,
    solvedParts,
    solved: solvedParts === 3,
    bonus
  };
  game.phase = 'result';
  return true;
}

export function gameRank(game) {
  if (game.finalResult?.solved && game.score >= 3200) return { title: 'Master Investigators', grade: 'S', detail: 'You reconstructed the theft and recovered The Blue Hour.' };
  if (game.finalResult?.solved) return { title: 'Case Closed', grade: 'A', detail: 'Your final accusation matches every piece of physical and digital evidence.' };
  if (game.finalResult?.solvedParts >= 2) return { title: 'Breakthrough Team', grade: 'B', detail: 'Most of your reconstruction was right, but one detail escaped the case file.' };
  return { title: 'Case Remains Open', grade: 'C', detail: 'Review the reconstruction—the evidence will point more clearly on another attempt.' };
}

export function stateForPlayer(state, viewerId) {
  const safe = JSON.parse(JSON.stringify(state, (key, value) => key === 'connections' ? undefined : value));
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

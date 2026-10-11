import { CASE_LIBRARY, caseById, categoryById } from './content/case-library.js';
import {
  answerClue,
  advanceRound,
  castSelectionVote,
  connectedPlayers,
  createGame,
  createSelection,
  gameRank,
  revealClue,
  resolveSelectionAfterDisconnect,
  selectClue,
  stateForPlayer,
  submitFinalAccusation
} from './game/jeopardy-rules.js';
import { esc } from './game/text.js';

(() => {
  const $ = (selector) => document.querySelector(selector);
  const home = $('#homeView');
  const gameRoot = $('#gameView');
  const toastElement = $('#toast');
  let peer = null;
  let connection = null;
  let isHost = false;
  let myId = null;
  let room = '';
  let state = null;
  let busy = false;
  let clockTimer = null;

  function toast(message) {
    toastElement.textContent = message;
    toastElement.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => toastElement.classList.remove('show'), 2600);
  }

  function getName() {
    const name = $('#playerName').value.trim();
    if (!name) {
      toast('Choose a callsign first.');
      $('#playerName').focus();
      return null;
    }
    return name.slice(0, 18);
  }

  function setBusy(value) {
    busy = value;
    ['#hostBtn', '#showJoinBtn', '#joinBtn'].forEach((selector) => {
      const element = $(selector);
      if (element) element.disabled = value;
    });
  }

  function roomCode() {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from(crypto.getRandomValues(new Uint8Array(6)), (byte) => alphabet[byte % alphabet.length]).join('');
  }

  function showGame() {
    home.classList.add('hidden');
    gameRoot.classList.remove('hidden');
    document.body.classList.add('game-mode');
    render();
  }

  function sendState() {
    if (!isHost || !state) return;
    Object.values(state.connections).forEach((conn) => {
      if (!conn?.open) return;
      const player = state.players.find((candidate) => candidate.peerId === conn.peer);
      conn.send({ type: 'state', state: stateForPlayer(state, player?.id) });
    });
    render();
  }

  function receiveState(nextState) {
    state = nextState;
    state.connections = {};
    render();
  }

  function ensureCaptain() {
    if (!state.game) return;
    const players = connectedPlayers(state);
    if (!players.some((player) => player.id === state.game.captainId)) {
      state.game.captainId = players[0]?.id || null;
    }
  }

  function startGame() {
    if (!isHost) return;
    const players = connectedPlayers(state);
    if (players.length < 2) {
      toast('Invite at least one more player.');
      return;
    }
    state.selection = createSelection();
    state.game = null;
    sendState();
  }

  function resetGame() {
    if (!isHost) return;
    state.selection = null;
    state.game = null;
    sendState();
  }

  function finishSelection(players) {
    if (state.selection?.stage === 'complete' && !state.game) {
      state.game = createGame(players, state.selection.selectedCaseId);
    }
  }

  function handleAction(playerId, action, value) {
    if (!isHost || !state) return;
    const players = connectedPlayers(state);
    if (!players.some((player) => player.id === playerId)) return;

    if (action === 'vote-selection' && state.selection && !state.game) {
      if (castSelectionVote(state.selection, playerId, value, players)) {
        finishSelection(players);
        sendState();
      }
    } else if (action === 'select' && state.game?.captainId === playerId) {
      if (selectClue(state.game, value, players)) sendState();
    } else if (action === 'answer' && state.game?.phase === 'clue') {
      if (answerClue(state.game, playerId, value?.answer)) sendState();
    } else if (action === 'advance' && state.game?.phase === 'reveal' && state.game.captainId === playerId) {
      advanceRound(state.game, players);
      sendState();
    } else if (action === 'accuse' && state.game?.phase === 'finale') {
      if (submitFinalAccusation(state.game, playerId, value)) sendState();
    }
  }

  function sendAction(action, value) {
    if (isHost) handleAction(myId, action, value);
    else if (connection?.open) connection.send({ type: 'action', playerId: myId, action, value });
    else toast('Connection lost. Rejoin the room.');
  }

  function bindConnection(conn) {
    state.connections[conn.peer] = conn;
    conn.on('data', (message) => {
      if (message?.type === 'join' && isHost) {
        const existing = state.players.find((player) => player.id === message.playerId);
        if (!existing && state.game) {
          conn.send({ type: 'rejected', reason: 'This game is already underway.' });
          return;
        }
        if (existing) {
          existing.connected = true;
          existing.peerId = conn.peer;
          existing.name = String(message.name || 'Player').slice(0, 18);
        } else if (state.players.length < 8) {
          state.players.push({
            id: message.playerId,
            peerId: conn.peer,
            name: String(message.name || 'Player').slice(0, 18),
            host: false,
            connected: true
          });
        } else {
          conn.send({ type: 'rejected', reason: 'This room is full.' });
          return;
        }
        conn.send({ type: 'welcome', myId: message.playerId });
        sendState();
      } else if (message?.type === 'action' && isHost) {
        handleAction(message.playerId, message.action, message.value);
      }
    });
    conn.on('close', () => {
      delete state.connections[conn.peer];
      if (!isHost) return;
      const player = state.players.find((candidate) => candidate.peerId === conn.peer);
      if (player) player.connected = false;
      ensureCaptain();
      if (state.selection && !state.game) {
        resolveSelectionAfterDisconnect(state.selection, connectedPlayers(state));
        finishSelection(connectedPlayers(state));
      }
      sendState();
    });
    conn.on('error', () => toast('A player connection dropped.'));
  }

  function hostRoom() {
    const name = getName();
    if (!name || busy) return;
    if (!window.Peer) {
      toast('The connection service did not load. Refresh and try again.');
      return;
    }
    setBusy(true);
    isHost = true;
    room = roomCode();
    peer = new Peer(`cp-${room.toLowerCase()}`);
    peer.on('open', (id) => {
      myId = `host-${id}`;
      state = {
        room,
        players: [{ id: myId, peerId: id, name, host: true, connected: true }],
        connections: {},
        selection: null,
        game: null
      };
      peer.on('connection', bindConnection);
      setBusy(false);
      showGame();
    });
    peer.on('error', (error) => {
      setBusy(false);
      if (error.type === 'unavailable-id') {
        peer.destroy();
        isHost = false;
        hostRoom();
      } else {
        toast(`Could not open a room: ${error.type}`);
      }
    });
  }

  function joinRoom() {
    const name = getName();
    if (!name || busy) return;
    room = $('#roomCode').value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (room.length !== 6) {
      toast('Enter the six-character room code.');
      return;
    }
    if (!window.Peer) {
      toast('The connection service did not load. Refresh and try again.');
      return;
    }
    setBusy(true);
    isHost = false;
    peer = new Peer();
    peer.on('open', (id) => {
      myId = sessionStorage.getItem(`cp-player-${room}`) || `p-${id}`;
      sessionStorage.setItem(`cp-player-${room}`, myId);
      connection = peer.connect(`cp-${room.toLowerCase()}`, { reliable: true });
      connection.on('open', () => connection.send({ type: 'join', playerId: myId, name }));
      connection.on('data', (message) => {
        if (message?.type === 'state') {
          setBusy(false);
          receiveState(message.state);
          if (!home.classList.contains('hidden')) showGame();
        } else if (message?.type === 'welcome') {
          myId = message.myId;
        } else if (message?.type === 'rejected') {
          setBusy(false);
          toast(message.reason);
          connection.close();
          peer.destroy();
        }
      });
      connection.on('close', () => toast('The host connection ended.'));
      connection.on('error', () => {
        setBusy(false);
        toast('Could not reach that room. Check the code.');
      });
    });
    peer.on('error', (error) => {
      setBusy(false);
      toast(error.type === 'peer-unavailable' ? 'Room not found. Check the code.' : `Connection error: ${error.type}`);
    });
  }

  function copyRoom() {
    navigator.clipboard?.writeText(room).then(() => toast('Room code copied.')).catch(() => toast(`Room code: ${room}`));
  }

  function playerName(id) {
    return state.players.find((player) => player.id === id)?.name || 'Unknown';
  }

  function crewMarkup(players) {
    return players.map((player) => {
      let status = player.host ? 'HOST' : 'CREW';
      if (state.selection && !state.game) status = state.selection.votes[player.id] ? 'VOTED' : 'VOTING';
      if (state.game?.phase === 'board' && player.id === state.game.captainId) status = 'CHOOSING';
      if (state.game?.phase === 'clue') status = player.id === state.game.captainId ? 'DECIDING' : 'SHARING';
      if (state.game?.phase === 'finale') status = player.id === state.game.captainId ? 'ACCUSING' : 'REVIEWING';
      return `<div class="crew-chip ${player.id === myId ? 'is-me' : ''}">
        <span class="crew-avatar">${esc(player.name.slice(0, 1).toUpperCase())}</span>
        <span><b>${esc(player.name)}${player.id === myId ? ' · YOU' : ''}</b><small>${status}</small></span>
      </div>`;
    }).join('');
  }

  function lobbyMarkup(players) {
    return `<section class="lobby-stage">
      <div class="lobby-orbit" aria-hidden="true"><span></span><span></span><i>?</i></div>
      <div class="lobby-copy">
        <span class="stage-kicker">25 OUTCOMES · 5 CATEGORIES</span>
        <h1>Your crew chooses<br/>what happens next.</h1>
        <p>Vote on a category, choose one of five grounded cases, then share private evidence through eight rounds that build toward a real outcome.</p>
        <div class="rule-row">
          <span><b>01</b> Share your fragment</span>
          <span><b>02</b> Talk it through</span>
          <span><b>03</b> Captain answers</span>
        </div>
        ${isHost
          ? `<button id="startBtn" class="primary-action" ${players.length < 2 ? 'disabled' : ''}>Open the case library <span>↗</span></button>`
          : '<div class="waiting-line"><i></i> Waiting for the host to start</div>'}
        <small class="player-requirement">${players.length}/8 players connected · 2 required</small>
      </div>
    </section>`;
  }

  function selectionMarkup(players) {
    const selection = state.selection;
    const myVote = selection.votes[myId];
    const votedCount = Object.keys(selection.votes).length;
    const choosingCategory = selection.stage === 'category';
    const category = choosingCategory ? null : categoryById(selection.selectedCategoryId);
    const candidates = choosingCategory
      ? CASE_LIBRARY.filter((item) => selection.candidates.includes(item.id))
      : category.cases.filter((item) => selection.candidates.includes(item.id));
    const cards = candidates.map((item) => {
      const selected = myVote === item.id;
      const detail = choosingCategory
        ? `${item.cases.length} outcomes · ${item.description}`
        : item.hook;
      const title = choosingCategory ? `${item.icon} ${item.name}` : item.title;
      const subtitle = choosingCategory ? 'CATEGORY' : item.subtitle;
      return `<button class="selection-card ${selected ? 'selected' : ''}" data-selection-vote="${item.id}" ${myVote ? 'disabled' : ''}>
        <span>${esc(subtitle)}</span><h2>${esc(title)}</h2><p>${esc(detail)}</p><b>${selected ? 'YOUR VOTE ✓' : 'VOTE FOR THIS'}</b>
      </button>`;
    }).join('');
    return `<section class="selection-stage">
      <header class="selection-heading">
        <span class="stage-kicker">${selection.runoff ? 'TIE · RUNOFF VOTE' : choosingCategory ? 'BALLOT 1 OF 2' : 'BALLOT 2 OF 2'}</span>
        <h1>${choosingCategory ? 'What should we explore?' : `Choose a ${esc(category.name)} case.`}</h1>
        <p>${selection.runoff ? 'The top choices tied. Vote once more between the finalists.' : choosingCategory ? 'Every player gets one private vote. The most popular category advances.' : 'Choose the outcome your crew wants to work toward.'}</p>
      </header>
      <div class="selection-grid">${cards}</div>
      <div class="ballot-status"><span>${votedCount}/${players.length} votes locked</span><div>${players.map((player) => `<i class="${selection.votes[player.id] ? 'voted' : ''}">${esc(player.name.slice(0, 1).toUpperCase())}</i>`).join('')}</div><small>${myVote ? 'Vote locked. Waiting for the rest of the crew.' : 'Choose one card to lock your vote.'}</small></div>
    </section>`;
  }

  function boardMarkup(players) {
    const caseFile = caseById(state.game.caseId);
    const captain = playerName(state.game.captainId);
    const canChoose = state.game.captainId === myId;
    const columns = caseFile.sections.map((section) => {
      const cells = section.rounds.map((clue, index) => {
        const key = `${section.id}:${index}`;
        const used = state.game.used.includes(key);
        return `<button class="board-cell ${used ? 'used' : ''}" data-clue="${key}" ${used || !canChoose ? 'disabled' : ''}>
          ${used ? '<span>EVIDENCE LOGGED</span>' : `<b>${clue.value}</b><span>PTS</span>`}
        </button>`;
      }).join('');
      return `<div class="board-column">
        <div class="category-head"><i>${section.icon}</i><b>${esc(section.name)}</b><span>${esc(section.description)}</span></div>
        ${cells}
      </div>`;
    }).join('');
    return `<section class="board-stage">
      <div class="stage-heading">
        <div><span class="stage-kicker">${esc(caseFile.categoryName.toUpperCase())} · ${esc(caseFile.title.toUpperCase())}</span><h1>Choose an evidence file.</h1></div>
        <div class="captain-callout"><span>ROUND CAPTAIN</span><b>${esc(captain)}</b><small>${canChoose ? 'Your pick' : 'is choosing'}</small></div>
      </div>
      <div class="category-board">${columns}</div>
      <p class="board-note">Complete all eight files to unlock the final outcome. Harder deductions are worth more.</p>
      ${state.game.history.length ? `<aside class="case-trail"><span>EVIDENCE TRAIL · ${state.game.history.length}/${state.game.maxRounds}</span><div>${state.game.history.slice(-4).map((item) => `<p><i>${item.answerCorrect ? '✓' : '•'}</i>${esc(item.evidence)}</p>`).join('')}</div></aside>` : ''}
    </section>`;
  }

  function choiceMarkup(current, interactive) {
    return current.options.map((option, index) => `<button class="answer-choice" ${interactive ? `data-answer="${index}"` : 'disabled'}>
      <span>${String.fromCharCode(65 + index)}</span><b>${esc(option)}</b>
    </button>`).join('');
  }

  function clueMarkup(players) {
    const current = state.game.current;
    const assignment = current.assignments.find((item) => item.playerId === myId);
    const captain = state.game.captainId === myId;
    const captainName = playerName(state.game.captainId);
    return `<section class="clue-stage">
      <header class="clue-heading">
        <div><span>${current.icon} ${esc(current.category)}</span><b>${current.value * (current.anomaly ? 2 : 1)} PTS${current.anomaly ? ' · BREAKTHROUGH ×2' : ''}</b></div>
        <time id="clueClock">0:45</time>
      </header>
      <div class="clue-question">
        <span>CASE QUESTION</span>
        <h1>${esc(current.prompt)}</h1>
        <div class="clue-display">${esc(current.display)}</div>
      </div>
      <div class="evidence-grid">
        <article class="private-fragment">
          <span>ONLY ON YOUR SCREEN</span>
          <h2>Your fragment</h2>
          <p>${esc(assignment?.text || 'Fragment unavailable.')}</p>
          <small>Read this aloud. Every fragment comes from a verified case record.</small>
        </article>
        <article class="crew-comms">
          <span>CREW COMMS</span>
          <h2>${esc(captainName)} is Captain</h2>
          <div>${players.map((player) => `<i class="${player.id === state.game.captainId ? 'locked' : ''}"><b>${esc(player.name.slice(0, 1).toUpperCase())}</b><small>${player.id === state.game.captainId ? 'CAPTAIN' : 'SHARE INTEL'}</small></i>`).join('')}</div>
        </article>
      </div>
      ${captain
        ? `<form id="answerForm" class="vote-panel">
            <fieldset><legend>You are Captain · Choose the crew’s final answer</legend><div class="answer-list">${choiceMarkup(current, true)}</div></fieldset>
            <button id="lockBtn" class="primary-action lock-answer" type="submit">Lock the crew’s answer</button>
          </form>`
        : `<section class="vote-panel spectator-panel">
            <span class="stage-kicker">HELP YOUR CAPTAIN</span>
            <h2>Tell ${esc(captainName)} what you found.</h2>
            <p>Discuss the options together. Only the Captain submits the final answer this round.</p>
            <div class="answer-list">${choiceMarkup(current, false)}</div>
          </section>`}
    </section>`;
  }

  function revealMarkup(players) {
    const current = state.game.current;
    const result = current.result;
    const captain = state.game.captainId === myId;
    return `<section class="reveal-stage">
      <div class="reveal-score ${result.points >= 0 ? 'positive' : 'negative'}">
        <span>EVIDENCE REVIEWED</span>
        <b>${result.points >= 0 ? '+' : ''}${result.points}</b>
        <small>CREW POINTS</small>
      </div>
      <div class="reveal-copy">
        <span class="stage-kicker">${esc(current.category)} · ${current.value} PTS</span>
        <h1>${result.answerCorrect ? 'Deduction confirmed.' : 'Evidence corrected.'}</h1>
        <p class="correct-answer">Correct answer: <b>${esc(current.options[current.correctOption])}</b></p>
        <p>${esc(current.explanation)}</p>
        <div class="evidence-unlocked"><span>ADDED TO CASE TRAIL</span><b>${esc(current.evidence)}</b></div>
        <div class="result-flags">
          <span class="${result.answerCorrect ? 'success' : 'miss'}">${result.answerCorrect ? '✓' : '×'} Crew answer</span>
        </div>
      </div>
      <div class="fragment-reveal">
        <span>THE COMPLETE EVIDENCE</span>
        ${current.assignments.map((assignment) => `<article>
          <header><b>${esc(playerName(assignment.playerId))}</b><small>VERIFIED</small></header>
          <p>${esc(assignment.text)}</p>
        </article>`).join('')}
      </div>
      <div class="next-round">
        ${captain
          ? `<button id="advanceBtn" class="primary-action">${state.game.roundNumber >= state.game.maxRounds ? 'Build the final outcome' : 'Return to the evidence board'} <span>↗</span></button>`
          : `<span class="waiting-line"><i></i> Waiting for ${esc(playerName(state.game.captainId))}</span>`}
      </div>
    </section>`;
  }

  function finalOptionsMarkup(kind, options, interactive) {
    return options.map((option) => `<button class="case-option" ${interactive ? `data-final-kind="${kind}" data-final-id="${option.id}"` : 'disabled'}>
      <b>${esc(option.label)}</b>${option.detail ? `<span>${esc(option.detail)}</span>` : ''}
    </button>`).join('');
  }

  function finaleMarkup() {
    const caseFile = caseById(state.game.caseId);
    const captain = state.game.captainId === myId;
    const captainName = playerName(state.game.captainId);
    const fields = (interactive) => caseFile.finale.parts.map((part, index) => `<fieldset>
      <legend>${index + 1} · ${esc(part.label)}</legend>
      <div class="case-options">${finalOptionsMarkup(part.id, part.options, interactive)}</div>
    </fieldset>`).join('');
    return `<section class="finale-stage">
      <header class="finale-heading">
        <span class="stage-kicker">ALL EVIDENCE COLLECTED</span>
        <h1>Complete the outcome.</h1>
        <p>${esc(caseFile.finale.intro)}</p>
      </header>
      <div class="full-case-trail">
        ${state.game.history.map((item, index) => `<article><span>${String(index + 1).padStart(2, '0')}</span><div><small>${esc(item.category)}</small><p>${esc(item.evidence)}</p></div></article>`).join('')}
      </div>
      ${captain
        ? `<form id="finaleForm" class="accusation-panel">
            ${fields(true)}
            <button class="primary-action lock-answer" type="submit">Submit the final outcome <span>↗</span></button>
          </form>`
        : `<section class="accusation-panel spectator-panel">
            <span class="stage-kicker">HELP YOUR FINAL CAPTAIN</span><h2>${esc(captainName)} will submit the outcome.</h2><p>Use the evidence trail to agree on all three findings before they are locked.</p>
            ${fields(false)}
          </section>`}
    </section>`;
  }

  function caseLabel(part, id) {
    return part.options.find((option) => option.id === id)?.label || 'No answer';
  }

  function resultMarkup() {
    const caseFile = caseById(state.game.caseId);
    const rank = gameRank(state.game);
    const correct = state.game.history.filter((round) => round.answerCorrect).length;
    const result = state.game.finalResult;
    const verdicts = caseFile.finale.parts.map((part) => `<article class="${result.correct[part.id] ? 'correct' : 'incorrect'}">
      <small>${esc(part.label.toUpperCase())}</small><span>Your conclusion</span>
      <b>${esc(caseLabel(part, result.guess[part.id]))}</b>
      <em>Evidence: ${esc(caseLabel(part, part.answer))}</em>
    </article>`).join('');
    return `<section class="final-stage">
      <div class="rank-seal"><span>CREW GRADE</span><b>${rank.grade}</b></div>
      <span class="stage-kicker">${esc(caseFile.categoryName.toUpperCase())} · ${esc(caseFile.title.toUpperCase())}</span>
      <h1>${rank.title}</h1>
      <p>${rank.detail}</p>
      <div class="final-stats">
        <span><b>${state.game.score}</b> points</span>
        <span><b>${correct}/${state.game.history.length}</b> deductions</span>
        <span><b>${result.solvedParts}/${caseFile.finale.parts.length}</b> final findings</span>
      </div>
      <div class="verdict-grid">${verdicts}</div>
      <section class="reconstruction"><span class="stage-kicker">THE COMPLETE OUTCOME</span>${caseFile.reconstruction.map((step, index) => `<p><b>${index + 1}</b>${esc(step)}</p>`).join('')}</section>
      ${isHost ? '<button id="resetBtn" class="primary-action">Choose another case <span>↗</span></button>' : '<div class="waiting-line"><i></i> Waiting for the host</div>'}
    </section>`;
  }

  function updateClock() {
    const clock = $('#clueClock');
    if (!clock || state?.game?.phase !== 'clue') return;
    const remaining = Math.max(0, state.game.current.duration - (Date.now() - state.game.current.startedAt));
    clock.textContent = `0:${String(Math.ceil(remaining / 1000)).padStart(2, '0')}`;
    clock.classList.toggle('urgent', remaining <= 10_000);
    if (isHost && remaining <= 0) {
      revealClue(state.game);
      sendState();
    }
  }

  function bindAnswerForm() {
    const form = $('#answerForm');
    if (!form) return;
    let selectedAnswer = null;
    form.querySelectorAll('[data-answer]').forEach((button) => button.addEventListener('click', (event) => {
      event.preventDefault();
      selectedAnswer = Number(button.dataset.answer);
      form.querySelectorAll('[data-answer]').forEach((item) => item.classList.toggle('selected', item === button));
    }));
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (selectedAnswer === null) {
        toast('Choose the crew’s answer first.');
        return;
      }
      sendAction('answer', { answer: selectedAnswer });
    });
  }

  function bindFinaleForm() {
    const form = $('#finaleForm');
    if (!form) return;
    const parts = caseById(state.game.caseId).finale.parts;
    const guess = Object.fromEntries(parts.map((part) => [part.id, null]));
    form.querySelectorAll('[data-final-kind]').forEach((button) => button.addEventListener('click', (event) => {
      event.preventDefault();
      const kind = button.dataset.finalKind;
      guess[kind] = button.dataset.finalId;
      form.querySelectorAll(`[data-final-kind="${kind}"]`).forEach((item) => item.classList.toggle('selected', item === button));
    }));
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (parts.some((part) => !guess[part.id])) {
        toast('Complete all three final findings.');
        return;
      }
      sendAction('accuse', guess);
    });
  }

  function render() {
    if (!state) return;
    clearInterval(clockTimer);
    const players = connectedPlayers(state);
    let content;
    if (!state.game && state.selection) content = selectionMarkup(players);
    else if (!state.game) content = lobbyMarkup(players);
    else if (state.game.phase === 'board') content = boardMarkup(players);
    else if (state.game.phase === 'clue') content = clueMarkup(players);
    else if (state.game.phase === 'reveal') content = revealMarkup(players);
    else if (state.game.phase === 'finale') content = finaleMarkup();
    else content = resultMarkup();

    const score = state.game?.score || 0;
    const round = state.game ? Math.min(state.game.roundNumber + (state.game.phase === 'reveal' ? 0 : 1), state.game.maxRounds) : 0;
    gameRoot.innerHTML = `<main class="game-shell">
      <header class="game-header">
        <a class="mini-brand" href="/" aria-label="Contact Protocol home"><i>✳</i><span>CONTACT<br/>PROTOCOL</span></a>
        <div class="room-tools"><span>ROOM</span><b>${esc(room || state.room)}</b><button id="copyCode" type="button">COPY ↗</button></div>
        <div class="game-metrics">
          <span><small>${state.selection && !state.game ? 'SELECTION' : 'ROUND'}</small><b>${state.game ? `${round}/${state.game.maxRounds}` : state.selection ? 'VOTE' : 'LOBBY'}</b></span>
          <span><small>CREW SCORE</small><b>${score.toLocaleString()}</b></span>
          <button id="fullscreenBtn" class="fullscreen-button" aria-label="Toggle fullscreen">⛶</button>
        </div>
      </header>
      <section class="crew-ribbon">${crewMarkup(players)}</section>
      <div class="game-content">${content}</div>
    </main>`;

    $('#copyCode')?.addEventListener('click', copyRoom);
    $('#startBtn')?.addEventListener('click', startGame);
    $('#resetBtn')?.addEventListener('click', resetGame);
    $('#advanceBtn')?.addEventListener('click', () => sendAction('advance'));
    document.querySelectorAll('[data-selection-vote]').forEach((button) => button.addEventListener('click', () => sendAction('vote-selection', button.dataset.selectionVote)));
    document.querySelectorAll('[data-clue]').forEach((button) => button.addEventListener('click', () => sendAction('select', button.dataset.clue)));
    $('#fullscreenBtn')?.addEventListener('click', async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await document.documentElement.requestFullscreen();
      } catch {
        toast('Fullscreen is unavailable here.');
      }
    });
    bindAnswerForm();
    bindFinaleForm();
    if (state.game?.phase === 'clue') {
      updateClock();
      clockTimer = setInterval(updateClock, 250);
    }
  }

  $('#hostBtn').addEventListener('click', hostRoom);
  $('#showJoinBtn').addEventListener('click', () => {
    $('#joinFields').classList.toggle('hidden');
    if (!$('#joinFields').classList.contains('hidden')) $('#roomCode').focus();
  });
  $('#joinBtn').addEventListener('click', joinRoom);
  $('#roomCode').addEventListener('input', (event) => {
    event.target.value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  });
  $('#roomCode').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') joinRoom();
  });
})();

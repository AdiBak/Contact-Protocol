import { CATEGORIES } from './content/clues.js';
import {
  answerClue,
  advanceRound,
  connectedPlayers,
  createGame,
  gameRank,
  revealClue,
  selectClue,
  stateForPlayer
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
    state.players.forEach((player) => { player.ready = false; });
    state.game = createGame(players);
    sendState();
  }

  function resetGame() {
    if (!isHost) return;
    state.game = null;
    sendState();
  }

  function handleAction(playerId, action, value) {
    if (!isHost || !state) return;
    const players = connectedPlayers(state);
    if (!players.some((player) => player.id === playerId)) return;

    if (action === 'select' && state.game?.captainId === playerId) {
      if (selectClue(state.game, value, players)) sendState();
    } else if (action === 'answer' && state.game?.phase === 'clue') {
      if (answerClue(state.game, playerId, value?.answer)) sendState();
    } else if (action === 'advance' && state.game?.phase === 'reveal' && state.game.captainId === playerId) {
      advanceRound(state.game, players);
      sendState();
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
      if (state.game?.phase === 'board' && player.id === state.game.captainId) status = 'CHOOSING';
      if (state.game?.phase === 'clue') status = player.id === state.game.captainId ? 'DECIDING' : 'SHARING';
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
        <span class="stage-kicker">SPLIT-CLUE GAME SHOW</span>
        <h1>No one gets<br/>the whole clue.</h1>
        <p>Choose a category, compare the evidence sent to each screen, and help the rotating Captain lock the crew’s answer before time runs out.</p>
        <div class="rule-row">
          <span><b>01</b> Share your fragment</span>
          <span><b>02</b> Talk it through</span>
          <span><b>03</b> Captain answers</span>
        </div>
        ${isHost
          ? `<button id="startBtn" class="primary-action" ${players.length < 2 ? 'disabled' : ''}>Start the signal board <span>↗</span></button>`
          : '<div class="waiting-line"><i></i> Waiting for the host to start</div>'}
        <small class="player-requirement">${players.length}/8 players connected · 2 required</small>
      </div>
    </section>`;
  }

  function boardMarkup(players) {
    const captain = playerName(state.game.captainId);
    const canChoose = state.game.captainId === myId;
    const columns = CATEGORIES.map((category) => {
      const cells = category.clues.map((clue, index) => {
        const key = `${category.id}:${index}`;
        const used = state.game.used.includes(key);
        return `<button class="board-cell ${used ? 'used' : ''}" data-clue="${key}" ${used || !canChoose ? 'disabled' : ''}>
          ${used ? '<span>TRANSMITTED</span>' : `<b>${clue.value}</b><span>PTS</span>`}
        </button>`;
      }).join('');
      return `<div class="board-column">
        <div class="category-head"><i>${category.icon}</i><b>${category.name}</b><span>${category.description}</span></div>
        ${cells}
      </div>`;
    }).join('');
    return `<section class="board-stage">
      <div class="stage-heading">
        <div><span class="stage-kicker">THE SIGNAL BOARD</span><h1>Choose your transmission.</h1></div>
        <div class="captain-callout"><span>ROUND CAPTAIN</span><b>${esc(captain)}</b><small>${canChoose ? 'Your pick' : 'is choosing'}</small></div>
      </div>
      <div class="category-board">${columns}</div>
      <p class="board-note">Eight transmissions complete a game. Harder clues are worth more—but wrong answers cost points.</p>
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
        <div><span>${current.icon} ${esc(current.category)}</span><b>${current.value * (current.anomaly ? 2 : 1)} PTS${current.anomaly ? ' · ANOMALY ×2' : ''}</b></div>
        <time id="clueClock">0:45</time>
      </header>
      <div class="clue-question">
        <span>CREW QUESTION</span>
        <h1>${esc(current.prompt)}</h1>
        <div class="clue-display">${esc(current.display)}</div>
      </div>
      <div class="evidence-grid">
        <article class="private-fragment">
          <span>ONLY ON YOUR SCREEN</span>
          <h2>Your fragment</h2>
          <p>${esc(assignment?.text || 'Fragment unavailable.')}</p>
          <small>Read this aloud. Every fragment contains useful, trustworthy evidence.</small>
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
        <span>TRANSMISSION RESOLVED</span>
        <b>${result.points >= 0 ? '+' : ''}${result.points}</b>
        <small>CREW POINTS</small>
      </div>
      <div class="reveal-copy">
        <span class="stage-kicker">${esc(current.category)} · ${current.value} PTS</span>
        <h1>${result.answerCorrect ? 'Signal understood.' : 'The signal slipped through.'}</h1>
        <p class="correct-answer">Correct answer: <b>${esc(current.options[current.correctOption])}</b></p>
        <p>${esc(current.explanation)}</p>
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
          ? '<button id="advanceBtn" class="primary-action">Return to the board <span>↗</span></button>'
          : `<span class="waiting-line"><i></i> Waiting for ${esc(playerName(state.game.captainId))}</span>`}
      </div>
    </section>`;
  }

  function resultMarkup() {
    const rank = gameRank(state.game);
    const correct = state.game.history.filter((round) => round.answerCorrect).length;
    return `<section class="final-stage">
      <div class="rank-seal"><span>CREW RANK</span><b>${rank.grade}</b></div>
      <span class="stage-kicker">FINAL TRANSMISSION COMPLETE</span>
      <h1>${rank.title}</h1>
      <p>${rank.detail}</p>
      <div class="final-stats">
        <span><b>${state.game.score}</b> points</span>
        <span><b>${correct}/${state.game.history.length}</b> signals solved</span>
        <span><b>${state.game.history.length}</b> transmissions</span>
      </div>
      ${isHost ? '<button id="resetBtn" class="primary-action">Play another board <span>↗</span></button>' : '<div class="waiting-line"><i></i> Waiting for the host</div>'}
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

  function render() {
    if (!state) return;
    clearInterval(clockTimer);
    const players = connectedPlayers(state);
    let content;
    if (!state.game) content = lobbyMarkup(players);
    else if (state.game.phase === 'board') content = boardMarkup(players);
    else if (state.game.phase === 'clue') content = clueMarkup(players);
    else if (state.game.phase === 'reveal') content = revealMarkup(players);
    else content = resultMarkup();

    const score = state.game?.score || 0;
    const round = state.game ? Math.min(state.game.roundNumber + (state.game.phase === 'reveal' ? 0 : 1), state.game.maxRounds) : 0;
    gameRoot.innerHTML = `<main class="game-shell">
      <header class="game-header">
        <a class="mini-brand" href="/" aria-label="Contact Protocol home"><i>✳</i><span>CONTACT<br/>PROTOCOL</span></a>
        <div class="room-tools"><span>ROOM</span><b>${esc(room || state.room)}</b><button id="copyCode" type="button">COPY ↗</button></div>
        <div class="game-metrics">
          <span><small>ROUND</small><b>${state.game ? `${round}/${state.game.maxRounds}` : 'LOBBY'}</b></span>
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

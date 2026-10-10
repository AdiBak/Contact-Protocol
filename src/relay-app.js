import { buildSignalOrder, signalForRound, signals } from './content/signals.js';
import { activePlayers, allSubmitted, fragmentForPlayer, publicRelayState, relayOutcome, resolveSignal, resolveStations } from './game/relay-rules.js';
import { sceneMarkup } from './game/scene.js';
import { esc } from './game/text.js';

(() => {
  const $ = (selector) => document.querySelector(selector);
  const home = $('#homeView');
  const game = $('#gameView');
  const toastEl = $('#toast');
  let peer = null;
  let host = false;
  let myId = null;
  let conn = null;
  let room = '';
  let state = null;
  let localPhase = '';
  let localStationChoice = null;
  let localResponse = null;
  let busy = false;

  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toastEl.classList.remove('show'), 2600);
  }

  function playerName() {
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
    $('#hostBtn').disabled = value;
    $('#showJoinBtn').disabled = value;
    $('#joinBtn').disabled = value;
  }

  function showGame() {
    home.classList.add('hidden');
    game.classList.remove('hidden');
    document.body.classList.add('mission-mode', 'relay-mode');
    render();
  }

  function newRoom() {
    return Array.from(crypto.getRandomValues(new Uint8Array(6)), (byte) => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[byte % 32]).join('');
  }

  function resetPlayers() {
    state.players.forEach((player) => {
      player.stationChoice = null;
      player.answer = null;
    });
    state.relayResults = [];
    state.lastResult = null;
    state.lastEvent = null;
  }

  function broadcast() {
    if (!host || !state) return;
    const snapshot = publicRelayState(state);
    Object.values(state.connections).forEach((connection) => {
      if (connection?.open) connection.send({ type: 'state', state: snapshot });
    });
    render();
  }

  function advanceIfReady() {
    if (state.phase === 'relay' && allSubmitted(state, 'stationChoice')) {
      resolveStations(state, signals);
      const signal = signalForRound(state, signals);
      state.players.forEach((player) => { player.answer = null; });
      state.phase = 'decode';
      state.lastEvent = {
        kind: 'scan',
        label: 'RELAY FRAGMENTS ASSEMBLED',
        scans: state.relayResults.map((result) => ({ name: `${result.role} · ${result.playerName}`, evidence: result.correct ? result.token : 'Static obscured this fragment.' })),
        startedAt: Date.now(),
        id: `${state.round}-${Date.now()}`
      };
      return;
    }
    if (state.phase === 'decode' && allSubmitted(state, 'answer')) {
      resolveSignal(state, signals);
      const signal = signalForRound(state, signals);
      state.phase = 'reveal';
      state.lastEvent = {
        kind: 'finding',
        conclusion: state.lastResult.crewAnswer === null ? 'No majority response' : signal.responses[state.lastResult.crewAnswer],
        correct: state.lastResult.crewWon,
        evidence: state.relayResults.map((result) => ({ name: result.role, evidence: result.token })),
        startedAt: Date.now(),
        id: `${state.round}-${Date.now()}`
      };
    }
  }

  function hostAction(playerId, action, value) {
    if (!host || !state) return;
    const player = state.players.find((candidate) => candidate.id === playerId && candidate.connected);
    if (!player) return;
    const signal = signalForRound(state, signals);

    if (action === 'station' && state.phase === 'relay') {
      const fragment = fragmentForPlayer(state, playerId, signals);
      if (Number.isInteger(value) && value >= 0 && value < fragment.options.length) player.stationChoice = value;
    }
    if (action === 'response' && state.phase === 'decode' && Number.isInteger(value) && value >= 0 && value < signal.responses.length) {
      player.answer = value;
    }
    advanceIfReady();
    broadcast();
  }

  function sendAction(action, value) {
    if (host) hostAction(myId, action, value);
    else if (conn?.open) conn.send({ type: 'action', playerId: myId, action, value });
    else toast('Connection lost. Rejoin the room to continue.');
  }

  function startRelay() {
    if (!host) return;
    if (activePlayers(state).length < 2) {
      toast('Invite at least one more relay operator.');
      return;
    }
    state.round = 0;
    state.teamScore = 0;
    state.maxScore = 0;
    state.journeyLog = [];
    state.signalOrder = buildSignalOrder(signals.length);
    resetPlayers();
    state.phase = 'relay';
    broadcast();
  }

  function nextSignal() {
    if (!host) return;
    if (state.round >= signals.length - 1) {
      state.phase = 'finished';
      state.lastEvent = null;
    } else {
      state.round += 1;
      resetPlayers();
      state.phase = 'relay';
    }
    broadcast();
  }

  function restartRelay() {
    if (!host) return;
    state.phase = 'lobby';
    state.round = 0;
    state.teamScore = 0;
    state.maxScore = 0;
    state.journeyLog = [];
    state.signalOrder = null;
    resetPlayers();
    broadcast();
  }

  function bindConnection(connection) {
    state.connections[connection.peer] = connection;
    connection.on('data', (message) => {
      if (message?.type === 'join' && host) {
        if (state.phase !== 'lobby') {
          connection.send({ type: 'rejected', reason: 'This relay is already in progress.' });
          return;
        }
        const existing = state.players.find((player) => player.id === message.playerId);
        if (existing) {
          existing.connected = true;
          existing.name = String(message.name || 'Operator').slice(0, 18);
          existing.peerId = connection.peer;
        } else if (state.players.length < 8) {
          state.players.push({ id: message.playerId, peerId: connection.peer, name: String(message.name || 'Operator').slice(0, 18), host: false, connected: true, stationChoice: null, answer: null });
        } else {
          connection.send({ type: 'rejected', reason: 'This relay crew is full.' });
          return;
        }
        connection.send({ type: 'welcome', myId: message.playerId });
        broadcast();
      } else if (message?.type === 'action' && host) {
        hostAction(message.playerId, message.action, message.value);
      }
    });
    connection.on('close', () => {
      delete state.connections[connection.peer];
      if (!host) return;
      const player = state.players.find((candidate) => candidate.peerId === connection.peer);
      if (player) {
        player.connected = false;
        advanceIfReady();
        broadcast();
      }
    });
    connection.on('error', () => toast('A relay connection dropped.'));
  }

  function hostRoom() {
    const name = playerName();
    if (!name) return;
    if (!window.Peer) {
      toast('The connection service did not load. Refresh and try again.');
      return;
    }
    setBusy(true);
    host = true;
    room = newRoom();
    peer = new Peer(`cp-${room.toLowerCase()}`);
    peer.on('open', (id) => {
      myId = `host-${id}`;
      state = {
        room,
        phase: 'lobby',
        round: 0,
        teamScore: 0,
        maxScore: 0,
        journeyLog: [],
        signalOrder: null,
        players: [{ id: myId, peerId: id, name, host: true, connected: true, stationChoice: null, answer: null }],
        connections: {},
        relayResults: [],
        lastResult: null,
        lastEvent: null
      };
      peer.on('connection', bindConnection);
      setBusy(false);
      showGame();
    });
    peer.on('error', (error) => {
      setBusy(false);
      if (error.type === 'unavailable-id') {
        peer.destroy();
        host = false;
        hostRoom();
      } else toast(`Could not open a room: ${error.type}`);
    });
  }

  function joinRoom() {
    const name = playerName();
    if (!name) return;
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
    host = false;
    peer = new Peer();
    peer.on('open', (id) => {
      myId = sessionStorage.getItem(`cp-player-${room}`) || `p-${id}`;
      sessionStorage.setItem(`cp-player-${room}`, myId);
      conn = peer.connect(`cp-${room.toLowerCase()}`, { reliable: true });
      conn.on('open', () => conn.send({ type: 'join', playerId: myId, name }));
      conn.on('data', (message) => {
        if (message?.type === 'state') {
          state = message.state;
          state.connections = {};
          setBusy(false);
          showGame();
        } else if (message?.type === 'welcome') {
          myId = message.myId;
        } else if (message?.type === 'rejected') {
          setBusy(false);
          toast(message.reason);
          conn.close();
          peer.destroy();
        }
      });
      conn.on('error', () => {
        setBusy(false);
        toast('Could not reach that relay. Check the code and try again.');
      });
      conn.on('close', () => toast('Host connection ended.'));
    });
    peer.on('error', (error) => {
      setBusy(false);
      toast(error.type === 'peer-unavailable' ? 'Relay not found. Check the code and try again.' : `Connection error: ${error.type}`);
    });
  }

  function copyRoom() {
    navigator.clipboard?.writeText(room).then(() => toast('Room code copied.')).catch(() => toast(`Room code: ${room}`));
  }

  function playerLocked(player, phase) {
    if (!player) return false;
    if (phase === 'relay') return host ? player.stationChoice !== null : player.stationLocked;
    if (phase === 'decode') return host ? player.answer !== null : player.responseLocked;
    return false;
  }

  function crewStrip(players, phase) {
    return players.map((player) => {
      const status = phase === 'relay' ? (playerLocked(player, phase) ? 'TRANSMITTED' : 'DECODING') : phase === 'decode' ? (playerLocked(player, phase) ? 'LOCKED' : 'DISCUSSING') : '';
      return `<div class="player-row"><span class="avatar">${esc((player.name || '?').slice(0, 1).toUpperCase())}</span><span class="player-identity"><span class="player-name">${esc(player.name)}${player.id === myId ? ' (you)' : ''}</span>${player.host ? '<span class="host-tag">HOST</span>' : ''}</span>${status ? `<span class="player-state">${status}</span>` : ''}</div>`;
    }).join('');
  }

  function relayRoute(log = state?.journeyLog || [], final = false) {
    return `<div class="relay-route">${signals.map((_, index) => {
      const signal = signalForRound({ ...state, round: index }, signals);
      const entry = log[index];
      const current = !final && state?.round === index && !['lobby', 'finished'].includes(state?.phase);
      return `<div class="relay-stop ${entry ? (entry.correct ? 'complete' : 'uncertain') : ''} ${current ? 'current' : ''}"><i>${entry ? (entry.correct ? '✓' : '·') : index + 1}</i><span>${esc(signal.title)}</span></div>`;
    }).join('')}</div>`;
  }

  function renderLobby() {
    return `<section class="relay-lobby"><div class="card-kicker">COOPERATIVE SIGNAL ROOM</div><h1>Alien Signal Relay</h1><p>Every operator receives a different fragment. Solve your console, describe what you found, and decide together how humanity should answer.</p>${relayRoute()}<div class="relay-loop"><span>01 · SOLVE YOUR STATION</span><b>→</b><span>02 · SHARE THE FRAGMENTS</span><b>→</b><span>03 · CHOOSE A RESPONSE</span></div>${host ? '<button id="startBtn" class="btn btn-primary">Open the channel ↗</button>' : '<span class="hint waiting-dots">Waiting for the host</span>'}</section>`;
  }

  function renderRelay(signal, me, players) {
    const fragment = fragmentForPlayer(state, myId, signals);
    const locked = playerLocked(me, 'relay');
    const submitted = players.filter((player) => playerLocked(player, 'relay')).length;
    return `${sceneMarkup(signal, [], null, null, false)}
      <section class="relay-brief"><span>SIGNAL ${state.round + 1} OF ${signals.length} · ${esc(signal.tag)}</span><h1>${esc(signal.title)}</h1><p>${esc(signal.brief)}</p></section>
      <section class="station-console" style="--station-color:${signal.theme.color}">
        <div class="station-head"><span>${esc(fragment.icon)} ${esc(fragment.role)} STATION</span><b>PRIVATE CONSOLE</b></div>
        <div class="signal-display">${esc(fragment.display)}</div>
        <h2>${esc(fragment.prompt)}</h2>
        <div class="station-options">${fragment.options.map((option, index) => `<button type="button" data-station="${index}" class="${localStationChoice === index ? 'selected' : ''}" ${locked ? 'disabled' : ''}><i>${String.fromCharCode(65 + index)}</i>${esc(option)}</button>`).join('')}</div>
        <div class="station-submit"><button id="lockStation" class="btn btn-primary" ${localStationChoice === null || locked ? 'disabled' : ''}>${locked ? 'Fragment transmitted ✓' : 'Transmit fragment'}</button><span>${submitted}/${players.length} stations ready</span></div>
      </section>
      <section class="relay-crew-status"><b>RELAY STATUS</b>${players.map((player) => `<span class="${playerLocked(player, 'relay') ? 'ready' : ''}"><i></i>${esc(player.name)} · ${playerLocked(player, 'relay') ? 'TRANSMITTED' : 'DECODING'}</span>`).join('')}</section>`;
  }

  function renderDecode(signal, me, players) {
    const locked = playerLocked(me, 'decode');
    const submitted = players.filter((player) => playerLocked(player, 'decode')).length;
    const tokens = (state.relayResults || []).map((result) => `<div class="relay-token ${result.correct ? 'clear' : 'static'}"><span>${esc(result.icon)}</span><div><small>${esc(result.playerName)} · ${esc(result.role)}</small><strong>${esc(result.token)}</strong></div></div>`).join('');
    return `${sceneMarkup(signal, [], null, state.lastEvent, false)}
      <section class="relay-brief compact"><span>ASSEMBLED TRANSMISSION · ${esc(signal.tag)}</span><h1>Share what your station revealed.</h1><p>No operator received the whole message. Read the recovered fragments aloud before choosing a response.</p></section>
      <section class="token-board"><div class="station-head"><span>RECOVERED FRAGMENTS</span><b>${state.relayResults.filter((result) => result.correct).length}/${state.relayResults.length} CLEAR</b></div><div>${tokens}</div></section>
      <section class="response-console">
        <span class="response-kicker">CREW DECISION</span><h2>${esc(signal.question)}</h2>
        <div class="response-options">${signal.responses.map((response, index) => `<button type="button" data-response="${index}" class="${localResponse === index ? 'selected' : ''}" ${locked ? 'disabled' : ''}><i>${['◉', '◇', '△'][index]}</i><span>${esc(response)}</span></button>`).join('')}</div>
        <div class="station-submit"><button id="lockResponse" class="btn btn-primary" ${localResponse === null || locked ? 'disabled' : ''}>${locked ? 'Response locked ✓' : 'Lock crew response'}</button><span>${submitted}/${players.length} responses locked</span></div>
      </section>`;
  }

  function renderReveal(signal) {
    const result = state.lastResult;
    const crewResponse = result.crewAnswer === null ? 'No majority response' : signal.responses[result.crewAnswer];
    return `${sceneMarkup(signal, [], null, null, false)}
      <section class="contact-result ${result.crewWon ? 'success' : 'uncertain'}">
        <span class="response-kicker">${result.crewWon ? 'CONTACT STABLE' : 'CONTACT UNCERTAIN'}</span>
        <h1>${result.crewWon ? 'The signal answers.' : 'The signal begins to fade.'}</h1>
        <p><strong>Crew response:</strong> ${esc(crewResponse)}</p>
        <p>${esc(signal.explanation)}</p>
        <div class="relay-score"><span><b>${result.stationPoints}/${result.total}</b> fragments recovered</span><span><b>+${result.responsePoints}</b> response points</span><span><b>${result.roundPoints}/${result.roundMax}</b> signal score</span></div>
        ${host ? `<button id="nextBtn" class="btn btn-primary">${state.round === signals.length - 1 ? 'View contact log ↗' : 'Open next signal ↗'}</button>` : '<span class="hint waiting-dots">Waiting for the host</span>'}
      </section>`;
  }

  function renderFinished() {
    const outcome = relayOutcome(state.teamScore, state.maxScore);
    const percent = state.maxScore ? Math.round(state.teamScore / state.maxScore * 100) : 0;
    const rows = state.journeyLog.map((entry, index) => `<div class="contact-log-row"><i>${String(index + 1).padStart(2, '0')}</i><div><strong>${esc(entry.title)}</strong><span>${esc(entry.conclusion)} · ${entry.stations}/${entry.stationTotal} fragments</span></div><b>${entry.points}/${entry.maxPoints}</b></div>`).join('');
    return `<section class="relay-finished"><span class="response-kicker">CONTACT LOG COMPLETE</span><h1>${esc(outcome.title)}</h1><p>${esc(outcome.detail)}</p><div class="final-signal-score"><strong>${percent}%</strong><span>SIGNAL INTEGRITY</span></div>${relayRoute(state.journeyLog, true)}<div class="contact-log">${rows}</div><div class="finish-actions">${host ? '<button id="restartBtn" class="btn btn-primary">Open a new channel ↗</button>' : ''}<button id="leaveBtn" class="btn btn-quiet">Leave relay</button></div></section>`;
  }

  function render() {
    if (!state) return;
    const phaseKey = `${state.round}:${state.phase}`;
    if (phaseKey !== localPhase) {
      localPhase = phaseKey;
      localStationChoice = null;
      localResponse = null;
    }

    const players = activePlayers(state);
    const me = state.players.find((player) => player.id === myId);
    const signal = signalForRound(state, signals);
    const phaseLabels = { lobby: 'CREW ASSEMBLY', relay: 'PRIVATE RELAY', decode: 'CREW DECODE', reveal: 'CONTACT RESULT', finished: 'RELAY COMPLETE' };
    const progress = state.phase === 'lobby' ? 0 : state.phase === 'finished' ? 100 : ((state.round + (state.phase === 'reveal' ? 1 : 0)) / signals.length) * 100;
    let content = '';
    if (state.phase === 'lobby') content = renderLobby();
    else if (state.phase === 'relay') content = renderRelay(signal, me, players);
    else if (state.phase === 'decode') content = renderDecode(signal, me, players);
    else if (state.phase === 'reveal') content = renderReveal(signal);
    else content = renderFinished();

    const roomTools = state.phase === 'lobby' ? `<span class="room-invite">Invite 1–7 friends with the room code.</span>${host ? '<button id="copyCode" class="copy-code">COPY ROOM CODE ↗</button>' : ''}` : '';
    game.innerHTML = `<div class="game-layout"><main class="game-main relay-game ${players.length <= 4 ? 'crew-compact' : 'crew-expanded'}"><div class="room-head"><div class="room-identity"><span class="room-eyebrow">RELAY ROOM</span><span class="room-id">${esc(room || state.room)}</span>${roomTools}</div><div class="room-head-tools"><div class="round-meta"><span class="phase-pill">${phaseLabels[state.phase]}</span><br/>${state.phase === 'lobby' ? 'CHANNEL CLOSED' : state.phase === 'finished' ? 'LOG SEALED' : `SIGNAL ${String(state.round + 1).padStart(2, '0')} OF ${String(signals.length).padStart(2, '0')}`}</div><button type="button" id="fullscreenBtn" class="fullscreen-toggle" aria-label="Toggle fullscreen" title="Toggle fullscreen">⛶</button></div></div><div class="crew-bar"><div class="crew-roster"><span class="crew-label">CREW ${players.length}/8</span>${crewStrip(players, state.phase)}</div><div class="crew-metrics"><span class="crew-score">SIGNAL LINK · ${state.teamScore}/${state.maxScore || '—'}</span><i class="crew-progress"><b style="width:${progress}%"></b></i></div></div><div class="phase-content relay-phase phase-${state.phase}">${content}</div></main></div>`;

    $('#startBtn')?.addEventListener('click', startRelay);
    $('#copyCode')?.addEventListener('click', copyRoom);
    $('#nextBtn')?.addEventListener('click', nextSignal);
    $('#restartBtn')?.addEventListener('click', restartRelay);
    $('#leaveBtn')?.addEventListener('click', () => { peer?.destroy(); location.reload(); });
    $('#fullscreenBtn')?.addEventListener('click', async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await document.documentElement.requestFullscreen();
      } catch { toast('Fullscreen is unavailable in this browser.'); }
    });
    game.querySelectorAll('[data-station]').forEach((button) => button.addEventListener('click', () => {
      if (!playerLocked(me, 'relay')) {
        localStationChoice = Number(button.dataset.station);
        render();
      }
    }));
    $('#lockStation')?.addEventListener('click', () => {
      if (localStationChoice !== null && !playerLocked(me, 'relay')) sendAction('station', localStationChoice);
    });
    game.querySelectorAll('[data-response]').forEach((button) => button.addEventListener('click', () => {
      if (!playerLocked(me, 'decode')) {
        localResponse = Number(button.dataset.response);
        render();
      }
    }));
    $('#lockResponse')?.addEventListener('click', () => {
      if (localResponse !== null && !playerLocked(me, 'decode')) sendAction('response', localResponse);
    });

    const sceneRoot = game.querySelector('[data-scene-root]');
    if (sceneRoot) {
      import('./game/scene3d.js').then(({ prepareScene }) => prepareScene(sceneRoot, signal, state.lastEvent)).catch((error) => {
        console.warn('3D relay scene could not initialize:', error);
        if (!sceneRoot.isConnected) return;
        sceneRoot.classList.add('scene-fallback');
        sceneRoot.querySelector('.scene-canvas')?.remove();
        sceneRoot.querySelector('[data-scene-loader]')?.classList.add('ready');
      });
    }
  }

  $('#hostBtn').addEventListener('click', hostRoom);
  $('#showJoinBtn').addEventListener('click', () => {
    $('#joinFields').classList.toggle('hidden');
    if (!$('#joinFields').classList.contains('hidden')) $('#roomCode').focus();
  });
  $('#joinBtn').addEventListener('click', joinRoom);
  $('#roomCode').addEventListener('input', (event) => { event.target.value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); });
  $('#roomCode').addEventListener('keydown', (event) => { if (event.key === 'Enter') joinRoom(); });
})();

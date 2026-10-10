import { allAcknowledged, connectedPlayers, createCombat, publicCombatState, roleForIndex, tickCombat } from './game/combat-rules.js';
import { esc } from './game/text.js';

const BRIEFING = [
  'MISSION: BREAK THE BLOCKADE',
  'Your fleet is approaching Kharon, a fortified alien world.',
  'STEER: WASD / ARROWS / TOUCH PAD',
  'FIRE: SPACE / FIRE CONTROL — weapons lock onto the nearest threat.',
  'ABILITY: E / ROLE CONTROL — each ship carries one fleet-support system.',
  'Stay in formation. Disable the planetary batteries and interceptors.',
  'Acknowledge this briefing to release manual flight control.'
].join('\n\n');

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
  let busy = false;
  let combatView = null;
  let hostLoop = null;
  let broadcastCounter = 0;
  let typingTimer = null;
  let briefingRevealed = false;
  const keys = new Set();
  const input = { x: 0, y: 0, fire: false, ability: false };

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
    document.body.classList.add('mission-mode', 'combat-mode');
    render();
  }

  function newRoom() {
    return Array.from(crypto.getRandomValues(new Uint8Array(6)), (byte) => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[byte % 32]).join('');
  }

  function snapshot() {
    return publicCombatState(state);
  }

  function sendSnapshot(renderHost = true) {
    if (!host || !state) return;
    const safe = snapshot();
    Object.values(state.connections).forEach((connection) => {
      if (connection?.open) connection.send({ type: 'state', state: safe });
    });
    if (renderHost) render();
    else {
      combatView?.update(state);
      updateCombatHud();
    }
  }

  function applyRemoteState(nextState) {
    const sameLiveCombat = state?.phase === 'combat' && nextState.phase === 'combat' && combatView;
    state = nextState;
    state.connections = {};
    if (sameLiveCombat) {
      combatView.update(state);
      updateCombatHud();
    } else {
      render();
    }
  }

  function resetAcknowledgments() {
    state.players.forEach((player, index) => {
      player.acknowledged = false;
      player.role = roleForIndex(index).name;
    });
  }

  function startBriefing() {
    if (!host) return;
    if (connectedPlayers(state).length < 2) {
      toast('Invite at least one more pilot.');
      return;
    }
    resetAcknowledgments();
    state.phase = 'briefing';
    state.briefingStartedAt = Date.now();
    state.combat = null;
    state.controls = {};
    briefingRevealed = false;
    sendSnapshot();
  }

  function beginCombat() {
    const players = connectedPlayers(state);
    state.combat = createCombat(players);
    state.controls = {};
    players.forEach((player) => { state.controls[player.id] = { x: 0, y: 0, fire: false, ability: false }; });
    state.phase = 'combat';
    sendSnapshot();
  }

  function finishCombat() {
    if (!state.combat || state.phase !== 'combat') return;
    state.phase = 'result';
    state.result = {
      won: state.combat.status === 'won',
      score: state.combat.score,
      elapsed: state.combat.elapsed,
      shipsSurvived: Object.values(state.combat.ships).filter((ship) => ship.hp > 0).length,
      crewSize: connectedPlayers(state).length,
      batteries: state.combat.batteries.filter((battery) => battery.hp <= 0).length,
      fighters: state.combat.enemies.filter((enemy) => enemy.hp <= 0).length,
      fightersTotal: state.combat.enemies.length
    };
    sendSnapshot();
  }

  function restartMission() {
    if (!host) return;
    state.phase = 'lobby';
    state.combat = null;
    state.result = null;
    state.controls = {};
    resetAcknowledgments();
    sendSnapshot();
  }

  function hostAction(playerId, action, value) {
    if (!host || !state) return;
    const player = state.players.find((candidate) => candidate.id === playerId && candidate.connected);
    if (!player) return;
    if (action === 'acknowledge' && state.phase === 'briefing') {
      player.acknowledged = true;
      if (allAcknowledged(state)) beginCombat();
      else sendSnapshot();
    } else if (action === 'input' && state.phase === 'combat' && value && typeof value === 'object') {
      state.controls[playerId] = {
        x: Math.max(-1, Math.min(1, Number(value.x) || 0)),
        y: Math.max(-1, Math.min(1, Number(value.y) || 0)),
        fire: Boolean(value.fire),
        ability: Boolean(value.ability)
      };
    }
  }

  function sendAction(action, value) {
    if (host) hostAction(myId, action, value);
    else if (conn?.open) conn.send({ type: 'action', playerId: myId, action, value });
    else toast('Connection lost. Rejoin the fleet.');
  }

  function startHostLoop() {
    if (hostLoop) return;
    let last = performance.now();
    hostLoop = setInterval(() => {
      if (!host || !state || state.phase !== 'combat' || !state.combat) {
        last = performance.now();
        return;
      }
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      tickCombat(state.combat, connectedPlayers(state), state.controls, dt);
      broadcastCounter += 1;
      if (state.combat.status !== 'active') {
        finishCombat();
      } else if (broadcastCounter % 2 === 0) {
        sendSnapshot(false);
      } else {
        combatView?.update(state);
        updateCombatHud();
      }
    }, 50);
  }

  function bindConnection(connection) {
    state.connections[connection.peer] = connection;
    connection.on('data', (message) => {
      if (message?.type === 'join' && host) {
        if (state.phase !== 'lobby') {
          connection.send({ type: 'rejected', reason: 'The fleet has already launched.' });
          return;
        }
        const existing = state.players.find((player) => player.id === message.playerId);
        if (existing) {
          existing.connected = true;
          existing.name = String(message.name || 'Pilot').slice(0, 18);
          existing.peerId = connection.peer;
        } else if (state.players.length < 8) {
          const index = state.players.length;
          state.players.push({ id: message.playerId, peerId: connection.peer, name: String(message.name || 'Pilot').slice(0, 18), host: false, connected: true, acknowledged: false, role: roleForIndex(index).name });
        } else {
          connection.send({ type: 'rejected', reason: 'This fleet is full.' });
          return;
        }
        connection.send({ type: 'welcome', myId: message.playerId });
        sendSnapshot();
      } else if (message?.type === 'action' && host) {
        hostAction(message.playerId, message.action, message.value);
      }
    });
    connection.on('close', () => {
      delete state.connections[connection.peer];
      if (!host) return;
      const player = state.players.find((candidate) => candidate.peerId === connection.peer);
      if (player) player.connected = false;
      if (state.phase === 'briefing' && allAcknowledged(state)) beginCombat();
      else sendSnapshot();
    });
    connection.on('error', () => toast('A fleet connection dropped.'));
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
        briefingStartedAt: null,
        players: [{ id: myId, peerId: id, name, host: true, connected: true, acknowledged: false, role: roleForIndex(0).name }],
        connections: {},
        controls: {},
        combat: null,
        result: null
      };
      peer.on('connection', bindConnection);
      setBusy(false);
      startHostLoop();
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
          setBusy(false);
          applyRemoteState(message.state);
          if (home && !home.classList.contains('hidden')) showGame();
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
        toast('Could not reach that fleet. Check the code and try again.');
      });
      conn.on('close', () => toast('Host connection ended.'));
    });
    peer.on('error', (error) => {
      setBusy(false);
      toast(error.type === 'peer-unavailable' ? 'Fleet not found. Check the code and try again.' : `Connection error: ${error.type}`);
    });
  }

  function copyRoom() {
    navigator.clipboard?.writeText(room).then(() => toast('Room code copied.')).catch(() => toast(`Room code: ${room}`));
  }

  function combatSceneMarkup() {
    return `<div class="combat-scene" data-combat-scene><canvas aria-label="Shared fleet battle above hostile planet Kharon"></canvas><div class="combat-vignette"></div><div class="cockpit-overlay" aria-hidden="true"><i class="cockpit-strut cockpit-strut-left"></i><i class="cockpit-strut cockpit-strut-right"></i><div class="cockpit-console"><span></span><span></span><span></span><span></span><span></span></div></div></div>`;
  }

  function crewMarkup(players) {
    return players.map((player, index) => {
      const role = roleForIndex(index);
      const ready = state.phase === 'briefing' ? (player.acknowledged ? 'READY' : 'READING') : role.name.toUpperCase();
      return `<div class="player-row"><span class="avatar" style="color:${role.color}">${esc((player.name || '?').slice(0, 1).toUpperCase())}</span><span class="player-identity"><span class="player-name">${esc(player.name)}${player.id === myId ? ' (you)' : ''}</span>${player.host ? '<span class="host-tag">HOST</span>' : ''}</span><span class="player-state">${ready}</span></div>`;
    }).join('');
  }

  function renderLobby(players) {
    return `<section class="combat-lobby"><span class="combat-kicker">COOPERATIVE FLEET MISSION</span><h1>Approach Kharon.</h1><p>Fly your own ship, break a hostile planetary blockade, and keep the formation alive. Every role has one simple fleet-support ability.</p><div class="role-preview">${ROLES_HTML}</div>${host ? '<button id="launchBtn" class="btn btn-primary">Begin approach ↗</button>' : '<span class="hint waiting-dots">Waiting for the fleet commander</span>'}<small>${players.length}/8 pilots connected · 2 or more required</small></section>`;
  }

  const ROLES_HTML = [
    ['⌁', 'Scout', 'Fast boost'],
    ['⬡', 'Guardian', 'Fleet shield'],
    ['✚', 'Engineer', 'Formation repair'],
    ['✦', 'Striker', 'Heavy volley']
  ].map(([icon, name, detail]) => `<div><i>${icon}</i><strong>${name}</strong><span>${detail}</span></div>`).join('');

  function briefingProgress() {
    if (briefingRevealed) return BRIEFING.length;
    return Math.min(BRIEFING.length, Math.floor((Date.now() - state.briefingStartedAt) / 24));
  }

  function renderBriefing(players, me) {
    const ready = Boolean(me?.acknowledged);
    return `${combatSceneMarkup()}<section class="briefing-terminal"><div class="terminal-head"><span>MISSION CONTROL · SECURE CHANNEL</span><b>AUTOPILOT ENGAGED</b></div><pre id="typedBriefing"></pre><div class="briefing-actions"><button id="ackBtn" class="btn btn-primary" ${ready ? 'disabled' : ''}>${ready ? 'Briefing acknowledged ✓' : briefingProgress() >= BRIEFING.length ? 'Acknowledge & take control' : 'Reveal full briefing'}</button><span>${players.filter((player) => player.acknowledged).length}/${players.length} pilots ready</span></div></section><section class="approach-status"><b>KHARON APPROACH</b><span>FORMATION LOCKED</span><i><em></em></i></section>`;
  }

  function renderCombat() {
    return `${combatSceneMarkup()}<div class="combat-alert"><span>⚠</span><b>INCOMING FIRE</b><em>BREAK FORMATION</em></div><section class="objective-hud"><span>MISSION OBJECTIVE</span><b>DISABLE THE PLANETARY DEFENSE GRID</b><i id="missionClock">01:45</i></section><section class="pilot-hud"><div><span id="pilotRole">PILOT</span><b id="pilotHull">HULL 100%</b></div><i><em id="pilotHullBar"></em></i><small id="combatEvent">Incoming fire</small></section><section class="threat-hud"><span>THREAT GRID</span><b id="threatCount">7 TARGETS</b><small id="combatScore">0 PTS</small></section><div class="flight-controls"><div class="flight-stick" id="flightStick"><i id="flightKnob"></i><span>STEER</span></div><div class="combat-buttons"><button id="abilityBtn"><span id="abilityLabel">ABILITY</span><small id="abilityCooldown">READY</small></button><button id="fireBtn" class="fire-control">FIRE</button></div></div>`;
  }

  function renderResult() {
    const result = state.result;
    return `${combatSceneMarkup()}<section class="battle-result ${result.won ? 'victory' : 'defeat'}"><span class="combat-kicker">${result.won ? 'BLOCKADE BROKEN' : 'MISSION ABORTED'}</span><h1>${result.won ? 'The fleet reaches Kharon.' : 'The fleet is forced to withdraw.'}</h1><p>${result.won ? 'The planetary batteries are silent and the surviving interceptors have scattered.' : 'The defense grid held. Your flight data has been preserved for another approach.'}</p><div class="battle-stats"><span><b>${result.score}</b> score</span><span><b>${result.batteries}/3</b> batteries</span><span><b>${result.fighters}/${result.fightersTotal}</b> interceptors</span><span><b>${result.shipsSurvived}/${result.crewSize}</b> ships active</span></div>${host ? '<button id="restartBtn" class="btn btn-primary">Return to fleet room ↗</button>' : '<span class="hint waiting-dots">Waiting for the commander</span>'}</section>`;
  }

  function updateTypedBriefing() {
    const target = $('#typedBriefing');
    if (!target || !state || state.phase !== 'briefing') return;
    const progress = briefingProgress();
    target.textContent = BRIEFING.slice(0, progress);
    const button = $('#ackBtn');
    if (button && !button.disabled) button.textContent = progress >= BRIEFING.length ? 'Acknowledge & take control' : 'Reveal full briefing';
    if (progress >= BRIEFING.length) {
      clearInterval(typingTimer);
      typingTimer = null;
    }
  }

  function updateCombatHud() {
    if (!state?.combat || state.phase !== 'combat') return;
    const players = connectedPlayers(state);
    const index = Math.max(0, players.findIndex((player) => player.id === myId));
    const role = roleForIndex(index);
    const ship = state.combat.ships[myId];
    const threats = [...state.combat.batteries, ...state.combat.enemies].filter((target) => target.hp > 0).length;
    const remaining = Math.max(0, Math.ceil(state.combat.duration - state.combat.elapsed));
    const text = (selector, value) => { const element = $(selector); if (element) element.textContent = value; };
    text('#missionClock', `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`);
    text('#pilotRole', `${role.name.toUpperCase()} · ${role.ability}`);
    text('#pilotHull', ship ? `HULL ${Math.round(ship.hp / ship.maxHp * 100)}%` : 'HULL OFFLINE');
    text('#threatCount', `${threats} TARGET${threats === 1 ? '' : 'S'}`);
    text('#combatScore', `${state.combat.score} PTS`);
    text('#combatEvent', state.combat.lastEvent);
    text('#abilityLabel', role.ability);
    text('#abilityCooldown', ship?.abilityCooldown > 0 ? `${ship.abilityCooldown.toFixed(1)}s` : 'READY');
    const hullBar = $('#pilotHullBar');
    if (hullBar) hullBar.style.width = `${ship ? Math.max(0, ship.hp / ship.maxHp * 100) : 0}%`;
    const abilityButton = $('#abilityBtn');
    if (abilityButton) abilityButton.disabled = !ship || ship.hp <= 0 || ship.abilityCooldown > 0;
  }

  function bindFlightControls() {
    const stick = $('#flightStick');
    const knob = $('#flightKnob');
    if (stick && knob) {
      const move = (event) => {
        const box = stick.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, (event.clientX - (box.left + box.width / 2)) / (box.width * .38)));
        const y = Math.max(-1, Math.min(1, ((box.top + box.height / 2) - event.clientY) / (box.height * .38)));
        input.x = x;
        input.y = y;
        knob.style.transform = `translate(${x * 25}px,${-y * 25}px)`;
      };
      stick.addEventListener('pointerdown', (event) => { stick.setPointerCapture(event.pointerId); move(event); });
      stick.addEventListener('pointermove', (event) => { if (stick.hasPointerCapture(event.pointerId)) move(event); });
      const release = (event) => {
        if (stick.hasPointerCapture(event.pointerId)) stick.releasePointerCapture(event.pointerId);
        input.x = 0;
        input.y = 0;
        knob.style.transform = '';
      };
      stick.addEventListener('pointerup', release);
      stick.addEventListener('pointercancel', release);
    }
    const fire = $('#fireBtn');
    const stopFire = () => { input.fire = false; };
    fire?.addEventListener('pointerdown', (event) => { fire.setPointerCapture(event.pointerId); input.fire = true; });
    fire?.addEventListener('pointerup', stopFire);
    fire?.addEventListener('pointercancel', stopFire);
    $('#abilityBtn')?.addEventListener('click', () => {
      input.ability = true;
      sendAction('input', input);
      input.ability = false;
    });
  }

  function render() {
    if (!state) return;
    combatView?.dispose();
    combatView = null;
    clearInterval(typingTimer);
    typingTimer = null;
    const players = connectedPlayers(state);
    const me = state.players.find((player) => player.id === myId);
    const labels = { lobby: 'FLEET ASSEMBLY', briefing: 'MISSION BRIEFING', combat: 'HOSTILE APPROACH', result: 'MISSION RESULT' };
    let content = '';
    if (state.phase === 'lobby') content = renderLobby(players);
    else if (state.phase === 'briefing') content = renderBriefing(players, me);
    else if (state.phase === 'combat') content = renderCombat();
    else content = renderResult();
    const roomTools = state.phase === 'lobby' ? `<span class="room-invite">Invite 1–7 pilots with the room code.</span>${host ? '<button id="copyCode" class="copy-code">COPY ROOM CODE ↗</button>' : ''}` : '';
    game.innerHTML = `<div class="game-layout"><main class="game-main combat-game ${players.length <= 4 ? 'crew-compact' : 'crew-expanded'}"><div class="room-head"><div class="room-identity"><span class="room-eyebrow">FLEET ROOM</span><span class="room-id">${esc(room || state.room)}</span>${roomTools}</div><div class="room-head-tools"><div class="round-meta"><span class="phase-pill">${labels[state.phase]}</span><br/>${state.phase === 'combat' ? 'MANUAL CONTROL' : state.phase === 'briefing' ? 'AUTOPILOT' : 'KHARON MISSION'}</div><button type="button" id="fullscreenBtn" class="fullscreen-toggle" aria-label="Toggle fullscreen">⛶</button></div></div><div class="crew-bar"><div class="crew-roster"><span class="crew-label">FLEET ${players.length}/8</span>${crewMarkup(players)}</div><div class="crew-metrics"><span class="crew-score">${state.phase === 'combat' ? 'DEFENSE GRID ACTIVE' : 'FORMATION LINKED'}</span><i class="crew-progress"><b style="width:${state.phase === 'result' && state.result?.won ? 100 : state.phase === 'combat' ? Math.min(99, state.combat?.elapsed / state.combat?.duration * 100) : 0}%"></b></i></div></div><div class="phase-content combat-phase phase-${state.phase}">${content}</div></main></div>`;

    $('#launchBtn')?.addEventListener('click', startBriefing);
    $('#copyCode')?.addEventListener('click', copyRoom);
    $('#restartBtn')?.addEventListener('click', restartMission);
    $('#ackBtn')?.addEventListener('click', () => {
      if (briefingProgress() < BRIEFING.length) {
        briefingRevealed = true;
        updateTypedBriefing();
        $('#ackBtn').textContent = 'Acknowledge & take control';
      } else if (!me?.acknowledged) {
        sendAction('acknowledge', true);
      }
    });
    $('#fullscreenBtn')?.addEventListener('click', async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await document.documentElement.requestFullscreen();
      } catch { toast('Fullscreen is unavailable in this browser.'); }
    });

    const sceneRoot = game.querySelector('[data-combat-scene]');
    if (sceneRoot) {
      import('./game/combat3d.js').then(({ prepareCombat }) => {
        if (!sceneRoot.isConnected) return;
        combatView = prepareCombat(sceneRoot, state, myId);
        updateCombatHud();
      }).catch((error) => console.warn('Fleet scene could not initialize:', error));
    }
    if (state.phase === 'briefing') {
      updateTypedBriefing();
      if (briefingProgress() < BRIEFING.length) typingTimer = setInterval(updateTypedBriefing, 40);
    }
    if (state.phase === 'combat') bindFlightControls();
  }

  function updateKeyboardInput() {
    input.x = (keys.has('ArrowRight') || keys.has('KeyD') ? 1 : 0) - (keys.has('ArrowLeft') || keys.has('KeyA') ? 1 : 0);
    input.y = (keys.has('ArrowUp') || keys.has('KeyW') ? 1 : 0) - (keys.has('ArrowDown') || keys.has('KeyS') ? 1 : 0);
    input.fire = keys.has('Space');
  }

  window.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code) && state?.phase === 'combat') event.preventDefault();
    keys.add(event.code);
    if (event.code === 'KeyE' && state?.phase === 'combat') {
      input.ability = true;
      sendAction('input', input);
      input.ability = false;
    }
    updateKeyboardInput();
  });
  window.addEventListener('keyup', (event) => {
    keys.delete(event.code);
    updateKeyboardInput();
  });
  setInterval(() => {
    if (state?.phase === 'combat') sendAction('input', input);
  }, 80);

  $('#hostBtn').addEventListener('click', hostRoom);
  $('#showJoinBtn').addEventListener('click', () => {
    $('#joinFields').classList.toggle('hidden');
    if (!$('#joinFields').classList.contains('hidden')) $('#roomCode').focus();
  });
  $('#joinBtn').addEventListener('click', joinRoom);
  $('#roomCode').addEventListener('input', (event) => { event.target.value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); });
  $('#roomCode').addEventListener('keydown', (event) => { if (event.key === 'Enter') joinRoom(); });
})();

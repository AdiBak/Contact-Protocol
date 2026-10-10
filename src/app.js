import { missions } from './content/missions.js';
import { allDone, expeditionOutcome, publicState, RESEARCH_BUDGET, resolveRound, resolveScans } from './game/rules.js';
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
  let hostPeerId = null;
  let conn = null;
  let room = '';
  let state = null;
  let localPick = null;
  let localAnswer = null;
  let localConfidence = 2;
  let localLocked = false;
  let localPhase = '';
  let localHotspot = null;
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
    render();
  }

  function newRoom() {
    return Array.from(crypto.getRandomValues(new Uint8Array(6)), (byte) => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[byte % 32]).join('');
  }

  function broadcast() {
    if (!host || !state) return;
    const snapshot = publicState(state);
    Object.values(state.connections).forEach((connection) => {
      if (connection?.open) connection.send({ type: 'state', state: snapshot });
    });
    render();
  }

  function advanceIfReady() {
    if (!state) return;
    if (state.phase === 'explore' && allDone(state, 'readyExplore')) {
      state.phase = 'investigate';
      state.players.forEach((player) => { player.investigation = null; });
    } else if (state.phase === 'investigate' && allDone(state, 'investigation')) {
      resolveScans(state, missions);
      state.phase = 'predict';
      state.players.forEach((player) => { player.answer = null; player.confidence = null; });
    } else if (state.phase === 'predict' && allDone(state, 'answer')) {
      state.phase = 'reveal';
      resolveRound(state, missions);
    }
  }

  function hostAction(id, action, value) {
    if (!host || !state) return;
    const player = state.players.find((candidate) => candidate.id === id && candidate.connected);
    if (!player) return;
    const mission = missions[state.round];

    if (action === 'inspect' && state.phase === 'explore' && mission.hotspots.some((point) => point.id === value)) {
      if (!state.discoveries.includes(value)) state.discoveries.push(value);
    }
    if (action === 'readyExplore' && state.phase === 'explore') player.readyExplore = true;
    if (action === 'investigate' && state.phase === 'investigate' && Number.isInteger(value) && value >= 0 && value < mission.tests.length) {
      player.investigation = value;
    }
    if (action === 'predict' && state.phase === 'predict' && Number.isInteger(value?.answer) && value.answer >= 0 && value.answer < mission.answers.length && Number.isInteger(value?.confidence) && value.confidence >= 1 && value.confidence <= 3) {
      player.answer = value.answer;
      player.confidence = value.confidence;
    }
    advanceIfReady();
    broadcast();
  }

  function sendAction(action, value) {
    if (host) hostAction(myId, action, value);
    else if (conn?.open) conn.send({ type: 'action', playerId: myId, action, value });
    else toast('Connection lost. Rejoin the room to continue.');
  }

  function resetMissionPlayers() {
    state.players.forEach((player) => {
      player.readyExplore = false;
      player.investigation = null;
      player.answer = null;
      player.confidence = null;
    });
    state.discoveries = [];
    state.fundedScans = [];
    state.scanVotes = {};
    state.energyUsed = 0;
  }

  function startMission() {
    if (!host) return;
    if (state.players.filter((player) => player.connected).length < 2) {
      toast('Invite at least one more researcher.');
      return;
    }
    state.round = 0;
    state.teamScore = 0;
    state.lastResult = null;
    resetMissionPlayers();
    state.phase = 'explore';
    broadcast();
  }

  function nextRound() {
    if (!host) return;
    if (state.round >= missions.length - 1) {
      state.phase = 'finished';
    } else {
      state.round += 1;
      resetMissionPlayers();
      state.phase = 'explore';
    }
    state.lastResult = null;
    broadcast();
  }

  function restartMission() {
    if (!host) return;
    state.round = 0;
    state.phase = 'lobby';
    state.teamScore = 0;
    state.lastResult = null;
    resetMissionPlayers();
    state.players.forEach((player) => { player.score = 0; });
    broadcast();
  }

  function bindConnection(connection) {
    state.connections[connection.peer] = connection;
    connection.on('data', (message) => {
      if (message?.type === 'join' && host) {
        if (state.phase !== 'lobby') {
          connection.send({ type: 'rejected', reason: 'This mission has already launched.' });
          return;
        }
        const existing = state.players.find((player) => player.id === message.playerId);
        if (existing) {
          existing.connected = true;
          existing.name = String(message.name || 'Researcher').slice(0, 18);
          existing.peerId = connection.peer;
        } else if (state.players.length < 8) {
          state.players.push({ id: message.playerId, peerId: connection.peer, name: String(message.name || 'Researcher').slice(0, 18), host: false, connected: true, score: 0, readyExplore: false, investigation: null, answer: null, confidence: null });
        } else {
          connection.send({ type: 'rejected', reason: 'This crew is full.' });
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
    connection.on('error', () => toast('A crew connection dropped.'));
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
      hostPeerId = id;
      state = { room, phase: 'lobby', round: 0, teamScore: 0, players: [{ id: myId, name, host: true, connected: true, score: 0, readyExplore: false, investigation: null, answer: null, confidence: null }], connections: {}, discoveries: [], fundedScans: [], scanVotes: {}, energyUsed: 0, lastResult: null };
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
      toast('Enter the six-letter room code.');
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
      hostPeerId = `cp-${room.toLowerCase()}`;
      conn = peer.connect(hostPeerId, { reliable: true });
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
          home.classList.remove('hidden');
          game.classList.add('hidden');
        }
      });
      conn.on('error', () => {
        setBusy(false);
        toast('Could not reach that room. Check the code and try again.');
      });
      conn.on('close', () => toast('Host connection ended.'));
    });
    peer.on('error', (error) => {
      setBusy(false);
      toast(error.type === 'peer-unavailable' ? 'Room not found. Check the code and try again.' : `Connection error: ${error.type}`);
    });
  }

  function copyRoom() {
    navigator.clipboard?.writeText(room).then(() => toast('Room code copied.')).catch(() => toast(`Room code: ${room}`));
  }

  function readyCount(key) {
    return state.players.filter((player) => player.connected && (host ? player[key] : key === 'readyExplore' ? player[key] : key === 'investigation' ? player.investigationLocked : player.hypothesisLocked)).length;
  }

  function evidenceCards(mission, indices) {
    return indices.map((index) => {
      const test = mission.tests[index];
      return `<div class="evidence"><span class="tag">${esc(test.name)} · ${test.cost} ENERGY</span>${esc(test.evidence)}</div>`;
    }).join('');
  }

  function discoveryCards(mission) {
    return (state.discoveries || []).map((id) => mission.hotspots.find((point) => point.id === id)).filter(Boolean).map((point) => (
      `<button class="observation-card ${localHotspot === point.id ? 'active' : ''}" type="button" data-review-hotspot="${esc(point.id)}"><span class="observation-icon">${point.icon}</span><span><strong>${esc(point.title)}</strong><small>${esc(point.text)}</small></span><span class="observation-check">✓</span></button>`
    )).join('');
  }

  function render() {
    if (!state) return;
    const phaseKey = `${state.round}:${state.phase}`;
    if (phaseKey !== localPhase) {
      localPhase = phaseKey;
      localPick = null;
      localAnswer = null;
      localConfidence = 2;
      localLocked = false;
    }
    const me = state.players.find((player) => player.id === myId);
    const mission = missions[state.round] || missions[0];
    const discovered = state.discoveries || [];
    const active = state.players.filter((player) => player.connected);
    const isHost = host;
    const phaseLabels = { lobby: 'CREW ASSEMBLY', explore: 'FIRST-PERSON SURVEY', investigate: 'SCAN VOTE', predict: 'CREW HYPOTHESIS', reveal: 'MISSION DEBRIEF', finished: 'EXPEDITION COMPLETE' };
    const pill = phaseLabels[state.phase] || 'MISSION CONTROL';
    let content = '';

    if (state.phase === 'lobby') {
      content = `<div class="card-kicker">Awaiting launch authorization</div><h1 class="mission-title">Crew assembly</h1><p class="mission-brief">Share the room code with your crew. Together you will explore five 3D science scenes, choose scans with a shared energy budget, and interpret the evidence.</p><div class="lobby-preview"><span>01 · EXPLORE</span><b>→</b><span>02 · VOTE ON SCANS</span><b>→</b><span>03 · INTERPRET</span></div><div class="submit-row">${isHost ? '<button id="startBtn" class="btn btn-primary">Launch expedition ↗</button>' : '<span class="hint waiting-dots">Waiting for the host to launch</span>'}</div>`;
    } else if (state.phase === 'explore') {
      const selected = mission.hotspots.find((point) => point.id === localHotspot && discovered.includes(point.id)) || mission.hotspots.find((point) => point.id === discovered.at(-1));
      const ready = readyCount('readyExplore');
      content = `<div class="card-kicker">MISSION ${String(state.round + 1).padStart(2, '0')} / ${mission.tag}</div><h1 class="mission-title">${esc(mission.title)}</h1><p class="mission-brief">${esc(mission.brief)}</p><div class="scene-instruction"><span class="instruction-orb">⌖</span><span><strong>Survey the scene</strong><small>Click the pulsing markers to inspect objects. Every discovery is shared with the crew.</small></span><span class="scene-counter">${discovered.length}/${mission.hotspots.length} FOUND</span></div>${sceneMarkup(mission, discovered, localHotspot)}<div class="observation-area"><div class="observation-head"><span>CREW OBSERVATIONS</span><span>${discovered.length} / ${mission.hotspots.length}</span></div>${selected ? `<div class="focused-observation"><div class="focused-kicker">${esc(selected.title)}</div><p>${esc(selected.text)}</p></div>` : '<div class="empty-observation">The crew has not inspected any equipment yet. Find a marker in the scene to reveal a field note.</div>'}<div class="observation-list">${discoveryCards(mission)}</div></div><div class="submit-row"><button id="readyExplore" class="btn btn-primary" ${localLocked ? 'disabled' : ''}>${localLocked ? 'Ready to scan ✓' : 'Ready to scan ↗'}</button><span class="hint">${ready}/${active.length} crew ready · explore as much or as little as you like</span></div>`;
    } else if (state.phase === 'investigate') {
      const locked = readyCount('investigation');
      const budget = Array.from({ length: RESEARCH_BUDGET }, (_, index) => `<i class="energy-cell ${index < RESEARCH_BUDGET ? 'charged' : ''}"></i>`).join('');
      content = `<div class="card-kicker">MISSION ${String(state.round + 1).padStart(2, '0')} / ${mission.tag}</div><h1 class="mission-title">Choose the next measurements.</h1><p class="mission-brief">The crew has ${RESEARCH_BUDGET} shared energy. Each researcher privately votes for one scan. The most popular distinct scans run in vote order while energy allows.</p><div class="energy-panel"><div><span class="panel-label">SHARED RESEARCH ENERGY</span><strong>${RESEARCH_BUDGET} UNITS</strong></div><div class="energy-cells">${budget}</div><small>Ties use the scan order shown below.</small></div>${discovered.length ? `<div class="evidence-strip">${discoveryCards(mission)}</div>` : '<div class="empty-observation">No free observations collected. Your instruments can still investigate the anomaly.</div>'}<div class="choice-grid scan-grid">${mission.tests.map((test, index) => `<button class="choice scan-choice ${localPick === index ? 'selected' : ''}" data-pick="${index}" ${localLocked ? 'disabled' : ''}><span class="choice-icon">${test.icon}</span><span class="scan-cost">${test.cost} ENERGY</span><strong>${esc(test.name)}</strong><small>${esc(test.desc)}</small></button>`).join('')}</div><div class="submit-row"><button id="lockScan" class="btn btn-primary" ${localPick === null || localLocked ? 'disabled' : ''}>${localLocked ? 'Vote locked ✓' : 'Lock scan vote'}</button><span class="hint">${locked}/${active.length} votes locked${localLocked ? ' · your vote is private' : ''}</span></div>`;
    } else if (state.phase === 'predict') {
      const locked = readyCount('answer');
      const scans = evidenceCards(mission, state.fundedScans || []);
      const observations = discoveryCards(mission);
      content = `<div class="card-kicker">MISSION ${String(state.round + 1).padStart(2, '0')} / ${mission.tag}</div><h1 class="mission-title">What does the evidence support?</h1><p class="mission-brief">The crew spent ${state.energyUsed || 0} of ${RESEARCH_BUDGET} energy. Review the findings, then make a private call. A careful level of confidence is part of good science.</p><div class="evidence-strip">${scans || '<div class="empty-observation">No scans were funded this mission.</div>'}${observations}</div><div class="phase-pill">Choose your hypothesis</div><div class="choice-grid">${mission.answers.map((answer, index) => `<button class="choice answer-choice ${localAnswer === index ? 'selected' : ''}" data-answer="${index}" ${localLocked ? 'disabled' : ''}><span class="choice-icon">${['◉', '◈', '✧'][index]}</span><strong>${esc(answer)}</strong><small>Interpret the evidence</small></button>`).join('')}</div><div class="confidence-row"><span class="field-label">YOUR CONFIDENCE</span><div class="confidence-options">${[['1', 'Unsure'], ['2', 'Leaning'], ['3', 'High']].map(([value, label]) => `<button type="button" class="confidence ${localConfidence === Number(value) ? 'selected' : ''}" data-confidence="${value}" ${localLocked ? 'disabled' : ''}><b>${value}</b><span>${label}</span></button>`).join('')}</div></div><div class="submit-row"><button id="lockHypothesis" class="btn btn-primary" ${localAnswer === null || localLocked ? 'disabled' : ''}>${localLocked ? 'Hypothesis locked ✓' : 'Lock hypothesis'}</button><span class="hint">${locked}/${active.length} hypotheses locked</span></div>`;
    } else if (state.phase === 'reveal') {
      const result = state.lastResult || { correctVotes: 0, total: active.length, used: [], crewWon: false, roundPoints: 0, calibrationPoints: 0, scanPoints: 0, conclusionPoints: 0 };
      const crewAnswer = mission.answers[result.crewAnswer] || 'No crew conclusion';
      content = `<div class="card-kicker">MISSION ${String(state.round + 1).padStart(2, '0')} DEBRIEF / ${mission.tag}</div><h1 class="mission-title">${esc(mission.title)}</h1><div class="result-box"><div class="result-seal">${result.crewWon ? '✓' : '∿'}</div><div><h3>${result.crewWon ? 'A strong crew finding' : 'The signal stays uncertain'}</h3><p><strong>Crew conclusion:</strong> ${esc(crewAnswer)}${result.crewWon ? ' · Correct' : ''}</p><p>${esc(mission.why)}</p><p class="result-score">${result.correctVotes} OF ${result.total} RESEARCHERS CORRECT · ${result.roundPoints >= 0 ? '+' : ''}${result.roundPoints} CREW RP THIS MISSION</p></div></div><div class="score-breakdown"><div><span>Conclusion</span><b>${result.conclusionPoints >= 0 ? '+' : ''}${result.conclusionPoints} RP</b></div><div><span>Useful scans</span><b>+${result.scanPoints} RP</b></div><div><span>Confidence calibration</span><b>${result.calibrationPoints > 0 ? '+' : ''}${result.calibrationPoints} RP</b></div></div><div class="evidence-strip">${evidenceCards(mission, result.used || [])}${discoveryCards(mission)}</div><div class="crew-scoreline"><span>SHARED RESEARCH TOTAL</span><strong>${state.teamScore} RP</strong></div><div class="submit-row">${isHost ? `<button id="nextBtn" class="btn btn-primary">${state.round === missions.length - 1 ? 'Final expedition report ↗' : 'Next mission ↗'}</button>` : '<span class="hint waiting-dots">Waiting for the host</span>'}</div>`;
    } else {
      const outcome = expeditionOutcome(state.teamScore);
      content = `<div class="final-orbit"><div class="final-star">✦</div><div class="final-ring ring-one"></div><div class="final-ring ring-two"></div></div><div class="card-kicker">TRANSMISSION COMPLETE · FIVE MISSIONS</div><h1 class="mission-title">${esc(outcome.title)}</h1><p class="mission-brief">${esc(outcome.detail)}</p><div class="final-score"><span>SHARED RESEARCH SCORE</span><strong>${state.teamScore}<small> RP</small></strong></div><div class="result-box"><h3>The unknown, a little less unknown.</h3><p>Good science grows through careful observation, useful tests, and conclusions that match the strength of the evidence. Your crew has a field record to build on.</p></div><div class="submit-row">${isHost ? '<button id="restartBtn" class="btn btn-primary">Start a new expedition ↗</button>' : ''}<button id="leaveBtn" class="btn btn-quiet">Leave mission</button></div>`;
    }

    const roster = state.players.map((player) => {
      let badge = '';
      if (state.phase === 'explore') badge = player.readyExplore ? 'READY' : 'SURVEYING';
      if (state.phase === 'investigate') badge = (host ? player.investigation !== null : player.investigationLocked) ? 'VOTED' : 'CHOOSING';
      if (state.phase === 'predict') badge = (host ? player.answer !== null : player.hypothesisLocked) ? 'LOCKED' : 'DECIDING';
      return `<div class="player-row"><div class="avatar">${esc((player.name || '?').slice(0, 1).toUpperCase())}</div><span class="player-name">${esc(player.name)} ${player.id === myId ? '(you)' : ''}</span>${player.host ? '<span class="host-tag">HOST</span>' : ''}${state.phase !== 'lobby' ? `<span class="player-state">${badge}</span>` : ''}</div>`;
    }).join('');
    const missionProgress = state.phase === 'lobby' ? 0 : state.phase === 'finished' ? 100 : ((state.round + (state.phase === 'reveal' ? 1 : 0)) / missions.length) * 100;
    const sideNote = state.phase === 'lobby' ? 'Invite 1–7 friends with the room code.' : `Shared research: ${state.teamScore} RP · ${RESEARCH_BUDGET} energy each mission`;
    game.innerHTML = `<div class="game-layout"><main class="game-main"><div class="room-head"><div><div class="card-kicker">MISSION ROOM</div><div class="room-id">${esc(room || state.room)}</div></div><div class="round-meta"><span class="phase-pill">${pill}</span><br/>${state.phase === 'lobby' ? 'READY WHEN YOU ARE' : state.phase === 'finished' ? 'FIELD REPORT COMPLETE' : `MISSION ${String(state.round + 1).padStart(2, '0')} OF 05`}</div></div>${content}</main><aside class="sidebar"><div class="sidebar-card"><div class="roster-title"><span>Research crew</span><span>${active.length}/8</span></div>${roster}<div class="progress"><span style="width:${missionProgress}%"></span></div><div class="sidebar-note">${sideNote}</div>${isHost && state.phase === 'lobby' ? '<button id="copyCode" class="copy-code">COPY ROOM CODE ↗</button>' : ''}</div><div class="sidebar-card mission-brief-card"><div class="card-kicker">FIELD NOTES</div><div class="sidebar-note">A discovery is a clue, not a verdict. Spend energy on evidence that can distinguish between competing explanations.</div><div class="crew-scoreline compact"><span>EXPEDITION SCORE</span><strong>${state.teamScore} RP</strong></div></div></aside></div>`;

    $('#startBtn')?.addEventListener('click', startMission);
    $('#copyCode')?.addEventListener('click', copyRoom);
    $('#readyExplore')?.addEventListener('click', () => { localLocked = true; render(); sendAction('readyExplore'); });
    $('#lockScan')?.addEventListener('click', () => {
      if (localPick !== null && !localLocked) {
        localLocked = true;
        render();
        sendAction('investigate', localPick);
      }
    });
    $('#lockHypothesis')?.addEventListener('click', () => {
      if (localAnswer !== null && !localLocked) {
        localLocked = true;
        render();
        sendAction('predict', { answer: localAnswer, confidence: localConfidence });
      }
    });
    $('#nextBtn')?.addEventListener('click', nextRound);
    $('#restartBtn')?.addEventListener('click', restartMission);
    $('#leaveBtn')?.addEventListener('click', () => { peer?.destroy(); location.reload(); });
    game.querySelectorAll('[data-hotspot]').forEach((button) => button.addEventListener('click', () => {
      localHotspot = button.dataset.hotspot;
      if (!state.discoveries.includes(localHotspot)) sendAction('inspect', localHotspot);
      else render();
    }));
    game.querySelectorAll('[data-review-hotspot]').forEach((button) => button.addEventListener('click', () => {
      localHotspot = button.dataset.reviewHotspot;
      render();
    }));
    game.querySelectorAll('[data-pick]').forEach((button) => button.addEventListener('click', () => {
      if (localLocked) return;
      localPick = Number(button.dataset.pick);
      render();
    }));
    game.querySelectorAll('[data-answer]').forEach((button) => button.addEventListener('click', () => {
      if (localLocked) return;
      localAnswer = Number(button.dataset.answer);
      render();
    }));
    game.querySelectorAll('[data-confidence]').forEach((button) => button.addEventListener('click', () => {
      if (localLocked) return;
      localConfidence = Number(button.dataset.confidence);
      render();
    }));
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

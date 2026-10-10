import { esc } from './text.js';

export function sceneMarkup(mission, discoveries = [], selectedId = null, lastEvent = null, interactive = true) {
  const { theme } = mission;
  const discovered = new Set(discoveries);
  const hotspots = interactive ? mission.hotspots.map((point) => {
    const found = discovered.has(point.id);
    return `<button class="hotspot ${found ? 'found' : ''} ${selectedId === point.id ? 'focused' : ''}" type="button" data-hotspot="${esc(point.id)}" style="--x:${point.x}%;--y:${point.y}%" aria-label="${found ? 'Review' : 'Inspect'} ${esc(point.title)}" disabled><span class="hotspot-ping">${found ? '✓' : '+'}</span><span class="hotspot-label">${esc(point.title)}</span></button>`;
  }).join('') : '';
  const eventLabel = lastEvent?.kind === 'inspection' ? 'INSPECTION' : lastEvent?.kind === 'scan' ? 'SCIENCE OPERATION' : lastEvent?.kind === 'finding' ? 'CREW FINDING' : 'LIVE TELEMETRY';
  const findingExitAge = lastEvent?.kind === 'findingExit' ? Math.max(0, Date.now() - (lastEvent.startedAt || Date.now())) : 0;
  const showFinding = lastEvent?.kind === 'finding' || (lastEvent?.kind === 'findingExit' && findingExitAge < 800);
  const findingPanelClass = lastEvent?.kind === 'findingExit' ? 'finding-panel is-exiting' : 'finding-panel';
  const findingPanelStyle = lastEvent?.kind === 'findingExit' ? ` style="--exit-delay:-${Math.min(findingExitAge, 800)}ms"` : '';
  const scanReadings = (lastEvent?.scans || []).map((scan, index) => `<div class="mission-reading" style="--reading-delay:${index * 180}ms"><span class="reading-status">● CAPTURED</span><strong>${esc(scan.name || 'Instrument pass')}</strong><small>${esc(scan.evidence || '')}</small></div>`).join('');
  const resultReadings = (lastEvent?.evidence || []).map((item, index) => `<div class="result-reading" style="--reading-delay:${index * 140}ms"><span>${String(index + 1).padStart(2, '0')}</span><p><b>${esc(item.name || 'Measurement')}</b>${esc(item.evidence || '')}</p></div>`).join('');
  const operation = lastEvent?.kind === 'scan' ? `<section class="scene-event-panel scan-panel" aria-label="Live scan operation"><div class="event-panel-head"><span class="event-panel-kicker">${esc(mission.kind || 'MISSION')} · LIVE INSTRUMENT PASS</span><b>ACQUIRING</b></div><div class="scan-visual"><div class="scan-plot" aria-hidden="true"><i></i><svg viewBox="0 0 240 54" preserveAspectRatio="none"><path d="M0 29 H18 L25 26 31 32 39 27 48 29 58 28 65 30 74 29 82 28 92 29 99 29 106 13 111 44 116 20 121 34 127 28 139 29 148 29 155 30 164 28 175 29 184 29 193 28 201 29 211 26 220 30 231 28 240 29"/></svg></div><div class="scan-reticle" aria-hidden="true"><i></i><b>LOCK</b></div></div><div class="event-panel-footer"><span>${esc(lastEvent.label || 'SCIENCE SCAN')}</span><span>DATA STREAM <i></i></span></div>${scanReadings || '<div class="mission-reading"><strong>Instrument pass complete</strong><small>Review the measurements as they arrive.</small></div>'}</section>` : showFinding ? `<section class="scene-event-panel ${findingPanelClass}"${findingPanelStyle} aria-label="Crew finding"><div class="event-panel-head"><span class="event-panel-kicker">MISSION RESULT · EVIDENCE SYNTHESIS</span><b>${lastEvent.correct ? 'SUPPORTED' : 'UNRESOLVED'}</b></div><div class="finding-visual"><div class="finding-orbit" aria-hidden="true"><i></i><i></i><b>${lastEvent.correct ? '✓' : '?'}</b></div><div><span class="event-panel-kicker">CREW CONCLUSION</span><strong>${esc(lastEvent.conclusion || 'No majority conclusion')}</strong></div></div>${resultReadings || '<div class="result-reading"><span>∿</span><p><b>Open question</b>No scans were funded. The next observation can help resolve this question.</p></div>'}</section>` : '';
  return `<div class="scene-wrap" data-scene-root style="--scene-color:${theme.color};--scene-accent:${theme.accent}">
    <canvas class="scene-canvas" aria-label="Interactive 3D mission scene: ${esc(mission.location)}"></canvas>
    <div class="scene-vignette" aria-hidden="true"></div>
    <div class="cockpit-overlay" aria-hidden="true"><i class="cockpit-strut cockpit-strut-left"></i><i class="cockpit-strut cockpit-strut-right"></i><div class="cockpit-console"><span></span><span></span><span></span><span></span><span></span></div></div>
    <div class="scene-caption"><span class="scene-live-dot"></span> ${esc(mission.location)} <span>·</span> <b data-scene-event>${eventLabel}</b></div>
    ${operation}
    <div class="scene-loader" data-scene-loader><i></i><span>CALIBRATING OPTICS · PREPARING MISSION SCENE</span></div>
    ${hotspots}
    <div class="scene-scanline" aria-hidden="true"></div>
  </div>`;
}

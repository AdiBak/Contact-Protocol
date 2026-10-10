import { esc } from './text.js';

export function sceneMarkup(mission, discoveries = [], selectedId = null, lastEvent = null, interactive = true) {
  const { theme } = mission;
  const discovered = new Set(discoveries);
  const hotspots = interactive ? mission.hotspots.map((point) => {
    const found = discovered.has(point.id);
    return `<button class="hotspot ${found ? 'found' : ''} ${selectedId === point.id ? 'focused' : ''}" type="button" data-hotspot="${esc(point.id)}" style="--x:${point.x}%;--y:${point.y}%" aria-label="${found ? 'Review' : 'Inspect'} ${esc(point.title)}" disabled><span class="hotspot-ping">${found ? '✓' : '+'}</span><span class="hotspot-label">${esc(point.title)}</span></button>`;
  }).join('') : '';
  const eventLabel = lastEvent?.kind === 'inspection' ? 'INSPECTION' : lastEvent?.kind === 'scan' ? 'SCIENCE OPERATION' : lastEvent?.kind === 'finding' ? 'CREW FINDING' : 'LIVE TELEMETRY';
  return `<div class="scene-wrap" data-scene-root style="--scene-color:${theme.color};--scene-accent:${theme.accent}">
    <canvas class="scene-canvas" aria-label="Interactive 3D mission scene: ${esc(mission.location)}"></canvas>
    <div class="scene-vignette" aria-hidden="true"></div>
    <div class="scene-caption"><span class="scene-live-dot"></span> ${esc(mission.location)} <span>·</span> <b data-scene-event>${eventLabel}</b></div>
    <div class="scene-loader" data-scene-loader><i></i><span>CALIBRATING OPTICS · PREPARING MISSION SCENE</span></div>
    ${hotspots}
    <div class="scene-scanline" aria-hidden="true"></div>
  </div>`;
}

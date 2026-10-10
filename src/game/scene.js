import { esc } from './text.js';

export function sceneMarkup(mission, discoveries, selectedId, lastEvent = null) {
  const { theme } = mission;
  const discovered = new Set(discoveries);
  const hotspots = mission.hotspots.map((point) => {
    const found = discovered.has(point.id);
    const pulse = lastEvent?.kind === 'inspection' && lastEvent.pointId === point.id;
    return `<button class="hotspot ${found ? 'found' : ''} ${selectedId === point.id ? 'focused' : ''} ${pulse ? 'just-found' : ''}" type="button" data-hotspot="${esc(point.id)}" style="--x:${point.x}%;--y:${point.y}%" aria-label="${found ? 'Review' : 'Inspect'} ${esc(point.title)}"><span class="hotspot-ping">${found ? '✓' : '+'}</span><span class="hotspot-label">${esc(point.title)}</span></button>`;
  }).join('');
  const world = theme.kind === 'pulsar'
    ? `<g class="pulsar-world"><ellipse cx="${theme.x}" cy="${theme.y}" rx="${theme.r * 1.55}" ry="${theme.r * .17}" fill="${theme.accent}" opacity=".18"/><path d="M${theme.x} ${theme.y - theme.r * 1.5}L${theme.x - 14} ${theme.y - 18}L${theme.x + 14} ${theme.y - 18}Z" fill="${theme.accent}" opacity=".26"/><path d="M${theme.x} ${theme.y + theme.r * 1.5}L${theme.x - 14} ${theme.y + 18}L${theme.x + 14} ${theme.y + 18}Z" fill="${theme.accent}" opacity=".2"/><circle cx="${theme.x}" cy="${theme.y}" r="${theme.r * .23}" fill="url(#sceneWorld)"/><circle cx="${theme.x}" cy="${theme.y}" r="${theme.r * .34}" fill="none" stroke="${theme.accent}" stroke-opacity=".6" stroke-width="2"/></g>`
    : `<g class="planet-world"><circle cx="${theme.x}" cy="${theme.y}" r="${theme.r}" fill="url(#sceneWorld)"/><path d="M${theme.x - theme.r} ${theme.y}a${theme.r} ${theme.r} 0 1 0 ${theme.r * 2} 0a${theme.r * .76} ${theme.r} 0 1 1 -${theme.r * 2} 0" fill="#07101e" opacity=".27"/><path d="M${theme.x - theme.r * .72} ${theme.y - theme.r * .35}q${theme.r * .7} ${theme.r * .14} ${theme.r * 1.4} 0M${theme.x - theme.r * .8} ${theme.y + theme.r * .24}q${theme.r * .8} ${theme.r * -.15} ${theme.r * 1.6} 0" fill="none" stroke="#f5ead6" stroke-opacity=".16" stroke-width="3"/>${theme.rings ? `<ellipse cx="${theme.x}" cy="${theme.y + theme.r * .12}" rx="${theme.r * 1.7}" ry="${theme.r * .32}" fill="none" stroke="${theme.accent}" stroke-opacity=".55" stroke-width="8" transform="rotate(-12 ${theme.x} ${theme.y})"/><ellipse cx="${theme.x}" cy="${theme.y + theme.r * .12}" rx="${theme.r * 1.7}" ry="${theme.r * .32}" fill="none" stroke="#f6e4c3" stroke-opacity=".26" stroke-width="2" transform="rotate(-12 ${theme.x} ${theme.y})"/>` : ''}</g>`;

  return `<div class="scene-wrap" style="--scene-color:${theme.color};--scene-accent:${theme.accent}">
    <svg class="scene-art" viewBox="0 0 1000 500" role="img" aria-label="First-person view inside the ${esc(mission.location)}">
      <defs>
        <linearGradient id="sceneSky" x2="0" y2="1"><stop stop-color="#101a35"/><stop offset="1" stop-color="#253553"/></linearGradient>
        <linearGradient id="sceneFloor" x2="0" y2="1"><stop stop-color="#27364e"/><stop offset="1" stop-color="#101827"/></linearGradient>
        <radialGradient id="sceneWorld"><stop stop-color="#f4d8ae"/><stop offset=".48" stop-color="${theme.world}"/><stop offset="1" stop-color="#22243c"/></radialGradient>
        <linearGradient id="sceneGlass" x2="0" y2="1"><stop stop-color="#0a1530"/><stop offset="1" stop-color="#173b52"/></linearGradient>
        <clipPath id="windowClip"><path d="M315 48h370l47 212H268z"/></clipPath>
      </defs>
      <rect width="1000" height="500" fill="url(#sceneSky)"/>
      <g class="scene-stars" fill="#d8edff">
        <circle cx="92" cy="68" r="2"/><circle cx="187" cy="118" r="1.5"/><circle cx="246" cy="54" r="1.5"/><circle cx="749" cy="78" r="2"/><circle cx="853" cy="122" r="1.5"/><circle cx="925" cy="61" r="2"/><circle cx="800" cy="183" r="1.2"/><circle cx="132" cy="181" r="1.1"/>
      </g>
      <g clip-path="url(#windowClip)">
        <rect x="260" y="40" width="500" height="230" fill="url(#sceneGlass)"/>
        ${world}
        <path d="M250 230Q470 175 790 233v55H250z" fill="#18273b" opacity=".75"/>
      </g>
      <path d="M315 48h370l47 212H268z" fill="none" stroke="#71819d" stroke-width="9"/>
      <path d="M300 259 0 390V500h1000V390L747 259z" fill="url(#sceneFloor)"/>
      <path d="M0 0h1000v64H0z" fill="#111a2a"/>
      <path d="M0 64 268 260v130L0 500z" fill="#172338" stroke="#34445f" stroke-width="3"/>
      <path d="M1000 64 747 260v130l253 110z" fill="#172338" stroke="#34445f" stroke-width="3"/>
      <path d="M0 390 268 260h479l253 130" fill="none" stroke="#55647c" stroke-width="4"/>
      <path d="M180 500 405 261M820 500 595 261M500 500V261M55 438h890M130 470h740" fill="none" stroke="#586983" stroke-opacity=".27" stroke-width="2"/>
      <g class="console console-left">
        <path d="M64 208h143l32 141H44z" fill="#202e43" stroke="#64748a" stroke-width="3"/>
        <path d="M79 226h105l17 75H64z" fill="#09141e" stroke="${theme.color}" stroke-opacity=".65" stroke-width="2"/>
        <path d="M75 269h18l8-18 12 30 10-23 8 13h52" fill="none" stroke="${theme.color}" stroke-width="3"/>
        <circle cx="89" cy="324" r="5" fill="${theme.accent}"/><circle cx="110" cy="324" r="5" fill="${theme.color}"/>
      </g>
      <g class="console console-right">
        <path d="M784 210h142l24 142H759z" fill="#202e43" stroke="#64748a" stroke-width="3"/>
        <path d="M804 228h100l13 72H789z" fill="#09141e" stroke="${theme.accent}" stroke-opacity=".65" stroke-width="2"/>
        <path d="m800 278 19-18 19 9 14-21 20 24 20-11 18 9" fill="none" stroke="${theme.accent}" stroke-width="3"/>
        <path d="M805 324h91" stroke="#71819d" stroke-width="3" stroke-dasharray="5 7"/>
      </g>
      <path d="M359 325h282l54 122H305z" fill="#263850" stroke="#78869a" stroke-width="3"/>
      <path d="M385 343h230l27 53H357z" fill="#0b1725" stroke="${theme.color}" stroke-opacity=".8" stroke-width="2"/>
      <path d="M378 370h55l13-12 13 20 14-30 14 23h94" fill="none" stroke="${theme.color}" stroke-width="3"/>
      <path d="M430 449v51m143-51v51" stroke="#8793a4" stroke-width="7"/>
      <g fill="#91a4b9"><circle cx="276" cy="293" r="3"/><circle cx="724" cy="293" r="3"/><circle cx="265" cy="315" r="3"/><circle cx="735" cy="315" r="3"/></g>
    </svg>
    <div class="scene-vignette" aria-hidden="true"></div>
    <div class="scene-caption"><span class="scene-live-dot"></span> ${esc(mission.location)} <span>·</span> FIRST-PERSON SURVEY</div>
    <div class="scene-grid" aria-hidden="true"></div>
    ${hotspots}
    <div class="scene-scanline" aria-hidden="true"></div>
  </div>`;
}

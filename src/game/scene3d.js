import * as THREE from 'three';

const activeScenes = new WeakMap();
let currentSceneRoot = null;
const color = (value, fallback) => new THREE.Color(value || fallback);
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

function makeStars(scene) {
  const positions = new Float32Array(1500 * 3);
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] = (Math.random() - .5) * 150;
    positions[i + 1] = (Math.random() - .5) * 90;
    positions[i + 2] = -Math.random() * 115 - 8;
  }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(geo, new THREE.PointsMaterial({ color: '#c8e8ff', size: .095, transparent: true, opacity: .82, sizeAttenuation: true }));
  scene.add(points); return points;
}

function sphere(radius, material, position) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 64, 48), material);
  mesh.position.set(...position); return mesh;
}

function addPulsar(scene, accent) {
  const core = sphere(1.15, new THREE.MeshStandardMaterial({ color: '#d7faff', emissive: accent, emissiveIntensity: 2.4, roughness: .25 }), [0, 1.1, -22]);
  scene.add(core);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.7, .027, 8, 180), new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: .75 }));
  ring.position.copy(core.position); ring.rotation.x = 1.1; ring.rotation.y = .45; scene.add(ring);
  const beamMat = new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: .18, side: THREE.DoubleSide, depthWrite: false });
  for (const dir of [-1, 1]) {
    const beam = new THREE.Mesh(new THREE.ConeGeometry(.34, 18, 28, 1, true), beamMat.clone());
    beam.position.set(0, 1.1 + dir * 9, -22); beam.rotation.x = dir < 0 ? Math.PI : 0; scene.add(beam);
  }
  return { core, ring };
}

function addWorld(scene, kind, accent, worldColor, worldRadius) {
  if (kind === 'pulsar') return addPulsar(scene, accent);
  if (kind === 'gamma') {
    const burst = sphere(.24, new THREE.MeshBasicMaterial({ color: '#fff3dc' }), [7, 2.5, -31]);
    const halo = sphere(.6, new THREE.MeshBasicMaterial({ color: '#ffc779', transparent: true, opacity: .55 }), [7, 2.5, -31]);
    const wave = new THREE.Mesh(new THREE.TorusGeometry(1, .025, 8, 100), new THREE.MeshBasicMaterial({ color: '#bca7ff', transparent: true, opacity: .7 }));
    wave.position.copy(burst.position); scene.add(burst, halo, wave);
    return { core: burst, glow: halo, ring: wave, gamma: true };
  }
  const material = new THREE.MeshStandardMaterial({ color: worldColor || '#ae7564', roughness: .93, metalness: .02 });
  const planet = sphere(worldRadius || (kind === 'mars' ? 6 : kind === 'europa' ? 4.6 : 5.4), material, [0, 1, -24]);
  scene.add(planet);
  const atmosphere = sphere(planet.geometry.parameters.radius * 1.035, new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: .095, side: THREE.BackSide }), [0, 1, -24]); scene.add(atmosphere);
  // Subtle procedural relief bands and terrain contours make each world read as a distinct body.
  const terrain = new THREE.Group(); terrain.position.copy(planet.position); terrain.rotation.z = -.28; scene.add(terrain);
  const r = planet.geometry.parameters.radius;
  for (let i = 0; i < 7; i++) {
    const lat = -.82 + i * .27;
    const curve = new THREE.EllipseCurve(0, r * Math.sin(lat), r * Math.cos(lat), r * Math.cos(lat) * .13, 0, Math.PI * 2, false, 0);
    const pts = curve.getPoints(120).map((p) => new THREE.Vector3(p.x, p.y, 0));
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: .11 }));
    terrain.add(line);
  }
  if (kind === 'saturn') {
    const ring = new THREE.Mesh(new THREE.RingGeometry(r * 1.25, r * 2.05, 160), new THREE.MeshStandardMaterial({ color: '#c7ad83', side: THREE.DoubleSide, transparent: true, opacity: .78, roughness: .9 }));
    ring.position.copy(planet.position); ring.rotation.set(1.12, .2, .3); scene.add(ring);
  }
  if (kind === 'europa') {
    for (let i = 0; i < 9; i++) {
      const crack = new THREE.Mesh(new THREE.BoxGeometry(.04, 1.3 + (i % 3) * .8, .025), new THREE.MeshBasicMaterial({ color: '#edfaff', transparent: true, opacity: .24 }));
      crack.position.set(Math.sin(i * 9.2) * 2.2, Math.cos(i * 4.1) * 2.1 + 1, -18.8); crack.rotation.z = i * .73; scene.add(crack);
    }
  }
  if (kind === 'exoplanet') {
    const star = sphere(1.1, new THREE.MeshBasicMaterial({ color: '#ffe4a9' }), [-9, 4, -32]);
    const glow = sphere(1.6, new THREE.MeshBasicMaterial({ color: '#ffc779', transparent: true, opacity: .12 }), [-9, 4, -32]); scene.add(star, glow);
    return { planet, atmosphere, terrain, star, glow };
  }
  return { planet, atmosphere, terrain };
}

function addShip(scene, accent) {
  const ship = new THREE.Group();
  const hull = new THREE.Mesh(new THREE.ConeGeometry(.78, 3.1, 8), new THREE.MeshStandardMaterial({ color: '#aab9c8', metalness: .7, roughness: .32 }));
  hull.rotation.x = -Math.PI / 2; hull.position.z = -1.8; ship.add(hull);
  const cockpit = new THREE.Mesh(new THREE.SphereGeometry(.48, 24, 16), new THREE.MeshPhysicalMaterial({ color: accent, metalness: .55, roughness: .16, transmission: .12, transparent: true, opacity: .88 })); cockpit.position.z = -2.2; ship.add(cockpit);
  const wingMat = new THREE.MeshStandardMaterial({ color: '#60738c', metalness: .55, roughness: .5 });
  for (const side of [-1, 1]) {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(2.35, .09, .95), wingMat); wing.position.set(side * 1.1, -.08, -.8); wing.rotation.z = side * -.12; ship.add(wing);
    const lamp = new THREE.PointLight(accent, 2, 4); lamp.position.set(side * 2, 0, -1); ship.add(lamp);
  }
  ship.position.set(0, -2.6, 1); scene.add(ship); return ship;
}

function addInstrument(scene, kind, accent) {
  const group = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: '#344960', metalness: .72, roughness: .34 });
  const glow = new THREE.MeshBasicMaterial({ color: accent });
  if (kind === 'mars') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, .58, .8), metal); group.add(body);
    for (const x of [-.58, .58]) for (const z of [-.37, .37]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .13, 18), metal); wheel.rotation.z = Math.PI / 2; wheel.position.set(x, -.42, z); group.add(wheel);
    }
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(.045, .07, 1.1), metal); mast.position.set(0, .78, 0); group.add(mast);
    const lens = new THREE.Mesh(new THREE.SphereGeometry(.16, 16, 12), glow); lens.position.set(0, 1.35, -.08); group.add(lens);
  } else if (kind === 'gamma') {
    const plate = new THREE.Mesh(new THREE.BoxGeometry(1.2, .08, 1.2), metal); group.add(plate);
    for (let i = -1; i <= 1; i++) { const tube = new THREE.Mesh(new THREE.CylinderGeometry(.12, .17, .8, 16), metal); tube.position.set(i * .37, .45, 0); group.add(tube); }
  } else {
    const dish = new THREE.Mesh(new THREE.SphereGeometry(.76, 32, 20, 0, Math.PI * 2, 0, Math.PI * .55), new THREE.MeshStandardMaterial({ color: '#bac9d2', metalness: .82, roughness: .26, side: THREE.DoubleSide })); dish.rotation.x = Math.PI; group.add(dish);
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(.08, .13, 1.5, 16), metal); mast.position.y = -.8; group.add(mast);
    const hub = new THREE.Mesh(new THREE.SphereGeometry(.12, 18, 12), glow); hub.position.y = .35; group.add(hub);
  }
  group.position.set(-5, -2.7, -6); group.rotation.y = .42; scene.add(group); return group;
}

export async function prepareScene(root, mission, event) {
  if (!root) return;
  if (currentSceneRoot && currentSceneRoot !== root) activeScenes.get(currentSceneRoot)?.dispose();
  activeScenes.get(root)?.dispose();
  const canvas = root.querySelector('.scene-canvas');
  const loader = root.querySelector('[data-scene-loader]');
  const eventLabel = root.querySelector('[data-scene-event]');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.7));
  renderer.setSize(root.clientWidth, root.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#050b17');
  scene.fog = new THREE.FogExp2('#081323', .009);
  const camera = new THREE.PerspectiveCamera(52, root.clientWidth / root.clientHeight, .1, 180); camera.position.set(0, .1, 8.8);
  scene.add(new THREE.HemisphereLight('#b6d7ff', '#172235', 2.1));
  const key = new THREE.DirectionalLight('#fff0da', 3.2); key.position.set(-7, 8, 2); scene.add(key);
  const rim = new THREE.PointLight(color(mission.theme.accent, '#7ee7df'), 54, 44); rim.position.set(6, 2, -15); scene.add(rim);
  const stars = makeStars(scene);
  const kind = mission.kind || mission.theme.kind || 'planet';
  const world = addWorld(scene, kind, mission.theme.accent, mission.theme.world, mission.theme.worldRadius);
  const ship = addShip(scene, mission.theme.accent);
  const instrument = addInstrument(scene, kind, mission.theme.accent);
  const particles = new THREE.Group(); scene.add(particles);
  const cueColor = color(mission.theme.accent, '#7ee7df');
  const actionRings = [1, 1.42, 1.84].map((radius, i) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, .018, 6, 96), new THREE.MeshBasicMaterial({ color: cueColor, transparent: true, opacity: .72 - i * .12, depthWrite: false }));
    ring.visible = false; ring.userData.offset = i * .24; scene.add(ring); return ring;
  });
  const focusLineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -2.4, -.1), new THREE.Vector3(-5, -1.2, -6)]);
  const focusLine = new THREE.Line(focusLineGeometry, new THREE.LineBasicMaterial({ color: cueColor, transparent: true, opacity: .8 })); focusLine.visible = false; scene.add(focusLine);
  const seq = event?.startedAt ? event : null;
  let disposed = false, frame = 0, compilationFinished = false, resourcesReleased = false;
  const resize = () => { if (disposed || !root.isConnected) return; const w = root.clientWidth, h = root.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / Math.max(1, h); camera.updateProjectionMatrix(); };
  const observer = new ResizeObserver(resize); observer.observe(root);
  const clock = new THREE.Clock();
  const animate = () => {
    if (disposed || !root.isConnected) return;
    frame = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    stars.rotation.y = t * .002; stars.rotation.x = Math.sin(t * .08) * .012;
    ship.position.y = -2.6 + Math.sin(t * .65) * .035;
    if (world?.planet) world.planet.rotation.y = t * (kind === 'europa' ? .018 : .008);
    if (world?.terrain) world.terrain.rotation.y = (world.planet?.rotation.y || t * .008) + .28;
    if (world?.ring) world.ring.rotation.z = .3 + Math.sin(t * .11) * .02;
    if (world?.gamma) { const pulse = 1 + (Math.sin(t * 2.1) + 1) * .28; world.ring.scale.setScalar(pulse); world.glow.scale.setScalar(pulse * .8); }
    if (world?.core) world.core.rotation.y = t * .18;
    if (world?.star) { world.planet.position.x = -9 + Math.sin(t * .18) * 1.3; world.glow.scale.setScalar(1 + Math.sin(t * 1.4) * .05); }
    // Each shared action plays against the same host timestamp, so it catches up cleanly if a device loads late.
    const age = seq ? Math.max(0, (Date.now() - seq.startedAt) / 1000) : 99;
    const cueActive = age < 6.5;
    const cueTarget = world?.core?.position || world?.planet?.position || new THREE.Vector3(0, 1, -22);
    actionRings.forEach((ring) => {
      ring.visible = cueActive && seq?.kind !== 'inspection';
      ring.position.copy(cueTarget);
      const phase = Math.max(0, age - ring.userData.offset);
      ring.scale.setScalar(seq?.kind === 'finding' ? .5 + phase * .55 : .55 + phase * .32);
      ring.rotation.z = phase * (seq?.kind === 'finding' ? -.35 : .22);
      ring.material.opacity = cueActive ? .72 * (1 - clamp(age / 7, 0, 1)) : 0;
    });
    focusLine.visible = cueActive && seq?.kind === 'inspection';
    focusLine.material.opacity = cueActive ? .8 * (1 - clamp(age / 7, 0, 1)) : 0;
    let targetX = 0, targetY = .1, zoom = 1;
    if (seq && age < 7) {
      const progress = clamp(age / 6.5, 0, 1);
      const ease = progress * progress * (3 - 2 * progress);
      if (seq.kind === 'inspection') { targetX = kind === 'gamma' ? -.3 : -.58 * ease; targetY = -.15 * ease; zoom = 1 + .22 * ease; instrument.rotation.y = .42 + Math.sin(age * 3) * .22 * (age < 2 ? 1 : 0); }
      if (seq.kind === 'scan') { targetX = kind === 'gamma' ? .8 * Math.sin(age * .55) : 0; targetY = Math.sin(age * 2.4) * .16; zoom = 1 + .11 * Math.sin(Math.PI * progress); instrument.rotation.y = .42 + Math.sin(age * 4) * .5; }
      if (seq.kind === 'finding') { targetY = .18 * ease; zoom = 1 + .18 * Math.sin(Math.PI * progress); }
    }
    camera.position.x += (targetX - camera.position.x) * .025;
    camera.position.y += (targetY - camera.position.y) * .025;
    camera.fov += (52 / zoom - camera.fov) * .025; camera.updateProjectionMatrix();
    if (seq && eventLabel) eventLabel.textContent = seq.kind === 'inspection' ? 'INSTRUMENT INSPECTION' : seq.kind === 'scan' ? `ACTIVE · ${seq.label || 'SCIENCE SCAN'}` : 'FINDING RECORDED';
    if (loader) loader.classList.add('ready');
    renderer.render(scene, camera);
  };
  const releaseResources = () => {
    if (resourcesReleased) return;
    resourcesReleased = true;
    scene.traverse((obj) => { obj.geometry?.dispose(); if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose()); else obj.material?.dispose(); });
    renderer.dispose();
  };
  const dispose = () => {
    disposed = true; cancelAnimationFrame(frame); observer.disconnect();
    activeScenes.delete(root); if (currentSceneRoot === root) currentSceneRoot = null;
    // Three.js polls shader program readiness asynchronously; disposing its renderer mid-poll
    // can make that internal readiness check dereference a removed program.
    if (compilationFinished) releaseResources();
  };
  activeScenes.set(root, { dispose });
  currentSceneRoot = root;
  // Compile every shader before revealing the calibrated scene; all geometry is local and procedural.
  try {
    await renderer.compileAsync(scene, camera);
  } catch (error) {
    compilationFinished = true;
    dispose();
    throw error;
  }
  compilationFinished = true;
  if (disposed) { releaseResources(); return; }
  animate();
}

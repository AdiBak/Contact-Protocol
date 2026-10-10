import * as THREE from 'three';

const activeViews = new WeakMap();

function makeShip(color, local = false) {
  const group = new THREE.Group();
  const hull = new THREE.Mesh(
    new THREE.ConeGeometry(.34, 1.15, 6),
    new THREE.MeshStandardMaterial({ color, metalness: .65, roughness: .3, emissive: color, emissiveIntensity: local ? .32 : .12 })
  );
  group.add(hull);
  const wingMaterial = new THREE.MeshStandardMaterial({ color: '#7890a8', metalness: .72, roughness: .35 });
  const wings = new THREE.Mesh(new THREE.BoxGeometry(1.25, .12, .16), wingMaterial);
  wings.position.y = -.18;
  group.add(wings);
  const engine = new THREE.Mesh(new THREE.CircleGeometry(.17, 20), new THREE.MeshBasicMaterial({ color: '#7ee7df' }));
  engine.position.set(0, -.61, .12);
  group.add(engine);
  if (local) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(.62, .68, 36), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .65 }));
    ring.position.z = -.08;
    group.add(ring);
  }
  return group;
}

function makeEnemy() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.OctahedronGeometry(.45, 0), new THREE.MeshStandardMaterial({ color: '#c95368', metalness: .7, roughness: .25, emissive: '#5b1020', emissiveIntensity: .55 }));
  body.scale.set(1.5, .75, .55);
  group.add(body);
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(.08, 10, 8), new THREE.MeshBasicMaterial({ color: '#ffb36e' }));
    eye.position.set(side * .22, -.05, .35);
    group.add(eye);
  }
  return group;
}

function makeBattery() {
  const group = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(.5, .75, .35, 8), new THREE.MeshStandardMaterial({ color: '#6e3d43', metalness: .65, roughness: .42 }));
  group.add(base);
  const turret = new THREE.Mesh(new THREE.CylinderGeometry(.12, .2, .85, 10), new THREE.MeshStandardMaterial({ color: '#a25759', metalness: .7, roughness: .3 }));
  turret.position.y = .48;
  group.add(turret);
  const muzzle = new THREE.Mesh(new THREE.SphereGeometry(.12, 12, 8), new THREE.MeshBasicMaterial({ color: '#ff755f' }));
  muzzle.position.y = .94;
  group.add(muzzle);
  return group;
}

function disposeObject(object) {
  object.traverse((child) => {
    child.geometry?.dispose();
    if (Array.isArray(child.material)) child.material.forEach((material) => material.dispose());
    else child.material?.dispose();
  });
}

export function prepareCombat(root, initialState, myId) {
  activeViews.get(root)?.dispose();
  const canvas = root.querySelector('canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.7));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#030812');
  scene.add(new THREE.HemisphereLight('#aacdff', '#271018', 2.4));
  const key = new THREE.DirectionalLight('#ffe2c4', 3.5);
  key.position.set(-5, 8, 8);
  scene.add(key);

  const starPositions = new Float32Array(900 * 3);
  for (let index = 0; index < starPositions.length; index += 3) {
    starPositions[index] = (Math.random() - .5) * 35;
    starPositions[index + 1] = (Math.random() - .5) * 24;
    starPositions[index + 2] = -2 - Math.random() * 12;
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: '#b9d9ee', size: .045, transparent: true, opacity: .8 }));
  scene.add(stars);

  const planetMaterial = new THREE.MeshStandardMaterial({ color: '#8d332f', roughness: .9, metalness: .03 });
  const planet = new THREE.Mesh(new THREE.SphereGeometry(5.6, 64, 48), planetMaterial);
  planet.position.set(0, 8.3, -5);
  scene.add(planet);
  const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(5.82, 48, 32), new THREE.MeshBasicMaterial({ color: '#ff6d59', transparent: true, opacity: .1, side: THREE.BackSide }));
  atmosphere.position.copy(planet.position);
  scene.add(atmosphere);

  const camera = new THREE.OrthographicCamera(-10, 10, 6, -6, .1, 50);
  camera.position.set(0, 0, 14);
  camera.lookAt(0, 0, 0);

  const ships = new Map();
  const enemies = new Map();
  const batteries = new Map();
  const shots = new Map();
  let state = initialState;
  let disposed = false;
  let frame = 0;

  function syncMap(items, map, create, update) {
    const live = new Set(items.map((item) => item.id));
    items.forEach((item) => {
      let object = map.get(item.id);
      if (!object) {
        object = create(item);
        map.set(item.id, object);
        scene.add(object);
      }
      update(object, item);
    });
    [...map.entries()].forEach(([id, object]) => {
      if (!live.has(id)) {
        scene.remove(object);
        disposeObject(object);
        map.delete(id);
      }
    });
  }

  function update(nextState) {
    state = nextState;
    const combat = state.combat;
    const playerItems = combat
      ? Object.values(combat.ships)
      : state.players.filter((player) => player.connected).map((player, index, crew) => ({ id: player.id, name: player.name, color: ['#7ee7df', '#82a9ff', '#9de4ad', '#ffc779'][index % 4], x: (index - (crew.length - 1) / 2) * 1.5, y: -3.5, hp: 100 }));
    syncMap(playerItems, ships, (item) => makeShip(item.color, item.id === myId), (object, item) => {
      object.userData.targetX = item.x;
      object.userData.targetY = item.y;
      object.visible = item.hp > 0;
    });
    syncMap(combat?.enemies || [], enemies, makeEnemy, (object, item) => {
      object.userData.targetX = item.x;
      object.userData.targetY = item.y;
      object.visible = item.hp > 0;
    });
    syncMap(combat?.batteries || [], batteries, makeBattery, (object, item) => {
      object.userData.targetX = item.x;
      object.userData.targetY = item.y;
      object.visible = item.hp > 0;
    });
    syncMap(combat?.shots || [], shots, (item) => new THREE.Mesh(
      new THREE.SphereGeometry(item.team === 'player' ? .09 : .14, 10, 8),
      new THREE.MeshBasicMaterial({ color: item.team === 'player' ? '#7ee7df' : '#ff655f' })
    ), (object, item) => {
      object.position.set(item.x, item.y, .5);
    });
  }

  const resize = () => {
    if (disposed || !root.isConnected) return;
    const width = root.clientWidth;
    const height = Math.max(1, root.clientHeight);
    const aspect = width / height;
    camera.left = -6 * aspect;
    camera.right = 6 * aspect;
    camera.top = 6;
    camera.bottom = -6;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(root);
  resize();
  update(initialState);
  const clock = new THREE.Clock();

  function animate() {
    if (disposed || !root.isConnected) return;
    frame = requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    stars.rotation.z = time * .002;
    planet.rotation.y = time * .018;
    atmosphere.scale.setScalar(1 + Math.sin(time * .7) * .004);
    ships.forEach((object, id) => {
      const approachOffset = state.phase === 'briefing' ? Math.max(0, 2.6 - (Date.now() - state.briefingStartedAt) / 2200) : 0;
      object.position.x += ((object.userData.targetX || 0) - object.position.x) * .12;
      object.position.y += ((object.userData.targetY || 0) - approachOffset - object.position.y) * .12;
      object.position.z = id === myId ? .8 : .25;
      const combatShip = state.combat?.ships?.[id];
      if (combatShip?.shieldUntil > (state.combat?.elapsed || 0)) {
        object.scale.setScalar(1 + Math.sin(time * 8) * .025);
      } else object.scale.setScalar(1);
    });
    enemies.forEach((object) => {
      object.position.x += ((object.userData.targetX || 0) - object.position.x) * .14;
      object.position.y += ((object.userData.targetY || 0) - object.position.y) * .14;
      object.position.z = .35;
      object.rotation.z = Math.sin(time * 2 + object.position.x) * .12;
    });
    batteries.forEach((object) => {
      object.position.x = object.userData.targetX || 0;
      object.position.y = object.userData.targetY || 0;
      object.position.z = -.2;
    });
    renderer.render(scene, camera);
  }
  animate();

  function dispose() {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    scene.traverse((object) => {
      object.geometry?.dispose();
      if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
      else object.material?.dispose();
    });
    renderer.dispose();
    activeViews.delete(root);
  }
  const view = { update, dispose };
  activeViews.set(root, view);
  return view;
}

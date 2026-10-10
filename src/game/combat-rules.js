export const ROLES = [
  { name: 'Scout', color: '#7ee7df', speed: 6.8, maxHp: 80, damage: 12, ability: 'BOOST' },
  { name: 'Guardian', color: '#82a9ff', speed: 5.3, maxHp: 120, damage: 10, ability: 'SHIELD' },
  { name: 'Engineer', color: '#9de4ad', speed: 5.7, maxHp: 95, damage: 9, ability: 'REPAIR' },
  { name: 'Striker', color: '#ffc779', speed: 6.1, maxHp: 90, damage: 16, ability: 'VOLLEY' }
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

export function publicCombatState(state) {
  const safe = { ...state, connections: {}, controls: {} };
  return JSON.parse(JSON.stringify(safe));
}

export function connectedPlayers(state) {
  return state.players.filter((player) => player.connected);
}

export function allAcknowledged(state) {
  const players = connectedPlayers(state);
  return players.length > 0 && players.every((player) => player.acknowledged);
}

export function roleForIndex(index) {
  return ROLES[index % ROLES.length];
}

export function createCombat(players) {
  const durability = Math.max(3, players.length * 1.5);
  const fighterPositions = [-4.2, -1.4, 1.4, 4.2].slice(0, Math.min(4, players.length));
  const ships = {};
  players.forEach((player, index) => {
    const role = roleForIndex(index);
    const column = index - (players.length - 1) / 2;
    ships[player.id] = {
      id: player.id,
      name: player.name,
      role: role.name,
      color: role.color,
      x: clamp(column * 1.7, -7.5, 7.5),
      y: -3.7 - Math.abs(column) * .18,
      hp: role.maxHp,
      maxHp: role.maxHp,
      fireCooldown: 0,
      abilityCooldown: 0,
      shieldUntil: 0,
      boostUntil: 0,
      disabled: false
    };
  });

  return {
    elapsed: 0,
    duration: 105,
    status: 'active',
    score: 0,
    ships,
    batteries: [-5.8, 0, 5.8].map((x, index) => ({ id: `battery-${index}`, x, y: 3.75, hp: 85 * durability, maxHp: 85 * durability, cooldown: .8 + index * .65 })),
    enemies: fighterPositions.map((x, index) => ({ id: `fighter-${index}`, x, y: 2.3 + (index % 2) * .8, hp: 38 * durability, maxHp: 38 * durability, cooldown: 1.2 + index * .35 })),
    shots: [],
    nextShotId: 1,
    lastEvent: 'INCOMING FIRE — BREAK FORMATION'
  };
}

function nearestTarget(combat, ship) {
  return [...combat.enemies, ...combat.batteries]
    .filter((target) => target.hp > 0)
    .sort((a, b) => distance(ship, a) - distance(ship, b))[0] || null;
}

function nearestShip(combat, source) {
  return Object.values(combat.ships)
    .filter((ship) => ship.hp > 0)
    .sort((a, b) => distance(source, a) - distance(source, b))[0] || null;
}

function distributedShip(combat, index, source) {
  const alive = Object.values(combat.ships).filter((ship) => ship.hp > 0);
  return alive[index % Math.max(1, alive.length)] || nearestShip(combat, source);
}

function addShot(combat, team, owner, source, target, speed, damage) {
  if (!target) return;
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const length = Math.max(.01, Math.hypot(dx, dy));
  combat.shots.push({
    id: `shot-${combat.nextShotId++}`,
    team,
    owner,
    targetId: target.id,
    x: source.x,
    y: source.y,
    vx: dx / length * speed,
    vy: dy / length * speed,
    damage,
    ttl: 3.5
  });
}

function useAbility(combat, ship, role) {
  if (ship.abilityCooldown > 0) return;
  ship.abilityCooldown = 9;
  if (role.name === 'Scout') {
    ship.boostUntil = combat.elapsed + 2.4;
    combat.lastEvent = `${ship.name} engaged boost`;
  } else if (role.name === 'Guardian') {
    Object.values(combat.ships).forEach((ally) => { if (ally.hp > 0) ally.shieldUntil = combat.elapsed + 2.8; });
    combat.lastEvent = `${ship.name} projected a fleet shield`;
  } else if (role.name === 'Engineer') {
    Object.values(combat.ships).forEach((ally) => { if (ally.hp > 0) ally.hp = Math.min(ally.maxHp, ally.hp + 18); });
    combat.lastEvent = `${ship.name} repaired the formation`;
  } else {
    const target = nearestTarget(combat, ship);
    addShot(combat, 'player', ship.id, { x: ship.x - .28, y: ship.y }, target, 11, role.damage);
    addShot(combat, 'player', ship.id, { x: ship.x + .28, y: ship.y }, target, 11, role.damage);
    combat.lastEvent = `${ship.name} launched a volley`;
  }
}

function targetById(combat, id) {
  return combat.enemies.find((target) => target.id === id)
    || combat.batteries.find((target) => target.id === id)
    || combat.ships[id]
    || null;
}

export function tickCombat(combat, players, controls, elapsedSeconds) {
  if (!combat || combat.status !== 'active') return combat;
  const dt = clamp(elapsedSeconds, 0, .12);
  combat.elapsed += dt;

  players.forEach((player, index) => {
    const ship = combat.ships[player.id];
    if (!ship || ship.hp <= 0) return;
    const role = roleForIndex(index);
    const input = controls[player.id] || {};
    const speed = role.speed * (ship.boostUntil > combat.elapsed ? 1.65 : 1);
    ship.x = clamp(ship.x + clamp(Number(input.x) || 0, -1, 1) * speed * dt, -9, 9);
    ship.y = clamp(ship.y + clamp(Number(input.y) || 0, -1, 1) * speed * dt, -5.2, 2.6);
    ship.fireCooldown = Math.max(0, ship.fireCooldown - dt);
    ship.abilityCooldown = Math.max(0, ship.abilityCooldown - dt);
    if (input.fire && ship.fireCooldown <= 0) {
      addShot(combat, 'player', ship.id, ship, nearestTarget(combat, ship), 10.5, role.damage);
      ship.fireCooldown = role.name === 'Striker' ? .32 : .45;
    }
    if (input.ability) useAbility(combat, ship, role);
  });

  combat.enemies.forEach((enemy, index) => {
    if (enemy.hp <= 0) return;
    const target = distributedShip(combat, index, enemy);
    if (!target) return;
    const desiredX = target.x + Math.sin(combat.elapsed * .8 + index) * 1.8;
    const desiredY = clamp(target.y + 2.4, -.5, 3);
    enemy.x += clamp(desiredX - enemy.x, -1, 1) * 1.45 * dt;
    enemy.y += clamp(desiredY - enemy.y, -1, 1) * 1.15 * dt;
    enemy.cooldown -= dt;
    if (enemy.cooldown <= 0) {
      addShot(combat, 'enemy', enemy.id, enemy, target, 5.5, 5);
      enemy.cooldown = 1.7 + (index % 3) * .35;
    }
  });

  combat.batteries.forEach((battery, index) => {
    if (battery.hp <= 0) return;
    battery.cooldown -= dt;
    if (battery.cooldown <= 0) {
      addShot(combat, 'enemy', battery.id, battery, distributedShip(combat, index, battery), 4.8, 7);
      battery.cooldown = 2.25 + index * .28;
    }
  });

  const remainingShots = [];
  combat.shots.forEach((shot) => {
    shot.ttl -= dt;
    const target = targetById(combat, shot.targetId);
    if (target?.hp > 0) {
      const dx = target.x - shot.x;
      const dy = target.y - shot.y;
      const length = Math.max(.01, Math.hypot(dx, dy));
      const speed = shot.team === 'player' ? 10.5 : 5.5;
      shot.vx += (dx / length * speed - shot.vx) * .09;
      shot.vy += (dy / length * speed - shot.vy) * .09;
    }
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    if (target?.hp > 0 && distance(shot, target) < .42) {
      const shielded = shot.team === 'enemy' && target.shieldUntil > combat.elapsed;
      target.hp = Math.max(0, target.hp - shot.damage * (shielded ? .25 : 1));
      if (target.hp === 0) {
        if (shot.team === 'player') combat.score += target.id.startsWith('battery') ? 300 : 120;
        combat.lastEvent = shot.team === 'player' ? `${target.id.startsWith('battery') ? 'Defense battery' : 'Interceptor'} disabled` : `${target.name} disabled`;
      }
      return;
    }
    if (shot.ttl > 0 && Math.abs(shot.x) < 13 && Math.abs(shot.y) < 9) remainingShots.push(shot);
  });
  combat.shots = remainingShots.slice(-90);

  const threatsRemain = [...combat.batteries, ...combat.enemies].some((target) => target.hp > 0);
  const fleetAlive = Object.values(combat.ships).some((ship) => ship.hp > 0);
  if (!threatsRemain) {
    combat.status = 'won';
    combat.score += Math.max(0, Math.round((combat.duration - combat.elapsed) * 10));
    combat.lastEvent = 'PLANETARY DEFENSE GRID DISABLED';
  } else if (!fleetAlive || combat.elapsed >= combat.duration) {
    combat.status = 'lost';
    combat.lastEvent = !fleetAlive ? 'FLEET DISABLED' : 'WITHDRAWAL WINDOW CLOSED';
  }
  return combat;
}

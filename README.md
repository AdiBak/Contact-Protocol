# Contact Protocol

**A cooperative fleet-combat mission for 2–8 players.** Approach a hostile alien planet in formation, take manual control when the defense grid opens fire, and combine specialized ship abilities to break the blockade.

## Play

The site is bundled with Vite and Three.js. Run `npm install` once and `npm run dev` for local development. Use `npm run build` for a production bundle.

Players need only a current browser. One player creates a fleet room and shares its six-character code. The host browser runs the authoritative battle simulation, while PeerJS provides signaling and direct WebRTC data connections between devices. No accounts or downloads are required.

## Cooperative game loop

1. **Approach:** The fleet flies toward Kharon on autopilot while mission rules type into each cockpit.
2. **Acknowledge:** Every pilot confirms the controls before manual flight is released.
3. **Ambush:** Planetary batteries fire and alien interceptors pursue the fleet.
4. **Coordinate:** Pilots steer and fire independently while Scout, Guardian, Engineer, and Striker abilities support the whole formation.
5. **Outcome:** Disable all threats before the fleet is destroyed or the withdrawal window closes.

Keyboard controls use WASD or arrows to steer, Space to fire, and E for the role ability. Touch devices receive a virtual flight stick and large ability/fire controls. Player weapons automatically track the nearest threat so the challenge stays focused on movement and cooperation.

## Project structure

- `index.html` — landing page, lobby controls, and metadata.
- `styles.css` — responsive cockpit, relay consoles, and visual design.
- `src/combat-app.js` — room-code multiplayer, synchronized briefing, input handling, and host simulation loop.
- `src/game/combat-rules.js` — ships, roles, enemies, projectiles, abilities, collision, and mission outcomes.
- `src/game/combat3d.js` — shared Three.js fleet approach and battle rendering.
- `src/game/text.js` — safe text rendering for player and signal content.

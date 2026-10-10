# Contact Protocol

**A cooperative alien-signal relay for 2–8 players.** Every operator receives a different fragment of an unknown transmission. Solve a private console, relay the result to the crew, and decide together how humanity should answer.

## Play

The site is bundled with Vite and Three.js. Run `npm install` once and `npm run dev` for local development. Use `npm run build` for a production bundle.

Players need only a current browser. One player creates a relay room and shares its six-character code. The host browser owns the game state, while PeerJS provides signaling and direct WebRTC data connections between devices. No accounts or downloads are required.

## Cooperative game loop

An encounter contains four shuffled transmissions:

1. **Solve:** Each player receives a private role console—pulse, symbols, navigation, systems, or another simple pattern puzzle.
2. **Relay:** Correct station work recovers a word or phrase. Players describe their fragments aloud because no one receives the complete message.
3. **Respond:** The crew uses the assembled fragments to choose a response independently. A strict majority establishes the crew response.
4. **Contact:** The cockpit reveals the outcome and records how many fragments the crew recovered.

The puzzles are self-contained and require no astronomy knowledge. The shared score combines correctly solved private stations with a three-point bonus for a correct majority response. The final contact log reports overall signal integrity rather than ranking individual players.

## Project structure

- `index.html` — landing page, lobby controls, and metadata.
- `styles.css` — responsive cockpit, relay consoles, and visual design.
- `src/relay-app.js` — room-code multiplayer, relay phases, and interaction handling.
- `src/content/signals.js` — authored transmissions, private station puzzles, and responses.
- `src/game/relay-rules.js` — private state, station resolution, scoring, and outcomes.
- `src/game/scene.js` — shared cockpit scene markup and instrument displays.
- `src/game/scene3d.js` — procedural Three.js environments and synchronized visual beats.
- `src/game/text.js` — safe text rendering for player and signal content.

# Contact Protocol

**A room-code science mystery for 2–8 players.** Work through five space-science missions, decide which evidence to investigate, then privately interpret what your crew uncovers.

## Play

Serve this folder as a static site, or deploy it to any static web host. Because the game uses JavaScript modules, open it through a web server rather than directly as a `file://` URL. For local play, run `python3 -m http.server 4173` in this folder and open `http://localhost:4173`. For multiplayer, use the deployed HTTPS URL, create a mission, and share the six-character room code. Friends join from their own devices. No account or app install is needed.

The game uses PeerJS for WebRTC signaling and direct peer-to-peer data connections. The player who creates the room hosts the game state in their browser; there is no application server or database. PeerJS Cloud is used as the signaling broker, and the default public STUN service is used for WebRTC connection discovery. Players need an internet connection, and some restrictive networks may prevent direct peer connections.

## Game loop

Each of five missions has two simultaneous-choice phases:

1. Each researcher privately locks one investigation. The crew sees the evidence returned by the distinct investigations its members chose.
2. Each researcher privately locks a hypothesis. The game reveals the answer, explains the relevant science, and updates individual and crew research points.

Correct hypotheses earn 2 research points. Choosing a high-value investigation earns 2 points, so sound scientific reasoning can score even when a prediction is wrong. The crew earns one point per distinct investigation used and two more when most connected researchers reach the correct conclusion. The highest individual score leads the crew leaderboard after mission five.

## Project structure

- `index.html` — page structure and metadata.
- `styles.css` — responsive visual design.
- `src/app.js` — lobby, multiplayer flow, and screen interaction.
- `src/content/missions.js` — mission prompts, investigation choices, evidence, and science explanations.
- `src/game/rules.js` — score resolution, phase readiness, and private state sent to players.
- `cover.svg` — project cover and social preview image.

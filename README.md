# Contact Protocol

**A cooperative room-code science mystery for 2–8 players.** Explore first-person mission scenes, pool observations, spend shared research energy, and decide what the evidence supports across five linked expeditions.

## Play

Serve this folder as a static site, or deploy it to a static web host. Because the game uses JavaScript modules, open it through a web server rather than as a `file://` URL. For local play, run `python3 -m http.server 4173` in this folder and open `http://localhost:4173`. For multiplayer, use the deployed HTTPS URL, create a mission, and share the six-character room code. Friends join from their own devices. No account or app install is needed.

The game uses PeerJS for WebRTC signaling and direct peer-to-peer data connections. The player who creates the room hosts the game state in their browser; there is no application server or database. PeerJS Cloud is used as the signaling broker, and the default public STUN service is used for WebRTC connection discovery. Players need an internet connection, and some restrictive networks may prevent direct peer connections.

## Cooperative game loop

Play five science missions together, from radio astronomy to ocean worlds. Each launch draws a different briefing and set of field clues for every case, so returning crews revisit the science with new information. Each mission adds a finding or open question to a shared expedition record:

1. **Explore:** Click points of interest in a first-person science scene. Discoveries are shared with the crew. A majority of connected researchers can move the crew on; inspecting every point is optional.
2. **Choose scans:** Each researcher privately votes for one scan. The crew has four shared research-energy units. Distinct scans are ranked by votes, with ties resolved by the order shown. The game funds scans in that order while they fit the remaining energy.
3. **Interpret:** Review the observations and funded scan evidence. Each researcher submits a hypothesis and confidence level privately. A hypothesis needs more than half the crew's votes to become the crew conclusion; a split vote is recorded as an open question. The debrief shows how the crew voted.
4. **Debrief:** The game explains the scientific finding, animates it into the expedition log, and updates the shared research score.

The crew earns 2 research points when a majority reaches the correct conclusion, plus 1 point for each funded scan that provides useful evidence (evidence value 2 or 3). If the crew is correct and average confidence is high (2.5 or above), it earns 1 calibration point. If the crew is wrong at that confidence, it loses 1 point. The expedition score cannot fall below zero. There is no individual leaderboard.

After mission five, the shared score determines the expedition outcome: 18–25 RP is a Scientific Breakthrough, 10–17 RP is a Promising Signal, and 0–9 RP means the investigation continues. The final field report shows every mission's conclusion, observations, funded scans, and score so the crew can see what its work produced.

## Project structure

- `index.html` — page structure and metadata.
- `styles.css` — responsive visual design, scene styling, and motion.
- `src/app.js` — lobby, room-code multiplayer flow, phase rendering, and interactions.
- `src/content/missions.js` — mission stories, scenes, points of interest, scans, evidence, and science explanations.
- `src/game/scene.js` — first-person scene illustration and clickable discovery markers.
- `src/game/rules.js` — shared budget, readiness, scoring, and privacy-safe state.
- `src/game/text.js` — safe text rendering for player and mission content.
- `cover.svg` — project cover and social preview image.

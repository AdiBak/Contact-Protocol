# Contact Protocol

**A cooperative split-clue game show for 2–8 players.** Every device receives a different piece of useful evidence. Players share what they found, then a rotating Captain submits one answer for the crew.

## Play

The site is bundled with Vite. Run `npm install` once and `npm run dev` for local development. Use `npm run build` for a production bundle.

Players need only a current browser. One player creates a room and shares its six-character code. The host browser manages the authoritative board and score, while PeerJS provides signaling and direct WebRTC data connections between devices. No accounts or downloads are required.

## Cooperative game loop

1. **Choose:** The rotating Captain selects a tile from the category board.
2. **Read:** Every player receives a different private fragment containing useful evidence.
3. **Discuss:** Players read their fragments aloud and reason through the three answer options.
4. **Answer:** Only the Captain locks the crew's final answer.
5. **Learn:** The game reveals the complete evidence and a concise explanation before rotating Captains.

Questions use authored multiple-choice answers, not AI judgment. Factual rounds use checkable patterns, calculations, or everyday science. Creative fictional rounds include all invented rules required to solve them in the clue fragments.

## Project structure

- `index.html` — landing page, lobby controls, and metadata.
- `jeopardy.css` — responsive landing page, board, clue, and result design.
- `src/jeopardy-app.js` — room-code multiplayer, rendering, and player interactions.
- `src/content/clues.js` — categories, evidence fragments, answer options, and explanations.
- `src/game/jeopardy-rules.js` — authoritative board, Captain rotation, scoring, and private player views.
- `src/game/text.js` — safe text rendering for player and signal content.

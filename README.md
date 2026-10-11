# Contact Protocol

**A cooperative museum investigation for 2–8 players.** The painting *The Blue Hour* disappears during a six-minute window. Every device receives a different verified record, and the crew must build a case before making one final accusation.

## Play

The site is bundled with Vite. Run `npm install` once and `npm run dev` for local development. Use `npm run build` for a production bundle.

Players need only a current browser. One player creates a room and shares its six-character code. The host browser manages the authoritative board and score, while PeerJS provides signaling and direct WebRTC data connections between devices. No accounts or downloads are required.

## Cooperative game loop

1. **Examine:** The rotating Captain selects one of twelve evidence files covering timelines, floor plans, physical evidence, and statements.
2. **Read:** Every player receives a different private fragment drawn from a verified case record.
3. **Discuss:** Players read their fragments aloud and reason through the three answer options.
4. **Deduce:** Only the Captain locks the crew's answer, adding a finding to the persistent case trail.
5. **Accuse:** After all files are reviewed, the crew identifies who took the painting, how it was moved, and where it was hidden.

Questions use authored multiple-choice answers, not AI judgment. Every deduction follows from explicit timestamps, dimensions, access records, independent statements, or physical traces. The ending compares the crew's accusation with the evidence and reconstructs the theft step by step.

## Project structure

- `index.html` — landing page, lobby controls, and metadata.
- `jeopardy.css` — responsive landing page, board, clue, and result design.
- `src/jeopardy-app.js` — room-code multiplayer, rendering, and player interactions.
- `src/content/case-clues.js` — the Bellweather case, evidence fragments, final solution, and reconstruction.
- `src/game/jeopardy-rules.js` — authoritative board, Captain rotation, scoring, and private player views.
- `src/game/text.js` — safe text rendering for player and signal content.

# The Evidence Room

**A cooperative investigation library for 2–8 players.** Vote on a category, choose one of five unique cases, share private evidence, and reconstruct a real outcome together.

## Play

The site is bundled with Vite. Run `npm install` once and `npm run dev` for local development. Use `npm run build` for a production bundle.

Players need only a current browser. One player creates a room and shares its six-character code. The host browser manages the authoritative votes, board, and score, while PeerJS provides signaling and direct WebRTC data connections between devices. No accounts or downloads are required.

## Cooperative game loop

1. **Vote:** Everyone votes on a category, then on one of five cases in that category. Majority wins; exact ties open a runoff.
2. **Examine:** The rotating Captain selects one of eight evidence files from the chosen case.
3. **Read:** Every player receives a different private fragment drawn from a verified record.
4. **Deduce:** Players share fragments aloud. Only the Captain locks the crew's answer, adding a finding to the trail.
5. **Close:** After all files are reviewed, the crew completes a three-part outcome and sees the reconstruction.

The library has 25 authored cases across **Case Files**, **Deep Space**, **Living Systems**, **World Atlas**, and **Everyday Intelligence**. Questions use authored multiple-choice answers, not AI judgment.

## Project structure

- `index.html` — landing page, lobby controls, and metadata.
- `jeopardy.css` — responsive landing page, voting, board, clue, and result design.
- `src/jeopardy-app.js` — room-code multiplayer, rendering, and player interactions.
- `src/content/case-library.js` — category and case lookup, plus schema normalization.
- `src/content/cases/` — five category modules with five eight-round cases each.
- `src/game/jeopardy-rules.js` — voting, board, Captain rotation, scoring, and private player views.
- `src/game/text.js` — safe text rendering for player and case content.

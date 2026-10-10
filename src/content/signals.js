export const signals = [
  {
    title: 'The Lantern Signal',
    tag: 'UNKNOWN BEACON',
    location: 'Outer-system relay station',
    brief: 'A quiet beacon repeats three fragments. Each station receives a different part of the transmission. Solve your console, then tell the crew what your fragment reveals.',
    transmission: '● ● ━  ● ● ━',
    kind: 'exoplanet',
    theme: { planet: 'Lantern', color: '#7ee7df', accent: '#ffc779', world: '#92745f', worldRadius: 5.2 },
    fragments: [
      { role: 'Pulse', icon: '◷', prompt: 'Which sequence exactly matches the incoming rhythm?', display: '● ● ━  ● ● ━', options: ['● ━ ●  ● ━ ●', '● ● ━  ● ● ━', '━ ● ●  ━ ● ●'], correct: 1, token: 'REPEATING' },
      { role: 'Pattern', icon: '◇', prompt: 'Complete the repeating symbol sequence.', display: '○ △ ○ △ ○ ?', options: ['○', '△', '□'], correct: 1, token: 'GREETING' },
      { role: 'Direction', icon: '⌖', prompt: 'The source stays fixed while nearby stars drift. What is it?', display: 'SOURCE LOCK · 100%', options: ['A fixed beacon', 'A passing object', 'Our own reflection'], correct: 0, token: 'BEACON' },
      { role: 'Tone', icon: '∿', prompt: 'Choose the clean tone hidden inside the static.', display: 'LOW · HIGH · LOW · HIGH', options: ['Alternating', 'Always low', 'Random'], correct: 0, token: 'ORDERED' }
    ],
    question: 'What is the safest first reply?',
    responses: ['Repeat the greeting pattern', 'Approach at full speed', 'Jam the transmission'],
    correct: 0,
    explanation: 'The repeating rhythm, greeting pattern, and fixed source describe an orderly beacon. Echoing its simple pattern acknowledges contact without making assumptions.'
  },
  {
    title: 'Storm in the Static',
    tag: 'DISTRESS RELAY',
    location: 'Charged nebula crossing',
    brief: 'A damaged transmission is breaking apart inside an electrical storm. Your consoles hold separate pieces of its location, condition, and urgency.',
    transmission: '━ ● ● ●  ━ ━  ●',
    kind: 'gamma',
    theme: { planet: 'Ion Veil', color: '#aaa0ff', accent: '#7ee7df', world: '#70688e', worldRadius: 4.8 },
    fragments: [
      { role: 'Pulse', icon: '◷', prompt: 'Which pulse is repeated as the signal weakens?', display: '━ ● ● ●  ━ ● ● ●', options: ['One long, three short', 'Three long, one short', 'All short'], correct: 0, token: 'DISTRESS' },
      { role: 'Map', icon: '⌖', prompt: 'Which marker lies inside the transmitted coordinates?', display: 'GRID C-7 · ORBITAL LANE', options: ['Station C-7', 'Moon A-2', 'Open space'], correct: 0, token: 'STATION C-7' },
      { role: 'Systems', icon: '⌁', prompt: 'The power trace drops every cycle. What does that indicate?', display: 'POWER 18% → 11% → 4%', options: ['Power is failing', 'Power is charging', 'Power is stable'], correct: 0, token: 'POWER FAILING' },
      { role: 'Clock', icon: '◴', prompt: 'How urgent is a countdown that reaches zero in two relays?', display: '02 RELAYS REMAIN', options: ['Immediate', 'Routine', 'Unknown'], correct: 0, token: 'IMMEDIATE' }
    ],
    question: 'How should the crew respond?',
    responses: ['Send a rescue drone to C-7', 'Wait for a clearer message', 'Broadcast the signal publicly'],
    correct: 0,
    explanation: 'Together, the fragments identify an immediate distress call from Station C-7 with failing power. A rescue drone is the fastest response that does not endanger the crew.'
  },
  {
    title: 'The Garden Archive',
    tag: 'DATA CAPSULE',
    location: 'Drifting archive capsule',
    brief: 'A dormant capsule wakes as the ship approaches. Its message mixes biological symbols, storage checks, and a careful request for acknowledgment.',
    transmission: '◇  DNA  ◇  ARCHIVE',
    kind: 'europa',
    theme: { planet: 'Verdant Archive', color: '#80e0d7', accent: '#b4a4ff', world: '#789488', worldRadius: 5.1 },
    fragments: [
      { role: 'Symbols', icon: '◇', prompt: 'Which symbol appears beside every living-cell diagram?', display: '◇ CELL · ◇ SEED · ◇ SPORE', options: ['◇', '○', '△'], correct: 0, token: 'BIOLOGICAL' },
      { role: 'Storage', icon: '▤', prompt: 'What does the repeated index describe?', display: 'RECORD 1/900 · RECORD 2/900', options: ['An archive', 'A countdown', 'A weapon'], correct: 0, token: 'ARCHIVE' },
      { role: 'Safety', icon: '⌁', prompt: 'The capsule requests isolation before opening. What is it asking for?', display: 'ISOLATE · VERIFY · OPEN', options: ['A quarantine check', 'Immediate destruction', 'A docking race'], correct: 0, token: 'QUARANTINE' },
      { role: 'Intent', icon: '✦', prompt: 'Which translation matches the final repeated glyph?', display: 'GIVE · PRESERVE · REMEMBER', options: ['A gift of knowledge', 'A demand for fuel', 'A navigation warning'], correct: 0, token: 'KNOWLEDGE GIFT' }
    ],
    question: 'What should happen next?',
    responses: ['Acknowledge, isolate, then copy the archive', 'Open it directly in the cockpit', 'Leave without responding'],
    correct: 0,
    explanation: 'The capsule is offering a biological archive and explicitly supplies a safety procedure. Acknowledging it and isolating the data respects both the gift and the warning.'
  },
  {
    title: 'The Mirror Choir',
    tag: 'MIMIC TRANSMISSION',
    location: 'Uncharted probe cluster',
    brief: 'A cloud of small probes begins copying the crew’s own broadcasts. Determine whether the reply shows understanding or only imitation.',
    transmission: 'YOU → ECHO → YOU',
    kind: 'pulsar',
    theme: { planet: 'Mirror Choir', color: '#6dc9cb', accent: '#ffc779', world: '#7794a2', worldRadius: 4.5 },
    fragments: [
      { role: 'Delay', icon: '◷', prompt: 'Every reply follows the ship by exactly the same delay. What does that suggest?', display: '+ 1.00s · + 1.00s · + 1.00s', options: ['Automatic copying', 'A changing conversation', 'Random noise'], correct: 0, token: 'AUTOMATIC' },
      { role: 'Language', icon: '⌁', prompt: 'The probes repeat a question but never answer it. What are they doing?', display: 'WHO ARE YOU? → WHO ARE YOU?', options: ['Echoing', 'Answering', 'Translating'], correct: 0, token: 'ECHOING' },
      { role: 'Formation', icon: '⌖', prompt: 'Which description matches the probe movement?', display: 'SHIP TURNS LEFT · PROBES TURN LEFT', options: ['Mirroring the ship', 'Blocking the ship', 'Leaving the area'], correct: 0, token: 'MIRRORING' },
      { role: 'Test', icon: '◇', prompt: 'Which message can distinguish copying from understanding?', display: 'CHOOSE A NEW RESPONSE', options: ['Ask for an original pattern', 'Repeat the same greeting', 'Transmit louder'], correct: 0, token: 'TEST ORIGINALITY' }
    ],
    question: 'What should the crew transmit?',
    responses: ['A request for a new, original pattern', 'The same message at higher power', 'A docking command'],
    correct: 0,
    explanation: 'Perfectly timed echoes and mirrored movement can come from automatic imitation. Asking for a novel pattern tests understanding without escalating the encounter.'
  }
];

export function signalForRound(state, catalog = signals) {
  const index = state.signalOrder?.[state.round] ?? state.round;
  return catalog[index] || catalog[0];
}

export function buildSignalOrder(length) {
  const order = Array.from({ length }, (_, index) => index);
  for (let index = order.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [order[index], order[swap]] = [order[swap], order[index]];
  }
  return order;
}

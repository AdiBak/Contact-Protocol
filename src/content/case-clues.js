export const CASE_FILE = {
  title: 'The Vanishing at Bellweather',
  object: 'The Blue Hour',
  opening: 'At 6:20 PM, minutes after the Bellweather Museum closed, an empty frame was found in Gallery Three. The painting The Blue Hour had vanished without triggering the public-exit alarm.',
  suspects: [
    { id: 'nora', name: 'Nora Chen', role: 'Museum curator' },
    { id: 'elliot', name: 'Elliot Shaw', role: 'Painting conservator' },
    { id: 'marcus', name: 'Marcus Reed', role: 'Security supervisor' },
    { id: 'leah', name: 'Leah Morgan', role: 'Event coordinator' }
  ],
  methods: [
    { id: 'frame', name: 'Carried out inside its frame' },
    { id: 'tube', name: 'Removed and rolled into an archival tube' },
    { id: 'crate', name: 'Packed flat inside a catering crate' }
  ],
  locations: [
    { id: 'locker-a', name: 'Staff Locker A' },
    { id: 'locker-b', name: 'Climate Locker B' },
    { id: 'van', name: 'The catering van' }
  ],
  solution: {
    suspect: 'elliot',
    method: 'tube',
    location: 'locker-b'
  },
  reconstruction: [
    'Elliot entered the east service corridor at 6:12 PM using his conservator badge.',
    'He released the conservation clips, leaving the empty frame and its intact alarm wire on the wall.',
    'He rolled the 72 cm canvas into the missing 80 cm archival tube and moved it on the blue-wheeled conservation trolley.',
    'At 6:18 PM, he opened Climate Locker B and hid the tube inside the oversized storage cabinet.'
  ]
};

export const CATEGORIES = [
  {
    id: 'timeline',
    name: 'Timeline',
    icon: '◷',
    description: 'Put verified events in the correct order.',
    clues: [
      {
        value: 100,
        prompt: 'The Gallery Three camera runs four minutes fast. When was its final image actually recorded?',
        display: 'CAMERA STAMP 6:18 PM  ·  CLOCK +4 MIN',
        options: ['6:14 PM', '6:18 PM', '6:22 PM'],
        answer: 0,
        fragments: [
          'A fast clock displays a later time than the real time.',
          'The technician measured the camera clock at exactly four minutes fast.',
          'Subtracting four minutes from 6:18 gives the actual time.',
          'The building’s master clock was verified as accurate that evening.'
        ],
        evidence: 'The painting was last visible at 6:14 PM actual time.',
        explanation: 'Because the camera was four minutes fast, its 6:18 timestamp corresponds to 6:14 PM.'
      },
      {
        value: 200,
        prompt: 'Whose location is independently confirmed throughout the disappearance window?',
        display: 'WINDOW: 6:14–6:20 PM',
        options: ['Nora Chen', 'Marcus Reed', 'Elliot Shaw'],
        answer: 1,
        fragments: [
          'The front-desk camera shows Marcus continuously from 6:08 to 6:22 PM.',
          'The front desk is a four-minute walk from Gallery Three.',
          'The footage contains no cuts, gaps, or missing frames.',
          'Two departing visitors also remember Marcus checking their bags at 6:17 PM.'
        ],
        evidence: 'Marcus remained at the front desk during the entire six-minute window.',
        explanation: 'Continuous footage and two witnesses independently place Marcus at the front desk.'
      },
      {
        value: 300,
        prompt: 'Which access record places a suspect inside the staff corridor before the painting vanished?',
        display: 'BADGE LOG · 6:12 PM · EAST SERVICE DOOR',
        options: ['Nora’s curator badge', 'Elliot’s conservator badge', 'Marcus’s security badge'],
        answer: 1,
        fragments: [
          'Badge 047 belongs to painting conservator Elliot Shaw.',
          'The east service door recorded badge 047 at 6:12 PM.',
          'The service corridor leads directly toward Gallery Three.',
          'No duplicate or replacement badge 047 has ever been issued.'
        ],
        evidence: 'Elliot’s badge entered the east service corridor at 6:12 PM.',
        explanation: 'The access system identifies badge 047 as Elliot’s and records it at the relevant entrance.'
      }
    ]
  },
  {
    id: 'floorplan',
    name: 'Floor Plan',
    icon: '⌗',
    description: 'Use routes, distances, and access points.',
    clues: [
      {
        value: 100,
        prompt: 'Which route connects Gallery Three to the conservation lab without crossing the public lobby?',
        display: 'GALLERY 3 → ? → CONSERVATION LAB',
        options: ['East service corridor', 'Main staircase', 'Sculpture courtyard'],
        answer: 0,
        fragments: [
          'The east service corridor has staff-only doors at both locations.',
          'The main staircase ends beside the staffed front desk.',
          'The courtyard door was locked from 5:45 PM onward.',
          'The museum floor plan shows a direct staff passage behind Gallery Three.'
        ],
        evidence: 'The east service corridor provided a private route from the gallery to conservation.',
        explanation: 'Only the east service corridor directly joins both rooms while avoiding the public lobby.'
      },
      {
        value: 200,
        prompt: 'A person walking normally needs two minutes from the service door to Gallery Three. Who could arrive before 6:14 PM?',
        display: 'ENTRY 6:12 PM  ·  WALK 2 MIN  ·  LAST IMAGE 6:14 PM',
        options: ['The 6:12 badge holder', 'The 6:15 visitor', 'The 6:20 delivery driver'],
        answer: 0,
        fragments: [
          'The staff badge opened the service door at exactly 6:12 PM.',
          'A timed walk from that door to the gallery takes two minutes.',
          'The corrected final camera image was recorded at 6:14 PM.',
          'The route has no locked door or checkpoint between those points.'
        ],
        evidence: 'The 6:12 badge holder could reach Gallery Three by 6:14 PM.',
        explanation: 'Adding the two-minute walk to the 6:12 entry gives an arrival time of 6:14.'
      },
      {
        value: 300,
        prompt: 'Which storage location could hold an 80 cm tube and was opened during the disappearance window?',
        display: 'TUBE LENGTH 80 cm',
        options: ['Locker A: 60 cm', 'Climate Locker B: 110 cm', 'Catering van: departed 6:05'],
        answer: 1,
        fragments: [
          'Staff Locker A is only 60 cm tall internally.',
          'Climate Locker B has 110 cm of clear vertical space.',
          'The catering van passed the exit camera at 6:05 PM.',
          'Climate Locker B recorded a key opening at 6:18 PM.'
        ],
        evidence: 'Climate Locker B could hold the tube and was opened at 6:18 PM.',
        explanation: 'Locker B is large enough for an 80 cm tube and was accessed during the relevant window.'
      }
    ]
  },
  {
    id: 'physical',
    name: 'Physical Evidence',
    icon: '⌕',
    description: 'Interpret measurements and material traces.',
    clues: [
      {
        value: 100,
        prompt: 'The empty frame remained wired to the wall alarm. What most likely left the gallery?',
        display: 'FRAME PRESENT · WIRE INTACT · CANVAS MISSING',
        options: ['The entire framed painting', 'Only the canvas', 'The wall alarm'],
        answer: 1,
        fragments: [
          'The wooden frame was still hanging in Gallery Three.',
          'Its alarm wire remained connected and unbroken.',
          'All twelve removable conservation clips had been released.',
          'The canvas itself was no longer inside the frame.'
        ],
        evidence: 'The canvas was removed while its wired frame stayed on the wall.',
        explanation: 'The intact frame and released clips show that only the canvas was taken.'
      },
      {
        value: 200,
        prompt: 'Which missing item could carry the rolled 72 cm-tall canvas?',
        display: 'CANVAS HEIGHT 72 cm',
        options: ['A 40 cm document case', 'An 80 cm archival tube', 'A 55 cm tool bag'],
        answer: 1,
        fragments: [
          'A canvas rolled along its shorter edge still needs a container longer than 72 cm.',
          'One 80 cm archival tube is missing from the conservation lab.',
          'The document case is 40 cm long and rigid.',
          'The tool bag’s longest internal dimension is 55 cm.'
        ],
        evidence: 'A missing 80 cm archival tube was long enough to carry the rolled canvas.',
        explanation: 'Only the 80 cm tube exceeds the canvas’s 72 cm rolled length.'
      },
      {
        value: 300,
        prompt: 'Blue rubber marks appear on the service corridor floor. Which equipment matches them?',
        display: 'TWO PARALLEL BLUE MARKS · 46 cm APART',
        options: ['Visitor wheelchair', 'Conservation trolley', 'Catering cart'],
        answer: 1,
        fragments: [
          'The conservation trolley has blue rubber wheels spaced 46 cm apart.',
          'Museum wheelchairs use gray tires spaced 58 cm apart.',
          'The catering carts have black wheels spaced 52 cm apart.',
          'The marks run from conservation toward Climate Locker B.'
        ],
        evidence: 'The conservation trolley moved from the lab toward Climate Locker B.',
        explanation: 'Its wheel color and exact 46 cm spacing uniquely match the floor marks.'
      }
    ]
  },
  {
    id: 'statements',
    name: 'Statements',
    icon: '“”',
    description: 'Compare claims with independent records.',
    clues: [
      {
        value: 100,
        prompt: 'Nora says she left before 6:10 PM. Which record best verifies that claim?',
        display: 'CLAIM: “I LEFT BEFORE 6:10.”',
        options: ['Her own calendar', 'Exit gate plus street camera', 'A draft email'],
        answer: 1,
        fragments: [
          'Nora’s badge passed the one-way exit gate at 6:07 PM.',
          'A street camera shows her outside the museum at 6:08 PM.',
          'Re-entry requires another badge scan, and none appears.',
          'The rideshare receipt records pickup outside at 6:09 PM.'
        ],
        evidence: 'Independent gate, camera, and rideshare records support Nora’s account.',
        explanation: 'Multiple independent timestamped records place Nora outside before the disappearance.'
      },
      {
        value: 200,
        prompt: 'Elliot says he never entered the museum after 6:00 PM. What directly contradicts him?',
        display: 'CLAIM: “I DID NOT GO BACK INSIDE.”',
        options: ['A weather report', 'His 6:12 badge entry', 'The visitor brochure'],
        answer: 1,
        fragments: [
          'Elliot says he kept his assigned badge with him all evening.',
          'The system records his badge at the east service door at 6:12 PM.',
          'That reader only logs a badge after the door successfully unlocks.',
          'System diagnostics show the reader operated normally that day.'
        ],
        evidence: 'Elliot’s 6:12 badge entry contradicts his statement.',
        explanation: 'His own badge successfully unlocked an interior entrance twelve minutes after he claimed to have left.'
      },
      {
        value: 300,
        prompt: 'Leah heard a wheeled object in the corridor at 6:16 PM. Which evidence independently supports her?',
        display: 'STATEMENT: WHEELS HEARD AT 6:16 PM',
        options: ['Blue wheel marks', 'A lunch receipt', 'A gallery brochure'],
        answer: 0,
        fragments: [
          'Fresh blue wheel marks cross the corridor’s newly cleaned floor.',
          'The marks lead away from the conservation lab.',
          'A cleaning photo from 5:50 PM shows no marks in that location.',
          'The conservation trolley is no longer in its marked parking bay.'
        ],
        evidence: 'Fresh trolley marks support Leah’s account of movement in the corridor.',
        explanation: 'The newly deposited wheel marks independently confirm that a trolley used the corridor.'
      }
    ]
  }
];

export const BOARD_SIZE = CATEGORIES.reduce((sum, category) => sum + category.clues.length, 0);
export const MAX_ROUNDS = BOARD_SIZE;

export const CATEGORIES = [
  {
    id: 'patterns',
    name: 'Signal Patterns',
    icon: '⌁',
    description: 'Find the rule hiding inside a transmission.',
    clues: [
      {
        value: 100,
        prompt: 'The next pulse is missing. What belongs in the gap?',
        display: '●  ●●  ●●●  ?',
        options: ['●●●●', '●●', '●●●●●'],
        answer: 0,
        fragments: [
          'Each group contains one more pulse than the last.',
          'The first three groups contain 1, 2, and 3 pulses.',
          'The spacing between groups does not change.',
          'CORRUPTED: Every group should contain an odd number of pulses.'
        ],
        corrupt: 3,
        explanation: 'The groups increase by one pulse: 1, 2, 3, then 4.'
      },
      {
        value: 200,
        prompt: 'Which symbol completes this repeating transmission?',
        display: '▲  ○  ○  ▲  ○  ○  ▲  ?',
        options: ['▲', '○', '■'],
        answer: 1,
        fragments: [
          'The transmission repeats in groups of three.',
          'Every triangle is followed by two circles.',
          'Positions 1, 4, and 7 match.',
          'CORRUPTED: A triangle always follows another triangle.'
        ],
        corrupt: 3,
        explanation: 'The repeating unit is triangle, circle, circle.'
      },
      {
        value: 300,
        prompt: 'The receiver converts colors into numbers. Decode the final pair.',
        display: 'BLUE = 4  ·  RED = 3  ·  GREEN = 5  ·  GOLD = ?',
        options: ['3', '4', '5'],
        answer: 1,
        fragments: [
          'The number tracks a visible property of the written word.',
          'BLUE has four letters and GREEN has five.',
          'No arithmetic is needed.',
          'CORRUPTED: The number counts curved letters.'
        ],
        corrupt: 3,
        explanation: 'Each number is simply the number of letters in the color.'
      },
      {
        value: 400,
        prompt: 'Four beacons flash in sequence. Which beacon flashes eighth?',
        display: 'A  B  D  C  ·  A  B  D  ?',
        options: ['A', 'C', 'D'],
        answer: 1,
        fragments: [
          'The sequence restarts after four flashes.',
          'The fourth flash was C.',
          'Flashes five through seven match flashes one through three.',
          'CORRUPTED: The beacons are in alphabetical order.'
        ],
        corrupt: 3,
        explanation: 'The four-beacon sequence A–B–D–C repeats, so the eighth is C.'
      }
    ]
  },
  {
    id: 'protocol',
    name: 'Alien Etiquette',
    icon: '◇',
    description: 'Infer unfamiliar customs from examples.',
    clues: [
      {
        value: 100,
        prompt: 'A visitor offers you a glowing stone with both hands. What is the safest response?',
        display: 'THE VELARI GREETING',
        options: ['Accept with both hands', 'Turn away', 'Throw your own stone'],
        answer: 0,
        fragments: [
          'The archive shows honored gifts received with two hands.',
          'Mirroring a peaceful gesture is considered respectful.',
          'The visitor is standing calmly and has lowered their guard.',
          'CORRUPTED: Velari greetings always begin with throwing objects.'
        ],
        corrupt: 3,
        explanation: 'The examples establish that mirroring the two-handed gesture is respectful.'
      },
      {
        value: 200,
        prompt: 'At a Zorian meal, every guest leaves one bite untouched. Why?',
        display: 'ONE BITE REMAINS',
        options: ['It signals satisfaction', 'The food is poisonous', 'It marks the youngest guest'],
        answer: 0,
        fragments: [
          'Empty plates imply the host did not provide enough.',
          'Past banquets end with one ceremonial bite remaining.',
          'Guests thank the host after leaving the final bite.',
          'CORRUPTED: Zorians cannot see the last bite on a plate.'
        ],
        corrupt: 3,
        explanation: 'Leaving a little food indicates that the host provided more than enough.'
      },
      {
        value: 300,
        prompt: 'The Kesh ambassador pauses for exactly three seconds before every reply. What should you do?',
        display: '… 3.0 SECONDS …',
        options: ['Wait without interrupting', 'Repeat the question louder', 'Answer for them'],
        answer: 0,
        fragments: [
          'Kesh records call the pause “the space for thought.”',
          'Interruptions ended two previous negotiations early.',
          'The ambassador maintains friendly eye contact during the pause.',
          'CORRUPTED: Silence means the translator has stopped working.'
        ],
        corrupt: 3,
        explanation: 'The pause is a deliberate sign of thoughtful respect, not confusion.'
      },
      {
        value: 400,
        prompt: 'Three doors are marked with water, flame, and a blank circle. Which enters the council chamber?',
        display: '≈   △   ○',
        options: ['Water', 'Flame', 'Blank circle'],
        answer: 2,
        fragments: [
          'Water marks private quarters.',
          'Flame marks kitchens and workshops.',
          'Public spaces use an unfilled circle.',
          'CORRUPTED: Council chambers are always below a flame symbol.'
        ],
        corrupt: 3,
        explanation: 'The unfilled circle consistently marks public gathering spaces.'
      }
    ]
  },
  {
    id: 'oddity',
    name: 'Spot the Glitch',
    icon: '◫',
    description: 'One detail does not belong.',
    clues: [
      {
        value: 100,
        prompt: 'Which object cannot belong in this zero-gravity cabin?',
        display: 'MAGNETIC CUP · TETHERED PEN · OPEN FISHBOWL',
        options: ['Magnetic cup', 'Tethered pen', 'Open fishbowl'],
        answer: 2,
        fragments: [
          'Loose liquids form drifting blobs in zero gravity.',
          'Small tools are normally tethered so they cannot float away.',
          'Magnetic bases can hold containers to metal surfaces.',
          'CORRUPTED: Water always stays flat without gravity.'
        ],
        corrupt: 3,
        explanation: 'An open fishbowl would release floating water throughout the cabin.'
      },
      {
        value: 200,
        prompt: 'A security log contains one impossible entry. Which one?',
        display: '08:00 ARRIVAL · 08:14 MEETING · 08:09 DEPARTURE',
        options: ['Arrival', 'Meeting', 'Departure'],
        answer: 2,
        fragments: [
          'The entries describe one visitor’s trip in chronological order.',
          'A departure must occur after the meeting.',
          'The timestamps use the same local clock.',
          'CORRUPTED: The meeting began before the visitor arrived.'
        ],
        corrupt: 3,
        explanation: 'The visitor cannot depart at 08:09 and then attend the 08:14 meeting.'
      },
      {
        value: 300,
        prompt: 'One sensor must be malfunctioning. Which reading conflicts with the others?',
        display: 'WINDOW: DARK · CLOCK: 02:00 · SUNLIGHT: HIGH',
        options: ['Window', 'Clock', 'Sunlight sensor'],
        answer: 2,
        fragments: [
          'The station is on the night side of its planet.',
          'Exterior cameras also show darkness.',
          'The clock and window agree that it is local night.',
          'CORRUPTED: High sunlight is expected in the middle of the night.'
        ],
        corrupt: 3,
        explanation: 'The sunlight reading contradicts both independent signs that it is night.'
      },
      {
        value: 400,
        prompt: 'Which cargo claim cannot be true?',
        display: 'CRATE: 2 m WIDE · DOOR: 1 m WIDE · “CARRIED THROUGH INTACT”',
        options: ['The crate is 2 m wide', 'The door is 1 m wide', 'It passed through intact'],
        answer: 2,
        fragments: [
          'The crate is rigid and cannot be folded.',
          'The doorway has no removable panels.',
          'The measurements use the same unit.',
          'CORRUPTED: A rigid 2 m object always fits through a 1 m opening.'
        ],
        corrupt: 3,
        explanation: 'Given the fixed dimensions, the intact crate could not pass through that door.'
      }
    ]
  },
  {
    id: 'estimate',
    name: 'Closest Wins',
    icon: '◎',
    description: 'Reason it out—exact knowledge is not required.',
    clues: [
      {
        value: 100,
        prompt: 'A light signal travels around Earth. Which time is closest?',
        display: 'ONE LAP AROUND EARTH',
        options: ['0.13 seconds', '13 seconds', '13 minutes'],
        answer: 0,
        fragments: [
          'Light travels roughly 300,000 km each second.',
          'Earth is roughly 40,000 km around.',
          'The trip is much shorter than one second.',
          'CORRUPTED: Light needs several minutes to cross a city.'
        ],
        corrupt: 3,
        explanation: '40,000 ÷ 300,000 is about 0.13 seconds.'
      },
      {
        value: 200,
        prompt: 'How many Earths could fit side by side across Jupiter?',
        display: 'EARTHS ACROSS JUPITER',
        options: ['About 3', 'About 11', 'About 100'],
        answer: 1,
        fragments: [
          'Jupiter’s diameter is about 140,000 km.',
          'Earth’s diameter is about 12,700 km.',
          'The larger number is roughly eleven times the smaller.',
          'CORRUPTED: Jupiter and Earth are almost the same width.'
        ],
        corrupt: 3,
        explanation: 'Jupiter is approximately eleven Earth diameters wide.'
      },
      {
        value: 300,
        prompt: 'A rover moves 100 meters every minute. Roughly how long for 6 km?',
        display: '100 m/min → 6 km',
        options: ['6 minutes', '1 hour', '10 hours'],
        answer: 1,
        fragments: [
          'Six kilometers equals 6,000 meters.',
          'Ten minutes covers 1,000 meters.',
          'Sixty groups of 100 meters make 6,000.',
          'CORRUPTED: One kilometer equals 100 meters.'
        ],
        corrupt: 3,
        explanation: '6,000 meters at 100 meters per minute takes 60 minutes.'
      },
      {
        value: 400,
        prompt: 'The crew has 48 oxygen packs. Eight people use one every six hours. How long do they last?',
        display: '48 PACKS · 8 CREW · 1 PACK / 6 HOURS',
        options: ['6 hours', '36 hours', '288 hours'],
        answer: 1,
        fragments: [
          'The whole crew consumes eight packs every six hours.',
          'Forty-eight packs provide six complete rounds.',
          'Six rounds multiplied by six hours gives 36 hours.',
          'CORRUPTED: All eight people share one pack per six hours.'
        ],
        corrupt: 3,
        explanation: 'The crew gets six rounds of packs, each lasting six hours: 36 hours.'
      }
    ]
  }
];

export const BOARD_SIZE = CATEGORIES.reduce((sum, category) => sum + category.clues.length, 0);
export const MAX_ROUNDS = 8;

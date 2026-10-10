export const missions = [
  {
    title: 'The Quiet Pulse', tag: 'RADIO ASTRONOMY', location: 'Deep-space observatory',
    brief: 'A faint radio source flashes toward Earth every 1.37 seconds. Its rhythm is astonishingly steady, and the source sits far beyond our solar system. What is making the beat?',
    theme: { planet: 'Asterion', kind: 'pulsar', color: '#6dc9cb', accent: '#ffc779', world: '#dcecff', x: 530, y: 154, r: 68 },
    hotspots: [
      { id: 'array', title: 'Telescope array', icon: '⌖', x: 19, y: 56, text: 'Several radio dishes are tracking the same patch of sky. Their shared pointing lets the crew rule out a signal coming from a single nearby instrument.' },
      { id: 'timing', title: 'Pulse chronometer', icon: '◷', x: 51, y: 61, text: 'The pulses arrive like clockwork, but the beat slows by a tiny amount over years. That gradual change may reveal how the source moves and loses energy.' },
      { id: 'spectrum', title: 'Spectrum console', icon: '∿', x: 80, y: 49, text: 'The signal is spread across radio frequencies as it crosses space. The pattern acts like a fingerprint of distance and energetic surroundings.' }
    ],
    tests: [
      { name: 'Map its position', icon: '⌖', desc: 'Pinpoint the source against distant stars.', cost: 1, evidence: 'The flashes come from one fixed point in the sky, not a satellite or nearby transmitter.', value: 1 },
      { name: 'Measure the rhythm', icon: '◷', desc: 'Track how each pulse arrives over time.', cost: 3, evidence: 'The 1.37-second rhythm is extraordinarily regular, with a tiny slowdown measured across years.', value: 3 },
      { name: 'Split the radio waves', icon: '∿', desc: 'Compare how different frequencies arrive.', cost: 2, evidence: 'The signal sweeps through a pattern of dispersed radio frequencies characteristic of a distant, energetic source.', value: 2 }
    ],
    answers: ['A rotating neutron star', 'A message from an alien beacon', 'A reflection from a planet'], correct: 0,
    why: 'A pulsar is a rapidly rotating neutron star whose beams sweep past Earth like a lighthouse. Its remarkably regular pulses—and gradual spin-down—fit that picture. A repeating signal alone would not prove intelligence; we look for natural explanations first.',
    variants: [{ brief: 'The array detects a radio flash every 1.37 seconds. A faint X-ray source sits at the same coordinates, and the radio beat has slowed over years. What engine could keep such time?', hotspotTexts: ['Independent dishes record the same arrival times. A local electronics fault would not naturally reproduce across separated instruments.', 'The pulse period is increasing by a few nanoseconds per day. A spinning object can slow as it radiates energy.', 'Lower-frequency radio waves arrive later than higher-frequency ones, a signature of a signal traveling through thin interstellar plasma.'], testEvidence: ['Independent dishes point to the same fixed sky position, making a single nearby transmitter less likely.', 'Timing data show a steady 1.37-second pulse and a gradual spin-down, matching a rotating compact star.', 'The frequency-dependent delay reveals dispersed radio waves that have traveled through interstellar space.'] }]
  },
  {
    title: 'A Star Blinks', tag: 'EXOPLANET SCIENCE', location: 'Orbital planet-hunter',
    brief: 'A Sun-like star dims by about 1% for three hours every 24 days. The dip repeats with clockwork timing. A small world may be crossing in front of its star—but is there another explanation?',
    theme: { planet: 'Kepler Reach', color: '#a69af9', accent: '#81e5d9', world: '#ae7564', x: 610, y: 156, r: 59 },
    hotspots: [
      { id: 'photometer', title: 'Light-curve display', icon: '◉', x: 22, y: 51, text: 'The star’s brightness dips at regular intervals. The repeated shape gives the team a clue about the size and orbit of whatever is passing in front.' },
      { id: 'spectrograph', title: 'Spectrograph', icon: '◈', x: 52, y: 62, text: 'Different colors of starlight can reveal whether the dimming comes from a solid world or from dust that blocks some colors more than others.' },
      { id: 'startracker', title: 'Stellar motion tracker', icon: '↝', x: 80, y: 48, text: 'A planet’s gravity tugs on its star. Measuring a tiny wobble can provide an independent check on a transit seen in the light curve.' }
    ],
    tests: [
      { name: 'Watch another cycle', icon: '◉', desc: 'Check whether the dip repeats on schedule.', cost: 2, evidence: 'The star dims by the same amount every 24 days, with a consistent, rounded dip each time.', value: 3 },
      { name: 'Compare star colors', icon: '◈', desc: 'Measure the dip in different wavelengths.', cost: 1, evidence: 'The dip is nearly the same depth across visible colors, as expected when a solid object blocks starlight.', value: 2 },
      { name: 'Weigh the star’s wobble', icon: '↝', desc: 'Look for a planet tugging on its star.', cost: 3, evidence: 'A tiny repeating wobble in the star matches the same 24-day orbit.', value: 3 }
    ],
    answers: ['A planet crossing in front of its star', 'A large cloud of dust passing by', 'The star switching off briefly'], correct: 0,
    why: 'A regularly repeating transit with a consistent depth is strong evidence for an orbiting planet. The star’s wobble adds an independent clue: the planet’s gravity tugs on its star. Astronomers combine methods because any one measurement can mislead.',
    variants: [{ brief: 'A quiet Sun-like star loses about 1% of its light for three hours, every 24 days. The dip looks nearly the same in four observing seasons. Is something orbiting the star—or changing on its surface?', hotspotTexts: ['The repeated dips share nearly the same depth and duration, a pattern expected from a regularly orbiting object.', 'A dusty cloud often blocks blue light more strongly than red. Comparing colors can test that alternative.', 'The star shows a tiny motion in the opposite rhythm to the dip, as if an orbiting companion were tugging on it.'], testEvidence: ['Four observing seasons show a dip every 24 days with a consistent shape and depth.', 'The dip is nearly equal in blue and red light, which weakens the dust-cloud explanation.', 'The star’s repeating wobble shares the transit period, an independent sign of an orbiting companion.'] }]
  },
  {
    title: 'The Red Planet Rumor', tag: 'PLANETARY SCIENCE', location: 'Mars rover field site',
    brief: 'A rover detects a brief rise in methane near the surface of Mars. On Earth, living things can make methane. So can geology. One exciting clue is not the same as an answer.',
    theme: { planet: 'Meridian Plain', color: '#ffc17d', accent: '#7ee7df', world: '#bd664d', x: 590, y: 162, r: 83 },
    hotspots: [
      { id: 'rover', title: 'Rover sample arm', icon: '⚗', x: 19, y: 59, text: 'The rover collected a small sample close to a fractured rock. The amount of gas is near the instrument’s detection limit, so repeat measurements matter.' },
      { id: 'weather', title: 'Atmosphere monitor', icon: '⌁', x: 52, y: 50, text: 'Temperature and wind can move or concentrate gases near the ground. A plume’s location may point to a source, but does not identify it by itself.' },
      { id: 'terrain', title: 'Fracture map', icon: '⌖', x: 82, y: 61, text: 'The methane reading is near cracked rock. Water-rock chemistry can produce methane without life, making the local geology an important alternative.' }
    ],
    tests: [
      { name: 'Sample it again', icon: '⟳', desc: 'Check whether the signal returns over time.', cost: 1, evidence: 'Methane levels rise and fall with local conditions; the pattern has not yet repeated in a way that identifies its source.', value: 2 },
      { name: 'Check the chemistry', icon: '⚗', desc: 'Look for companion gases and isotopes.', cost: 3, evidence: 'The sample is too small to separate biological methane from several known geological sources.', value: 3 },
      { name: 'Trace the air', icon: '⌁', desc: 'Map where and when the plume appears.', cost: 2, evidence: 'The methane reading is localized near fractured rock, a place where geological reactions can occur.', value: 2 }
    ],
    answers: ['Life is confirmed on Mars', 'The source is still uncertain', 'A volcano is definitely erupting'], correct: 1,
    why: 'Methane can come from life, water-rock chemistry, or other processes. A short-lived detection—especially one affected by measurement limits—cannot identify its source. Scientists need repeated measurements and additional chemical clues before drawing a conclusion.',
    variants: [{ brief: 'A rover sensor records a methane spike just before sunrise in a shallow crater. The reading fades by midday. Biology is one possibility, but the timing and local rocks leave several explanations open.', hotspotTexts: ['The sample arm warmed before the reading. Temperature can affect a trace-gas measurement, so an independent repeat is valuable.', 'The morning atmosphere is calmer than midday air. Local weather can concentrate or disperse gases without identifying their source.', 'A nearby mineral vein could react with water and release methane through non-biological chemistry.'], testEvidence: ['A later reading did not reproduce the spike; the first signal remains near the instrument’s detection limit.', 'The short-lived plume appeared near fractured rock where non-biological water-rock reactions are possible.', 'The sample is too small to measure isotope ratios reliably, so biology cannot be separated from geological sources.'] }]
  },
  {
    title: 'A Flash in the Deep', tag: 'HIGH-ENERGY ASTROPHYSICS', location: 'Deep-field sensor array',
    brief: 'A detector catches a brilliant flash of gamma rays. Seconds later, telescopes find a fading afterglow in a distant galaxy. The event is brief, violent, and rare.',
    theme: { planet: 'Farpoint Array', color: '#b5a0ff', accent: '#ffc779', world: '#967fae', x: 492, y: 156, r: 54 },
    hotspots: [
      { id: 'detector', title: 'Gamma-ray detector', icon: '✧', x: 20, y: 49, text: 'The initial flash was brief and extremely energetic. Multiple detectors can help establish whether it was a cosmic event or a local instrument artifact.' },
      { id: 'afterglow', title: 'Afterglow telescope', icon: '◉', x: 51, y: 60, text: 'The light left behind fades and changes color over time. That evolution can reveal fast-moving material cooling after a powerful explosion.' },
      { id: 'wavearray', title: 'Gravitational-wave link', icon: '≋', x: 80, y: 49, text: 'A search for spacetime ripples can test some cosmic-explosion models. No detection is not proof of absence: distance and sensitivity matter.' }
    ],
    tests: [
      { name: 'Follow the fading light', icon: '✧', desc: 'Measure how its color changes.', cost: 2, evidence: 'The afterglow reddens and fades over days, consistent with fast-moving debris cooling down.', value: 2 },
      { name: 'Pinpoint the source', icon: '⌖', desc: 'Compare detections from several observatories.', cost: 2, evidence: 'The burst came from a galaxy billions of light-years away; multiple spacecraft detected it nearly together.', value: 2 },
      { name: 'Listen for gravitational waves', icon: '≋', desc: 'Search the same moment for spacetime ripples.', cost: 1, evidence: 'No matching gravitational-wave event was recorded, though distance and detector sensitivity limit what can be ruled out.', value: 1 }
    ],
    answers: ['A distant gamma-ray burst from a cosmic explosion', 'A nearby star flaring in our sky', 'A routine signal sent by a spacecraft'], correct: 0,
    why: 'Gamma-ray bursts are among the most energetic events known. Their afterglows and distant host galaxies link them to cosmic explosions. A missing gravitational-wave detection does not rule out an event; instruments have limits and not all bursts produce a detectable signal.',
    variants: [{ brief: 'A spaceborne detector catches a two-second gamma-ray flash. A fading point of light appears in a distant galaxy hours later. The flash is real; its exact source still needs evidence.', hotspotTexts: ['Two spacecraft separated by millions of kilometers registered the burst. Their timing helps rule out a local detector glitch.', 'The afterglow shifts toward redder light while fading, as fast-moving debris cools and expands.', 'The gravitational-wave search found no matching event, but distance and detector sensitivity limit what a non-detection can tell us.'], testEvidence: ['The afterglow cools and reddens over several days, consistent with expanding material from a distant explosion.', 'Independent spacecraft detections triangulate the burst to a distant galaxy, rather than a nearby flare.', 'No gravitational-wave counterpart was detected; that constrains some models but cannot rule out a distant burst.'] }]
  },
  {
    title: 'A Breath from Europa', tag: 'OCEAN WORLDS', location: 'Europa ice-orbit surveyor',
    brief: 'A telescope spots water vapor above a crack in Europa’s icy shell. The moon may hide a salty ocean beneath its surface. Does a plume tell us what that ocean contains?',
    theme: { planet: 'Europa Survey', color: '#80e0d7', accent: '#b4a4ff', world: '#d5c7ab', x: 570, y: 162, r: 88 },
    hotspots: [
      { id: 'plume', title: 'Plume spectrometer', icon: '⌁', x: 20, y: 52, text: 'Water vapor appears above a crack, but the spectrum is faint. A precise chemical fingerprint would help identify what the plume contains.' },
      { id: 'fracture', title: 'Ice fracture camera', icon: '◷', x: 51, y: 61, text: 'The plume candidate appears near a fracture in the icy shell. Repeated observations could show whether it changes with Europa’s orbit.' },
      { id: 'radar', title: 'Subsurface radar', icon: '◈', x: 81, y: 49, text: 'Europa’s surface gives evidence for a hidden ocean, but a surface plume observation does not yet prove the vapor came from that ocean.' }
    ],
    tests: [
      { name: 'Analyze the vapor', icon: '⌁', desc: 'Look for salts and organic molecules.', cost: 2, evidence: 'Water vapor is detected, but the available spectrum is not detailed enough to identify complex molecules.', value: 2 },
      { name: 'Watch the cracks', icon: '◷', desc: 'Compare the plume with tidal flexing.', cost: 1, evidence: 'The plume candidate appears near a fracture; repeat observations are needed to establish how it changes with Europa’s orbit.', value: 2 },
      { name: 'Search for ocean clues', icon: '◈', desc: 'Look for material that may have come from below.', cost: 3, evidence: 'Europa’s surface has evidence of an ocean beneath the ice, but this observation does not yet connect the vapor to that ocean.', value: 3 }
    ],
    answers: ['The plume proves there is life', 'Europa may have a subsurface ocean; its plume needs more study', 'The vapor must come from a volcano'], correct: 1,
    why: 'Europa likely has a global ocean beneath its ice, making it a compelling place to study habitability. A possible plume is exciting, but it does not by itself prove the material came from the ocean—or that life is present. Future observations and spacecraft measurements can test those ideas.',
    variants: [{ brief: 'A spectrometer catches a brief water-vapor signal above Europa’s fractured ice. The candidate plume appears during one pass and vanishes on the next. Could it sample the ocean below—or something nearer the surface?', hotspotTexts: ['The vapor fingerprint is consistent with water, but faint data leave its salts and other trace ingredients unresolved.', 'The signal appeared during one orbital pass. Repeated viewing can test whether tidal flexing opens the crack on a schedule.', 'Radar hints at a deep ocean beneath the ice. That makes an ocean source plausible, but does not connect this particular vapor signal to it.'], testEvidence: ['The spectrum confirms water vapor but is too faint to identify salts or complex organic molecules.', 'The candidate plume coincided with a tidal phase once; more passes are needed to see if the timing repeats.', 'Radar and surface geology support a hidden ocean, but the vapor’s route from depth to space remains unproven.'] }]
  }
];

export function missionForRound(state, catalog) {
  const mission = catalog[state.missionOrder?.[state.round] ?? state.round] || catalog[0];
  const variant = mission.variants?.[state.missionVariants?.[state.round] || 0];
  if (!variant) return mission;
  return {
    ...mission,
    brief: variant.brief || mission.brief,
    hotspots: mission.hotspots.map((point, index) => ({ ...point, text: variant.hotspotTexts?.[index] || point.text })),
    tests: mission.tests.map((test, index) => ({ ...test, evidence: variant.testEvidence?.[index] || test.evidence }))
  };
}

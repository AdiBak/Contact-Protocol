export const geographyCategory = {
  id: 'world-atlas',
  name: 'World Atlas',
  icon: '◇',
  description: 'Use maps, scale, terrain, water flow, and time zones to make practical navigation decisions.',
  cases: [
    {
      id: 'lost-aurora-route',
      title: 'The Lost Aurora Route',
      subtitle: 'Reconstruct a survey team’s final day',
      hook: 'The Aurora survey team missed its pickup. Rebuild its route from the field log and direct search crews to the correct camp.',
      sections: [
        {
          id: 'departure',
          title: 'Departure',
          rounds: [
            {
              value: 100,
              prompt: 'Which trail did the team take from Base Camp?',
              display: 'LOG 07:10 · FOLLOWED RIVER UPSTREAM',
              options: ['West Trail', 'North Trail', 'East Trail'],
              answer: 1,
              fragments: [
                'The map shows only the North Trail following the river upstream from Base Camp.',
                'The 07:10 log says the team left Base Camp by the trail that follows the river upstream.',
                'The West Trail immediately crosses dry scrubland.',
                'The East Trail follows the river downstream.'
              ],
              evidence: 'At 07:10 the team departed Base Camp on the North Trail.',
              explanation: 'The log specifies an upstream river trail, and the map assigns that description only to the North Trail.'
            },
            {
              value: 200,
              prompt: 'How far did the team walk before reaching Survey Marker A?',
              display: 'MAP DISTANCE 3 cm · SCALE 1 cm = 2 km',
              options: ['5 km', '6 km', '8 km'],
              answer: 1,
              fragments: [
                'Base Camp and Survey Marker A are 3 cm apart on the route map.',
                'The map scale is 1 cm for every 2 km, so 3 cm represents 6 km.',
                'The distance is measured along the marked trail, not as a straight shortcut.',
                'The map uses one scale throughout.'
              ],
              evidence: 'Survey Marker A is 6 km along the North Trail from Base Camp.',
              explanation: 'Multiplying 3 cm by 2 km per centimetre gives 6 km.'
            }
          ]
        },
        {
          id: 'ridge-crossing',
          title: 'Ridge Crossing',
          rounds: [
            {
              value: 100,
              prompt: 'Which direction did the team travel after Marker A?',
              display: 'COMPASS LOG · BEARING 090°',
              options: ['North', 'East', 'South'],
              answer: 1,
              fragments: [
                'The compass rule is 000° north, 090° east, 180° south, and 270° west.',
                'The field log records a bearing of 090° after Marker A.',
                'Bearings are measured clockwise from north.',
                'The compass was calibrated at Base Camp that morning.'
              ],
              evidence: 'The team traveled east from Marker A.',
              explanation: 'Under the supplied compass rule, a 090° bearing is due east.'
            },
            {
              value: 200,
              prompt: 'Which pass did the team use to cross the ridge?',
              display: 'EASTBOUND · PASS BELOW 1,900 m',
              options: ['Kite Pass, 1,840 m', 'Owl Pass, 2,060 m', 'Wolf Pass, 2,240 m'],
              answer: 0,
              fragments: [
                'The log says the team crossed eastward through a pass below 1,900 m.',
                'Kite Pass is 1,840 m; Owl Pass is 2,060 m; Wolf Pass is 2,240 m.',
                'All three named passes cross the same ridge.',
                'No unnamed pass appears on the expedition map.'
              ],
              evidence: 'The team crossed the ridge at 1,840 m Kite Pass.',
              explanation: 'Kite Pass is the only listed pass below the logged 1,900 m limit.'
            }
          ]
        },
        {
          id: 'radio-fix',
          title: 'Radio Fix',
          rounds: [
            {
              value: 100,
              prompt: 'Which landmark was beside the team at 13:20?',
              display: 'RADIO: 2 km EAST OF KITE PASS · BESIDE A LAKE',
              options: ['Lake Mira', 'Pine Tarn', 'Red Marsh'],
              answer: 0,
              fragments: [
                'The radio report places the team beside a lake 2 km east of Kite Pass.',
                'Lake Mira is 2 km east of Kite Pass; Pine Tarn is 3 km north; Red Marsh is 2 km west.',
                'The expedition map classifies Lake Mira and Pine Tarn as lakes, and Red Marsh as wetland.',
                'The 13:20 transmission was clear and complete.'
              ],
              evidence: 'At 13:20 the team was beside Lake Mira.',
              explanation: 'Only Lake Mira matches both the landmark type and the stated position.'
            },
            {
              value: 200,
              prompt: 'Where did the team turn after leaving Lake Mira?',
              display: 'LOG: WALKED 4 km SOUTH TO A TRAIL JUNCTION',
              options: ['Juniper Junction', 'Granite Fork', 'North Gate'],
              answer: 0,
              fragments: [
                'The log records a 4 km southward walk from Lake Mira to a trail junction.',
                'Juniper Junction is 4 km south of Lake Mira; Granite Fork is 4 km east; North Gate is 6 km south.',
                'All distances shown are measured along their marked trails.',
                'The team reported no detour after the lake.'
              ],
              evidence: 'The team reached Juniper Junction after Lake Mira.',
              explanation: 'Juniper Junction uniquely matches the logged direction and distance.'
            }
          ]
        },
        {
          id: 'final-camp',
          title: 'Final Camp',
          rounds: [
            {
              value: 100,
              prompt: 'Which branch did the team choose at Juniper Junction?',
              display: 'LOG: TOOK SHORTEST OPEN ROUTE TO SHELTER',
              options: ['Old Mine Road', 'Cedar Spur', 'Floodplain Track'],
              answer: 1,
              fragments: [
                'From Juniper Junction, open routes to shelter are Cedar Spur at 3 km and Old Mine Road at 5 km.',
                'The log says the team chose the shortest open route to shelter.',
                'Floodplain Track is marked closed by washout.',
                'Cedar Spur and Old Mine Road were both inspected and open.'
              ],
              evidence: 'The team took the 3 km Cedar Spur.',
              explanation: 'Cedar Spur is the shortest route among those confirmed open.'
            },
            {
              value: 200,
              prompt: 'At which shelter should rescuers search?',
              display: 'CEDAR SPUR · 3 km · SHELTER AT END',
              options: ['Ridge Hut', 'Mira Cabin', 'Juniper Bivouac'],
              answer: 2,
              fragments: [
                'Cedar Spur ends at Juniper Bivouac; Old Mine Road ends at Ridge Hut.',
                'The team took Cedar Spur and planned to camp at the shelter at its end.',
                'Mira Cabin stands north of Lake Mira on a different trail.',
                'Juniper Bivouac has an emergency radio and water tank.'
              ],
              evidence: 'The reconstructed route ends at Juniper Bivouac.',
              explanation: 'The chosen Cedar Spur terminates at Juniper Bivouac, the team’s stated shelter.'
            }
          ]
        }
      ],
      finale: [
        {
          id: 'ridge-pass',
          label: 'Which pass did the expedition cross?',
          options: [
            { id: 'kite', label: 'Kite Pass', detail: '1,840 m' },
            { id: 'owl', label: 'Owl Pass', detail: '2,060 m' },
            { id: 'wolf', label: 'Wolf Pass', detail: '2,240 m' }
          ],
          answer: 'kite'
        },
        {
          id: 'junction',
          label: 'Which junction did the expedition reach?',
          options: [
            { id: 'granite', label: 'Granite Fork' },
            { id: 'juniper', label: 'Juniper Junction' },
            { id: 'north-gate', label: 'North Gate' }
          ],
          answer: 'juniper'
        },
        {
          id: 'camp',
          label: 'Where should rescuers search?',
          options: [
            { id: 'ridge-hut', label: 'Ridge Hut' },
            { id: 'mira-cabin', label: 'Mira Cabin' },
            { id: 'juniper-bivouac', label: 'Juniper Bivouac' }
          ],
          answer: 'juniper-bivouac'
        }
      ],
      reconstruction: [
        'The team left Base Camp on the upstream North Trail and walked 6 km to Survey Marker A.',
        'They traveled east on a 090° bearing and crossed the ridge through 1,840 m Kite Pass.',
        'They passed Lake Mira, then walked 4 km south to Juniper Junction.',
        'They followed the 3 km Cedar Spur to Juniper Bivouac, where rescuers should search.'
      ],
      successTitle: 'Expedition Located'
    },
    {
      id: 'island-supply-run',
      title: 'The Island Supply Run',
      subtitle: 'Choose a safe route before the weather closes',
      hook: 'A clinic on Beacon Island needs medicine today. Select a route that fits the boat’s range, the tide rules, and the weather window.',
      sections: [
        {
          id: 'range',
          title: 'Range Check',
          rounds: [
            {
              value: 100,
              prompt: 'What is the boat’s maximum safe route length?',
              display: 'FUEL RANGE 90 km · REQUIRED RESERVE 20 km',
              options: ['70 km', '90 km', '110 km'],
              answer: 0,
              fragments: [
                'The boat can travel 90 km on its loaded fuel.',
                'Rules require 20 km of fuel range to remain unused, leaving 70 km available.',
                'The reserve applies to every supply trip.',
                'Refueling is unavailable away from Harbor Point.'
              ],
              evidence: 'The supply route must be no longer than 70 km.',
              explanation: 'Subtracting the mandatory 20 km reserve from 90 km leaves 70 km.'
            },
            {
              value: 200,
              prompt: 'Which route is within the safe fuel limit?',
              display: 'NORTH 64 km · CHANNEL 72 km · OUTER 81 km',
              options: ['North Route', 'Channel Route', 'Outer Route'],
              answer: 0,
              fragments: [
                'The safe route limit is 70 km.',
                'North Route is 64 km, Channel Route is 72 km, and Outer Route is 81 km.',
                'Distances include the full Harbor Point–Beacon Island trip.',
                'The loaded boat uses the stated range in the forecast conditions.'
              ],
              evidence: 'Only the 64 km North Route meets the fuel rule.',
              explanation: 'North Route alone stays at or below the 70 km safe limit.'
            }
          ]
        },
        {
          id: 'tides',
          title: 'Tide Gate',
          rounds: [
            {
              value: 100,
              prompt: 'When may the boat cross North Shoal?',
              display: 'SHOAL RULE: TIDE ≥ 1.8 m',
              options: ['08:00 at 1.4 m', '09:00 at 1.9 m', '12:00 at 1.6 m'],
              answer: 1,
              fragments: [
                'North Shoal may be crossed only when tide height is at least 1.8 m.',
                'The tide table gives 1.4 m at 08:00, 1.9 m at 09:00, and 1.6 m at 12:00.',
                'The published table already uses local harbor time.',
                'No storm surge adjustment is forecast.'
              ],
              evidence: 'The safe shoal crossing is 09:00, when the tide is 1.9 m.',
              explanation: 'Only the 09:00 tide meets or exceeds the 1.8 m minimum.'
            },
            {
              value: 200,
              prompt: 'What is the latest departure that reaches North Shoal at 09:00?',
              display: 'HARBOR TO SHOAL · 45 MIN',
              options: ['08:00', '08:15', '08:30'],
              answer: 1,
              fragments: [
                'Travel from Harbor Point to North Shoal takes 45 minutes.',
                'To arrive at the 09:00 crossing, the boat must leave at 08:15.',
                'Departure checks will be complete before 08:00.',
                'Travel time already includes the harbor speed zone.'
              ],
              evidence: 'The boat should depart Harbor Point at 08:15.',
              explanation: 'Counting back 45 minutes from 09:00 gives 08:15.'
            }
          ]
        },
        {
          id: 'weather',
          title: 'Weather Window',
          rounds: [
            {
              value: 100,
              prompt: 'Which passage remains open for the entire trip?',
              display: 'GALE AFTER 11:30 · TRIP ENDS 10:50',
              options: ['North Passage', 'Outer Passage', 'West Cut'],
              answer: 0,
              fragments: [
                'North Passage is open until a gale begins at 11:30, and the planned trip clears it by 10:50.',
                'Outer Passage closes at 10:00 and West Cut is closed all day.',
                'Closure times are mandatory Coast Guard limits.',
                'The forecast uses the same local time as the route plan.'
              ],
              evidence: 'North Passage remains open through the planned 10:50 completion.',
              explanation: 'The boat clears North Passage before its 11:30 closure; the other passages do not remain open.'
            },
            {
              value: 200,
              prompt: 'Which island side provides a safe unloading berth?',
              display: 'WIND FROM WEST · USE LEEWARD BERTH',
              options: ['West berth', 'East berth', 'North beach'],
              answer: 1,
              fragments: [
                'With wind from the west, the island’s east side is leeward and sheltered.',
                'The operating rule requires the boat to use the leeward berth, which is the East berth.',
                'The West berth is exposed directly to the forecast wind.',
                'North beach has no dock or cargo crane.'
              ],
              evidence: 'The boat should unload at Beacon Island’s East berth.',
              explanation: 'The east side lies downwind of the island and is the required sheltered berth.'
            }
          ]
        },
        {
          id: 'delivery',
          title: 'Delivery Plan',
          rounds: [
            {
              value: 100,
              prompt: 'When will the medicine reach the clinic?',
              display: 'DEPART 08:15 · SAIL 2 h 35 min · UNLOAD 20 min',
              options: ['10:30', '10:50', '11:10'],
              answer: 2,
              fragments: [
                'The boat leaves at 08:15 and sailing to the East berth takes 2 hours 35 minutes, arriving at 10:50.',
                'Unloading medicine takes 20 minutes, so delivery is complete at 11:10.',
                'The clinic collects the shipment directly from the berth.',
                'No road transfer is required on Beacon Island.'
              ],
              evidence: 'The medicine reaches the clinic at 11:10 local time.',
              explanation: 'Arrival at 10:50 plus 20 minutes to unload gives 11:10.'
            },
            {
              value: 200,
              prompt: 'Which cargo plan respects the boat’s load limit?',
              display: 'LIMIT 600 kg',
              options: ['Medicine 420 + food 210', 'Medicine 420 + food 160', 'Medicine 420 + fuel drums 240'],
              answer: 1,
              fragments: [
                'The boat may carry at most 600 kg, and the medicine weighs 420 kg.',
                'Adding 160 kg of food totals 580 kg; adding 210 kg totals 630 kg; adding 240 kg totals 660 kg.',
                'Crew and installed fuel are excluded from the posted cargo limit.',
                'The clinic prioritizes medicine, so all 420 kg must travel.'
              ],
              evidence: 'The valid cargo is 420 kg of medicine plus 160 kg of food.',
              explanation: 'That load totals 580 kg and is the only option within the 600 kg limit.'
            }
          ]
        }
      ],
      finale: [
        {
          id: 'route',
          label: 'Which route should the boat use?',
          options: [
            { id: 'north', label: 'North Route', detail: '64 km' },
            { id: 'channel', label: 'Channel Route', detail: '72 km' },
            { id: 'outer', label: 'Outer Route', detail: '81 km' }
          ],
          answer: 'north'
        },
        {
          id: 'departure',
          label: 'When should it depart?',
          options: [
            { id: '0800', label: '08:00' },
            { id: '0815', label: '08:15' },
            { id: '0830', label: '08:30' }
          ],
          answer: '0815'
        },
        {
          id: 'berth',
          label: 'Where should it unload?',
          options: [
            { id: 'west', label: 'West berth' },
            { id: 'east', label: 'East berth' },
            { id: 'north-beach', label: 'North beach' }
          ],
          answer: 'east'
        }
      ],
      reconstruction: [
        'Reserve rules limit the fueled boat to a 70 km route, making the 64 km North Route the only valid choice.',
        'An 08:15 departure reaches North Shoal at 09:00, when its 1.9 m tide clears the 1.8 m minimum.',
        'The boat clears North Passage before the 11:30 gale and unloads at the sheltered East berth.',
        'A 580 kg cargo of medicine and food is delivered by 11:10 local time.'
      ],
      successTitle: 'Clinic Supplied'
    },
    {
      id: 'silver-river-source',
      title: 'The Silver River Spill',
      subtitle: 'Trace pollution through a watershed',
      hook: 'A chemical pulse has reached Silver River. Use flow directions, sample times, and concentrations to locate the source and protect the next intake.',
      sections: [
        {
          id: 'flow-map',
          title: 'Flow Map',
          rounds: [
            {
              value: 100,
              prompt: 'Which tributary can carry water to the town intake?',
              display: 'ARROWS SHOW DOWNSTREAM FLOW',
              options: ['Pine Creek', 'Dry Wash', 'West Canal'],
              answer: 0,
              fragments: [
                'The watershed arrows show Pine Creek joining Silver River 4 km upstream of the town intake.',
                'Dry Wash ends in a closed basin, and West Canal flows away from Silver River.',
                'All mapped arrows indicate normal downstream flow.',
                'No pumps reverse flow in this watershed.'
              ],
              evidence: 'Pine Creek drains into Silver River upstream of the town intake.',
              explanation: 'Only Pine Creek has a downstream connection capable of carrying pollution to the intake.'
            },
            {
              value: 200,
              prompt: 'Which site is farthest upstream on Pine Creek?',
              display: 'FLOW: P3 → P2 → P1 → SILVER RIVER',
              options: ['P1', 'P2', 'P3'],
              answer: 2,
              fragments: [
                'The flow sequence is P3 to P2 to P1 and then into Silver River.',
                'In a flow sequence, the first site listed is farthest upstream, so P3 is farthest upstream.',
                'P1 is nearest the confluence.',
                'The three sites lie on the same continuously flowing channel.'
              ],
              evidence: 'Sampling site P3 is farthest upstream on Pine Creek.',
              explanation: 'Water moves from P3 through P2 and P1, placing P3 at the upstream end.'
            }
          ]
        },
        {
          id: 'samples',
          title: 'Sample Results',
          rounds: [
            {
              value: 100,
              prompt: 'Between which sites does contamination first appear?',
              display: 'P3 0 ppm · P2 18 ppm · P1 12 ppm',
              options: ['Upstream of P3', 'Between P3 and P2', 'Between P2 and P1'],
              answer: 1,
              fragments: [
                'Pine Creek flows P3 to P2 to P1, with readings of 0, 18, and 12 ppm respectively.',
                'A zero reading at P3 and positive reading at P2 means contamination enters between P3 and P2.',
                'Dilution can reduce concentration farther downstream.',
                'All samples were collected during the same pollution pulse.'
              ],
              evidence: 'The pollutant enters Pine Creek between P3 and P2.',
              explanation: 'The first downstream detection occurs at P2 after a clean P3 sample.'
            },
            {
              value: 200,
              prompt: 'Which mapped facility lies in the source segment?',
              display: 'SEGMENT P3–P2',
              options: ['Orchard depot', 'North quarry', 'Riverside mill'],
              answer: 1,
              fragments: [
                'The contamination source segment is between P3 and P2.',
                'The map places North quarry between P3 and P2; the orchard depot is above P3 and the mill is below P1.',
                'No other facility or drain enters that segment.',
                'The tributary map was field-verified this month.'
              ],
              evidence: 'North quarry is the only mapped facility in the source segment.',
              explanation: 'Its drainage enters precisely between the clean P3 and contaminated P2 sites.'
            }
          ]
        },
        {
          id: 'travel-time',
          title: 'Travel Time',
          rounds: [
            {
              value: 100,
              prompt: 'When will the pulse reach the town intake from the confluence?',
              display: 'DISTANCE 4 km · FLOW SPEED 2 km/h · CONFLUENCE 14:00',
              options: ['15:00', '16:00', '18:00'],
              answer: 1,
              fragments: [
                'The intake is 4 km downstream of the confluence and river flow is 2 km per hour.',
                'Four kilometres takes 2 hours, so a pulse at the confluence at 14:00 reaches the intake at 16:00.',
                'The flow speed is constant for the forecast period.',
                'There are no reservoirs between the confluence and intake.'
              ],
              evidence: 'The pollution pulse is expected at the town intake at 16:00.',
              explanation: 'Distance divided by speed is 4 ÷ 2 = 2 hours; 14:00 plus 2 hours is 16:00.'
            },
            {
              value: 200,
              prompt: 'By what time must the town close its intake?',
              display: 'SAFETY RULE: CLOSE 30 MIN BEFORE ARRIVAL',
              options: ['15:00', '15:30', '16:30'],
              answer: 1,
              fragments: [
                'The pulse is forecast to arrive at 16:00.',
                'The safety rule requires closure 30 minutes before arrival, making the deadline 15:30.',
                'Closing earlier is permitted but not required by this question.',
                'The valve takes less than two minutes to operate.'
              ],
              evidence: 'The town intake must close no later than 15:30.',
              explanation: 'Thirty minutes before the 16:00 arrival is 15:30.'
            }
          ]
        },
        {
          id: 'response',
          title: 'Response',
          rounds: [
            {
              value: 100,
              prompt: 'Which drain should responders block first?',
              display: 'QUARRY DRAINS Q-NORTH, Q-EAST, Q-SOUTH',
              options: ['Q-North', 'Q-East', 'Q-South'],
              answer: 2,
              fragments: [
                'Only Q-South drains from North quarry into the P3–P2 source segment.',
                'The source lies in the P3–P2 segment, so responders must block Q-South.',
                'Q-North drains to a lined holding pond.',
                'Q-East drains into the closed Dry Wash basin.'
              ],
              evidence: 'Q-South is the quarry drain feeding the contaminated creek segment.',
              explanation: 'Q-South alone connects the identified facility to the identified source segment.'
            },
            {
              value: 200,
              prompt: 'Where should the confirmation sample be taken?',
              display: 'VERIFY SOURCE · SAMPLE IMMEDIATELY BELOW DISCHARGE',
              options: ['Above Q-South', 'Below Q-South', 'Below the town intake'],
              answer: 1,
              fragments: [
                'The verification rule says to sample immediately downstream of the suspected discharge.',
                'Water flows from Q-South into Pine Creek, so the required point is immediately below Q-South.',
                'A sample above the drain cannot capture its discharge.',
                'The town intake is too far downstream to isolate one source.'
              ],
              evidence: 'Responders should sample Pine Creek immediately below Q-South.',
              explanation: 'That point captures the drain’s output before other inputs can obscure it.'
            }
          ]
        }
      ],
      finale: [
        {
          id: 'facility',
          label: 'Which facility is the likely source?',
          options: [
            { id: 'orchard', label: 'Orchard depot' },
            { id: 'quarry', label: 'North quarry' },
            { id: 'mill', label: 'Riverside mill' }
          ],
          answer: 'quarry'
        },
        {
          id: 'drain',
          label: 'Which drain should be blocked?',
          options: [
            { id: 'q-north', label: 'Q-North' },
            { id: 'q-east', label: 'Q-East' },
            { id: 'q-south', label: 'Q-South' }
          ],
          answer: 'q-south'
        },
        {
          id: 'deadline',
          label: 'When must the town intake close?',
          options: [
            { id: '1500', label: '15:00' },
            { id: '1530', label: '15:30' },
            { id: '1600', label: '16:00' }
          ],
          answer: '1530'
        }
      ],
      reconstruction: [
        'Pine Creek is the tributary that carries the pollution toward the town intake.',
        'A clean P3 sample and contaminated P2 sample place the source between them, beside North quarry.',
        'Q-South is the quarry drain entering that segment and should be blocked and sampled immediately below.',
        'The pulse reaches the intake at 16:00, requiring closure by 15:30.'
      ],
      successTitle: 'Source Contained'
    },
    {
      id: 'four-cities-one-clock',
      title: 'Four Cities, One Clock',
      subtitle: 'Repair a timezone itinerary',
      hook: 'A medical courier must make three connections across four time zones. Convert every leg to UTC and identify the itinerary that actually works.',
      sections: [
        {
          id: 'offsets',
          title: 'Local Offsets',
          rounds: [
            {
              value: 100,
              prompt: 'What is a 09:00 departure from Alder in UTC?',
              display: 'ALDER = UTC−4 · NO DST',
              options: ['05:00 UTC', '09:00 UTC', '13:00 UTC'],
              answer: 2,
              fragments: [
                'Alder local time is UTC minus 4 hours.',
                'To convert Alder time to UTC, add 4 hours; 09:00 becomes 13:00 UTC.',
                'No daylight-saving adjustment applies on the travel date.',
                'All itinerary times use the 24-hour clock.'
              ],
              evidence: 'The Alder flight departs at 13:00 UTC.',
              explanation: 'UTC is four hours ahead of Alder, so 09:00 local equals 13:00 UTC.'
            },
            {
              value: 200,
              prompt: 'What local time is 18:30 UTC in Borin?',
              display: 'BORIN = UTC+1 · NO DST',
              options: ['17:30', '19:30', '23:30'],
              answer: 1,
              fragments: [
                'Borin local time is UTC plus 1 hour.',
                'Adding one hour to 18:30 UTC gives 19:30 in Borin.',
                'Borin does not observe daylight saving on this date.',
                'The arrival remains on the same calendar day.'
              ],
              evidence: '18:30 UTC is 19:30 local time in Borin.',
              explanation: 'Borin is one hour ahead of UTC.'
            }
          ]
        },
        {
          id: 'first-leg',
          title: 'First Leg',
          rounds: [
            {
              value: 100,
              prompt: 'When does the Alder–Borin flight arrive in UTC?',
              display: 'DEPART 13:00 UTC · DURATION 5 h 30 min',
              options: ['17:30 UTC', '18:30 UTC', '19:30 UTC'],
              answer: 1,
              fragments: [
                'The flight leaves Alder at 13:00 UTC.',
                'Its duration is 5 hours 30 minutes, so arrival is 18:30 UTC.',
                'The duration includes taxi time.',
                'There is no date change on this leg.'
              ],
              evidence: 'The first flight arrives at 18:30 UTC, or 19:30 in Borin.',
              explanation: 'Adding 5 hours 30 minutes to 13:00 UTC gives 18:30 UTC.'
            },
            {
              value: 200,
              prompt: 'Which Borin connection satisfies the minimum transfer?',
              display: 'ARRIVE 19:30 LOCAL · MINIMUM TRANSFER 1 h 15 min',
              options: ['20:20', '20:40', '21:10'],
              answer: 2,
              fragments: [
                'Arrival in Borin is 19:30 local and the minimum transfer is 1 hour 15 minutes.',
                'The earliest valid departure is 20:45; among the options, 21:10 is the only departure after that threshold.',
                'The 20:20 and 20:40 departures are both earlier than the minimum-transfer threshold.',
                'The connection rule is measured between scheduled arrival and available departure.'
              ],
              evidence: 'The valid Borin connection departs at 21:10 local.',
              explanation: 'A valid flight must leave no earlier than 20:45, and only the 21:10 departure does.'
            }
          ]
        },
        {
          id: 'overnight-leg',
          title: 'Overnight Leg',
          rounds: [
            {
              value: 100,
              prompt: 'What is the 21:10 Borin departure in UTC?',
              display: 'BORIN = UTC+1',
              options: ['20:10 UTC', '21:10 UTC', '22:10 UTC'],
              answer: 0,
              fragments: [
                'Borin is UTC plus 1 hour.',
                'Subtracting one hour from 21:10 Borin time gives 20:10 UTC.',
                'No daylight-saving adjustment applies.',
                'The departure occurs on Monday in both Borin and UTC.'
              ],
              evidence: 'The Borin connection departs at 20:10 UTC.',
              explanation: 'UTC is one hour behind Borin local time.'
            },
            {
              value: 200,
              prompt: 'When does the 8-hour flight arrive in Canto local time?',
              display: 'DEPART 20:10 UTC MON · CANTO = UTC+9',
              options: ['04:10 Tue', '13:10 Tue', '05:10 Mon'],
              answer: 1,
              fragments: [
                'An 8-hour flight departing 20:10 UTC Monday arrives 04:10 UTC Tuesday.',
                'Canto is UTC plus 9 hours, so 04:10 UTC Tuesday is 13:10 Tuesday local.',
                'Canto has no daylight-saving change during the trip.',
                'Crossing midnight advances the UTC date to Tuesday.'
              ],
              evidence: 'The courier arrives in Canto at 13:10 Tuesday local time.',
              explanation: 'The flight reaches 04:10 UTC Tuesday, then the +9 offset gives 13:10 Tuesday.'
            }
          ]
        },
        {
          id: 'final-transfer',
          title: 'Final Transfer',
          rounds: [
            {
              value: 100,
              prompt: 'Which Canto train can the courier catch?',
              display: 'ARRIVE 13:10 · CUSTOMS 50 min · STATION 25 min',
              options: ['13:55', '14:20', '14:45'],
              answer: 2,
              fragments: [
                'After arriving at 13:10, customs takes 50 minutes and travel to the station takes 25 minutes.',
                'The courier reaches the station at 14:25, so the first catchable listed train is 14:45.',
                'The train doors close at their listed departure times.',
                'No additional check-in time is required.'
              ],
              evidence: 'The courier can catch the 14:45 Canto train.',
              explanation: 'Thirteen ten plus 75 minutes is 14:25, after the first two trains but before 14:45.'
            },
            {
              value: 200,
              prompt: 'When does the 3-hour train arrive in Daro local time?',
              display: 'CANTO 14:45 UTC+9 · DARO UTC+11 · TRAIN 3 h',
              options: ['17:45 Tue', '19:45 Tue', '21:45 Tue'],
              answer: 1,
              fragments: [
                'A 14:45 Canto departure at UTC+9 equals 05:45 UTC Tuesday.',
                'After 3 hours it is 08:45 UTC; adding Daro’s +11 offset gives 19:45 Tuesday.',
                'The train duration is elapsed time, independent of zone boundaries.',
                'Neither city changes clocks that day.'
              ],
              evidence: 'The courier reaches Daro at 19:45 Tuesday local time.',
              explanation: 'The train arrives at 08:45 UTC, which is 19:45 in UTC+11 Daro.'
            }
          ]
        }
      ],
      finale: [
        {
          id: 'borin-flight',
          label: 'Which Borin departure works?',
          options: [
            { id: '2020', label: '20:20 Monday' },
            { id: '2040', label: '20:40 Monday' },
            { id: '2110', label: '21:10 Monday' }
          ],
          answer: '2110'
        },
        {
          id: 'canto-train',
          label: 'Which Canto train works?',
          options: [
            { id: '1355', label: '13:55 Tuesday' },
            { id: '1420', label: '14:20 Tuesday' },
            { id: '1445', label: '14:45 Tuesday' }
          ],
          answer: '1445'
        },
        {
          id: 'daro-arrival',
          label: 'When does the courier reach Daro?',
          options: [
            { id: '1745', label: '17:45 Tuesday' },
            { id: '1945', label: '19:45 Tuesday' },
            { id: '2145', label: '21:45 Tuesday' }
          ],
          answer: '1945'
        }
      ],
      reconstruction: [
        'The courier leaves Alder at 09:00 Monday, equivalent to 13:00 UTC.',
        'The first flight reaches Borin at 19:30 local, making the 21:10 connection valid.',
        'The overnight flight reaches Canto at 13:10 Tuesday, and customs plus transfer ends at 14:25.',
        'The courier takes the 14:45 train and arrives in Daro at 19:45 Tuesday local time.'
      ],
      successTitle: 'Itinerary Confirmed'
    },
    {
      id: 'storm-peak-route',
      title: 'Storm Peak Passage',
      subtitle: 'Plan a safe mountain crossing',
      hook: 'A field crew must reach Valley Station before afternoon storms. Choose a route using supplied contours, grade limits, pace, and hazard closures.',
      sections: [
        {
          id: 'contours',
          title: 'Contour Reading',
          rounds: [
            {
              value: 100,
              prompt: 'What is the elevation of Saddle Point?',
              display: 'INDEX 1,600 m · 3 CONTOURS ABOVE · INTERVAL 50 m',
              options: ['1,650 m', '1,700 m', '1,750 m'],
              answer: 2,
              fragments: [
                'Saddle Point lies three contour intervals above the 1,600 m index contour.',
                'Each interval is 50 m, so 1,600 + 150 = 1,750 m.',
                'The contour interval is uniform across the map.',
                'Saddle Point lies exactly on the third contour.'
              ],
              evidence: 'Saddle Point is at 1,750 m elevation.',
              explanation: 'Three 50 m intervals add 150 m to the 1,600 m index contour.'
            },
            {
              value: 200,
              prompt: 'Which segment is gentlest?',
              display: 'A: +200 m/2 km · B: +150 m/3 km · C: +100 m/1 km',
              options: ['Segment A', 'Segment B', 'Segment C'],
              answer: 1,
              fragments: [
                'Average climb rates are A: 100 m/km, B: 50 m/km, and C: 100 m/km.',
                'The gentlest segment has the smallest climb per kilometre, which is Segment B at 50 m/km.',
                'All distances are horizontal trail distances.',
                'The comparison uses average ascent, not surface type.'
              ],
              evidence: 'Segment B has the gentlest average climb.',
              explanation: 'Its 150 m rise over 3 km equals 50 m/km, lower than the other segments.'
            }
          ]
        },
        {
          id: 'hazards',
          title: 'Hazard Map',
          rounds: [
            {
              value: 100,
              prompt: 'Which route avoids all closed terrain?',
              display: 'NORTH: AVALANCHE CLOSED · GORGE: BRIDGE CLOSED · SOUTH: OPEN',
              options: ['North Ridge', 'Gorge Trail', 'South Traverse'],
              answer: 2,
              fragments: [
                'North Ridge is closed for avalanche danger and Gorge Trail is closed at its bridge.',
                'South Traverse is marked open for the full route.',
                'Closures are mandatory, not advisory.',
                'No connecting bypass exists around either closure.'
              ],
              evidence: 'South Traverse is the only fully open route.',
              explanation: 'Both alternatives contain mandatory closures, while South Traverse is open.'
            },
            {
              value: 200,
              prompt: 'Which water stop is usable?',
              display: 'RULE: WATER MUST BE ON OPEN ROUTE AND TESTED SAFE',
              options: ['North Spring', 'Gorge Stream', 'Saddle Tank'],
              answer: 2,
              fragments: [
                'Saddle Tank is on open South Traverse and its water test is safe.',
                'North Spring is on closed North Ridge, while Gorge Stream has a boil-only notice.',
                'The crew cannot boil water during the timed crossing.',
                'Saddle Tank holds enough water for the full crew.'
              ],
              evidence: 'Saddle Tank is the usable water stop.',
              explanation: 'It is both accessible on the open route and cleared for immediate drinking.'
            }
          ]
        },
        {
          id: 'timing',
          title: 'Timing',
          rounds: [
            {
              value: 100,
              prompt: 'How long will South Traverse take?',
              display: 'DISTANCE 9 km · PACE 3 km/h · REST 30 min',
              options: ['3 h', '3 h 30 min', '4 h'],
              answer: 1,
              fragments: [
                'Walking 9 km at 3 km per hour takes 3 hours.',
                'Adding the required 30-minute rest gives a total of 3 hours 30 minutes.',
                'The stated pace already accounts for elevation.',
                'Only one rest is required.'
              ],
              evidence: 'South Traverse takes 3 hours 30 minutes.',
              explanation: 'Nine divided by three is three walking hours, plus a half-hour rest.'
            },
            {
              value: 200,
              prompt: 'What is the latest safe departure?',
              display: 'STORM AT 14:00 · MUST ARRIVE 1 h EARLY · TRIP 3 h 30 min',
              options: ['08:30', '09:30', '10:30'],
              answer: 1,
              fragments: [
                'The crew must arrive by 13:00, one hour before the 14:00 storm.',
                'Subtracting the 3-hour-30-minute trip from 13:00 gives a latest departure of 09:30.',
                'The storm time is local and fixed for planning.',
                'Preparation is completed before departure.'
              ],
              evidence: 'The crew must depart no later than 09:30.',
              explanation: 'A 09:30 start plus 3 hours 30 minutes reaches Valley Station at 13:00.'
            }
          ]
        },
        {
          id: 'route-plan',
          title: 'Route Plan',
          rounds: [
            {
              value: 100,
              prompt: 'Where should the crew take its required rest?',
              display: 'REST AFTER 2 h · SOUTH ROUTE: SADDLE TANK AT 2 h',
              options: ['Lower Gate', 'Saddle Tank', 'Valley Station'],
              answer: 1,
              fragments: [
                'The plan requires a rest after 2 hours of walking.',
                'Saddle Tank is reached exactly 2 hours after departure on South Traverse.',
                'Lower Gate is only 40 minutes from the start.',
                'Valley Station is the route endpoint.'
              ],
              evidence: 'The required rest should occur at Saddle Tank.',
              explanation: 'Saddle Tank coincides exactly with the required two-hour rest point.'
            },
            {
              value: 200,
              prompt: 'Which emergency exit remains available after Saddle Tank?',
              display: 'AFTER TANK · DESCENDING · OPEN · REACHES ROAD',
              options: ['Eagle Spur', 'Pine Escape', 'Gorge Link'],
              answer: 1,
              fragments: [
                'Pine Escape branches after Saddle Tank, descends, is open, and reaches the valley road.',
                'The emergency rule requires an open descending route to a road, so Pine Escape qualifies.',
                'Eagle Spur climbs to an exposed ridge.',
                'Gorge Link ends at the closed bridge.'
              ],
              evidence: 'Pine Escape is the valid emergency exit after Saddle Tank.',
              explanation: 'It is the only option satisfying all supplied emergency-exit conditions.'
            }
          ]
        }
      ],
      finale: [
        {
          id: 'main-route',
          label: 'Which main route should the crew take?',
          options: [
            { id: 'north', label: 'North Ridge' },
            { id: 'gorge', label: 'Gorge Trail' },
            { id: 'south', label: 'South Traverse' }
          ],
          answer: 'south'
        },
        {
          id: 'departure',
          label: 'What is the latest safe departure?',
          options: [
            { id: '0830', label: '08:30' },
            { id: '0930', label: '09:30' },
            { id: '1030', label: '10:30' }
          ],
          answer: '0930'
        },
        {
          id: 'escape',
          label: 'Which emergency exit should be recorded?',
          options: [
            { id: 'eagle', label: 'Eagle Spur' },
            { id: 'pine', label: 'Pine Escape' },
            { id: 'gorge-link', label: 'Gorge Link' }
          ],
          answer: 'pine'
        }
      ],
      reconstruction: [
        'Mandatory avalanche and bridge closures eliminate North Ridge and Gorge Trail.',
        'The crew takes open South Traverse, whose gentlest segment climbs 50 m per kilometre.',
        'A 09:30 departure allows 3 hours 30 minutes of travel and arrival by the 13:00 safety deadline.',
        'The crew rests and refills at Saddle Tank, with Pine Escape recorded as the road-bound emergency exit.'
      ],
      successTitle: 'Safe Passage Planned'
    }
  ]
};

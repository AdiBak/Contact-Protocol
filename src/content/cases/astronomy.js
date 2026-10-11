export const astronomyCategory = {
  id: 'deep-space',
  name: 'Deep Space',
  icon: '◎',
  description: 'Investigate space missions with measurements, timelines, and testable physical evidence.',
  cases: [
    {
      id: 'silent-weather-satellite',
      title: 'The Silent Weather Satellite',
      subtitle: 'Recover a disabled storm watcher before its orbit decays.',
      hook: 'Weather satellite Cirrus-7 stopped transmitting after a debris alert. Use its last telemetry and tracking data to restore control.',
      sections: [
        {
          id: 'signal',
          title: 'Find the Signal',
          rounds: [
            {
              value: 100,
              prompt: 'Which object is Cirrus-7?',
              display: 'EXPECTED ORBIT · 700 km · POLAR',
              options: ['Object A', 'Object B', 'Object C'],
              answer: 1,
              fragments: [
                'Cirrus-7 should be near 700 km altitude in a polar orbit.',
                'Object B is at 698 km and crosses both poles; A is equatorial and C is at 1,400 km.',
                'A polar orbit passes near both geographic poles.',
                'Ground radar measured all three objects during the same pass.'
              ],
              evidence: 'Object B matches both the expected altitude and polar path.',
              explanation: 'Only Object B is near 700 km and follows a polar orbit.'
            },
            {
              value: 200,
              prompt: 'When should the recovery antenna listen for the next pass?',
              display: 'LAST PASS 12:00 UTC · ORBIT 100 MIN',
              options: ['12:50 UTC', '13:40 UTC', '14:20 UTC'],
              answer: 1,
              fragments: [
                'Cirrus-7 passed the antenna at 12:00 UTC and completes one orbit every 100 minutes.',
                'Adding 100 minutes to 12:00 UTC gives the next pass at 13:40 UTC.',
                'The tracking model predicts no maneuver between these passes.',
                'The antenna can begin listening five minutes before the predicted pass.'
              ],
              evidence: 'The next modeled pass is at 13:40 UTC.',
              explanation: 'One 100-minute orbit after 12:00 UTC is 13:40 UTC.'
            }
          ]
        },
        {
          id: 'diagnosis',
          title: 'Diagnose the Failure',
          rounds: [
            {
              value: 100,
              prompt: 'Which system failed first?',
              display: '12:04 POWER OK · 12:05 ATTITUDE LOST · 12:06 RADIO WEAK',
              options: ['Solar power', 'Attitude control', 'Radio transmitter'],
              answer: 1,
              fragments: [
                'Power was normal at 12:04; attitude control was lost at 12:05.',
                'The radio weakened one minute later, after the spacecraft began tumbling.',
                'A tumbling directional antenna points away from Earth during part of each rotation.',
                'Battery voltage stayed within its normal range.'
              ],
              evidence: 'Attitude control failed before the radio signal weakened.',
              explanation: 'The ordered telemetry places attitude loss first; tumbling then explains the weak radio.'
            },
            {
              value: 200,
              prompt: 'Which sensor can still determine the satellite’s orientation?',
              display: 'STAR TRACKER OFFLINE · SUN SENSOR ONLINE',
              options: ['Sun sensor', 'Rain radar', 'Temperature probe'],
              answer: 0,
              fragments: [
                'The star tracker is offline, but the Sun sensor still reports the Sun’s direction.',
                'Knowing the Sun’s direction provides an orientation reference; rain and temperature readings do not.',
                'The Sun sensor reports once every two seconds.',
                'Its latest self-test passed.'
              ],
              evidence: 'The working Sun sensor can provide a reference for stabilizing orientation.',
              explanation: 'Only the Sun sensor measures a known direction in space.'
            }
          ]
        },
        {
          id: 'recovery',
          title: 'Plan the Recovery',
          rounds: [
            {
              value: 100,
              prompt: 'Which first command uses the least scarce battery power?',
              display: 'BATTERY 18% · RADIO 2 W · HEATER 40 W · THRUSTER 90 W',
              options: ['Activate the radio', 'Run the heater', 'Fire the thruster'],
              answer: 0,
              fragments: [
                'The battery is at 18%; the radio uses 2 watts, the heater 40 watts, and the thruster 90 watts.',
                'Among the three commands, activating the 2-watt radio uses the least power.',
                'A radio link is needed before sending later recovery commands.',
                'The battery remains above its 15% shutdown threshold.'
              ],
              evidence: 'A low-power radio activation preserves the most battery while restoring contact.',
              explanation: 'The radio requires far less power than either alternative.'
            },
            {
              value: 200,
              prompt: 'Which maneuver will stop the tumble?',
              display: 'ROTATION 2°/s CLOCKWISE',
              options: ['Torque clockwise', 'Torque counterclockwise', 'Apply no torque'],
              answer: 1,
              fragments: [
                'Cirrus-7 is rotating clockwise at 2° per second.',
                'A counterclockwise torque opposes a clockwise rotation and slows it.',
                'The reaction wheels can apply torque in either direction.',
                'Controllers will stop the command when rotation reaches 0° per second.'
              ],
              evidence: 'Counterclockwise wheel torque will cancel the clockwise tumble.',
              explanation: 'Stopping rotation requires torque opposite to the measured spin.'
            }
          ]
        },
        {
          id: 'orbit',
          title: 'Protect the Orbit',
          rounds: [
            {
              value: 100,
              prompt: 'At which point should the satellite thrust to raise its lowest altitude?',
              display: 'LOW POINT 620 km · HIGH POINT 700 km',
              options: ['At the low point', 'At the high point', 'Halfway between'],
              answer: 1,
              fragments: [
                'Mission guidance states: a forward thrust at the orbit’s high point raises the opposite low point.',
                'Cirrus-7 must raise its 620 km low point, so it should thrust forward at the 700 km high point.',
                'The planned burn lasts eight seconds.',
                'Tracking confirms the high point occurs over the southern Pacific.'
              ],
              evidence: 'A forward burn at the high point raises the dangerously low side of the orbit.',
              explanation: 'The supplied maneuver rule identifies the high point as the correct burn location.'
            },
            {
              value: 200,
              prompt: 'Which final orbit meets the recovery requirement?',
              display: 'REQUIRED LOW POINT ≥ 680 km',
              options: ['660–700 km', '682–701 km', '675–730 km'],
              answer: 1,
              fragments: [
                'Recovery requires the orbit’s low point to be at least 680 km.',
                'Only the 682–701 km option has a low point at or above 680 km.',
                'All listed high points are within the satellite’s permitted range.',
                'The 682 km tracking estimate has an uncertainty of only 1 km.'
              ],
              evidence: 'The 682–701 km orbit clears the minimum low-altitude requirement.',
              explanation: 'Its 682 km low point is the only one that meets the 680 km threshold.'
            }
          ]
        }
      ],
      finale: [
        {
          id: 'target',
          label: 'Recover which object?',
          options: [
            { id: 'a', label: 'Object A', detail: 'Equatorial orbit' },
            { id: 'b', label: 'Object B', detail: '698 km polar orbit' },
            { id: 'c', label: 'Object C', detail: '1,400 km orbit' }
          ],
          answer: 'b'
        },
        {
          id: 'stabilize',
          label: 'How should control stop the tumble?',
          options: [
            { id: 'clockwise', label: 'Clockwise torque' },
            { id: 'counterclockwise', label: 'Counterclockwise torque' },
            { id: 'none', label: 'No torque' }
          ],
          answer: 'counterclockwise'
        },
        {
          id: 'orbit',
          label: 'Which recovered orbit is safe?',
          options: [
            { id: 'low', label: '660–700 km' },
            { id: 'safe', label: '682–701 km' },
            { id: 'short', label: '675–730 km' }
          ],
          answer: 'safe'
        }
      ],
      reconstruction: [
        'Radar identifies Object B as Cirrus-7 from its 698 km polar orbit.',
        'Telemetry shows attitude control failed first, causing a tumble and weak radio link.',
        'Controllers restore the low-power radio and apply counterclockwise torque.',
        'A forward burn at the high point raises the orbit to a safe 682–701 km.'
      ],
      successTitle: 'Cirrus-7 Recovered'
    },
    {
      id: 'one-pixel-supernova',
      title: 'The One-Pixel Supernova',
      subtitle: 'Explain an observatory alert before the world is notified.',
      hook: 'An automated camera flagged a brilliant new star, but the evidence must survive independent checks before an alert is released.',
      sections: [
        {
          id: 'image',
          title: 'Inspect the Image',
          rounds: [
            {
              value: 100,
              prompt: 'What shape does the candidate have?',
              display: 'CANDIDATE 1 PIXEL · STARS 9–12 PIXELS',
              options: ['Normal star image', 'Single-pixel event', 'Extended galaxy'],
              answer: 1,
              fragments: [
                'The candidate lights exactly one pixel; focused stars cover 9–12 pixels in this camera.',
                'A one-pixel mark therefore does not have the camera’s normal star shape.',
                'The focus monitor reported normal operation.',
                'Nearby cataloged stars show the expected 9–12-pixel profiles.'
              ],
              evidence: 'The candidate is a single-pixel event, unlike every focused star.',
              explanation: 'Its one-pixel shape is inconsistent with a point source blurred by the telescope optics.'
            },
            {
              value: 200,
              prompt: 'Does the candidate persist in the next exposure?',
              display: 'FRAME 41: PRESENT · FRAME 42: ABSENT',
              options: ['Yes', 'No', 'The frames overlap'],
              answer: 1,
              fragments: [
                'The candidate appears in frame 41 and is absent from frame 42 taken 30 seconds later.',
                'The same sky position remained inside the camera field in both frames.',
                'Cloud cover was zero during both exposures.',
                'Frame 42 reached the same sensitivity as frame 41.'
              ],
              evidence: 'The mark vanished despite an equally sensitive follow-up of the same position.',
              explanation: 'Frame 42 covers the same location but contains no candidate.'
            }
          ]
        },
        {
          id: 'independent',
          title: 'Seek Confirmation',
          rounds: [
            {
              value: 100,
              prompt: 'Which observation tests whether the flash came from the sky?',
              display: 'SECOND CAMERA · SAME TIME · SAME FIELD',
              options: ['Check the second camera', 'Recount the first pixel', 'Read the dome thermometer'],
              answer: 0,
              fragments: [
                'A real sky flash bright enough for camera 1 should also appear in co-pointed camera 2.',
                'Camera 2 observed the same field at the same time, so checking it is an independent test.',
                'The cameras use separate sensors and electronics.',
                'Their clocks agree within 0.01 second.'
              ],
              evidence: 'The separate co-pointed camera provides an independent simultaneous check.',
              explanation: 'A celestial flash reaches both cameras; a sensor-local event need not.'
            },
            {
              value: 200,
              prompt: 'What does camera 2 show at the candidate position?',
              display: 'CAMERA 1: 48,000 COUNTS · CAMERA 2: 12 COUNTS',
              options: ['The same bright flash', 'Only background light', 'A saturated star'],
              answer: 1,
              fragments: [
                'Camera 2 measures 12 counts there, and its ordinary background is 10–14 counts.',
                'A value inside the 10–14 background range is only background light, not a bright flash.',
                'Camera 2 was exposing throughout camera 1’s event.',
                'Its detector passed calibration before the observing run.'
              ],
              evidence: 'The independent camera records normal background at the same place and time.',
              explanation: 'Twelve counts falls within camera 2’s stated background range.'
            }
          ]
        },
        {
          id: 'cause',
          title: 'Identify the Cause',
          rounds: [
            {
              value: 100,
              prompt: 'Which known event best matches a bright mark confined to one sensor pixel?',
              display: 'LOCAL · ONE PIXEL · ONE FRAME',
              options: ['Cosmic-ray sensor hit', 'Supernova', 'Passing cloud'],
              answer: 0,
              fragments: [
                'Detector documentation says a cosmic ray can deposit charge in one pixel for one exposure.',
                'The candidate is confined to one pixel and one exposure, exactly matching that signature.',
                'A cloud reduces light across many pixels rather than creating one bright pixel.',
                'A supernova would remain visible in follow-up images.'
              ],
              evidence: 'The observed signature matches a cosmic ray striking camera 1’s detector.',
              explanation: 'The documented cosmic-ray pattern matches both the event’s size and duration.'
            },
            {
              value: 200,
              prompt: 'Why did the automatic system issue an alert?',
              display: 'ALERT RULE · ANY PIXEL > 40,000 COUNTS',
              options: ['The pixel crossed a threshold', 'Two cameras confirmed it', 'A human classified it'],
              answer: 0,
              fragments: [
                'The automatic rule flags any pixel above 40,000 counts.',
                'The struck pixel reached 48,000 counts, so it crossed the automatic threshold.',
                'The first-stage rule does not compare image shape.',
                'No human had reviewed the frame when the alert appeared.'
              ],
              evidence: 'A 48,000-count pixel triggered the simple 40,000-count rule.',
              explanation: 'The alert was a threshold response, not a confirmed astronomical classification.'
            }
          ]
        },
        {
          id: 'response',
          title: 'Close the Alert',
          rounds: [
            {
              value: 100,
              prompt: 'What status should the team assign?',
              display: 'NO REPEAT · NO SECOND-CAMERA MATCH',
              options: ['Confirmed supernova', 'Instrument artifact', 'Unknown planet'],
              answer: 1,
              fragments: [
                'The event does not repeat and has no matching signal in the independent camera.',
                'Those results support a detector-local artifact, not a confirmed sky source.',
                'The candidate’s one-pixel shape also matches a sensor hit.',
                'No cataloged object is needed to explain the mark.'
              ],
              evidence: 'All checks support classifying the alert as an instrument artifact.',
              explanation: 'A nonrepeating signal seen by only one sensor is not a confirmed celestial event.'
            },
            {
              value: 200,
              prompt: 'Which filter would prevent this specific false alarm while preserving star candidates?',
              display: 'STARS 9–12 PIXELS · ARTIFACT 1 PIXEL',
              options: ['Reject one-pixel events', 'Reject 9–12-pixel events', 'Ignore camera 2'],
              answer: 0,
              fragments: [
                'Real focused stars occupy 9–12 pixels, while this cosmic-ray artifact occupies one pixel.',
                'Rejecting isolated one-pixel events removes this artifact without rejecting normal star shapes.',
                'The filter can run before public alerts.',
                'Independent-camera comparison remains a separate confirmation step.'
              ],
              evidence: 'A one-pixel rejection filter separates this artifact from normal stellar profiles.',
              explanation: 'The filter targets the measured artifact shape and retains the stated star shape.'
            }
          ]
        }
      ],
      finale: [
        {
          id: 'source',
          label: 'What produced the candidate?',
          options: [
            { id: 'cosmic-ray', label: 'Cosmic-ray sensor hit' },
            { id: 'supernova', label: 'Supernova' },
            { id: 'cloud', label: 'Cloud' }
          ],
          answer: 'cosmic-ray'
        },
        {
          id: 'trigger',
          label: 'Why was it flagged?',
          options: [
            { id: 'threshold', label: 'It crossed the count threshold' },
            { id: 'confirmed', label: 'Two cameras confirmed it' },
            { id: 'human', label: 'A human classified it' }
          ],
          answer: 'threshold'
        },
        {
          id: 'action',
          label: 'What should the observatory do?',
          options: [
            { id: 'publish', label: 'Publish a supernova alert' },
            { id: 'artifact', label: 'Close as an artifact and add a shape filter' },
            { id: 'shutdown', label: 'Shut down both cameras' }
          ],
          answer: 'artifact'
        }
      ],
      reconstruction: [
        'Camera 1 records a one-pixel flash in a single exposure.',
        'A separate camera sees only normal background at the same position and time.',
        'The signature matches a cosmic ray depositing charge in one detector pixel.',
        'The team closes the false alert and adds a one-pixel rejection filter.'
      ],
      successTitle: 'False Alarm Explained'
    },
    {
      id: 'red-horizon',
      title: 'Red Horizon',
      subtitle: 'Select a safe and useful Mars landing site.',
      hook: 'Three candidate zones could host the Ares lander. Balance entry altitude, terrain hazards, sunlight, and access to ancient water-bearing rock.',
      sections: [
        {
          id: 'entry',
          title: 'Check Entry Safety',
          rounds: [
            {
              value: 100,
              prompt: 'Which site gives the lander the required atmospheric braking distance?',
              display: 'REQUIREMENT · ELEVATION ≤ −2.0 km',
              options: ['Aurora Plain: −3.1 km', 'Canyon Rim: −0.8 km', 'High Mesa: +1.2 km'],
              answer: 0,
              fragments: [
                'The landing requirement is an elevation at or below −2.0 km.',
                'Aurora Plain is −3.1 km; the other sites are −0.8 km and +1.2 km.',
                'Lower terrain leaves more atmosphere above the craft for braking.',
                'All elevations use the same Mars reference level.'
              ],
              evidence: 'Only Aurora Plain satisfies the required maximum elevation.',
              explanation: '−3.1 km is the only listed elevation at or below −2.0 km.'
            },
            {
              value: 200,
              prompt: 'Which site meets the maximum safe slope?',
              display: 'MAXIMUM SLOPE · 8°',
              options: ['Aurora Plain: 4°', 'Canyon Rim: 13°', 'High Mesa: 10°'],
              answer: 0,
              fragments: [
                'The lander can safely touch down only on slopes of 8° or less.',
                'Aurora Plain is 4°; Canyon Rim is 13° and High Mesa is 10°.',
                'The values are maximum slopes inside each landing ellipse.',
                'Orbital stereo images provide the slope measurements.'
              ],
              evidence: 'Aurora Plain alone stays below the 8° slope limit.',
              explanation: 'Its 4° maximum slope meets the stated safety threshold.'
            }
          ]
        },
        {
          id: 'terrain',
          title: 'Measure Terrain Hazards',
          rounds: [
            {
              value: 100,
              prompt: 'Which site meets the rock-cover limit?',
              display: 'LIMIT · ROCK COVER < 5%',
              options: ['Aurora Plain: 3%', 'Canyon Rim: 8%', 'High Mesa: 12%'],
              answer: 0,
              fragments: [
                'Safe landing requires large rocks to cover less than 5% of the ellipse.',
                'Aurora Plain has 3% cover; Canyon Rim has 8% and High Mesa 12%.',
                'The same image-resolution method was used at all sites.',
                'Only rocks large enough to threaten a landing leg were counted.'
              ],
              evidence: 'Aurora Plain is the only site below 5% hazardous rock cover.',
              explanation: 'Three percent meets the limit; eight and twelve percent do not.'
            },
            {
              value: 200,
              prompt: 'Which ellipse avoids the mapped dust hollow?',
              display: 'AURORA ELLIPSES · WEST OVERLAPS HOLLOW · EAST CLEAR',
              options: ['West ellipse', 'East ellipse', 'Both overlap it'],
              answer: 1,
              fragments: [
                'The west Aurora ellipse overlaps a dust-filled hollow; the east ellipse is clear of it.',
                'Mission rules require an ellipse with no overlap, so the east ellipse is acceptable.',
                'Deep dust can trap a rover wheel.',
                'Radar mapping covers both ellipses at equal resolution.'
              ],
              evidence: 'The east ellipse avoids the mapped dust hazard.',
              explanation: 'Only the east ellipse has zero overlap with the hollow.'
            }
          ]
        },
        {
          id: 'power',
          title: 'Secure Surface Power',
          rounds: [
            {
              value: 100,
              prompt: 'Which site supplies the required daily sunlight?',
              display: 'REQUIRED ≥ 6 h · AURORA 8 h · CANYON 4 h · MESA 7 h',
              options: ['Aurora Plain', 'Canyon Rim', 'No site'],
              answer: 0,
              fragments: [
                'Solar operations require at least 6 hours of sunlight per day.',
                'Aurora gets 8 hours, Canyon Rim 4 hours, and High Mesa 7 hours.',
                'The estimates cover the planned 30-day mission.',
                'Local horizon shadows are included.'
              ],
              evidence: 'Aurora Plain provides 8 hours, exceeding the 6-hour requirement.',
              explanation: 'Aurora clears the minimum while Canyon Rim does not; “no site” is therefore false.'
            },
            {
              value: 200,
              prompt: 'When should dust-sensitive landing operations occur?',
              display: 'MORNING WIND 6 m/s · AFTERNOON WIND 18 m/s · LIMIT 10 m/s',
              options: ['Morning', 'Afternoon', 'Either time'],
              answer: 0,
              fragments: [
                'Landing operations require wind below 10 m/s.',
                'Morning wind is 6 m/s and afternoon wind is 18 m/s, so only morning qualifies.',
                'These are repeated measurements from 20 local days.',
                'The selected morning window also has daylight.'
              ],
              evidence: 'The 6 m/s morning period is the only wind window below the limit.',
              explanation: 'Morning wind meets the threshold; afternoon wind exceeds it.'
            }
          ]
        },
        {
          id: 'science',
          title: 'Protect the Science Goal',
          rounds: [
            {
              value: 100,
              prompt: 'Which nearby target records past interaction with water?',
              display: 'ORBITAL SPECTRA · CLAY 1.8 km EAST',
              options: ['Clay-bearing outcrop', 'Fresh impact glass', 'Loose dune sand'],
              answer: 0,
              fragments: [
                'The mission seeks rock altered by past liquid water, and clay minerals form through rock-water interaction.',
                'An orbital spectrum identifies a clay-bearing outcrop 1.8 km east of Aurora Plain.',
                'The rover range is 5 km.',
                'The route to the outcrop has no mapped slope above 6°.'
              ],
              evidence: 'The nearby clay outcrop directly serves the past-water science objective.',
              explanation: 'The supplied mineral fact connects clay to rock-water interaction.'
            },
            {
              value: 200,
              prompt: 'Can the rover reach the clay outcrop and return within its range?',
              display: 'OUTCROP 1.8 km AWAY · ROUND TRIP 3.6 km · RANGE 5 km',
              options: ['Yes, with 1.4 km margin', 'No, short by 1.4 km', 'Only one way'],
              answer: 0,
              fragments: [
                'The round trip is 3.6 km and the rover’s total range is 5.0 km.',
                'Subtracting 3.6 from 5.0 leaves a 1.4 km range margin.',
                'The range already includes the planned science stops.',
                'No detour is required on the mapped route.'
              ],
              evidence: 'The rover can complete the round trip with 1.4 km of range remaining.',
              explanation: 'The 3.6 km trip is shorter than the 5.0 km available range.'
            }
          ]
        }
      ],
      finale: [
        {
          id: 'site',
          label: 'Which site should Ares use?',
          options: [
            { id: 'aurora', label: 'Aurora Plain' },
            { id: 'canyon', label: 'Canyon Rim' },
            { id: 'mesa', label: 'High Mesa' }
          ],
          answer: 'aurora'
        },
        {
          id: 'ellipse',
          label: 'Which landing ellipse?',
          options: [
            { id: 'west', label: 'West ellipse' },
            { id: 'east', label: 'East ellipse' },
            { id: 'either', label: 'Either ellipse' }
          ],
          answer: 'east'
        },
        {
          id: 'window',
          label: 'Which landing window?',
          options: [
            { id: 'morning', label: 'Morning' },
            { id: 'afternoon', label: 'Afternoon' },
            { id: 'night', label: 'Night' }
          ],
          answer: 'morning'
        }
      ],
      reconstruction: [
        'Aurora Plain meets the elevation, slope, and hazardous-rock limits.',
        'The east ellipse avoids the dust-filled hollow.',
        'A morning landing keeps wind below the 10 m/s operational limit.',
        'The rover can visit the water-altered clay outcrop and return within range.'
      ],
      successTitle: 'Landing Site Selected'
    },
    {
      id: 'storm-warning',
      title: 'Storm Warning',
      subtitle: 'Prepare Earth-orbit systems for an incoming solar storm.',
      hook: 'A solar eruption has launched magnetized plasma toward Earth. Determine its direction, arrival window, and the safest operational response.',
      sections: [
        {
          id: 'eruption',
          title: 'Read the Eruption',
          rounds: [
            {
              value: 100,
              prompt: 'Which observation shows that material left the Sun?',
              display: 'FLARE: LIGHT · CME: MOVING PLASMA',
              options: ['The CME image', 'The flare brightness alone', 'A sunspot count'],
              answer: 0,
              fragments: [
                'A coronal mass ejection, or CME, is a cloud of plasma moving away from the Sun.',
                'The coronagraph image shows a CME expanding outward; flare light alone does not track expelled matter.',
                'The image was recorded after the flare began.',
                'Background stars confirm the camera pointing.'
              ],
              evidence: 'The expanding CME image directly shows plasma leaving the Sun.',
              explanation: 'The provided definition and image description identify the CME as expelled material.'
            },
            {
              value: 200,
              prompt: 'Is the CME directed toward Earth?',
              display: 'EARTH LINE 0° · CME CENTER 4° · WIDTH ±25°',
              options: ['Yes', 'No', 'Direction is unmeasured'],
              answer: 0,
              fragments: [
                'Earth lies at 0°; the CME is centered at 4° and spans 25° on either side.',
                'Because 0° lies within the CME span from −21° to +29°, Earth is in its path.',
                'Two spacecraft agree on the CME center within 2°.',
                'The angular width refers to the plasma cloud, not the flare.'
              ],
              evidence: 'Earth’s direction falls inside the measured CME width.',
              explanation: 'The Earth line at 0° is between the CME’s −21° and +29° edges.'
            }
          ]
        },
        {
          id: 'arrival',
          title: 'Estimate Arrival',
          rounds: [
            {
              value: 100,
              prompt: 'How long would a 1,500 km/s CME take to cross 150 million km at constant speed?',
              display: 'TIME = DISTANCE ÷ SPEED',
              options: ['About 28 hours', 'About 4 hours', 'About 100 hours'],
              answer: 0,
              fragments: [
                'Travel time equals distance divided by speed: 150,000,000 km ÷ 1,500 km/s = 100,000 seconds.',
                '100,000 seconds is about 27.8 hours, which rounds to 28 hours.',
                'This is a constant-speed estimate.',
                'Space-weather models later refine the estimate using solar-wind data.'
              ],
              evidence: 'The first estimate places arrival about 28 hours after launch.',
              explanation: 'Dividing the stated distance by speed gives roughly 27.8 hours.'
            },
            {
              value: 200,
              prompt: 'What is the updated arrival time?',
              display: 'LAUNCH 06:00 UTC · MODEL TRAVEL 31 h',
              options: ['Next day 13:00 UTC', 'Same day 13:00 UTC', 'Next day 01:00 UTC'],
              answer: 0,
              fragments: [
                'The refined model gives 31 hours of travel after a 06:00 UTC launch.',
                'Twenty-four hours reaches 06:00 the next day; seven more hours reaches 13:00 UTC.',
                'The model uncertainty is plus or minus three hours.',
                'Operators use the center time for the primary readiness deadline.'
              ],
              evidence: 'The refined center arrival is 13:00 UTC the following day.',
              explanation: 'Adding 31 hours to 06:00 gives 13:00 on the next day.'
            }
          ]
        },
        {
          id: 'impact',
          title: 'Assess the Risk',
          rounds: [
            {
              value: 100,
              prompt: 'Which magnetic orientation increases storm coupling?',
              display: 'EARTH FIELD NORTHWARD · CME FIELD SOUTHWARD',
              options: ['Southward CME field', 'Northward CME field', 'No magnetic field'],
              answer: 0,
              fragments: [
                'Mission guidance says a southward CME field couples strongly with Earth’s northward field.',
                'The arriving CME field is measured southward, so the strong-coupling condition is present.',
                'The measurement comes from a solar-wind monitor upstream of Earth.',
                'Stronger coupling can transfer more energy into near-Earth space.'
              ],
              evidence: 'The measured southward field indicates stronger coupling and greater storm risk.',
              explanation: 'The supplied coupling rule directly matches the observed orientation.'
            },
            {
              value: 200,
              prompt: 'Which satellite subsystem is most exposed during the storm?',
              display: 'CHARGED PARTICLES · MEMORY UPSETS',
              options: ['Unshielded flight computer', 'Shielded spare computer', 'Mechanical antenna hinge'],
              answer: 0,
              fragments: [
                'Tests show charged particles cause memory errors in the unshielded computer at one-tenth the dose needed for the shielded spare.',
                'The lower required dose makes the unshielded flight computer the most exposed option.',
                'The mechanical hinge contains no computer memory.',
                'Both computers run the same software.'
              ],
              evidence: 'The unshielded computer reaches its upset threshold first.',
              explanation: 'It needs only one-tenth the particle dose that affects the shielded spare.'
            }
          ]
        },
        {
          id: 'prepare',
          title: 'Issue Protective Actions',
          rounds: [
            {
              value: 100,
              prompt: 'Which satellite action reduces damage risk?',
              display: 'SAFE MODE · NONESSENTIAL ELECTRONICS OFF',
              options: ['Enter safe mode', 'Start a software update', 'Deploy every instrument'],
              answer: 0,
              fragments: [
                'Safe mode turns off nonessential electronics and uses the shielded spare computer.',
                'Reducing powered electronics and using the shielded computer lowers the identified storm risk.',
                'A software update would write memory during the hazardous period.',
                'Instrument deployment increases the number of active systems.'
              ],
              evidence: 'Safe mode directly protects the vulnerable electronics.',
              explanation: 'It applies both protections supported by the risk assessment.'
            },
            {
              value: 200,
              prompt: 'By when should preparations be complete?',
              display: 'EARLIEST ARRIVAL 10:00 UTC · BUFFER 2 h',
              options: ['08:00 UTC', '10:00 UTC', '12:00 UTC'],
              answer: 0,
              fragments: [
                'The earliest modeled arrival is 10:00 UTC, and procedures require a two-hour safety buffer.',
                'Two hours before 10:00 UTC is 08:00 UTC.',
                'The deadline applies to satellites and crew shelter checks.',
                'Updates after the deadline may refine how long precautions remain active.'
              ],
              evidence: 'Preparations must finish by 08:00 UTC.',
              explanation: 'Subtracting the required two-hour buffer from earliest arrival gives 08:00.'
            }
          ]
        }
      ],
      finale: [
        {
          id: 'threat',
          label: 'Will the CME reach Earth?',
          options: [
            { id: 'earthward', label: 'Yes, Earth is inside its path' },
            { id: 'miss', label: 'No, it will miss Earth' },
            { id: 'unknown', label: 'Its direction is unknown' }
          ],
          answer: 'earthward'
        },
        {
          id: 'arrival',
          label: 'What is the center arrival time?',
          options: [
            { id: 'next-1300', label: '13:00 UTC next day' },
            { id: 'same-1300', label: '13:00 UTC same day' },
            { id: 'next-0100', label: '01:00 UTC next day' }
          ],
          answer: 'next-1300'
        },
        {
          id: 'response',
          label: 'What is the operational response?',
          options: [
            { id: 'safe', label: 'Enter safe mode by 08:00 UTC' },
            { id: 'update', label: 'Begin software updates at arrival' },
            { id: 'normal', label: 'Continue normal operations' }
          ],
          answer: 'safe'
        }
      ],
      reconstruction: [
        'Coronagraph images show an Earth-directed CME with Earth inside its angular span.',
        'A refined model places its center arrival at 13:00 UTC the next day.',
        'Its southward magnetic field raises the risk to unshielded satellite electronics.',
        'Operators complete safe-mode and shelter preparations by 08:00 UTC.'
      ],
      successTitle: 'Storm Preparations Complete'
    },
    {
      id: 'comet-crossing',
      title: 'Comet Crossing',
      subtitle: 'Predict a comet flyby from a short series of observations.',
      hook: 'Comet Lyra is approaching a planetary probe. Determine its motion, closest approach, and a safe observation plan.',
      sections: [
        {
          id: 'track',
          title: 'Track the Comet',
          rounds: [
            {
              value: 100,
              prompt: 'In which direction is the comet moving across the image?',
              display: '20:00 x=120 · 21:00 x=150 · 22:00 x=180',
              options: ['Toward increasing x', 'Toward decreasing x', 'It is stationary'],
              answer: 0,
              fragments: [
                'The comet’s x-position rises from 120 to 150 to 180 pixels over consecutive hours.',
                'Increasing x-values mean motion toward increasing x on this calibrated image.',
                'The reference stars remain fixed after image alignment.',
                'Each position marks the center of the comet’s bright head.'
              ],
              evidence: 'The comet moves steadily toward increasing image x.',
              explanation: 'Its measured x-coordinate increases by 30 pixels each hour.'
            },
            {
              value: 200,
              prompt: 'What is the comet’s measured angular rate?',
              display: 'POSITION CHANGE 30 arcsec · TIME 1 h',
              options: ['30 arcsec/h', '15 arcsec/h', '60 arcsec/h'],
              answer: 0,
              fragments: [
                'Angular rate equals angle traveled divided by elapsed time.',
                'The comet moves 30 arcseconds in one hour, giving 30 arcseconds per hour.',
                'The same rate appears in the following one-hour interval.',
                'One arcsecond is an angular unit; no conversion is needed here.'
              ],
              evidence: 'The measured sky motion is 30 arcseconds per hour.',
              explanation: 'Thirty arcseconds divided by one hour is 30 arcseconds per hour.'
            }
          ]
        },
        {
          id: 'distance',
          title: 'Measure the Approach',
          rounds: [
            {
              value: 100,
              prompt: 'When is the comet closest to the probe?',
              display: '02:00 1.2M km · 04:00 0.8M km · 06:00 0.5M km · 08:00 0.7M km',
              options: ['04:00 UTC', '06:00 UTC', '08:00 UTC'],
              answer: 1,
              fragments: [
                'Closest approach is the time with the smallest measured distance.',
                'The minimum listed distance is 0.5 million km at 06:00 UTC.',
                'The distance decreases before 06:00 and increases afterward.',
                'All distances come from the same fitted trajectory.'
              ],
              evidence: 'The trajectory reaches its minimum distance at 06:00 UTC.',
              explanation: '0.5 million km is the smallest distance in the series.'
            },
            {
              value: 200,
              prompt: 'What is the closest-approach distance?',
              display: 'MODEL MINIMUM · 0.50 ± 0.03 MILLION km',
              options: ['0.50 million km', '0.80 million km', '1.20 million km'],
              answer: 0,
              fragments: [
                'The fitted trajectory reports a minimum distance of 0.50 million km.',
                'Therefore the predicted closest-approach distance is 0.50 million km.',
                'The stated uncertainty is 0.03 million km.',
                'The uncertainty does not overlap the probe’s 0.30-million-km safety boundary.'
              ],
              evidence: 'The comet should pass at 0.50 ± 0.03 million km.',
              explanation: 'The model’s reported minimum is the requested flyby distance.'
            }
          ]
        },
        {
          id: 'tail',
          title: 'Interpret the Comet',
          rounds: [
            {
              value: 100,
              prompt: 'Which way should the comet’s ion tail point?',
              display: 'SUN ← COMET · SOLAR WIND FLOWS AWAY FROM SUN →',
              options: ['Away from the Sun', 'Toward the Sun', 'Along the orbit only'],
              answer: 0,
              fragments: [
                'Charged particles from the Sun push a comet’s ion tail away from the Sun.',
                'Therefore Lyra’s ion tail should point away from the Sun, regardless of its travel direction.',
                'The Sun-comet direction is known from navigation images.',
                'The dust tail may curve, but the prompt asks about the ion tail.'
              ],
              evidence: 'Solar-wind forcing places the ion tail on the anti-Sun side.',
              explanation: 'The supplied physical rule states that the ion tail points away from the Sun.'
            },
            {
              value: 200,
              prompt: 'Which observation best tests whether Lyra is becoming more active?',
              display: 'ACTIVITY = GAS/DUST OUTPUT',
              options: ['Measure coma brightness over time', 'Record one background star', 'Count probe antennas'],
              answer: 0,
              fragments: [
                'The coma is the gas-and-dust cloud around the comet; greater output makes its calibrated brightness rise.',
                'Repeated coma-brightness measurements therefore test changing activity over time.',
                'Measurements must use the same filter and exposure correction.',
                'A background star can verify that the camera sensitivity stayed stable.'
              ],
              evidence: 'A calibrated time series of coma brightness tracks changing output.',
              explanation: 'The evidence directly links coma brightness to the comet’s gas-and-dust activity.'
            }
          ]
        },
        {
          id: 'operations',
          title: 'Plan the Flyby',
          rounds: [
            {
              value: 100,
              prompt: 'Which observation window is closest to the flyby without entering the protected hour?',
              display: 'CLOSEST 06:00 · PROTECTED 05:30–06:30',
              options: ['05:00–05:30', '05:45–06:15', '06:00–06:30'],
              answer: 0,
              fragments: [
                'No science exposure may occur during the protected interval from 05:30 through 06:30 UTC.',
                'The 05:00–05:30 window ends at the boundary; the other options overlap the protected interval.',
                'The camera needs exactly 30 minutes for the planned sequence.',
                'Earlier windows have lower image resolution because the comet is farther away.'
              ],
              evidence: '05:00–05:30 UTC is the latest complete observing window outside protection.',
              explanation: 'It is the only option that does not enter the protected interval.'
            },
            {
              value: 200,
              prompt: 'Which probe orientation protects the camera from dust?',
              display: 'DUST ARRIVES FROM +X · SHIELD FACES +X',
              options: ['Shield toward +X', 'Camera toward +X', 'Antenna toward +X'],
              answer: 0,
              fragments: [
                'Navigation predicts dust will arrive from +X, and the probe’s dust shield protects the side it faces.',
                'Pointing the shield toward +X places it between the incoming dust and the camera.',
                'The antenna can maintain Earth contact in that attitude.',
                'The camera door closes before the protected interval.'
              ],
              evidence: 'Facing the shield toward +X protects the probe from the predicted dust direction.',
              explanation: 'The shield must face the direction from which particles arrive.'
            }
          ]
        }
      ],
      finale: [
        {
          id: 'time',
          label: 'When is closest approach?',
          options: [
            { id: '0400', label: '04:00 UTC' },
            { id: '0600', label: '06:00 UTC' },
            { id: '0800', label: '08:00 UTC' }
          ],
          answer: '0600'
        },
        {
          id: 'distance',
          label: 'How close will Lyra pass?',
          options: [
            { id: '050', label: '0.50 million km' },
            { id: '080', label: '0.80 million km' },
            { id: '120', label: '1.20 million km' }
          ],
          answer: '050'
        },
        {
          id: 'posture',
          label: 'What is the safe observation plan?',
          options: [
            { id: 'safe', label: 'Observe 05:00–05:30; shield toward +X' },
            { id: 'camera', label: 'Observe through 06:15; camera toward +X' },
            { id: 'late', label: 'Begin at 06:00; antenna toward +X' }
          ],
          answer: 'safe'
        }
      ],
      reconstruction: [
        'Repeated images show Lyra moving steadily at 30 arcseconds per hour.',
        'Trajectory distances reach a minimum of 0.50 million km at 06:00 UTC.',
        'The team measures the coma and expects the ion tail to point away from the Sun.',
        'The probe observes before the protected hour, then faces its shield toward incoming dust.'
      ],
      successTitle: 'Flyby Predicted'
    }
  ]
};

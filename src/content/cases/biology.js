export const biologyCategory = {
  id: 'living-systems',
  name: 'Living Systems',
  icon: '⌁',
  description: 'Use biological and ecological evidence to explain change and design practical responses.',
  cases: [
    {
      id: 'greenhouse-decline',
      title: 'The West Bench Wilt',
      subtitle: 'Diagnose a sudden greenhouse decline.',
      hook: 'Tomato seedlings on one greenhouse bench wilted in two days while nearby plants remained vigorous.',
      sections: [
        {
          id: 'pattern',
          title: 'Map the Pattern',
          rounds: [
            {
              value: 100,
              prompt: 'Which pattern best describes the decline?',
              display: 'WEST BENCH: 18/20 WILTED · EAST BENCH: 1/20 WILTED',
              options: ['Localized to the west bench', 'Uniform across the greenhouse', 'Limited to older plants'],
              answer: 0,
              fragments: [
                'Eighteen of twenty seedlings on the west bench are wilted.',
                'Only one of twenty seedlings on the east bench is wilted.',
                'Both benches contain seedlings of the same age.',
                'No wilt appears in the propagation room.'
              ],
              evidence: 'Wilt is concentrated on the west bench rather than spread through the greenhouse.',
              explanation: 'The sharply different bench counts identify a localized problem.'
            },
            {
              value: 200,
              prompt: 'Which shared factor should investigators check first?',
              display: 'SAME CULTIVAR · SAME SOIL BATCH · SEPARATE IRRIGATION LINES',
              options: ['West irrigation line', 'Seed genetics', 'Greenhouse-wide temperature'],
              answer: 0,
              fragments: [
                'Both benches use the same tomato cultivar and soil batch.',
                'Each bench is supplied by a separate irrigation line.',
                'Air temperature differs by less than 0.4°C between benches.',
                'Seedlings were randomized between benches before the decline.'
              ],
              evidence: 'The irrigation line is the main measured factor unique to the affected bench.',
              explanation: 'Shared genetics, soil, and temperature do not match the localized pattern; separate irrigation does.'
            }
          ]
        },
        {
          id: 'plant-signals',
          title: 'Read Plant Signals',
          rounds: [
            {
              value: 100,
              prompt: 'What do dry root plugs and limp leaves most directly indicate?',
              display: 'ROOT PLUG MOISTURE: WEST 9% · EAST 31%',
              options: ['Water deficit', 'Excess nitrogen', 'Low pollination'],
              answer: 0,
              fragments: [
                'West-bench root plugs contain 9% water and feel dry.',
                'East-bench root plugs contain 31% water and remain firm.',
                'Limp leaves can result when roots cannot replace water lost by leaves.',
                'Leaf nitrogen readings are equal on both benches.'
              ],
              evidence: 'Affected seedlings show a measured root-zone water deficit.',
              explanation: 'Dry plugs plus loss of leaf firmness directly support insufficient water supply.'
            },
            {
              value: 200,
              prompt: 'Which observation argues against root rot as the primary cause?',
              display: 'ROOT CHECK · COLOR / TEXTURE / ODOR',
              options: ['Roots are white and firm', 'Leaves are wilted', 'Plants share a cultivar'],
              answer: 0,
              fragments: [
                'Roots from affected seedlings are white and firm.',
                'Root-rot samples are expected to be brown, soft, or decayed.',
                'No sour odor or stem-base lesion is present.',
                'The affected plugs are dry rather than waterlogged.'
              ],
              evidence: 'Healthy-looking, firm roots and dry plugs do not match the recorded signs of root rot.',
              explanation: 'The direct root inspection contradicts the decay and saturation expected with root rot.'
            }
          ]
        },
        {
          id: 'irrigation',
          title: 'Test the Irrigation',
          rounds: [
            {
              value: 100,
              prompt: 'Which measurement locates the irrigation failure?',
              display: '60-SECOND OUTPUT · INLET 2.0 L · WEST END 0.2 L',
              options: ['Low flow at the west end', 'Normal flow at the inlet', 'Equal timer settings'],
              answer: 0,
              fragments: [
                'The west line inlet delivers 2.0 liters in sixty seconds.',
                'The final west emitter delivers only 0.2 liters in sixty seconds.',
                'The east line emitters each deliver 1.8–2.0 liters.',
                'Both irrigation timers run for the same duration.'
              ],
              evidence: 'Flow falls sharply between the west inlet and its final emitters.',
              explanation: 'Normal inlet flow but very low downstream output places the restriction within the west line.'
            },
            {
              value: 200,
              prompt: 'What most likely blocks the west line?',
              display: 'FILTER SAMPLE · WHITE CRYSTALS · DISSOLVE IN VINEGAR',
              options: ['Mineral scale', 'Algal shade', 'Insect feeding'],
              answer: 0,
              fragments: [
                'White crystals coat the west-line filter and emitter openings.',
                'The crystals dissolve in dilute vinegar, as carbonate scale does.',
                'No algae are visible in the opaque irrigation tubing.',
                'No chewing marks or insects appear on affected roots.'
              ],
              evidence: 'Carbonate-like mineral deposits obstruct the west filter and emitters.',
              explanation: 'The deposit location and vinegar response identify mineral scale as the flow restriction.'
            }
          ]
        },
        {
          id: 'recovery',
          title: 'Confirm Recovery',
          rounds: [
            {
              value: 100,
              prompt: 'Which intervention most directly tests the diagnosis?',
              display: 'CHANGE ONE CAUSAL FACTOR · MEASURE FLOW',
              options: ['Clean the line and flush emitters', 'Add more fertilizer', 'Shade the whole greenhouse'],
              answer: 0,
              fragments: [
                'The diagnosis predicts that removing scale will restore west-line flow.',
                'Cleaning and flushing directly remove the observed obstruction.',
                'Adding fertilizer does not open a blocked emitter.',
                'Whole-house shading does not correct a bench-specific flow loss.'
              ],
              evidence: 'Cleaning and flushing target the measured restriction and provide a direct test.',
              explanation: 'A successful flow recovery after removing scale would confirm the causal link.'
            },
            {
              value: 200,
              prompt: 'Which result confirms recovery rather than a temporary surface wetting?',
              display: '24 HOURS AFTER FLUSH',
              options: ['Emitter flow and root moisture normalize', 'Leaves are misted once', 'Air temperature falls 1°C'],
              answer: 0,
              fragments: [
                'After flushing, each west emitter delivers 1.9 liters per minute.',
                'West root-plug moisture rises from 9% to 29% after a full cycle.',
                'Leaf firmness returns within twenty-four hours.',
                'No fertilizer or temperature setting changed.'
              ],
              evidence: 'Restored emitter output, root moisture, and leaf firmness confirm irrigation recovery.',
              explanation: 'The causal mechanism and plant response both recover without another treatment.'
            }
          ]
        }
      ],
      finale: [
        {
          id: 'cause',
          label: 'Primary cause',
          options: [
            { id: 'scale', label: 'Mineral scale blocking west emitters' },
            { id: 'root-rot', label: 'Greenhouse-wide root rot' },
            { id: 'genetics', label: 'Weak seed genetics' }
          ],
          answer: 0
        },
        {
          id: 'diagnostic',
          label: 'Decisive measurement',
          options: [
            { id: 'humidity', label: 'Room humidity' },
            { id: 'flow', label: 'Inlet-to-emitter flow loss' },
            { id: 'height', label: 'Seedling height' }
          ],
          answer: 1
        },
        {
          id: 'response',
          label: 'Correct response',
          options: [
            { id: 'fertilize', label: 'Increase fertilizer' },
            { id: 'reseed', label: 'Replace the cultivar' },
            { id: 'flush', label: 'Clean the filter and flush emitters' }
          ],
          answer: 2
        }
      ],
      reconstruction: [
        'The decline was localized to seedlings served by the west irrigation line.',
        'Dry root plugs and firm white roots indicated water deficit, not root decay.',
        'Normal inlet flow but low emitter flow led investigators to carbonate scale.',
        'Cleaning and flushing restored flow, root moisture, and leaf firmness.'
      ],
      successTitle: 'The Greenhouse Recovers'
    },
    {
      id: 'coral-stress',
      title: 'The Pale Reef',
      subtitle: 'Explain a sudden coral bleaching event.',
      hook: 'A reef-monitoring team finds pale coral colonies after an unusually calm summer week.',
      sections: [
        {
          id: 'symptoms',
          title: 'Identify the Change',
          rounds: [
            {
              value: 100,
              prompt: 'What process best explains pale living coral tissue?',
              display: 'TISSUE PRESENT · COLOR LOST · ALGAE DENSITY DOWN 78%',
              options: ['Bleaching', 'Sediment burial', 'Predator removal'],
              answer: 0,
              fragments: [
                'Coral tissue remains present, but its color has faded.',
                'Microscopy shows a 78% decline in symbiotic algae within the tissue.',
                'Bleaching is the loss of coral symbionts or their pigments.',
                'No sediment layer covers the colonies.'
              ],
              evidence: 'Living pale tissue with sharply reduced symbiotic algae identifies coral bleaching.',
              explanation: 'The observations match the supplied definition of bleaching.'
            },
            {
              value: 200,
              prompt: 'Why does prolonged bleaching threaten coral energy supply?',
              display: 'NORMAL CORAL ENERGY · SYMBIONT PHOTOSYNTHESIS: UP TO 90%',
              options: ['Less photosynthetic energy reaches coral', 'Coral receives more sediment', 'Seawater loses all oxygen'],
              answer: 0,
              fragments: [
                'Symbiotic algae can provide up to 90% of a coral host’s energy through photosynthesis.',
                'The bleached colonies have lost most of those algae.',
                'Coral polyps remain alive and can still capture some food.',
                'Dissolved oxygen stayed within the site’s normal range.'
              ],
              evidence: 'Loss of photosynthetic symbionts sharply reduces the coral host’s main energy source.',
              explanation: 'The energy contribution and measured symbiont loss directly establish the consequence.'
            }
          ]
        },
        {
          id: 'temperature',
          title: 'Check Heat Exposure',
          rounds: [
            {
              value: 100,
              prompt: 'Which temperature record overlaps the onset of paling?',
              display: 'LOCAL BLEACHING THRESHOLD: 30.0°C',
              options: ['31.2°C for eight days', '28.1°C for eight days', '24.0°C for one hour'],
              answer: 0,
              fragments: [
                'The site’s bleaching threshold is 30.0°C.',
                'A reef logger recorded 31.2°C for eight consecutive days before paling.',
                'The previous month averaged 28.1°C without bleaching.',
                'The logger passed calibration before and after deployment.'
              ],
              evidence: 'The reef remained 1.2°C above its bleaching threshold for eight days before paling.',
              explanation: 'Only the prolonged 31.2°C record exceeds the supplied local threshold.'
            },
            {
              value: 200,
              prompt: 'Why did the shallow lagoon bleach more than the channel?',
              display: 'LAGOON 31.2°C · CHANNEL 29.1°C · SAME CORAL SPECIES',
              options: ['Greater lagoon heat exposure', 'Different coral species', 'Lower channel salinity'],
              answer: 0,
              fragments: [
                'The shallow lagoon reached 31.2°C while the channel stayed at 29.1°C.',
                'Bleaching affected 64% of lagoon colonies but 9% of channel colonies.',
                'The same coral species was surveyed in both habitats.',
                'Salinity differed by less than 0.2 parts per thousand.'
              ],
              evidence: 'Higher heat exposure coincides with much greater bleaching in the same species.',
              explanation: 'Species and salinity are controlled, leaving the threshold-crossing temperature difference.'
            }
          ]
        },
        {
          id: 'alternatives',
          title: 'Test Alternatives',
          rounds: [
            {
              value: 100,
              prompt: 'Which evidence argues against nutrient runoff as the immediate trigger?',
              display: 'NITRATE · BEFORE 0.18 mg/L · EVENT 0.17 mg/L',
              options: ['Nitrate did not increase', 'Water was warm', 'Coral was pale'],
              answer: 0,
              fragments: [
                'Nitrate measured 0.18 mg/L before the event.',
                'Nitrate measured 0.17 mg/L during the event.',
                'No river discharge or rainfall pulse occurred that week.',
                'Nearby reference water had 0.18 mg/L nitrate.'
              ],
              evidence: 'Nitrate remained at background levels with no runoff pulse.',
              explanation: 'An immediate nutrient-runoff trigger would require a relevant input or increase, neither of which was observed.'
            },
            {
              value: 200,
              prompt: 'Which observation argues against disease as the main explanation?',
              display: 'COLONY SURVEY · PALE UNIFORMLY · NO LESION MARGINS',
              options: ['Uniform paling without lesions', 'Eight warm days', 'Calm surface water'],
              answer: 0,
              fragments: [
                'Affected colonies pale uniformly across intact tissue.',
                'The surveyed coral disease produces discrete lesions with advancing tissue-loss margins.',
                'Divers found no tissue-loss margins on 48 examined colonies.',
                'Paling appeared across three species at the same time.'
              ],
              evidence: 'Uniform intact paling lacks the defined lesion pattern of the surveyed disease.',
              explanation: 'The observed tissue pattern matches bleaching and contradicts the supplied disease signs.'
            }
          ]
        },
        {
          id: 'response',
          title: 'Plan the Response',
          rounds: [
            {
              value: 100,
              prompt: 'Which monitoring plan best tests whether heat stress is easing?',
              display: 'TRACK DRIVER + BIOLOGICAL RESPONSE',
              options: ['Log temperature and repeat bleaching surveys', 'Count boats once', 'Measure sand grain size'],
              answer: 0,
              fragments: [
                'Heat stress is the identified driver, so temperature must be tracked continuously.',
                'Bleaching extent is the biological response, so colony surveys must be repeated.',
                'A paired time series can show whether cooling precedes recovery.',
                'A single boat count cannot measure either reef heat or coral recovery.'
              ],
              evidence: 'Continuous temperature records paired with repeat colony surveys track both cause and response.',
              explanation: 'The paired measurements directly test whether reduced heat is followed by biological recovery.'
            },
            {
              value: 200,
              prompt: 'Which local action reduces an additional stress while the reef cools?',
              display: 'MOORING SCARS FOUND ON 12% OF SURVEYED COLONIES',
              options: ['Install fixed moorings', 'Anchor more often', 'Remove herbivorous fish'],
              answer: 0,
              fragments: [
                'Boat anchors have scarred 12% of surveyed colonies.',
                'Fixed mooring buoys let boats stop without dropping anchors on coral.',
                'Local managers cannot directly lower regional ocean temperature.',
                'Herbivorous fish limit algae that can compete with recovering coral.'
              ],
              evidence: 'Fixed moorings remove documented anchor damage without weakening grazing.',
              explanation: 'The action addresses a measured local stress and preserves a helpful ecological function.'
            }
          ]
        }
      ],
      finale: [
        {
          id: 'event',
          label: 'Observed event',
          options: [
            { id: 'bleaching', label: 'Coral bleaching' },
            { id: 'burial', label: 'Sediment burial' },
            { id: 'predation', label: 'Predator outbreak' }
          ],
          answer: 0
        },
        {
          id: 'driver',
          label: 'Primary driver',
          options: [
            { id: 'nitrate', label: 'Nitrate pulse' },
            { id: 'heat', label: 'Eight days above the heat threshold' },
            { id: 'salinity', label: 'Sharp salinity drop' }
          ],
          answer: 1
        },
        {
          id: 'plan',
          label: 'Best response plan',
          options: [
            { id: 'wait', label: 'Stop all measurements' },
            { id: 'fish', label: 'Remove herbivorous fish' },
            { id: 'monitor', label: 'Monitor heat and bleaching; install fixed moorings' }
          ],
          answer: 2
        }
      ],
      reconstruction: [
        'Living coral tissue paled as most of its photosynthetic symbionts disappeared.',
        'The lagoon exceeded its local bleaching threshold for eight consecutive days.',
        'Stable nutrients and absent lesions weakened runoff and disease explanations.',
        'The team paired heat and bleaching monitoring while preventing further anchor damage.'
      ],
      successTitle: 'The Reef Signal Explained'
    },
    {
      id: 'wildlife-crossing',
      title: 'Across Redstone Highway',
      subtitle: 'Design a safer wildlife crossing.',
      hook: 'A new highway segment cuts between mule deer winter range and their spring feeding grounds.',
      sections: [
        {
          id: 'movement',
          title: 'Map Animal Movement',
          rounds: [
            {
              value: 100,
              prompt: 'Which site carries the main deer movement corridor?',
              display: 'TRACKS PER NIGHT · A 6 · B 41 · C 9',
              options: ['Site A', 'Site B', 'Site C'],
              answer: 1,
              fragments: [
                'Camera traps record 41 mule deer passages per night at Site B.',
                'Sites A and C record 6 and 9 passages per night.',
                'All cameras operated for the same thirty nights.',
                'Track surveys independently show the densest trail at Site B.'
              ],
              evidence: 'Site B has the highest standardized deer movement by camera and track surveys.',
              explanation: 'Both independent measures identify Site B as the main corridor.'
            },
            {
              value: 200,
              prompt: 'When is collision risk highest?',
              display: 'DEER CROSSINGS · 05:00–07:00: 62% · OTHER HOURS: 38%',
              options: ['Dawn', 'Midday', 'Midnight only'],
              answer: 0,
              fragments: [
                'Sixty-two percent of recorded deer crossings occur from 05:00 to 07:00.',
                'Traffic begins its morning peak at 06:00.',
                'Only eight percent of crossings occur from 11:00 to 14:00.',
                'Camera timestamps were synchronized to the traffic counter.'
              ],
              evidence: 'Most deer crossings overlap rising traffic around dawn.',
              explanation: 'The 05:00–07:00 movement peak and 06:00 traffic increase create the strongest overlap.'
            }
          ]
        },
        {
          id: 'site',
          title: 'Choose the Site',
          rounds: [
            {
              value: 100,
              prompt: 'Which location best aligns a crossing with habitat on both sides?',
              display: 'SITE B · SHRUB COVER NORTH + MEADOW SOUTH',
              options: ['Site B', 'A depot entrance', 'An exposed rock cut'],
              answer: 0,
              fragments: [
                'At Site B, the established trail reaches the road from both directions.',
                'Shrub cover lies north of Site B and feeding meadow lies south.',
                'The depot entrance has heavy night lighting and human activity.',
                'The rock cut ends at a retaining wall on its north side.'
              ],
              evidence: 'Site B connects the established trail and usable habitat on both sides of the highway.',
              explanation: 'It alone provides continuous approach habitat along the measured movement corridor.'
            },
            {
              value: 200,
              prompt: 'Which terrain feature favors an underpass at Site B?',
              display: 'DRY RAVINE · 5 m BELOW ROAD GRADE',
              options: ['Existing ravine below the road', 'Flat ridge above the road', 'Busy interchange'],
              answer: 0,
              fragments: [
                'A dry ravine at Site B passes five meters below road grade.',
                'An underpass can follow the ravine without requiring animals to climb to traffic level.',
                'The ridge option would require a long elevated structure.',
                'The ravine remains dry during the migration months.'
              ],
              evidence: 'The existing below-grade ravine provides a direct, dry route for an underpass.',
              explanation: 'Its elevation and seasonal dryness fit the crossing type with the least route disruption.'
            }
          ]
        },
        {
          id: 'design',
          title: 'Design the Structure',
          rounds: [
            {
              value: 100,
              prompt: 'Which underpass design matches the documented mule deer behavior?',
              display: 'LOCAL TRIAL · USE: OPEN 74% · NARROW 18%',
              options: ['Wide, open approaches', 'Narrow dark pipe', 'Closed concrete corridor'],
              answer: 0,
              fragments: [
                'In a local trial, deer used wide open structures in 74% of approaches.',
                'They used narrow dark structures in only 18% of approaches.',
                'Clear sight lines let deer see habitat beyond the crossing.',
                'The target species is mule deer, matching the trial population.'
              ],
              evidence: 'Local mule deer strongly prefer crossings with wide openings and clear sight lines.',
              explanation: 'The species-matched trial directly favors the open design.'
            },
            {
              value: 200,
              prompt: 'What feature guides deer into the underpass instead of onto the road?',
              display: 'APPROACH CONTROL',
              options: ['Continuous funnel fencing', 'Brighter road lights', 'Roadside salt blocks'],
              answer: 0,
              fragments: [
                'Continuous wildlife fencing blocks direct access to the highway.',
                'Fencing angled toward the entrance funnels animals to the underpass.',
                'A 300-meter fence gap would leave an unprotected road entry.',
                'Salt blocks would attract deer toward the roadside.'
              ],
              evidence: 'Continuous funnel fencing redirects approaching deer from pavement to the crossing entrance.',
              explanation: 'The barrier and its angle jointly prevent road access and guide movement.'
            }
          ]
        },
        {
          id: 'evaluation',
          title: 'Measure Success',
          rounds: [
            {
              value: 100,
              prompt: 'Which comparison best measures whether the project reduces collisions?',
              display: 'THREE YEARS BEFORE ↔ THREE YEARS AFTER',
              options: ['Collision rate per traffic volume', 'One opening-day photograph', 'Total regional rainfall'],
              answer: 0,
              fragments: [
                'Collision counts should be standardized by traffic volume.',
                'Three years of pre-construction collision records are available.',
                'The same road segment can be tracked for three years after construction.',
                'An opening-day photograph does not measure long-term collision change.'
              ],
              evidence: 'Before-and-after collision rates adjusted for traffic provide a comparable safety measure.',
              explanation: 'The rate accounts for changing traffic and uses matched multi-year periods.'
            },
            {
              value: 200,
              prompt: 'Which evidence shows the crossing preserves movement as well as safety?',
              display: 'CAMERAS + IDENTIFIABLE COLLARS',
              options: ['Animals enter and emerge on opposite sides', 'Fewer roadside flowers', 'More vehicles use the road'],
              answer: 0,
              fragments: [
                'Paired cameras record collared deer entering and emerging from opposite portals.',
                'Matching collar IDs confirm complete passages rather than entrance visits.',
                'Seasonal passage counts can be compared with the pre-road corridor count.',
                'Traffic volume alone cannot show habitat connectivity.'
              ],
              evidence: 'Matched animals completing passages demonstrate functional movement through the crossing.',
              explanation: 'Entrance and exit records for the same deer directly measure successful connectivity.'
            }
          ]
        }
      ],
      finale: [
        {
          id: 'location',
          label: 'Crossing location',
          options: [
            { id: 'a', label: 'Site A' },
            { id: 'b', label: 'Site B' },
            { id: 'c', label: 'Site C' }
          ],
          answer: 1
        },
        {
          id: 'structure',
          label: 'Crossing structure',
          options: [
            { id: 'pipe', label: 'Narrow dark pipe' },
            { id: 'bridge', label: 'Unfenced roadside bridge' },
            { id: 'underpass', label: 'Wide ravine underpass with open approaches' }
          ],
          answer: 2
        },
        {
          id: 'guidance',
          label: 'Approach treatment',
          options: [
            { id: 'fence', label: 'Continuous funnel fencing' },
            { id: 'lights', label: 'Bright highway lighting' },
            { id: 'salt', label: 'Roadside salt blocks' }
          ],
          answer: 0
        }
      ],
      reconstruction: [
        'Standardized cameras and tracks identified Site B as the main dawn movement corridor.',
        'A dry ravine there connects cover and feeding habitat below road grade.',
        'A wide underpass with clear sight lines and funnel fencing matches deer behavior.',
        'Collision rates and matched camera passages will test safety and connectivity.'
      ],
      successTitle: 'A Safer Migration Route'
    },
    {
      id: 'food-source-trace',
      title: 'The Spinach Lot',
      subtitle: 'Trace a food contamination source.',
      hook: 'Routine testing detects the same non-clinical bacterial marker in several sealed spinach bags from one production day.',
      sections: [
        {
          id: 'lots',
          title: 'Define the Lot',
          rounds: [
            {
              value: 100,
              prompt: 'Which code is shared by every positive bag?',
              display: 'POSITIVE BAGS · L7-B-14 · L7-B-22 · L7-B-31',
              options: ['Line 7 and Field B', 'Line 4 and Field A', 'Line 9 and Field C'],
              answer: 0,
              fragments: [
                'Every positive bag begins with lot code L7-B.',
                'The code key defines L7 as packing line 7 and B as Field B.',
                'Negative bags include codes L7-A and L4-B.',
                'The final digits identify package sequence, not source field.'
              ],
              evidence: 'All positive bags share packing line 7 and Field B.',
              explanation: 'The supplied code key translates the common L7-B prefix.'
            },
            {
              value: 200,
              prompt: 'Which comparison separates the field source from the packing line?',
              display: 'L7-A: NEGATIVE · L7-B: POSITIVE · L4-B: POSITIVE',
              options: ['Field B across two lines', 'Line 7 across two fields', 'Package sequence numbers'],
              answer: 0,
              fragments: [
                'Field B spinach tests positive after packing on lines 7 and 4.',
                'Field A spinach tests negative after packing on line 7.',
                'A line-source hypothesis predicts positives from multiple fields on the same line.',
                'A field-source hypothesis predicts positives from that field on multiple lines.'
              ],
              evidence: 'Positives follow Field B across two lines, while Field A remains negative on line 7.',
              explanation: 'The cross-classified lots separate field origin from packing equipment.'
            }
          ]
        },
        {
          id: 'facility',
          title: 'Check the Facility',
          rounds: [
            {
              value: 100,
              prompt: 'What do the sanitation samples show about line 7?',
              display: 'PRE-OP SWABS · 12/12 NEGATIVE',
              options: ['No marker detected before production', 'Line 7 was confirmed as the source', 'The test was not performed'],
              answer: 0,
              fragments: [
                'All twelve line 7 pre-operation swabs test negative for the marker.',
                'Positive-control and negative-control tests both perform correctly.',
                'The swabs cover belts, cutters, and wash contact surfaces.',
                'Line 7 was sanitized before the sampled production run.'
              ],
              evidence: 'Validated pre-operation sampling found no marker on line 7 food-contact surfaces.',
              explanation: 'The complete negative swab set supports, but does not alone prove, a clean pre-operation line.'
            },
            {
              value: 200,
              prompt: 'Which result most strongly rules out wash water as the common source?',
              display: 'WASH LOOP W3 · FIELDS A, B, C',
              options: ['Only Field B lots are positive', 'Water temperature was recorded', 'Bags were sealed'],
              answer: 0,
              fragments: [
                'The same wash loop W3 processed spinach from Fields A, B, and C.',
                'Only Field B lots contain the marker; Fields A and C test negative.',
                'Wash-water samples collected during the run test negative.',
                'A common contaminated wash loop should expose all three field lots.'
              ],
              evidence: 'Shared wash-loop exposure did not produce positives outside Field B, and the water tested negative.',
              explanation: 'The distribution does not follow wash-loop use; it follows field origin.'
            }
          ]
        },
        {
          id: 'field',
          title: 'Trace Field Inputs',
          rounds: [
            {
              value: 100,
              prompt: 'Which irrigation source is unique to Field B?',
              display: 'FIELD A: WELL 1 · FIELD B: CANAL 3 · FIELD C: WELL 1',
              options: ['Canal 3', 'Well 1', 'Wash loop W3'],
              answer: 0,
              fragments: [
                'Field B alone was irrigated from Canal 3 during the final week.',
                'Fields A and C used tested groundwater from Well 1.',
                'All fields later shared wash loop W3.',
                'Harvest crews rotated among all three fields.'
              ],
              evidence: 'Canal 3 is the only recorded input unique to the positive field.',
              explanation: 'Other listed inputs are shared with negative lots, while Canal 3 maps only to Field B.'
            },
            {
              value: 200,
              prompt: 'Which sample links Canal 3 to the spinach marker?',
              display: 'MARKER PROFILE · FOOD B-17 = C3-04',
              options: ['Canal sample C3-04', 'Well sample W1-02', 'Conveyor swab L7-06'],
              answer: 0,
              fragments: [
                'Canal sample C3-04 has the same marker profile as Field B spinach sample B-17.',
                'Well sample W1-02 and conveyor swab L7-06 lack the marker.',
                'The laboratory ran duplicate tests with matching results.',
                'Sample labels were sealed and logged from collection through analysis.'
              ],
              evidence: 'Validated duplicate tests match the Field B marker to Canal 3 sample C3-04.',
              explanation: 'The matching profiles and negative alternatives provide the direct source link.'
            }
          ]
        },
        {
          id: 'control',
          title: 'Contain and Verify',
          rounds: [
            {
              value: 100,
              prompt: 'Which containment action follows the evidence most precisely?',
              display: 'TRACE SCOPE · FIELD B · CANAL 3 · LISTED LOTS',
              options: ['Hold traced Field B lots and stop Canal 3 use', 'Discard every product from every month', 'Continue Canal 3 irrigation'],
              answer: 0,
              fragments: [
                'Positive results are confined to traced Field B lots.',
                'Canal 3 is the matched environmental source and remains connected to Field B.',
                'Holding traced lots prevents their distribution during the investigation.',
                'Stopping Canal 3 use interrupts the identified exposure route.'
              ],
              evidence: 'A targeted lot hold plus suspension of Canal 3 addresses both product and source.',
              explanation: 'The action is bounded by the trace data and interrupts the evidenced route.'
            },
            {
              value: 200,
              prompt: 'What evidence is needed before the corrected source is accepted?',
              display: 'VERIFY WATER + NEW CROP LOTS',
              options: ['Repeated negative source and product tests', 'A new package color', 'One visual inspection'],
              answer: 0,
              fragments: [
                'Corrective work is complete only after repeated Canal 3 samples test negative.',
                'New Field B lots must also test negative under the same validated method.',
                'A visual inspection cannot detect the bacterial marker.',
                'The verification plan specifies separate sampling dates.'
              ],
              evidence: 'Repeated negative water and product tests on separate dates verify the correction.',
              explanation: 'The plan measures both the source and downstream product with the validated assay.'
            }
          ]
        }
      ],
      finale: [
        {
          id: 'origin',
          label: 'Contamination origin',
          options: [
            { id: 'line7', label: 'Packing line 7' },
            { id: 'canal3', label: 'Canal 3 irrigation water' },
            { id: 'well1', label: 'Well 1 groundwater' }
          ],
          answer: 1
        },
        {
          id: 'route',
          label: 'Exposure route',
          options: [
            { id: 'wash', label: 'Shared wash loop' },
            { id: 'bags', label: 'Package sequence labels' },
            { id: 'irrigation', label: 'Field B irrigation' }
          ],
          answer: 2
        },
        {
          id: 'action',
          label: 'Evidence-based action',
          options: [
            { id: 'hold', label: 'Hold traced lots, stop source use, then verify' },
            { id: 'continue', label: 'Continue production unchanged' },
            { id: 'visual', label: 'Rely on visual inspection alone' }
          ],
          answer: 0
        }
      ],
      reconstruction: [
        'Lot-code comparisons showed that positives followed Field B across two packing lines.',
        'Facility swabs and shared wash-loop comparisons did not support a packing source.',
        'Field B uniquely used Canal 3, whose marker profile matched the spinach sample.',
        'Investigators held traced lots, stopped canal use, and required repeated negative verification.'
      ],
      successTitle: 'The Source Is Traced'
    },
    {
      id: 'pollinator-restoration',
      title: 'The Silent Orchard Edge',
      subtitle: 'Restore a declining pollinator community.',
      hook: 'Wild bee visits have fallen along an orchard edge where flowers now disappear after early spring.',
      sections: [
        {
          id: 'baseline',
          title: 'Measure the Decline',
          rounds: [
            {
              value: 100,
              prompt: 'Which comparison confirms a local pollinator decline?',
              display: 'BEE VISITS / 10 MIN · ORCHARD EDGE 3 · REFERENCE MEADOW 14',
              options: ['Lower standardized visits at the orchard edge', 'Different observer names', 'A single cloudy minute'],
              answer: 0,
              fragments: [
                'The orchard edge averages three bee visits per ten-minute survey.',
                'The reference meadow averages fourteen visits per ten-minute survey.',
                'Surveys use the same observer protocol, dates, and weather limits.',
                'Each site was sampled twenty times.'
              ],
              evidence: 'Repeated standardized surveys show substantially fewer bee visits at the orchard edge.',
              explanation: 'Equivalent effort and conditions make the visit rates directly comparable.'
            },
            {
              value: 200,
              prompt: 'Which missing resource best matches the seasonal drop?',
              display: 'FLOWER COVER · APRIL 42% · JUNE 4% · AUGUST 2%',
              options: ['Mid- and late-season blooms', 'Bare pavement', 'More night lighting'],
              answer: 0,
              fragments: [
                'Flower cover at the orchard edge falls from 42% in April to 4% in June.',
                'It falls again to 2% in August, when bee visits are lowest.',
                'Adult bees need nectar and pollen throughout their active season.',
                'The reference meadow maintains at least 28% flower cover through August.'
              ],
              evidence: 'The orchard edge lacks the continuous summer bloom resources available at the reference site.',
              explanation: 'The timing of low flower cover and low visits identifies a seasonal forage gap.'
            }
          ]
        },
        {
          id: 'habitat',
          title: 'Inspect Habitat',
          rounds: [
            {
              value: 100,
              prompt: 'Which feature should be retained for ground-nesting bees?',
              display: 'NEST SURVEY · 17/23 NESTS IN OPEN SOIL PATCHES',
              options: ['Small undisturbed bare-soil patches', 'Continuous plastic mulch', 'Deep weekly tillage'],
              answer: 0,
              fragments: [
                'Seventeen of twenty-three mapped bee nests occur in open, undisturbed soil patches.',
                'Ground-nesting bees excavate nests where soil remains accessible.',
                'Plastic mulch covers the soil surface.',
                'Deep tillage destroys existing underground nest tunnels.'
              ],
              evidence: 'Most mapped nests depend on accessible, undisturbed bare soil.',
              explanation: 'The nest locations and supplied nesting behavior support retaining those patches.'
            },
            {
              value: 200,
              prompt: 'Which material supports cavity-nesting bees?',
              display: 'STEM INSPECTION · 11 OCCUPIED HOLLOW STEMS',
              options: ['Standing hollow stems', 'Fresh concrete posts', 'Sealed metal tubes'],
              answer: 0,
              fragments: [
                'Inspectors find eleven occupied nests in standing hollow stems.',
                'Cavity-nesting bees use dry tunnels with an open entrance.',
                'All stems were cut to ground level in last year’s autumn cleanup.',
                'Concrete posts and sealed tubes provide no open nesting cavity.'
              ],
              evidence: 'Occupied hollow stems demonstrate a local nesting resource worth retaining.',
              explanation: 'Direct nest observations identify the usable material.'
            }
          ]
        },
        {
          id: 'chemical',
          title: 'Reduce Exposure',
          rounds: [
            {
              value: 100,
              prompt: 'When did bee visits fall most sharply?',
              display: 'VISITS · BEFORE SPRAY 8 · 24 H AFTER 2 · 7 DAYS AFTER 3',
              options: ['Immediately after daytime bloom spraying', 'Before any spray', 'During winter dormancy'],
              answer: 0,
              fragments: [
                'Bee visits fell from eight to two per survey within twenty-four hours of spraying.',
                'The application occurred at midday while clover was blooming and bees were active.',
                'Wind and temperature remained within the survey limits.',
                'An unsprayed comparison strip stayed near eight visits.'
              ],
              evidence: 'The visit decline follows daytime spraying only in the exposed blooming strip.',
              explanation: 'Timing plus the stable unsprayed comparison links the local decline to exposure.'
            },
            {
              value: 200,
              prompt: 'Which practice best reduces pollinator exposure when treatment is necessary?',
              display: 'GOAL · AVOID ACTIVE BEES AND OPEN BLOOMS',
              options: ['Use a targeted treatment after dusk when blooms are absent', 'Broadcast spray open flowers at noon', 'Increase spray drift'],
              answer: 0,
              fragments: [
                'Bee activity at this site falls to near zero after dusk.',
                'Mowing spent blooms before a necessary targeted treatment removes attractive flowers.',
                'Targeted application limits the treated area.',
                'Midday broadcast treatment overlaps peak bee activity.'
              ],
              evidence: 'A targeted after-dusk treatment without open blooms minimizes overlap with active foragers.',
              explanation: 'The timing, flower condition, and limited area each reduce documented exposure.'
            }
          ]
        },
        {
          id: 'restoration',
          title: 'Build the Recovery',
          rounds: [
            {
              value: 100,
              prompt: 'Which planting plan closes the forage gap?',
              display: 'TARGET · BLOOM APRIL THROUGH SEPTEMBER',
              options: ['Native early, middle, and late bloomers', 'One early-blooming species', 'Mown turf only'],
              answer: 0,
              fragments: [
                'The measured forage gap begins after early spring.',
                'A mix of native species is available with overlapping bloom from April through September.',
                'A single early species finishes flowering in May.',
                'Mown turf provides less than 1% flower cover.'
              ],
              evidence: 'Overlapping native bloom periods provide forage across the entire active season.',
              explanation: 'The diverse sequence directly fills the measured June-to-August gap.'
            },
            {
              value: 200,
              prompt: 'Which mowing schedule protects both flowers and overwintering habitat?',
              display: 'ROTATIONAL MANAGEMENT',
              options: ['Mow one section at a time after seed set', 'Mow every section monthly', 'Remove all stems in autumn'],
              answer: 0,
              fragments: [
                'Rotational mowing leaves an unmown refuge and flowers in every cycle.',
                'Waiting until after seed set allows planted species to reproduce.',
                'Some bees overwinter in standing stems and undisturbed soil.',
                'Monthly whole-site mowing removes blooms and nesting cover at once.'
              ],
              evidence: 'Rotational post-seed mowing preserves continuous refuge, reproduction, and nesting structure.',
              explanation: 'The schedule avoids eliminating all food and shelter simultaneously.'
            }
          ]
        }
      ],
      finale: [
        {
          id: 'forage',
          label: 'Forage restoration',
          options: [
            { id: 'single', label: 'Plant one early-flowering species' },
            { id: 'sequence', label: 'Plant overlapping native bloom seasons' },
            { id: 'turf', label: 'Replace flowers with turf' }
          ],
          answer: 1
        },
        {
          id: 'nesting',
          label: 'Nesting habitat',
          options: [
            { id: 'pave', label: 'Pave bare soil' },
            { id: 'clear', label: 'Remove every standing stem' },
            { id: 'retain', label: 'Retain bare-soil patches and hollow stems' }
          ],
          answer: 2
        },
        {
          id: 'management',
          label: 'Safer management',
          options: [
            { id: 'rotate', label: 'Rotate mowing and target treatments after dusk' },
            { id: 'monthly', label: 'Mow the whole edge monthly' },
            { id: 'noon', label: 'Broadcast spray open blooms at noon' }
          ],
          answer: 0
        }
      ],
      reconstruction: [
        'Standardized surveys confirmed fewer bee visits and a summer forage gap.',
        'Mapped nests showed that bare soil and hollow stems support local bees.',
        'A comparison strip linked the sharpest visit decline to daytime bloom spraying.',
        'Season-long native flowers, nesting refuges, and rotational management rebuilt habitat.'
      ],
      successTitle: 'The Orchard Edge Blooms Again'
    }
  ]
};

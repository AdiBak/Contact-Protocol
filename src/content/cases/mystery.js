const round = (value, prompt, display, options, answer, fragments, evidence, explanation) => ({
  value, prompt, display, options, answer, fragments, evidence, explanation
});

const section = (id, name, icon, description, rounds) => ({
  id, name, icon, description, rounds
});

const choice = (id, label, detail) => detail ? { id, label, detail } : { id, label };

const part = (id, label, options, answer) => ({ id, label, options, answer });

export const mysteryCategory = {
  id: 'case-files',
  name: 'Case Files',
  icon: '⌕',
  description: 'Solve grounded mysteries by comparing records, measurements, maps, and statements.',
  cases: [
    {
      id: 'missing-masterpiece',
      title: 'The Missing Masterpiece',
      subtitle: 'An empty frame after closing',
      hook: 'At 6:20 PM, The Blue Hour is gone from Gallery Three, but its wired frame still hangs untouched.',
      sections: [
        section('masterpiece-time', 'Timeline', '◷', 'Correct the clocks and narrow the window.', [
          round(100, 'The gallery camera runs four minutes fast. When was its 6:18 PM image actually taken?', 'CAMERA 6:18 · CLOCK +4 MIN', ['6:14 PM', '6:18 PM', '6:22 PM'], 0, [
            'A clock four minutes fast shows 6:18 PM when the actual time is 6:14 PM.',
            'The technician confirmed the camera stayed exactly four minutes fast.',
            'The lobby clock was checked against the building clock.',
            'The correction applies to every gallery image that evening.'
          ], 'The painting was last pictured at 6:14 PM actual time.', 'Subtracting the four-minute error gives 6:14 PM.'),
          round(200, 'Who entered the east service door before the corrected final image?', 'ENTRY LOG · FINAL IMAGE 6:14', ['Nora at 6:16', 'Elliot at 6:12', 'Marcus at 6:19'], 1, [
            'The corrected final image time is 6:14 PM.',
            'Elliot’s badge opened the east service door at 6:12 PM.',
            'Nora’s badge appears only at the lobby exit.',
            'Marcus remained at the front desk until 6:22 PM.'
          ], 'Elliot entered two minutes before the last image.', 'Only Elliot’s listed entry precedes 6:14 PM.')
        ]),
        section('masterpiece-size', 'Measurements', '↔', 'Match the canvas to its container.', [
          round(100, 'What was removed if the frame and alarm wire remained on the wall?', 'FRAME PRESENT · CANVAS ABSENT', ['The whole frame', 'Only the canvas', 'The alarm box'], 1, [
            'The empty wooden frame was still fixed to the wall.',
            'The canvas was absent and all removable holding clips were open.',
            'The alarm wire had not been cut.',
            'No broken wood was found below the frame.'
          ], 'The canvas was separated from its frame.', 'The present frame and absent canvas leave only the canvas as the removed item.'),
          round(200, 'Which missing container could hold the rolled 72 cm canvas?', 'ROLLED LENGTH 72 cm', ['40 cm document case', '80 cm archival tube', '55 cm tool bag'], 1, [
            'A rolled 72 cm canvas needs a container longer than 72 cm.',
            'An 80 cm archival tube is missing from conservation.',
            'The document case is rigid and 40 cm long.',
            'The tool bag has 55 cm of internal length.'
          ], 'The missing 80 cm tube fits the rolled canvas.', 'Only the tube is both long enough and missing.')
        ]),
        section('masterpiece-trail', 'Physical Trail', '⌁', 'Follow equipment and storage records.', [
          round(100, 'Which cart made the blue marks spaced 46 cm apart?', 'BLUE WHEELS · 46 cm', ['Conservation trolley', 'Catering cart', 'Visitor wheelchair'], 0, [
            'The conservation trolley has blue wheels spaced 46 cm apart.',
            'The floor marks are blue and exactly 46 cm apart.',
            'Catering-cart wheels are black and 52 cm apart.',
            'Wheelchair tires are gray and 58 cm apart.'
          ], 'The marks uniquely match the conservation trolley.', 'Wheel color and spacing both match the trolley.'),
          round(200, 'Which location could hold the tube and was opened at 6:18 PM?', 'TUBE 80 cm · ACCESS 6:18', ['Locker A: 60 cm', 'Climate Locker B: 110 cm', 'Van: left 6:05'], 1, [
            'Climate Locker B has 110 cm of clear space and its key log shows 6:18 PM.',
            'The missing tube is 80 cm long.',
            'Locker A is only 60 cm tall.',
            'The catering van left before the disappearance window.'
          ], 'Climate Locker B was large enough and opened in time.', 'Its dimensions and access time satisfy both conditions.')
        ]),
        section('masterpiece-claims', 'Statements', '“”', 'Test each account against records.', [
          round(100, 'Which record contradicts Elliot’s claim that he never returned after 6:00 PM?', 'CLAIM: “I NEVER RETURNED.”', ['Weather report', 'His 6:12 badge entry', 'Visitor brochure'], 1, [
            'Elliot says he kept his assigned badge with him all evening.',
            'That badge unlocked the east service door at 6:12 PM.',
            'The reader logs only successful unlocks.',
            'Diagnostics show no reader fault.'
          ], 'Elliot’s own badge records his return.', 'A successful 6:12 unlock directly conflicts with his statement.'),
          round(200, 'Who is cleared by a continuous front-desk video from 6:08 to 6:22 PM?', 'WINDOW 6:14–6:20', ['Marcus', 'Elliot', 'Nora'], 0, [
            'The front-desk video shows Marcus continuously from 6:08 to 6:22 PM.',
            'The disappearance occurred between 6:14 and 6:20 PM.',
            'The front desk is four minutes from Gallery Three.',
            'The recording has no cuts or missing frames.'
          ], 'Marcus stayed on camera throughout the entire window.', 'The continuous video covers every minute of the disappearance.')
        ])
      ],
      finale: {
        intro: 'Name the person, the method, and the hiding place.',
        parts: [
          part('person', 'Who removed the painting?', [
            choice('nora', 'Nora Chen', 'Curator'),
            choice('elliot', 'Elliot Shaw', 'Conservator'),
            choice('marcus', 'Marcus Reed', 'Security supervisor')
          ], 'elliot'),
          part('method', 'How was it carried?', [
            choice('frame', 'Inside its frame'),
            choice('tube', 'Rolled in the archival tube'),
            choice('crate', 'Flat in a catering crate')
          ], 'tube'),
          part('place', 'Where was it hidden?', [
            choice('locker-a', 'Staff Locker A'),
            choice('locker-b', 'Climate Locker B'),
            choice('van', 'Catering van')
          ], 'locker-b')
        ]
      },
      reconstruction: [
        'At 6:12 PM, Elliot entered through the east service door.',
        'By 6:14 PM, he released the clips and removed the canvas from its wired frame.',
        'He rolled the 72 cm canvas into the missing 80 cm tube and used the conservation trolley.',
        'At 6:18 PM, he opened Climate Locker B and hid the tube.'
      ],
      successTitle: 'The Blue Hour Recovered'
    },
    {
      id: 'misrouted-medicine',
      title: 'The Misrouted Medicine',
      subtitle: 'A cooler reaches the wrong clinic',
      hook: 'A vaccine cooler due at Northside Clinic at 9:00 AM never arrives, although the courier marked the job complete.',
      sections: [
        section('medicine-time', 'Delivery Times', '◷', 'Compare scans, receipts, and arrivals.', [
          round(100, 'Which stop received a cooler at 8:54 AM?', 'SCANS · 8:54 AM', ['Northside Clinic', 'Eastside Clinic', 'Central Pharmacy'], 1, [
            'Eastside’s receiving tablet accepted a cooler at 8:54 AM.',
            'Northside recorded no delivery before its 9:00 AM appointment.',
            'Central Pharmacy’s first scan was at 9:22 AM.',
            'All devices used the same network clock.'
          ], 'Eastside recorded the only 8:54 AM cooler receipt.', 'The Eastside tablet provides the matching timestamp.'),
          round(200, 'Which driver could make the 8:54 AM Eastside scan?', 'DEPOT DEPARTURES', ['Mina: 8:31', 'Jon: 9:05', 'Sal: 9:18'], 0, [
            'Mina left the depot at 8:31 AM on the east route.',
            'The Eastside cooler scan occurred at 8:54 AM.',
            'Jon had not left by 9:05 AM.',
            'Sal’s route began after 9:18 AM.'
          ], 'Only Mina was already on the east route by 8:54 AM.', 'The other drivers had not departed when Eastside scanned the cooler.')
        ]),
        section('medicine-labels', 'Labels', '▤', 'Use order numbers and label dimensions.', [
          round(100, 'Which label belonged on Northside’s cooler?', 'NORTHSIDE ORDER N-417', ['N-417', 'E-417', 'N-471'], 0, [
            'Northside’s purchase order is N-417.',
            'The cooler manifest assigns label N-417 to that order.',
            'Eastside’s order number is E-417.',
            'N-471 appears on no active order.'
          ], 'Northside’s cooler should carry N-417.', 'The purchase order and manifest match exactly.'),
          round(200, 'What explains the label covering the original address?', 'LABEL 10×15 cm · OLD LABEL 8×12 cm', ['It fell off', 'A larger label was placed over it', 'The cooler had no label'], 1, [
            'The visible Eastside label measures 10 by 15 cm.',
            'Its lifted corner reveals an older 8 by 12 cm Northside label underneath.',
            'The adhesive is intact on both labels.',
            'The cooler serial number matches Northside’s manifest.'
          ], 'A larger Eastside label covered the Northside label.', 'The smaller original remains physically visible beneath the larger label.')
        ]),
        section('medicine-route', 'Route Map', '⌖', 'Trace the van from GPS and street records.', [
          round(100, 'Where did van 3 stop from 8:49 to 8:57 AM?', 'GPS STOP · OAK & 4TH', ['Northside', 'Eastside', 'Depot'], 1, [
            'Eastside Clinic is at Oak and 4th.',
            'Van 3’s GPS stayed at Oak and 4th from 8:49 to 8:57 AM.',
            'Northside is on Pine Avenue.',
            'The depot is on Harbor Road.'
          ], 'Van 3 stopped at Eastside during the delivery scan.', 'The clinic address and GPS location are identical.'),
          round(200, 'Which planned turn would have sent Mina toward Northside?', 'DEPOT → RIVER ROAD → ?', ['Pine Avenue', 'Oak Street', 'Harbor Road'], 0, [
            'The printed route says to turn from River Road onto Pine Avenue for Northside.',
            'Mina’s GPS instead shows a turn from River Road onto Oak Street.',
            'Harbor Road returns to the depot.',
            'No road closure affected Pine Avenue.'
          ], 'The planned Northside route required Pine Avenue.', 'The route sheet names Pine, while the GPS shows Mina took Oak.')
        ]),
        section('medicine-records', 'Receiving Records', '✓', 'Match signatures and cooler serials.', [
          round(100, 'Whose signature appears on the 8:54 AM receipt?', 'RECEIPT E-417', ['Eastside clerk Luis', 'Northside nurse Ava', 'Depot lead Kim'], 0, [
            'The 8:54 AM receipt is signed “Luis M.”',
            'Eastside’s morning receiving clerk is Luis Moreno.',
            'Ava works at Northside.',
            'Kim signed the depot release at 8:28 AM.'
          ], 'Luis Moreno accepted the cooler at Eastside.', 'The signature and staffing record identify the Eastside clerk.'),
          round(200, 'Which serial number was found in Eastside’s cold room?', 'COOLER SERIALS', ['C-204', 'C-240', 'C-402'], 1, [
            'Northside’s manifest lists cooler C-240.',
            'Eastside’s cold-room log lists C-240 at 8:56 AM.',
            'C-204 remained at the depot.',
            'C-402 belongs to Central Pharmacy.'
          ], 'Northside’s cooler C-240 was logged at Eastside.', 'The same unique serial appears in both records.')
        ])
      ],
      finale: {
        intro: 'Identify the courier, the mistake, and the cooler’s location.',
        parts: [
          part('courier', 'Who transported the cooler?', [
            choice('mina', 'Mina Patel'),
            choice('jon', 'Jon Bell'),
            choice('sal', 'Sal Ortiz')
          ], 'mina'),
          part('cause', 'What caused the loss?', [
            choice('stolen', 'The cooler was stolen'),
            choice('overlabel', 'An Eastside label covered its Northside label'),
            choice('forgotten', 'It stayed at the depot')
          ], 'overlabel'),
          part('location', 'Where is it?', [
            choice('northside', 'Northside reception'),
            choice('eastside', 'Eastside cold room'),
            choice('central', 'Central Pharmacy')
          ], 'eastside')
        ]
      },
      reconstruction: [
        'At the depot, a larger Eastside label was placed over Northside label N-417.',
        'Mina left at 8:31 AM and followed Oak Street instead of the Northside turn.',
        'At 8:54 AM, Luis accepted cooler C-240 at Eastside.',
        'At 8:56 AM, the cooler was stored safely in Eastside’s cold room.'
      ],
      successTitle: 'The Cooler Located'
    },
    {
      id: 'silent-lighthouse',
      title: 'The Silent Lighthouse',
      subtitle: 'A beacon goes dark without damage',
      hook: 'Harbor Beacon 7 stops flashing at 7:42 PM on a clear evening, yet its lamp and backup battery both test normally.',
      sections: [
        section('beacon-time', 'Control Log', '◷', 'Align the maintenance and outage records.', [
          round(100, 'When did the beacon controller lose power?', 'CONTROLLER LOG', ['7:32 PM', '7:42 PM', '7:52 PM'], 1, [
            'The controller log ends at exactly 7:42 PM.',
            'The harbor camera shows the final flash at 7:42 PM.',
            'The weather station continued logging afterward.',
            'The controller clock matched harbor time.'
          ], 'Controller power ended with the final flash at 7:42 PM.', 'Two synchronized records stop at the same minute.'),
          round(200, 'Who entered the service hut shortly before the outage?', 'DOOR LOG · 7:36 PM', ['Rowan the technician', 'Maya the keeper', 'Theo the captain'], 0, [
            'Rowan’s maintenance code opened the service hut at 7:36 PM.',
            'The beacon failed six minutes later at 7:42 PM.',
            'Maya’s last entry was at 6:10 PM.',
            'Theo’s boat remained offshore.'
          ], 'Rowan entered the hut six minutes before the outage.', 'The door code directly places Rowan there in the relevant window.')
        ]),
        section('beacon-power', 'Power Path', '↯', 'Trace plugs, sockets, and circuits.', [
          round(100, 'Which device was unplugged from socket B?', 'SOCKET B · LABEL: BEACON CONTROL', ['Fog horn', 'Beacon controller', 'Weather station'], 1, [
            'The panel map labels socket B “Beacon controller.”',
            'Socket B was found empty after the light stopped.',
            'The fog horn uses socket A.',
            'The weather station uses socket D.'
          ], 'The beacon controller had been unplugged from socket B.', 'The panel map identifies the empty socket’s device.'),
          round(200, 'What occupied socket B after the outage?', 'SOCKET B PHOTO · ORANGE LEAD', ['Pump extension lead', 'Radio charger', 'Kettle'], 0, [
            'The 7:50 PM photo shows an orange extension lead in socket B.',
            'The maintenance pump uses the only orange extension lead in the hut.',
            'The radio charger has a black lead.',
            'The kettle has a white lead.'
          ], 'The pump’s orange extension lead replaced the controller plug.', 'The distinctive lead color links socket B to the pump.')
        ]),
        section('beacon-work', 'Work Order', '▤', 'Read the task sheet and equipment record.', [
          round(100, 'What job was Rowan assigned?', 'ORDER 771 · LOWER SUMP', ['Replace the beacon lamp', 'Test the drainage pump', 'Paint the railing'], 1, [
            'Work order 771 tells Rowan to test the lower-sump drainage pump.',
            'Rowan signed out the pump at 7:28 PM.',
            'No lamp replacement was scheduled.',
            'The railing job was completed the previous week.'
          ], 'Rowan was assigned to test the drainage pump.', 'The work order and equipment checkout agree.'),
          round(200, 'Why did Rowan need a hut socket?', 'PUMP CABLE 3 m · SUMP 8 m AWAY', ['The fixed cable was too short', 'The battery was missing', 'The pump used fuel'], 0, [
            'The pump’s fixed power cable is 3 m long.',
            'The lower sump is 8 m from the nearest fixed outlet.',
            'The pump has no battery compartment.',
            'Its manual lists electric power only.'
          ], 'The pump needed an extension lead to reach the sump.', 'A 3 m cable cannot span the measured 8 m distance.')
        ]),
        section('beacon-checks', 'System Checks', '✓', 'Rule out failure and weather.', [
          round(100, 'Which test shows the lamp itself still worked?', 'BENCH TEST · 7:58 PM', ['Lamp lit on test supply', 'Window was clean', 'Fog horn sounded'], 0, [
            'At 7:58 PM, the lamp lit steadily on the independent test supply.',
            'A successful independent supply test means the lamp can operate.',
            'Window cleanliness does not test the circuit.',
            'The fog horn uses a separate circuit.'
          ], 'The lamp passed an independent power test.', 'Lighting on a separate supply rules out a failed lamp.'),
          round(200, 'What rules out a drained backup battery?', 'BATTERY 98% · SWITCH: OFF', ['It was nearly full', 'The sea was calm', 'The door was locked'], 0, [
            'The backup battery meter read 98 percent after the outage.',
            'The transfer switch was found in OFF, so the battery had not discharged.',
            'Sea conditions do not measure battery charge.',
            'The door lock does not control the transfer switch.'
          ], 'The full, unused battery was not the cause.', 'Its charge and OFF switch show it never supplied or lost power.')
        ])
      ],
      finale: {
        intro: 'Determine who caused the outage, how, and why.',
        parts: [
          part('person', 'Who caused the outage?', [
            choice('rowan', 'Rowan Vale', 'Maintenance technician'),
            choice('maya', 'Maya Chen', 'Lighthouse keeper'),
            choice('theo', 'Theo Grant', 'Harbor captain')
          ], 'rowan'),
          part('action', 'What cut power?', [
            choice('lamp', 'The lamp burned out'),
            choice('unplugged', 'The controller was unplugged'),
            choice('battery', 'The battery drained')
          ], 'unplugged'),
          part('reason', 'Why was the socket used?', [
            choice('pump', 'To run the drainage pump'),
            choice('kettle', 'To boil water'),
            choice('charger', 'To charge a radio')
          ], 'pump')
        ]
      },
      reconstruction: [
        'At 7:28 PM, Rowan signed out the drainage pump for work order 771.',
        'At 7:36 PM, Rowan entered the service hut with the short-cabled pump.',
        'Before 7:42 PM, Rowan unplugged the beacon controller and connected the pump’s orange lead.',
        'At 7:42 PM, the unpowered controller stopped the beacon while the lamp and battery remained sound.'
      ],
      successTitle: 'Beacon 7 Restored'
    },
    {
      id: 'market-envelope',
      title: 'The Market Envelope',
      subtitle: 'The fundraiser cash disappears',
      hook: 'A sealed envelope holding the Saturday market donations vanishes from the bakery counter before the treasurer can collect it.',
      sections: [
        section('envelope-time', 'Counter Timeline', '◷', 'Order the receipt and collection times.', [
          round(100, 'When was the donation envelope last recorded on the counter?', 'CLOSING PHOTO', ['1:48 PM', '2:08 PM', '2:28 PM'], 1, [
            'The closing photo timestamp is 2:08 PM and shows the envelope by the register.',
            'The treasurer arrived at 2:28 PM and found the counter empty.',
            'The market bell rang at 2:00 PM.',
            'The camera clock matched the receipt printer.'
          ], 'The envelope was present at 2:08 PM.', 'The timestamped photo directly shows it then.'),
          round(200, 'Which transaction occurred after 2:08 PM but before 2:28 PM?', 'RECEIPT TIMES', ['Bread pickup at 2:14', 'Coffee sale at 1:52', 'Flour delivery at 2:35'], 0, [
            'The prepaid bread pickup receipt is stamped 2:14 PM.',
            'The envelope disappeared between 2:08 and 2:28 PM.',
            'The coffee sale occurred before the window.',
            'The flour delivery occurred after the window.'
          ], 'The 2:14 PM bread pickup occurred inside the window.', 'Its receipt time falls between the last sighting and discovery.')
        ]),
        section('envelope-packaging', 'Packaging', '▱', 'Compare the envelope with bakery bags.', [
          round(100, 'Which package could conceal the 24 by 11 cm envelope?', 'ENVELOPE 24×11 cm', ['Small bag 18×9', 'Bread bag 30×16', 'Cup sleeve 12×6'], 1, [
            'The envelope measures 24 by 11 cm.',
            'A bread bag measures 30 by 16 cm internally.',
            'The small bag is narrower and shorter than the envelope.',
            'The cup sleeve cannot cover the envelope.'
          ], 'The envelope fits inside a bread bag.', 'Both bread-bag dimensions exceed the envelope’s dimensions.'),
          round(200, 'Which bag had the same green seal as the envelope?', 'GREEN ROUND SEAL', ['Bread pickup bag', 'Coffee sack', 'Flour carton'], 0, [
            'The donation envelope was closed with a green round seal.',
            'A green round seal is stuck inside the returned bread pickup bag.',
            'Coffee sacks use silver ties.',
            'Flour cartons use blue tape.'
          ], 'The envelope’s seal was found in the bread bag.', 'The unique seal directly links the envelope to that bag.')
        ]),
        section('envelope-route', 'Pickup Route', '⌖', 'Track the bag through ordinary records.', [
          round(100, 'Who collected the prepaid bread order at 2:14 PM?', 'ORDER B-62', ['Omar Reed', 'Lena Park', 'Tess Hall'], 0, [
            'Receipt B-62 lists pickup by Omar Reed at 2:14 PM.',
            'The staff handoff sheet also names Omar for B-62.',
            'Lena collected flowers at 1:40 PM.',
            'Tess was the bakery cashier.'
          ], 'Omar received the bread pickup bag.', 'The receipt and handoff sheet independently name him.'),
          round(200, 'Where did Omar take the bread order?', 'ROUTE: MARKET → 14 KING ST', ['Community shelter', 'Train station', 'Town hall'], 0, [
            'Omar’s volunteer route lists 14 King Street as the community shelter.',
            'His phone check-in at 2:23 PM is tagged 14 King Street.',
            'The station is on Mill Road.',
            'Town hall is at 2 Civic Square.'
          ], 'Omar delivered the bag to the community shelter.', 'The route and check-in point to the shelter’s address.')
        ]),
        section('envelope-statements', 'Statements', '“”', 'Compare memories with handoff records.', [
          round(100, 'Who packed order B-62?', 'HANDOFF SHEET · PACKER', ['Tess Hall', 'Omar Reed', 'Lena Park'], 0, [
            'The B-62 handoff row lists Tess Hall as packer.',
            'Tess initialed that row at 2:12 PM.',
            'Omar signed only the pickup column.',
            'Lena’s name appears on no bakery order.'
          ], 'Tess packed and initialed the bread order.', 'The handoff row assigns the packing action to Tess.'),
          round(200, 'What supports Tess’s statement that papers stuck beneath the bread bags?', 'COUNTER PHOTO · BAG STACK', ['Envelope edge under stack', 'Open cash drawer', 'Wet floor sign'], 0, [
            'The 2:08 PM photo shows one edge of the envelope beneath the bread-bag stack.',
            'Tess says she lifted that stack when packing B-62.',
            'The cash drawer was closed.',
            'The wet floor sign stood by the door.'
          ], 'The photo places the envelope under the bags Tess lifted.', 'The visible edge and her described action explain an accidental pickup.')
        ])
      ],
      finale: {
        intro: 'Identify the packer, the mistake, and the destination.',
        parts: [
          part('packer', 'Who packed the bag?', [
            choice('tess', 'Tess Hall'),
            choice('omar', 'Omar Reed'),
            choice('lena', 'Lena Park')
          ], 'tess'),
          part('event', 'What happened to the envelope?', [
            choice('drawer', 'It was locked in the till'),
            choice('bagged', 'It stuck to the bread-bag stack and was packed'),
            choice('stolen', 'A customer took it alone')
          ], 'bagged'),
          part('place', 'Where did it end up?', [
            choice('shelter', 'Community shelter'),
            choice('station', 'Train station'),
            choice('hall', 'Town hall')
          ], 'shelter')
        ]
      },
      reconstruction: [
        'At 2:08 PM, the envelope lay partly beneath a stack of bread bags.',
        'At 2:12 PM, Tess lifted that stack and accidentally packed the envelope with order B-62.',
        'At 2:14 PM, Omar collected the sealed bread order.',
        'At 2:23 PM, Omar delivered the bag—and the envelope—to the community shelter.'
      ],
      successTitle: 'The Donations Found'
    },
    {
      id: 'empty-violin-case',
      title: 'The Empty Violin Case',
      subtitle: 'A concert instrument changes places',
      hook: 'After a school concert, soloist Hana opens her locked case and finds a student violin instead of her own antique instrument.',
      sections: [
        section('violin-time', 'Backstage Times', '◷', 'Use sign-outs and room logs.', [
          round(100, 'When did Hana place her violin in a case?', 'BACKSTAGE VIDEO', ['8:41 PM', '8:51 PM', '9:01 PM'], 0, [
            'Backstage video shows Hana placing her violin into a black case at 8:41 PM.',
            'She discovered the wrong violin at 9:01 PM.',
            'The final applause ended at 8:38 PM.',
            'The video clock matched the auditorium clock.'
          ], 'Hana put her instrument away at 8:41 PM.', 'The timestamped video records the action.'),
          round(200, 'Who moved two black cases at 8:47 PM?', 'HALL CAMERA · 8:47', ['Stage manager Priya', 'Teacher Mr. Cole', 'Student Eli'], 0, [
            'The 8:47 PM hall video shows Priya carrying two black violin cases.',
            'Priya’s stage checklist says “clear backstage cases” at 8:46 PM.',
            'Mr. Cole remained onstage until 8:55 PM.',
            'Eli left by the east door at 8:43 PM.'
          ], 'Priya moved both cases during cleanup.', 'The video and checklist identify her and the task.')
        ]),
        section('violin-cases', 'Case Details', '⌕', 'Distinguish two nearly identical cases.', [
          round(100, 'Which case belongs to Hana?', 'CASE MARKS', ['Red thread on handle', 'Blue square sticker', 'White luggage tag'], 0, [
            'Hana’s inventory form notes red thread tied around her case handle.',
            'The case left in the dressing room has red thread on its handle.',
            'The student case has a blue square sticker under its base.',
            'The white luggage tag belongs to a cello case.'
          ], 'The red-thread case is Hana’s.', 'Her inventory form records the same distinctive marker.'),
          round(200, 'Which violin is the antique instrument?', 'BODY LENGTHS', ['59 cm, serial H17', '56 cm, serial S42', '53 cm, serial J09'], 0, [
            'Hana’s insurance record lists a 59 cm violin with serial H17.',
            'The violin in the dressing-room case is 59 cm and marked H17.',
            'The student violin is 56 cm with serial S42.',
            'The junior violin is 53 cm with serial J09.'
          ], 'Serial H17 in the dressing room is Hana’s violin.', 'Both the serial and dimensions match her insurance record.')
        ]),
        section('violin-map', 'Room Map', '⌖', 'Trace each case through the music wing.', [
          round(100, 'Where did Priya set the red-thread case?', 'CHECKLIST NOTE: DR-2', ['Dressing Room 2', 'Orchestra Office', 'Loading Bay'], 0, [
            'Priya’s checklist says “red-thread case → DR-2.”',
            'The room map expands DR-2 as Dressing Room 2.',
            'The orchestra office is labeled OO.',
            'The loading bay is labeled LB.'
          ], 'Priya placed Hana’s marked case in Dressing Room 2.', 'The note and map decode the destination directly.'),
          round(200, 'Where did Priya take the blue-sticker case?', 'KEY LOG · OO · 8:49', ['Dressing Room 2', 'Orchestra Office', 'Ticket booth'], 1, [
            'Priya’s key opened the Orchestra Office at 8:49 PM while she carried the blue-sticker case.',
            'The blue sticker identifies the student case.',
            'Dressing Room 2 has no keyed entry.',
            'The ticket booth closed at 8:30 PM.'
          ], 'The student case went into the Orchestra Office.', 'The keyed entry and visible marker establish the destination.')
        ]),
        section('violin-paperwork', 'Checkout Records', '▤', 'Match locks, tags, and loan forms.', [
          round(100, 'Why did Hana’s key open the case containing the student violin?', 'LOCK TAG L-18', ['Both cases used lock L-18', 'Her key opened every case', 'The case was unlocked'], 0, [
            'The loan sheet assigns removable lock L-18 to Hana for concert night.',
            'Cleanup notes show lock L-18 was clipped onto the blue-sticker student case.',
            'Hana’s key is stamped L-18.',
            'The case latch was closed when she arrived.'
          ], 'Hana’s assigned lock was moved onto the wrong case.', 'The loan and cleanup records place her matching lock on the student case.'),
          round(200, 'What best explains the exchange?', 'TWO BLACK CASES · MOVED TOGETHER', ['Intentional sale', 'Cases were swapped during cleanup', 'Hana played the student violin'], 1, [
            'Priya moved two nearly identical black cases together and recorded opposite destinations.',
            'Hana’s violin remains in her marked case in Dressing Room 2.',
            'No sales receipt or payment exists.',
            'Concert video shows Hana performing with serial H17.'
          ], 'The instruments stayed in their cases, but the cases were sent to opposite destinations.', 'The paired move and recovered violin show a cleanup swap, not theft.')
        ])
      ],
      finale: {
        intro: 'Identify who moved the cases, what happened, and where Hana’s violin is.',
        parts: [
          part('mover', 'Who moved the cases?', [
            choice('priya', 'Priya Shah', 'Stage manager'),
            choice('cole', 'Mr. Cole', 'Music teacher'),
            choice('eli', 'Eli Moss', 'Student')
          ], 'priya'),
          part('event', 'What happened?', [
            choice('swap', 'Two similar cases were sent to opposite rooms'),
            choice('sale', 'The antique violin was sold'),
            choice('stage', 'The violin remained onstage')
          ], 'swap'),
          part('location', 'Where is Hana’s violin?', [
            choice('dr2', 'Dressing Room 2'),
            choice('office', 'Orchestra Office'),
            choice('loading', 'Loading Bay')
          ], 'dr2')
        ]
      },
      reconstruction: [
        'At 8:41 PM, Hana placed serial H17 in her red-thread case.',
        'At 8:47 PM, Priya carried Hana’s case beside the similar blue-sticker student case.',
        'Priya put the red-thread case in Dressing Room 2 and the student case in the Orchestra Office.',
        'Lock L-18 was clipped to the student case, so Hana later opened it and found the wrong violin.'
      ],
      successTitle: 'The Antique Violin Recovered'
    }
  ]
};

export const everydayCategory = {
  id: 'everyday-intelligence',
  name: 'Everyday Intelligence',
  icon: '◫',
  description: 'Solve practical problems with complete, checkable facts.',
  cases: [
    {
      id: 'community-event',
      title: 'The Courtyard Gathering',
      subtitle: 'Schedule a neighborhood event',
      hook: 'Choose a workable time, place, setup, and notice plan for a 60-person community meal.',
      sections: [
        {
          id: 'time',
          title: 'Choose the Time',
          rounds: [
            {
              value: 100,
              prompt: 'Which two-hour event slot works for the hall and all required volunteers?',
              display: 'EVENT LENGTH: 2 HOURS',
              options: ['Saturday 10:00–12:00', 'Saturday 14:00–16:00', 'Sunday 14:00–16:00'],
              answer: 1,
              fragments: [
                'The hall is available Saturday from 13:00 to 17:00 and Sunday from 09:00 to 13:00.',
                'All required volunteers are available Saturday from 14:00 to 16:30 only.',
                'The event must run for two uninterrupted hours.',
                'The booking ledger is the current approved venue record.'
              ],
              evidence: 'Saturday 14:00–16:00 is inside both availability windows.',
              explanation: 'It is the only two-hour option when both the hall and every required volunteer are available.'
            },
            {
              value: 200,
              prompt: 'When must setup begin if it takes 45 minutes before the chosen 14:00 start?',
              display: 'START 14:00 · SETUP 45 MIN',
              options: ['12:45', '13:15', '13:30'],
              answer: 1,
              fragments: [
                'The confirmed event start is 14:00.',
                'The facilities checklist requires 45 minutes of setup immediately before opening.',
                'Subtracting 45 minutes from 14:00 gives 13:15.',
                'The hall booking permits entry from 13:00.'
              ],
              evidence: 'Setup must begin at 13:15.',
              explanation: 'A 45-minute setup ending at 14:00 starts at 13:15.'
            }
          ]
        },
        {
          id: 'venue',
          title: 'Select the Space',
          rounds: [
            {
              value: 100,
              prompt: 'Which venue can legally hold all 60 expected guests?',
              display: 'EXPECTED ATTENDANCE: 60',
              options: ['Library room: 45', 'Community hall: 80', 'Studio: 55'],
              answer: 1,
              fragments: [
                'The signed attendance estimate lists 60 guests.',
                'The posted fire limits are library 45, community hall 80, and studio 55.',
                'Attendance may not exceed a room’s posted fire limit.',
                'No overflow area is available at any venue.'
              ],
              evidence: 'Only the 80-person community hall can hold 60 guests.',
              explanation: 'The library and studio limits are below 60; the hall limit is 80.'
            },
            {
              value: 200,
              prompt: 'Which layout preserves the required clear exit path?',
              display: 'EXIT AISLE MUST REMAIN 1.2 m WIDE',
              options: ['Five rows with a 1.3 m aisle', 'Six rows with a 0.9 m aisle', 'Tables across the exit door'],
              answer: 0,
              fragments: [
                'The safety plan requires a continuous exit aisle at least 1.2 metres wide.',
                'The measured layouts leave aisles of 1.3 metres for five rows and 0.9 metres for six rows.',
                'The fire officer’s written guidance forbids placing furniture across an exit door.',
                'The tape measurements were recorded after the tables were positioned.'
              ],
              evidence: 'The five-row layout leaves a compliant 1.3-metre aisle.',
              explanation: 'Its aisle exceeds 1.2 metres and it does not obstruct the exit.'
            }
          ]
        },
        {
          id: 'supplies',
          title: 'Plan the Supplies',
          rounds: [
            {
              value: 100,
              prompt: 'How many packs are needed if each pack serves 12 people and 60 guests are expected?',
              display: '60 GUESTS · 12 SERVINGS PER PACK',
              options: ['4 packs', '5 packs', '6 packs'],
              answer: 1,
              fragments: [
                'The approved guest count is 60.',
                'Each sealed catering pack contains exactly 12 servings.',
                'The supplier confirms packs cannot be split before delivery.',
                'Sixty divided by twelve equals five.'
              ],
              evidence: 'Five packs provide exactly 60 servings.',
              explanation: '60 ÷ 12 = 5 packs.'
            },
            {
              value: 200,
              prompt: 'Which order stays within the $150 supply limit?',
              display: 'BUDGET LIMIT: $150',
              options: ['$138 essentials', '$156 essentials plus banners', '$171 premium set'],
              answer: 0,
              fragments: [
                'The treasurer set a hard supply limit of $150.',
                'The vendor’s written totals are $138, $156, and $171 for the three listed orders.',
                'No discount or additional funding is available.',
                'The $138 order includes every item marked essential on the checklist.'
              ],
              evidence: 'The $138 essentials order is complete and under budget.',
              explanation: '$138 is the only listed total no greater than $150.'
            }
          ]
        },
        {
          id: 'notice',
          title: 'Notify the Neighbors',
          rounds: [
            {
              value: 100,
              prompt: 'What is the latest date to send notice for a June 20 event requiring 7 full days?',
              display: 'EVENT: JUNE 20 · NOTICE: 7 FULL DAYS',
              options: ['June 12', 'June 13', 'June 14'],
              answer: 0,
              fragments: [
                'The neighborhood rule requires seven full calendar days between notice and the June 20 event.',
                'Sending on June 12 leaves June 13 through June 19 as seven full days.',
                'A June 13 notice leaves only six full days before the event.',
                'The rule is quoted from the current association handbook.'
              ],
              evidence: 'June 12 is the latest compliant notice date.',
              explanation: 'June 13–19 are the seven required full days after a June 12 notice.'
            },
            {
              value: 200,
              prompt: 'Which message contains every confirmed detail guests need?',
              display: 'REQUIRED: DATE · TIME · PLACE · RSVP',
              options: [
                'June 20, 14:00–16:00, Community Hall, RSVP by June 16',
                'June 20 afternoon, location later, RSVP soon',
                'June 21, 14:00–16:00, Community Hall, no RSVP'
              ],
              answer: 0,
              fragments: [
                'The final booking is June 20 from 14:00 to 16:00 at the Community Hall.',
                'The organizer’s checklist requires the date, exact time, place, and June 16 RSVP deadline.',
                'The booking confirmation contains no location change.',
                'The caterer needs the RSVP count after June 16.'
              ],
              evidence: 'The complete notice states every confirmed event and RSVP detail.',
              explanation: 'Only the first message includes the correct date, exact time, venue, and deadline.'
            }
          ]
        }
      ],
      finale: [
        {
          id: 'slot',
          label: 'When should the event run?',
          options: [
            { id: 'sat-morning', label: 'Saturday 10:00–12:00' },
            { id: 'sat-afternoon', label: 'Saturday 14:00–16:00' },
            { id: 'sun-afternoon', label: 'Sunday 14:00–16:00' }
          ],
          answer: 'sat-afternoon'
        },
        {
          id: 'place',
          label: 'Where should it be held?',
          options: [
            { id: 'library', label: 'Library room', detail: 'Limit 45' },
            { id: 'hall', label: 'Community hall', detail: 'Limit 80' },
            { id: 'studio', label: 'Studio', detail: 'Limit 55' }
          ],
          answer: 'hall'
        },
        {
          id: 'notice',
          label: 'Which notice should be sent?',
          options: [
            { id: 'complete', label: 'Complete June 20 notice', detail: '14:00–16:00, Hall, RSVP June 16' },
            { id: 'vague', label: 'Afternoon notice', detail: 'No exact time or place' },
            { id: 'wrong-date', label: 'June 21 notice', detail: 'Incorrect date' }
          ],
          answer: 'complete'
        }
      ],
      reconstruction: [
        'Book the Community Hall for Saturday, June 20, from 14:00 to 16:00.',
        'Begin setup at 13:15 and use the five-row layout with a 1.3-metre aisle.',
        'Order five catering packs and the $138 essentials supply set.',
        'Send the complete notice by June 12 with the June 16 RSVP deadline.'
      ],
      successTitle: 'Community Event Scheduled'
    },
    {
      id: 'budget-mismatch',
      title: 'The Missing Forty Dollars',
      subtitle: 'Resolve a household budget mismatch',
      hook: 'Reconcile a monthly plan against statements and correct one duplicated expense.',
      sections: [
        {
          id: 'income',
          title: 'Confirm Income',
          rounds: [
            {
              value: 100,
              prompt: 'What is the verified monthly income from two deposits?',
              display: 'DEPOSITS: $2,400 + $600',
              options: ['$2,800', '$3,000', '$3,200'],
              answer: 1,
              fragments: [
                'The bank statement shows cleared deposits of $2,400 and $600 this month.',
                'Those are the only income deposits, and $2,400 plus $600 equals $3,000.',
                'Both deposits are marked final, not pending.',
                'Transfers between the account owner’s accounts are excluded from income.'
              ],
              evidence: 'Verified monthly income is $3,000.',
              explanation: 'The two cleared income deposits total $3,000.'
            },
            {
              value: 200,
              prompt: 'Which entry must not be counted as new income?',
              display: 'ENTRIES INCLUDE A $200 SAVINGS TRANSFER',
              options: ['$600 pay deposit', '$200 transfer from savings', '$2,400 salary deposit'],
              answer: 1,
              fragments: [
                'The $200 entry is labeled “transfer from savings owned by account holder.”',
                'Moving existing money between the owner’s accounts does not create new income.',
                'The $600 and $2,400 entries are employer deposits.',
                'The budget policy classifies transfers separately from income.'
              ],
              evidence: 'The $200 savings transfer is not new income.',
              explanation: 'It moves existing funds and must not inflate the income total.'
            }
          ]
        },
        {
          id: 'fixed',
          title: 'Check Fixed Costs',
          rounds: [
            {
              value: 100,
              prompt: 'What is the total of rent, utilities, insurance, and transit?',
              display: '$1,200 + $180 + $120 + $100',
              options: ['$1,500', '$1,600', '$1,700'],
              answer: 1,
              fragments: [
                'The four verified fixed costs are rent $1,200, utilities $180, insurance $120, and transit $100.',
                'Adding those four amounts gives $1,600.',
                'Each amount appears once on the current statement.',
                'No fixed bill is pending or estimated.'
              ],
              evidence: 'Fixed costs total $1,600.',
              explanation: '$1,200 + $180 + $120 + $100 = $1,600.'
            },
            {
              value: 200,
              prompt: 'Which planned fixed cost differs from the statement?',
              display: 'PLAN VS STATEMENT',
              options: ['Rent: $1,200 vs $1,200', 'Utilities: $140 vs $180', 'Insurance: $120 vs $120'],
              answer: 1,
              fragments: [
                'The budget planned $140 for utilities.',
                'The utility provider’s final statement charges $180, a $40 increase.',
                'Rent and insurance match their planned amounts exactly.',
                'The utility bill is marked paid and is not an estimate.'
              ],
              evidence: 'Utilities are $40 above the plan.',
              explanation: 'The final $180 charge is $40 more than the planned $140.'
            }
          ]
        },
        {
          id: 'variable',
          title: 'Audit Variable Costs',
          rounds: [
            {
              value: 100,
              prompt: 'Which $40 item appears twice in the worksheet but once at the bank?',
              display: 'WORKSHEET: PHARMACY ×2 · BANK: PHARMACY ×1',
              options: ['Pharmacy purchase', 'Transit pass', 'Insurance payment'],
              answer: 0,
              fragments: [
                'The worksheet lists the same $40 pharmacy receipt number P184 on rows 18 and 23.',
                'The bank statement contains only one cleared $40 pharmacy charge with receipt P184.',
                'The transit and insurance entries each have distinct references.',
                'The pharmacy confirms receipt P184 represents one purchase.'
              ],
              evidence: 'Receipt P184 was duplicated in the worksheet.',
              explanation: 'One real $40 purchase was entered twice under the same receipt number.'
            },
            {
              value: 200,
              prompt: 'What is the corrected variable-cost total after removing the duplicate?',
              display: 'WORKSHEET TOTAL $940 · DUPLICATE $40',
              options: ['$880', '$900', '$980'],
              answer: 1,
              fragments: [
                'The worksheet’s variable-cost total is $940.',
                'It includes one extra $40 pharmacy entry, so $940 minus $40 equals $900.',
                'Every other variable charge matches the bank statement.',
                'No refund or pending charge affects this month.'
              ],
              evidence: 'Corrected variable costs total $900.',
              explanation: 'Removing the single $40 duplicate reduces $940 to $900.'
            }
          ]
        },
        {
          id: 'balance',
          title: 'Reconcile the Balance',
          rounds: [
            {
              value: 100,
              prompt: 'What should remain after $1,600 fixed and $900 variable costs?',
              display: 'INCOME $3,000 · COSTS $2,500',
              options: ['$400', '$500', '$540'],
              answer: 1,
              fragments: [
                'Verified income is $3,000.',
                'Corrected expenses are $1,600 fixed plus $900 variable, totaling $2,500.',
                '$3,000 minus $2,500 equals $500.',
                'The opening balance is excluded from this monthly surplus calculation.'
              ],
              evidence: 'The reconciled monthly surplus is $500.',
              explanation: 'Subtracting $2,500 of expenses from $3,000 of income leaves $500.'
            },
            {
              value: 200,
              prompt: 'Which correction resolves the original $40 mismatch?',
              display: 'WORKSHEET WAS $40 TOO HIGH',
              options: ['Add the savings transfer to income', 'Delete one P184 entry', 'Delete the utility charge'],
              answer: 1,
              fragments: [
                'The only unsupported worksheet entry is the second $40 copy of receipt P184.',
                'Deleting that duplicate lowers worksheet expenses by exactly the unexplained $40.',
                'The utility charge is verified by the provider’s final bill.',
                'The savings transfer is existing money, not income.'
              ],
              evidence: 'Deleting the duplicate P184 entry resolves the mismatch.',
              explanation: 'It removes exactly $40 without altering any verified transaction.'
            }
          ]
        }
      ],
      finale: [
        {
          id: 'cause',
          label: 'What caused the mismatch?',
          options: [
            { id: 'duplicate', label: 'Duplicated pharmacy receipt', detail: 'P184 entered twice' },
            { id: 'missing-income', label: 'Missing salary deposit' },
            { id: 'bank-error', label: 'Bank utility error' }
          ],
          answer: 'duplicate'
        },
        {
          id: 'correction',
          label: 'What correction is required?',
          options: [
            { id: 'delete-p184', label: 'Delete one $40 P184 entry' },
            { id: 'count-transfer', label: 'Count the $200 transfer as income' },
            { id: 'delete-utility', label: 'Delete the $180 utility charge' }
          ],
          answer: 'delete-p184'
        },
        {
          id: 'surplus',
          label: 'What is the corrected surplus?',
          options: [
            { id: '400', label: '$400' },
            { id: '500', label: '$500' },
            { id: '540', label: '$540' }
          ],
          answer: '500'
        }
      ],
      reconstruction: [
        'Confirm $3,000 of income without counting the $200 internal transfer.',
        'Record $1,600 of fixed costs, including the final $180 utility bill.',
        'Remove the duplicated $40 pharmacy receipt from the $940 variable total.',
        'Reconcile $2,500 of corrected expenses to a $500 monthly surplus.'
      ],
      successTitle: 'Budget Reconciled'
    },
    {
      id: 'transit-disruption',
      title: 'The Closed River Line',
      subtitle: 'Reroute during a transit disruption',
      hook: 'Reach a 09:30 appointment using verified service alerts, walking times, and transfer schedules.',
      sections: [
        {
          id: 'alert',
          title: 'Read the Alert',
          rounds: [
            {
              value: 100,
              prompt: 'Which segment is unavailable this morning?',
              display: 'OFFICIAL ALERT · 08:00–12:00',
              options: ['Blue Line: Central–River', 'Green Line: Park–Museum', 'Bus 24: Oak–Central'],
              answer: 0,
              fragments: [
                'The transit authority alert closes the Blue Line between Central and River from 08:00 to 12:00.',
                'The trip would normally use that exact Blue Line segment at 08:40.',
                'The alert lists Green Line and Bus 24 as operating normally.',
                'The alert was updated at 07:55 for today’s service.'
              ],
              evidence: 'The Blue Line Central–River segment is closed.',
              explanation: 'The official alert explicitly suspends the required Blue Line segment.'
            },
            {
              value: 200,
              prompt: 'Which proposed route must be rejected immediately?',
              display: 'APPOINTMENT: RIVER CLINIC',
              options: ['Blue Line through Central', 'Bus 24 then Green Line', 'Bus 18 direct'],
              answer: 0,
              fragments: [
                'The Blue Line cannot carry passengers from Central to River before 12:00.',
                'The proposed Blue route requires travel from Central to River at 08:40.',
                'Bus 24, Green Line, and Bus 18 are listed as running.',
                'The appointment begins at 09:30, before the closure ends.'
              ],
              evidence: 'Any morning route through the closed Blue segment is unusable.',
              explanation: 'That route depends on service explicitly suspended until 12:00.'
            }
          ]
        },
        {
          id: 'timing',
          title: 'Compare Arrivals',
          rounds: [
            {
              value: 100,
              prompt: 'When does Bus 18 arrive if it leaves Oak at 08:35 and takes 42 minutes?',
              display: 'DEPART 08:35 · TRAVEL 42 MIN',
              options: ['09:07', '09:17', '09:27'],
              answer: 1,
              fragments: [
                'The verified Bus 18 departure from Oak is 08:35.',
                'Its scheduled travel time to River is 42 minutes, giving a 09:17 arrival.',
                'The service bulletin reports no delay on Bus 18.',
                'The destination stop is the River terminus.'
              ],
              evidence: 'Bus 18 reaches River at 09:17.',
              explanation: 'Adding 42 minutes to 08:35 gives 09:17.'
            },
            {
              value: 200,
              prompt: 'Which route arrives earliest at River?',
              display: 'ARRIVALS: TRANSFER 09:12 · BUS 18 09:17 · WALK 09:38',
              options: ['Bus 24 plus Green Line', 'Bus 18 direct', 'Walk the full route'],
              answer: 0,
              fragments: [
                'The timetable gives River arrivals of 09:12 for Bus 24 plus Green Line and 09:17 for Bus 18.',
                'The mapped full walk arrives at 09:38; 09:12 is the earliest of the three.',
                'Both transit routes are confirmed operational.',
                'All arrival times use the same 08:25 departure from home except Bus 18’s listed 08:35 stop departure.'
              ],
              evidence: 'Bus 24 plus Green Line arrives first at 09:12.',
              explanation: '09:12 is earlier than 09:17 and 09:38.'
            }
          ]
        },
        {
          id: 'transfer',
          title: 'Validate the Transfer',
          rounds: [
            {
              value: 100,
              prompt: 'Can a 08:52 bus arrival make a 08:58 train with a 4-minute walk?',
              display: 'ARRIVE 08:52 · WALK 4 MIN · TRAIN 08:58',
              options: ['Yes, with 2 minutes spare', 'No, 2 minutes late', 'No, 4 minutes late'],
              answer: 0,
              fragments: [
                'Bus 24 reaches Park interchange at 08:52.',
                'The signed walk to the Green platform takes 4 minutes, reaching it at 08:56 before the 08:58 train.',
                'The station notice requires no additional ticket check.',
                'The elevator on this route is operating.'
              ],
              evidence: 'The transfer reaches the platform at 08:56, two minutes early.',
              explanation: '08:52 plus four minutes is 08:56, before the 08:58 departure.'
            },
            {
              value: 200,
              prompt: 'Which platform should the traveler use?',
              display: 'DESTINATION: RIVER',
              options: ['Platform 1 toward Airport', 'Platform 2 toward River', 'Platform 3 closed'],
              answer: 1,
              fragments: [
                'The station board assigns Green Line trains toward River to Platform 2.',
                'The traveler needs the Green Line in the River direction.',
                'Platform 1 serves Airport-bound trains.',
                'A maintenance notice marks Platform 3 closed.'
              ],
              evidence: 'The River-bound Green Line departs from Platform 2.',
              explanation: 'The station board directly matches the destination to Platform 2.'
            }
          ]
        },
        {
          id: 'arrival',
          title: 'Finish the Journey',
          rounds: [
            {
              value: 100,
              prompt: 'When will the traveler reach the clinic after a 09:12 station arrival and 6-minute walk?',
              display: 'STATION 09:12 · WALK 6 MIN',
              options: ['09:16', '09:18', '09:22'],
              answer: 1,
              fragments: [
                'The selected route arrives at River station at 09:12.',
                'The clinic’s verified walking directions take 6 minutes, producing a 09:18 arrival.',
                'The clinic entrance on Pine Street is open.',
                'No additional shuttle is required.'
              ],
              evidence: 'The traveler reaches the clinic at 09:18.',
              explanation: '09:12 plus six minutes is 09:18.'
            },
            {
              value: 200,
              prompt: 'How much time remains before the 09:30 appointment?',
              display: 'CLINIC ARRIVAL 09:18 · APPOINTMENT 09:30',
              options: ['8 minutes', '12 minutes', '18 minutes'],
              answer: 1,
              fragments: [
                'The clinic arrival time is 09:18.',
                'The appointment confirmation says 09:30, which is 12 minutes later.',
                'The confirmation does not require an earlier check-in.',
                'Both times are local and on the same date.'
              ],
              evidence: 'The route provides a 12-minute arrival margin.',
              explanation: 'There are 12 minutes from 09:18 to 09:30.'
            }
          ]
        }
      ],
      finale: [
        {
          id: 'route',
          label: 'Which route should be taken?',
          options: [
            { id: 'blue', label: 'Blue Line through Central', detail: 'Closed until 12:00' },
            { id: 'transfer', label: 'Bus 24 plus Green Line' },
            { id: 'bus18', label: 'Bus 18 direct' }
          ],
          answer: 'transfer'
        },
        {
          id: 'platform',
          label: 'Which transfer platform is correct?',
          options: [
            { id: 'p1', label: 'Platform 1', detail: 'Toward Airport' },
            { id: 'p2', label: 'Platform 2', detail: 'Toward River' },
            { id: 'p3', label: 'Platform 3', detail: 'Closed' }
          ],
          answer: 'p2'
        },
        {
          id: 'arrival',
          label: 'When will the traveler reach the clinic?',
          options: [
            { id: '0912', label: '09:12' },
            { id: '0918', label: '09:18' },
            { id: '0930', label: '09:30' }
          ],
          answer: '0918'
        }
      ],
      reconstruction: [
        'Reject the Blue Line because Central–River is closed until 12:00.',
        'Take Bus 24 to Park and complete the four-minute transfer by 08:56.',
        'Board the 08:58 River-bound Green Line from Platform 2.',
        'Arrive at River at 09:12 and walk to the clinic by 09:18.'
      ],
      successTitle: 'Route Restored'
    },
    {
      id: 'home-energy-audit',
      title: 'The High Energy Bill',
      subtitle: 'Complete a home energy audit',
      hook: 'Use meter readings and measured appliance loads to identify safe, effective savings.',
      sections: [
        {
          id: 'baseline',
          title: 'Establish the Baseline',
          rounds: [
            {
              value: 100,
              prompt: 'How much electricity was used between meter readings 12,480 and 12,830 kWh?',
              display: 'CURRENT 12,830 · PREVIOUS 12,480',
              options: ['250 kWh', '350 kWh', '450 kWh'],
              answer: 1,
              fragments: [
                'The verified previous meter reading is 12,480 kWh.',
                'The verified current reading is 12,830 kWh; subtraction gives 350 kWh.',
                'Both readings cover the same meter and billing period.',
                'The utility marks both readings as actual, not estimated.'
              ],
              evidence: 'The home used 350 kWh during the period.',
              explanation: '12,830 minus 12,480 equals 350 kWh.'
            },
            {
              value: 200,
              prompt: 'Which comparison shows usage increased from last month’s 280 kWh?',
              display: 'THIS MONTH 350 kWh · LAST MONTH 280 kWh',
              options: ['Down 70 kWh', 'Up 70 kWh', 'Up 630 kWh'],
              answer: 1,
              fragments: [
                'This month’s measured use is 350 kWh.',
                'Last month’s bill records 280 kWh, so the increase is 70 kWh.',
                'Both billing periods contain 30 days.',
                'Neither reading was estimated.'
              ],
              evidence: 'Usage increased by 70 kWh.',
              explanation: '350 minus 280 equals a 70 kWh increase.'
            }
          ]
        },
        {
          id: 'loads',
          title: 'Measure Major Loads',
          rounds: [
            {
              value: 100,
              prompt: 'Which measured device uses the most energy per day?',
              display: 'HEATER 6 kWh · DRYER 3 kWh · TV 0.6 kWh',
              options: ['Space heater', 'Clothes dryer', 'Television'],
              answer: 0,
              fragments: [
                'Plug-meter logs show the heater uses 6 kWh per day.',
                'The same logs show the dryer uses 3 kWh and the television 0.6 kWh per day.',
                'All three measurements cover complete typical days.',
                'The plug meter passed its calibration check.'
              ],
              evidence: 'The space heater is the largest measured daily load.',
              explanation: 'Its 6 kWh daily use exceeds 3 kWh and 0.6 kWh.'
            },
            {
              value: 200,
              prompt: 'How much does the heater use over 10 identical days?',
              display: '6 kWh PER DAY · 10 DAYS',
              options: ['16 kWh', '60 kWh', '600 kWh'],
              answer: 1,
              fragments: [
                'The heater’s measured daily use is 6 kWh.',
                'At the same use for 10 days, 6 multiplied by 10 equals 60 kWh.',
                'The thermostat log confirms identical run time on those 10 days.',
                'No other appliance is included in this calculation.'
              ],
              evidence: 'The heater uses 60 kWh over 10 days.',
              explanation: '6 kWh × 10 days = 60 kWh.'
            }
          ]
        },
        {
          id: 'losses',
          title: 'Locate Heat Loss',
          rounds: [
            {
              value: 100,
              prompt: 'Which area has the largest measured temperature drop?',
              display: 'WINDOW 5°C · DOOR 2°C · ATTIC HATCH 8°C',
              options: ['Window', 'Exterior door', 'Attic hatch'],
              answer: 2,
              fragments: [
                'The thermal audit measures an 8°C drop at the attic hatch.',
                'It measures 5°C at the window and 2°C at the exterior door; 8°C is largest.',
                'All readings were taken within the same ten-minute interval.',
                'The indoor and outdoor temperatures remained stable during testing.'
              ],
              evidence: 'The attic hatch has the largest measured heat loss.',
              explanation: 'Its 8°C drop is greater than the window’s 5°C and door’s 2°C.'
            },
            {
              value: 200,
              prompt: 'Which fix addresses the largest documented air gap without electrical work?',
              display: 'ATTIC HATCH GAP: 6 mm',
              options: ['Install hatch weatherstripping', 'Replace the television', 'Repaint the door'],
              answer: 0,
              fragments: [
                'The auditor recorded a continuous 6 mm air gap around the attic hatch.',
                'The audit recommendation for that gap is adhesive weatherstripping rated for attic hatches.',
                'The television does not affect the hatch gap.',
                'Paint is not rated by the manufacturer as an air-gap seal.'
              ],
              evidence: 'Weatherstripping directly seals the measured attic-hatch gap.',
              explanation: 'It is the audit’s specified non-electrical fix for the documented gap.'
            }
          ]
        },
        {
          id: 'actions',
          title: 'Prioritize Actions',
          rounds: [
            {
              value: 100,
              prompt: 'Which listed action has the largest verified monthly saving?',
              display: 'HEATER $18 · HATCH $9 · LED $4 PER MONTH',
              options: ['Reduce heater run time', 'Seal attic hatch', 'Replace one lamp with LED'],
              answer: 0,
              fragments: [
                'The audit calculates an $18 monthly saving from reducing heater run time.',
                'It calculates $9 for hatch sealing and $4 for one LED replacement.',
                'All estimates use the same utility rate.',
                'The proposed heater schedule maintains the stated minimum room temperature.'
              ],
              evidence: 'Reducing heater run time saves the most: $18 monthly.',
              explanation: '$18 is greater than the other verified savings of $9 and $4.'
            },
            {
              value: 200,
              prompt: 'Which action should require a licensed electrician?',
              display: 'SAFETY NOTE: DAMAGED PANEL WIRING',
              options: ['Apply hatch weatherstripping', 'Repair exposed panel wire', 'Change heater schedule'],
              answer: 1,
              fragments: [
                'The inspection report identifies exposed wiring inside the electrical panel.',
                'The report explicitly says panel repairs must be performed by a licensed electrician.',
                'Weatherstripping does not involve electrical components.',
                'Changing the thermostat schedule does not open the electrical panel.'
              ],
              evidence: 'A licensed electrician must repair the exposed panel wire.',
              explanation: 'The safety report explicitly reserves that panel work for a licensed professional.'
            }
          ]
        }
      ],
      finale: [
        {
          id: 'usage',
          label: 'What was this month’s usage?',
          options: [
            { id: '250', label: '250 kWh' },
            { id: '350', label: '350 kWh' },
            { id: '450', label: '450 kWh' }
          ],
          answer: '350'
        },
        {
          id: 'priority',
          label: 'Which routine change saves the most?',
          options: [
            { id: 'heater', label: 'Reduce heater run time', detail: '$18 per month' },
            { id: 'hatch', label: 'Seal attic hatch', detail: '$9 per month' },
            { id: 'led', label: 'Replace one lamp', detail: '$4 per month' }
          ],
          answer: 'heater'
        },
        {
          id: 'safety',
          label: 'Which task needs a licensed electrician?',
          options: [
            { id: 'strip', label: 'Install weatherstripping' },
            { id: 'wire', label: 'Repair exposed panel wire' },
            { id: 'schedule', label: 'Change heater schedule' }
          ],
          answer: 'wire'
        }
      ],
      reconstruction: [
        'Record 350 kWh of use, 70 kWh more than the prior 30-day period.',
        'Identify the space heater as the largest measured load at 6 kWh per day.',
        'Seal the attic hatch’s 6 mm gap with rated weatherstripping.',
        'Reduce heater run time and assign the exposed panel wire to a licensed electrician.'
      ],
      successTitle: 'Energy Audit Complete'
    },
    {
      id: 'viral-claim',
      title: 'The Viral Water Alert',
      subtitle: 'Verify a widely shared claim',
      hook: 'Check a viral post against primary records, dates, geography, and independent reporting.',
      sections: [
        {
          id: 'claim',
          title: 'Define the Claim',
          rounds: [
            {
              value: 100,
              prompt: 'What does the viral post specifically claim?',
              display: 'POST: “CITY WATER UNSAFE TODAY—BOIL BEFORE DRINKING”',
              options: ['A citywide boil notice is active today', 'One school fountain is closed', 'Water rates rise next month'],
              answer: 0,
              fragments: [
                'The archived post reads, “City water unsafe today—boil before drinking.”',
                'That wording asserts a current citywide boil-water notice.',
                'The post does not mention a school fountain.',
                'The post contains no statement about water rates.'
              ],
              evidence: 'The post claims a citywide boil-water notice is active today.',
              explanation: 'Its exact wording asserts both citywide scope and current timing.'
            },
            {
              value: 200,
              prompt: 'Which detail must be verified to test the word “today”?',
              display: 'POST SHARED MAY 14 · IMAGE HEADER MAY 14',
              options: ['The source year', 'The font color', 'The number of reactions'],
              answer: 0,
              fragments: [
                'The repost date is May 14 of this year.',
                'The image header says May 14 but its cropped view omits the year, so the source year determines whether it is current.',
                'Font color does not establish when an alert was issued.',
                'Reaction count does not establish an alert’s date.'
              ],
              evidence: 'The omitted source year must be checked.',
              explanation: 'Matching month and day are insufficient when the image hides the year.'
            }
          ]
        },
        {
          id: 'source',
          title: 'Trace the Source',
          rounds: [
            {
              value: 100,
              prompt: 'What year appears on the original uncropped notice?',
              display: 'OFFICIAL ARCHIVE RECORD WA-2024-0514',
              options: ['2024', '2025', '2026'],
              answer: 0,
              fragments: [
                'The city archive identifies record WA-2024-0514 as issued May 14, 2024.',
                'The uncropped notice shows “May 14, 2024” in its header.',
                'The viral image matches the archive image pixel for pixel below the cropped header.',
                'The archive is maintained by the city water department.'
              ],
              evidence: 'The shared image comes from a May 14, 2024 notice.',
              explanation: 'Both the archive record and uncropped header give the year as 2024.'
            },
            {
              value: 200,
              prompt: 'What area did the original notice cover?',
              display: 'ORIGINAL SCOPE: NORTH DISTRICT ZONES N2–N4',
              options: ['The entire city', 'North District zones N2–N4', 'South County'],
              answer: 1,
              fragments: [
                'The original notice names only North District zones N2 through N4.',
                'The attached official map highlights N2–N4 and no other city zones.',
                'The archive labels the notice “localized.”',
                'South County uses a different water authority.'
              ],
              evidence: 'The old notice covered only North District zones N2–N4.',
              explanation: 'Its text and official map define a localized, not citywide, area.'
            }
          ]
        },
        {
          id: 'current',
          title: 'Check Current Records',
          rounds: [
            {
              value: 100,
              prompt: 'What does today’s official alert page report?',
              display: 'CURRENT ALERTS · UPDATED MAY 14, 2026 08:00',
              options: ['No active water advisories', 'Citywide boil notice', 'North District closure'],
              answer: 0,
              fragments: [
                'The city water department’s current alert page says “No active water advisories.”',
                'The page was updated today, May 14, 2026, at 08:00.',
                'The alert page lists its update time automatically.',
                'The archived 2024 notice is marked expired.'
              ],
              evidence: 'The official current page reports no active water advisories.',
              explanation: 'Today’s timestamped primary source directly contradicts the viral warning.'
            },
            {
              value: 200,
              prompt: 'Which independent source corroborates the current official status?',
              display: 'LOCAL DESK CHECKED CITY + COUNTY AT 09:15',
              options: ['An anonymous repost', 'Local newsroom verification', 'A product advertisement'],
              answer: 1,
              fragments: [
                'The local newsroom reports that it contacted both city and county water offices at 09:15 today.',
                'Both offices told the newsroom there is no active boil-water notice.',
                'The newsroom article names the responding offices and reporter.',
                'The anonymous repost and advertisement provide no source contact.'
              ],
              evidence: 'A named local newsroom independently confirmed no notice is active.',
              explanation: 'It directly checked two responsible offices and documented the verification.'
            }
          ]
        },
        {
          id: 'verdict',
          title: 'Reach the Verdict',
          rounds: [
            {
              value: 100,
              prompt: 'Which verdict best fits all verified evidence?',
              display: 'OLD LOCAL NOTICE · NO CURRENT ALERT',
              options: ['True and current', 'False context: old and localized', 'Unverifiable'],
              answer: 1,
              fragments: [
                'The image is an authentic notice from May 14, 2024 for zones N2–N4 only.',
                'Today’s 2026 official page and two water offices report no active advisory.',
                'The viral caption changes the old notice’s date and scope.',
                'The original record is available in the public city archive.'
              ],
              evidence: 'The post uses a real old local notice in false current, citywide context.',
              explanation: 'The image is genuine, but the viral claim misstates both its date and geographic scope.'
            },
            {
              value: 200,
              prompt: 'Which correction is accurate and complete?',
              display: 'CORRECTION MUST STATE DATE · SCOPE · CURRENT STATUS',
              options: [
                'The image is fake.',
                'It was a 2024 N2–N4 notice; no advisory is active today.',
                'A citywide notice ended yesterday.'
              ],
              answer: 1,
              fragments: [
                'The archived image is genuine and dates to 2024 for North District zones N2–N4.',
                'The current official status is no active advisory today.',
                'No record says a citywide notice ended yesterday.',
                'A complete correction must preserve the image’s authenticity while correcting date, scope, and status.'
              ],
              evidence: 'The complete correction identifies the 2024 local notice and today’s clear status.',
              explanation: 'Only the second option accurately states all three verified facts.'
            }
          ]
        }
      ],
      finale: [
        {
          id: 'origin',
          label: 'When and where did the notice apply?',
          options: [
            { id: '2024-local', label: 'May 14, 2024 · zones N2–N4' },
            { id: '2026-city', label: 'May 14, 2026 · entire city' },
            { id: '2026-county', label: 'May 14, 2026 · South County' }
          ],
          answer: '2024-local'
        },
        {
          id: 'status',
          label: 'What is today’s official status?',
          options: [
            { id: 'none', label: 'No active water advisories' },
            { id: 'citywide', label: 'Citywide boil notice' },
            { id: 'north', label: 'North District closure' }
          ],
          answer: 'none'
        },
        {
          id: 'verdict',
          label: 'What is the verdict on the viral claim?',
          options: [
            { id: 'true', label: 'True and current' },
            { id: 'false-context', label: 'False context', detail: 'Old local notice presented as current and citywide' },
            { id: 'unknown', label: 'Unverifiable' }
          ],
          answer: 'false-context'
        }
      ],
      reconstruction: [
        'Capture the viral claim as a current citywide boil-water warning.',
        'Trace its cropped image to an authentic May 14, 2024 notice for zones N2–N4.',
        'Check today’s official alert page and independent calls confirming no active advisory.',
        'Publish the correction that an old local notice was shared with false date and scope.'
      ],
      successTitle: 'Claim Verified'
    }
  ]
};

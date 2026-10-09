    export function publicState(state){const safe={...state,connections:{}};if(safe.phase==='investigate')safe.players=safe.players.map(p=>({...p,investigation:null}));if(safe.phase==='predict')safe.players=safe.players.map(p=>({...p,answer:null}));return JSON.parse(JSON.stringify(safe))}
    export function allDone(state,key){return state.players.filter(p=>p.connected).every(p=>p[key]!==null&&p[key]!==undefined)}
    export function resolveRound(state,missions){const m=missions[state.round];const connected=state.players.filter(p=>p.connected);let correctVotes=0;
      connected.forEach(p=>{const goodTest=m.tests[p.investigation]?.value===3;const correct=p.answer===m.correct;p.roundPoints=(correct?2:0)+(goodTest?2:0);if(correct)correctVotes++;p.score+=p.roundPoints});
      const used=new Set(connected.map(p=>p.investigation));state.teamScore+=used.size+(correctVotes>connected.length/2?2:0);state.lastResult={correctVotes,total:connected.length,used:[...used],crewWon:correctVotes>connected.length/2};
    }

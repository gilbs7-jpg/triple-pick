import React, { useState, useEffect } from 'react';

// ── JSONBIN CONFIG ────────────────────────────────────────────────────────────
const JSONBIN_PICKS_ID = "6a289e9dda38895dfea3718d";
const JSONBIN_STATE_ID = "6a29f4e7f5f4af5e29db9b7d";
const JSONBIN_API_KEY  = "$2a$10$SM58O3uX4Dttskq/9geD5OytFCpgoclTLo8BWMo6gvk4QBQI5y9Ri";
const PICKS_URL        = `https://api.jsonbin.io/v3/b/${JSONBIN_PICKS_ID}`;
const STATE_URL        = `https://api.jsonbin.io/v3/b/${JSONBIN_STATE_ID}`;
const ROUNDS           = ['GW1','GW2','GW3','GW4','GW5','GW6','GW7'];
const ADMIN_USER       = 'Jason Gilbert';

// GW deadlines in UTC (BST = UTC+1, so 20:00 BST = 19:00 UTC)
const GW_DEADLINES = {
  GW1: new Date('2026-06-11T19:00:00Z').getTime(),
  GW2: new Date('2026-06-18T19:00:00Z').getTime(),
  GW3: new Date('2026-06-24T19:00:00Z').getTime(),
  GW4: new Date('2026-06-28T16:00:00Z').getTime(),
  GW5: new Date('2026-07-04T15:00:00Z').getTime(),
  GW6: new Date('2026-07-08T19:00:00Z').getTime(),
  GW7: new Date('2026-07-12T19:00:00Z').getTime(),
};

// ── PLAYERS ───────────────────────────────────────────────────────────────────
const PLAYER_SLUGS = {
  you:       'Jason Gilbert',
  jona_m:    'Jona Moore',
  adam_b:    'Adam Brand',
  jamie_b:   'Jamie Brown',
  richard_l: 'Richard Lee',
  lianne_c:  'Lianne Conway',
  mark_b:    'Mark Bentley',
  kieran_s:  'Kieran Smyth',
  amelia_a:  'Amelia Wood',
  gemma_d:   'Gemma D',
};
const ALL_PLAYERS = Object.values(PLAYER_SLUGS);

// ── H2H FIXTURE SCHEDULE ──────────────────────────────────────────────────────
const H2H_FIXTURES = {
  GW1: [['Jason Gilbert','Gemma D'],['Jona Moore','Adam Brand'],['Jamie Brown','Richard Lee'],['Lianne Conway','Mark Bentley'],['Kieran Smyth','Amelia Wood']],
  GW2: [['Jason Gilbert','Amelia Wood'],['Gemma D','Kieran Smyth'],['Mark Bentley','Jamie Brown'],['Richard Lee','Jona Moore'],['Adam Brand','Lianne Conway']],
  GW3: [['Jason Gilbert','Mark Bentley'],['Amelia Wood','Richard Lee'],['Kieran Smyth','Adam Brand'],['Gemma D','Lianne Conway'],['Jona Moore','Jamie Brown']],
  GW4: [['Jason Gilbert','Richard Lee'],['Mark Bentley','Gemma D'],['Lianne Conway','Kieran Smyth'],['Adam Brand','Jamie Brown'],['Jona Moore','Amelia Wood']],
  GW5: [['Jason Gilbert','Adam Brand'],['Richard Lee','Lianne Conway'],['Gemma D','Jona Moore'],['Kieran Smyth','Jamie Brown'],['Amelia Wood','Mark Bentley']],
  GW6: [['Jason Gilbert','Lianne Conway'],['Adam Brand','Amelia Wood'],['Richard Lee','Mark Bentley'],['Jona Moore','Kieran Smyth'],['Jamie Brown','Gemma D']],
  GW7: [['Jason Gilbert','Jona Moore'],['Lianne Conway','Jamie Brown'],['Adam Brand','Gemma D'],['Amelia Wood','Richard Lee'],['Mark Bentley','Kieran Smyth']],
};

// ── MATCH FIXTURES ────────────────────────────────────────────────────────────
const MATCH_FIXTURES_POOL = {
  GW1: [
    { id:'g1_1',  home:{id:'mex',name:'Mexico',       flag:'🇲🇽'}, away:{id:'rsa',name:'South Africa', flag:'🇿🇦'}, date:'Thu, 11 June', time:'20:00 BST'},
    { id:'g1_2',  home:{id:'kor',name:'South Korea',  flag:'🇰🇷'}, away:{id:'cze',name:'Czechia',      flag:'🇨🇿'}, date:'Fri, 12 June', time:'03:00 BST'},
    { id:'g1_3',  home:{id:'can',name:'Canada',       flag:'🇨🇦'}, away:{id:'bih',name:'Bosnia & Herz.',flag:'🇧🇦'}, date:'Fri, 12 June', time:'20:00 BST'},
    { id:'g1_4',  home:{id:'usa',name:'USA',          flag:'🇺🇸'}, away:{id:'par',name:'Paraguay',     flag:'🇵🇾'}, date:'Sat, 13 June', time:'02:00 BST'},
    { id:'g1_5',  home:{id:'qat',name:'Qatar',        flag:'🇶🇦'}, away:{id:'sui',name:'Switzerland',  flag:'🇨🇭'}, date:'Sat, 13 June', time:'20:00 BST'},
    { id:'g1_6',  home:{id:'bra',name:'Brazil',       flag:'🇧🇷'}, away:{id:'mar',name:'Morocco',      flag:'🇲🇦'}, date:'Sat, 13 June', time:'23:00 BST'},
    { id:'g1_7',  home:{id:'hai',name:'Haiti',        flag:'🇭🇹'}, away:{id:'sco',name:'Scotland',     flag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿'}, date:'Sun, 14 June', time:'02:00 BST'},
    { id:'g1_8',  home:{id:'aus',name:'Australia',    flag:'🇦🇺'}, away:{id:'tur',name:'Türkiye',      flag:'🇹🇷'}, date:'Sun, 14 June', time:'05:00 BST'},
    { id:'g1_9',  home:{id:'ger',name:'Germany',      flag:'🇩🇪'}, away:{id:'cuw',name:'Curaçao',      flag:'🇨🇼'}, date:'Sun, 14 June', time:'18:00 BST'},
    { id:'g1_10', home:{id:'ned',name:'Netherlands',  flag:'🇳🇱'}, away:{id:'jpn',name:'Japan',        flag:'🇯🇵'}, date:'Sun, 14 June', time:'21:00 BST'},
    { id:'g1_11', home:{id:'civ',name:'Ivory Coast',  flag:'🇨🇮'}, away:{id:'ecu',name:'Ecuador',      flag:'🇪🇨'}, date:'Mon, 15 June', time:'00:00 BST'},
    { id:'g1_12', home:{id:'swe',name:'Sweden',       flag:'🇸🇪'}, away:{id:'tun',name:'Tunisia',      flag:'🇹🇳'}, date:'Mon, 15 June', time:'03:00 BST'},
  ],
  GW4: [
    { id:'g4_1', home:{id:'usa',name:'USA',         flag:'🇺🇸'}, away:{id:'arg',name:'Argentina', flag:'🇦🇷'}, date:'Sun, 28 June', time:'17:00 BST'},
    { id:'g4_2', home:{id:'mex',name:'Mexico',      flag:'🇲🇽'}, away:{id:'fra',name:'France',    flag:'🇫🇷'}, date:'Sun, 28 June', time:'21:00 BST'},
    { id:'g4_3', home:{id:'eng',name:'England',     flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿'}, away:{id:'esp',name:'Spain',     flag:'🇪🇸'}, date:'Mon, 29 June', time:'16:00 BST'},
    { id:'g4_4', home:{id:'ger',name:'Germany',     flag:'🇩🇪'}, away:{id:'mar',name:'Morocco',   flag:'🇲🇦'}, date:'Mon, 29 June', time:'20:00 BST'},
    { id:'g4_5', home:{id:'ned',name:'Netherlands', flag:'🇳🇱'}, away:{id:'por',name:'Portugal',  flag:'🇵🇹'}, date:'Tue, 30 June', time:'18:00 BST'},
    { id:'g4_6', home:{id:'cro',name:'Croatia',     flag:'🇭🇷'}, away:{id:'bra',name:'Brazil',    flag:'🇧🇷'}, date:'Wed, 1 July',  time:'19:00 BST'},
  ],
};
['GW2','GW3','GW5','GW6','GW7'].forEach(gw => { if (!MATCH_FIXTURES_POOL[gw]) MATCH_FIXTURES_POOL[gw] = []; });

// ── SCORING ENGINE ────────────────────────────────────────────────────────────
function basePoints(result) {
  if (result === 'W') return 3;
  if (result === 'D') return 1;
  return 0;
}

function calcPlayerScore(picks, results) {
  if (!picks || picks.length === 0) return null; // forfeit
  return picks.reduce((sum, pick) => {
    const result = results?.[pick.id] ?? null;
    let pts = basePoints(result);
    if (pick.isArmband && result === 'W') pts += 1; // captain bonus only on win
    return sum + pts;
  }, 0);
}

function calcRoundH2H(allPicks, results, gwKey) {
  const fixtures = H2H_FIXTURES[gwKey] || [];
  const out = {};
  fixtures.forEach(([p1, p2]) => {
    const score1 = calcPlayerScore(allPicks?.[gwKey]?.[p1]?.picks ?? null, results);
    const score2 = calcPlayerScore(allPicks?.[gwKey]?.[p2]?.picks ?? null, results);
    const f1 = score1 === null, f2 = score2 === null;
    let h1 = 0, h2 = 0;
    if (!f1 && !f2) { if (score1 > score2) { h1=3; } else if (score2 > score1) { h2=3; } else { h1=1; h2=1; } }
    else if (f1 && !f2) { h2 = 3; }
    else if (!f1 && f2) { h1 = 3; }
    out[p1] = { h2hPts: h1, score: score1 ?? 0, forfeited: f1 };
    out[p2] = { h2hPts: h2, score: score2 ?? 0, forfeited: f2 };
  });
  return out;
}

function buildLeagueTable(allPicks, allResults) {
  const table = {};
  ALL_PLAYERS.forEach(p => { table[p] = { name:p, played:0, w:0, d:0, l:0, h2hPts:0, totalScore:0, winsSelected:0 }; });
  ROUNDS.forEach(gw => {
    const results = allResults?.[gw];
    if (!results) return;
    const h2h = calcRoundH2H(allPicks, results, gw);
    Object.entries(h2h).forEach(([player, data]) => {
      if (!table[player]) return;
      table[player].played++;
      table[player].h2hPts   += data.h2hPts;
      table[player].totalScore += data.score;
      if (data.h2hPts === 3) table[player].w++;
      else if (data.h2hPts === 1) table[player].d++;
      else table[player].l++;
      (allPicks?.[gw]?.[player]?.picks ?? []).forEach(pick => {
        if (results[pick.id] === 'W') table[player].winsSelected++;
      });
    });
  });
  return Object.values(table).sort((a,b) => b.h2hPts - a.h2hPts || b.totalScore - a.totalScore || b.winsSelected - a.winsSelected);
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [currentTab,    setCurrentTab]    = useState('picks');
  const [activeRound,   setActiveRound]   = useState('GW1');
  const [currentUser,   setCurrentUser]   = useState(null);
  const [invalidUser,   setInvalidUser]   = useState(false);
  const [showRules,     setShowRules]     = useState(false);
  const [selectedSlot,  setSelectedSlot]  = useState(0);
  const [selections,    setSelections]    = useState([null,null,null]);
  const [armbandSlot,   setArmbandSlot]   = useState(0);
  const [isFormLocked,  setIsFormLocked]  = useState(false);
  const [isLoadingPicks,setIsLoadingPicks]= useState(false);
  const [isSaving,      setIsSaving]      = useState(false);
  const [timeLeft,      setTimeLeft]      = useState({days:0,hours:0,minutes:0,seconds:0});

  // Shared data
  const [allPicks,      setAllPicks]      = useState({});
  const [allResults,    setAllResults]    = useState({});
  const [leagueTable,   setLeagueTable]   = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Admin state
  const [roundResults,  setRoundResults]  = useState({});
  const [isCalculating, setIsCalculating] = useState(false);

  const isAdmin       = currentUser === ADMIN_USER;
  const deadline      = GW_DEADLINES[activeRound] ?? GW_DEADLINES.GW1;
  const deadlinePassed = Date.now() >= deadline;

  // ── Read URL param ────────────────────────────────────────────────────────
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('player');
    if (p && PLAYER_SLUGS[p])   { setCurrentUser(PLAYER_SLUGS[p]); }
    else if (!p)                 { setCurrentUser(PLAYER_SLUGS['you']); }
    else                         { setInvalidUser(true); }
  }, []);

  // ── Load all data from both bins ──────────────────────────────────────────
  useEffect(() => {
    if (!currentUser) return;
    async function loadAll() {
      setIsLoadingData(true);
      try {
        const [pr, sr] = await Promise.all([
          fetch(PICKS_URL, { headers:{'X-Master-Key':JSONBIN_API_KEY} }),
          fetch(STATE_URL, { headers:{'X-Master-Key':JSONBIN_API_KEY} }),
        ]);
        const pd = await pr.json();
        const sd = await sr.json();
        const picks   = pd.record?.playerPicks ?? {};
        const results = sd.record?.results      ?? {};
        setAllPicks(picks);
        setAllResults(results);
        setLeagueTable(buildLeagueTable(picks, results));
        // Restore this user's picks for active round
        const my = picks?.[activeRound]?.[currentUser];
        if (my?.picks?.length === 3) {
          setSelections(my.picks.map(p => ({id:p.id, name:p.name, flag:p.flag})));
          const ab = my.picks.findIndex(p => p.isArmband);
          setArmbandSlot(ab !== -1 ? ab : 0);
          setIsFormLocked(true);
        }
        setRoundResults(results?.[activeRound] ?? {});
      } catch(e) {
        console.error('Load failed', e);
        setLeagueTable(ALL_PLAYERS.map(name => ({name,played:0,w:0,d:0,l:0,h2hPts:0,totalScore:0,winsSelected:0})));
      } finally {
        setIsLoadingData(false);
      }
    }
    loadAll();
  }, [currentUser]); // eslint-disable-line

  // ── Re-restore picks when round changes ──────────────────────────────────
  useEffect(() => {
    if (!currentUser || isLoadingData) return;
    const my = allPicks?.[activeRound]?.[currentUser];
    if (my?.picks?.length === 3) {
      setSelections(my.picks.map(p => ({id:p.id, name:p.name, flag:p.flag})));
      const ab = my.picks.findIndex(p => p.isArmband);
      setArmbandSlot(ab !== -1 ? ab : 0);
      setIsFormLocked(true);
    } else {
      setSelections([null,null,null]);
      setArmbandSlot(0);
      setIsFormLocked(false);
    }
    setRoundResults(allResults?.[activeRound] ?? {});
  }, [activeRound]); // eslint-disable-line

  // ── Countdown ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      const diff = deadline - Date.now();
      if (diff <= 0) {
        setTimeLeft({days:0,hours:0,minutes:0,seconds:0});
        setIsFormLocked(true);
      } else {
        setTimeLeft({
          days:    Math.floor(diff / 86400000),
          hours:   Math.floor((diff % 86400000) / 3600000),
          minutes: Math.floor((diff % 3600000)  / 60000),
          seconds: Math.floor((diff % 60000)    / 1000),
        });
      }
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [deadline]);

  // ── Save picks ────────────────────────────────────────────────────────────
  const handleFinalizeAndSave = async () => {
    if (isFormLocked) { setIsFormLocked(false); return; }
    if (selections.includes(null)) { alert('Please fill all 3 slots before locking.'); return; }
    try {
      setIsSaving(true);
      const res  = await fetch(PICKS_URL, {headers:{'X-Master-Key':JSONBIN_API_KEY}});
      const data = await res.json();
      const master = data.record || {playerPicks:{}};
      if (!master.playerPicks) master.playerPicks = {};
      if (!master.playerPicks[activeRound]) master.playerPicks[activeRound] = {};
      master.playerPicks[activeRound][currentUser] = {
        picks: selections.map((s,idx) => ({name:s.name,flag:s.flag,id:s.id,isArmband:armbandSlot===idx})),
        timestamp: new Date().toISOString(),
      };
      await fetch(PICKS_URL, {
        method:'PUT',
        headers:{'Content-Type':'application/json','X-Master-Key':JSONBIN_API_KEY},
        body: JSON.stringify(master),
      });
      setAllPicks(master.playerPicks);
      setIsFormLocked(true);
      alert(`✅ Picks locked for ${currentUser}!`);
    } catch(e) {
      alert('Save failed — screenshot your picks and tell the Commissioner.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Admin: calculate round ────────────────────────────────────────────────
  const handleCalculateRound = async () => {
    if (Object.keys(roundResults).length === 0) { alert('Enter at least one result first.'); return; }
    try {
      setIsCalculating(true);
      const res  = await fetch(STATE_URL, {headers:{'X-Master-Key':JSONBIN_API_KEY}});
      const data = await res.json();
      const state = data.record || {results:{},leagueTable:{}};
      if (!state.results) state.results = {};
      state.results[activeRound] = roundResults;
      const newTable = buildLeagueTable(allPicks, state.results);
      state.leagueTable = newTable;
      await fetch(STATE_URL, {
        method:'PUT',
        headers:{'Content-Type':'application/json','X-Master-Key':JSONBIN_API_KEY},
        body: JSON.stringify(state),
      });
      setAllResults(state.results);
      setLeagueTable(newTable);
      alert(`✅ ${activeRound} calculated and table updated!`);
    } catch(e) {
      console.error(e);
      alert('Calculation failed — check console.');
    } finally {
      setIsCalculating(false);
    }
  };

  // ── Pick helpers ──────────────────────────────────────────────────────────
  const historicalUsage = {};
  const getUsageMetrics = (teamId) => {
    return (historicalUsage[teamId] || 0) + selections.filter(s => s?.id === teamId).length;
  };
  const handleSelectNation = (nation) => {
    if (isFormLocked) return;
    const dup = selections.findIndex(s => s?.id === nation.id);
    if (dup !== -1 && dup !== selectedSlot) return;
    if (getUsageMetrics(nation.id) >= 2 && selections[selectedSlot]?.id !== nation.id) {
      alert(`${nation.name} has reached the 2-cap limit.`); return;
    }
    const updated = [...selections];
    updated[selectedSlot] = nation;
    setSelections(updated);
    if (selectedSlot < 2 && !updated[selectedSlot + 1]) setSelectedSlot(selectedSlot + 1);
  };
  const handleClearSlot = (idx, e) => {
    e.stopPropagation();
    if (isFormLocked) return;
    const updated = [...selections];
    updated[idx] = null;
    setSelections(updated);
    setSelectedSlot(idx);
  };

  // ── Arena helpers ─────────────────────────────────────────────────────────
  const getPlayerPicksDisplay = (playerName, gw) => {
    const saved       = allPicks?.[gw]?.[playerName];
    const gwDeadline  = GW_DEADLINES[gw] ?? GW_DEADLINES.GW1;
    const roundClosed = Date.now() >= gwDeadline;
    const isJason     = currentUser === ADMIN_USER;
    if (!saved?.picks?.length) return { status: 'pending', display: null };
    if (!roundClosed && !isJason) return { status: 'submitted', display: null };
    return { status: 'revealed', display: saved.picks };
  };
  const getPlayerScore = (playerName, gw) => {
    const results = allResults?.[gw];
    if (!results) return null;
    return calcPlayerScore(allPicks?.[gw]?.[playerName]?.picks ?? null, results);
  };

  // ── Guard screens ─────────────────────────────────────────────────────────
  if (invalidUser) return (
    <div className="min-h-screen bg-[#F4F4F9] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#FF3B30]/20 p-6 max-w-sm w-full shadow-xl text-center">
        <div className="w-12 h-12 bg-[#FF3B30]/10 text-[#FF3B30] rounded-full flex items-center justify-center mx-auto text-xl">⚠️</div>
        <h2 className="text-base font-bold text-[#1C1C1E] mt-4">Invalid Link</h2>
        <p className="text-xs text-[#8E8E93] mt-2">Request your link from the League Commissioner.</p>
      </div>
    </div>
  );
  if (!currentUser) return (
    <div className="min-h-screen bg-[#F4F4F9] flex items-center justify-center">
      <p className="text-xs text-[#8E8E93] font-mono animate-pulse">Loading...</p>
    </div>
  );

  const currentRoundMatches = MATCH_FIXTURES_POOL[activeRound] || [];

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F4F4F9] text-[#1C1C1E] antialiased p-4 md:p-6 font-sans">

      {/* HEADER */}
      <header className="max-w-4xl mx-auto mb-6 bg-white rounded-2xl p-4 border border-[#E5E5EA] flex flex-col sm:flex-row justify-between items-center gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-[#1C1C1E]">Triple Pick League</h1>
            <span className="bg-[#007AFF] text-white text-[9px] font-black tracking-wider px-2 py-0.5 rounded-md uppercase">World Cup '26</span>
          </div>
          <p className="text-[10px] text-[#007AFF] font-bold uppercase tracking-wider mt-0.5">Authenticated Manager: {currentUser}</p>
        </div>
        <div className="bg-[#E5E5EA] p-0.5 rounded-xl flex gap-0.5 w-full sm:w-auto">
          {[['picks','Strategy Desk'],['league','⚽ Arena & Standings']].map(([tab,label]) => (
            <button key={tab} onClick={() => setCurrentTab(tab)}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${currentTab===tab ? 'bg-white text-[#1C1C1E] shadow-sm' : 'text-[#636366]'}`}>
              {label}
            </button>
          ))}
          {isAdmin && (
            <button onClick={() => setCurrentTab('admin')}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${currentTab==='admin' ? 'bg-white text-[#FF3B30] shadow-sm' : 'text-[#636366]'}`}>
              Admin ⚙️
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto">

        {/* ════════════════════════════════════════════════
            STRATEGY DESK
        ════════════════════════════════════════════════ */}
        {currentTab === 'picks' && (
          <div className="space-y-6">

            <section className="bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#007AFF] to-[#5AC8FA]" />

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                <div>
                  <h2 className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">Active Configuration Slots</h2>
                  <p className="text-[11px] text-[#636366] mt-0.5">Modifying sheet for: <span className="font-bold text-black">{currentUser}</span></p>
                </div>
                <div className="bg-[#FF9500]/10 border border-[#FF9500]/20 rounded-xl px-3 py-1.5 flex items-center gap-2 self-start sm:self-center">
                  <span className={`w-1.5 h-1.5 rounded-full ${deadlinePassed ? 'bg-[#FF3B30]' : 'bg-[#FF9500] animate-pulse'}`} />
                  <span className={`text-[10px] font-black uppercase ${deadlinePassed ? 'text-[#FF3B30]' : 'text-[#FF9500]'}`}>
                    {deadlinePassed ? 'Deadline Passed' : 'Lockout In:'}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#1C1C1E]">
                    {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                  </span>
                </div>
              </div>

              {isFormLocked && !isLoadingPicks && (
                <div className="mb-4 px-3 py-2 bg-[#34C759]/10 border border-[#34C759]/30 rounded-xl flex items-center gap-2">
                  <span className="text-[#34C759] text-sm">✓</span>
                  <p className="text-xs font-semibold text-[#34C759]">Your picks are locked in and saved. Click the green button below to make changes.</p>
                </div>
              )}
              {isLoadingPicks && (
                <div className="mb-4 px-3 py-2 bg-[#007AFF]/10 border border-[#007AFF]/20 rounded-xl">
                  <p className="text-xs font-mono text-[#007AFF] animate-pulse">Checking for existing picks...</p>
                </div>
              )}

              {/* Round tabs */}
              <div className="flex gap-1 mb-4 flex-wrap">
                {ROUNDS.map(gw => (
                  <button key={gw} onClick={() => setActiveRound(gw)}
                    className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${activeRound===gw ? 'bg-[#007AFF] text-white' : 'bg-[#F2F2F7] text-[#636366] hover:bg-[#E5E5EA]'}`}>
                    {gw}
                  </button>
                ))}
              </div>

              {/* Slots */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {selections.map((nation, idx) => {
                  const isActive  = selectedSlot === idx;
                  const isArmband = armbandSlot  === idx;
                  return (
                    <div key={idx} onClick={() => !isFormLocked && setSelectedSlot(idx)}
                      className={`p-4 rounded-xl border-2 flex flex-col justify-between h-28 transition-all cursor-pointer relative ${isActive ? 'border-[#007AFF] bg-[#007AFF]/5' : 'border-[#E5E5EA] bg-white hover:border-[#D1D1D6]'}`}>
                      <div className="flex justify-between items-start w-full">
                        <span className="text-[10px] font-black uppercase text-[#8E8E93]">Slot 0{idx+1}</span>
                        {nation && !isFormLocked && (
                          <button onClick={(e) => handleClearSlot(idx,e)} className="text-[10px] font-bold text-[#FF3B30] bg-[#FF3B30]/10 px-2 py-0.5 rounded-md">Clear</button>
                        )}
                      </div>
                      <div className="my-auto flex items-center gap-3">
                        {nation ? (
                          <><span className="text-3xl">{nation.flag}</span>
                          <div><p className="text-sm font-bold text-[#1C1C1E]">{nation.name}</p>
                          <p className="text-[10px] font-mono text-[#8E8E93]">Caps Used: {getUsageMetrics(nation.id)}/2</p></div></>
                        ) : (
                          <p className="text-xs italic text-[#AEAEB2] font-medium">Click to assign team...</p>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-dashed border-[#E5E5EA]">
                        <span className="text-[9px] font-bold text-[#8E8E93]">Armband Option</span>
                        <input type="radio" name="armband" disabled={isFormLocked} checked={isArmband}
                          onChange={() => setArmbandSlot(idx)} onClick={(e) => e.stopPropagation()}
                          className="accent-[#007AFF] h-3.5 w-3.5" />
                      </div>
                      {isArmband && (
                        <span className="absolute -top-2.5 -right-2 bg-[#1C1C1E] text-white text-[8px] font-black tracking-wide py-0.5 px-2 rounded-md border border-white">Ⓒ ARMBAND (+1)</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <button disabled={isSaving || deadlinePassed} onClick={handleFinalizeAndSave}
                className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${isFormLocked ? 'bg-[#34C759] text-white hover:bg-[#28a745]' : 'bg-[#1C1C1E] text-white hover:bg-black disabled:opacity-50'}`}>
                {isSaving ? <span className="animate-pulse">🌐 Syncing Strategy Ledger...</span>
                  : isFormLocked ? '🔓 Reopen Sheets for Adjustments'
                  : '🔒 Finalize Sheet Configuration'}
              </button>
            </section>

            {/* Rules accordion */}
            <section className="bg-white rounded-2xl border border-[#E5E5EA] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
              <button onClick={() => setShowRules(!showRules)}
                className="w-full p-4 flex justify-between items-center bg-[#F2F2F7]/50 hover:bg-[#F2F2F7] transition-all text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm">📜</span>
                  <h3 className="text-xs font-black text-[#1C1C1E] uppercase tracking-wider">Rules of the Beautiful Game</h3>
                </div>
                <span className="text-xs font-bold text-[#007AFF]">{showRules ? 'Hide Details ▲' : 'Review Rules ▼'}</span>
              </button>
              {showRules && (
                <div className="p-5 border-t border-[#E5E5EA] bg-white space-y-4 text-xs text-[#636366] leading-relaxed">
                  <div><h4 className="font-bold text-[#1C1C1E] mb-1">1. The Triple Pick Selection</h4><p>Every gameweek, select exactly 3 nations from the active match pool.</p></div>
                  <div><h4 className="font-bold text-[#1C1C1E] mb-1">2. The 2-Cap Allocation Limit</h4><p>You can only select any nation <span className="font-bold text-black">up to 2 times across the entire tournament</span>.</p></div>
                  <div><h4 className="font-bold text-[#1C1C1E] mb-1">3. The Armband Ⓒ Modifier</h4><p>Nominate one pick as your Armband captain. If that nation <strong>wins</strong>, you earn a <span className="font-bold text-[#34C759]">+1 bonus point</span> on top of the standard 3. A draw does not trigger the bonus.</p></div>
                  <div><h4 className="font-bold text-[#1C1C1E] mb-1">4. Head-to-Head Scoring</h4>
                    <ul className="list-disc list-inside mt-1 ml-2 space-y-0.5 font-mono text-[11px]">
                      <li><span className="font-bold text-[#34C759]">3 League Pts</span> — Match Win</li>
                      <li><span className="font-bold text-[#8E8E93]">1 League Pt</span> — Match Draw</li>
                      <li><span className="font-bold text-[#FF3B30]">0 League Pts</span> — Match Loss</li>
                    </ul>
                  </div>
                  <div><h4 className="font-bold text-[#1C1C1E] mb-1">5. Forfeit Rule</h4><p>No picks by the deadline = forfeit. You score 0 pts; your opponent is awarded 3 league points automatically.</p></div>
                  <div className="bg-[#F2F2F7] p-3 rounded-xl border border-[#E5E5EA]">
                    <span className="font-bold text-[#1C1C1E] block mb-0.5">⚠️ Lockout Deadlines</span>
                    Once you lock your picks they are saved to the cloud. You can edit up until the deadline expires.
                  </div>
                </div>
              )}
            </section>

            {/* Fixture pool */}
            <section className="bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <h3 className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider mb-4">Available Matchday Pool ({activeRound})</h3>
              {currentRoundMatches.length === 0 ? (
                <p className="text-xs text-[#8E8E93] italic">Fixtures not yet available for this round.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentRoundMatches.map((match) => {
                    const homeUsage    = getUsageMetrics(match.home.id);
                    const awayUsage    = getUsageMetrics(match.away.id);
                    const homeMaxed    = homeUsage >= 2 && !selections.some(s => s?.id === match.home.id);
                    const awayMaxed    = awayUsage >= 2 && !selections.some(s => s?.id === match.away.id);
                    const slotOwnsHome = selections[selectedSlot]?.id === match.home.id;
                    const slotOwnsAway = selections[selectedSlot]?.id === match.away.id;
                    return (
                      <div key={match.id} className="bg-white border border-[#E5E5EA] rounded-xl p-3 flex flex-col justify-between relative overflow-hidden pl-4">
                        <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-[#E5E5EA]" />
                        <div className="flex items-center justify-between w-full">
                          <button disabled={isFormLocked||homeMaxed} onClick={() => handleSelectNation(match.home)}
                            className={`flex-1 p-2 rounded-lg flex items-center gap-2.5 transition-all text-left ${slotOwnsHome ? 'bg-[#007AFF]/10 border border-[#007AFF]/30 font-bold' : homeMaxed ? 'opacity-30' : 'hover:bg-[#F2F2F7]'}`}>
                            <span className="text-2xl">{match.home.flag}</span>
                            <div className="truncate"><p className="text-xs font-bold text-[#1C1C1E] truncate">{match.home.name}</p><p className="text-[9px] font-mono text-[#8E8E93]">Caps: {homeUsage}/2</p></div>
                          </button>
                          <div className="px-3 text-[10px] font-black text-[#AEAEB2] font-mono">VS</div>
                          <button disabled={isFormLocked||awayMaxed} onClick={() => handleSelectNation(match.away)}
                            className={`flex-1 p-2 rounded-lg flex items-center justify-end gap-2.5 transition-all text-right ${slotOwnsAway ? 'bg-[#007AFF]/10 border border-[#007AFF]/30 font-bold' : awayMaxed ? 'opacity-30' : 'hover:bg-[#F2F2F7]'}`}>
                            <div className="truncate"><p className="text-xs font-bold text-[#1C1C1E] truncate">{match.away.name}</p><p className="text-[9px] font-mono text-[#8E8E93]">Caps: {awayUsage}/2</p></div>
                            <span className="text-2xl">{match.away.flag}</span>
                          </button>
                        </div>
                        <div className="w-full text-center mt-2 pt-1.5 border-t border-[#F2F2F7] flex justify-center gap-1.5 items-center">
                          <span className="text-[10px] font-semibold text-[#636366]">{match.date}</span>
                          <span className="text-[9px] font-bold font-mono text-[#8E8E93] bg-[#F2F2F7] px-1.5 py-0.5 rounded">{match.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            ⚽ ARENA & STANDINGS
        ════════════════════════════════════════════════ */}
        {currentTab === 'league' && (
          <div className="space-y-6">

            {/* Arena */}
            <section className="bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[4px] h-full bg-[#007AFF]" />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 pb-3 border-b border-[#F2F2F7]">
                <h2 className="text-base font-bold text-[#1C1C1E] tracking-tight">⚽ H2H Matchday Arena</h2>
                <div className="bg-[#E5E5EA]/70 p-0.5 rounded-xl flex flex-wrap gap-0.5">
                  {ROUNDS.map(gw => (
                    <button key={gw} onClick={() => setActiveRound(gw)}
                      className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${activeRound===gw ? 'bg-white text-[#007AFF] shadow-sm' : 'text-[#636366]'}`}>
                      {gw}
                    </button>
                  ))}
                </div>
              </div>

              {isLoadingData ? (
                <p className="text-center py-6 text-xs text-[#8E8E93] font-mono animate-pulse">Loading arena data...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(H2H_FIXTURES[activeRound] || []).map(([p1name, p2name], index) => {
                    const isUserMatch  = p1name === currentUser || p2name === currentUser;
                    const gwDeadline   = GW_DEADLINES[activeRound] ?? GW_DEADLINES.GW1;
                    const roundClosed  = Date.now() >= gwDeadline;
                    const p1data = getPlayerPicksDisplay(p1name, activeRound);
                    const p2data = getPlayerPicksDisplay(p2name, activeRound);
                    const score1 = getPlayerScore(p1name, activeRound);
                    const score2 = getPlayerScore(p2name, activeRound);
                    const p1forfeited = roundClosed && !allPicks?.[activeRound]?.[p1name]?.picks?.length;
                    const p2forfeited = roundClosed && !allPicks?.[activeRound]?.[p2name]?.picks?.length;

                    const renderPicks = (playerData, forfeited) => {
                      if (forfeited) return <span className="text-[10px] font-bold text-[#FF3B30] bg-[#FF3B30]/10 px-1.5 py-0.5 rounded">FORFEIT</span>;
                      if (playerData.status === 'pending')   return <span className="text-[10px] italic text-[#AEAEB2]">Pending</span>;
                      if (playerData.status === 'submitted') return <span className="text-[10px] font-semibold text-[#34C759]">Submitted ✓</span>;
                      return (
                        <div className="flex gap-1 flex-wrap">
                          {playerData.display.map((pick, pIdx) => (
                            <span key={pIdx} title={pick.name}
                              className={`px-1.5 py-0.5 rounded text-[13px] bg-[#F2F2F7] flex items-center gap-0.5 ${pick.isArmband ? 'ring-1 ring-[#FF9500]' : ''}`}>
                              {pick.flag}{pick.isArmband && <span className="text-[9px] text-[#FF9500] font-black">Ⓒ</span>}
                            </span>
                          ))}
                        </div>
                      );
                    };

                    return (
                      <div key={index}
                        className={`border rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden transition-all ${isUserMatch ? 'border-[#007AFF] bg-[#007AFF]/5 ring-1 ring-[#007AFF]/20' : 'border-[#E5E5EA] bg-white hover:border-[#D1D1D6]'}`}>
                        {isUserMatch && <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#007AFF]" />}

                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black tracking-wider text-[#8E8E93] uppercase font-mono">
                            Match {index+1}{isUserMatch && ' • YOUR MATCH'}
                          </span>
                          {isUserMatch && <span className="bg-[#007AFF] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Live</span>}
                        </div>

                        {/* P1 row */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p1name===currentUser ? 'bg-[#007AFF]' : 'bg-transparent'}`} />
                            <p className={`text-xs truncate ${p1name===currentUser ? 'font-bold' : 'font-medium'}`}>{p1name}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {renderPicks(p1data, p1forfeited)}
                            <span className="font-mono text-sm font-bold text-[#1C1C1E] min-w-[20px] text-right">{score1!==null ? score1 : '—'}</span>
                          </div>
                        </div>

                        <div className="h-[1px] bg-[#F2F2F7]" />

                        {/* P2 row */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p2name===currentUser ? 'bg-[#007AFF]' : 'bg-transparent'}`} />
                            <p className={`text-xs truncate ${p2name===currentUser ? 'font-bold' : 'font-medium'}`}>{p2name}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {renderPicks(p2data, p2forfeited)}
                            <span className="font-mono text-sm font-bold text-[#1C1C1E] min-w-[20px] text-right">{score2!==null ? score2 : '—'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* League table */}
            <section className="bg-white rounded-2xl border border-[#E5E5EA] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="p-4 bg-white border-b border-[#E5E5EA]">
                <h3 className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">Official Tournament Standings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F2F2F7] text-[#636366] text-[10px] font-bold uppercase tracking-wider border-b border-[#E5E5EA]">
                      <th className="py-2.5 px-4 text-center w-12">Pos</th>
                      <th className="py-2.5 px-4">Manager</th>
                      <th className="py-2.5 px-4 text-center">P</th>
                      <th className="py-2.5 px-4 text-center">W</th>
                      <th className="py-2.5 px-4 text-center">D</th>
                      <th className="py-2.5 px-4 text-center">L</th>
                      <th className="py-2.5 px-4 text-center font-bold text-[#1C1C1E]">League Pts</th>
                      <th className="py-2.5 px-4 text-center text-[#8E8E93]">GW Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5EA] text-xs font-medium text-[#1C1C1E]">
                    {leagueTable.map((row, idx) => (
                      <tr key={row.name} className={`hover:bg-[#F2F2F7]/40 ${row.name===currentUser ? 'bg-[#007AFF]/5 font-semibold' : ''}`}>
                        <td className="py-3 px-4 text-center font-mono font-bold text-[#636366]">{idx+1}</td>
                        <td className="py-3 px-4 font-bold">
                          <div className="flex items-center gap-1.5">
                            {row.name}
                            {row.name===currentUser && <span className="bg-[#007AFF] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">YOU</span>}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-[#636366]">{row.played}</td>
                        <td className="py-3 px-4 text-center font-mono text-[#34C759]">{row.w}</td>
                        <td className="py-3 px-4 text-center font-mono text-[#8E8E93]">{row.d}</td>
                        <td className="py-3 px-4 text-center font-mono text-[#FF3B30]">{row.l}</td>
                        <td className="py-3 px-4 text-center font-mono font-black text-sm text-[#007AFF]">{row.h2hPts}</td>
                        <td className="py-3 px-4 text-center font-mono text-[#636366]">{row.totalScore} pts · <span className="text-gray-400">{row.winsSelected}W</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            ADMIN (Jason only)
        ════════════════════════════════════════════════ */}
        {currentTab === 'admin' && isAdmin && (
          <div className="space-y-6">

            {/* Round selector */}
            <div className="flex gap-1 flex-wrap">
              {ROUNDS.map(gw => (
                <button key={gw} onClick={() => setActiveRound(gw)}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${activeRound===gw ? 'bg-[#007AFF] text-white' : 'bg-white border border-[#E5E5EA] text-[#636366] hover:bg-[#F2F2F7]'}`}>
                  {gw}
                </button>
              ))}
            </div>

            {/* Submission status */}
            <section className="bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <h3 className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider mb-4">Submission Status — {activeRound}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ALL_PLAYERS.map(player => {
                  const submitted = !!(allPicks?.[activeRound]?.[player]?.picks?.length);
                  const picks     = allPicks?.[activeRound]?.[player]?.picks ?? [];
                  const gwDead    = GW_DEADLINES[activeRound] ?? 0;
                  const isForfeit = !submitted && Date.now() >= gwDead;
                  return (
                    <div key={player}
                      className={`flex items-center justify-between p-3 rounded-xl border ${submitted ? 'border-[#34C759]/30 bg-[#34C759]/5' : isForfeit ? 'border-[#FF3B30]/30 bg-[#FF3B30]/5' : 'border-[#E5E5EA] bg-[#F2F2F7]/50'}`}>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${submitted ? 'text-[#34C759]' : isForfeit ? 'text-[#FF3B30]' : 'text-[#AEAEB2]'}`}>
                          {submitted ? '✓' : isForfeit ? '✗' : '○'}
                        </span>
                        <span className="text-xs font-semibold text-[#1C1C1E]">{player}</span>
                      </div>
                      {submitted ? (
                        <div className="flex items-center gap-1">
                          {picks.map((pick, pIdx) => (
                            <span key={pIdx} title={pick.name} className={`text-base ${pick.isArmband ? 'ring-1 ring-[#FF9500] rounded' : ''}`}>
                              {pick.flag}{pick.isArmband && <span className="text-[9px] text-[#FF9500]">Ⓒ</span>}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className={`text-[10px] font-bold ${isForfeit ? 'text-[#FF3B30]' : 'text-[#AEAEB2]'}`}>
                          {isForfeit ? 'FORFEIT' : 'Not yet submitted'}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Results entry */}
            <section className="bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <h3 className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider mb-1">Enter Match Results — {activeRound}</h3>
              <p className="text-[11px] text-[#8E8E93] mb-4">Set W/D/L for each nation then click Calculate.</p>

              {(MATCH_FIXTURES_POOL[activeRound] ?? []).length === 0 ? (
                <p className="text-xs text-[#8E8E93] italic">No fixtures defined for this round yet.</p>
              ) : (
                <div className="space-y-2">
                  {(MATCH_FIXTURES_POOL[activeRound] ?? []).map(match => (
                    <div key={match.id} className="p-3 bg-[#F2F2F7]/50 rounded-xl border border-[#E5E5EA]">
                      <div className="flex flex-col sm:flex-row gap-2">
                        {[match.home, match.away].map(nation => (
                          <div key={nation.id} className="flex items-center gap-2 flex-1">
                            <span className="text-xl">{nation.flag}</span>
                            <span className="text-xs font-semibold text-[#1C1C1E] flex-1 truncate">{nation.name}</span>
                            <div className="flex gap-1">
                              {['W','D','L'].map(r => (
                                <button key={r} onClick={() => setRoundResults(prev => ({...prev,[nation.id]:r}))}
                                  className={`w-8 h-8 rounded-lg text-[11px] font-black transition-all border ${
                                    roundResults[nation.id] === r
                                      ? r==='W' ? 'bg-[#34C759] text-white border-[#34C759]'
                                        : r==='D' ? 'bg-[#FF9500] text-white border-[#FF9500]'
                                        : 'bg-[#FF3B30] text-white border-[#FF3B30]'
                                      : 'bg-white border-[#E5E5EA] text-[#636366] hover:bg-[#E5E5EA]'
                                  }`}>
                                  {r}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={handleCalculateRound} disabled={isCalculating}
                className="mt-5 w-full py-3 bg-[#007AFF] text-white rounded-xl font-bold text-sm transition-all hover:bg-[#0062CC] disabled:opacity-50 flex items-center justify-center gap-2">
                {isCalculating ? '⚙️ Calculating...' : `⚽ Calculate ${activeRound} & Update League Table`}
              </button>
            </section>

          </div>
        )}

      </main>
    </div>
  );
}
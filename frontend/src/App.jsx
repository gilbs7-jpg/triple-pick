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
  GW2: new Date('2026-06-18T15:00:00Z').getTime(),
  GW3: new Date('2026-06-24T19:00:00Z').getTime(),
  GW4: new Date('2026-06-28T16:00:00Z').getTime(),
  GW5: new Date('2026-07-04T15:00:00Z').getTime(),
  GW6: new Date('2026-07-08T19:00:00Z').getTime(),
  GW7: new Date('2026-07-12T19:00:00Z').getTime(),
};

// Maps GW round to football-data.org matchday number
const GW_TO_MATCHDAY = {
  GW1: 1, GW2: 2, GW3: 3,   // Group stage MD1-3
  GW4: 4,                     // Round of 16
  GW5: 5,                     // Quarter-finals
  GW6: 6,                     // Semi-finals
  GW7: 7,                     // Final
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
  GW2: [
    { id:'g2_1',  home:{id:'cze',name:'Czechia',      flag:'🇨🇿'}, away:{id:'rsa',name:'South Africa', flag:'🇿🇦'}, date:'Thu, 18 June', time:'17:00 BST'},
    { id:'g2_2',  home:{id:'sui',name:'Switzerland',  flag:'🇨🇭'}, away:{id:'bih',name:'Bosnia & Herz.',flag:'🇧🇦'}, date:'Thu, 18 June', time:'20:00 BST'},
    { id:'g2_3',  home:{id:'can',name:'Canada',       flag:'🇨🇦'}, away:{id:'qat',name:'Qatar',        flag:'🇶🇦'}, date:'Thu, 18 June', time:'23:00 BST'},
    { id:'g2_4',  home:{id:'mex',name:'Mexico',       flag:'🇲🇽'}, away:{id:'kor',name:'South Korea',  flag:'🇰🇷'}, date:'Fri, 19 June', time:'02:00 BST'},
    { id:'g2_5',  home:{id:'usa',name:'USA',          flag:'🇺🇸'}, away:{id:'aus',name:'Australia',    flag:'🇦🇺'}, date:'Fri, 19 June', time:'20:00 BST'},
    { id:'g2_6',  home:{id:'sco',name:'Scotland',     flag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿'}, away:{id:'mar',name:'Morocco',      flag:'🇲🇦'}, date:'Fri, 19 June', time:'23:00 BST'},
    { id:'g2_7',  home:{id:'bra',name:'Brazil',       flag:'🇧🇷'}, away:{id:'hai',name:'Haiti',        flag:'🇭🇹'}, date:'Sat, 20 June', time:'01:30 BST'},
    { id:'g2_8',  home:{id:'tur',name:'Türkiye',      flag:'🇹🇷'}, away:{id:'par',name:'Paraguay',     flag:'🇵🇾'}, date:'Sat, 20 June', time:'05:00 BST'},
    { id:'g2_9',  home:{id:'ned',name:'Netherlands',  flag:'🇳🇱'}, away:{id:'swe',name:'Sweden',       flag:'🇸🇪'}, date:'Sat, 20 June', time:'18:00 BST'},
    { id:'g2_10', home:{id:'ger',name:'Germany',      flag:'🇩🇪'}, away:{id:'civ',name:'Ivory Coast',  flag:'🇨🇮'}, date:'Sat, 20 June', time:'21:00 BST'},
    { id:'g2_11', home:{id:'ecu',name:'Ecuador',      flag:'🇪🇨'}, away:{id:'cuw',name:'Curaçao',      flag:'🇨🇼'}, date:'Sun, 21 June', time:'01:00 BST'},
    { id:'g2_12', home:{id:'tun',name:'Tunisia',      flag:'🇹🇳'}, away:{id:'jpn',name:'Japan',        flag:'🇯🇵'}, date:'Sun, 21 June', time:'05:00 BST'},
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
['GW3','GW5','GW6','GW7'].forEach(gw => { if (!MATCH_FIXTURES_POOL[gw]) MATCH_FIXTURES_POOL[gw] = []; });

// ── TLA → our nation ID mapping ───────────────────────────────────────────────
// football-data.org uses TLA codes; we map them to our internal ids
const TLA_TO_ID = {
  mex:'mex', rsa:'rsa', kor:'kor', cze:'cze', can:'can', bih:'bih',
  usa:'usa', par:'par', qat:'qat', sui:'sui', bra:'bra', mar:'mar',
  hai:'hai', sco:'sco', aus:'aus', tur:'tur', ger:'ger', cuw:'cuw',
  ned:'ned', jpn:'jpn', civ:'civ', ecu:'ecu', swe:'swe', tun:'tun',
  // GW4+
  arg:'arg', fra:'fra', eng:'eng', esp:'esp', por:'por', cro:'cro',
};

// ── SCORING ENGINE ────────────────────────────────────────────────────────────
function basePoints(result) {
  if (result === 'W') return 3;
  if (result === 'D') return 1;
  return 0;
}

function calcPlayerScore(picks, results) {
  if (!picks || picks.length === 0) return null;
  return picks.reduce((sum, pick) => {
    const result = results?.[pick.id] ?? null;
    let pts = basePoints(result);
    if (pick.isArmband && result === 'W') pts += 1;
    return sum + pts;
  }, 0);
}

// Returns true if this player's nominated captain pick resulted in a win.
// Used to award the +1 league point bonus independently of the H2H result —
// the bonus applies even if the player loses their fixture.
function captainWon(picks, results) {
  if (!picks || picks.length === 0) return false;
  const captainPick = picks.find(p => p.isArmband);
  if (!captainPick) return false;
  return (results?.[captainPick.id] ?? null) === 'W';
}

function calcRoundH2H(allPicks, results, gwKey) {
  const fixtures = H2H_FIXTURES[gwKey] || [];
  const out = {};
  fixtures.forEach(([p1, p2]) => {
    const picks1 = allPicks?.[gwKey]?.[p1]?.picks ?? null;
    const picks2 = allPicks?.[gwKey]?.[p2]?.picks ?? null;
    const score1 = calcPlayerScore(picks1, results);
    const score2 = calcPlayerScore(picks2, results);
    const f1 = score1 === null, f2 = score2 === null;
    let h1 = 0, h2 = 0;
    // outcome = the fixture result before any captain bonus ('W'|'D'|'L')
    let o1 = 'L', o2 = 'L';
    if (!f1 && !f2) {
      if (score1 > score2)      { h1=3; o1='W'; o2='L'; }
      else if (score2 > score1) { h2=3; o1='L'; o2='W'; }
      else                      { h1=1; h2=1; o1='D'; o2='D'; }
    }
    else if (f1 && !f2) { h2=3; o1='L'; o2='W'; }
    else if (!f1 && f2) { h1=3; o1='W'; o2='L'; }
    // Captain bonus: +1 league point if this player's captain pick won,
    // regardless of the fixture outcome (carries through even on a loss).
    // The bonus affects league points only — NOT the W/D/L fixture record.
    if (!f1 && captainWon(picks1, results)) h1 += 1;
    if (!f2 && captainWon(picks2, results)) h2 += 1;
    out[p1] = { h2hPts:h1, score:score1??0, forfeited:f1, outcome:o1 };
    out[p2] = { h2hPts:h2, score:score2??0, forfeited:f2, outcome:o2 };
  });
  return out;
}

function buildLeagueTable(allPicks, allResults) {
  const table = {};
  ALL_PLAYERS.forEach(p => { table[p] = {name:p,played:0,w:0,d:0,l:0,h2hPts:0,totalScore:0,winsSelected:0}; });
  ROUNDS.forEach(gw => {
    const results = allResults?.[gw];
    if (!results) return;
    const h2h = calcRoundH2H(allPicks, results, gw);
    Object.entries(h2h).forEach(([player, data]) => {
      if (!table[player]) return;
      table[player].played++;
      table[player].h2hPts    += data.h2hPts;
      table[player].totalScore += data.score;
      // W/D/L is based on the fixture outcome, not league points
      // (which now include the captain bonus and can be 2 or 4)
      if (data.outcome==='W') table[player].w++;
      else if (data.outcome==='D') table[player].d++;
      else table[player].l++;
      (allPicks?.[gw]?.[player]?.picks ?? []).forEach(pick => {
        if (results[pick.id]==='W') table[player].winsSelected++;
      });
    });
  });
  return Object.values(table).sort((a,b) => b.h2hPts-a.h2hPts || b.totalScore-a.totalScore || b.winsSelected-a.winsSelected);
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [currentTab,     setCurrentTab]     = useState('picks');
  const [activeRound,    setActiveRound]    = useState('GW1');
  const [currentUser,    setCurrentUser]    = useState(null);
  const [invalidUser,    setInvalidUser]    = useState(false);
  const [showRules,      setShowRules]      = useState(false);
  const [exampleStep,    setExampleStep]    = useState(1);
  const [selectedSlot,   setSelectedSlot]   = useState(0);
  const [selections,     setSelections]     = useState([null,null,null]);
  const [armbandSlot,    setArmbandSlot]    = useState(0);
  const [isFormLocked,   setIsFormLocked]   = useState(false);
  const [isLoadingPicks, setIsLoadingPicks] = useState(false);
  const [isSaving,       setIsSaving]       = useState(false);
  const [timeLeft,       setTimeLeft]       = useState({days:0,hours:0,minutes:0,seconds:0});

  const [allPicks,       setAllPicks]       = useState({});
  const [allResults,     setAllResults]     = useState({});
  const [leagueTable,    setLeagueTable]    = useState([]);
  const [isLoadingData,  setIsLoadingData]  = useState(true);

  // Admin state
  const [roundResults,   setRoundResults]   = useState({});
  const [isCalculating,  setIsCalculating]  = useState(false);
  const [isFetchingAPI,  setIsFetchingAPI]  = useState(false);
  const [fetchStatus,    setFetchStatus]    = useState(null); // null | 'success' | 'error'
  const [fetchMessage,   setFetchMessage]   = useState('');

  const isAdmin        = currentUser === ADMIN_USER;
  const deadline       = GW_DEADLINES[activeRound] ?? GW_DEADLINES.GW1;
  const deadlinePassed = Date.now() >= deadline;

  // ── URL param → user ──────────────────────────────────────────────────────
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('player');
    if (p && PLAYER_SLUGS[p])  { setCurrentUser(PLAYER_SLUGS[p]); }
    else if (!p)                { setCurrentUser(PLAYER_SLUGS['you']); }
    else                        { setInvalidUser(true); }
  }, []);

  // ── Load all data ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentUser) return;
    async function loadAll() {
      setIsLoadingData(true);
      try {
        const [pr, sr] = await Promise.all([
          fetch(PICKS_URL, {headers:{'X-Master-Key':JSONBIN_API_KEY}}),
          fetch(STATE_URL, {headers:{'X-Master-Key':JSONBIN_API_KEY}}),
        ]);
        const pd = await pr.json();
        const sd = await sr.json();
        const picks   = pd.record?.playerPicks ?? {};
        const results = sd.record?.results      ?? {};
        setAllPicks(picks);
        setAllResults(results);
        setLeagueTable(buildLeagueTable(picks, results));
        const my = picks?.[activeRound]?.[currentUser];
        if (my?.picks?.length === 3) {
          setSelections(my.picks.map(p => ({id:p.id,name:p.name,flag:p.flag})));
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

  // ── Re-restore picks on round change ─────────────────────────────────────
  useEffect(() => {
    if (!currentUser || isLoadingData) return;
    const my = allPicks?.[activeRound]?.[currentUser];
    if (my?.picks?.length === 3) {
      setSelections(my.picks.map(p => ({id:p.id,name:p.name,flag:p.flag})));
      const ab = my.picks.findIndex(p => p.isArmband);
      setArmbandSlot(ab !== -1 ? ab : 0);
      setIsFormLocked(true);
    } else {
      setSelections([null,null,null]);
      setArmbandSlot(0);
      setIsFormLocked(false);
    }
    setRoundResults(allResults?.[activeRound] ?? {});
    setFetchStatus(null);
    setFetchMessage('');
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

  // ── Admin: fetch results from API ─────────────────────────────────────────
  const handleFetchFromAPI = async () => {
    const matchday = GW_TO_MATCHDAY[activeRound];
    if (!matchday) {
      setFetchStatus('error');
      setFetchMessage('No matchday mapping for this round.');
      return;
    }
    try {
      setIsFetchingAPI(true);
      setFetchStatus(null);
      setFetchMessage('');

      const res  = await fetch(`/api/results?matchday=${matchday}`);
      const data = await res.json();

      if (!res.ok) {
        setFetchStatus('error');
        setFetchMessage(data.error || 'API fetch failed.');
        return;
      }

      if (!data.matches || data.matches.length === 0) {
        setFetchStatus('error');
        setFetchMessage('No matches returned for this matchday. Matches may not have started yet.');
        return;
      }

      // Build results map: { nationId: 'W'|'D'|'L' }
      const fetched = {};
      let mapped = 0;
      data.matches.forEach(match => {
        const homeId = TLA_TO_ID[match.homeTeam.id];
        const awayId = TLA_TO_ID[match.awayTeam.id];
        if (homeId && match.homeResult) { fetched[homeId] = match.homeResult; mapped++; }
        if (awayId && match.awayResult) { fetched[awayId] = match.awayResult; mapped++; }
      });

      const total    = data.matches.length;
      const finished = data.matches.filter(m => m.status === 'FINISHED').length;
      const pending  = total - finished;

      // Merge with any existing manual entries — API takes priority for finished matches
      setRoundResults(prev => ({ ...prev, ...fetched }));

      setFetchStatus('success');
      setFetchMessage(
        `Fetched ${total} matches — ${finished} finished, ${pending} pending. ` +
        `${mapped} nation results populated. Review below then click Calculate.`
      );
    } catch(e) {
      setFetchStatus('error');
      setFetchMessage(`Fetch error: ${e.message}`);
    } finally {
      setIsFetchingAPI(false);
    }
  };

  // ── Admin: calculate round ────────────────────────────────────────────────
  const handleCalculateRound = async () => {
    if (Object.keys(roundResults).length === 0) { alert('No results to calculate. Fetch from API or enter manually first.'); return; }
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
      alert(`✅ ${activeRound} calculated and league table updated!`);
    } catch(e) {
      console.error(e);
      alert('Calculation failed — check console.');
    } finally {
      setIsCalculating(false);
    }
  };

  // ── Share picks ──────────────────────────────────────────────────────────
  const handleSharePicks = async () => {
    // Find this player's H2H opponent for the active round
    const fixture = (H2H_FIXTURES[activeRound] || []).find(
      ([p1, p2]) => p1 === currentUser || p2 === currentUser
    );
    const opponent = fixture
      ? fixture[0] === currentUser ? fixture[1] : fixture[0]
      : null;

    const flags = selections.map((s, idx) => {
      if (!s) return '';
      return armbandSlot === idx ? `${s.flag}Ⓒ` : s.flag;
    }).join(' ');

    const opponentLine = opponent ? `\nFacing ${opponent} this round — bring it on! 👊` : '';
    const text = `⚽ My Triple Pick World Cup '26 picks for ${activeRound}:\n${flags}${opponentLine}\n\nPlay at: https://triple-pick.vercel.app`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Triple Pick World Cup \'26', text });
      } catch (e) {
        // User cancelled — do nothing
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard — paste into WhatsApp, Facebook or X!');
    }
  };

  // ── Pick helpers ──────────────────────────────────────────────────────────
  const historicalUsage = {};
  const getUsageMetrics = (teamId) => (historicalUsage[teamId]||0) + selections.filter(s => s?.id===teamId).length;

  const handleSelectNation = (nation) => {
    if (isFormLocked) return;
    const dup = selections.findIndex(s => s?.id===nation.id);
    if (dup !== -1 && dup !== selectedSlot) return;
    if (getUsageMetrics(nation.id) >= 2 && selections[selectedSlot]?.id !== nation.id) {
      alert(`${nation.name} has reached the 2-cap limit.`); return;
    }
    const updated = [...selections];
    updated[selectedSlot] = nation;
    setSelections(updated);
    if (selectedSlot < 2 && !updated[selectedSlot+1]) setSelectedSlot(selectedSlot+1);
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
    const saved      = allPicks?.[gw]?.[playerName];
    const gwDead     = GW_DEADLINES[gw] ?? GW_DEADLINES.GW1;
    const roundClosed = Date.now() >= gwDead;
    const isJason    = currentUser === ADMIN_USER;
    if (!saved?.picks?.length) return {status:'pending', display:null};
    if (!roundClosed && !isJason) return {status:'submitted', display:null};
    return {status:'revealed', display:saved.picks};
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
        <div className="w-12 h-12 bg-[#FF3B30]/10 rounded-full flex items-center justify-center mx-auto text-xl">⚠️</div>
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

        {/* ════════ STRATEGY DESK ════════ */}
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
                  <p className="text-xs font-semibold text-[#34C759]">Picks locked and saved. Click the green button to edit before the deadline.</p>
                </div>
              )}
              {isLoadingPicks && (
                <div className="mb-4 px-3 py-2 bg-[#007AFF]/10 border border-[#007AFF]/20 rounded-xl">
                  <p className="text-xs font-mono text-[#007AFF] animate-pulse">Checking for existing picks...</p>
                </div>
              )}

              <div className="flex gap-1 mb-4 flex-wrap">
                {ROUNDS.map(gw => (
                  <button key={gw} onClick={() => setActiveRound(gw)}
                    className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${activeRound===gw ? 'bg-[#007AFF] text-white' : 'bg-[#F2F2F7] text-[#636366] hover:bg-[#E5E5EA]'}`}>
                    {gw}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {selections.map((nation, idx) => {
                  const isActive  = selectedSlot===idx;
                  const isArmband = armbandSlot===idx;
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
                        ) : <p className="text-xs italic text-[#AEAEB2] font-medium">Click to assign team...</p>}
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

              <button disabled={isSaving||deadlinePassed} onClick={handleFinalizeAndSave}
                className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${isFormLocked ? 'bg-[#34C759] text-white hover:bg-[#28a745]' : 'bg-[#1C1C1E] text-white hover:bg-black disabled:opacity-50'}`}>
                {isSaving ? <span className="animate-pulse">🌐 Syncing...</span>
                  : isFormLocked ? '🔓 Reopen Sheets for Adjustments'
                  : '🔒 Finalize Sheet Configuration'}
              </button>

              {/* Share button — only shown once picks are locked */}
              {isFormLocked && selections.every(s => s !== null) && (
                <button onClick={handleSharePicks}
                  className="w-full mt-2 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 bg-[#F2F2F7] text-[#1C1C1E] hover:bg-[#E5E5EA] border border-[#E5E5EA]">
                  📣 Share My Picks
                </button>
              )}
            </section>

            {/* Rules */}
            <section className="bg-white rounded-2xl border border-[#E5E5EA] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
              <button onClick={() => setShowRules(!showRules)}
                className="w-full p-4 flex justify-between items-center bg-[#F2F2F7]/50 hover:bg-[#F2F2F7] transition-all text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm">📜</span>
                  <h3 className="text-xs font-black text-[#1C1C1E] uppercase tracking-wider">Rules of the Beautiful Game</h3>
                </div>
                <span className="text-xs font-bold text-[#007AFF]">{showRules ? 'Hide ▲' : 'Show ▼'}</span>
              </button>
              {showRules && (
                <div className="p-5 border-t border-[#E5E5EA] bg-white space-y-4 text-xs text-[#636366] leading-relaxed">
                  <div><h4 className="font-bold text-[#1C1C1E] mb-1">1. Triple Pick</h4><p>Select exactly 3 nations from the active match pool each round.</p></div>
                  <div><h4 className="font-bold text-[#1C1C1E] mb-1">2. 2-Cap Limit</h4><p>Any nation can only be selected <span className="font-bold text-black">up to 2 times</span> across the entire tournament.</p></div>
                  <div><h4 className="font-bold text-[#1C1C1E] mb-1">3. Armband Ⓒ</h4><p>Nominate one pick as captain. If that nation <strong>wins</strong>, you earn a <span className="font-bold text-[#34C759]">+1 bonus point</span> toward your gameweek score. A draw does not trigger the bonus.</p></div>
                  <div><h4 className="font-bold text-[#1C1C1E] mb-1">4. Head-to-Head</h4>
                    <p className="mb-1">Your gameweek score is compared against your opponent's to decide the fixture:</p>
                    <ul className="list-disc list-inside mt-1 ml-2 space-y-0.5 font-mono text-[11px]">
                      <li><span className="font-bold text-[#34C759]">3 pts</span> — Win &nbsp;<span className="font-bold text-[#8E8E93]">1 pt</span> — Draw &nbsp;<span className="font-bold text-[#FF3B30]">0 pts</span> — Loss</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1C1C1E] mb-1">5. Captain bonus league point</h4>
                    <p className="mb-2">If your Armband captain <strong>wins their match</strong>, you get an extra <span className="font-bold text-[#34C759]">+1 league point</span> &#8212; on top of whatever you earned from the fixture result. This applies <strong>even if you lose your fixture.</strong></p>
                    <div className="bg-[#F2F2F7] rounded-lg overflow-hidden">
                      <table className="w-full text-[11px] font-mono">
                        <thead>
                          <tr className="text-[#8E8E93] border-b border-[#E5E5EA]">
                            <th className="text-left py-1.5 px-2 font-bold">Fixture</th>
                            <th className="text-left py-1.5 px-2 font-bold">Captain</th>
                            <th className="text-right py-1.5 px-2 font-bold">League pts</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[#E5E5EA]"><td className="py-1.5 px-2">Win</td><td className="py-1.5 px-2">Wins</td><td className="text-right py-1.5 px-2 font-bold text-[#34C759]">3 + 1 = 4</td></tr>
                          <tr className="border-b border-[#E5E5EA]"><td className="py-1.5 px-2">Win</td><td className="py-1.5 px-2">Doesn't win</td><td className="text-right py-1.5 px-2">3</td></tr>
                          <tr className="border-b border-[#E5E5EA]"><td className="py-1.5 px-2">Draw</td><td className="py-1.5 px-2">Wins</td><td className="text-right py-1.5 px-2 font-bold text-[#34C759]">1 + 1 = 2</td></tr>
                          <tr className="border-b border-[#E5E5EA]"><td className="py-1.5 px-2">Loss</td><td className="py-1.5 px-2">Wins</td><td className="text-right py-1.5 px-2 font-bold text-[#34C759]">0 + 1 = 1</td></tr>
                          <tr><td className="py-1.5 px-2">Loss</td><td className="py-1.5 px-2">Doesn't win</td><td className="text-right py-1.5 px-2">0</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Interactive worked example */}
                  <div>
                    <h4 className="font-bold text-[#1C1C1E] mb-2">Worked example</h4>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-bold text-[#8E8E93] uppercase">Step</span>
                      <input type="range" min="1" max="4" step="1" value={exampleStep}
                        onChange={(e) => setExampleStep(parseInt(e.target.value))}
                        className="flex-1 accent-[#007AFF]" />
                      <span className="text-[11px] font-bold text-[#007AFF] min-w-[88px] text-right">
                        {exampleStep===1 && '1. The picks'}
                        {exampleStep===2 && '2. GW score'}
                        {exampleStep===3 && '3. The fixture'}
                        {exampleStep===4 && '4. League pts'}
                      </span>
                    </div>

                    {exampleStep === 1 && (
                      <div>
                        <p className="mb-2">Each player picks 3 nations. One is nominated Armband captain (Ⓒ).</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="bg-white border border-[#E5E5EA] rounded-xl p-3">
                            <p className="font-bold text-[#1C1C1E] mb-2">Jason</p>
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2"><span className="text-lg">🇺🇸</span><span>USA</span></div>
                              <div className="flex items-center gap-2"><span className="text-lg">🇩🇪</span><span>Germany</span><span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FF9500]/10 text-[#FF9500] font-bold">Ⓒ</span></div>
                              <div className="flex items-center gap-2"><span className="text-lg">🇧🇷</span><span>Brazil</span></div>
                            </div>
                          </div>
                          <div className="bg-white border border-[#E5E5EA] rounded-xl p-3">
                            <p className="font-bold text-[#1C1C1E] mb-2">Gemma</p>
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2"><span className="text-lg">🇦🇺</span><span>Australia</span><span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FF9500]/10 text-[#FF9500] font-bold">Ⓒ</span></div>
                              <div className="flex items-center gap-2"><span className="text-lg">🇧🇷</span><span>Brazil</span></div>
                              <div className="flex items-center gap-2"><span className="text-lg">🇭🇹</span><span>Haiti</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {exampleStep === 2 && (
                      <div>
                        <p className="mb-2">Each result earns points: Win = 3, Draw = 1, Loss = 0. The captain Ⓒ adds +1 to the gameweek score if their nation wins.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="bg-white border border-[#E5E5EA] rounded-xl p-3">
                            <p className="font-bold text-[#1C1C1E] mb-2">Jason</p>
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="text-lg">🇺🇸</span><span>USA</span><span className="text-[#AEAEB2]">Won</span></div><span className="font-bold">3</span></div>
                              <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="text-lg">🇩🇪</span><span>Germany</span><span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FF9500]/10 text-[#FF9500] font-bold">Ⓒ</span><span className="text-[#AEAEB2]">Won</span></div><span className="font-bold">3+1</span></div>
                              <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="text-lg">🇧🇷</span><span>Brazil</span><span className="text-[#AEAEB2]">Drew</span></div><span className="font-bold">1</span></div>
                            </div>
                            <div className="border-t border-dashed border-[#E5E5EA] mt-2 pt-2 flex justify-between items-baseline">
                              <span className="text-[#8E8E93]">Gameweek score</span><span className="text-lg font-bold text-[#1C1C1E]">8</span>
                            </div>
                          </div>
                          <div className="bg-white border border-[#E5E5EA] rounded-xl p-3">
                            <p className="font-bold text-[#1C1C1E] mb-2">Gemma</p>
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="text-lg">🇦🇺</span><span>Australia</span><span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FF9500]/10 text-[#FF9500] font-bold">Ⓒ</span><span className="text-[#AEAEB2]">Won</span></div><span className="font-bold">3+1</span></div>
                              <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="text-lg">🇧🇷</span><span>Brazil</span><span className="text-[#AEAEB2]">Drew</span></div><span className="font-bold">1</span></div>
                              <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="text-lg">🇭🇹</span><span>Haiti</span><span className="text-[#AEAEB2]">Lost</span></div><span className="font-bold">0</span></div>
                            </div>
                            <div className="border-t border-dashed border-[#E5E5EA] mt-2 pt-2 flex justify-between items-baseline">
                              <span className="text-[#8E8E93]">Gameweek score</span><span className="text-lg font-bold text-[#1C1C1E]">5</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-[11px] text-[#AEAEB2] mt-2">Jason scores 8, Gemma scores 5 &#8212; Jason has the higher gameweek score this round.</p>
                      </div>
                    )}

                    {exampleStep === 3 && (
                      <div>
                        <p className="mb-2">Jason and Gemma are head-to-head opponents this round. The higher gameweek score wins the fixture.</p>
                        <div className="bg-white border border-[#E5E5EA] rounded-xl p-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-[#1C1C1E]">Jason</span>
                            <span className="text-2xl font-bold">8</span>
                          </div>
                          <div className="text-center text-[#AEAEB2] my-1">vs</div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-[#1C1C1E]">Gemma</span>
                            <span className="text-2xl font-bold">5</span>
                          </div>
                          <div className="border-t border-[#E5E5EA] pt-2 flex items-center gap-2">
                            <span className="text-[#34C759]">🏆</span>
                            <span>Jason wins the fixture &#8212; 8 beats 5. Gemma loses.</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {exampleStep === 4 && (
                      <div>
                        <p className="mb-2">League points combine the fixture result with each player's captain bonus &#8212; calculated independently, then added together.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                          <div className="bg-[#F2F2F7] rounded-lg p-3">
                            <p className="text-[#8E8E93] mb-1">Jason &#8212; won fixture</p>
                            <div className="flex items-baseline gap-1.5"><span className="text-[#8E8E93]">Fixture win</span><span className="font-bold">3</span></div>
                            <div className="flex items-baseline gap-1.5"><span className="text-[#8E8E93]">Captain Ⓒ won</span><span className="font-bold">+1</span></div>
                            <div className="border-t border-[#E5E5EA] mt-1.5 pt-1.5">
                              <span className="text-xl font-bold">4</span> <span className="text-[#8E8E93]">league pts</span>
                            </div>
                          </div>
                          <div className="bg-[#F2F2F7] rounded-lg p-3">
                            <p className="text-[#8E8E93] mb-1">Gemma &#8212; lost fixture</p>
                            <div className="flex items-baseline gap-1.5"><span className="text-[#8E8E93]">Fixture loss</span><span className="font-bold">0</span></div>
                            <div className="flex items-baseline gap-1.5"><span className="text-[#8E8E93]">Captain Ⓒ won</span><span className="font-bold">+1</span></div>
                            <div className="border-t border-[#E5E5EA] mt-1.5 pt-1.5">
                              <span className="text-xl font-bold text-[#34C759]">1</span> <span className="text-[#8E8E93]">league pt</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-[11px] text-[#AEAEB2]">Even though Gemma lost the fixture, her captain (Australia) won &#8212; so she still banks 1 league point. That bonus is hers regardless of the result.</p>
                      </div>
                    )}
                  </div>

                  <div><h4 className="font-bold text-[#1C1C1E] mb-1">6. Forfeit</h4><p>Miss the deadline and you score 0. Your opponent gets 3 league points automatically. No captain bonus is possible without picks.</p></div>
                  <div className="bg-[#F2F2F7] p-3 rounded-xl border border-[#E5E5EA]">
                    <span className="font-bold text-[#1C1C1E] block mb-0.5">⚠️ Deadline</span>
                    Picks lock 1 hour before the first match of each round. No changes after that.
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
                    const homeUsage = getUsageMetrics(match.home.id);
                    const awayUsage = getUsageMetrics(match.away.id);
                    const homeMaxed = homeUsage>=2 && !selections.some(s=>s?.id===match.home.id);
                    const awayMaxed = awayUsage>=2 && !selections.some(s=>s?.id===match.away.id);
                    const slotOwnsHome = selections[selectedSlot]?.id===match.home.id;
                    const slotOwnsAway = selections[selectedSlot]?.id===match.away.id;
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

        {/* ════════ ⚽ ARENA & STANDINGS ════════ */}
        {currentTab === 'league' && (
          <div className="space-y-6">
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
                  {(H2H_FIXTURES[activeRound]||[]).map(([p1name,p2name], index) => {
                    const isUserMatch  = p1name===currentUser || p2name===currentUser;
                    const gwDead       = GW_DEADLINES[activeRound] ?? GW_DEADLINES.GW1;
                    const roundClosed  = Date.now() >= gwDead;
                    const p1data = getPlayerPicksDisplay(p1name, activeRound);
                    const p2data = getPlayerPicksDisplay(p2name, activeRound);
                    const score1 = getPlayerScore(p1name, activeRound);
                    const score2 = getPlayerScore(p2name, activeRound);
                    const p1forfeited = roundClosed && !allPicks?.[activeRound]?.[p1name]?.picks?.length;
                    const p2forfeited = roundClosed && !allPicks?.[activeRound]?.[p2name]?.picks?.length;

                    const renderPicks = (pd, forfeited) => {
                      if (forfeited) return <span className="text-[10px] font-bold text-[#FF3B30] bg-[#FF3B30]/10 px-1.5 py-0.5 rounded">FORFEIT</span>;
                      if (pd.status==='pending')   return <span className="text-[10px] italic text-[#AEAEB2]">Pending</span>;
                      if (pd.status==='submitted') return <span className="text-[10px] font-semibold text-[#34C759]">Submitted ✓</span>;
                      return (
                        <div className="flex gap-1 flex-wrap">
                          {pd.display.map((pick,pIdx) => (
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
                          <span className="text-[9px] font-black tracking-wider text-[#8E8E93] uppercase font-mono">Match {index+1}{isUserMatch && ' • YOUR MATCH'}</span>
                          {isUserMatch && <span className="bg-[#007AFF] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Live</span>}
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p1name===currentUser ? 'bg-[#007AFF]' : 'bg-transparent'}`} />
                            <p className={`text-xs truncate ${p1name===currentUser ? 'font-bold' : 'font-medium'}`}>{p1name}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {renderPicks(p1data,p1forfeited)}
                            <span className="font-mono text-sm font-bold text-[#1C1C1E] min-w-[20px] text-right">{score1!==null?score1:'—'}</span>
                          </div>
                        </div>
                        <div className="h-[1px] bg-[#F2F2F7]" />
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p2name===currentUser ? 'bg-[#007AFF]' : 'bg-transparent'}`} />
                            <p className={`text-xs truncate ${p2name===currentUser ? 'font-bold' : 'font-medium'}`}>{p2name}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {renderPicks(p2data,p2forfeited)}
                            <span className="font-mono text-sm font-bold text-[#1C1C1E] min-w-[20px] text-right">{score2!==null?score2:'—'}</span>
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
              <div className="p-4 border-b border-[#E5E5EA]">
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
                    {leagueTable.map((row,idx) => (
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

        {/* ════════ ADMIN ════════ */}
        {currentTab === 'admin' && isAdmin && (
          <div className="space-y-6">

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
                  const isForfeit = !submitted && Date.now() >= (GW_DEADLINES[activeRound]??0);
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
                          {picks.map((pick,pIdx) => (
                            <span key={pIdx} title={pick.name} className={`text-base ${pick.isArmband ? 'ring-1 ring-[#FF9500] rounded px-0.5' : ''}`}>
                              {pick.flag}{pick.isArmband && <span className="text-[9px] text-[#FF9500]">Ⓒ</span>}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className={`text-[10px] font-bold ${isForfeit ? 'text-[#FF3B30]' : 'text-[#AEAEB2]'}`}>
                          {isForfeit ? 'FORFEIT' : 'Not submitted'}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Results entry + API fetch */}
            <section className="bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <h3 className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider mb-1">Match Results — {activeRound}</h3>
              <p className="text-[11px] text-[#8E8E93] mb-4">Fetch from the API after matches finish, review, then Calculate.</p>

              {/* API fetch button */}
              <button onClick={handleFetchFromAPI} disabled={isFetchingAPI}
                className="w-full mb-3 py-2.5 bg-[#5AC8FA] text-white rounded-xl font-bold text-xs transition-all hover:bg-[#32ADE6] disabled:opacity-50 flex items-center justify-center gap-2">
                {isFetchingAPI ? <span className="animate-pulse">🌐 Fetching from football-data.org...</span> : `🌐 Fetch Results from API (${activeRound})`}
              </button>

              {/* Fetch status message */}
              {fetchStatus && (
                <div className={`mb-4 p-3 rounded-xl border text-xs font-semibold ${fetchStatus==='success' ? 'bg-[#34C759]/10 border-[#34C759]/30 text-[#34C759]' : 'bg-[#FF3B30]/10 border-[#FF3B30]/30 text-[#FF3B30]'}`}>
                  {fetchStatus==='success' ? '✓ ' : '⚠️ '}{fetchMessage}
                </div>
              )}

              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-[1px] bg-[#E5E5EA]" />
                <span className="text-[10px] font-bold text-[#8E8E93] uppercase">or enter manually</span>
                <div className="flex-1 h-[1px] bg-[#E5E5EA]" />
              </div>

              {(MATCH_FIXTURES_POOL[activeRound]??[]).length === 0 ? (
                <p className="text-xs text-[#8E8E93] italic">No fixtures defined for this round yet.</p>
              ) : (
                <div className="space-y-2">
                  {(MATCH_FIXTURES_POOL[activeRound]??[]).map(match => (
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
                                    roundResults[nation.id]===r
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
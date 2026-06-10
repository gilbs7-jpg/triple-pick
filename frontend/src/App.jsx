import React, { useState, useEffect } from 'react';

// JSONBin Configuration Matrix
const JSONBIN_BIN_ID = "6a289e9dda38895dfea3718d";
const JSONBIN_API_KEY = "$2a$10$SM58O3uX4Dttskq/9geD5OytFCpgoclTLo8BWMo6gvk4QBQI5y9Ri"; 
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;
const ROUNDS = ['GW1', 'GW2', 'GW3', 'GW4', 'GW5', 'GW6', 'GW7'];

// Map URL safe slugs to the exact display names in your system
const PLAYER_SLUGS = {
  jona_m: 'Jona Moore',
  you: 'Jason Gilbert',        // Fixed typo: was 'Jason Gilber'
  adam_b: 'Adam Brand',
  jamie_b: 'Jamie Brown',
  richard_l: 'Richard Lee',
  lianne_c: 'Lianne Conway',
  mark_b: 'Mark Bentley',
  kieran_s: 'Kieran Smyth',
  amelia_a: 'Amelia Gilbert',  // Replaced lila_g / Lila Gilbert
  jack_g: 'Jack Gilbert'
};

const MATCH_FIXTURES_POOL = {
  GW1: [
    { id: 'g1_1', home: { id: 'mex', name: 'Mexico', flag: '🇲🇽' }, away: { id: 'rsa', name: 'South Africa', flag: '🇿🇦' }, date: 'Thu, 11 June', time: '20:00 BST' },
    { id: 'g1_2', home: { id: 'kor', name: 'South Korea', flag: '🇰🇷' }, away: { id: 'cze', name: 'Czechia', flag: '🇨🇿' }, date: 'Fri, 12 June', time: '03:00 BST' },
    { id: 'g1_3', home: { id: 'can', name: 'Canada', flag: '🇨🇦' }, away: { id: 'bih', name: 'Bosnia & Herz.', flag: '🇧🇦' }, date: 'Fri, 12 June', time: '20:00 BST' },
    { id: 'g1_4', home: { id: 'usa', name: 'USA', flag: '🇺🇸' }, away: { id: 'par', name: 'Paraguay', flag: '🇵🇾' }, date: 'Sat, 13 June', time: '02:00 BST' },
    { id: 'g1_5', home: { id: 'qat', name: 'Qatar', flag: '🇶🇦' }, away: { id: 'sui', name: 'Switzerland', flag: '🇨🇭' }, date: 'Sat, 13 June', time: '20:00 BST' },
    { id: 'g1_6', home: { id: 'bra', name: 'Brazil', flag: '🇧🇷' }, away: { id: 'mar', name: 'Morocco', flag: '🇲🇦' }, date: 'Sat, 13 June', time: '23:00 BST' },
    { id: 'g1_7', home: { id: 'hai', name: 'Haiti', flag: '🇭🇹' }, away: { id: 'sco', name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' }, date: 'Sun, 14 June', time: '02:00 BST' },
    { id: 'g1_8', home: { id: 'aus', name: 'Australia', flag: '🇦🇺' }, away: { id: 'tur', name: 'Türkiye', flag: '🇹🇷' }, date: 'Sun, 14 June', time: '05:00 BST' },
    { id: 'g1_9', home: { id: 'ger', name: 'Germany', flag: '🇩🇪' }, away: { id: 'cuw', name: 'Curaçao', flag: '🇨🇼' }, date: 'Sun, 14 June', time: '18:00 BST' },
    { id: 'g1_10', home: { id: 'ned', name: 'Netherlands', flag: '🇳🇱' }, away: { id: 'jpn', name: 'Japan', flag: '🇯🇵' }, date: 'Sun, 14 June', time: '21:00 BST' },
    { id: 'g1_11', home: { id: 'civ', name: 'Ivory Coast', flag: '🇨🇮' }, away: { id: 'ecu', name: 'Ecuador', flag: '🇪🇨' }, date: 'Mon, 15 June', time: '00:00 BST' },
    { id: 'g1_12', home: { id: 'swe', name: 'Sweden', flag: '🇸🇪' }, away: { id: 'tun', name: 'Tunisia', flag: '🇹🇳' }, date: 'Mon, 15 June', time: '03:00 BST' }
  ],
  GW4: [
    { id: 'g4_1', home: { id: 'usa', name: 'USA', flag: '🇺🇸' }, away: { id: 'arg', name: 'Argentina', flag: '🇦🇷' }, date: 'Sun, 28 June', time: '17:00 BST' },
    { id: 'g4_2', home: { id: 'mex', name: 'Mexico', flag: '🇲🇽' }, away: { id: 'fra', name: 'France', flag: '🇫🇷' }, date: 'Sun, 28 June', time: '21:00 BST' },
    { id: 'g4_3', home: { id: 'eng', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' }, away: { id: 'esp', name: 'Spain', flag: '🇪🇸' }, date: 'Mon, 29 June', time: '16:00 BST' },
    { id: 'g4_4', home: { id: 'ger', name: 'Germany', flag: '🇩🇪' }, away: { id: 'mar', name: 'Morocco', flag: '🇲🇦' }, date: 'Mon, 29 June', time: '20:00 BST' },
    { id: 'g4_5', home: { id: 'ned', name: 'Netherlands', flag: '🇳🇱' }, away: { id: 'por', name: 'Portugal', flag: '🇵🇹' }, date: 'Tue, 30 June', time: '18:00 BST' },
    { id: 'g4_6', home: { id: 'cro', name: 'Croatia', flag: '🇭🇷' }, away: { id: 'bra', name: 'Brazil', flag: '🇧🇷' }, date: 'Wed, 1 July', time: '19:00 BST' }
  ]
};

['GW2', 'GW3', 'GW5', 'GW6', 'GW7'].forEach(gw => {
  if (!MATCH_FIXTURES_POOL[gw]) MATCH_FIXTURES_POOL[gw] = [];
});

export default function App() {
  const [currentTab, setCurrentTab] = useState('picks'); 
  const [activeRound, setActiveRound] = useState('GW1'); 
  const [currentUser, setCurrentUser] = useState(null);
  const [invalidUser, setInvalidUser] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(0); 
  const [selections, setSelections] = useState([null, null, null]);
  const [armbandSlot, setArmbandSlot] = useState(0); 
  const [isFormLocked, setIsFormLocked] = useState(false);
  const [isLoadingPicks, setIsLoadingPicks] = useState(false);
  
  const [leagueTable, setLeagueTable] = useState([]);
  const [tournamentFixtures, setTournamentFixtures] = useState({});
  const [isLoadingScores, setIsLoadingScores] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Cloud Network Synchronizer
  const handleFinalizeAndSave = async () => {
    if (isFormLocked) {
      setIsFormLocked(false);
      return;
    }

    if (selections.includes(null)) {
      alert("Configuration Sheet Incomplete: Please assign all 3 target slots before locking.");
      return;
    }

    try {
      setIsSaving(true);

      const getRes = await fetch(JSONBIN_URL, {
        headers: { "X-Master-Key": JSONBIN_API_KEY }
      });
      const currentData = await getRes.json();
      
      const masterRecord = currentData.record || { playerPicks: {} };
      if (!masterRecord.playerPicks) masterRecord.playerPicks = {};
      if (!masterRecord.playerPicks[activeRound]) masterRecord.playerPicks[activeRound] = {};

      masterRecord.playerPicks[activeRound][currentUser] = {
        picks: selections.map((s, idx) => ({
          name: s.name,
          flag: s.flag,
          id: s.id,
          isArmband: armbandSlot === idx
        })),
        timestamp: new Date().toISOString()
      };

      const putRes = await fetch(JSONBIN_URL, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": JSONBIN_API_KEY
        },
        body: JSON.stringify(masterRecord)
      });

      if (putRes.ok) {
        setIsFormLocked(true);
        alert(`🎯 Strategy Sheet Locked! Selections for ${currentUser} have been securely synced.`);
      } else {
        throw new Error("Cloud rejected data packet write execution.");
      }
    } catch (err) {
      console.error("Cloud synchronization failed: ", err);
      alert("Network sync failed. Please take a screenshot of your picks and notify the Commissioner.");
    } finally {
      setIsSaving(false);
    }
  };

  // Read URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const playerParam = params.get('player');

    if (playerParam && PLAYER_SLUGS[playerParam]) {
      setCurrentUser(PLAYER_SLUGS[playerParam]);
      setInvalidUser(false);
    } else if (!playerParam) {
      setCurrentUser(PLAYER_SLUGS['you']);
      setInvalidUser(false);
    } else {
      setInvalidUser(true);
    }
  }, []);

  // Restore existing picks from JSONBin when user and round are known.
  // This fixes the issue where re-opening a link showed an empty unlocked form
  // even if the player had already submitted — e.g. Kieran's problem.
  useEffect(() => {
    if (!currentUser) return;

    async function restoreExistingPicks() {
      try {
        setIsLoadingPicks(true);
        const res = await fetch(JSONBIN_URL, {
          headers: { "X-Master-Key": JSONBIN_API_KEY }
        });
        const data = await res.json();
        const saved = data.record?.playerPicks?.[activeRound]?.[currentUser];

        if (saved && saved.picks && saved.picks.length === 3) {
          // Restore picks into slots
          setSelections(saved.picks.map(p => ({
            id: p.id,
            name: p.name,
            flag: p.flag
          })));
          // Restore armband slot
          const armbandIdx = saved.picks.findIndex(p => p.isArmband);
          if (armbandIdx !== -1) setArmbandSlot(armbandIdx);
          // Lock the form — they already submitted
          setIsFormLocked(true);
        }
      } catch (err) {
        // Silently fail — no saved picks found, form stays empty and unlocked
        console.log('No existing picks found for this player/round.');
      } finally {
        setIsLoadingPicks(false);
      }
    }

    restoreExistingPicks();
  }, [currentUser, activeRound]);

  // Standings and fixture data
  useEffect(() => {
    async function fetchLiveTournamentData() {
      try {
        setIsLoadingScores(true);
        throw new Error("Initializing clean data layer.");
      } catch (error) {
        const cleanTable = Object.values(PLAYER_SLUGS).map(name => ({
          name, played: 0, w: 0, d: 0, l: 0, h2hPts: 0, totalScore: 0, winsSelected: 0
        }));
        setLeagueTable(cleanTable);
        
        setTournamentFixtures({
          GW1: [
            { p1: { name: 'Jason Gilbert', score: null, picks: [] }, p2: { name: 'Jack Gilbert', score: null, picks: [] } },
            { p1: { name: 'Jona Moore', score: null, picks: [] }, p2: { name: 'Adam Brand', score: null, picks: [] } },
            { p1: { name: 'Jamie Brown', score: null, picks: [] }, p2: { name: 'Richard Lee', score: null, picks: [] } },
            { p1: { name: 'Lianne Conway', score: null, picks: [] }, p2: { name: 'Mark Bentley', score: null, picks: [] } },
            { p1: { name: 'Kieran Smyth', score: null, picks: [] }, p2: { name: 'Amelia Gilbert', score: null, picks: [] } }
          ]
        });
      } finally {
        setIsLoadingScores(false);
      }
    }
    fetchLiveTournamentData();
  }, []);

  // Dynamic Real-Time Countdown Clock — Thursday 11 June 20:00 BST
  useEffect(() => {
    const targetDate = new Date('2026-06-11T20:00:00+01:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsFormLocked(true);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  const historicalUsage = {};
  const getUsageMetrics = (teamId) => {
    const pastCount = historicalUsage[teamId] || 0;
    const currentCount = selections.filter(s => s && s.id === teamId).length;
    return pastCount + currentCount;
  };

  const handleSelectNation = (nation) => {
    if (isFormLocked) return;
    const internalDupIndex = selections.findIndex(s => s?.id === nation.id);
    if (internalDupIndex !== -1 && internalDupIndex !== selectedSlot) return;
    if (getUsageMetrics(nation.id) >= 2 && selections[selectedSlot]?.id !== nation.id) {
      alert(`Selection Locked: ${nation.name} has hit the maximum 2 tournament picks allocation.`);
      return;
    }
    const updated = [...selections];
    updated[selectedSlot] = nation;
    setSelections(updated);
    if (selectedSlot < 2 && !updated[selectedSlot + 1]) {
      setSelectedSlot(selectedSlot + 1);
    }
  };

  const handleClearSlot = (slotIdx, e) => {
    e.stopPropagation();
    if (isFormLocked) return;
    const updated = [...selections];
    updated[slotIdx] = null;
    setSelections(updated);
    setSelectedSlot(slotIdx);
  };

  if (invalidUser) {
    return (
      <div className="min-h-screen bg-[#F4F4F9] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-[#FF3B30]/20 p-6 max-w-sm w-full shadow-xl text-center">
          <div className="w-12 h-12 bg-[#FF3B30]/10 text-[#FF3B30] rounded-full flex items-center justify-center mx-auto text-xl font-bold">⚠️</div>
          <h2 className="text-base font-bold text-[#1C1C1E] mt-4">Invalid Credentials Link</h2>
          <p className="text-xs text-[#8E8E93] mt-2 leading-relaxed">
            Please check your custom workspace address or request your dedicated link from your League Commissioner.
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F4F4F9] flex items-center justify-center">
        <p className="text-xs text-[#8E8E93] font-mono animate-pulse">Syncing Secure Player Desk...</p>
      </div>
    );
  }

  const currentRoundMatches = MATCH_FIXTURES_POOL[activeRound] || [];
  const deadlinePassed = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <div className="min-h-screen bg-[#F4F4F9] text-[#1C1C1E] antialiased p-4 md:p-6 font-sans">
      
      {/* Header Panel */}
      <header className="max-w-4xl mx-auto mb-6 bg-white rounded-2xl p-4 border border-[#E5E5EA] flex flex-col sm:flex-row justify-between items-center gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-[#1C1C1E]">Triple Pick League</h1>
            <span className="bg-[#007AFF] text-white text-[9px] font-black tracking-wider px-2 py-0.5 rounded-md uppercase">World Cup '26</span>
          </div>
          <p className="text-[10px] text-[#007AFF] font-bold uppercase tracking-wider mt-0.5">Authenticated Manager: {currentUser}</p>
        </div>

        <div className="bg-[#E5E5EA] p-0.5 rounded-xl flex gap-0.5 w-full sm:w-auto">
          <button onClick={() => setCurrentTab('picks')} className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${currentTab === 'picks' ? 'bg-white text-[#1C1C1E] shadow-sm' : 'text-[#636366]'}`}>
            Strategy Desk
          </button>
          <button onClick={() => setCurrentTab('league')} className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${currentTab === 'league' ? 'bg-white text-[#1C1C1E] shadow-sm' : 'text-[#636366]'}`}>
            Arena & Standings
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {currentTab === 'picks' && (
          <div className="space-y-6">
            
            {/* Strategy Entry Sheet */}
            <section className="bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#007AFF] to-[#5AC8FA]" />
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                <div>
                  <h2 className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">Active Configuration Slots</h2>
                  <p className="text-[11px] text-[#636366] mt-0.5">Modifying sheet for profile target: <span className="font-bold text-black">{currentUser}</span></p>
                </div>

                <div className="bg-[#FF9500]/10 border border-[#FF9500]/20 rounded-xl px-3 py-1.5 flex items-center gap-2 self-start sm:self-center shadow-xs">
                  <span className={`w-1.5 h-1.5 rounded-full ${deadlinePassed ? 'bg-[#FF3B30]' : 'bg-[#FF9500] animate-pulse'}`} />
                  <span className={`text-[10px] font-black tracking-wide uppercase ${deadlinePassed ? 'text-[#FF3B30]' : 'text-[#FF9500]'}`}>
                    {deadlinePassed ? 'Locked' : 'Lockout In:'}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#1C1C1E]">
                    {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                  </span>
                </div>
              </div>

              {/* Locked state banner — shows when picks have been restored from cloud */}
              {isFormLocked && !isLoadingPicks && (
                <div className="mb-4 px-3 py-2 bg-[#34C759]/10 border border-[#34C759]/30 rounded-xl flex items-center gap-2">
                  <span className="text-[#34C759] text-sm">✓</span>
                  <p className="text-xs font-semibold text-[#34C759]">Your picks are locked in and saved. Click the green button below to make changes.</p>
                </div>
              )}

              {/* Loading state while restoring picks */}
              {isLoadingPicks && (
                <div className="mb-4 px-3 py-2 bg-[#007AFF]/10 border border-[#007AFF]/20 rounded-xl">
                  <p className="text-xs font-mono text-[#007AFF] animate-pulse">Checking for existing picks...</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {selections.map((nation, idx) => {
                  const isActive = selectedSlot === idx;
                  const isArmband = armbandSlot === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => !isFormLocked && setSelectedSlot(idx)}
                      className={`p-4 rounded-xl border-2 flex flex-col justify-between h-28 transition-all cursor-pointer relative ${
                        isActive ? 'border-[#007AFF] bg-[#007AFF]/5' : 'border-[#E5E5EA] bg-white hover:border-[#D1D1D6]'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-[10px] font-black uppercase text-[#8E8E93]">Slot 0{idx + 1}</span>
                        {nation && !isFormLocked && (
                          <button onClick={(e) => handleClearSlot(idx, e)} className="text-[10px] font-bold text-[#FF3B30] bg-[#FF3B30]/10 px-2 py-0.5 rounded-md">
                            Clear
                          </button>
                        )}
                      </div>

                      <div className="my-auto flex items-center gap-3">
                        {nation ? (
                          <>
                            <span className="text-3xl">{nation.flag}</span>
                            <div>
                              <p className="text-sm font-bold text-[#1C1C1E]">{nation.name}</p>
                              <p className="text-[10px] font-mono text-[#8E8E93]">Caps Used: {getUsageMetrics(nation.id)}/2</p>
                            </div>
                          </>
                        ) : (
                          <p className="text-xs italic text-[#AEAEB2] font-medium">Click to assign team...</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-dashed border-[#E5E5EA]">
                        <span className="text-[9px] font-bold text-[#8E8E93]">Armband Option</span>
                        <input
                          type="radio"
                          name="armband"
                          disabled={isFormLocked}
                          checked={isArmband}
                          onChange={() => setArmbandSlot(idx)}
                          onClick={(e) => e.stopPropagation()}
                          className="accent-[#007AFF] h-3.5 w-3.5"
                        />
                      </div>
                      {isArmband && (
                        <span className="absolute -top-2.5 -right-2 bg-[#1C1C1E] text-white text-[8px] font-black tracking-wide py-0.5 px-2 rounded-md border border-white">
                          Ⓒ ARMBAND (+1)
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                disabled={isSaving || deadlinePassed}
                onClick={handleFinalizeAndSave}
                className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                  isFormLocked 
                    ? 'bg-[#34C759] text-white hover:bg-[#28a745]' 
                    : 'bg-[#1C1C1E] text-white hover:bg-black disabled:opacity-50'
                }`}
              >
                {isSaving ? (
                  <span className="flex items-center gap-2 font-mono animate-pulse">
                    🌐 Syncing Strategy Ledger...
                  </span>
                ) : isFormLocked ? (
                  '🔓 Reopen Sheets for Adjustments'
                ) : (
                  '🔒 Finalize Sheet Configuration'
                )}
              </button>
            </section>

            {/* Rules & Regulations Accordion */}
            <section className="bg-white rounded-2xl border border-[#E5E5EA] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
              <button 
                onClick={() => setShowRules(!showRules)}
                className="w-full p-4 flex justify-between items-center bg-[#F2F2F7]/50 hover:bg-[#F2F2F7] transition-all text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">📜</span>
                  <h3 className="text-xs font-black text-[#1C1C1E] uppercase tracking-wider">
                    Rules of the Beautiful Game
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#007AFF]">
                  {showRules ? 'Hide Details ▲' : 'Review Rules ▼'}
                </span>
              </button>

              {showRules && (
                <div className="p-5 border-t border-[#E5E5EA] bg-white space-y-4 text-xs text-[#636366] leading-relaxed">
                  <div>
                    <h4 className="font-bold text-[#1C1C1E] mb-1">1. The Triple Pick Selection</h4>
                    <p>Every gameweek, you must select exactly 3 nations from the active match pool. No blanks allowed.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-[#1C1C1E] mb-1">2. The 2-Cap Allocation limit</h4>
                    <p>You can only select any given nation <span className="font-bold text-black">up to 2 times across the entire tournament</span>. Once a country hits 2 caps, it will automatically lock out from your pool.</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-[#1C1C1E] mb-1">3. The Armband Ⓒ Modifier</h4>
                    <p>One of your 3 selections must be awarded your Armband. A standard win awards you points based on match outcome, but your Armband choice grants an <span className="font-bold text-[#34C759]">+1 Bonus Point</span> if that team secures a win.</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-[#1C1C1E] mb-1">4. Head-to-Head Arena Scoring</h4>
                    <p>You aren't just playing against a scoreboard — you are playing a direct Head-to-Head match against another manager every gameweek. H2H points are awarded as:</p>
                    <ul className="list-disc list-inside mt-1 ml-2 space-y-0.5 font-mono text-[11px]">
                      <li><span className="font-bold text-[#34C759]">3 League Pts</span> for a Match Win</li>
                      <li><span className="font-bold text-[#8E8E93]">1 League Pt</span> for a Match Draw</li>
                      <li><span className="font-bold text-[#FF3B30]">0 League Pts</span> for a Match Loss</li>
                    </ul>
                  </div>

                  <div className="bg-[#F2F2F7] p-3 rounded-xl border border-[#E5E5EA]">
                    <span className="font-bold text-[#1C1C1E] block mb-0.5">⚠️ Strategic Lockout Deadlines</span>
                    Once you hit "Finalize Sheet Configuration", your strategy card is pushed live to the cloud. Changes can only be made prior to the countdown lockout timer expiration.
                  </div>
                </div>
              )}
            </section>

            {/* Fixture Selection Pool Grid */}
            <section className="bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="mb-4">
                <h3 className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">Available Matchday Pool ({activeRound})</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentRoundMatches.map((match) => {
                  const homeUsage = getUsageMetrics(match.home.id);
                  const awayUsage = getUsageMetrics(match.away.id);
                  const homeMaxedOut = homeUsage >= 2 && !selections.some(s => s?.id === match.home.id);
                  const awayMaxedOut = awayUsage >= 2 && !selections.some(s => s?.id === match.away.id);
                  const currentSlotOwnsHome = selections[selectedSlot]?.id === match.home.id;
                  const currentSlotOwnsAway = selections[selectedSlot]?.id === match.away.id;

                  return (
                    <div key={match.id} className="bg-white border border-[#E5E5EA] rounded-xl p-3 flex flex-col justify-between relative overflow-hidden pl-4">
                      <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-[#E5E5EA]" />
                      <div className="flex items-center justify-between w-full">
                        <button
                          disabled={isFormLocked || homeMaxedOut}
                          onClick={() => handleSelectNation(match.home)}
                          className={`flex-1 p-2 rounded-lg flex items-center gap-2.5 transition-all text-left ${
                            currentSlotOwnsHome ? 'bg-[#007AFF]/10 border border-[#007AFF]/30 font-bold' : homeMaxedOut ? 'opacity-30' : 'hover:bg-[#F2F2F7]'
                          }`}
                        >
                          <span className="text-2xl">{match.home.flag}</span>
                          <div className="truncate">
                            <p className="text-xs font-bold text-[#1C1C1E] truncate">{match.home.name}</p>
                            <p className="text-[9px] font-mono text-[#8E8E93]">Caps: {homeUsage}/2</p>
                          </div>
                        </button>

                        <div className="px-3 text-[10px] font-black text-[#AEAEB2] font-mono">VS</div>

                        <button
                          disabled={isFormLocked || awayMaxedOut}
                          onClick={() => handleSelectNation(match.away)}
                          className={`flex-1 p-2 rounded-lg flex items-center justify-end gap-2.5 transition-all text-right ${
                            currentSlotOwnsAway ? 'bg-[#007AFF]/10 border border-[#007AFF]/30 font-bold' : awayMaxedOut ? 'opacity-30' : 'hover:bg-[#F2F2F7]'
                          }`}
                        >
                          <div className="truncate">
                            <p className="text-xs font-bold text-[#1C1C1E] truncate">{match.away.name}</p>
                            <p className="text-[9px] font-mono text-[#8E8E93]">Caps: {awayUsage}/2</p>
                          </div>
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
            </section>
          </div>
        )}

        {currentTab === 'league' && (
          <div className="space-y-6">
            {/* Head-to-Head Arena View */}
            <section className="bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[4px] h-full bg-[#007AFF]" />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 pb-3 border-b border-[#F2F2F7]">
                <div>
                  <h2 className="text-base font-bold text-[#1C1C1E] tracking-tight">H2H Matchday Arena</h2>
                </div>
                <div className="bg-[#E5E5EA]/70 p-0.5 rounded-xl flex flex-wrap gap-0.5 max-w-full">
                  {ROUNDS.map(gw => (
                    <button key={gw} onClick={() => setActiveRound(gw)} className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${activeRound === gw ? 'bg-white text-[#007AFF] shadow-xs' : 'text-[#636366]'}`}>
                      {gw}
                    </button>
                  ))}
                </div>
              </div>

              {isLoadingScores ? (
                <p className="text-center py-6 text-xs text-[#8E8E93] font-mono animate-pulse">Syncing Arena scores from live matrix...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tournamentFixtures[activeRound]?.map((fixture, index) => {
                    const isUserMatch = fixture.p1.name === currentUser || fixture.p2.name === currentUser;

                    return (
                      <div 
                        key={index} 
                        className={`border rounded-xl p-4 transition-all relative overflow-hidden flex flex-col justify-between ${
                          isUserMatch 
                            ? 'border-[#007AFF] bg-[#007AFF]/5 shadow-sm ring-1 ring-[#007AFF]/20' 
                            : 'border-[#E5E5EA] bg-white hover:border-[#D1D1D6]'
                        }`}
                      >
                        {isUserMatch && (
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#007AFF]" />
                        )}

                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[9px] font-black tracking-wider text-[#8E8E93] uppercase font-mono">
                            Match {index + 1} {isUserMatch && '• YOUR ARENA'}
                          </span>
                          {isUserMatch && (
                            <span className="bg-[#007AFF] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide">
                              Live Target
                            </span>
                          )}
                        </div>

                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 max-w-[70%]">
                              <div className={`w-1.5 h-1.5 rounded-full ${isUserMatch && fixture.p1.name === currentUser ? 'bg-[#007AFF]' : 'bg-transparent'}`} />
                              <p className={`text-xs truncate ${fixture.p1.name === currentUser ? 'font-bold text-black' : 'font-medium text-[#1C1C1E]'}`}>
                                {fixture.p1.name}
                              </p>
                            </div>
                            <span className="font-mono text-sm font-bold text-[#1C1C1E]">
                              {fixture.p1.score !== null ? fixture.p1.score : '—'}
                            </span>
                          </div>

                          <div className="h-[1px] bg-[#F2F2F7]" />

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 max-w-[70%]">
                              <div className={`w-1.5 h-1.5 rounded-full ${isUserMatch && fixture.p2.name === currentUser ? 'bg-[#007AFF]' : 'bg-transparent'}`} />
                              <p className={`text-xs truncate ${fixture.p2.name === currentUser ? 'font-bold text-black' : 'font-medium text-[#1C1C1E]'}`}>
                                {fixture.p2.name}
                              </p>
                            </div>
                            <span className="font-mono text-sm font-bold text-[#1C1C1E]">
                              {fixture.p2.score !== null ? fixture.p2.score : '—'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-dashed border-[#E5E5EA] grid grid-cols-2 gap-2 text-[10px]">
                          <div className="space-y-1 border-r border-[#F2F2F7] pr-1">
                            <span className="text-[8px] font-bold text-[#8E8E93] uppercase tracking-tight block">Picks:</span>
                            <div className="flex flex-wrap gap-1">
                              {fixture.p1.picks && fixture.p1.picks.length > 0 ? (
                                fixture.p1.picks.map((pick, pIdx) => (
                                  <span key={pIdx} title={pick.name} className={`px-1.5 py-0.5 rounded font-sans text-[11px] bg-[#F2F2F7] ${pick.isArmband ? 'ring-1 ring-[#FF9500] font-bold' : ''}`}>
                                    {pick.flag}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[10px] italic text-[#AEAEB2]">Pending</span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1 pl-1">
                            <span className="text-[8px] font-bold text-[#8E8E93] uppercase tracking-tight block">Picks:</span>
                            <div className="flex flex-wrap gap-1">
                              {fixture.p2.picks && fixture.p2.picks.length > 0 ? (
                                fixture.p2.picks.map((pick, pIdx) => (
                                  <span key={pIdx} title={pick.name} className={`px-1.5 py-0.5 rounded font-sans text-[11px] bg-[#F2F2F7] ${pick.isArmband ? 'ring-1 ring-[#FF9500] font-bold' : ''}`}>
                                    {pick.flag}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[10px] italic text-[#AEAEB2]">Pending</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Official Standings Table */}
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
                      <th className="py-2.5 px-4 text-center text-[#8E8E93]">Tiebreakers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5EA] text-xs font-medium text-[#1C1C1E]">
                    {leagueTable.map((row, idx) => (
                      <tr key={row.name} className={`hover:bg-[#F2F2F7]/40 ${row.name === currentUser ? 'bg-[#007AFF]/5 font-semibold' : ''}`}>
                        <td className="py-3 px-4 text-center font-mono font-bold text-[#636366]">{idx + 1}</td>
                        <td className="py-3 px-4 font-bold flex items-center gap-1.5">
                          {row.name}
                          {row.name === currentUser && <span className="bg-[#007AFF] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">YOU</span>}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-[#636366]">{row.played}</td>
                        <td className="py-3 px-4 text-center font-mono text-[#34C759]">{row.w}</td>
                        <td className="py-3 px-4 text-center font-mono text-[#8E8E93]">{row.d}</td>
                        <td className="py-3 px-4 text-center font-mono text-[#FF3B30]">{row.l}</td>
                        <td className="py-3 px-4 text-center font-mono font-black text-sm text-[#007AFF]">{row.h2hPts}</td>
                        <td className="py-3 px-4 text-center font-mono text-[#636366]">
                          {row.totalScore} pts · <span className="text-gray-400">{row.winsSelected} W picks</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
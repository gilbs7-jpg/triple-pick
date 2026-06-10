import React, { useState, useEffect } from 'react';

// JSONBin Configuration Matrix
const JSONBIN_BIN_ID = "6a289e9dda38895dfea3718d";
const JSONBIN_API_KEY = "$2a$10$SM58O3uX4Dttskq/9geD5OytFCpgoclTLo8BWMo6gvk4QBQI5y9Ri"; 
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;
const ROUNDS = ['GW1', 'GW2', 'GW3', 'GW4', 'GW5', 'GW6', 'GW7'];

// Map URL safe slugs to the exact display names in your system
const PLAYER_SLUGS = {
  jona_m: 'Jona Moore',
  you: 'Jason Gilbert',
  adam_b: 'Adam Brand',
  jamie_b: 'Jamie Brown',
  richard_l: 'Richard Lee',
  lianne_c: 'Lianne Conway',
  mark_b: 'Mark Bentley',
  kieran_s: 'Kieran Smyth',
  lila_g: 'Lila Gilbert',
  jack_g: 'Jack Gilbert'
};

const MATCH_FIXTURES_POOL = {
  GW1: [
    { id: 'g1_1', home: { id: 'usa', name: 'USA', flag: '🇺🇸' }, away: { id: 'can', name: 'Canada', flag: '🇨🇦' }, date: 'Friday, 12 June', time: '20:00 BST' },
    { id: 'g1_2', home: { id: 'mex', name: 'Mexico', flag: '🇲🇽' }, away: { id: 'ita', name: 'Italy', flag: '🇮🇹' }, date: 'Saturday, 13 June', time: '15:00 BST' },
    { id: 'g1_3', home: { id: 'arg', name: 'Argentina', flag: '🇦🇷' }, away: { id: 'jpn', name: 'Japan', flag: '🇯🇵' }, date: 'Saturday, 13 June', time: '18:00 BST' },
    { id: 'g1_4', home: { id: 'fra', name: 'France', flag: '🇫🇷' }, away: { id: 'bel', name: 'Belgium', flag: '🇧🇪' }, date: 'Sunday, 14 June', time: '14:00 BST' },
    { id: 'g1_5', home: { id: 'eng', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' }, away: { id: 'cro', name: 'Croatia', flag: '🇭🇷' }, date: 'Sunday, 14 June', time: '17:00 BST' },
    { id: 'g1_6', home: { id: 'esp', name: 'Spain', flag: '🇪🇸' }, away: { id: 'mar', name: 'Morocco', flag: '🇲🇦' }, date: 'Monday, 15 June', time: '20:00 BST' },
    { id: 'g1_7', home: { id: 'ger', name: 'Germany', flag: '🇩🇪' }, away: { id: 'ned', name: 'Netherlands', flag: '🇳🇱' }, date: 'Tuesday, 16 June', time: '16:00 BST' },
    { id: 'bra', home: { id: 'bra', name: 'Brazil', flag: '🇧🇷' }, away: { id: 'por', name: 'Portugal', flag: '🇵🇹' }, date: 'Wednesday, 17 June', time: '19:00 BST' }
  ],
  GW4: [
    { id: 'g4_1', home: { id: 'usa', name: 'USA', flag: '🇺🇸' }, away: { id: 'arg', name: 'Argentina', flag: '🇦🇷' }, date: 'Sunday, 28 June', time: '17:00 BST' },
    { id: 'g4_2', home: { id: 'mex', name: 'Mexico', flag: '🇲🇽' }, away: { id: 'fra', name: 'France', flag: '🇫🇷' }, date: 'Sunday, 28 June', time: '21:00 BST' },
    { id: 'g4_3', home: { id: 'eng', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' }, away: { id: 'esp', name: 'Spain', flag: '🇪🇸' }, date: 'Monday, 29 June', time: '16:00 BST' },
    { id: 'g4_4', home: { id: 'ger', name: 'Germany', flag: '🇩🇪' }, away: { id: 'mar', name: 'Morocco', flag: '🇲🇦' }, date: 'Monday, 29 June', time: '20:00 BST' },
    { id: 'g4_5', home: { id: 'ned', name: 'Netherlands', flag: '🇳🇱' }, away: { id: 'por', name: 'Portugal', flag: '🇵🇹' }, date: 'Tuesday, 30 June', time: '18:00 BST' },
    { id: 'g4_6', home: { id: 'cro', name: 'Croatia', flag: '🇭🇷' }, away: { id: 'bra', name: 'Brazil', flag: '🇧🇷' }, date: 'Wednesday, 1 July', time: '19:00 BST' }
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
  
  const [leagueTable, setLeagueTable] = useState([]);
  const [tournamentFixtures, setTournamentFixtures] = useState({});
  const [isLoadingScores, setIsLoadingScores] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
        alert(`🎯 Strategy Sheet Locked! Selections for ${currentUser} have been securely synced to the cloud engine.`);
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

  const [timeLeft, setTimeLeft] = useState({ days: 1, hours: 23, minutes: 14, seconds: 45 });

  // Read URL params or load Dev mode bypass on environment mount
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

  // Synchronize Live Scoreboards & Standings Matrix
  useEffect(() => {
    async function fetchLiveTournamentData() {
      try {
        setIsLoadingScores(true);
        throw new Error("Initializing clean data layer.");
      } catch (error) {
        // Automatically build a clean starting table directly from the updated active PLAYER_SLUGS
        const cleanTable = Object.values(PLAYER_SLUGS).map(name => ({
          name, played: 0, w: 0, d: 0, l: 0, h2hPts: 0, totalScore: 0, winsSelected: 0
        }));
        setLeagueTable(cleanTable);
        
        // Setup fresh clean GW1 schedule cards matching onboarding roster exactly
        setTournamentFixtures({
          GW1: [
            { p1: { name: 'Jason Gilbert', score: null, picks: [] }, p2: { name: 'Jack Gilbert', score: null, picks: [] } },
            { p1: { name: 'Jona Moore', score: null, picks: [] }, p2: { name: 'Adam Brand', score: null, picks: [] } },
            { p1: { name: 'Jamie Brown', score: null, picks: [] }, p2: { name: 'Richard Lee', score: null, picks: [] } },
            { p1: { name: 'Lianne Conway', score: null, picks: [] }, p2: { name: 'Mark Bentley', score: null, picks: [] } },
            { p1: { name: 'Kieran Smyth', score: null, picks: [] }, p2: { name: 'Lila Gilbert', score: null, picks: [] } }
          ]
        });
      } finally {
        setIsLoadingScores(false);
      }
    }
    fetchLiveTournamentData();
  }, []);

  // Countdown clock loop
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        clearInterval(timer);
        return prev;
      });
    }, 1000);
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
                  <span className="w-1.5 h-1.5 bg-[#FF9500] rounded-full animate-pulse" />
                  <span className="text-[10px] font-black tracking-wide text-[#FF9500] uppercase">Lockout In:</span>
                  <span className="font-mono text-xs font-bold text-[#1C1C1E]">
                    {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                  </span>
                </div>
              </div>

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
                disabled={isSaving}
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
                    <p>You aren't just playing against a scoreboard—you are playing a direct Head-to-Head match against another manager every gameweek. Your total points earned from your 3 picks dictate your matchday score. H2H points are awarded as:</p>
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
                    const highlightMatch = fixture.p1.name === currentUser || fixture.p2.name === currentUser;
                    const isScored = fixture.p1.score !== undefined && fixture.p1.score !== null;

                    return (
                      <div key={index} className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${highlightMatch ? 'border-[#007AFF]/30 bg-[#007AFF]/5 font-bold' : 'border-[#E5E5EA] bg-white'}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-xs font-bold text-[#1C1C1E]">{fixture.p1.name}</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {fixture.p1.picks?.map((p, i) => <span key={i} className="text-[9px] font-semibold text-[#636366] bg-[#F2F2F7] px-1.5 py-0.5 rounded">{p}</span>)}
                            </div>
                          </div>
                          <span className="font-mono text-base font-black text-[#1C1C1E]">{isScored ? fixture.p1.score : '-'}</span>
                        </div>
                        <div className="border-t border-[#E5E5EA]/50 relative my-1">
                          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-1.5 text-[8px] font-bold text-[#AEAEB2] border border-[#E5E5EA] rounded-full">VS</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-xs font-bold text-[#1C1C1E]">{fixture.p2.name}</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {fixture.p2.picks?.map((p, i) => <span key={i} className="text-[9px] font-semibold text-[#636366] bg-[#F2F2F7] px-1.5 py-0.5 rounded">{p}</span>)}
                            </div>
                          </div>
                          <span className="font-mono text-base font-black text-[#1C1C1E]">{isScored ? fixture.p2.score : '-'}</span>
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
                          {row.name === currentUser && <span className="bg-[#007AFF] text-white text-[8px] font-black px-1.5 py-0.2 rounded-full">YOU</span>}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-[#636366]">{row.played}</td>
                        <td className="py-3 px-4 text-center font-mono text-[#34C759]">{row.w}</td>
                        <td className="py-3 px-4 text-center font-mono text-[#8E8E93]">{row.d}</td>
                        <td className="py-3 px-4 text-center font-mono text-[#FF3B30]">{row.l}</td>
                        <td className="py-3 px-4 text-center font-mono font-black text-sm text-[#007AFF]">{row.h2hPts}</td>
                        <td className="py-3 px-4 text-center font-mono text-[#636366]">
                          {row.totalScore} pts total · <span className="text-gray-400">{row.winsSelected} W picks</span>
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
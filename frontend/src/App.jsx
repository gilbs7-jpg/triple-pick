import React, { useState, useEffect } from 'react';

// JSONBin Configuration
const JSONBIN_BIN_ID = "6a289e9dda38895dfea3718d";
const JSONBIN_API_KEY = "$2a$10$SM58O3uX4Dttskq/9geD5OytFCpgoclTLo8BWMo6gvk4QBQI5y9Ri"; 
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;
const ROUNDS = ['GW1', 'GW2', 'GW3', 'GW4', 'GW5', 'GW6', 'GW7'];

const PLAYER_SLUGS = {
  jona_m: 'Jona Moore',
  you: 'Jason Gilbert',
  adam_b: 'Adam Brand',
  jamie_b: 'Jamie Brown',
  richard_l: 'Richard Lee',
  lianne_c: 'Lianne Conway',
  mark_b: 'Mark Bentley',
  kieran_s: 'Kieran Smyth',
  amelia_a: 'Amelia Brown',
  gemma_d: 'Gemma D'
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
  ]
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selections, setSelections] = useState([null, null, null]);
  const [armbandSlot, setArmbandSlot] = useState(0); 
  const [isFormLocked, setIsFormLocked] = useState(false);
  const [activeRound, setActiveRound] = useState('GW1');
  const [tournamentFixtures, setTournamentFixtures] = useState({});

  // 1. Initial Identity & Fixtures Load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const playerParam = params.get('player');
    setCurrentUser(PLAYER_SLUGS[playerParam] || PLAYER_SLUGS['you']);

    setTournamentFixtures({
      GW1: [
        { p1: { name: 'Jason Gilbert' }, p2: { name: 'Gemma D' } },
        { p1: { name: 'Jona Moore' }, p2: { name: 'Adam Brand' } },
        { p1: { name: 'Jamie Brown' }, p2: { name: 'Richard Lee' } },
        { p1: { name: 'Lianne Conway' }, p2: { name: 'Mark Bentley' } },
        { p1: { name: 'Kieran Smyth' }, p2: { name: 'Amelia Brown' } }
      ]
    });
  }, []);

  // 2. Load State Effect (Cloud Persistence)
  useEffect(() => {
    if (!currentUser) return;
    const restorePicks = async () => {
      try {
        const res = await fetch(JSONBIN_URL, { headers: { "X-Master-Key": JSONBIN_API_KEY } });
        const data = await res.json();
        const saved = data.record?.playerPicks?.[activeRound]?.[currentUser];
        if (saved?.picks) {
          setSelections(saved.picks);
          setArmbandSlot(saved.picks.findIndex(p => p.isArmband));
          setIsFormLocked(true);
        }
      } catch (err) { console.error("Cloud hydration failed", err); }
    };
    restorePicks();
  }, [currentUser, activeRound]);

  // 3. Selection Controller
  const handleSelectNation = (nation) => {
    if (isFormLocked) return;
    const updated = [...selections];
    const targetIdx = selections.findIndex(s => s === null);
    if (targetIdx !== -1) {
      updated[targetIdx] = nation;
      setSelections(updated);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-[#F4F4F9] min-h-screen">
      <header className="bg-white p-4 rounded-2xl mb-6 shadow-sm">
        <h1 className="font-bold">Triple Pick League: {currentUser}</h1>
      </header>
      {/* Selection UI implementation omitted for brevity, logic integrated */}
    </div>
  );
}
// Vercel serverless function — proxies football-data.org to avoid CORS
// Deployed at: /api/results?matchday=1

export default async function handler(req, res) {
  // Allow requests from your Vercel app
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { matchday } = req.query;
  if (!matchday) {
    return res.status(400).json({ error: 'matchday parameter required' });
  }

  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const url = `https://api.football-data.org/v4/competitions/WC/matches?matchday=${matchday}`;
    const response = await fetch(url, {
      headers: { 'X-Auth-Token': apiKey }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: `football-data.org error: ${text}` });
    }

    const data = await response.json();

    // Map each match to { homeId, awayId, homeResult, awayResult }
    // homeResult/awayResult: 'W' | 'D' | 'L' | null (null = not yet played)
    const mapped = (data.matches || []).map(match => {
      const status = match.status; // SCHEDULED, IN_PLAY, PAUSED, FINISHED, POSTPONED
      const home = match.homeTeam;
      const away = match.awayTeam;
      const score = match.score;

      let homeResult = null;
      let awayResult = null;

      if (status === 'FINISHED' || status === 'IN_PLAY' || status === 'PAUSED') {
        const homeGoals = score?.fullTime?.home ?? score?.regularTime?.home ?? null;
        const awayGoals = score?.fullTime?.away ?? score?.regularTime?.away ?? null;

        if (homeGoals !== null && awayGoals !== null) {
          if (homeGoals > awayGoals) {
            homeResult = 'W'; awayResult = 'L';
          } else if (awayGoals > homeGoals) {
            homeResult = 'L'; awayResult = 'W';
          } else {
            homeResult = 'D'; awayResult = 'D';
          }

          // Penalty shootout: winner is whoever won on penalties
          if (score.winner === 'HOME_TEAM' && homeResult !== 'W') {
            homeResult = 'W'; awayResult = 'L';
          } else if (score.winner === 'AWAY_TEAM' && awayResult !== 'W') {
            homeResult = 'L'; awayResult = 'W';
          }
        }
      }

      return {
        matchId:    match.id,
        status,
        homeTeam:   { id: home.tla?.toLowerCase(), name: home.name, shortName: home.shortName },
        awayTeam:   { id: away.tla?.toLowerCase(), name: away.name, shortName: away.shortName },
        homeResult,
        awayResult,
      };
    });

    return res.status(200).json({ matchday: parseInt(matchday), matches: mapped });
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: err.message });
  }
}
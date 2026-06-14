// Vercel serverless function — proxies football-data.org
//   /api/results?matchday=1            → results (W/D/L per nation)
//   /api/results?matchday=1&mode=fixtures → upcoming fixtures (teams, dates, times)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { matchday, mode } = req.query;
  if (!matchday) {
    return res.status(400).json({ error: 'matchday parameter required' });
  }

  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const url = `https://api.football-data.org/v4/competitions/WC/matches?matchday=${matchday}`;
    const response = await fetch(url, { headers: { 'X-Auth-Token': apiKey } });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: `football-data.org error: ${text}` });
    }

    const data = await response.json();
    const matches = data.matches || [];

    // FIXTURES MODE — return team info, dates, kickoff times for building the pick pool
    if (mode === 'fixtures') {
      const fixtures = matches.map(match => {
        const home = match.homeTeam;
        const away = match.awayTeam;
        return {
          matchId:   match.id,
          status:    match.status,
          utcDate:   match.utcDate, // ISO string — app formats to BST
          homeTeam:  { tla: home.tla, name: home.name, shortName: home.shortName },
          awayTeam:  { tla: away.tla, name: away.name, shortName: away.shortName },
        };
      });
      return res.status(200).json({ matchday: parseInt(matchday), fixtures });
    }

    // RESULTS MODE (default) — return W/D/L per nation
    const mapped = matches.map(match => {
      const status = match.status;
      const home = match.homeTeam;
      const away = match.awayTeam;
      const score = match.score;
      let homeResult = null, awayResult = null;

      if (status === 'FINISHED' || status === 'IN_PLAY' || status === 'PAUSED') {
        const homeGoals = score?.fullTime?.home ?? score?.regularTime?.home ?? null;
        const awayGoals = score?.fullTime?.away ?? score?.regularTime?.away ?? null;
        if (homeGoals !== null && awayGoals !== null) {
          if (homeGoals > awayGoals)      { homeResult='W'; awayResult='L'; }
          else if (awayGoals > homeGoals) { homeResult='L'; awayResult='W'; }
          else                            { homeResult='D'; awayResult='D'; }
          if (score.winner === 'HOME_TEAM' && homeResult !== 'W') { homeResult='W'; awayResult='L'; }
          else if (score.winner === 'AWAY_TEAM' && awayResult !== 'W') { homeResult='L'; awayResult='W'; }
        }
      }

      return {
        matchId:  match.id,
        status,
        homeTeam: { tla: home.tla, name: home.name },
        awayTeam: { tla: away.tla, name: away.name },
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
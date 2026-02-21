function fixtures() {
  const topMatter = `tournamentId: 6
description: "Benelux round A"
startDate: "2024-04-01"
pitches: ["p1"]`
  return {
    'simple invalid yaml': `${topMatter}
categories:
  Mens:
    g1: ["Amsterdam A", "Amsterdam B", "Leuven A"]
  Ladies:
    g1: ["Amsterdam X", "Amsterdam B", "Earls of Brussels"]
schedule:
  headings: ["startTime", "pitch", "stage", "category", "group", "Team1", "Team2", "UmpireTeam", "Duration"]
  fixtures:
    - ["10:30", "p1", "group", "Mens", "g1", "Amsterdam A", "Amsterdam B", "Leuven A", 15]
    - ["11:00", "p1", "group", "Ladies", "g1", "Amsterdam B", "Earls of Brussels", "Amsterdam A", 12]
`,
    'simple valid yaml': `${topMatter}
categories:
  Mens:
    g1: ["Amsterdam A", "Amsterdam B", "Leuven A"]
    g2: ["Belgium A", "Amsterdam A"]
  Ladies:
    g1: ["Amsterdam A", "Amsterdam B", "Earls of Brussels"]
activities:
  - ["10:30", "p1", "group", "Mens", "g1", "Amsterdam A", "Amsterdam B", "Leuven A", 15]
  - ["11:00", "p1", "group", "Ladies", "g1", "Amsterdam B", "Earls of Brussels", "Amsterdam A", 12]
`,
    'bad pitch': `
pitches: ["p1"]
schedule:
  fixtures:
    - ["10:30", "pX", "group", "Mens", "g1", "Amsterdam A", "Amsterdam B", "Leuven A", 15]
    - ["11:00", "p1", "group", "Ladies", "g1", "Amsterdam B", "Earls of Brussels", "Amsterdam A", 12]
`
  }
}

module.exports = fixtures()
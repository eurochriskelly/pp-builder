const VERBOSE = true;

interface IMatch {
  team1: ITeam;
  team2: ITeam;
}

interface ITeam {
  type: string;
  stage: string;
  group: string;
  position: number;
}

export function prettyPrintMatches(matches: IMatch[]) {
  if (VERBOSE) {
    console.table(matches.map(m => {
      const strteam = (t: ITeam) => {
        const { type, stage, group, position }: ITeam = t;
        if (type === 'calculated') {
          return `~${stage}:${group}/p:${position}`
        } else {
          return 'real'
        }
      }
      return {
        ...m,
        team1: strteam(m.team1),
        team2: strteam(m.team2),
      }
    }))
  }
}
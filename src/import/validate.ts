import { getScheduleProps } from './utils';

export const validateFixtures = (fixtures: any) => {
  const warnings: string[] = []
  const props = getScheduleProps(fixtures);
  // 1. check if each group has correct number of teams
  const teamInfo: any = []
  props.categories.forEach((cat: string) => {
    const thisGroupCat = props.groups.byCategory[cat]
    thisGroupCat.forEach((grp: string) => {
      const filtered = fixtures.filter((f: any) => f.stage === 'group' && f.category === cat && f.group === grp);
      const base = `${grp}/`;
      const curTeams = props.teams.byCategory[cat]
        .filter((x: string) => x.startsWith(base))
        .map((x: string) => x.substring(base.length))
      const expMatches = sumIndexes(curTeams.length - 1)
      const actMatches = filtered.length
      teamInfo.push({
        category: cat,
        group: grp,
        team: curTeams.join(' ... '),
        numTeams: curTeams.length,
        expMatches, 
        actMatches,
        status: expMatches === actMatches ? 'OK' : `expected ${expMatches}, received ${actMatches}`
      });
    })
  })
  console.table(teamInfo);
  return {
    isValid: !warnings.length,
    warnings
  }
}

function sumIndexes(n: number) {
    return n * (n + 1) / 2;
}

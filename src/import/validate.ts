import { getScheduleProps } from './utils';

export interface ValidationResult {
    isValid: boolean;
    warnings: string[];
    teamInfo: any[];
    props: any;
}

export function validateFixtures(fixtures: any[]): ValidationResult {
    const warnings: string[] = [];
    const props = getScheduleProps(fixtures);
    const teamInfo: any[] = [];

    props.categories.forEach((cat: string) => {
        const thisGroupCat = props.groups.byCategory[cat] || [];
        thisGroupCat.forEach((grp: string) => {
            const filtered = fixtures.filter((f: any) => f.stage === 'group' && f.category === cat && f.group === grp);
            const base = `${grp}/`;
            const curTeams = (props.teams.byCategory[cat] || [])
                .filter((x: string) => x.startsWith(base))
                .map((x: string) => x.substring(base.length));
            const expMatches = sumIndexes(curTeams.length - 1);
            const actMatches = filtered.length;
            const status = expMatches === actMatches ? 'OK' : `Expected ${expMatches} matches, received ${actMatches}`;
            if (status !== 'OK') {
                warnings.push(`Category ${cat}, Group ${grp}: ${status} (Teams: ${curTeams.join(', ')})`);
            }
            teamInfo.push({
                category: cat,
                group: grp,
                team: curTeams.join(' ... '),
                numTeams: curTeams.length,
                expMatches,
                actMatches,
                status,
            });
        });
    });

    return {
        isValid: warnings.length === 0,
        warnings,
        teamInfo,
        props,
    };
}

function sumIndexes(n: number): number {
    return n * (n + 1) / 2;
}

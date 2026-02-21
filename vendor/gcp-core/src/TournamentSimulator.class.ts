class TournamentSimulator {
    groupLetters: string[];
    matches: { [group: string]: any[] };
    teamList: any[];
    groupSizes: { [group: string]: number };
    stageParameters: any[];

    constructor(stageParameters: any[] = []) {
        this.groupLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        this.matches = {};
        this.teamList = [];
        this.groupSizes = {};
        this.stageParameters = stageParameters;
    }

    set teams(teams: any[]) {
        this.teamList = teams;
        this.groupSizes = teams.reduce((p, team) => {
            p[team.group] = (p[team.group] || 0) + 1;
            return p;
        }, {});
        console.table(this.teamList);
        this.simulateMatches();
    }

    matchesTable(group: string): any[] {
        if (this.matches[group] === undefined) return [];
        return this.matches[group].map(x => ({ ...x, time: `${x.time.playing} + ${x.time.gap}` }));
    }

    simulateMatches(): void {
        console.log('Simulating matches...');
        Object.keys(this.matches).forEach(group => {
            console.log(`Group ${group}`);
            const matches = this.matches[group].map(match => {
                const { team1, team2, offset } = match;
                const goals1 = Math.round(Math.random() * 5);
                const points1 = Math.round(Math.random() * 15);
                const total1 = goals1 * 3 + points1;
                const goals2 = Math.round(Math.random() * 5);
                const points2 = Math.round(Math.random() * 15);
                const total2 = goals2 * 3 + points2;
                return {

                    team1, goals1, points1, total1,
                    team2, goals2, points2, total2,
                    winner: total1 > total2 ? team1 : team2,
                };
            });
            console.table(matches);
        });
    }
}

export default TournamentSimulator;

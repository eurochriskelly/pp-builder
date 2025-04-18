import generateTeamRankingsRow from './index.js';
import '../../../../../../public/scripts/webcomponents/team-name.js';
import '../../../../../../public/scripts/webcomponents/gaelic-score.js';

const sampleMatches = [
    {
        matchId: 'gp1',
        teamVersus: 'Kerry',
        column: 'GP',
        matchOutcome: 'won',
        goals: 2,
        points: 8,
        goalsAgainst: 1,
        pointsAgainst: 5
    },
    {
        matchId: 'qf1',
        teamVersus: 'Mayo',
        column: 'QF',
        matchOutcome: 'won',
        goals: 3,
        points: 12,
        goalsAgainst: 1,
        pointsAgainst: 8
    },
    {
        matchId: 'sf1',
        teamVersus: 'Cork',
        column: 'SF',
        matchOutcome: 'lost',
        goals: 1,
        points: 8,
        goalsAgainst: 2,
        pointsAgainst: 10
    }
];

const columns = ['GP', 'QF', 'SF', 'F'];

const meta = {
    title: 'Execution/TeamRankings',
    parameters: {
        layout: 'padded',
    },
};

export default meta;

export const Default = {
    args: {
        contest: 'cup'
    },
    render: (args) => {
        return `
            <table class="min-w-full border-collapse">
                <thead>
                    <tr>
                        <th class="px-4 py-2 border">Rank</th>
                        <th class="px-4 py-2 border">Team</th>
                        ${columns.map(col => `<th class="px-4 py-2 border">${col}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${generateTeamRankingsRow(1, "Dublin", args.contest, columns.length, columns, sampleMatches)}
                </tbody>
            </table>
        `;
    }
};

export const MultipleTeams = {
    args: {
        contest: 'cup'
    },
    render: (args) => {
        return `
            <table class="min-w-full border-collapse">
                <thead>
                    <tr>
                        <th class="px-4 py-2 border">Rank</th>
                        <th class="px-4 py-2 border">Team</th>
                        ${columns.map(col => `<th class="px-4 py-2 border">${col}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${generateTeamRankingsRow(1, "Dublin", args.contest, columns.length, columns, sampleMatches)}
                    ${generateTeamRankingsRow(2, "Kerry", args.contest, columns.length, columns, [sampleMatches[0]])}
                    ${generateTeamRankingsRow(3, "Cork", args.contest, columns.length, columns, [])}
                </tbody>
            </table>
        `;
    }
};

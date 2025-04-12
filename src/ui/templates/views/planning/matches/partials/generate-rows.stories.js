import '../../../../../public/scripts/webcomponents/team-name.js';
import '../../../../../public/scripts/webcomponents/logo-box.js';
const { generateUpcomingRow, generateFinishedRow } = require('./generate-rows');

// Sample data for upcoming matches
const upcomingRowSample1 = {
    id: 'm123',
    grp: 'A',
    category: 'Senior Hurling',
    stage: 'group',
    pitch: 'Pitch 1',
    scheduledTime: '10:00',
    team1: 'Team Alpha',
    team2: 'Team Beta',
    umpireTeam: 'Umpire Team Gamma',
    started: 'false'
};

const upcomingRowSample2 = {
    id: 'm456',
    grp: 'B',
    category: 'Junior Football',
    stage: 'semi_final',
    pitch: 'Pitch 2',
    scheduledTime: '11:00',
    team1: 'Another Team',
    team2: 'TBD', // Test TBD team
    umpireTeam: 'TBD', // Test TBD umpire
    started: 'false'
};

// Sample data for finished matches
const finishedRowSample1 = {
    id: 'm789',
    grp: 'C',
    category: 'Camogie',
    stage: 'final',
    pitch: 'Pitch 1',
    scheduledTime: '09:00',
    team1: 'Winners United',
    goals1: 2,
    points1: 10,
    team2: 'Runners Up FC',
    goals2: 1,
    points2: 8,
    umpireTeam: 'Ref Team Delta',
    started: 'true'
};

const finishedRowSample2 = {
    id: 'm012',
    grp: 'D',
    category: 'Ladies Football',
    stage: 'group',
    pitch: 'Pitch 3',
    scheduledTime: '09:30',
    team1: 'Team Epsilon',
    goals1: 0,
    points1: 5,
    team2: 'Team Zeta',
    goals2: 3,
    points2: 12,
    umpireTeam: 'Umpire Team Epsilon',
    started: 'true'
};

const finishedRowSampleNA = {
    id: 'm345',
    grp: 'E',
    category: 'U12 Hurling',
    stage: 'quarter_final',
    pitch: 'Pitch 4',
    scheduledTime: '08:00',
    team1: 'Team Eta',
    goals1: null, // Test N/A score
    points1: null,
    team2: 'Team Theta',
    goals2: null,
    points2: null,
    umpireTeam: 'Umpire Team Zeta',
    started: 'true'
};


export default {
    title: 'planning/Matches/Partials/Generate Rows',
    parameters: {
        layout: 'padded', // Use padded layout as these are table rows
    },
    decorators: [
        (Story) => `
            <link rel="stylesheet" href="/styles/tailwind.css">
            <table class="w-full border-collapse">
                <thead>
                    <!-- Add appropriate headers based on upcoming/finished -->
                </thead>
                <tbody>
                    ${Story()}
                </tbody>
            </table>
            <script>
                // Mock functions if needed, e.g., playNextNMatches
                function playNextNMatches(n, tournamentId) {
                    alert(\`Simulate playing next \${n} matches for tournament \${tournamentId}\`);
                }
                // Mock htmx if its absence causes errors
                window.htmx = { ajax: () => {} };
            </script>
        `,
    ],
};

// --- Stories for generateUpcomingRow ---

export const UpcomingRowEven = {
    render: () => generateUpcomingRow(upcomingRowSample1, 0, 'test-tourney', false, 'm456'),
    decorators: [
        (Story) => `
            <table>
                <thead>
                    <tr><th>ID</th><th>Group</th><th>Category</th><th>Stage</th><th>Pitch</th><th>Time</th><th>Team 1</th><th>Team 2</th><th>Umpire</th></tr>
                </thead>
                <tbody>${Story()}</tbody>
            </table>
        `
    ]
};

export const UpcomingRowOdd = {
    render: () => generateUpcomingRow(upcomingRowSample1, 1, 'test-tourney', false, 'm456'),
        decorators: [
        (Story) => `
            <table>
                <thead>
                    <tr><th>ID</th><th>Group</th><th>Category</th><th>Stage</th><th>Pitch</th><th>Time</th><th>Team 1</th><th>Team 2</th><th>Umpire</th></tr>
                </thead>
                <tbody>${Story()}</tbody>
            </table>
        `
    ]
};

export const UpcomingRowNextMatch = {
    render: () => generateUpcomingRow(upcomingRowSample1, 0, 'test-tourney', false, 'm123'), // firstMatchId matches row.id
        decorators: [
        (Story) => `
            <table>
                <thead>
                    <tr><th>ID</th><th>Group</th><th>Category</th><th>Stage</th><th>Pitch</th><th>Time</th><th>Team 1</th><th>Team 2</th><th>Umpire</th></tr>
                </thead>
                <tbody>${Story()}</tbody>
            </table>
        `
    ]
};

export const UpcomingRowTBDTeams = {
    render: () => generateUpcomingRow(upcomingRowSample2, 2, 'test-tourney', false, 'm456'),
        decorators: [
        (Story) => `
            <table>
                <thead>
                    <tr><th>ID</th><th>Group</th><th>Category</th><th>Stage</th><th>Pitch</th><th>Time</th><th>Team 1</th><th>Team 2</th><th>Umpire</th></tr>
                </thead>
                <tbody>${Story()}</tbody>
            </table>
        `
    ]
};

export const UpcomingRowHidden = {
    render: () => generateUpcomingRow(upcomingRowSample1, 0, 'test-tourney', true, 'm456'), // isHidden = true
        decorators: [
        (Story) => `
            <table>
                <thead>
                    <tr><th>ID</th><th>Group</th><th>Category</th><th>Stage</th><th>Pitch</th><th>Time</th><th>Team 1</th><th>Team 2</th><th>Umpire</th></tr>
                </thead>
                <tbody>${Story()}</tbody>
            </table>
        `
    ]
};


// --- Stories for generateFinishedRow ---

export const FinishedRowEven = {
    render: () => generateFinishedRow(finishedRowSample1, 0, false),
    decorators: [
        (Story) => `
            <table>
                <thead>
                    <tr><th>ID</th><th>Group</th><th>Category</th><th>Stage</th><th>Pitch</th><th>Time</th><th>Team 1</th><th>Score</th><th>Score</th><th>Team 2</th></tr>
                </thead>
                <tbody>${Story()}</tbody>
            </table>
        `
    ]
};

export const FinishedRowOddTeam2Wins = {
    render: () => generateFinishedRow(finishedRowSample2, 1, false),
    decorators: [
        (Story) => `
            <table>
                <thead>
                    <tr><th>ID</th><th>Group</th><th>Category</th><th>Stage</th><th>Pitch</th><th>Time</th><th>Team 1</th><th>Score</th><th>Score</th><th>Team 2</th></tr>
                </thead>
                <tbody>${Story()}</tbody>
            </table>
        `
    ]
};

export const FinishedRowNAScore = {
    render: () => generateFinishedRow(finishedRowSampleNA, 2, false),
    decorators: [
        (Story) => `
            <table>
                <thead>
                    <tr><th>ID</th><th>Group</th><th>Category</th><th>Stage</th><th>Pitch</th><th>Time</th><th>Team 1</th><th>Score</th><th>Score</th><th>Team 2</th></tr>
                </thead>
                <tbody>${Story()}</tbody>
            </table>
        `
    ]
};

export const FinishedRowHidden = {
    render: () => generateFinishedRow(finishedRowSample1, 0, true), // isHidden = true
    decorators: [
        (Story) => `
            <table>
                <thead>
                    <tr><th>ID</th><th>Group</th><th>Category</th><th>Stage</th><th>Pitch</th><th>Time</th><th>Team 1</th><th>Score</th><th>Score</th><th>Team 2</th></tr>
                </thead>
                <tbody>${Story()}</tbody>
            </table>
        `
    ]
};

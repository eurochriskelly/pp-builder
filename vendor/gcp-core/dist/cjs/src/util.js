"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeamIds = exports.calculateKnockoutStageFixtures = exports.calculateGroupStageFixtures = exports.addMinutes = exports.calculateNextGameStartTime = exports.assignTeamsToGroups = exports.shuffleArray = void 0;
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
exports.shuffleArray = shuffleArray;
/**
 * Given N teams, create M groups of teams.
 * Teams should be distributed as evenly as possible favouring
 * power of 2 numbers of groups.
 */
const assignTeamsToGroups = (teams, shuffle = false) => {
    const distributeEntries = (list, numArrays) => {
        const arrays = Array.from({ length: numArrays }, () => []);
        list.forEach((entry, index) => {
            const arrayIndex = index % numArrays;
            arrays[arrayIndex].push(entry);
        });
        return arrays;
    };
    let numTeams = teams.length;
    let numGroups = 1;
    if (numTeams >= 24) {
        numGroups = 8;
    }
    else {
        if (numTeams > 11) { // 11 is a special case because with 4 games one group 
            numGroups = 4; // has 2 which is too small, or 6 which is big. We favour 6.
        }
        else {
            if (numTeams >= 6) {
                numGroups = 2;
            }
        }
    }
    // Now deal the teams into groups.
    return distributeEntries(shuffle ? (0, exports.shuffleArray)(teams) : teams, numGroups);
};
exports.assignTeamsToGroups = assignTeamsToGroups;
const calculateNextGameStartTime = (start = "10:00", halfDuration = 12, breakDuration = 5) => {
    // Parse the start time into hours and minutes
    let [hours, minutes] = start.split(":").map((num) => parseInt(num, 10));
    // Add the break twice (for the referree!)
    const totalDuration = 2 * (halfDuration + breakDuration);
    // Add the total game duration to the start time
    minutes += totalDuration;
    // Round up to the next 5 minute interval if necessary
    if (minutes % 5 !== 0) {
        minutes += 5 - (minutes % 5);
    }
    // Convert minutes back into hours and minutes
    hours += Math.floor(minutes / 60);
    minutes %= 60;
    // Format hours and minutes to "HH:MM"
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    // Return the new time
    return `${formattedHours}:${formattedMinutes}`;
};
exports.calculateNextGameStartTime = calculateNextGameStartTime;
const addMinutes = (time, minsToAdd) => {
    const [hours, minutes] = time.split(":").map(Number);
    let newMinutes = minutes + minsToAdd;
    let newHours = hours + Math.floor(newMinutes / 60);
    newMinutes %= 60;
    newHours %= 24; // Reset to 0 if it goes to 24
    // Zero padding
    const formattedHours = newHours.toString().padStart(2, "0");
    const formattedMinutes = newMinutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}`;
};
exports.addMinutes = addMinutes;
/**
 * Generate matches for each group by a applying a Berger Table
 * @returns
 */
const calculateGroupStageFixtures = (category, groups, slack = [10, 10, 10, 10, 10, 10, 10], shuffle = false) => {
    let matches = [];
    let matchId = 1001;
    groups.forEach((teams, groupIndex) => {
        if (shuffle) {
            teams = (0, exports.shuffleArray)(teams);
        }
        if (teams.length % 2 !== 0) {
            teams.push(null); // Add a dummy team to make team count even
        }
        const totalRounds = teams.length - 1;
        const matchesPerRound = teams.length / 2;
        let roundTeams = [...teams]; // Copy teams to rotate for rounds
        let groupMatches = []; // Initialize an array to hold matches for the current group
        for (let round = 0; round < totalRounds; round++) {
            for (let match = 0; match < matchesPerRound; match++) {
                const team1 = roundTeams[match];
                const team2 = roundTeams[roundTeams.length - match - 1];
                if (team1 !== null && team2 !== null) { // Skip the dummy team's "match"
                    // FIXME: please use fixtures object
                    groupMatches.push({
                        matchId,
                        category,
                        offset: slack[teams.length - 2] * (round * matchesPerRound + match), // Example offset calculation
                        group: groupIndex,
                        position: groupIndex,
                        stage: 'group',
                        team1: team1,
                        team2: team2,
                        allottedTime: slack[teams.length - 2],
                    });
                    matchId++;
                }
            }
            // Rotate teams for the next round, keeping the first team fixed
            roundTeams = [roundTeams[0], ...roundTeams.slice(-1), ...roundTeams.slice(1, -1)];
        }
        // :DBG: console.table(groupMatches); // Add this line to check the generated matches for each group
        matches = [...matches, ...groupMatches];
    });
    return matches;
};
exports.calculateGroupStageFixtures = calculateGroupStageFixtures;
/**
 * Generate matches for a knockout stage
 */
const calculateKnockoutStageFixtures = (range, // e.g. [0, 3] for first 4 teams
groupSizes, slack = [15, 20, 30, 50]) => {
    /*
     if `groupSizes` are [5, 3, 3, 3], then the team positions are:
  
        G1 | G2 | G3 | G4
        ---+----+----+----
        1  | 2  | 3  | 4
        5  | 6  | 7  | 8
        8  | 9  | 10 | 11
        12 | -  | -  | -
        13 | -  | -  | -
    */
    const slackLookup = {
        eights: slack[0],
        quarters: slack[1],
        semis: slack[2],
        bronze: slack[2],
        finals: slack[3],
    };
    let matches = [];
    const numGroups = groupSizes.length;
    const numTeams = groupSizes.reduce((a, b) => a + b, 0);
    // See doc/knockouts.md for a detailed explanation of the algorithm
    const calcType = (stage, group, position) => ({
        type: 'calculated', stage, group, position
    });
    switch (numGroups) {
        case 2:
            matches = [
                {
                    stage: 'semis:1',
                    position: 1,
                    order: 0,
                    allottedTime: slackLookup.semis,
                    team1: calcType('group', 1, 1), // "Winner of Group 1"{
                    team2: calcType('group', 3, 1), // "Winner of Group 2"
                },
                {
                    stage: 'semis:2',
                    position: 2,
                    order: 0,
                    allottedTime: slackLookup.semis,
                    team1: calcType('group', 2, 1), // "~group:2/p:1", // "Winner of Group 2"
                    team2: calcType('group', 4, 1), // "~group:4/p:1", // "Winner of Group 4"
                },
                {
                    stage: 'bronze:1',
                    position: 1,
                    order: 1,
                    allottedTime: slackLookup.bronze,
                    team1: calcType('semis', 1, 2),
                    team2: calcType('semis', 2, 2),
                },
                {
                    stage: 'finals:1',
                    position: 1,
                    order: 1,
                    allottedTime: slackLookup.finals,
                    team1: calcType('semis', 1, 1),
                    team2: calcType('semis', 2, 1),
                },
            ];
            break;
        // TODO: 8 is usually not exactly 8 teams because its the last bracket in a blitz
        case 4:
            const teamIds = (0, exports.getTeamIds)(range, groupSizes);
            const addMatch = (stage, team1, team2) => {
                const parts = stage.split(':');
                const progression = parts[0];
                const position = parts[1];
                switch (progression) {
                    case 'quarters':
                        if (teamIds.includes(team1) && teamIds.includes(team2)) {
                            return {
                                stage,
                                position,
                                order: 0,
                                allottedTime: slackLookup[progression],
                                team1: calcType('group', team1, 1),
                                team2: calcType('group', team2, 2),
                            };
                        }
                        else {
                            return { team: team1, autoqual: true };
                        }
                        break;
                    case 'semis':
                        return {
                            stage,
                            position,
                            order: (typeof team1 === 'number' || typeof team2 === 'number') ? 1 : 0,
                            allottedTime: slackLookup[progression],
                            // some teams may automatically qualify
                            team1: typeof team1 === 'number'
                                ? calcType('quarters', team1, 1)
                                : calcType('group', team1.team, 1),
                            team2: typeof team2 === 'number'
                                ? calcType('quarters', team2, 1)
                                : calcType('group', team2.team, 1),
                        };
                        break;
                    case 'bronze':
                        return {
                            stage,
                            position,
                            order: 2,
                            allottedTime: slackLookup[progression],
                            team1: calcType('semis', team1, 2), // `~semis:${team1}/p:2`,
                            team2: calcType('semis', team2, 2), // `~semis:${team2}/p:2`,
                        };
                        break;
                    case 'finals':
                        return {
                            stage,
                            position,
                            order: 2,
                            allottedTime: slackLookup[progression],
                            team1: calcType('semis', team1, 1), // `~semis:${team1}/p:1`,
                            team2: calcType('semis', team2, 1), // `~semis:${team2}/p:1`,
                        };
                        break;
                    default:
                        throw new Error(`Unknown stage: ${stage}`);
                }
            };
            const q1 = addMatch('quarters:1', 1, 8);
            const q2 = addMatch('quarters:2', 3, 6);
            const q3 = addMatch('quarters:3', 2, 7);
            const q4 = addMatch('quarters:4', 4, 5);
            matches = [
                q1, q2, q3, q4,
                addMatch('semis:1', q1.autoqual ? q1 : 1, q2.autoqual ? q2 : 2), // quarters 1 vs 2
                addMatch('semis:2', q3.autoqual ? q3 : 3, q4.autoqual ? q4 : 4), // quarters 3 vs 4
                addMatch('bronze:1', 1, 2), // semis 1 vs 2
                addMatch('finals:1', 1, 2), // semis 3 vs 4
            ].filter(x => !x.autoqual).map(x => {
                return Object.assign(Object.assign({}, x), { groupSize: numTeams });
            });
            break;
    }
    return matches;
};
exports.calculateKnockoutStageFixtures = calculateKnockoutStageFixtures;
const getTeamIds = (range, groupSizes) => {
    // Calculate cumulative group sizes to understand group boundaries
    const cumulativeGroupSizes = groupSizes.map((sum => value => sum += value)(0));
    const start = range[0];
    const end = Math.min(range[1], cumulativeGroupSizes[cumulativeGroupSizes.length - 1] - 1);
    const result = [];
    for (let i = start; i <= end; i++) {
        let groupIndex = cumulativeGroupSizes.findIndex(cumulative => i < cumulative);
        let prevCumulative = groupIndex > 0 ? cumulativeGroupSizes[groupIndex - 1] : 0;
        let positionInGroup = i - prevCumulative;
        // Calculate the ID based on the group and position within the group
        let id = groupIndex * groupSizes[0] + positionInGroup + 1;
        result.push(id);
    }
    return result.map((_, i) => i + 1);
};
exports.getTeamIds = getTeamIds;

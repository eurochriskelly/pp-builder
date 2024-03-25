const readline = require('readline');
const yaml = require('js-yaml');
const { writeFileSync, readFileSync } = require('fs')
const Table = require('cli-table3'); // Require the cli-table3 library

const fixturesYamlPath = '/home/chris/Workspace/repos/gcp-events/events/t06/schedule.yaml';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const tournamentData = yaml.load(readFileSync(fixturesYamlPath, 'utf8'));

const main = () => {
    console.clear(); // Clear the screen
    // Display existing fixtures in a table format
    const table = new Table({
        head: ['StartTime', 'Pitch', 'Stage', 'Category', 'Group', 'Team1', 'Team2', 'Umpire', 'Duration'],
        colWidths: [11, 12, 12, 12, 10, 20, 20, 20, 12] // Adjust column widths as needed
    });
    tournamentData.schedule.fixtures.slice(-8).forEach(fixture => {
        table.push(fixture); // Add each fixture as a row in the table
    });
    console.log(table.toString()); // Print the table to the console
    nextFixture(main);
};

const nextFixture = (callback) => {
    const lastFixture = tournamentData.schedule.fixtures[tournamentData.schedule.fixtures.length - 1];
    const newFixture = [...lastFixture];
    newFixture[5] = "?"; // Reset Team1
    newFixture[6] = "?"; // Reset Team2
    newFixture[7] = "?"; // Reset UmpireTeam

    function askForDetails(index) {
        const teamName = (exclude = [], allGroups = false) => {
            let teams = [];
            if (allGroups) {
                // Iterate over all categories to include teams from each category, prepending the category name
                Object.keys(tournamentData.categories).forEach(categoryKey => {
                    const categoryGroups = tournamentData.categories[categoryKey];
                    Object.keys(categoryGroups).forEach(groupKey => {
                        const prefixedTeams = categoryGroups[groupKey].map(teamName => `${categoryKey}:${teamName}`);
                        teams = teams.concat(prefixedTeams);
                    });
                });
            } else {
                // Original logic for a specific group within the current category, no prefix needed
                const groups = tournamentData.categories[newFixture[3]];
                teams = groups[newFixture[4]];
            }
            return teams.filter(team => !exclude.some(excludeName => team.includes(excludeName))).sort();
        }


        const questions = [
            { label: 'STARTTIME', value: addThirtyMinutes(newFixture[0]) },
            { label: 'PITCH', value: newFixture[1], choices: tournamentData.pitches },
            { label: 'STAGE', value: newFixture[2], choices: ['group', 'knockout', 'semis', 'final'] },
            { label: 'CATEGORY', value: newFixture[3], choices: Object.keys(tournamentData.categories) },
            { label: 'GROUP', value: newFixture[4], choices: Object.keys(tournamentData.categories[newFixture[3]]) },
            { label: 'TEAM1', value: newFixture[5], choices: teamName },
            { label: 'TEAM2', value: newFixture[6], choices: teamName.bind(null, [newFixture[5]]) },
            { label: 'UMPIRE', value: newFixture[7], choices: teamName.bind(null, [newFixture[5], newFixture[6]], true) },
            { label: 'DURATION', value: newFixture[8], choices: [20, 15, 12, 10] },
        ];

        if (index >= questions.length) {
            console.log("Complete Fixture: ", newFixture);
            writeFileSync(fixturesYamlPath, '    - ' + JSON.stringify(newFixture).replace(/,/g, ', ') + '\n', { flag: 'a' });
            tournamentData.schedule.fixtures.push(newFixture);
            callback();
            return;
        }

        const question = questions[index];
        let prompt = `${question.label} (${yy(question.value !== "?" ? question.value : "not set")}): `;

        if (question.choices) {
            if (typeof question.choices === 'function') {
                question.choices = question.choices();
            }
            prompt += ` [${question.choices.map((x, i) => `\x1b[33m${i + 1}\x1b[0m` + '.' + x).join(", ")}] `;
        }

        rl.question(prompt, (answer) => {
            if (answer.trim() !== '') {
                if (question.choices) {
                    try {
                        const idxChoice = parseInt(answer, 10) - 1;
                        newFixture[index] = question.choices[idxChoice];
                    } catch (e) {
                        newFixture[index] = answer.trim()
                    }
                } else {
                    newFixture[index] = answer.trim();
                }
                // print the new value in blue without newline at start
                console.log('  ' + bb(newFixture[index]))
            } else {
                console.log('setting value to', question.value)
                newFixture[index] = question.value;
            }
            askForDetails(index + 1);
        });
    }
    askForDetails(0);
}


const addThirtyMinutes = (time) => {
    // Split the time string into hours and minutes
    const parts = time.split(':');
    let hours = parseInt(parts[0], 10);
    let minutes = parseInt(parts[1], 10);

    // Add 30 minutes
    minutes += 30;

    // Adjust hours and minutes if overflow occurs
    if (minutes >= 60) {
        hours += 1;
        minutes -= 60;
    }

    // Adjust for the next day
    if (hours >= 24) {
        hours -= 24;
    }

    // Format hours and minutes to two digits
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    // Return the updated time
    return `${formattedHours}:${formattedMinutes}`;
}


// make text red
const rr = (text) => `\x1b[31m${text}\x1b[0m`;
const bb = (text) => `\x1b[34m${text}\x1b[0m`;
const gg = (text) => `\x1b[32m${text}\x1b[0m`;
const yy = (text) => `\x1b[33m${text}\x1b[0m`;
const mm = (text) => `\x1b[35m${text}\x1b[0m`;

main()
import readline from 'readline';
import chalk from 'chalk';
import * as yaml from 'js-yaml';
import { validation } from 'gcp-core'
import { writeFileSync, readFileSync } from 'fs';
import Table from 'cli-table3'; // Updated import syntax for TypeScript

const { green, yellow } = chalk;

interface Fixture {
    startTime: string;
    pitch: string;
    stage: string;
    category: string;
    group: string;
    team1: string;
    team2: string;
    umpire: string;
    duration: number;
}

const fixturesYamlPath = '/home/chris/Workspace/repos/gcp-events/events/t06/schedule.yaml';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

interface ITData { 
    schedule: {
        fixtures: Fixture[] 
    },
    categories: any,
    pitches: string[],
    stages: string[]
} 
const tournamentData: any = yaml.load(readFileSync(fixturesYamlPath, 'utf8'));

export const recursiveAddFixture = () => {
    console.clear();
    const table = new Table({
        head: ['StartTime', 'Pitch', 'Stage', 'Category', 'Group', 'Team1', 'Team2', 'Umpire', 'Duration'],
        colWidths: [11, 12, 12, 12, 10, 20, 20, 20, 12]
    });

    tournamentData.schedule.fixtures.slice(-8).forEach((fixture: Fixture) => {
        table.push([
            fixture.startTime,
            fixture.pitch,
            fixture.stage,
            fixture.category,
            fixture.group,
            fixture.team1,
            fixture.team2,
            fixture.umpire,
            fixture.duration.toString()
        ]);
    });
    console.log(table.toString());
    nextFixture(recursiveAddFixture);
};

const nextFixture = (callback: () => void) => {
    const lastFixture = tournamentData.schedule.fixtures[tournamentData.schedule.fixtures.length - 1];
    const newFixture = [...Object.values(lastFixture)];
    newFixture[5] = "?"; 
    newFixture[6] = "?"; 
    newFixture[7] = "?"; 

    function askForDetails(index: number) {
        const teamName = (stage: string, exclude: string[] = [], allGroups = false): string[] => {
            let teams: string[] = [];
            if (stage === 'group') {
                if (allGroups) {
                    Object.keys(tournamentData.categories).forEach(categoryKey => {
                        const categoryGroups = tournamentData.categories[categoryKey];
                        Object.keys(categoryGroups).forEach(groupKey => {
                            const prefixedTeams = categoryGroups[groupKey].map((teamName: string) => `${categoryKey}:${teamName}`);
                            teams = teams.concat(prefixedTeams);
                        });
                    });
                } else {
                    const groups = tournamentData.categories[newFixture[3] as string];
                    teams = groups[newFixture[4] as string];
                }
                return teams.filter(team => !exclude.some(excludeName => team.includes(excludeName))).sort();
            } else {
                return [
                    // Placeholder options for other stages
                ]
            }
        }

        // Define choices dynamically based on user input and scenario
        const questions = [
            { label: 'START_TIME', value: addThirtyMinutes(newFixture[0] as string) },
            { label: 'PITCH', value: newFixture[1], choices: tournamentData.pitches },
            { label: 'STAGE', value: newFixture[2], choices: tournamentData.stages },
            { label: 'CATEGORY', value: newFixture[3], choices: Object.keys(tournamentData.categories) },
            { label: 'STAGE_ORDER', value: newFixture[4], choices: Object.keys(tournamentData.categories[newFixture[3] as string]) },
            { label: 'TEAM1', value: newFixture[5], choices: teamName(newFixture[2] as string) },
            { label: 'TEAM2', value: newFixture[6], choices: teamName(newFixture[2] as string, [newFixture[5] as string]) },
            { label: 'UMPIRE', value: newFixture[7], choices: teamName(newFixture[2] as string, [newFixture[5] as string, newFixture[6] as string], true) },
            { label: 'DURATION', value: newFixture[8], choices: [20, 15, 12, 10] },
        ];

        if (index >= questions.length) {
            console.log("Complete Fixture: ", newFixture);
            writeFileSync(fixturesYamlPath, '    - ' + JSON.stringify(newFixture).replace(/,/g, ', ') + '\n', { flag: 'a' });
            tournamentData.schedule.fixtures.push(newFixture as any);
            callback();
            return;
        }

        const question = questions[index];
        let prompt = `${green(question.label)} (${yellow(question.value !== "?" ? question.value : "not set")}): `;

        if (question.choices) {
            prompt += ` [${question.choices.map((x, i) => `\x1b[33m${i + 1}\x1b[0m` + '.' + x).join(", ")}] `;
        }

        rl.question(prompt, (answer) => {
            if (answer.trim() !== '') {
                const idxChoice = parseInt(answer, 10) - 1;
                newFixture[index] = question.choices ? question.choices[idxChoice] : answer.trim();
            } else {
                newFixture[index] = question.value;
            }
            askForDetails(index + 1);
        });
    }
    askForDetails(0);
}

const addThirtyMinutes = (time: string): string => {
    const parts = time.split(':');
    let hours = parseInt(parts[0], 10);
    let minutes = parseInt(parts[1], 10);

    minutes += 30;

    if (minutes >= 60) {
        hours += 1;
        minutes -= 60;
    }

    if (hours >= 24) {
        hours -= 24;
    }

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
}




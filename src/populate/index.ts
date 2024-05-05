import readline from 'readline';
import * as yaml from 'js-yaml';
import { validation } from 'gcp-core'
import { writeFileSync, readFileSync } from 'fs';
import Table from 'cli-table3'; // Updated import syntax for TypeScript

const { validateFixtures } = validation;
var tournamentData: any = {};
const fixturesYamlPath = '/tmp/fixtures.yaml';

const green = (text: any) => `\x1b[32m${text}\x1b[0m`;
const yellow = (text: any) => `\x1b[33m${text}\x1b[0m`;

interface Fixture {
    matchId: number;
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

export const populate = async (schedule: string) => {
    console.log(`Loading file [${schedule}]`)
    const tdata: any = yaml.load(readFileSync(schedule, 'utf8')) as ITData;
    console.log('tdata contains')
    console.log(tdata)
    const issues: string[] = [];
    validateFixtures(tdata, issues);
    if (issues.length > 0) {
        console.log(yellow('Validation issues found in fixtures.yaml'))
        issues.forEach(issue => console.error(issue));
        console.log('')
        process.exit(1);
    }
    tournamentData = tdata;
    await recursiveAddFixture();
}

export const recursiveAddFixture = async () => {
    console.clear();
    const table = new Table({
        head: [
          'StartTime', 'Pitch', 'Stage', 'Category',
          'Group', 'Team1', 'Team2', 'Umpire', 'Duration'
        ],
        colWidths: [11, 12, 12, 12, 10, 20, 20, 20, 12]
    });

    tournamentData.activities.forEach((fixture: Fixture) => {
        table.push([
            fixture.matchId,
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
    await nextFixture(recursiveAddFixture);
};

const nextFixture = async (callback: () => void) => {
    const { categories, activities, pitches, stages } = tournamentData;
    const defaultFixture: Fixture = { 
        matchId: 0,
        startTime: '08:00',
        pitch: pitches[0].name,
        stage: 'group',
        category: Object.keys(categories)[0],
        group: '1',
        team1: '?',
        team2: '?',
        umpire: '?',
        duration: 20 
    }
    const lastFixture = activities.length 
        ? activities[activities.length - 1]
        : defaultFixture;

    const newFixture: any = JSON.parse(JSON.stringify(lastFixture)) as Fixture;
    newFixture.matchId = newFixture.matchId + 1;
    newFixture.team1 = "?"; 
    newFixture.team2 = "?"; 
    newFixture.umpire = "?"; 

    async function askForDetails(index: number) {

        // Define choices dynamically based on user input and scenario
        const questions = [
            { label: 'MATCH_ID', value: newFixture.matchId},
            { label: 'START_TIME', value: addMinutes(newFixture.startTime, '30'), process: adjustMinutes },
            { label: 'PITCH', value: newFixture.pitch, choices: pitches
                .map((p:any) => p.name)
                .filter((p:any, index:number) => categories[newFixture.category].pitches.includes(index))
            },
            { label: 'STAGE', value: newFixture.stage, choices: stages },
            { label: 'CATEGORY', value: newFixture.category, choices: Object.keys(categories) },
            { label: 'STAGE_ORDER', value: newFixture.group, choices: [1,2,3,4,5,6] },
            { label: 'TEAM1', value: newFixture.team1, choices: teamName(categories, newFixture) },
            { label: 'TEAM2', value: newFixture.team2, choices: teamName(categories, newFixture, [newFixture.team1]) },
            { label: 'UMPIRE', value: newFixture.umpire, choices: teamName(categories, newFixture, [newFixture.team1, newFixture.team2], true) },
            { label: 'DURATION', value: newFixture.duration, choices: [30, 20, 15, 12, 10] },
        ];

        if (index >= questions.length) {
            console.log("Complete Fixture: ", newFixture);
            writeFileSync(fixturesYamlPath, '    - ' + JSON.stringify(newFixture).replace(/,/g, ', ') + '\n', { flag: 'a' });
            activities.push(newFixture as any);
            callback();
            return;
        }

        const question = questions[index];
        let prompt = `${green(question.label)} (${yellow(question.value !== "?" ? question.value : "not set")}): `;

        if (question.choices) {
            prompt += ` [${question.choices.map((x: string, i: number) => `\x1b[33m${i + 1}\x1b[0m` + '.' + x).join(", ")}] `;
        }

        const keys = Object.keys(newFixture);
        rl.question(prompt, (answer) => {
            let ans
            if (answer.trim() !== '') {
                const idxChoice = parseInt(answer, 10) - 1;
                ans = question.choices ? question.choices[idxChoice] : answer.trim();
            } else {
                ans = question.value;
            }
            if (!question.process) {
                newFixture[keys[index]] = ans;
            } else {
                newFixture[keys[index]] = question.process(newFixture, ans);
            }
            askForDetails(index + 1);
        });
    }
    await askForDetails(0);
}

export const teamName = (
    categories: any,
    fixture: Fixture,
    exclude: string[] = [],
    allGroups = false
): string[] => {
    const { category, stage } = fixture;
    let currteams: string[] = [];
    if (stage === 'group') {
        if (allGroups) {
            Object.keys(categories).forEach(categoryKey => {
                const categoryGroups = categories[categoryKey];
                Object.keys(categoryGroups).forEach(groupKey => {
                    const prefixedTeams = categoryGroups[groupKey].map((teamName: string) => `${categoryKey}:${teamName}`);
                    currteams = currteams.concat(prefixedTeams);
                });
            });
        } else {
            const { groups, teams } = categories[category];
        }
        return []
    } else {
        return [
            // Placeholder options for other stages
        ]
    }
}

const adjustMinutes = (newFixtures: Fixture, ans: string) => {
    if (ans[0] === '-' || ans[0] === '+') {
        return addMinutes(newFixtures.startTime, ans);
    }
    return ans;
}

const addMinutes = (time: string, offset: string): string => {
    const parts = time.split(':');
    let hours = parseInt(parts[0], 10);
    let minutes = parseInt(parts[1], 10);
    minutes += parseInt(offset);

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


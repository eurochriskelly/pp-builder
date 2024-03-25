const readline = require('readline');
const { tournamentData } = require('./test-data');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const main = () => {
    const options = [
        {
            label: '1. Add a new fixture',
            action: () => {
                nextFixture(() => {
                    console.log(' back again');
                    main();
                });
            }
        },
        { label: '2. Exit', action: () => rl.close() }
    ];

    console.log("\nWhat would you like to do?");
    options.forEach(option => console.log(option.label));

    rl.question("Enter your choice: ", (answer) => {
        console.log("You chose: ", answer);
        const choice = parseInt(answer, 10);
        if (choice >= 1 && choice <= options.length) {
            options[choice - 1].action();
        } else {
            console.log("Invalid choice, please try again.");
            main(); // Call main again to ask for the next action
        }
    });
};

const nextFixture = (callback) => {
    const lastFixture = tournamentData.schedule.fixtures[tournamentData.schedule.fixtures.length - 1];
    const newFixture = [...lastFixture];
    newFixture[0] = "?"; // Reset start time
    newFixture[5] = "?"; // Reset Team1
    newFixture[6] = "?"; // Reset Team2
    newFixture[7] = "?"; // Reset UmpireTeam

    function askForDetails(index) {
        const questions = [
            { label: 'STARTTIME', value: newFixture[0] },
            { label: 'PITCH', value: newFixture[1] },
            { label: 'STAGE', value: newFixture[2] },
            { label: 'CATEGORY', value: newFixture[3], choices: Object.keys(tournamentData.categories) },
            { label: 'GROUP', value: newFixture[4] },
            { label: 'TEAM1', value: newFixture[5] },
            { label: 'TEAM2', value: newFixture[6] },
            { label: 'UMPIRE', value: newFixture[7] },
            { label: 'DURATION', value: newFixture[8] }
        ];

        if (index >= questions.length) {
            console.log("Complete Fixture: ", newFixture);
            tournamentData.schedule.fixtures.push(newFixture);
            callback(); // Call the callback function after all questions are answered
            return;
        }

        const question = questions[index];
        let prompt = `${question.label} (${question.value !== "?" ? question.value : "not set"}): `;

        if (question.choices) {
            prompt += `Choose from [${question.choices.join(", ")}] `;
        }

        rl.question(prompt, (answer) => {
            if (answer.trim() !== '') {
                newFixture[index] = answer;
            }
            askForDetails(index + 1);
        });
    }

    console.log("Filling out next fixture details:");
    askForDetails(0);
}


main()
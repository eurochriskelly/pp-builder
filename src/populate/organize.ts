import {
    Tournament, TournamentOrganize,
    ITournament, validation
} from "gcp-core";

const { validateFixtures } = validation;

export const organize = (tdata: ITournament) => {
    console.log('Organizing fixtures')
    try {
        const data = tdata;
        const issues: string[] = [];
        if (!validateFixtures(data, issues)) {
            console.log(`Issues found: `)
            issues.forEach(issue => console.log('  WARNING: ' + issue))
            console.log('')
            throw new Error('Invalid fixtures')
        }
        console.log('Building tournament')
        console.log(Tournament)
        debugger
        const T = new Tournament(data);
        console.log('Organizing tournament')
        const TO = new TournamentOrganize(T); 
        TO.generate()
        T.prettyPrintActivities()        
    } catch (e) {
        console.error(e);
    }
}
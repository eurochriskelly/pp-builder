import { teamName } from ".";

describe('populate functions', () => {
    it('gets team names', () => {
        const categories = {
            'Mens': {
                teams: ['Team1', 'Team2', 'Team3', 'Team4'],
                groups: [[1, 2],[0, 4]],
            }
        }
        const newFixture = {
            matchId: 0,
            startTime: '10:00',
            pitch: 'Field 1',
            stage: 'group',
            category: 'Mens',
            group: '1', 
            team1: 'Team1',
            team2: 'Team2',
            umpire: 'Team3',
            duration: 20
        }
        const tn = teamName(categories, newFixture, [], false)
        console.log(tn)

    })
})
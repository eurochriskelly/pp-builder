import type { ITournament } from "../types"

export const validateFixtures = (data: any, issues: string[]) => {
    const valid = checkKeys(data, issues)
    return valid
}

// Checks
export const checkKeys = (data: any, issues: string[] = []) => {
    const keys = ['tournamentId', 'pitches', 'categories', 'activities']
    const missingKeys = keys.filter((key: any) => !data[key])
    if (missingKeys.length) {
        issues.push(`Missing keys: ${missingKeys.join(', ')}`)
    }
    return !issues.length
}


export const checkPitches = (data: any, issues: string[] = []) => {
    return data?.schedule.fixtures.every((fixture: any) => {
        const [, , pitch] = fixture
        if (!data.pitches.includes(pitch)) {
            issues.push(`Pitch ${pitch} not defined`)
            return false
        }
        return true
    })
}

export const checkTeams = (data: any, issues: string[] = []) => {
    // for each fixture, check that the tema matches the name defined in categories
    return data?.schedule.fixtures.every((fixture: any) => {
        const [, , , , category, group, team1, team2, umpireTeam] = fixture
        const g = 'o' + group
        if (!data.categories[category]) {
            issues.push(`Category ${category} not defined`)
            return false
        }

        if (!(data.categories[category][g])) {
            issues.push(`Group ${group} not defined in ${category}`)
            return false
        }
        if (!data.categories[category][g].includes(team1)) {
            if (!team1.startsWith('~')) {
                issues.push(`Team ${team1} not defined in ${category} ${g}`)
            }
        }
        if (!data.categories[category][g].includes(team2)) {
            if (!team2.startsWith('~')) {
                issues.push(`Team ${team2} not defined in ${category} ${g}`)
            }
        }
        return !issues.length
    })
}

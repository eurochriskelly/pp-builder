"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTeams = exports.checkPitches = exports.checkKeys = exports.validateFixtures = void 0;
const validateFixtures = (data, issues) => {
    const valid = (0, exports.checkKeys)(data, issues);
    return valid;
};
exports.validateFixtures = validateFixtures;
// Checks
const checkKeys = (data, issues = []) => {
    const keys = ['tournamentId', 'pitches', 'categories', 'activities'];
    const missingKeys = keys.filter((key) => !data[key]);
    if (missingKeys.length) {
        issues.push(`Missing keys: ${missingKeys.join(', ')}`);
    }
    return !issues.length;
};
exports.checkKeys = checkKeys;
const checkPitches = (data, issues = []) => {
    return data === null || data === void 0 ? void 0 : data.schedule.fixtures.every((fixture) => {
        const [, , pitch] = fixture;
        if (!data.pitches.includes(pitch)) {
            issues.push(`Pitch ${pitch} not defined`);
            return false;
        }
        return true;
    });
};
exports.checkPitches = checkPitches;
const checkTeams = (data, issues = []) => {
    // for each fixture, check that the tema matches the name defined in categories
    return data === null || data === void 0 ? void 0 : data.schedule.fixtures.every((fixture) => {
        const [, , , , category, group, team1, team2, umpireTeam] = fixture;
        const g = 'o' + group;
        if (!data.categories[category]) {
            issues.push(`Category ${category} not defined`);
            return false;
        }
        if (!(data.categories[category][g])) {
            issues.push(`Group ${group} not defined in ${category}`);
            return false;
        }
        if (!data.categories[category][g].includes(team1)) {
            if (!team1.startsWith('~')) {
                issues.push(`Team ${team1} not defined in ${category} ${g}`);
            }
        }
        if (!data.categories[category][g].includes(team2)) {
            if (!team2.startsWith('~')) {
                issues.push(`Team ${team2} not defined in ${category} ${g}`);
            }
        }
        return !issues.length;
    });
};
exports.checkTeams = checkTeams;

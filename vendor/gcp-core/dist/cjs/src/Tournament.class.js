"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Tournament {
    constructor(tdata) {
        this.tournamentId = 0;
        this.description = "New tournament";
        this.startDate = new Date();
        this.location = {};
        this.venues = [];
        this.pitches = [];
        this.categories = {};
        this.activities = [];
        if (tdata) {
            this.load(tdata);
        }
    }
    get data() {
        const data = Object.assign({ isValid: false }, this);
        data.isValid = true;
        return data;
    }
    get categoryNames() {
        return Object.keys(this.categories);
    }
    get categoryPairs() {
        return this.categoryNames.map(name => ({ name, code: name.replace(/[^A-Z0-9]/g, "") }));
    }
    get bracketNames() {
        return this.categoryNames
            .map((cat) => [cat, Object.keys(this.categories[cat].rules.elimination.brackets)])
            .reduce((acc, [cat, brackets]) => {
            acc[cat] = brackets;
            return acc;
        }, {});
    }
    get groupSizes() {
        return this.categoryNames
            .map((cat) => [cat, this.categories[cat].groups.map(g => g.length)])
            .reduce((acc, [cat, sizes]) => {
            acc[cat] = sizes;
            return acc;
        }, {});
    }
    fixturesAppend(fixtures) {
        this.activities = [
            ...this.activities,
            ...fixtures.map(f => new Fixture(f)),
        ];
    }
    addPitch(pitch) {
        this.pitches.push(pitch);
    }
    removePitch(pitch) {
        // remove this pitch by name from the list 
        this.pitches = this.pitches.filter(p => p.name !== pitch.name);
    }
    getTeams(category) {
        var _a;
        return (_a = this.categories[category]) === null || _a === void 0 ? void 0 : _a.teams;
    }
    getTeamPairs(category) {
        var _a;
        return (_a = this.getTeams(category)) === null || _a === void 0 ? void 0 : _a.map((name, code) => ({ name, code }));
    }
    addCategory(category) {
        this.categories[category] = {
            teams: [],
            pitches: [],
            rules: {
                preliminary: {},
                elimination: {
                    brackets: {},
                },
            },
            groups: [],
        };
    }
    addTeam(teamName, category) {
        // groups must be positive integers
        this.assertCategory(category);
        this.assertTeamIsNew(teamName, category);
        this.categories[category].teams.push(teamName);
    }
    swapTeams(team1, team2, category) {
        this.assertCategory(category);
        this.assertTeamExists(team1, category);
        this.assertTeamExists(team2, category);
        // Find which group team1 is in and replace with team2
        // Find which group team2 is in and replace with team1
        // Swap all instances of team1 with team2 in fixtures of this cateogry
        // Swap all instances of team2 with team1 in fixtures of this category
    }
    clearActivities() {
        this.activities = [];
    }
    addFixture(fix) {
        this.activities.push(fix);
    }
    load(tdata) {
        const { tournamentId, description, startDate, venues, pitches, location, categories, activities, } = tdata;
        this.tournamentId = tournamentId;
        this.description = description;
        this.location = location;
        this.startDate = startDate;
        this.pitches = pitches;
        this.venues = venues;
        this.categories = categories;
        this.activities = activities;
    }
    filterActivities(filter) {
        return this.activities.filter(filter);
    }
    updateLetters() {
        // Update the letters for each fixture
        this.activities.forEach((f, i) => {
            const { team1, team2, category } = f;
            const index1 = this.categories[category].teams.indexOf(team1);
            const index2 = this.categories[category].teams.indexOf(team2);
            let l = String.fromCharCode(65 + index1);
            if (l !== '@')
                f.letter1 = l;
            l = String.fromCharCode(65 + index2);
            if (l !== '@')
                f.letter2 = l;
        });
    }
    // OUTPUT
    prettyPrintActivities(filter = () => true) {
        console.table(this.activities
            .filter(filter)
            .map(a => a.repr.split('|').map((x) => x == 'undefined' ? null : x)));
    }
    // ASSERTIONS
    assertCategory(cat) {
        const names = this.categoryNames;
        if (!names.includes(cat)) {
            throw new Error(`Bad category [${cat}]. Possible categories include [${names.join(',')}]`);
        }
    }
    assertTeamExists(teamName, category) {
        if (!this.categories[category].teams.includes(teamName)) {
            throw new Error(`Team [${teamName}] dows not exist in category [${category}]`);
        }
    }
    assertTeamIsNew(teamName, category) {
        if (this.categories[category].teams.includes(teamName)) {
            throw new Error(`Team [${teamName}] already exists in category [${category}]`);
        }
    }
    assertGroup(groupNumber, category) {
        const groupName = `g${groupNumber}`;
        const categoryGroups = this.categories[category];
        if (!(groupName in categoryGroups)) {
            throw new Error(`Group g${groupName} does not exist in category [${category}]`);
        }
    }
}
exports.default = Tournament;

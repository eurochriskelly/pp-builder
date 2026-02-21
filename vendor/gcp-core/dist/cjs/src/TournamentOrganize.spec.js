"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_data_1 = __importDefault(require("../test/test-data"));
const Tournament_class_1 = __importDefault(require("./Tournament.class"));
const TournamentOrganize_class_1 = __importDefault(require("./TournamentOrganize.class"));
const tournament_1 = test_data_1.default.tournaments["t1"];
const tournament_2 = test_data_1.default.tournaments["t2"];
const tournament_3 = test_data_1.default.tournaments["t3"];
const tournament_4 = test_data_1.default.tournaments["t4"];
describe('TournamentOrganize', () => {
    it("can assign teams to groups", () => {
        const cat = 'Mens';
        const T = new Tournament_class_1.default(tournament_1);
        const TO = new TournamentOrganize_class_1.default(T);
        expect(T.categories[cat].groups.length).toBe(0);
        TO.assignTeamsToGroups(cat);
        expect(T.categories[cat].groups).not.toBeFalsy();
    });
    it("generates fixtures for all knockout stages", () => {
        const T = new Tournament_class_1.default(tournament_1);
        const TO = new TournamentOrganize_class_1.default(T);
        const cat = 'Mens';
        TO.assignTeamsToGroups(cat);
        const { groups } = T.categories[cat];
        const matches = TO.generateKnockoutFixtures(cat, groups);
        expect(matches.length).toBeGreaterThan(0);
    });
});
describe('End to end tournament organization', () => {
    it('completes the definition of a tournament from a minimal rules input', () => {
        const T = new Tournament_class_1.default(tournament_1);
        const TO = new TournamentOrganize_class_1.default(T);
        TO.generate();
        expect(true).toBe(true);
        // T.prettyPrintActivities((f, i) => i > 27 && i < 35)
        // console.log(JSON.stringify(T.activities))
        // expect teams to be placed in groups
        // expect multiple fixtures
        // expect group fixtures to be set out
        // expect knockout fixtures to be calculated also
        // expect schedule to be set for all games
    });
});

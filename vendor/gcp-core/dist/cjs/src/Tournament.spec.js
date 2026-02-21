"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_data_1 = __importDefault(require("../test/test-data"));
const Tournament_class_1 = __importDefault(require("./Tournament.class"));
const tournament_1 = test_data_1.default.tournaments["t1"];
describe("Tournament", () => {
    it("can load a tournament and export as is", () => {
        const T = new Tournament_class_1.default();
        T.load(tournament_1);
        const tdata = T.data;
        expect(tdata.isValid).toBe(true);
    });
    it("can add a new cateogry", () => {
        const T = new Tournament_class_1.default(tournament_1);
        const numCatsBefore = Object.keys(tournament_1.categories).length;
        T.addCategory("Mixed");
        const tdata = T.data;
        const numCatsAfter = Object.keys(tdata.categories).length;
        expect(numCatsAfter).toBeGreaterThan(numCatsBefore);
    });
    it("can add new teams", () => {
        const T = new Tournament_class_1.default();
        T.load(tournament_1);
        const numTeams1 = T.categories['Mens'].teams.length;
        T.addTeam('Foo', 'Mens');
        T.addTeam('Bar', 'Mens');
        T.addTeam('Baz', 'Mens');
        const numTeams2 = T.categories['Mens'].teams.length;
        expect(numTeams2).toBeGreaterThan(numTeams1);
        expect(numTeams2).toBe(numTeams1 + 3);
    });
    it("can swap teams", () => { });
    it("throws errors if teams, categories or groups do not exist", () => { });
});

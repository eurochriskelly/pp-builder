"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Tournament_class_1 = __importDefault(require("./Tournament.class"));
const PitchAllocator_class_1 = __importDefault(require("./PitchAllocator.class"));
const test_data_1 = __importDefault(require("../test/test-data"));
const { fixtures, tournaments } = test_data_1.default;
describe("PitchAllocator", () => {
    it("can allocate pitches to games in a group stage for a given category", () => {
        const T = new Tournament_class_1.default(tournaments.t1);
        T.clearActivities();
        T.fixturesAppend(fixtures.f1);
        const PA = new PitchAllocator_class_1.default(T);
        PA.allocate("Mens");
        PA.allocate("Ladies");
        // T.prettyPrintActivities((f) => f.pitch === "Pitch 1");
        // T.prettyPrintActivities((f) => f.pitch === "Pitch 4");
    });
});

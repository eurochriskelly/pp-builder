import Tournament from "./Tournament.class";
import PitchAllocator from "./PitchAllocator.class";
import TEST_DATA from "../test/test-data";
const { fixtures, tournaments } = TEST_DATA;
describe("PitchAllocator", () => {
    it("can allocate pitches to games in a group stage for a given category", () => {
        const T = new Tournament(tournaments.t1);
        T.clearActivities();
        T.fixturesAppend(fixtures.f1);
        const PA = new PitchAllocator(T);
        PA.allocate("Mens");
        PA.allocate("Ladies");
        // T.prettyPrintActivities((f) => f.pitch === "Pitch 1");
        // T.prettyPrintActivities((f) => f.pitch === "Pitch 4");
    });
});

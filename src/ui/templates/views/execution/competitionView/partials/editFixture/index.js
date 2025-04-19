/**
 * Generates an HTML form for editing a fixture.
 * @param {Object} fixture - Fixture data.
 * @returns {string} HTML string for the edit form.
 */
function generateEditFixtureForm(fixture = {}) {
    const {
        id = '',
        team1 = '',
        team2 = '',
        goals1 = 0,
        points1 = 0,
        goals2 = 0,
        points2 = 0,
        pitch = '',
        time = ''
    } = fixture;

    return `<div>
        <!-- load fixture-row webcomponent -->
        <script type="module" src="/scripts/webcomponents/fixture-row.js"></script>
        <link rel="stylesheet" href="/styles/editFixture.style.css">

        <!-- display current fixture as a row -->
        <fixture-row
          row-index="0"
          team1="${team1}"
          team1-goals="${goals1}"
          team1-points="${points1}"
          team2="${team2}"
          team2-goals="${goals2}"
          team2-points="${points2}"
          outcome="${(goals1 + points1 + goals2 + points2) > 0 ? 'played' : ''}"
          match-id="${id}"
          stage="edit"
          stage-level=""
          category=""
        ></fixture-row>

        <form id="edit-fixture-form">
        <input type="hidden" name="id" value="${id}" />
        <label>Team 1:
            <input type="text" name="team1" value="${team1}" />
        </label>
        <label>Goals 1:
            <input type="number" name="goals1" value="${goals1}" />
        </label>
        <label>Points 1:
            <input type="number" name="points1" value="${points1}" />
        </label>
        <label>Team 2:
            <input type="text" name="team2" value="${team2}" />
        </label>
        <label>Goals 2:
            <input type="number" name="goals2" value="${goals2}" />
        </label>
        <label>Points 2:
            <input type="number" name="points2" value="${points2}" />
        </label>
        <label>Pitch:
            <input type="text" name="pitch" value="${pitch}" />
        </label>
        <label>Time:
            <input type="datetime-local" name="time" value="${time}" />
        </label>
        <button type="submit">Save Fixture</button>
        </form>
    </div>`;
}

module.exports = generateEditFixtureForm;

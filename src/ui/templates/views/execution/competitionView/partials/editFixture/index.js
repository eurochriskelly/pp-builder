/*

Layout:


Wireframe see (wireframe.md):

<fixture-row .. />
div: Has 2 children side by side
  div: (this div is on the left hand side)
        "Team 1 details":
        [ Team 1 name ! ]
        [ Team 1 goals  ]
        [ Team 1 points ]
   div: (this div is on the right hand side)
        "Team 2 details": 
        [ Team 2 name ! ]
        [ Team 2 goals ]
        [ Team 2 points ]

"On pitch" [ Pitch name ! ]
[ Move after ! ] 
"Fixture" [ Select fixture ! ]

<update> <close>
*/



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
        goals1 = 2,
        points1 = 0,
        goals2 = 3,
        points2 = 0,
        stage = 'group',
        stageLevel = 0,
        groupName = '3',
        pitch = '',
        time = '',
        moveAfter = ''
    } = fixture;

    return `<div class="fixture-dialog">
        <script type="module" src="/scripts/webcomponents/fixture-row.js"></script>
        <link rel="stylesheet" href="/styles/editFixture.style.css">

        <div class="fixture-row">
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
              stage="${stage}"
              stage-level="${stageLevel}"
              category="${groupName || ''}"
            ></fixture-row>
        </div>

        <div class="team-details">
            <h3>My group</h3>
            <table>
                <tr>
                    <td>_</td>
                    <td>Team 1</td>
                    <td>Team 2</td>
                </tr>
                <tr>
                    <td>Name</td>
                    <td><input type="text" name="team1" value="${team1}" /></td>
                    <td><input type="text" name="team2" value="${team2}" /></td>
                </tr>
                <tr>
                    <td>Goals</td>
                    <td><input type="number" name="goals1" value="${goals1}" /></td>
                    <td><input type="number" name="goals2" value="${goals2}" /></td>
                </tr>
                <tr>
                    <td>Points</td>
                    <td><input type="number" name="points1" value="${points1}" /></td>
                    <td><input type="number" name="points2" value="${points2}" /></td>
                </tr>
            </table>
            <div class="actions">
                <button type="button">Update</button>
                <button type="button">Cancel</button>
            </div>
        </div>

        <div class="adjust-fixture">
            <h3>Adjust fixture</h3>
            <form>
                <label>On pitch: <input type="text" name="pitch" value="${pitch}" /></label>
                <label>Destination: <input type="text" name="moveAfter" value="${moveAfter}" /></label>
                <label>With fixture: <input type="text" name="fixture" value="#${id} - ${groupName} - ${team1} vs ${team2}" /></label>
                <div class="actions">
                    <button type="submit">Update</button>
                    <button type="button">Cancel</button>
                </div>
            </form>
        </div>
    </div>`;
}

module.exports = generateEditFixtureForm;

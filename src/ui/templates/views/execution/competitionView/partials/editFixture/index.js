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
        <!-- fixture-row -->
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
          stage="${stage}"
          stage-level="${stageLevel}"
          category="${groupName || ''}"
        ></fixture-row>

        <!-- Group summary -->
        <div class="dialog-section group-section">
          <table class="team-summary">
            <thead>
              <tr><th></th><th>Team 1</th><th>Team 2</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Name</td>
                <td><input type="text" name="team1" value="${team1}" required /></td>
                <td><input type="text" name="team2" value="${team2}" required /></td>
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
            </tbody>
          </table>
          <div class="actions">
            <button type="button" id="group-update">Update</button>
            <button type="button" id="group-cancel">Cancel</button>
          </div>
        </div>

        <!-- Adjust fixture -->
        <div class="dialog-section adjust-section">
          <form id="edit-fixture-form">
            <label>On pitch:
              <input type="text" name="pitch" value="${pitch}" required />
            </label>
            <label>Destination:
              <input type="number" name="moveAfter" value="${moveAfter}" />
            </label>
            <label>With fixture:
              <select name="fixture" required>
                <option value="" disabled>Select fixture</option>
                <option value="${id}" selected>#${id} - ${groupName} - ${team1} vs ${team2}</option>
              </select>
            </label>
            <div class="actions">
              <button type="submit">Update</button>
              <button type="button" id="close-button">Cancel</button>
            </div>
          </form>
        </div>
    </div>`;
}

module.exports = generateEditFixtureForm;

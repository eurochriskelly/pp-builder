/**
 * Generates an HTML form for editing a fixture.
 * @param {Object} fixture - The fixture data to edit.
 * @param {Object} availableData - Data for populating dropdowns.
 * @param {Array<string>} [availableData.teams=[]] - List of available team names.
 * @param {Array<string>} [availableData.pitches=[]] - List of available pitch names.
 * @param {Array<{id: string, description: string}>} [availableData.fixtures=[]] - List of available fixtures to move after.
 * @returns {string} HTML string for the edit form.
 */
function generateEditFixtureForm(fixture = {}, availableData = {}) {
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
        moveAfter = '' // This likely corresponds to a fixture ID
    } = fixture;

    const {
        teams = [],
        pitches = [],
        fixtures = [] // Expected format: { id: 'fixtureId', description: 'Fixture Description' }
    } = availableData;

    // Helper to generate select options
    const generateOptions = (list, selectedValue) => {
        return list.map(item => {
            const value = typeof item === 'object' ? item.id : item;
            const text = typeof item === 'object' ? item.description : item;
            return `<option value="${value}" ${value === selectedValue ? 'selected' : ''}>${text}</option>`;
        }).join('');
    };


    // Return only the inner content, the <dialog> wrapper is provided by the caller (knockoutFixtures)
    return `<div class="fixture-dialog">
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

        <!-- Tab Buttons -->
        <div class="tab-container">
            <button class="tab-button active" onclick="openTab(event, 'myGroupTab')">My group</button>
            <button class="tab-button" onclick="openTab(event, 'adjustFixtureTab')">Adjust fixture</button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
            <!-- My Group Tab Panel -->
            <div id="myGroupTab" class="tab-panel active">
                <div class="team-details section-container">
                    <!-- Removed h3 as it's now in the tab button -->
                    <div class="form-grid">
                        <!-- Row Headers -->
                <div class="grid-cell header-cell"></div>
                <div class="grid-cell header-cell">Team 1</div>
                <div class="grid-cell header-cell">Team 2</div>

                <!-- Name Row -->
                <!-- Name Row -->
                <div class="grid-cell label-cell">Name</div>
                <div class="grid-cell input-cell team-name-cell">
                    <div id="team1-wrapper" class="team-input-wrapper">
                        <select id="team1-select" name="team1">
                            <option value="">Select Team 1</option>
                            ${generateOptions(teams, team1)}
                        </select>
                        <input type="text" id="team1-input" name="team1_alt_name" value="${team1}" class="hidden" placeholder="Enter new team name">
                    </div>
                    <i id="team1-edit-icon" data-lucide="pencil" class="icon-small edit-team-icon"
                       onclick="toggleTeamEdit('team1')"
                       title="Edit Team 1 Name"></i>
                </div>
                <div class="grid-cell input-cell team-name-cell">
                     <div id="team2-wrapper" class="team-input-wrapper">
                        <select id="team2-select" name="team2">
                            <option value="">Select Team 2</option>
                            ${generateOptions(teams, team2)}
                        </select>
                        <input type="text" id="team2-input" name="team2_alt_name" value="${team2}" class="hidden" placeholder="Enter new team name">
                     </div>
                     <i id="team2-edit-icon" data-lucide="pencil" class="icon-small edit-team-icon"
                        onclick="toggleTeamEdit('team2')"
                        title="Edit Team 2 Name"></i>
                </div>

                <!-- Goals/Points Row -->
                <div class="grid-cell label-cell">Goals/Points</div>
                <div class="grid-cell input-cell score-input-container">
                    <input type="number" name="goals1" value="${goals1}" class="score-input" />
                    <input type="number" name="points1" value="${points1}" class="score-input" />
                </div>
                <div class="grid-cell input-cell score-input-container">
                    <input type="number" name="goals2" value="${goals2}" class="score-input" />
                    <input type="number" name="points2" value="${points2}" class="score-input" />
                </div>
            </div>
             <div class="actions">
                <button type="button">Update Score</button> <!-- Clarified button action -->
                <button type="button" formmethod="dialog">Close</button> <!-- Use formmethod="dialog" to close parent dialog -->
                    </div>
                </div>
            </div>

            <!-- Adjust Fixture Tab Panel -->
            <div id="adjustFixtureTab" class="tab-panel">
                <div class="adjust-fixture section-container">
                     <!-- Removed h3 as it's now in the tab button -->
                    <form class="form-rows">
                         <div class="form-row">
                            <label for="pitch">On pitch:</label>
                    <select id="pitch" name="pitch">
                        <option value="">Select Pitch</option>
                        ${generateOptions(pitches, pitch)}
                    </select>
                </div>
                 <div class="form-row">
                    <label for="fixtureAction">Action:</label>
                     <select id="fixtureAction" name="fixtureAction">
                        <option value="after">Place after</option>
                        <option value="before">Place before</option>
                        <option value="swap">Swap with</option>
                    </select>
                </div>
                 <div class="form-row">
                    <label for="targetFixtureId">Relative to:</label>
                    <select id="targetFixtureId" name="targetFixtureId">
                        <option value="">Select target fixture...</option>
                        ${generateOptions(fixtures, moveAfter)} {/* Use moveAfter for initial selection if needed, or set to "" */}
                    </select>
                </div>
                <div class="actions">
                    <button type="submit">Update Schedule</button> <!-- Clarified button action -->
                    <button type="button" formmethod="dialog">Close</button> <!-- Use formmethod="dialog" to close parent dialog -->
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <script type="module" src="/scripts/webcomponents/fixture-row.js"></script>
        <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js" ></script>
        <script> lucide.createIcons();</script>
        <script src="/scripts/editFixture.public.js"></script>
      </div>`; // Removed closing div for dialog-overlay
}

module.exports = generateEditFixtureForm;

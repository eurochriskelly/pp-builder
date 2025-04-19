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
                <div class="grid-cell label-cell">Name</div>
                <div class="grid-cell input-cell">
                    <select name="team1">
                        <option value="">Select Team 1</option>
                        ${generateOptions(teams, team1)}
                    </select>
                </div>
                <div class="grid-cell input-cell">
                     <select name="team2">
                        <option value="">Select Team 2</option>
                        ${generateOptions(teams, team2)}
                    </select>
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
                        <button type="button">Update Score</button> <!-- Clarified button action -->
                        <button type="button">Cancel</button>
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
                    <button type="button">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <script>
            function openTab(evt, tabName) {
                // Declare all variables
                var i, tabcontent, tablinks;

                // Get all elements with class="tab-panel" and hide them
                tabcontent = document.getElementsByClassName("tab-panel");
                for (i = 0; i < tabcontent.length; i++) {
                    tabcontent[i].style.display = "none";
                    tabcontent[i].classList.remove("active");
                }

                // Get all elements with class="tab-button" and remove the class "active"
                tablinks = document.getElementsByClassName("tab-button");
                for (i = 0; i < tablinks.length; i++) {
                    tablinks[i].classList.remove("active");
                }

                // Show the current tab, and add an "active" class to the button that opened the tab
                const currentTab = document.getElementById(tabName);
                if (currentTab) {
                    currentTab.style.display = "block";
                    currentTab.classList.add("active");
                }
                 if (evt && evt.currentTarget) {
                    evt.currentTarget.classList.add("active");
                 }
            }

            // Initialize the default tab on load
            document.addEventListener('DOMContentLoaded', function() {
                 // Find the initially active tab panel and display it
                 const defaultActiveTab = document.querySelector('.tab-panel.active');
                 if (defaultActiveTab) {
                    // Ensure only the default active tab is shown initially
                    const allTabs = document.querySelectorAll('.tab-panel');
                    allTabs.forEach(tab => {
                        if (tab.id !== defaultActiveTab.id) {
                            tab.style.display = 'none';
                        } else {
                             tab.style.display = 'block'; // Ensure the active one is displayed
                        }
                    });
                 } else {
                     // Fallback if no tab has 'active' class: open the first one
                     openTab(null, 'myGroupTab');
                 }
            });
        </script>
    </div>`;
}

module.exports = generateEditFixtureForm;

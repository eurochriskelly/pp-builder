/**
 * Toggles the visibility between the team select dropdown and the team text input.
 * @param {string} teamId - The identifier for the team ('team1' or 'team2').
 */
function toggleTeamEdit(teamId) {
    const selectElement = document.getElementById(`${teamId}-select`);
    const inputElement = document.getElementById(`${teamId}-input`);
    // const wrapper = document.getElementById(`${teamId}-wrapper`); // Might need wrapper if structure changes

    if (!selectElement || !inputElement) {
        console.error(`Elements for ${teamId} not found.`);
        return;
    }

    const isSelectHidden = selectElement.classList.contains('hidden');

    if (isSelectHidden) {
        // If select is hidden, show select and hide input
        selectElement.classList.remove('hidden');
        inputElement.classList.add('hidden');
        // Optionally update select value from input before hiding input
        // selectElement.value = inputElement.value; // Or find/add option if needed
    } else {
        // If select is visible, hide select and show input
        selectElement.classList.add('hidden');
        inputElement.classList.remove('hidden');
        // Update input value from select when showing input
        inputElement.value = selectElement.options[selectElement.selectedIndex]?.text || ''; // Use text content
        inputElement.focus(); // Focus the input field
    }
     // Re-render icons if necessary, though usually not needed for visibility toggle
    // if (window.lucide) {
    //     lucide.createIcons();
    // }
}

/**
 * Switches the active tab in the fixture dialog.
 * @param {Event} evt - The click event.
 * @param {string} tabName - The ID of the tab panel to show.
 */
function openTab(evt, tabName) {
    // Get all elements with class="tab-panel" and hide them
    const tabPanels = document.querySelectorAll(".tab-panel");
    tabPanels.forEach(tabpanel => {
        tabpanel.classList.remove("active");
        // tabpanel.style.display = "none"; // Alternative if not using active class for display
    });

    // Get all elements with class="tab-button" and remove the class "active"
    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach(tabbutton => {
        tabbutton.classList.remove("active");
    });

    // Show the current tab, and add an "active" class to the button that opened the tab
    const currentTabPanel = document.getElementById(tabName);
    if (currentTabPanel) {
        currentTabPanel.classList.add("active");
        // currentTabPanel.style.display = "block"; // Alternative
    }
    if (evt.currentTarget) {
        evt.currentTarget.classList.add("active");
    }
}

// Initial setup if needed, e.g., ensure the default tab is shown correctly
// document.addEventListener('DOMContentLoaded', () => {
//     // Activate the default tab if necessary, although the HTML already sets it
//     const defaultTabButton = document.querySelector('.tab-button.active');
//     if (defaultTabButton) {
//         const defaultTabId = defaultTabButton.getAttribute('onclick').match(/'([^']+)'/)[1];
//         const defaultTabPanel = document.getElementById(defaultTabId);
//         if (defaultTabPanel) {
//             defaultTabPanel.classList.add('active');
//         }
//     }
// });

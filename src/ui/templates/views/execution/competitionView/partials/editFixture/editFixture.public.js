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
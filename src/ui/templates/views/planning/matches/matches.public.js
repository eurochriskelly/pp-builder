async function playNextNMatches(n, tournamentId, category) {
    for (let i = 0; i < n; i++) {
        // Construct the proper URL with the category if provided
        // Determine category from URL if not provided
        let urlCategory = category;
        const segments = window.location.pathname.split('/');
        const idx = segments.indexOf('category');
        if (!urlCategory && idx !== -1 && segments[idx + 1]) {
            urlCategory = decodeURIComponent(segments[idx + 1]);
        }
        const finalCategory = urlCategory || 'Men';
        const simulateUrl = `/planning/${tournamentId}/simulate/1/${encodeURIComponent(finalCategory)}`;

        await htmx.ajax('POST', simulateUrl, {
            target: '#planning-matches',
            swap: 'outerHTML'
        });
    }
}

function updatePlayNextEndpoint(category) {
    // Update the hidden input for the current category
    const categoryInput = document.querySelector('input[name="category-param"]');
    if (categoryInput) {
        categoryInput.value = category || '';
    }
}

function filterByCategory(selectedCategory) {
    const matchesTablesContainer = document.getElementById('matches-tables-container');
    const noCategoryMessage = document.getElementById('no-category-message');

    // Store the selected category globally for persistence
    window.selectedCategory = selectedCategory;

    // Update the hidden input field for category parameter
    updatePlayNextEndpoint(selectedCategory);

    if (!selectedCategory) {
        if (matchesTablesContainer) matchesTablesContainer.style.display = 'none';
        if (noCategoryMessage) noCategoryMessage.style.display = 'block';
        // Hide play controls if no category is selected
        const playControls = document.getElementById('play-controls');
        if (playControls) playControls.style.display = 'none';
        updatePlayNextEndpoint(''); // Clear endpoint if no category
        return; // Stop further processing
    }

    // Category is selected, show tables and hide message
    if (matchesTablesContainer) matchesTablesContainer.style.display = 'block';
    if (noCategoryMessage) noCategoryMessage.style.display = 'none';
    // Show play controls
    const playControls = document.getElementById('play-controls');
    if (playControls) playControls.style.display = 'block';

    // Update the hidden category parameter
    updatePlayNextEndpoint(selectedCategory);

    const upcomingTableBody = document.querySelector('#upcoming-table tbody');
    const finishedTableBody = document.querySelector('#finished-table tbody');
    const allUpcomingRows = upcomingTableBody ? upcomingTableBody.querySelectorAll('tr') : [];
    const allFinishedRows = finishedTableBody ? finishedTableBody.querySelectorAll('tr') : [];
    const showMoreUpcomingLink = document.getElementById('show-more-upcoming');
    const showLessUpcomingLink = document.getElementById('show-less-upcoming');
    const showMoreFinishedLink = document.getElementById('show-more-finished');
    const showLessFinishedLink = document.getElementById('show-less-finished');
    const upcomingShowMoreContainer = document.getElementById('show-more-container-upcoming');
    const finishedShowMoreContainer = document.getElementById('show-more-container-finished');
    const upcomingHeader = document.getElementById('upcoming-header'); // Get upcoming header element
    const finishedHeader = document.getElementById('finished-header'); // Get finished header element

    let visibleUpcomingCount = 0;
    let totalUpcomingInCategory = 0;
    let visibleFinishedCount = 0;
    let totalFinishedInCategory = 0;

    allUpcomingRows.forEach(row => row.style.display = 'none');
    allFinishedRows.forEach(row => row.style.display = 'none');

    if (selectedCategory) {
        allUpcomingRows.forEach(row => {
            if (row.dataset.category === selectedCategory) {
                totalUpcomingInCategory++;
                if (visibleUpcomingCount < 10) {
                    row.style.display = '';
                    visibleUpcomingCount++;
                }
            }
        });
        allFinishedRows.forEach(row => {
            if (row.dataset.category === selectedCategory) {
                totalFinishedInCategory++;
                if (visibleFinishedCount < 10) {
                    row.style.display = '';
                    visibleFinishedCount++;
                }
            }
        });
    }

    if (upcomingHeader) upcomingHeader.textContent = `UPCOMING GAMES (${totalUpcomingInCategory})`;
    if (finishedHeader) finishedHeader.textContent = `FINISHED GAMES (${totalFinishedInCategory})`;

    if (upcomingShowMoreContainer) {
        if (totalUpcomingInCategory > 10) {
            upcomingShowMoreContainer.style.display = 'block';
            showMoreUpcomingLink.textContent = `Show ${totalUpcomingInCategory - 10} More`; // Corrected count
            showMoreUpcomingLink.style.display = 'inline-block';
            showLessUpcomingLink.style.display = 'none';
            showMoreUpcomingLink.onclick = (e) => { e.preventDefault(); showMoreRows('upcoming', selectedCategory); };
            showLessUpcomingLink.onclick = (e) => { e.preventDefault(); showLessRows('upcoming', selectedCategory); };
        } else {
            upcomingShowMoreContainer.style.display = 'none';
        }
    }

    if (finishedShowMoreContainer) {
        if (totalFinishedInCategory > 10) {
            finishedShowMoreContainer.style.display = 'block';
            showMoreFinishedLink.textContent = `Show ${totalFinishedInCategory - 10} More`; // Consistent calculation
            showMoreFinishedLink.style.display = 'inline-block';
            showLessFinishedLink.style.display = 'none';
            showMoreFinishedLink.onclick = (e) => { e.preventDefault(); showMoreRows('finished', selectedCategory); };
            showLessFinishedLink.onclick = (e) => { e.preventDefault(); showLessRows('finished', selectedCategory); };
        } else {
            finishedShowMoreContainer.style.display = 'none';
        }
    }

    updatePlayNextEndpoint(selectedCategory);
}

function showMoreRows(tableType, category) {
    const tableBody = document.querySelector(`#${tableType}-table tbody`);
    const rows = tableBody ? tableBody.querySelectorAll(`tr[data-category="${category}"]`) : [];
    rows.forEach(row => row.style.display = '');
    document.getElementById(`show-more-${tableType}`).style.display = 'none';
    document.getElementById(`show-less-${tableType}`).style.display = 'inline-block';
    return false;
}

function showLessRows(tableType, category) {
    const tableBody = document.querySelector(`#${tableType}-table tbody`);
    const rows = tableBody ? tableBody.querySelectorAll(`tr[data-category="${category}"]`) : [];
    rows.forEach((row, index) => {
        if (index >= 10) row.style.display = 'none';
        else row.style.display = '';
    });
    document.getElementById(`show-more-${tableType}`).style.display = 'inline-block';
    document.getElementById(`show-less-${tableType}`).style.display = 'none';
    return false;
}

// Initialize category on load
window.addEventListener('load', () => {
    const categoryFilter = document.getElementById('category-filter');
    // Use the value from the filter element itself as the source of truth on load
    const initialCategory = categoryFilter ? categoryFilter.value : '';
    window.selectedCategory = initialCategory; // Store globally if needed
    filterByCategory(initialCategory); // Apply filter based on initial value
});

// Reapply after HTMX swap - with improved handling to prevent flashing
document.body.addEventListener('htmx:beforeSwap', function (event) {
    // Store the current category before the swap happens
    if (window.selectedCategory) {
        // Save it to session storage for extra resilience
        sessionStorage.setItem('selectedMatchCategory', window.selectedCategory);
    }
});

document.body.addEventListener('htmx:afterSwap', function (event) {
// If we're dealing with the planning-matches container or anything that has our filter
    if (event.detail.target.id === 'planning-matches' || event.detail.target.querySelector('#category-filter')) {
        const categoryFilter = document.getElementById('category-filter');

        // Try these sources in order: 
        // 1. Dropdown's selected value (set by server)
        // 2. Global variable from previous state
        // 3. Session storage as backup
        // 4. Empty string as fallback
        const dropdownValue = categoryFilter ? categoryFilter.value : '';
        const storedCategory = sessionStorage.getItem('selectedMatchCategory');
        const categoryToUse = dropdownValue || window.selectedCategory || storedCategory || '';

        // If we have a category to use and it's different from the dropdown
        if (categoryToUse && categoryFilter && (!dropdownValue || dropdownValue !== categoryToUse)) {
            // Update the dropdown selection
            categoryFilter.value = categoryToUse;
        }

        // Store the category in the global variable
        window.selectedCategory = categoryToUse;

        // Apply filtering immediately - this prevents flashing
        if (categoryToUse) {
            // Use the minimum possible delay to let the DOM complete
            setTimeout(() => filterByCategory(categoryToUse), 0);
        }
    }
});

// Ensure the event listener is attached correctly after load/swap
// This might need adjustment depending on how/when the filter element is added to the DOM
// Using event delegation on a parent element is often more robust.
document.addEventListener('change', function (event) {
    if (event.target && event.target.id === 'category-filter') {
        const selectedCategory = event.target.value;
        window.selectedCategory = selectedCategory; // Store globally
        filterByCategory(selectedCategory);
    }
});

// Add an auto-initialization function that's called on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize the selected category on page load
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        const category = categoryFilter.value;
        if (category) {
            window.selectedCategory = category;
            filterByCategory(category);
        }
    }
});

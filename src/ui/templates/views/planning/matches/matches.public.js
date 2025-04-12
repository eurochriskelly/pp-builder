async function playNextNMatches(n, tournamentId) {
    for (let i = 0; i < n; i++) {
        await htmx.ajax('POST', '/planning/' + tournamentId + '/simulate/1', {
            target: '#planning-matches',
            swap: 'outerHTML'
        });
    }
}
function filterByCategory(selectedCategory) {
    const matchesTablesContainer = document.getElementById('matches-tables-container');
    const noCategoryMessage = document.getElementById('no-category-message');

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
            showMoreUpcomingLink.textContent = `Show ${totalUpcomingInCategory - 11} More`;
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
            showMoreFinishedLink.textContent = `Show ${totalFinishedInCategory - 10} More`;
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

// Reapply after HTMX swap
document.body.addEventListener('htmx:afterSwap', (event) => {
    // Check if the swapped element contains our category filter or tables
    if (event.detail.target.id === 'planning-matches' || event.detail.target.querySelector('#category-filter')) {
        const categoryFilter = document.getElementById('category-filter');
        const currentCategory = categoryFilter ? categoryFilter.value : '';
        window.selectedCategory = currentCategory; // Update global state
        filterByCategory(currentCategory); // Re-apply filter
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
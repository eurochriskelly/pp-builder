async function playNextNMatches(n, tournamentId) {
    for (let i = 0; i < n; i++) {
        await htmx.ajax('POST', '/planning/' + tournamentId + '/simulate/1', {
            target: '#planning-matches',
            swap: 'outerHTML'
        });
    }
}
function filterByCategory(selectedCategory) {
    const upcomingTableBody = document.querySelector('#upcoming-table tbody');
    const finishedTableBody = document.querySelector('#finished-table tbody');
    const allUpcomingRows = upcomingTableBody ? upcomingTableBody.querySelectorAll('tr') : [];
    const allFinishedRows = finishedTableBody ? finishedTableBody.querySelectorAll('tr') : [];
    const upcomingHeader = document.getElementById('upcoming-header');
    const finishedHeader = document.getElementById('finished-header');
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
    if (window.selectedCategory && categoryFilter) {
        categoryFilter.value = window.selectedCategory;
        filterByCategory(window.selectedCategory);
    } else {
        filterByCategory('');
    }
});

// Reapply after HTMX swap
document.body.addEventListener('htmx:afterSwap', () => {
    const categoryFilter = document.getElementById('category-filter');
    if (window.selectedCategory && categoryFilter) {
        categoryFilter.value = window.selectedCategory;
        filterByCategory(window.selectedCategory);
    }
});
document.getElementById('category-filter').addEventListener('change', (event) => {
    const selectedCategory = event.target.value;
    window.selectedCategory = selectedCategory;
    filterByCategory(selectedCategory);
        document.getElementById('play-controls').style.display = 'block';
});
(function() {
    const tables = document.querySelectorAll('#knockout-fixtures .fixtures-table');
    tables.forEach(table => {
        table.addEventListener('click', function(event) {
            const clickedRow = event.target.closest('tr.clickable-row');
            if (clickedRow) {
                const fixtureDataString = clickedRow.getAttribute('data-fixture');
                if (fixtureDataString) {
                    try {
                        const fixtureData = JSON.parse(fixtureDataString);
                        console.log('Clicked Fixture Data:', fixtureData);
                    } catch (e) {
                        console.error('Error parsing fixture data from row:', e, fixtureDataString);
                    }
                }
            }
        });
    });
})();
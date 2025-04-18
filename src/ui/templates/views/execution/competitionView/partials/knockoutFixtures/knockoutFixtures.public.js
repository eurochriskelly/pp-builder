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

    // Open dialogs after HTMX swaps in their content
    document.body.addEventListener('htmx:afterSwap', function (evt) {
        const tgt = evt.detail.target;
        if (tgt.id && tgt.id.startsWith('edit-dialog-content-')) {
            const matchId = tgt.id.split('-').pop();
            const dlg = document.getElementById(`edit-dialog-${matchId}`);
            if (dlg && typeof dlg.showModal === 'function') {
                dlg.showModal();
            }
        }
    });
})();
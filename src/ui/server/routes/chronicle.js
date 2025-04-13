const express = require('express');
const { getRegions } = require('../../queries/chronicle');
const renderChronicle = require('../../templates/views/chronicle');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const regions = await getRegions();
        // Generate HTML using the template
        const html = renderChronicle(regions);
        res.send(html);
    } catch (error) {
        console.error('Error fetching regions:', error.message);
        res.status(500).send('Error fetching regions');
    }
});

module.exports = router;

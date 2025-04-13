const { apiRequest } = require('../api');

/* 
Route /chronicle show the tournmaent regions and years
Route /chronicle/:region show the tournament years for the region
Route /chronicle/:region/:year show the tournament details for the region and year
*/

// New query function to fetch regions from /api/regions
async function getRegions() {
    // Stub implementation to hit /api/regions endpoint
    const data = await apiRequest('get', '/regions');
    console.log('regions data', data)
    const currentYear = new Date().getFullYear();
    return data.data.map(region => ({
        name: region,
        years: {
            [currentYear]: [
                {
                    championship: "Benelux football",
                    winner: "Luxembourg GFC",
                    runnerUp: "Brussels GFC"
                },
                {
                    championship: "The All-Benelux rounders competition",
                    winner: "Den Haag",
                    runnerUp: "Brussels GFC"
                },
            ],
            [currentYear - 1]: [
                {
                    championship: "Benelux football",
                    winner: "Amsterdam FC",
                    runnerUp: "Rotterdam FC"
                },
                {
                    championship: "The All-Benelux rounders competition",
                    winner: "Antwerp",
                    runnerUp: "Rotterdam FC"
                },
            ],
            [currentYear - 2]: [
                {
                    championship: "Benelux football",
                    winner: "Brussels GFC",
                    runnerUp: "Luxembourg GFC"
                },
                {
                    championship: "The All-Benelux rounders competition",
                    winner: "Rotterdam FC",
                    runnerUp: "Amsterdam FC"
                },
            ],
        }
    }));
}

module.exports = {
    getRegions,
};
const { apiRequest } = require('../../api');

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
                    championship: "Mens Football",
                    levels: {
                        championship: {
                            winner: "Amsterdam FC",
                            runnerUp: "Rotterdam FC"
                        },
                        shield: {
                            winner: "Luxembourg GFC",
                            runnerUp: "Brussels GFC"
                        },
                        plate: {
                            winner: "Amsterdam FC",
                            runnerUp: "Rotterdam FC"
                        }
                    }
                },
                {
                    championship: "Ladies Football",
                    levels: {
                        championship: {
                            winner: "Den Haag",
                            runnerUp: "Brussels GFC"
                        },
                        shield: {
                            winner: "Luxembourg GFC",
                            runnerUp: "Brussels GFC"
                        },
                        plate: {
                            winner: "Amsterdam FC",
                            runnerUp: "Rotterdam FC"
                        }
                    }
                },
                {
                    championship: "Hurling",
                    levels: {
                        championship: {
                            winner: "Den Haag",
                            runnerUp: "Brussels GFC"
                        },
                        shield: {
                            winner: "Luxembourg GFC",
                            runnerUp: "Brussels GFC"
                        },
                    }
                },
                {
                    championship: "Camogie",
                    levels: {
                        championship: {
                            winner: "Den Haag",
                            runnerUp: "Brussels GFC"
                        },
                        shield: {
                            winner: "Luxembourg GFC",
                            runnerUp: "Brussels GFC"
                        },
                    }
                },
                {
                    championship: "Youth Football",
                    levels: {
                        under14: {
                            winner: "Den Haag",
                            runnerUp: "Brussels GFC"
                        },
                        under12: {
                            winner: "Luxembourg GFC",
                            runnerUp: "Brussels GFC"
                        },
                        under10: {
                            winner: "Amsterdam FC",
                            runnerUp: "Rotterdam FC"
                        },
                    }
                },
            ],
            [currentYear - 1]: [
                {
                    championship: "Mens Football",
                    levels: {
                        championship: {
                            winner: "Amsterdam FC",
                            runnerUp: "Rotterdam FC"
                        },
                        shield: {
                            winner: "Luxembourg GFC",
                            runnerUp: "Brussels GFC"
                        },
                        plate: {
                            winner: "Amsterdam FC",
                            runnerUp: "Rotterdam FC"
                        }
                    }
                },
                {
                    championship: "Ladies Football",
                    levels: {
                        championship: {
                            winner: "Den Haag",
                            runnerUp: "Brussels GFC"
                        },
                        shield: {
                            winner: "Luxembourg GFC",
                            runnerUp: "Brussels GFC"
                        },
                        plate: {
                            winner: "Amsterdam FC",
                            runnerUp: "Rotterdam FC"
                        }
                    }
                },
                {
                    championship: "Hurling",
                    levels: {
                        championship: {
                            winner: "Den Haag",
                            runnerUp: "Brussels GFC"
                        },
                        shield: {
                            winner: "Luxembourg GFC",
                            runnerUp: "Brussels GFC"
                        },
                    }
                },
                {
                    championship: "Camogie",
                    levels: {
                        championship: {
                            winner: "Den Haag",
                            runnerUp: "Brussels GFC"
                        },
                        shield: {
                            winner: "Luxembourg GFC",
                            runnerUp: "Brussels GFC"
                        },
                    }
                },
            ],
            [currentYear - 2]: [
                {
                    championship: "Mens Football",
                    levels: {
                        championship: {
                            winner: "Amsterdam FC",
                            runnerUp: "Rotterdam FC"
                        },
                        shield: {
                            winner: "Luxembourg GFC",
                            runnerUp: "Brussels GFC"
                        },
                        plate: {
                            winner: "Amsterdam FC",
                            runnerUp: "Rotterdam FC"
                        }
                    }
                },
                {
                    championship: "Ladies Football",
                    levels: {
                        championship: {
                            winner: "Den Haag",
                            runnerUp: "Brussels GFC"
                        },
                        shield: {
                            winner: "Luxembourg GFC",
                            runnerUp: "Brussels GFC"
                        },
                        plate: {
                            winner: "Amsterdam FC",
                            runnerUp: "Rotterdam FC"
                        }
                    }
                },
                {
                    championship: "Hurling",
                    levels: {
                        championship: {
                            winner: "Den Haag",
                            runnerUp: "Brussels GFC"
                        },
                        shield: {
                            winner: "Luxembourg GFC",
                            runnerUp: "Brussels GFC"
                        },
                    }
                },
                {
                    championship: "Camogie",
                    levels: {
                        championship: {
                            winner: "Den Haag",
                            runnerUp: "Brussels GFC"
                        },
                        shield: {
                            winner: "Luxembourg GFC",
                            runnerUp: "Brussels GFC"
                        },
                    }
                },
            ],
        }
    }));
}

module.exports = {
    getRegions,
};
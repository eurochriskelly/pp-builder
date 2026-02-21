declare const testdata: {
    tournaments: {
        t1: {
            tournamentId: number;
            description: string;
            rules: {
                points: {
                    positional: number[];
                    participation: number;
                };
                stages: {
                    preliminary: {
                        match: {
                            win: number;
                            draw: number;
                            loss: number;
                        };
                    };
                    elimination: {
                        brackets: string[];
                    };
                };
            };
            location: {
                city: string;
                address: string;
                coordinates: {
                    latitude: number;
                    longitude: number;
                }[];
            };
            startDate: string;
            pitches: {
                name: string;
                availability: {
                    from: string;
                    until: string;
                };
            }[];
            categories: {
                Mens: {
                    teams: string[];
                    pitches: number[];
                    rules: {
                        preliminary: {};
                        elimination: {
                            brackets: {
                                cup: number;
                                shield: number;
                                plate: number;
                            };
                        };
                    };
                    groups: never[];
                };
                Ladies: {
                    teams: string[];
                    pitches: number[];
                    rules: {
                        preliminary: {};
                        elimination: {
                            brackets: {
                                cup: number;
                                shield: number;
                            };
                        };
                    };
                    groups: never[];
                };
            };
            activities: never[];
        };
        t2: {
            tournamentId: number;
            description: string;
            rules: {
                points: {
                    positional: number[];
                    participation: number;
                };
                stages: {
                    preliminary: {
                        match: {
                            win: number;
                            draw: number;
                            loss: number;
                        };
                    };
                    elimination: {};
                };
            };
            location: {
                city: string;
                address: string;
                coordinates: {
                    latitude: number;
                    longitude: number;
                }[];
            };
            startDate: string;
            pitches: {
                name: string;
                availability: {
                    from: string;
                    until: string;
                };
            }[];
            categories: {
                Mens: {
                    teams: string[];
                    rules: {
                        preliminary: {};
                        elimination: {
                            brackets: {
                                cup: number;
                                shield: number;
                                plate: number;
                            };
                        };
                    };
                    groups: never[];
                };
            };
            activities: never[];
        };
        t3: {
            tournamentId: number;
            description: string;
            rules: {
                points: {
                    positional: number[];
                    participation: number;
                };
                stages: {
                    preliminary: {
                        match: {
                            win: number;
                            draw: number;
                            loss: number;
                        };
                    };
                    elimination: {};
                };
            };
            location: {
                city: string;
                address: string;
                coordinates: {
                    latitude: number;
                    longitude: number;
                }[];
            };
            startDate: string;
            pitches: ({
                name: string;
                available: {
                    from: string;
                    until: string;
                };
            } | {
                name: string;
                available?: undefined;
            })[];
            categories: {
                Mens: {
                    teams: string[];
                    rules: {
                        preliminary: {};
                        elimination: {
                            brackets: {
                                cup: number;
                                shield: number;
                                plate: number;
                            };
                        };
                    };
                    groups: never[];
                };
            };
            activities: never[];
        };
        t4: {
            id: number;
            description: string;
            rules: {
                points: {
                    positional: number[];
                    participation: number;
                };
                stages: {
                    preliminary: {
                        match: {
                            win: number;
                            draw: number;
                            loss: number;
                        };
                    };
                    elimination: {
                        brackets: string[];
                    };
                };
            };
            location: {
                city: string;
                address: string;
                coordinates: {
                    latitude: number;
                    longitude: number;
                }[];
            };
            startDate: string;
            pitches: {
                name: string;
                available: {
                    from: string;
                    until: string;
                };
            }[];
            categories: {
                Mens: {
                    teams: string[];
                    rules: {
                        preliminary: {};
                        elimination: {
                            brackets: {
                                cup: number;
                            };
                        };
                    };
                    groups: never[];
                };
            };
        };
    };
    fixtures: {
        f1: {
            matchId: number;
            scheduledTime: string;
            pitch: string;
            stage: string;
            bracket: null;
            category: string;
            position: number;
            team1: string;
            team2: string;
            umpireTeam: string;
            duration: number;
        }[];
        f2: ({
            matchId: number;
            startTime: string;
            pitch: string;
            stage: string;
            group: {
                type: string;
                stage: string;
                name: string;
            };
            category: string;
            bracket: null;
            team1: {
                type: string;
                name: string;
                goals: null;
                points: null;
            };
            team2: {
                type: string;
                name: string;
                goals: null;
                points: null;
            };
            umpirTeam: string;
            allottedTime: number;
        } | {
            matchId: number;
            startTime: string;
            pitch: string;
            stage: string;
            group: {
                type: string;
                stage: string;
                name: string;
            };
            category: string;
            bracket?: undefined;
            team1?: undefined;
            team2?: undefined;
            umpirTeam?: undefined;
            allottedTime?: undefined;
        })[];
        f3: {
            ref: number;
            type: string;
            allottedTime: number;
            matchId: number;
            stage: string;
            category: string;
            position: number;
            team1: {
                type: string;
                stage: string;
                group: number;
                position: number;
            };
            team2: {
                type: string;
                stage: string;
                group: number;
                position: number;
            };
        }[];
        f4: ({
            ref: number;
            type: string;
            allottedTime: number;
            matchId: number;
            stage: string;
            category: string;
            position: number;
            team1: string;
            team2: string;
            letter1: string;
            letter2: string;
        } | {
            ref: number;
            type: string;
            allottedTime: number;
            matchId: number;
            stage: string;
            category: string;
            position: number;
            team1: {
                type: string;
                stage: string;
                group: number;
                position: number;
            };
            team2: {
                type: string;
                stage: string;
                group: number;
                position: number;
            };
            letter1?: undefined;
            letter2?: undefined;
        })[];
    };
};
export default testdata;

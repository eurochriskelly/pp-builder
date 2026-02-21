var standardRules = {
    points: {
        positional: [25, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2, 1],
        participation: 2, // automatically receive 2 points for participating
    },
    stages: {
        preliminary: {
            match: {
                win: 3,
                draw: 1,
                loss: 0,
            },
        },
        elimination: { brackets: ['cup', 'shield', 'plate', 'bowl', 'spoon'] },
    }
};
var locAmsterdam = {
    city: "Amsterdam",
    address: "",
    coordinates: [
        {
            latitude: 54,
            longitude: 4,
        },
    ],
};
var commonPitches = [
    {
        name: 'Pitch 1',
        availability: { from: '2024-03-03T10:00:00', until: '2024-03-03T18:00:00' },
    },
    {
        name: 'Pitch 2',
        availability: { from: '2024-03-03T10:00:00', until: '2024-03-03T18:00:00' },
    },
    {
        name: 'Pitch 3',
        availability: { from: '2024-03-03T10:00:00', until: '2024-03-03T18:00:00' },
    },
    {
        name: 'Pitch 4',
        availability: { from: '2024-03-03T10:00:00', until: '2024-03-03T18:00:00' },
    }
];
var testdata = {
    tournaments: {
        t1: {
            tournamentId: 6,
            description: "Benelux round A",
            rules: standardRules,
            location: locAmsterdam,
            startDate: "2024-04-01",
            pitches: commonPitches,
            categories: {
                Mens: {
                    teams: [
                        "Amsterdam A",
                        "Luxembourg A",
                        "Belgium A",
                        "Groningen",
                        "Leuven A",
                        "Hamburg/Bel'B'",
                        "Eindhoven",
                        "Nijmegen",
                        "Hague A",
                        "Dusseldorf/Cologne",
                        "Leuven B",
                        "Maastricht",
                        "Frankfurt",
                    ],
                    pitches: [0, 1],
                    rules: {
                        preliminary: {},
                        elimination: {
                            brackets: {
                                // FIXME: this should always be 4,4,4,X where the last bracket
                                //        accommodates the remaining teams not divisible by 4
                                cup: 4,
                                shield: 4,
                                plate: 8,
                            }
                        },
                    },
                    groups: [],
                },
                Ladies: {
                    teams: [
                        "Leuven A",
                        "A'dam'B'/Leuven'B'",
                        "Belgium A",
                        "Groningen",
                        "Nijmegen",
                        "Luxembourg A",
                        "Hague/Frankfurt",
                        "Hamb/Duss/Lux'B'",
                        "Amsterdam A",
                    ],
                    pitches: [2, 3],
                    rules: {
                        preliminary: {},
                        elimination: {
                            brackets: {
                                cup: 4,
                                shield: 8,
                            }
                        },
                    },
                    groups: [],
                },
            },
            activities: [],
        },
        t2: {
            tournamentId: 7,
            description: "Benelux round B",
            rules: {
                points: {
                    positional: [25, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2, 1],
                    participation: 2, // automatically receive 2 points for participating
                },
                stages: {
                    preliminary: {
                        match: {
                            win: 3,
                            draw: 1,
                            loss: 0,
                        },
                    },
                    elimination: {},
                }
            },
            location: locAmsterdam,
            startDate: "2024-04-01",
            pitches: commonPitches,
            categories: {
                Mens: {
                    teams: [
                        "Amsterdam A",
                        "Luxembourg A",
                        "Belgium A",
                        "Groningen",
                        "Leuven A",
                        "Dusseldorf/Cologne",
                        "Leuven B",
                        "Maastricht",
                        "Frankfurt",
                    ],
                    rules: {
                        preliminary: {},
                        elimination: {
                            brackets: {
                                cup: 4,
                                shield: 4,
                                plate: 8,
                            }
                        },
                    },
                    groups: [],
                },
            },
            activities: [],
        },
        t3: {
            tournamentId: 7,
            description: "Benelux round C",
            rules: {
                points: {
                    positional: [25, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2, 1],
                    participation: 2, // automatically receive 2 points for participating
                },
                stages: {
                    preliminary: {
                        match: {
                            win: 3,
                            draw: 1,
                            loss: 0,
                        },
                    },
                    elimination: {},
                }
            },
            location: {
                city: "Amsterdam",
                address: "",
                coordinates: [
                    {
                        latitude: 54,
                        longitude: 4,
                    },
                ],
            },
            startDate: "2024-04-01",
            pitches: [
                {
                    name: "Pitch 5",
                    available: {
                        from: "10:00",
                        until: "19:00",
                    },
                },
                {
                    name: "Pitch 11",
                },
                {
                    name: "Pitch 12",
                },
                {
                    name: "Pitch 13",
                },
            ],
            categories: {
                Mens: {
                    teams: [
                        "Amsterdam A",
                        "Luxembourg A",
                        "Belgium A",
                        "Leuven A",
                        "Dusseldorf/Cologne",
                        "Leuven B",
                        "Maastricht",
                        "Frankfurt",
                    ],
                    rules: {
                        preliminary: {},
                        elimination: {
                            brackets: {
                                cup: 4,
                                shield: 4,
                                plate: 8,
                            }
                        },
                    },
                    groups: [],
                },
            },
            activities: [],
        },
        t4: {
            id: 8,
            description: "Super simple",
            rules: standardRules,
            location: locAmsterdam,
            startDate: "2024-04-01",
            pitches: [
                {
                    name: "Pitch 5",
                    available: {
                        from: "10:00",
                        until: "19:00",
                    },
                },
            ],
            categories: {
                Mens: {
                    teams: [
                        "Amsterdam A",
                        "Leuven A",
                        "Groningen",
                        "Belgium B",
                    ],
                    rules: {
                        preliminary: {},
                        elimination: {
                            brackets: {
                                cup: 4,
                            }
                        },
                    },
                    groups: [],
                },
            },
        }
    },
    fixtures: {
        f1: [
            {
                matchId: 1,
                scheduledTime: "10:30",
                pitch: "Pitch 5",
                stage: "group",
                bracket: null,
                category: "Mens",
                position: 1,
                team1: "Amsterdam A",
                team2: "Leuven A",
                umpireTeam: "Groningen",
                duration: 15,
            },
            {
                matchId: 2,
                scheduledTime: "11:00",
                pitch: "Pitch 5",
                stage: "group",
                bracket: null,
                category: "Mens",
                position: 3,
                team1: "Belgium B",
                team2: "Leuven B",
                umpireTeam: "Leuven A",
                duration: 20,
            },
            {
                matchId: 3,
                scheduledTime: "11:30",
                pitch: "Pitch 5",
                stage: "group",
                bracket: null,
                category: "Mens",
                position: 1,
                team1: "Leuven A",
                team2: "Groningen",
                umpireTeam: "Belgium A",
                duration: 15,
            },
        ],
        f2: [
            {
                matchId: 1,
                startTime: "10:30",
                pitch: "Pitch 5",
                stage: "group",
                group: {
                    type: 'preliminary',
                    stage: 'semis',
                    name: 'Group A' // 
                },
                category: "Mens",
                bracket: null,
                team1: {
                    type: 'predefined',
                    name: "Amsterdam A",
                    goals: null,
                    points: null,
                },
                team2: {
                    type: 'predefined',
                    name: "Leuven A",
                    goals: null,
                    points: null,
                },
                umpirTeam: "Groningen",
                allottedTime: 15,
            },
            {
                matchId: 12,
                startTime: "15:00",
                pitch: "Pitch 5",
                stage: "semis",
                group: {
                    type: 'preliminary',
                    stage: 'semis',
                    name: 'Group A' // 
                },
                category: "Mens",
            }
        ],
        f3: [{ "ref": 1016, "type": "fixture", "allottedTime": 40, "matchId": 17, "stage": "semis", "category": "Mens", "position": 1, "team1": { "type": "calculated", "stage": "group", "group": 1, "position": 1 }, "team2": { "type": "calculated", "stage": "group", "group": 3, "position": 1 } }, { "ref": 1017, "type": "fixture", "allottedTime": 40, "matchId": 18, "stage": "semis", "category": "Mens", "position": 2, "team1": { "type": "calculated", "stage": "group", "group": 2, "position": 1 }, "team2": { "type": "calculated", "stage": "group", "group": 4, "position": 1 } }, { "ref": 1018, "type": "fixture", "allottedTime": 40, "matchId": 19, "stage": "bronze", "category": "Mens", "position": 1, "team1": { "type": "calculated", "stage": "semis", "group": 1, "position": 2 }, "team2": { "type": "calculated", "stage": "semis", "group": 2, "position": 2 } }, { "ref": 1019, "type": "fixture", "allottedTime": 45, "matchId": 20, "stage": "finals", "category": "Mens", "position": 1, "team1": { "type": "calculated", "stage": "semis", "group": 1, "position": 1 }, "team2": { "type": "calculated", "stage": "semis", "group": 2, "position": 1 } }, { "ref": 1020, "type": "fixture", "allottedTime": 40, "matchId": 21, "stage": "semis", "category": "Mens", "position": 1, "team1": { "type": "calculated", "stage": "group", "group": 1, "position": 1 }, "team2": { "type": "calculated", "stage": "group", "group": 3, "position": 1 } }, { "ref": 1021, "type": "fixture", "allottedTime": 40, "matchId": 22, "stage": "semis", "category": "Mens", "position": 2, "team1": { "type": "calculated", "stage": "group", "group": 2, "position": 1 }, "team2": { "type": "calculated", "stage": "group", "group": 4, "position": 1 } }, { "ref": 1022, "type": "fixture", "allottedTime": 40, "matchId": 23, "stage": "bronze", "category": "Mens", "position": 1, "team1": { "type": "calculated", "stage": "semis", "group": 1, "position": 2 }, "team2": { "type": "calculated", "stage": "semis", "group": 2, "position": 2 } }, { "ref": 1023, "type": "fixture", "allottedTime": 45, "matchId": 24, "stage": "finals", "category": "Mens", "position": 1, "team1": { "type": "calculated", "stage": "semis", "group": 1, "position": 1 }, "team2": { "type": "calculated", "stage": "semis", "group": 2, "position": 1 } }, { "ref": 1024, "type": "fixture", "allottedTime": 40, "matchId": 25, "stage": "semis", "category": "Mens", "position": 1, "team1": { "type": "calculated", "stage": "group", "group": 1, "position": 1 }, "team2": { "type": "calculated", "stage": "group", "group": 3, "position": 1 } }, { "ref": 1025, "type": "fixture", "allottedTime": 40, "matchId": 26, "stage": "semis", "category": "Mens", "position": 2, "team1": { "type": "calculated", "stage": "group", "group": 2, "position": 1 }, "team2": { "type": "calculated", "stage": "group", "group": 4, "position": 1 } }, { "ref": 1026, "type": "fixture", "allottedTime": 40, "matchId": 27, "stage": "bronze", "category": "Mens", "position": 1, "team1": { "type": "calculated", "stage": "semis", "group": 1, "position": 2 }, "team2": { "type": "calculated", "stage": "semis", "group": 2, "position": 2 } }, { "ref": 1027, "type": "fixture", "allottedTime": 45, "matchId": 28, "stage": "finals", "category": "Mens", "position": 1, "team1": { "type": "calculated", "stage": "semis", "group": 1, "position": 1 }, "team2": { "type": "calculated", "stage": "semis", "group": 2, "position": 1 } }],
        f4: [{ "ref": 1000, "type": "fixture", "allottedTime": 30, "matchId": 1, "stage": "group", "category": "Mens", "position": 0, "team1": "Hamburg/Bel'B'", "team2": "Eindhoven", "letter1": "A", "letter2": "M" }, { "ref": 1001, "type": "fixture", "allottedTime": 30, "matchId": 2, "stage": "group", "category": "Mens", "position": 0, "team1": "Frankfurt", "team2": "Amsterdam A", "letter1": "E", "letter2": "I" }, { "ref": 1002, "type": "fixture", "allottedTime": 30, "matchId": 3, "stage": "group", "category": "Mens", "position": 0, "team1": "Hamburg/Bel'B'", "team2": "Amsterdam A", "letter1": "A", "letter2": "I" }, { "ref": 1003, "type": "fixture", "allottedTime": 30, "matchId": 4, "stage": "group", "category": "Mens", "position": 0, "team1": "Eindhoven", "team2": "Frankfurt", "letter1": "M", "letter2": "E" }, { "ref": 1004, "type": "fixture", "allottedTime": 30, "matchId": 5, "stage": "group", "category": "Mens", "position": 0, "team1": "Hamburg/Bel'B'", "team2": "Frankfurt", "letter1": "A", "letter2": "E" }, { "ref": 1005, "type": "fixture", "allottedTime": 30, "matchId": 6, "stage": "group", "category": "Mens", "position": 0, "team1": "Amsterdam A", "team2": "Eindhoven", "letter1": "I", "letter2": "M" }, { "ref": 1006, "type": "fixture", "allottedTime": 30, "matchId": 7, "stage": "group", "category": "Mens", "position": 1, "team1": "Nijmegen", "team2": "Leuven B", "letter1": "F", "letter2": "J" }, { "ref": 1007, "type": "fixture", "allottedTime": 30, "matchId": 8, "stage": "group", "category": "Mens", "position": 1, "team1": "Belgium A", "team2": "Leuven B", "letter1": "B", "letter2": "J" }, { "ref": 1008, "type": "fixture", "allottedTime": 30, "matchId": 9, "stage": "group", "category": "Mens", "position": 1, "team1": "Belgium A", "team2": "Nijmegen", "letter1": "B", "letter2": "F" }, { "ref": 1009, "type": "fixture", "allottedTime": 30, "matchId": 10, "stage": "group", "category": "Mens", "position": 2, "team1": "Maastricht", "team2": "Leuven A", "letter1": "G", "letter2": "K" }, { "ref": 1010, "type": "fixture", "allottedTime": 30, "matchId": 11, "stage": "group", "category": "Mens", "position": 2, "team1": "Groningen", "team2": "Leuven A", "letter1": "C", "letter2": "K" }, { "ref": 1011, "type": "fixture", "allottedTime": 30, "matchId": 12, "stage": "group", "category": "Mens", "position": 2, "team1": "Groningen", "team2": "Maastricht", "letter1": "C", "letter2": "G" }, { "ref": 1012, "type": "fixture", "allottedTime": 30, "matchId": 13, "stage": "group", "category": "Mens", "position": 3, "team1": "Dusseldorf/Cologne", "team2": "Hague A", "letter1": "H", "letter2": "L" }, { "ref": 1013, "type": "fixture", "allottedTime": 30, "matchId": 14, "stage": "group", "category": "Mens", "position": 3, "team1": "Luxembourg A", "team2": "Hague A", "letter1": "D", "letter2": "L" }, { "ref": 1014, "type": "fixture", "allottedTime": 30, "matchId": 15, "stage": "group", "category": "Mens", "position": 3, "team1": "Luxembourg A", "team2": "Dusseldorf/Cologne", "letter1": "D", "letter2": "H" }, { "ref": 1015, "type": "fixture", "allottedTime": 20, "matchId": 16, "stage": "group", "category": "Ladies", "position": 0, "team1": "Leuven A", "team2": "Groningen", "letter1": "C", "letter2": "I" }, { "ref": 1016, "type": "fixture", "allottedTime": 20, "matchId": 17, "stage": "group", "category": "Ladies", "position": 0, "team1": "Luxembourg A", "team2": "Amsterdam A", "letter1": "E", "letter2": "G" }, { "ref": 1017, "type": "fixture", "allottedTime": 20, "matchId": 18, "stage": "group", "category": "Ladies", "position": 0, "team1": "Hague/Frankfurt", "team2": "Groningen", "letter1": "A", "letter2": "I" }, { "ref": 1018, "type": "fixture", "allottedTime": 20, "matchId": 19, "stage": "group", "category": "Ladies", "position": 0, "team1": "Leuven A", "team2": "Luxembourg A", "letter1": "C", "letter2": "E" }, { "ref": 1019, "type": "fixture", "allottedTime": 20, "matchId": 20, "stage": "group", "category": "Ladies", "position": 0, "team1": "Hague/Frankfurt", "team2": "Amsterdam A", "letter1": "A", "letter2": "G" }, { "ref": 1020, "type": "fixture", "allottedTime": 20, "matchId": 21, "stage": "group", "category": "Ladies", "position": 0, "team1": "Groningen", "team2": "Luxembourg A", "letter1": "I", "letter2": "E" }, { "ref": 1021, "type": "fixture", "allottedTime": 20, "matchId": 22, "stage": "group", "category": "Ladies", "position": 0, "team1": "Hague/Frankfurt", "team2": "Luxembourg A", "letter1": "A", "letter2": "E" }, { "ref": 1022, "type": "fixture", "allottedTime": 20, "matchId": 23, "stage": "group", "category": "Ladies", "position": 0, "team1": "Amsterdam A", "team2": "Leuven A", "letter1": "G", "letter2": "C" }, { "ref": 1023, "type": "fixture", "allottedTime": 20, "matchId": 24, "stage": "group", "category": "Ladies", "position": 0, "team1": "Hague/Frankfurt", "team2": "Leuven A", "letter1": "A", "letter2": "C" }, { "ref": 1024, "type": "fixture", "allottedTime": 20, "matchId": 25, "stage": "group", "category": "Ladies", "position": 0, "team1": "Amsterdam A", "team2": "Groningen", "letter1": "G", "letter2": "I" }, { "ref": 1025, "type": "fixture", "allottedTime": 30, "matchId": 26, "stage": "group", "category": "Ladies", "position": 1, "team1": "Belgium A", "team2": "Hamb/Duss/Lux'B'", "letter1": "B", "letter2": "H" }, { "ref": 1026, "type": "fixture", "allottedTime": 30, "matchId": 27, "stage": "group", "category": "Ladies", "position": 1, "team1": "A'dam'B'/Leuven'B'", "team2": "Nijmegen", "letter1": "D", "letter2": "F" }, { "ref": 1027, "type": "fixture", "allottedTime": 30, "matchId": 28, "stage": "group", "category": "Ladies", "position": 1, "team1": "Belgium A", "team2": "Nijmegen", "letter1": "B", "letter2": "F" }, { "ref": 1028, "type": "fixture", "allottedTime": 30, "matchId": 29, "stage": "group", "category": "Ladies", "position": 1, "team1": "Hamb/Duss/Lux'B'", "team2": "A'dam'B'/Leuven'B'", "letter1": "H", "letter2": "D" }, { "ref": 1029, "type": "fixture", "allottedTime": 30, "matchId": 30, "stage": "group", "category": "Ladies", "position": 1, "team1": "Belgium A", "team2": "A'dam'B'/Leuven'B'", "letter1": "B", "letter2": "D" }, { "ref": 1030, "type": "fixture", "allottedTime": 30, "matchId": 31, "stage": "group", "category": "Ladies", "position": 1, "team1": "Nijmegen", "team2": "Hamb/Duss/Lux'B'", "letter1": "F", "letter2": "H" }, { "ref": 1031, "type": "fixture", "allottedTime": 40, "matchId": 32, "stage": "semis", "category": "Mens", "position": 1, "team1": { "type": "calculated", "stage": "group", "group": 1, "position": 1 }, "team2": { "type": "calculated", "stage": "group", "group": 3, "position": 1 } }, { "ref": 1032, "type": "fixture", "allottedTime": 40, "matchId": 33, "stage": "semis", "category": "Mens", "position": 2, "team1": { "type": "calculated", "stage": "group", "group": 2, "position": 1 }, "team2": { "type": "calculated", "stage": "group", "group": 4, "position": 1 } }, { "ref": 1033, "type": "fixture", "allottedTime": 40, "matchId": 34, "stage": "bronze", "category": "Mens", "position": 1, "team1": { "type": "calculated", "stage": "semis", "group": 1, "position": 2 }, "team2": { "type": "calculated", "stage": "semis", "group": 2, "position": 2 } }, { "ref": 1034, "type": "fixture", "allottedTime": 45, "matchId": 35, "stage": "finals", "category": "Mens", "position": 1, "team1": { "type": "calculated", "stage": "semis", "group": 1, "position": 1 }, "team2": { "type": "calculated", "stage": "semis", "group": 2, "position": 1 } }, { "ref": 1035, "type": "fixture", "allottedTime": 40, "matchId": 36, "stage": "semis", "category": "Mens", "position": 1, "team1": { "type": "calculated", "stage": "group", "group": 1, "position": 1 }, "team2": { "type": "calculated", "stage": "group", "group": 3, "position": 1 } }, { "ref": 1036, "type": "fixture", "allottedTime": 40, "matchId": 37, "stage": "semis", "category": "Mens", "position": 2, "team1": { "type": "calculated", "stage": "group", "group": 2, "position": 1 }, "team2": { "type": "calculated", "stage": "group", "group": 4, "position": 1 } }, { "ref": 1037, "type": "fixture", "allottedTime": 40, "matchId": 38, "stage": "bronze", "category": "Mens", "position": 1, "team1": { "type": "calculated", "stage": "semis", "group": 1, "position": 2 }, "team2": { "type": "calculated", "stage": "semis", "group": 2, "position": 2 } }, { "ref": 1038, "type": "fixture", "allottedTime": 45, "matchId": 39, "stage": "finals", "category": "Mens", "position": 1, "team1": { "type": "calculated", "stage": "semis", "group": 1, "position": 1 }, "team2": { "type": "calculated", "stage": "semis", "group": 2, "position": 1 } }, { "ref": 1039, "type": "fixture", "allottedTime": 35, "matchId": 40, "stage": "quarters", "category": "Mens", "position": 1, "team1": { "type": "calculated", "stage": "group", "group": 1, "position": 1 }, "team2": { "type": "calculated", "stage": "group", "group": 8, "position": 2 } }, { "ref": 1040, "type": "fixture", "allottedTime": 35, "matchId": 41, "stage": "quarters", "category": "Mens", "position": 2, "team1": { "type": "calculated", "stage": "group", "group": 3, "position": 1 }, "team2": { "type": "calculated", "stage": "group", "group": 6, "position": 2 } }, { "ref": 1041, "type": "fixture", "allottedTime": 35, "matchId": 42, "stage": "quarters", "category": "Mens", "position": 3, "team1": { "type": "calculated", "stage": "group", "group": 2, "position": 1 }, "team2": { "type": "calculated", "stage": "group", "group": 7, "position": 2 } }, { "ref": 1042, "type": "fixture", "allottedTime": 35, "matchId": 43, "stage": "quarters", "category": "Mens", "position": 4, "team1": { "type": "calculated", "stage": "group", "group": 4, "position": 1 }, "team2": { "type": "calculated", "stage": "group", "group": 5, "position": 2 } }, { "ref": 1043, "type": "fixture", "allottedTime": 40, "matchId": 44, "stage": "semis", "category": "Mens", "position": 1, "team1": { "type": "calculated", "stage": "quarters", "group": 1, "position": 1 }, "team2": { "type": "calculated", "stage": "quarters", "group": 2, "position": 1 } }, { "ref": 1044, "type": "fixture", "allottedTime": 40, "matchId": 45, "stage": "semis", "category": "Mens", "position": 2, "team1": { "type": "calculated", "stage": "quarters", "group": 3, "position": 1 }, "team2": { "type": "calculated", "stage": "quarters", "group": 4, "position": 1 } }, { "ref": 1045, "type": "fixture", "allottedTime": 40, "matchId": 46, "stage": "bronze", "category": "Mens", "position": 1, "team1": { "type": "calculated", "stage": "semis", "group": 1, "position": 2 }, "team2": { "type": "calculated", "stage": "semis", "group": 2, "position": 2 } }, { "ref": 1046, "type": "fixture", "allottedTime": 45, "matchId": 47, "stage": "finals", "category": "Mens", "position": 1, "team1": { "type": "calculated", "stage": "semis", "group": 1, "position": 1 }, "team2": { "type": "calculated", "stage": "semis", "group": 2, "position": 1 } }, { "ref": 1047, "type": "fixture", "allottedTime": 40, "matchId": 48, "stage": "semis", "category": "Ladies", "position": 1, "team1": { "type": "calculated", "stage": "group", "group": 1, "position": 1 }, "team2": { "type": "calculated", "stage": "group", "group": 3, "position": 1 } }, { "ref": 1048, "type": "fixture", "allottedTime": 40, "matchId": 49, "stage": "semis", "category": "Ladies", "position": 2, "team1": { "type": "calculated", "stage": "group", "group": 2, "position": 1 }, "team2": { "type": "calculated", "stage": "group", "group": 4, "position": 1 } }, { "ref": 1049, "type": "fixture", "allottedTime": 40, "matchId": 50, "stage": "bronze", "category": "Ladies", "position": 1, "team1": { "type": "calculated", "stage": "semis", "group": 1, "position": 2 }, "team2": { "type": "calculated", "stage": "semis", "group": 2, "position": 2 } }, { "ref": 1050, "type": "fixture", "allottedTime": 45, "matchId": 51, "stage": "finals", "category": "Ladies", "position": 1, "team1": { "type": "calculated", "stage": "semis", "group": 1, "position": 1 }, "team2": { "type": "calculated", "stage": "semis", "group": 2, "position": 1 } }, { "ref": 1051, "type": "fixture", "allottedTime": 40, "matchId": 52, "stage": "semis", "category": "Ladies", "position": 1, "team1": { "type": "calculated", "stage": "group", "group": 1, "position": 1 }, "team2": { "type": "calculated", "stage": "group", "group": 3, "position": 1 } }, { "ref": 1052, "type": "fixture", "allottedTime": 40, "matchId": 53, "stage": "semis", "category": "Ladies", "position": 2, "team1": { "type": "calculated", "stage": "group", "group": 2, "position": 1 }, "team2": { "type": "calculated", "stage": "group", "group": 4, "position": 1 } }, { "ref": 1053, "type": "fixture", "allottedTime": 40, "matchId": 54, "stage": "bronze", "category": "Ladies", "position": 1, "team1": { "type": "calculated", "stage": "semis", "group": 1, "position": 2 }, "team2": { "type": "calculated", "stage": "semis", "group": 2, "position": 2 } }, { "ref": 1054, "type": "fixture", "allottedTime": 45, "matchId": 55, "stage": "finals", "category": "Ladies", "position": 1, "team1": { "type": "calculated", "stage": "semis", "group": 1, "position": 1 }, "team2": { "type": "calculated", "stage": "semis", "group": 2, "position": 1 } }],
    }
};
export default testdata;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fixture = exports.Break = void 0;
class Activity {
    constructor(type) {
        this.ref = Activity.reference++;
        this.type = type;
        this.scheduledTime = null;
        this.pitch = "";
        this.allottedTime = 0;
    }
    // provide a representation of the activity
    get repr() {
        return JSON.stringify({
            type: this.type,
            scheduledTime: this.scheduledTime,
            pitch: this.pitch,
            allottedTime: this.allottedTime,
        });
    }
}
Activity.reference = 100;
class Break extends Activity {
    constructor() {
        super('break');
        this.reasonCode = 0;
        this.note = '';
    }
    set reason(info) {
        const [code, note] = info;
        // provide a reason for the break
        this.reasonCode = code;
        this.note = note;
    }
}
exports.Break = Break;
class Fixture extends Activity {
    constructor(rowData) {
        super('fixture');
        this.matchId = 0;
        this.scheduledTime = '';
        this.pitch = '';
        this.stage = '';
        this.bracket = '';
        this.category = '';
        this.position = 0;
        this.team1 = '';
        this.letter1 = '';
        this.team2 = '';
        this.letter2 = '';
        this.umpireTeam = '';
        this.time = {
            halfDuration: 0,
            breakDuration: 0,
            minRest: 0,
            allotted: 0
        };
        this.score1 = { goals: null, points: null };
        this.score2 = { goals: null, points: null };
        if (Object.keys(rowData).length) {
            this.data = rowData;
        }
    }
    set data(rowData) {
        const { matchId, scheduledTime, pitch, stage, category, bracket, position, team1, team2, umpireTeam, halfDuration, breakDuration, minRest, allotted, } = rowData;
        this.matchId = matchId;
        this.scheduledTime = scheduledTime;
        this.pitch = pitch;
        this.stage = stage;
        this.category = category;
        this.bracket = bracket;
        this.position = position;
        this.team1 = team1;
        this.team2 = team2;
        this.umpireTeam = umpireTeam;
        this.time = {
            halfDuration,
            breakDuration,
            minRest,
            allotted
        };
        this.score1 = { goals: null, points: null };
        this.score2 = { goals: null, points: null };
    }
    get repr() {
        const { matchId, scheduledTime, pitch, category, bracket, time, position, team1, team2 } = this;
        return `${matchId}|${scheduledTime}|${pitch}|${category}|${bracket}|${team1}|${team2}`;
        return JSON.stringify({
            matchId: this.matchId,
            scheduledTime: this.scheduledTime,
            pitch: this.pitch,
            category: this.category,
            stage: this.stage,
            position: this.position,
            time: this.time,
            team1: this.team1,
            score1: this.score1,
            team2: this.team2,
            score2: this.score2,
            umpireTeam: this.umpireTeam,
        });
    }
}
exports.Fixture = Fixture;

import { addMinutes } from './util';

import { ITournament, IAvailabilty, IFixture } from '../types';

class Pitch {
    name: string;
    availability: IAvailabilty;
    nextAvailableSlot: string;

    constructor(name: string, availability: IAvailabilty) {
        this.name = name;
        this.availability = availability;
        this.nextAvailableSlot = availability.from; // initialize to the first available slot
    }
}

class PitchAllocator {
    tournament: ITournament
    pitches: any[]

    constructor(tournament: ITournament) {
        this.tournament = tournament;
        this.pitches = []
    }

    nextAvailablePitch() {
        const convertToMs = (time: string) => new Date(time).getTime();
        return this.pitches
            .sort((a, b) => {
                const nextA = convertToMs(a.nextAvailableSlot)
                const nextB = convertToMs(b.nextAvailableSlot)
                return nextA > nextB ? 1 : nextB > nextA ? -1 : 0
            })[0]
    }

    /**
     * Allocate fixtures to available pitches
     */
    allocate(category: string) {
        const { pitches, categories } = this.tournament;
        const catPitches = categories[category].pitches;
        this.pitches = [...pitches]
            .filter((p, i) => catPitches.includes(i))
            .map(p => new Pitch(p.name, p.availability));

        // Loop over each match and try to allocate a match to the next available slot
        this.tournament
            .filterActivities((f: IFixture) => f.category === category)
            .forEach(match => {
                const pitch = this.nextAvailablePitch()
                match.pitch = pitch.name
                match.scheduledTime = pitch.nextAvailableSlot
                const time = pitch.nextAvailableSlot.split('T').pop().substring(0, 5)
                const starttime = addMinutes(time, match?.time?.allotted||30);
                const nextSlot = `${this.tournament.startDate}T${starttime}:00`;
                pitch.nextAvailableSlot = nextSlot
            })
    };
}

export default PitchAllocator;

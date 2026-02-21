export interface IAvailabilty {
  from: string;
  to: string
}
export interface IPitch {
  name: string;
  availability: IAvailabilty;
}
interface ICoordinate {
  latitude: number;
  longitude: number;
}
export interface IVenue {
  name: string;
  coordinates: ICoordinate;
}
export interface IBrackets {
  cup?: number;
  shield?: number;
  plate?: number;
  bowl?: number;
  spoon?: number;
}
interface EliminationRules {
  brackets: IBrackets;
}

export interface IRules {
  preliminary: {}; // Assuming no specific properties are needed here
  elimination: EliminationRules;
}

export interface ICategory {
  teams: string[];
  pitches: number[];
  rules: IRules;
  groups: any[];
}

export interface ITournament {
  tournamentId: number;
  description: string;
  startDate: Date;
  pitches: IPitch[];
  venues: IVenue[];
  categories: {
    [key: string]: ICategory;
  };
  activities: any[]
  // FIXME: remove "any" types
  // getters/setters
  groupSizes: any;
  bracketNames: { [category: string]: string[] };
  
  // functions
  filterActivities: (x: Function) => IFixture[];
  clearActivities: any;
  fixturesAppend: any;
  updateLetters: any;
}

export interface IFixture {
  matchId: number;
  scheduledTime: string;
  pitch: string;
  category: string;
  stage: string;
  bracket: string | null;
  position: number;
  time: {
    halfDuration: number;
    breakDuration: number;
    minRest: number;
    allotted: number;
  },
  team1: string;
  letter1?: string;
  score1: {
    goals: number | null;
    points: number | null;
  },
  team2: string;
  letter2?: string;
  score2: {
    goals: number | null;
    points: number | null;
  }
  umpireTeam?: string;
}

export interface IFixProps {
  matchId: number;
  scheduledTime: string;
  pitch: string;
  stage: string;
  bracket: string | null;
  category: string;
  position: number;
  letter1?: string;
  team1: string;
  letter2?: string;
  team2: string;
  umpireTeam: string;
  duration: number
}

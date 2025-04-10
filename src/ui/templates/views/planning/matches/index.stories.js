import '../../../../public/scripts/webcomponents/team-name.js';
import '../../../../public/scripts/webcomponents/logo-box.js';

import generateMatchesPlanning from './index.js';

const sampleData = {
  tournamentId: 'test-tournament',
  matches: [
    {
      id: 'm1',
      grp: 'A',
      category: 'Group',
      stage: 'group',
      pitch: 'Pitch 1',
      scheduledTime: '2025-04-11 10:00',
      team1: 'Team Alpha',
      goals1: 2,
      points1: 1,
      team2: 'Team Beta',
      goals2: 1,
      points2: 0,
      umpireTeam: 'Umpire 1',
      started: 'false'
    },
    {
      id: 'm2',
      grp: 'B',
      category: 'Knockout',
      stage: 'knockout',
      pitch: 'Pitch 2',
      scheduledTime: '2025-04-11 12:00',
      team1: 'Team Gamma',
      goals1: 3,
      points1: 2,
      team2: 'Team Delta',
      goals2: 0,
      points2: 0,
      umpireTeam: 'Umpire 2',
      started: 'true'
    }
  ]
};

export default {
  title: 'planning/Matches Page',
  parameters: {
    layout: 'fullscreen'
  }
};

export const Default = {
  render: () => generateMatchesPlanning(sampleData),
};

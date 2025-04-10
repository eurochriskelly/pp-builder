import generateKnockoutFixtures from './knockoutFixtures.js';

import '../../../public/scripts/webcomponents/team-name.js';
import '../../../public/scripts/webcomponents/logo-box.js';
import '../../../public/scripts/webcomponents/gaelic-score.js';

// Realistic tournament progression data
const sampleData = [
  // Cup Tournament - 8 teams
  // Quarter Finals
  {
    category: "Senior",
    stage: "cup_quarter",
    team1: "Dublin A",
    team2: "Meath A",
    goals1: 2,
    points1: 12,
    goals2: 0,
    points2: 5,
    outcome: "played"
  },
  {
    category: "Senior",
    stage: "cup_quarter",
    team1: "Mayo A",
    team2: "Donegal A",
    goals1: 1,
    points1: 15,
    goals2: 0,
    points2: 8,
    outcome: "played"
  },
  {
    category: "Senior",
    stage: "cup_quarter",
    team1: "Kerry A",
    team2: "Cork A",
    goals1: 2,
    points1: 10,
    goals2: 1,
    points2: 9,
    outcome: "played"
  },
  {
    category: "Senior",
    stage: "cup_quarter",
    team1: "Galway A",
    team2: "Armagh A",
    goals1: 1,
    points1: 12,
    goals2: 0,
    points2: 10,
    outcome: "played"
  },
  
  // Semi Finals (winners from quarters)
  {
    category: "Senior",
    stage: "cup_semi",
    team1: "Dublin A",
    team2: "Mayo A",
    goals1: 2,
    points1: 10,
    goals2: 0,
    points2: 8,
    outcome: "played"
  },
  {
    category: "Senior",
    stage: "cup_semi",
    team1: "Kerry A",
    team2: "Galway A",
    goals1: 3,
    points1: 5,
    goals2: 1,
    points2: 7,
    outcome: "played"
  },
  
  // Final (winners from semis)
  {
    category: "Senior",
    stage: "cup_final",
    team1: "Dublin A",
    team2: "Kerry A",
    goals1: 2,
    points1: 8,
    goals2: 1,
    points2: 10,
    outcome: "played"
  },
  
  // 3rd/4th playoff (losers from semis)
  {
    category: "Senior",
    stage: "cup_3rd4th",
    team1: "Mayo A",
    team2: "Galway A",
    goals1: 1,
    points1: 12,
    goals2: 1,
    points2: 10,
    outcome: "played"
  },

  // Shield Tournament - teams that lost in cup quarters
  // Quarter Finals
  {
    category: "Senior",
    stage: "shield_quarter",
    team1: "Meath A",
    team2: "Derry A",
    goals1: 0,
    points1: 0,
    goals2: 0,
    points2: 1,
    outcome: "not played" // Walkover
  },
  {
    category: "Senior",
    stage: "shield_quarter",
    team1: "Donegal A",
    team2: "Down A",
    goals1: 2,
    points1: 8,
    goals2: 0,
    points2: 7,
    outcome: "played"
  },
  {
    category: "Senior",
    stage: "shield_quarter",
    team1: "Cork A",
    team2: "Kildare A",
    goals1: 1,
    points1: 12,
    goals2: 0,
    points2: 5,
    outcome: "played"
  },
  {
    category: "Senior",
    stage: "shield_quarter",
    team1: "Armagh A",
    team2: "Monaghan A",
    goals1: 1,
    points1: 10,
    goals2: 1,
    points2: 9,
    outcome: "played"
  },
  
  // Semi Finals (winners from shield quarters)
  {
    category: "Senior",
    stage: "shield_semi",
    team1: "Derry A",
    team2: "Donegal A",
    goals1: 2,
    points1: 7,
    goals2: 1,
    points2: 8,
    outcome: "played"
  },
  {
    category: "Senior",
    stage: "shield_semi",
    team1: "Cork A",
    team2: "Armagh A",
    goals1: 1,
    points1: 12,
    goals2: 0,
    points2: 5,
    outcome: "played"
  },
  
  // Final (winners from shield semis)
  {
    category: "Senior",
    stage: "shield_final",
    team1: "Donegal A",
    team2: "Cork A",
    goals1: 1,
    points1: 10,
    goals2: 0,
    points2: 8,
    outcome: "played"
  }
];

// Export the story metadata
export default {
  title: 'Fixtures/Knockout', // The category and name in Storybook's sidebar
  parameters: {
    layout: 'padded',
  },
};

// Default story
export const Default = {
  render: () => {
    const html = generateKnockoutFixtures(sampleData);
    return html;
  },
};

// Empty data story
export const EmptyData = {
  render: () => {
    const html = generateKnockoutFixtures([]);
    return html;
  },
};

import generateGroupStandings from './groupStandings.js';

import '../../../public/scripts/webcomponents/team-name.js';
import '../../../public/scripts/webcomponents/logo-box.js';
import '../../../public/scripts/webcomponents/gaelic-score.js';

// Sample data to showcase the function
const sampleData = {
  "Category1": [
    {
      groupName: "A",
      rows: [
        { team: "Belgium A", MatchesPlayed: 3, Wins: 2, Draws: 0, Losses: 1, PointsFrom: 6, PointsDifference: 3, TotalPoints: 6 },
        { team: "Team B", MatchesPlayed: 3, Wins: 1, Draws: 1, Losses: 1, PointsFrom: 4, PointsDifference: 1, TotalPoints: 4 },
        { team: "Team C", MatchesPlayed: 3, Wins: 0, Draws: 1, Losses: 2, PointsFrom: 2, PointsDifference: -4, TotalPoints: 1 },
      ],
    },
  ],
};

const sampleFixtures = [
  { category: "Category1", team1: "Belgium A", team2: "Team B", goals1: 2, points1: 1, goals2: 1, points2: 0 },
  { category: "Category1", team1: "Belgium A", team2: "Team C", goals1: 2, points1: 8, goals2: 0, points2: 0 },
  { category: "Category1", team1: "Team C", team2: "Team B", goals1: 0, points1: 8, goals2: 3, points2: 2 },
];

// Export the story metadata
export default {
  title: 'Standings/Table', // The category and name in Storybook’s sidebar
  parameters: {
    // Optional: Define how the story is rendered
    layout: 'padded',
  },
};

// Default story
export const Default = {
  render: () => {
    const html = generateGroupStandings(sampleData, sampleFixtures);
    return html; // Storybook will inject this HTML into the preview
  },
};

// Empty data story
export const EmptyData = {
  render: () => {
    const html = generateGroupStandings({}, []);
    return html;
  },
};

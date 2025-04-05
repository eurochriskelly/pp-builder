import generateKnockoutFixtures from './knockoutFixtures.js';

import '../../../public/scripts/webcomponents/team-name.js';
import '../../../public/scripts/webcomponents/logo-box.js';
import '../../../public/scripts/webcomponents/gaelic-score.js';

// Sample data to showcase the function
const sampleData = [
  {
    category: "Senior",
    stage: "Quarter Final",
    team1: "Dublin A",
    team2: "Kerry A",
    goals1: 2,
    points1: 8,
    goals2: 1,
    points2: 10,
    outcome: "played"
  },
  {
    category: "Senior",
    stage: "Quarter Final",
    team1: "Mayo A",
    team2: "Galway A",
    goals1: 0,
    points1: 0,
    goals2: 0,
    points2: 1,
    outcome: "not played" // Will show as walkover
  },
  {
    category: "Senior",
    stage: "Semi Final",
    team1: "Winner QF1",
    team2: "Winner QF2",
    goals1: null,
    points1: null,
    goals2: null,
    points2: null,
    outcome: "pending"
  },
  {
    category: "Junior",
    stage: "Final",
    team1: "Cork B",
    team2: "Tipperary B",
    goals1: 3,
    points1: 5,
    goals2: 3,
    points2: 5,
    outcome: "shared" // Will show as shared result
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

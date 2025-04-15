import generateGroupFixtures from './index.js';

import '../../../../../../public/scripts/webcomponents/team-name.js';

// Sample data to showcase the function
const sampleData = [
  {
    category: "Category1",
    team1: "Belgium A",
    team2: "Team B",
    goals1: 2,
    points1: 1,
    goals2: 1,
    points2: 0
  },
  {
    category: "Category1",
    team1: "Belgium A",
    team2: "Team C",
    goals1: 2,
    points1: 8,
    goals2: 0,
    points2: 0
  },
  {
    category: "Category2",
    team1: "Team X",
    team2: "Team Y",
    goals1: 1,
    points1: 5,
    goals2: 1,
    points2: 5
  },
  {
    category: "Category2",
    team1: "Team X",
    team2: "Team Z",
    goals1: 3,
    points1: 2,
    goals2: 2,
    points2: 3
  }
];

// Special cases data
const specialCasesData = [
  {
    category: "Special Cases",
    team1: "Walkover Team",
    team2: "Conceding Team",
    goals1: 0,
    points1: 0,
    goals2: 0,
    points2: 0
  },
  {
    category: "Special Cases",
    team1: "Team With/Long Name",
    team2: "Short Name",
    goals1: 5,
    points1: 10,
    goals2: 2,
    points2: 5
  }
];

// Export the story metadata
export default {
  title: 'Fixtures/Table',
  parameters: {
    layout: 'padded',
  },
};

// Default story with regular matches
export const Default = {
  render: () => {
    const html = generateGroupFixtures(sampleData);
    return html;
  },
};

// Story with special cases
export const SpecialCases = {
  render: () => {
    const html = generateGroupFixtures(specialCasesData);
    return html;
  },
};

// Empty data story
export const EmptyData = {
  render: () => {
    const html = generateGroupFixtures([]);
    return html;
  },
};

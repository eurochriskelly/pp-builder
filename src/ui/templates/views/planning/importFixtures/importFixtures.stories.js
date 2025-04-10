import generateImportFixtures from './index.js';

// Sample CSV data
const sampleCSVData = [
  {
    matchId: 1,
    startTime: '09:00',
    pitch: 'Pitch 1',
    stage: 'group',
    category: 'Men A',
    group: '1',
    team1: 'Team A',
    team2: 'Team B',
    umpireTeam: 'Team C',
    duration: '40'
  },
  {
    matchId: 2,
    startTime: '10:00',
    pitch: 'Pitch 2',
    stage: 'group',
    category: 'Men A',
    group: '1',
    team1: 'Team C',
    team2: 'Team D',
    umpireTeam: 'Team A',
    duration: '40'
  },
  {
    matchId: 3,
    startTime: '11:00',
    pitch: 'Pitch 1',
    stage: 'group',
    category: 'Women A',
    group: '1',
    team1: 'Team X',
    team2: 'Team Y',
    umpireTeam: 'Team Z',
    duration: '40'
  }
];

// Validation results
const validationResult = {
  isValid: true,
  warnings: [
    'Team E is not registered in any category',
    'Pitch 3 is not configured for category Women A'
  ],
  props: {
    categories: ['Men A', 'Women A'],
    pitches: ['Pitch 1', 'Pitch 2'],
    groups: {
      byCategory: {
        'Men A': ['1', '2'],
        'Women A': ['1']
      }
    },
    teams: {
      byCategory: {
        'Men A': ['Team A', 'Team B', 'Team C', 'Team D'],
        'Women A': ['Team X', 'Team Y', 'Team Z']
      }
    }
  }
};

// Export the story metadata
export default {
  title: 'Planning/Import Fixtures',
  parameters: {
    layout: 'padded',
  },
};

// Default empty state
export const Default = {
  render: () => {
    const html = generateImportFixtures(1);
    return html;
  },
};

// With CSV data loaded
export const WithCSVData = {
  render: () => {
    const html = generateImportFixtures(1, sampleCSVData);
    return html;
  },
};

// With validation results
export const WithValidation = {
  render: () => {
    const modifiedResult = {
      ...validationResult,
      isValid: false // Force showing warnings
    };
    const html = generateImportFixtures(1, sampleCSVData, modifiedResult);
    // Remove the validate button from the HTML
    return html.replace(
      '<form hx-post="/planning/1/validate-fixtures" hx-target="#import-fixtures" hx-swap="outerHTML" class="mb-4">',
      ''
    ).replace(
      '<button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Validate</button>',
      ''
    ).replace(
      '</form>',
      ''
    );
  },
};

// With valid data ready to import
export const ValidData = {
  render: () => {
    const validResult = {
      ...validationResult,
      warnings: []
    };
    const html = generateImportFixtures(1, sampleCSVData, validResult);
    return html;
  },
};

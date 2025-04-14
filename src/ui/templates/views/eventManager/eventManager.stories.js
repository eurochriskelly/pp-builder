const { generateEventManager } = require('./index');

export default {
  title: 'Execution/EventManager',
  parameters: {
    layout: 'padded',
  },
};

// Example with multiple competitions
export const MultipleCompetitions = {
  render: () => {
    const tournament = {
      Title: 'Summer Tournament',
      Date: '2023-07-15',
      Location: 'Dublin',
      categories: ['Cup', 'Shield', 'Plate'],
    };
    const uuid = '12345';
    return generateEventManager(uuid, tournament, true);
  },
};

// Example with a single competition
export const SingleCompetition = {
  render: () => {
    const tournament = {
      Title: 'Winter Tournament',
      Date: '2023-12-10',
      Location: 'Cork',
      categories: ['Cup'],
    };
    const uuid = '67890';
    return generateEventManager(uuid, tournament, false);
  },
};

// Example with no competitions
export const NoCompetitions = {
  render: () => {
    const tournament = {
      Title: 'Spring Tournament',
      Date: '2023-04-20',
      Location: 'Galway',
      categories: [],
    };
    const uuid = '54321';
    return generateEventManager(uuid, tournament, false);
  },
};

// Example with undefined categories
export const UndefinedCategories = {
  render: () => {
    const tournament = {
      Title: 'Autumn Tournament',
      Date: '2023-10-05',
      Location: 'Limerick',
    };
    const uuid = '98765';
    return generateEventManager(uuid, tournament, true);
  },
};

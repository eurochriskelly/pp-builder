import generateEditFixtureForm from './index.js';

export default {
  title: 'Fixtures/Edit Fixture',
  parameters: { layout: 'padded' },
};

const sampleFixture = {
  id: '123',
  team1: 'Belgium A',
  goals1: 2,
  points1: 1,
  team2: 'Team B',
  goals2: 1,
  points2: 0,
  pitch: 'Pitch 1',
  time: '2024-07-01T15:00',
};

export const Default = {
  render: () => generateEditFixtureForm(sampleFixture),
};

export const Empty = {
  render: () => generateEditFixtureForm({}),
};

import generateEditFixtureForm from './index.js'; // Ensure .js extension if needed by your setup
import './editFixture.style.css'; // Import CSS directly

export default {
  title: 'Competition/Edit Fixture Dialog', // Adjusted title
  argTypes: { // Optional: Define controls for Storybook UI if needed
    fixture: { control: 'object' },
    availableData: { control: 'object' },
  },
};

// Define sample data for the story
const sampleFixture = {
  id: 'fxt-123',
  team1: 'Team Alpha',
  team2: 'Team Beta',
  // Corrected: Removed duplicate goals1/points1
  goals1: 1,
  points1: 2,
  goals2: 0,
  points2: 5,
  stage: 'group',
  stageLevel: 1,
  groupName: 'Mens Group A',
  pitch: 'Pitch 2',
  time: '10:00',
  moveAfter: 'fxt-122' // ID of the fixture to move after
};

const sampleAvailableData = {
  teams: ['Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta'],
  pitches: ['Pitch 1', 'Pitch 2', 'Pitch 3'],
  fixtures: [
    { id: 'fxt-120', description: '#120 - Mens Group A - Team Gamma vs Team Delta' },
    { id: 'fxt-121', description: '#121 - Mens Group B - Team Epsilon vs Team Zeta' },
    { id: 'fxt-122', description: '#122 - Ladies Group A - Team Eta vs Team Theta' },
    { id: 'fxt-123', description: '#123 - Mens Group A - Team Alpha vs Team Beta' }, // Current fixture itself might be in the list
  ]
};

// Define the story
const Template = ({ fixture, availableData }) => generateEditFixtureForm(fixture, availableData);

export const Default = Template.bind({});
Default.args = {
  fixture: sampleFixture,
  availableData: sampleAvailableData,
};

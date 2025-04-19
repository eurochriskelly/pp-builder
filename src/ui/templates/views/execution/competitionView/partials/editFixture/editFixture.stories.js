import generateEditFixtureForm from './index';
import '/styles/editFixture.style.css';

export default {
  title: 'Competition/EditFixtureDialog',
};

const sampleFixture = {
  id: '123',
  team1: 'BA',
  team2: 'AB',
  goals1: 0,
  points1: 0,
  goals2: 0,
  points2: 0,
  groupName: 'Mens',
  pitch: 'Main Pitch',
  moveAfter: 2
};

export const Default = () => generateEditFixtureForm(sampleFixture);

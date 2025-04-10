import './knockout-level.js';

export default {
  title: 'Components/KnockoutLevel',
  component: 'knockout-level',
  argTypes: {
    matchId: {
      control: 'text',
      description: 'Match ID (only last 3 digits displayed)',
    },
    stage: {
      control: 'text',
      description: 'Stage in format round_level (e.g., cup_final)',
    },
    stageLevel: {
      control: 'text',
      description: 'Stage level in format x.y (e.g., 2.1)',
    },
    category: {
      control: 'text',
      description: 'Category (e.g., Mens, Womens) - not used yet',
    },
  },
};

const Template = ({ matchId, stage, stageLevel, category }) => {
  const el = document.createElement('knockout-level');
  if (matchId) el.setAttribute('match-id', matchId);
  if (stage) el.setAttribute('stage', stage);
  if (stageLevel) el.setAttribute('stageLevel', stageLevel);
  if (category) el.setAttribute('category', category);
  return el;
};

export const Final = Template.bind({});
Final.args = {
  matchId: '120056',
  stage: 'cup_final',
  stageLevel: '1.1',
  category: 'Mens',
};
Final.storyName = 'Final';

export const SemiFinal1 = Template.bind({});
SemiFinal1.args = {
  matchId: '120055',
  stage: 'cup_semis',
  stageLevel: '2.1',
  category: 'Mens',
};
SemiFinal1.storyName = 'Semi-Final 1';

export const SemiFinal2 = Template.bind({});
SemiFinal2.args = {
  matchId: '120054',
  stage: 'cup_semis',
  stageLevel: '2.2',
  category: 'Mens',
};
SemiFinal2.storyName = 'Semi-Final 2';

export const QuarterFinal1 = Template.bind({});
QuarterFinal1.args = {
  matchId: '120053',
  stage: 'cup_quarters',
  stageLevel: '3.1',
  category: 'Mens',
};
QuarterFinal1.storyName = 'Quarter-Final 1';

export const QuarterFinal2 = Template.bind({});
QuarterFinal2.args = {
  matchId: '120052',
  stage: 'cup_quarters',
  stageLevel: '3.2',
  category: 'Mens',
};
QuarterFinal2.storyName = 'Quarter-Final 2';

export const QuarterFinal3 = Template.bind({});
QuarterFinal3.args = {
  matchId: '120051',
  stage: 'cup_quarters',
  stageLevel: '3.3',
  category: 'Mens',
};
QuarterFinal3.storyName = 'Quarter-Final 3';

export const QuarterFinal4 = Template.bind({});
QuarterFinal4.args = {
  matchId: '120050',
  stage: 'cup_quarters',
  stageLevel: '3.4',
  category: 'Mens',
};
QuarterFinal4.storyName = 'Quarter-Final 4';

export const ThirdFourth = Template.bind({});
ThirdFourth.args = {
  matchId: '120049',
  stage: 'cup_3rd4th',
  stageLevel: '2.3',
  category: 'Mens',
};
ThirdFourth.storyName = '3rd/4th Place';

export const FourthFifth = Template.bind({});
FourthFifth.args = {
  matchId: '120048',
  stage: 'cup_4th5th',
  stageLevel: '3.5',
  category: 'Mens',
};
FourthFifth.storyName = '4th/5th Place';

export const FifthSixth = Template.bind({});
FifthSixth.args = {
  matchId: '120047',
  stage: 'cup_5th6th',
  stageLevel: '3.6',
  category: 'Mens',
};
FifthSixth.storyName = '5th/6th Place';

export const SixthSeventh = Template.bind({});
SixthSeventh.args = {
  matchId: '120046',
  stage: 'cup_6th7th',
  stageLevel: '3.7',
  category: 'Mens',
};
SixthSeventh.storyName = '6th/7th Place';

export const SeventhEighth = Template.bind({});
SeventhEighth.args = {
  matchId: '120045',
  stage: 'cup_7th8th',
  stageLevel: '3.8',
  category: 'Mens',
};
SeventhEighth.storyName = '7th/8th Place';

export const AllStages = {
  render: () => {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(4, 1fr)';
    container.style.gap = '20px';
    container.style.padding = '20px';
    container.style.backgroundColor = '#f5f5f5';
    container.style.borderRadius = '8px';

    const stages = [
      { matchId: '120056', stage: 'cup_final', stageLevel: '1.1', category: 'Mens' },
      { matchId: '120055', stage: 'cup_semis', stageLevel: '2.1', category: 'Mens' },
      { matchId: '120054', stage: 'cup_semis', stageLevel: '2.2', category: 'Mens' },
      { matchId: '120053', stage: 'cup_quarters', stageLevel: '3.1', category: 'Mens' },
      { matchId: '120052', stage: 'cup_quarters', stageLevel: '3.2', category: 'Mens' },
      { matchId: '120051', stage: 'cup_quarters', stageLevel: '3.3', category: 'Mens' },
      { matchId: '120050', stage: 'cup_quarters', stageLevel: '3.4', category: 'Mens' },
      { matchId: '120049', stage: 'cup_3rd4th', stageLevel: '2.3', category: 'Mens' },
      { matchId: '120048', stage: 'cup_4th5th', stageLevel: '3.5', category: 'Mens' },
      { matchId: '120047', stage: 'cup_5th6th', stageLevel: '3.6', category: 'Mens' },
      { matchId: '120046', stage: 'cup_6th7th', stageLevel: '3.7', category: 'Mens' },
      { matchId: '120045', stage: 'cup_7th8th', stageLevel: '3.8', category: 'Mens' },
    ];

    stages.forEach(({ matchId, stage, stageLevel, category }) => {
      const el = document.createElement('knockout-level');
      el.setAttribute('match-id', matchId);
      el.setAttribute('stage', stage);
      el.setAttribute('stage-level', stageLevel);
      el.setAttribute('category', category);
      container.appendChild(el);
    });

    return container;
  },
};
AllStages.storyName = 'All Stages';

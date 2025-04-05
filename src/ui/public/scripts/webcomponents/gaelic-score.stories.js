import './gaelic-score.js';

export default {
  title: 'Components/GaelicScore',
  component: 'gaelic-score',
  argTypes: {
    goals: {
      control: { type: 'number', min: 0 },
      description: 'Number of goals (each worth 3 points)',
    },
    points: {
      control: { type: 'number', min: 0 },
      description: 'Number of points',
    },
    layout: {
      control: 'text',
      description: 'Layout format (currently only "default")',
    },
    scale: {
      control: { type: 'number', min: 0.5, max: 3, step: 0.1 },
      description: 'Scaling factor for font size',
    },
    goalsagainst: {
      control: { type: 'number', min: 0 },
      description: 'Number of goals the opponent scored',
    },
    pointsagainst: {
      control: { type: 'number', min: 0 },
      description: 'Number of points the opponent scored',
    },
  },
};

const Template = ({ goals, points, layout, scale, goalsagainst, pointsagainst }) => {
  const el = document.createElement('gaelic-score');
  el.setAttribute('goals', goals.toString());
  el.setAttribute('points', points.toString());
  if (layout) el.setAttribute('layout', layout);
  if (scale) el.setAttribute('scale', scale.toString());
  if (goalsagainst != null) el.setAttribute('goalsagainst', goalsagainst.toString());
  if (pointsagainst != null) el.setAttribute('pointsagainst', pointsagainst.toString());
  return el;
};

export const Default = Template.bind({});
Default.args = {
  goals: 2,
  points: 4,
  layout: 'default',
};
Default.storyName = 'Default Layout';

export const RightToLeft = Template.bind({});
RightToLeft.args = {
  goals: 1,
  points: 7,
  layout: 'r2l',
};
RightToLeft.storyName = 'Right to Left Layout';
export const OverLayout = Template.bind({});
OverLayout.args = {
  goals: 3,
  points: 5,
  layout: 'over',
};
OverLayout.storyName = 'Over Layout';
export const Scaled = Template.bind({});
Scaled.args = {
  goals: 1,
  points: 2,
  layout: 'over',
  scale: 2,
};
Scaled.storyName = 'Scaled Over Layout';
export const ComparePositive = Template.bind({});
ComparePositive.args = {
  goals: 3,
  points: 4,
  goalsagainst: 2,
  pointsagainst: 3,
  layout: 'compare',
};
ComparePositive.storyName = 'Compare – Winning';

export const CompareNegative = Template.bind({});
CompareNegative.args = {
  goals: 1,
  points: 2,
  goalsagainst: 3,
  pointsagainst: 6,
  layout: 'compare',
};
CompareNegative.storyName = 'Compare – Losing';

export const CompareDraw = Template.bind({});
CompareDraw.args = {
  goals: 2,
  points: 3,
  goalsagainst: 1,
  pointsagainst: 6,
  layout: 'compare',
};
CompareDraw.storyName = 'Compare – Draw';

export const CompareRTL = Template.bind({});
CompareRTL.args = {
  goals: 4,
  points: 1,
  goalsagainst: 3,
  pointsagainst: 5,
  layout: 'compare-rtl',
};
CompareRTL.storyName = 'Compare RTL';

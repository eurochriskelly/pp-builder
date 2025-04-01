// src/ui/public/scripts/webcomponents/match-row.stories.js
import './match-row.js';

export default {
  title: 'Components/MatchRow',
  component: 'match-row',
};

export const Upcoming = () => `
  <tr>
    <match-row
      id="12345"
      group="A"
      category="Mens"
      stage="group"
      pitch="Pitch 1"
      time="2025-03-31T10:00"
      team1="Team A"
      team2="Team B"
      umpire="Umpire 1"
      is-upcoming="true"
      tournament-id="1"
      index="0"
    ></match-row>
  </tr>
`;

export const Finished = () => `
  <tr>
    <match-row
      id="12346"
      group="A"
      category="Mens"
      stage="group"
      pitch="Pitch 1"
      time="2025-03-31T09:00"
      team1="Team A"
      team2="Team B"
      umpire="Umpire 1"
      is-upcoming="false"
      tournament-id="1"
      index="0"
      team1-score="2"
      team2-score="1"
    ></match-row>
  </tr>
`;

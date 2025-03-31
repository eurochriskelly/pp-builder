// src/ui/public/scripts/webcomponents/match-row.stories.js
import './match-row.js';

export default {
  title: 'Components/MatchRow',
  component: 'match-row',
};

export const Upcoming = () => {
  const el = document.createElement('match-row');
  el.setAttribute('id', '12345');
  el.setAttribute('group', 'A');
  el.setAttribute('category', 'Mens');
  el.setAttribute('stage', 'group');
  el.setAttribute('pitch', 'Pitch 1');
  el.setAttribute('time', '2025-03-31T10:00');
  el.setAttribute('team1', 'Team A');
  el.setAttribute('team2', 'Team B');
  el.setAttribute('umpire', 'Umpire 1');
  el.setAttribute('is-upcoming', 'true');
  el.setAttribute('tournament-id', '1');
  el.setAttribute('index', '0');
  return el;
};

export const Finished = () => {
  const el = document.createElement('match-row');
  el.setAttribute('id', '12346');
  el.setAttribute('group', 'A');
  el.setAttribute('category', 'Mens');
  el.setAttribute('stage', 'group');
  el.setAttribute('pitch', 'Pitch 1');
  el.setAttribute('time', '2025-03-31T09:00');
  el.setAttribute('team1', 'Team A');
  el.setAttribute('team2', 'Team B');
  el.setAttribute('umpire', 'Umpire 1');
  el.setAttribute('is-upcoming', 'false');
  el.setAttribute('tournament-id', '1');
  el.setAttribute('index', '0');
  return el;
};

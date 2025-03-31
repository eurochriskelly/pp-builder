// src/ui/public/scripts/webcomponents/tournament-row.stories.js
import './tournament-row.js';

export default {
  title: 'Components/TournamentRow',
  component: 'tournament-row',
};

export const LoggedIn = () => {
  const el = document.createElement('tournament-row');
  el.setAttribute('id', '1');
  el.setAttribute('title', 'Test Tournament');
  el.setAttribute('date', '2025-03-31');
  el.setAttribute('location', 'Test Location');
  el.setAttribute('event-uuid', 'abc123');
  el.setAttribute('is-logged-in', 'true');
  return el;
};

export const LoggedOut = () => {
  const el = document.createElement('tournament-row');
  el.setAttribute('id', '1');
  el.setAttribute('title', 'Test Tournament');
  el.setAttribute('date', '2025-03-31');
  el.setAttribute('location', 'Test Location');
  return el;
};

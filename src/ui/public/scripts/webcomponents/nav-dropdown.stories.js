// src/ui/public/scripts/webcomponents/nav-dropdown.stories.js
import './nav-dropdown.js';

export default {
  title: 'Components/NavDropdown', // Category and component name in Storybook UI
  component: 'nav-dropdown', // The custom element tag name
};

export const Default = () => {
  const el = document.createElement('nav-dropdown');
  el.setAttribute('title', 'Menu');
  el.setAttribute('items', JSON.stringify([
    { label: 'Item 1', href: '#item1' },
    { label: 'Item 2', href: '#item2' },
  ]));
  return el;
};

export const WithHTMX = () => {
  const el = document.createElement('nav-dropdown');
  el.setAttribute('title', 'Planning');
  el.setAttribute('items', JSON.stringify([
    { label: 'Execution', href: '/execution/1/recent', hxAttrs: 'hx-get="/execution/1/recent" hx-target="body" hx-swap="outerHTML"' },
  ]));
  return el;
};

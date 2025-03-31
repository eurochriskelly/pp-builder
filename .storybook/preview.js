import '../src/ui/public/styles/main-compiled.css'; // Relative to .storybook/
import '../src/ui/public/scripts/vendor/htmx.min.js';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

window.copyEventLink = (uuid) => {
  alert(`Copied link for UUID: ${uuid}`);
};

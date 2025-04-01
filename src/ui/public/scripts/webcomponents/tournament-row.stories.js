import './tournament-row.js';

export default {
  title: 'Components/TournamentRow',
  component: 'tournament-row',
  decorators: [
    (story) => `
      <script src="../src/ui/public/scripts/webcomponents/tournament-row.js"></script>
      ${story()}
    `,
  ],
};

export const LoggedIn = () => `
  <table style="width: 100%; border-collapse: collapse;">
    <tr style="background-color: #e5e7eb;">
      <th style="padding: 8px; text-align: left;">ID</th>
      <th style="padding: 8px; text-align: left;">Title</th>
      <th style="padding: 8px; text-align: left;">Date</th>
      <th style="padding: 8px; text-align: left;">Location</th>
      <th style="padding: 8px; text-align: left;">Planning</th>
      <th style="padding: 8px; text-align: left;">Execution</th>
      <th style="padding: 8px; text-align: left;">Share</th>
    </tr>
    <tr>
      <tournament-row
        id="1"
        title="Test Tournament"
        date="2025-03-31"
        location="Test Location"
        event-uuid="abc123"
        is-logged-in="true"
      ></tournament-row>
    </tr>
  </table>
`;

export const LoggedOut = () => `
  <table style="width: 100%; border-collapse: collapse;">
    <tr style="background-color: #e5e7eb;">
      <th style="padding: 8px; text-align: left;">ID</th>
      <th

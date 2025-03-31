// src/ui/public/scripts/webcomponents/match-row.js
class MatchRow extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['id', 'group', 'category', 'stage', 'pitch', 'time', 'team1', 'team2', 'umpire', 'is-upcoming', 'tournament-id', 'index'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const id = this.getAttribute('id')?.slice(-3) || 'N/A';
    const group = this.getAttribute('group') || 'N/A';
    const category = this.getAttribute('category') || 'N/A';
    const stage = this.getAttribute('stage') || 'N/A';
    const pitch = this.getAttribute('pitch') || 'N/A';
    const time = this.getAttribute('time') || 'N/A';
    const team1 = this.getAttribute('team1') || 'N/A';
    const team2 = this.getAttribute('team2') || 'N/A';
    const umpire = this.getAttribute('umpire') || 'N/A';
    const isUpcoming = this.getAttribute('is-upcoming') === 'true';
    const tournamentId = this.getAttribute('tournament-id');
    const index = parseInt(this.getAttribute('index') || '0', 10);

    const rowClass = `${isUpcoming ? 'upcoming-hidden-row' : 'finished-hidden-row'} ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'} ${index >= 10 ? 'hidden' : ''}`;

    this.shadowRoot.innerHTML = `
      <style>
        tr { transition: background-color 0.3s; }
        td { padding: 8px; }
        .category { background-color: #4b5563; color: white; padding: 2px 10px; border-radius: 9999px; font-weight: bold; text-transform: uppercase; }
        .play-btn { position: absolute; left: 4px; top: 50%; transform: translateY(-50%); background-color: #16a34a; color: white; border-radius: 50%; width: 32px; height: 32px; font-size: 16px; cursor: pointer; display: none; }
        tr:hover .play-btn { display: block; }
      </style>
      <tr class="${rowClass}">
        <td class="relative bg-gray-500 text-white font-bold">
          ${isUpcoming ? `<button class="play-btn" onclick="playNextNMatches(${index + 1}, '${tournamentId}')">▶</button>` : ''}${id}
        </td>
        <td>${group}</td>
        <td><span class="category">${category}</span></td>
        <td>${stage}</td>
        <td>${pitch}</td>
        <td>${time}</td>
        <td>${team1}</td>
        ${isUpcoming ? `
          <td>${team2}</td>
          <td>${umpire}</td>
        ` : `
          <td>N/A</td> <!-- Placeholder for finished match score -->
          <td>${team2}</td>
          <td>N/A</td> <!-- Placeholder for finished match score -->
        `}
      </tr>
    `;
  }
}

customElements.define('match-row', MatchRow);

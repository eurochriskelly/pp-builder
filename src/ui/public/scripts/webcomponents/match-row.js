class MatchRow extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['id', 'group', 'category', 'stage', 'pitch', 'time', 'team1', 'team2', 'umpire', 'is-upcoming', 'tournament-id', 'index', 'team1-score', 'team2-score'];
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
    const team1Score = this.getAttribute('team1-score') || 'N/A';
    const team2Score = this.getAttribute('team2-score') || 'N/A';

    const cellClass = `${isUpcoming ? 'upcoming-hidden-row' : 'finished-hidden-row'} ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'} ${index >= 10 ? 'hidden' : ''}`;

    this.shadowRoot.innerHTML = `
      <style>
        td { padding: 8px; }
        .category { background-color: #4b5563; color: white; padding: 2px 10px; border-radius: 9999px; font-weight: bold; text-transform: uppercase; }
        .id-cell { position: relative; background-color: #6b7280; color: white; font-weight: bold; }
        .play-btn { position: absolute; left: 4px; top: 50%; transform: translateY(-50%); background-color: #16a34a; color: white; border-radius: 50%; width: 32px; height: 32px; font-size: 16px; cursor: pointer; display: none; }
        .id-cell:hover .play-btn { display: block; }
      </style>
      <td class="id-cell ${cellClass}">
        ${isUpcoming ? `<button class="play-btn" onclick="playNextNMatches(${index + 1}, '${tournamentId}')">▶</button>` : ''}${id}
      </td>
      <td class="${cellClass}">${group}</td>
      <td class="${cellClass}"><span class="category">${category}</span></td>
      <td class="${cellClass}">${stage}</td>
      <td class="${cellClass}">${pitch}</td>
      <td class="${cellClass}">${time}</td>
      <td class="${cellClass}">${team1}</td>
      ${isUpcoming ? `
        <td class="${cellClass}">${team2}</td>
        <td class="${cellClass}">${umpire}</td>
      ` : `
        <td class="${cellClass}">${team1Score}</td>
        <td class="${cellClass}">${team2}</td>
        <td class="${cellClass}">${team2Score}</td>
      `}
    `;
  }
}

customElements.define('match-row', MatchRow);

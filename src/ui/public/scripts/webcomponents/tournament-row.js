// src/ui/public/scripts/webcomponents/tournament-row.js
class TournamentRow extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['id', 'title', 'date', 'location', 'event-uuid', 'is-logged-in'];
  }


  connectedCallback() {
    this.render();
    // Ensure external script is loaded or inline the logic
    if (!window.copyEventLink) {
      console.warn('copyEventLink not found; include tournamentSelectionScripts.js');
    }
  }

  render() {
    const id = this.getAttribute('id') || 'N/A';
    const title = this.getAttribute('title') || 'N/A';
    const date = this.getAttribute('date')?.substring(0, 10) || 'N/A';
    const location = this.getAttribute('location') || 'N/A';
    const eventUuid = this.getAttribute('event-uuid') || 'N/A';
    const isLoggedIn = this.getAttribute('is-logged-in') === 'true';

    this.shadowRoot.innerHTML = `
      <style>
        tr { border-bottom: 1px solid #ddd; }
        td { padding: 8px; }
        button { padding: 8px 16px; border-radius: 4px; color: white; cursor: pointer; }
        .planning-btn { background-color: #f97316; }
        .execution-btn { background-color: #16a34a; }
        .share-btn { background-color: #14b8a6; }
      </style>
      <tr>
        <td>${id}</td>
        <td>${title}</td>
        <td class="text-nowrap">${date}</td>
        <td>${location}</td>
        ${isLoggedIn ? `
          <td><button class="planning-btn" hx-get="/planning/${id}/matches" hx-target="body" hx-swap="outerHTML">Planning</button></td>
          <td><button class="execution-btn" hx-get="/execution/${id}/recent" hx-target="body" hx-swap="outerHTML">Execution</button></td>
          <td><button class="share-btn" onclick="window.copyEventLink ? window.copyEventLink('${eventUuid}') : alert('Copy function not available')">Copy Link</button></td>
        ` : ''}
      </tr>
    `;
  }

  attributeChangedCallback() {
    this.render();
  }
}

customElements.define('tournament-row', TournamentRow);

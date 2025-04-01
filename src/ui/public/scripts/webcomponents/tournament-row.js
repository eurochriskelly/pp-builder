class TournamentRow extends HTMLElement {
  static get observedAttributes() {
    return ['id', 'title', 'date', 'location', 'event-uuid', 'is-logged-in'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const id = this.getAttribute('id') || 'N/A';
    const title = this.getAttribute('title') || 'N/A';
    const date = this.getAttribute('date')?.substring(0, 10) || 'N/A';
    const location = this.getAttribute('location') || 'N/A';
    const eventUuid = this.getAttribute('event-uuid') || 'N/A';
    const isLoggedIn = this.getAttribute('is-logged-in') === 'true';

    this.innerHTML = `
      <td style="padding: 8px">${id}</td>
      <td style="padding: 8px">${title}</td>
      <td style="padding: 8px" class="text-nowrap">${date}</td>
      <td style="padding: 8px">${location}</td>
      ${isLoggedIn ? `
        <td style="padding: 8px"><button style="padding: 8px 16px; border-radius: 4px; color: white; background-color: #f97316" hx-get="/planning/${id}/matches" hx-target="body" hx-swap="outerHTML">Planning</button></td>
        <td style="padding: 8px"><button style="padding: 8px 16px; border-radius: 4px; color: white; background-color: #16a34a" hx-get="/execution/${id}/recent" hx-target="body" hx-swap="outerHTML">Execution</button></td>
        <td style="padding: 8px"><button style="padding: 8px 16px; border-radius: 4px; color: white; background-color: #14b8a6" onclick="window.copyEventLink ? window.copyEventLink('${eventUuid}') : alert('Copy function not available')">Copy Link</button></td>
      ` : ''}
    `;
  }
}

customElements.define('tournament-row', TournamentRow);

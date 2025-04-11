class KnockoutLevel extends HTMLElement {
  static get observedAttributes() {
    return ['match-id', 'stage', 'stage-level', 'category'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const matchId = this.getAttribute('match-id') || '';
    const stage = this.getAttribute('stage') || '';
    const stageLevel = this.getAttribute('stage-level') || '';
    const category = this.getAttribute('category') || '';

    // Extract last 3 digits of match ID
    const matchNum = matchId.slice(-3);

    // Split stage into round and level
    const [round, level] = stage.split('_');

    // Split stage-level and get the second part
    const [, levelNum] = stageLevel.split('.');

    // Determine display abbreviation
    let abbrev = '';
    if (level === 'final') {
      abbrev = 'FIN';
    } else if (level === 'semis') {
      abbrev = `SF${levelNum || ''}`;
    } else if (level === 'quarters') {
      abbrev = `QF${levelNum || ''}`;
    } else {
      // Handle positional matches (e.g., 3/4, 4/5, etc.)
      const mappings = {
        '3rd4th': '3/4',
        '4th5th': '4/5',
        '5th6th': '5/6',
        '6th7th': '6/7',
        '7th8th': '7/8',
      };
      abbrev = mappings[level] || level.toUpperCase();
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-family: sans-serif;
          text-align: center;
        }
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .match-num {
          font-size: 0.75em;
          color: #666;
        }
        .stage-abbrev {
          font-size: 1em;
          font-weight: bold;
        }
      </style>
      <div class="container">
        <div class="match-num">#${matchNum}</div>
        <div class="stage-abbrev">${abbrev}</div>
      </div>
    `;
  }
}

customElements.define('knockout-level', KnockoutLevel);

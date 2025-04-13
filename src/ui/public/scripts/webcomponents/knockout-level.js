class KnockoutLevel extends HTMLElement {
  static get observedAttributes() {
    return ['match-id', 'stage', 'stage-level', 'category', 'group', 'no-id']; // added no-id
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
    const showId = !this.hasAttribute('no-id'); // if no-id is present, hide fixture id
    const matchNum = showId ? matchId.slice(-3) : '';
    const stage = this.getAttribute('stage') || '';
    const stageLevel = this.getAttribute('stage-level') || '';
    const group = this.getAttribute('group') || '';

    // Extract last 3 digits of match ID (handled above if showId)

    let abbrev = '';
    if (stage === 'group') {
      // Handle group stage
      abbrev = `GP${group || '?'}`;
    } else {
      const [round, level] = stage.split('_');
      const [, levelNum] = stageLevel.split('.');

      // Determine display abbreviation for knockout stages
      if (level === 'final') {
        abbrev = 'FIN';
      } else if (level === 'finals') {
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
    }

    // Determine content for the stage display area
    let stageContent = abbrev; // Default to text abbreviation
    /*
    if (abbrev === 'FIN') {
      stageContent = `<cup-icon icon="${abbrev}"></cup-icon>`;
    }*/

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-family: sans-serif;
          text-align: center;
          min-width: 60px;
          background: #98bdc5;
          border-radius: 100rem;
        }
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 3em;
        }
        .match-num {
          font-size: 0.75em;
          color: white;
          line-height: 1;
        }
        .stage-abbrev {
          font-size: 1.1em;
          font-weight: bold;
          line-height: 1;
          margin-top: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 20px;
          color: black;
        }
        .stage-abbrev svg {
          display: block;
          fill: currentColor;
        }
      </style>
      <div class="container">
        ${showId ? `<div class="match-num">#${matchNum}</div>` : ''}
        <div class="stage-abbrev">${stageContent}</div>
      </div>
    `;
  }
}

customElements.define('knockout-level', KnockoutLevel);

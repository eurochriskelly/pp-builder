const ROW_WIDTHS = {
    score: 50,
    child: 38,
    knockout: 60,
    minTeam: 60,
    maxTeam: 420
};

class FixtureRow extends HTMLElement {
  static get observedAttributes() {
    return [
      'team1', 'team1-goals', 'team1-points',
      'team2', 'team2-goals', 'team2-points',
      'outcome', 'match-id', 'stage', 'stage-level', 'category', 'debug'
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const team1 = this.getAttribute('team1') || '';
    const team2 = this.getAttribute('team2') || '';
    const team1Goals = this.getAttribute('team1-goals') || '0';
    const team1Points = this.getAttribute('team1-points') || '0';
    const team2Goals = this.getAttribute('team2-goals') || '0';
    const team2Points = this.getAttribute('team2-points') || '0';
    const outcome = this.getAttribute('outcome') || '';
    const matchId = this.getAttribute('match-id') || '';
    const stage = this.getAttribute('stage') || '';
    const stageLevel = this.getAttribute('stage-level') || '';
    const category = this.getAttribute('category') || '';
    const debug = this.hasAttribute('debug');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          box-sizing: border-box;
        }
        .row {
          display: grid;
          grid-template-columns:
            1fr /* team1 */
            ${ROW_WIDTHS.score}px /* score1 */
            var(--fixture-row-child-width, ${ROW_WIDTHS.child}px) /* child1 */
            ${ROW_WIDTHS.knockout}px /* knockout-level */
            var(--fixture-row-child-width, ${ROW_WIDTHS.child}px) /* child2 */
            ${ROW_WIDTHS.score}px /* score2 */
            1fr /* team2 */;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          min-height: 48px;
          background: var(--fixture-row-bg, #fff);
          border-radius: 6px;
          box-shadow: var(--fixture-row-shadow, none);
          padding-top: 1.2rem;
          padding-bottom: 1.2rem;
        }
        .team1 {
          min-width: ${ROW_WIDTHS.minTeam}px;
          max-width: ${ROW_WIDTHS.maxTeam}px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: right;
          justify-self: stretch;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          ${debug ? 'background: #ffe0e0;' : ''}
        }
        .team2 {
          min-width: ${ROW_WIDTHS.minTeam}px;
          max-width: ${ROW_WIDTHS.maxTeam}px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: flex;
          align-items: center;
          justify-self: stretch;
          ${debug ? 'background: #e0e0ff;' : ''}
        }
        .score {
          justify-self: center;
          display: flex;
          text-align: center;
          align-items: center;
          justify-content: center;
          height: 100%;
          ${debug ? 'background: #e0ffe0;' : ''}
        }
        .center {
          justify-self: center;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          ${debug ? 'background: #fffbe0;' : ''}
        }
        ::slotted(*) {
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
        slot[name="child1"], slot[name="child2"] {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          ${debug ? 'background: #e0f7ff;' : ''}
        }
        .child-placeholder {
          width: var(--fixture-row-child-width, ${ROW_WIDTHS.child}px);
          height: 1.5em;
          display: block;
          background: transparent;
          margin-left: auto;
          margin-right: auto;
        }
      </style>
      <div class="row">
        <div class="team1">
          <slot name="team1-logo"></slot>
          <team-name name="${team1}" direction="r2l"></team-name>
        </div>
        <div class="score">
          <gaelic-score goals="${team1Goals}" points="${team1Points}" played="${outcome === 'played'}" layout="over"></gaelic-score>
        </div>
        <slot name="child1"><div class="child-placeholder"></div></slot>
        <div class="center">
          <knockout-level
            match-id="${matchId}"
            stage="${stage}"
            stage-level="${stageLevel}"
            category="${category}">
          </knockout-level>
        </div>
        <slot name="child2"><div class="child-placeholder"></div></slot>
        <div class="score">
          <gaelic-score goals="${team2Goals}" points="${team2Points}" played="${outcome === 'played'}" layout="over"></gaelic-score>
        </div>
        <div class="team2">
          <slot name="team2-logo"></slot>
          <team-name name="${team2}"></team-name>
        </div>
      </div>
    `;
  }
}

customElements.define('fixture-row', FixtureRow);
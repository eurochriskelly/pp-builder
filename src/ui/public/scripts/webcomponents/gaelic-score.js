class GaelicScore extends HTMLElement {
  static get observedAttributes() {
    return ['goals', 'points', 'layout', 'scale', 'goalsagainst', 'pointsagainst'];
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
    const goals = parseInt(this.getAttribute('goals') || '0', 10);
    const points = parseInt(this.getAttribute('points') || '0', 10);
    const layout = this.getAttribute('layout') || 'default';
    const scale = parseFloat(this.getAttribute('scale') || '1');

    const goalsAgainst = parseInt(this.getAttribute('goalsagainst') || '0', 10);
    const pointsAgainst = parseInt(this.getAttribute('pointsagainst') || '0', 10);

    console.log('goalsagainst', goalsAgainst)

    const total = goals * 3 + points;
    const totalAgainst = goalsAgainst * 3 + pointsAgainst;
    const diff = total - totalAgainst;

    const goalStr = goals.toString();
    const pointStr = points.toString().padStart(2, '0');
    const totalStr = total.toString().padStart(2, '0');
    const gray = '#bbb';

    let content = '';

    if (layout === 'r2l') {
      content = `
        <span class="bracket">(</span>${totalStr}<span class="bracket">)</span> ${goalStr} - ${pointStr}
      `;
    } else if (layout === 'over') {
      content = `
        <div class="top">${goalStr} - ${pointStr}</div>
        <div class="bottom"><span class="bracket">(</span>${totalStr}<span class="bracket">)</span></div>
      `;
    } else if (layout === 'compare' || layout === 'compare-rtl') {
        const scoreFor = goals * 3 + points;
        const scoreAgainst = goalsAgainst * 3 + pointsAgainst;
        const diff = scoreFor - scoreAgainst;
            console.log('diff', diff)

        let diffText = '';
        let diffClass = '';
        if (diff > 0) {
          diffText = `+${diff}`;
          diffClass = 'green';
        } else if (diff < 0) {
          diffText = `${diff}`;
          diffClass = 'red';
        } else {
          diffText = `=`;
          diffClass = 'blue';
        }

        const circle = `<span class="circle ${diffClass}">${diffText}</span>`;
        const topRow = `<div class="compare-top">${goalStr} - ${pointStr}</div>`;
        const bottomRow = `<div class="compare-bottom">${circle}</div>`;

        content = topRow + bottomRow;
    } else {
      content = `
        ${goalStr} - ${pointStr} <span class="bracket">(</span>${totalStr}<span class="bracket">)</span>
      `;
    }

    this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-block;
            font-family: sans-serif;
            transform: scale(${scale});
            transform-origin: top left;
          }

          .bracket {
            color: #bbb;
          }

          .top {
            text-align: center;
            font-size: 1rem;
          }

          .bottom {
            text-align: center;
            font-size: 2rem;
            line-height: 1;
          }

          .compare-top {
            text-align: center;
            font-size: 1rem;
            letter-spacing: 0em;
            margin-bottom: 0.1em;
          }

          .compare-bottom {
            text-align: center;
            font-size: 1.3rem;
            line-height: 1.2;
          }

          .circle {
            display: inline-block;
            color: white;
            border-radius: 14px;
            padding: 0.2em 0.25em;
            font-weight: normal;
            font-size: 1.1em;
            min-width: 2em;
            text-align: center;
          }

          .circle.green {
            background: #4caf50;
          }

          .circle.red {
            background: #f44336;
          }

          .circle.blue {
            background: #2196f3;
          }

          .slash {
            color: hotpink;
            padding: 0 0.2em;
            font-weight: bold;
          }
        </style>
      ${content}
    `;
  }
}

customElements.define('gaelic-score', GaelicScore);

class TeamName extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['name', 'showLogo', 'height', 'direction', 'maxchars', 'completion'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    renderNameParts(name) {
        if (!name) return '<span>?</span>';

        const maxChars = parseInt(this.getAttribute('maxchars')) || 0;
        let displayName = name;
        let isTruncated = false;
        
        if (maxChars > 0 && name.length > maxChars) {
            displayName = name.substring(0, maxChars);
            isTruncated = true;
        }

        const parts = displayName.split('/');
        if (parts.length === 1) {
            return `<span title="${isTruncated ? name : ''}">${displayName}${isTruncated ? '<span style="color:pink">→</span>' : ''}</span>`;
        }

        return parts.map((part, index) =>
            index === 0
                ? `<span title="${isTruncated ? name : ''}">${part}</span>`
                : `<span style="color:pink;margin:0.3rem">/</span><span title="${isTruncated ? name : ''}">${part}${isTruncated && index === parts.length - 1 ? '<span style="color:pink">→</span>' : ''}</span>`
        ).join('');
    }

    render() {
        const name = this.getAttribute('name') || '';
        const showLogo = this.getAttribute('showLogo') !== 'false';
        const height = this.getAttribute('height') || '30px';
        const direction = this.getAttribute('direction') || 'l2r';
        const completion = parseInt(this.getAttribute('completion') || '1');
        const isR2L = direction === 'r2l';

        const marginSide = `calc(${height} / 2)`;
        const logoSize = `calc(${height} * 1.4)`;
        const spacerWidth = `calc(${logoSize} * ${completion - 1})`;

        const containerStyle = `
            display: flex;
            flex-direction: ${isR2L ? 'row-reverse' : 'row'};
            align-items: center;
            justify-content: flex-start;
            text-align: ${isR2L ? 'right' : 'left'};
            white-space: nowrap;
            overflow: hidden;
            max-width: 100%;
        `;

        const logoMarginStyle = `margin-${isR2L ? 'left' : 'right'}: ${marginSide}; flex-shrink: 0;`;

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                .name-container {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: flex;
                    align-items: center;
                }
            </style>
            <span class="container" style="${containerStyle}">
                ${isR2L ? '' : `
                    <span class="spacer" style="width: ${spacerWidth}; flex-shrink: 0;"></span>
                `}
                ${showLogo ? `
                    <span class="logo-container" style="${logoMarginStyle}">
                        <logo-box size="${logoSize}" title="${name}"></logo-box>
                    </span>
                ` : ''}
                <span class="name-container">
                    ${this.renderNameParts(name)}
                </span>
                ${isR2L ? `
                    <span class="spacer" style="width: ${spacerWidth}; flex-shrink: 0;"></span>
                ` : ''}
            </span>
        `;

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('team-name', TeamName);

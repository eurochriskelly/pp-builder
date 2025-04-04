class TeamName extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['name', 'showLogo', 'height'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    renderNameParts(name) {
        if (!name) return '<span>?</span>';

        const parts = name.split('/');
        if (parts.length === 1) return `<span>${name}</span>`;

        return parts.map((part, index) =>
            index === 0
                ? `<span>${part}</span>`
                : `<span style="color:pink;margin:0.3rem">/</span><span>${part}</span>`
        ).join('');
    }

    render() {
        const name = this.getAttribute('name') || '';
        const showLogo = this.getAttribute('showLogo') !== 'false';
        const height = this.getAttribute('height') || '30px';
        const marginRight = `calc(${height} / 2)`;

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                .container {
                    display: flex;
                    align-items: center;
                    white-space: nowrap;
                    overflow: hidden;
                    max-width: 100%;
                }
                .logo-container {
                    margin-right: ${marginRight};
                    flex-shrink: 0;
                }
                .name-container {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: flex;
                    align-items: center;
                }
            </style>
            <span class="container">
                ${showLogo ? `
                    <span class="logo-container">
                        <logo-box width="${height}" title="${name}"></logo-box>
                    </span>
                ` : ''}
                <span class="name-container">
                    ${this.renderNameParts(name)}
                </span>
            </span>
        `;

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('team-name', TeamName);

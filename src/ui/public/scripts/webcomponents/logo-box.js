class LogoBox extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get colors() {
        return [
            { bg: '#FF6B6B', color: '#FFFFFF' },
            { bg: '#4ECDC4', color: '#FFFFFF' },
            { bg: '#45B7D1', color: '#FFFFFF' },
            { bg: '#96CEB4', color: '#FFFFFF' },
            { bg: '#FFEEAD', color: '#000000' },
            { bg: '#D4A5A5', color: '#FFFFFF' },
            { bg: '#9B59B6', color: '#FFFFFF' },
            { bg: '#3498DB', color: '#FFFFFF' },
            { bg: '#E74C3C', color: '#FFFFFF' },
            { bg: '#2ECC71', color: '#FFFFFF' },
            { bg: '#F1C40F', color: '#000000' },
            { bg: '#E67E22', color: '#FFFFFF' },
            { bg: '#1ABC9C', color: '#FFFFFF' },
            { bg: '#8E44AD', color: '#FFFFFF' },
            { bg: '#ECF0F1', color: '#000000' },
            { bg: '#34495E', color: '#FFFFFF' },
            { bg: '#D35400', color: '#FFFFFF' },
            { bg: '#16A085', color: '#FFFFFF' },
            { bg: '#7F8C8D', color: '#FFFFFF' },
            { bg: '#C0392B', color: '#FFFFFF' }
        ];
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['title', 'index', 'size', 'image'];
    }

    attributeChangedCallback() {
        this.render();
    }

    getInitials(title) {
        if (!title) return '?';
        
        // Extract only uppercase letters and numbers
        const validChars = title.match(/[A-Z0-9]/g);
        
        // If no valid characters, return single '?'
        if (!validChars || validChars.length === 0) return '?';
        
        // Return 1 to 3 characters
        return validChars.join('').slice(0, 3);
    }

    render() {
        const title = this.getAttribute('title') || '';
        const index = parseInt(this.getAttribute('index')) || 0;
        const size = this.getAttribute('size') || '30px';
        const image = this.getAttribute('image');
        const colorIndex = index % 20;
        const style = LogoBox.colors[colorIndex];

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                .logo-box {
                    width: ${size};
                    height: ${size};
                    background-color: ${image ? 'transparent' : style.bg};
                    color: ${style.color};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .text {
                    font-size: calc(${size} * 0.5);
                    font-weight: bold;
                    text-transform: uppercase;
                    line-height: 1;
                    font-family: 'Arial Narrow', 'Arial', sans-serif;
                    letter-spacing: -0.05em;
                }

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            </style>
            <div class="logo-box">
                ${image 
                    ? `<img src="${image}" alt="${this.getInitials(title)}">`
                    : `<span class="text">${this.getInitials(title)}</span>`
                }
            </div>
        `;

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('logo-box', LogoBox);

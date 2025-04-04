class LogoBox extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['title', 'size', 'image'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    // Hash function to generate a consistent number from a string
    static hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    // Calculate relative luminance from RGB
    static getLuminance(r, g, b) {
        const a = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    }

    // Convert HSL to RGB for luminance calculation
    static hslToRgb(h, s, l) {
        s /= 100;
        l /= 100;
        const k = n => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return [
            Math.round(f(0) * 255),
            Math.round(f(8) * 255),
            Math.round(f(4) * 255)
        ];
    }

    getColors() {
        const title = this.getAttribute('title') || '';
        const normalized = title.toUpperCase().replace(/[^A-Z0-9]/g, '');
        const hash = LogoBox.hashString(normalized);

        // Use hash for wider variety
        const hue = hash % 360; // 0-359°
        const saturation = 30 + (hash >> 8) % 70; // 30-99%, broader range
        const lightness = 20 + (hash >> 16) % 60; // 20-79%, broader range
        const gradientAngle = (hash >> 24) % 360; // 0-359° for gradient direction

        // Base color
        const baseColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        // Secondary color (shifted hue for gradient)
        const secondaryHue = (hue + 120) % 360; // Complementary-ish hue
        const secondaryColor = `hsl(${secondaryHue}, ${saturation}%, ${lightness}%)`;

        // Background with subtle gradient
        const bg = `linear-gradient(${gradientAngle}deg, ${baseColor}, ${secondaryColor})`;

        // Calculate luminance for contrast
        const [r, g, b] = LogoBox.hslToRgb(hue, saturation, lightness);
        const luminance = LogoBox.getLuminance(r, g, b);
        const color = luminance > 0.5 ? '#000000' : '#FFFFFF';

        return { bg, color };
    }

    getInitials(title) {
        if (!title) return '?';
        const validChars = title.match(/[A-Z0-9]/g);
        return validChars ? validChars.join('').slice(0, 3) : '?';
    }

    render() {
        const title = this.getAttribute('title') || '';
        const size = this.getAttribute('size') || '30px';
        const image = this.getAttribute('image');
        const style = this.getColors();

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                .logo-box {
                    width: ${size};
                    height: ${size};
                    background: ${image ? 'transparent' : style.bg};
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

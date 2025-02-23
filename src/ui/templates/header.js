module.exports = function generateHeader(title) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <link rel="stylesheet" href="/styles/main.css">
            <script src="https://unpkg.com/htmx.org@1.9.6"></script>
        </head>
        <body>
            <article>
                <h1>${title}</h1>
                <div class="links">
                    <div>
                        <a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Most Recent Changes</a>
                        <a href="/view2" hx-get="/view2" hx-target="body" hx-swap="outerHTML">Group Fixtures</a>
                        <a href="/view3" hx-get="/view3" hx-target="body" hx-swap="outerHTML">Group Standings</a>
                        <a href="/view7" hx-get="/view7" hx-target="body" hx-swap="outerHTML">Finals Results</a>
                    </div>
                    <div>
                        <a href="/view4" hx-get="/view4" hx-target="body" hx-swap="outerHTML">Knockout Fixtures</a>
                        <a href="/view5" hx-get="/view5" hx-target="body" hx-swap="outerHTML">Carded Players</a>
                        <a href="/view6" hx-get="/view6" hx-target="body" hx-swap="outerHTML">Matches by Pitch</a>
                    </div>
                </div>
                <hr/>
    `;
};

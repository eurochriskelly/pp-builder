module.exports = function generateHeader(title, tournamentId = null, area = null) {
    const basePath = tournamentId ? (area === 'planning' ? `/planning/${tournamentId}` : `/execution/${tournamentId}`) : '';
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
                <nav class="links">
                    <div>
                        <a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Tournament Selection</a>
                    </div>
                    ${tournamentId ? `
                    <div>
                        <a href="/planning/${tournamentId}" hx-get="/planning/${tournamentId}" hx-target="body" hx-swap="outerHTML"${area === 'planning' ? ' class="active"' : ''}>Planning</a>
                        <a href="/execution/${tournamentId}/recent" hx-get="/execution/${tournamentId}/recent" hx-target="body" hx-swap="outerHTML"${area === 'execution' ? ' class="active"' : ''}>Execution</a>
                    </div>
                    ${area === 'execution' ? `
                    <div>
                        <a href="${basePath}/recent" hx-get="${basePath}/recent" hx-target="body" hx-swap="outerHTML">Most Recent Changes</a>
                        <a href="${basePath}/view2" hx-get="${basePath}/view2" hx-target="body" hx-swap="outerHTML">Group Fixtures</a>
                        <a href="${basePath}/view3" hx-get="${basePath}/view3" hx-target="body" hx-swap="outerHTML">Group Standings</a>
                        <a href="${basePath}/view7" hx-get="${basePath}/view7" hx-target="body" hx-swap="outerHTML">Finals Results</a>
                    </div>
                    <div>
                        <a href="${basePath}/view4" hx-get="${basePath}/view4" hx-target="body" hx-swap="outerHTML">Knockout Fixtures</a>
                        <a href="${basePath}/view5" hx-get="${basePath}/view5" hx-target="body" hx-swap="outerHTML">Carded Players</a>
                        <a href="${basePath}/view6" hx-get="${basePath}/view6" hx-target="body" hx-swap="outerHTML">Matches by Pitch</a>
                    </div>
                    ` : area === 'planning' ? `
                    <div>
                        <p>Planning features coming soon...</p>
                    </div>
                    ` : ''}
                    ` : ''}
                </nav>
                <hr/>
    `;
};

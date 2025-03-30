const chevron = '❯' 

module.exports = function generateHeader(
  title,
  tournamentId = null, 
  area = null,
  currentView = 'matches',
  isLoggedIn = false,
  navigation = true
) {
    console.log('currentView', currentView);
    const basePath = tournamentId ? (area === 'planning' ? `/planning/${tournamentId}` : `/execution/${tournamentId}`) : '';
    const viewTitles = {
      'execution': {
        'recent': 'Most Recent Changes',
        'view2': 'Group Games',
        'view3': 'Group Tables', 
        'view4': 'Knockout Games',
        'view5': 'Carded Players',
        'view6': 'Matches by Pitch',
        'view7': 'Finals'
      },
      'planning': {
        'matches': 'Simulate tournament',
        'edit-tournament': 'Edit tournament',
      }
    };

    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <link rel="stylesheet" href="/styles/main-compiled.css">
            <script src="https://unpkg.com/htmx.org@1.9.6"></script>
    `;

    if (navigation) html += `<script src="/scripts/navigation.js"></script>`;

    html += `
        </head>
        <body>
            <article class="execution">
    `;

    if (navigation) {
        html += `
            <nav class="navbar">
                <div class="breadcrumbs">
                    <a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Home</a>
                    ${tournamentId ? `
                        <div class="dropdown">
                            <a href="#" onclick="toggleDropdown(event)"${area ? ' class="active"' : ''}>${area === 'planning' ? 'Planning' : 'Execution'}</a>
                            <div class="dropdown-content">
                                 <a href="${area === 'planning' ? '/execution/' + tournamentId + '/recent' : '/planning/' + tournamentId}"
                                    hx-get="${area === 'planning' ? '/execution/' + tournamentId + '/recent' : '/planning/' + tournamentId}"
                                    hx-target="body" hx-swap="outerHTML">${area === 'planning' ? 'Execution' : 'Planning'}</a>
                                 
                            </div>
                        </div>
i<!-- Views breadcrumbs -->
                        ${area === 'execution' && currentView 
                          ? `
                            <span class="separator">${chevron}</span>
                            <div class="dropdown">
                                <a href="#" onclick="toggleDropdown(event)" class="active">${viewTitles.execution[currentView]}</a>
                                <div class="dropdown-content">
                                    ${Object.entries(viewTitles.execution).map(([key, value]) => `
                                        ${key !== currentView ? `<a href="${basePath}/${key}" hx-get="${basePath}/${key}" hx-target="body" hx-swap="outerHTML">${value}</a>` : ''}
                                    `).join('')}
                                </div>
                            </div>
                          ` : '' }
                        ${area === 'planning' && currentView ? `
                            <span class="separator">${chevron}</span>
                            <div class="dropdown">
                                <a href="#" onclick="toggleDropdown(event)" class="active">${viewTitles.planning[currentView]}</a>
                                <div class="dropdown-content">
                                    ${Object.entries(viewTitles.planning).map(([key, value]) => `
                                        ${key !== currentView ? `<a href="${basePath}/${key}" hx-get="${basePath}/${key}" hx-target="body" hx-swap="outerHTML">${value}</a>` : ''}
                                    `).join('')}
                                </div>
                            </div>
                           ` : ''}
                    ` : ''}
                </div>
                <div class="login-dropdown">
                    ${isLoggedIn ? `
                        <a href="/logout" hx-get="/logout" hx-target="body" hx-swap="outerHTML">Log Out</a>
                    ` : `
                        <a href="#" onclick="toggleDropdown(event)">Log In</a>
                        <div class="login-dropdown-content">
                            <form class="login-form" hx-post="/login" hx-target="body" hx-swap="outerHTML" hx-headers='{"Content-Type": "application/x-www-form-urlencoded"}'>
                                <input type="email" name="email" placeholder="Email" required>
                                <input type="password" name="password" placeholder="Password" required>
                                <button type="submit">Log In</button>
                            </form>
                            <a href="/request-access" hx-get="/request-access" hx-target="body" hx-swap="outerHTML">Request Access</a>
                        </div>
                    `}
                </div>
            </nav>
            <hr/>
        `;
    } 
    // Removed the else block that generated the H1 when navigation=false
    // The H1 is now part of the #content div managed by events.js routes

    return html;
};

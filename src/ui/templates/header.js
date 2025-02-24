module.exports = function generateHeader(title, tournamentId = null, area = null, currentView = null) {
    const basePath = tournamentId ? (area === 'planning' ? `/planning/${tournamentId}` : `/execution/${tournamentId}`) : '';
    const viewTitles = {
        'recent': 'Most Recent Changes',
        'view2': 'Group Fixtures',
        'view3': 'Group Standings',
        'view4': 'Knockout Fixtures',
        'view5': 'Carded Players',
        'view6': 'Matches by Pitch',
        'view7': 'Finals Results'
    };

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <link rel="stylesheet" href="/styles/main.css">
            <script src="https://unpkg.com/htmx.org@1.9.6"></script>
            <script>
                function toggleDropdown(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    const dropdown = event.target.closest('.dropdown, .login-dropdown');
                    const isActive = dropdown.classList.contains('active');
                    document.querySelectorAll('.dropdown, .login-dropdown').forEach(d => d.classList.remove('active'));
                    if (!isActive) dropdown.classList.add('active');
                }
                document.addEventListener('click', function(event) {
                    const dropdowns = document.querySelectorAll('.dropdown, .login-dropdown');
                    dropdowns.forEach(dropdown => {
                        if (!dropdown.contains(event.target)) {
                            dropdown.classList.remove('active');
                        }
                    });
                });
            </script>
        </head>
        <body>
            <article>
                <nav class="navbar">
                    <div class="breadcrumbs">
                        <a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Home</a>
                        ${tournamentId ? `
                            <span class="separator">>></span>
                            <div class="dropdown">
                                <a href="#" onclick="toggleDropdown(event)"${area ? ' class="active"' : ''}>${area === 'planning' ? 'Planning' : 'Execution'}</a>
                                <div class="dropdown-content">
                                    <a href="${area === 'planning' ? '/execution/' + tournamentId + '/recent' : '/planning/' + tournamentId}" hx-get="${area === 'planning' ? '/execution/' + tournamentId + '/recent' : '/planning/' + tournamentId}" hx-target="body" hx-swap="outerHTML">${area === 'planning' ? 'Execution' : 'Planning'}</a>
                                </div>
                            </div>
                            ${area === 'execution' && currentView ? `
                                <span class="separator">>></span>
                                <div class="dropdown">
                                    <a href="#" onclick="toggleDropdown(event)" class="active">${viewTitles[currentView]}</a>
                                    <div class="dropdown-content">
                                        ${Object.entries(viewTitles).map(([key, value]) => `
                                            ${key !== currentView ? `<a href="${basePath}/${key}" hx-get="${basePath}/${key}" hx-target="body" hx-swap="outerHTML">${value}</a>` : ''}
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        ` : ''}
                    </div>

                  <div class="login-dropdown">
                      <a href="#" onclick="toggleDropdown(event)">Log In</a>
                      <div class="login-dropdown-content">
                          <form class="login-form" hx-post="/login" hx-target="body" hx-swap="outerHTML" hx-headers='{"Content-Type": "application/x-www-form-urlencoded"}'>
                              <input type="email" name="email" placeholder="Email" required>
                              <input type="password" name="password" placeholder="Password" required>
                              <button type="submit">Log In</button>
                          </form>
                          <a href="/request-access" hx-get="/request-access" hx-target="body" hx-swap="outerHTML">Request Access</a>
                      </div>
                  </div>
                </nav>
                <hr/>
    `;
};

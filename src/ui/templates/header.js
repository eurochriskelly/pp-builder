// src/ui/templates/header.js
module.exports = function generateHeader(title, tournamentId = null, area = null, currentView = 'matches', isLoggedIn = false, navigation = true) {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <link rel="stylesheet" href="/styles/main-compiled.css">
      <script src="https://unpkg.com/htmx.org@1.9.6"></script>
      <script src="/scripts/webcomponents/logo-box.js" defer></script>
      <script src="/scripts/webcomponents/gaelic-score.js" defer></script>
      <script src="/scripts/webcomponents/team-name.js" defer></script>
      <script src="/scripts/webcomponents/nav-dropdown.js" defer></script>
      <script src="/scripts/webcomponents/tournament-row.js" defer></script>
      <script src="/scripts/webcomponents/match-row.js" defer></script>
    </head>
    <body>
      <article class="execution">
  `;

  if (navigation) {
    const basePath = tournamentId ? (area === 'planning' ? `/planning/${tournamentId}` : `/execution/${tournamentId}`) : '';
    const areaItems = [
      { label: area === 'planning' ? 'Execution' : 'Planning', href: `${area === 'planning' ? '/execution/' + tournamentId + '/recent' : '/planning/' + tournamentId}`, hxAttrs: `hx-get="${area === 'planning' ? '/execution/' + tournamentId + '/recent' : '/planning/' + tournamentId}" hx-target="body" hx-swap="outerHTML"` }
    ];
    const loginItems = isLoggedIn
      ? [{ label: 'Log Out', href: '/logout', hxAttrs: 'hx-get="/logout" hx-target="body" hx-swap="outerHTML"' }]
      : [
          { label: 'Log In', href: '#', hxAttrs: 'hx-post="/login" hx-target="body" hx-swap="outerHTML"' }, // Simplified; add form logic in component if needed
          { label: 'Request Access', href: '/request-access', hxAttrs: 'hx-get="/request-access" hx-target="body" hx-swap="outerHTML"' }
        ];

    html += `
      <nav class="navbar">
        <div class="breadcrumbs">
          <a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Home</a>
          ${tournamentId ? `
            <nav-dropdown title="${area === 'planning' ? 'Planning' : 'Execution'}" items='${JSON.stringify(areaItems)}'></nav-dropdown>
          ` : ''}
        </div>
        <nav-dropdown title="${isLoggedIn ? 'Log Out' : 'Log In'}" items='${JSON.stringify(loginItems)}'></nav-dropdown>
      </nav>
      <hr/>
    `;
  }

  return html;
};




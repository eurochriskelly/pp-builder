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
      <script src="/scripts/webcomponents/knockout-level.js" defer></script>
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
          // Changed hx-post to hx-get to fetch the login form first
          { label: 'Log In', href: '/login', hxAttrs: 'hx-get="/login" hx-target="body" hx-swap="outerHTML"' },
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
        ${isLoggedIn ? `
          <a href="/logout" hx-get="/logout" hx-target="body" hx-swap="outerHTML" class="navbar-link px-3 py-2 rounded-md text-sm font-medium text-white hover:text-gray-300 hover:bg-gray-700">Log Out</a>
        ` : `
          <nav-dropdown title="Account" items='${JSON.stringify(loginItems)}'></nav-dropdown> 
        `}
      </nav>
      <hr/>
    `;
  }

  return html;
};




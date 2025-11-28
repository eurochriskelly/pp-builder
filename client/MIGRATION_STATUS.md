# React/Vite Migration - Current Status

## What's Working
✅ React app serves the tournament list at `/`
✅ Authentication (login/logout) works with fallback
✅ Event, Planning, Execution links are present

## What's Partially Working
⚠️ Event/Planning/Execution pages load but may have issues with static assets

## The Hybrid Architecture

The app now uses a **hybrid approach**:

1. **React (Vite)** handles:
   - `/` - Tournament list
   - `/login` - Login page
   - Client-side routing for these pages

2. **Express Backend** handles:
   - `/event/:uuid` - Event pages (server-rendered with HTMX)
   - `/planning/:id` - Planning pages
   - `/execution/:id/*` - Execution pages
   - `/api/*` - JSON API endpoints
   - `/scripts/*` - JavaScript files
   - `/styles/*` - CSS files

3. **Vite Dev Server** proxies requests to Express for:
   - All the Express routes listed above
   - Static assets (scripts, styles)

## How to Run

**Terminal 1 - Backend:**
```bash
npm run pp -- serve
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

**IMPORTANT:** After changing `vite.config.ts`, you MUST restart the Vite dev server (Terminal 2).

## Current Issue & Solution

The event page was showing 404 errors for scripts because Vite wasn't proxying `/scripts/*` and `/styles/*` requests.

**Solution:** I've added proxy rules for `/scripts` and `/styles` in `vite.config.ts`.

**Next Step:** Restart the Vite dev server:
1. Stop the dev server (Ctrl+C in Terminal 2)
2. Run `npm run dev` again
3. Try clicking an Event link again

## Future Considerations

This hybrid approach works for now, but you have a few options going forward:

### Option 1: Keep the Hybrid (Current)
- Pros: Minimal refactoring, uses existing server-rendered pages
- Cons: Complex architecture, two different rendering approaches

### Option 2: Full React Migration
- Migrate Event, Planning, and Execution pages to React components
- Replace HTMX with React state management
- Pros: Consistent architecture, better for long-term maintenance
- Cons: Significant refactoring effort

### Option 3: Full Server-Side
- Remove React entirely, keep the original HTML/HTMX approach
- Pros: Simpler, no build step for frontend
- Cons: Less modern, harder to build complex UIs

## Recommendation

For now, **keep the hybrid approach** and see if it meets your needs. If you find yourself wanting to add more features or improve the UI, consider gradually migrating pages to React one at a time.

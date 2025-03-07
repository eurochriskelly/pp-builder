# CONTRIB.md

## Overview
This repository focuses on a GUI-driven application for tournament management, with CLI tools as secondary features. Contributions should prioritize maintainability, small file sizes, and compatibility with LLMs for code generation and review.

## Architecture
- **Main Focus**: GUI (`src/ui/`).
  - **Views**: Located in `src/ui/templates/views/`. Simple views are single files (e.g., `createTournament.js`). Complex views are folders with `index.js` and `partials/` (e.g., `templates/views/execution/recent/index.js` and `partials/utils.js`).
  - **Public Resources**: Static assets in `src/ui/public/` (e.g., `scripts/`, `styles/`).
  - **Backend API**: All frontend requests route through `src/ui/api.js` to the backend.
  - **HTMX**: Used for dynamic partial updates in the GUI.
- **CLI**: Secondary, located in `bin/` (e.g., `gcp.ts`), with supporting logic in `src/` (e.g., `src/import/`, `src/simulation/`).
- **Shared Logic**: Common code should move to a library (e.g., `src/utils.js`) if reused across modules.

## Contribution Guidelines
1. **File Size**: Keep files small. Split large files into logical modules to reduce context size for LLMs.
2. **Refactoring**: 
   - Refactor repeated code into DRY functions on the fly.
   - Compress context by consolidating logic into reusable utilities.
3. **Testability**: Write logic in functions to enable future unit tests, even if not currently maintained.
4. **Backend Integration**: Use existing complex logic (e.g., `src/import/` for fixtures) via the API.
5. **Testing with LLMs**: Test code before committing when working with LLMs.
6. **TODOs**:
   - Transition to TypeScript.
   - Organize backend libs into subfolders.
   - Add unit tests to prevent regressions.

## Development Setup
- Install: `make deps`
- Build: `npm run build`
- Run CLI: `make install` then `gcp`
- Serve GUI: `gcp serve`


# React/Vite Migration - Authentication Setup

## What's Been Done

### Backend Changes
1. **API Routes** (`src/ui/server/routes/api.js`):
   - Added `/api/auth/me` - Check current user session
   - Added `/api/auth/login` - Login endpoint (POST)
   - Added `/api/auth/logout` - Logout endpoint (POST)
   - Added `/api/tournaments` - Get all tournaments (GET)
   - Added `/api/tournaments` - Create tournament (POST, requires auth)

### Frontend Changes
1. **Auth Context** (`client/src/contexts/AuthContext.tsx`):
   - Manages authentication state across the app
   - Provides `user`, `loading`, `login()`, and `logout()` functions
   - Automatically checks auth status on app load

2. **Login Component** (`client/src/components/Login.tsx`):
   - Email/password login form
   - Error handling
   - Redirects to home after successful login

3. **Layout Component** (`client/src/components/Layout.tsx`):
   - Shows "Welcome, [name]" and "Logout" button when logged in
   - Shows "Login" link when not logged in

4. **Tournament List** (`client/src/components/TournamentList.tsx`):
   - Conditionally shows Planning/Execution columns only when logged in
   - Fetches tournaments from `/api/tournaments`

## How to Use

### Start the Application

**Terminal 1 - Backend:**
```bash
npm run pp -- serve
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### Access the App
- Frontend: http://localhost:5173
- Backend: http://localhost:5421

### Login
1. Click "Login" in the top-right corner
2. Enter your credentials
3. After login, you'll see Planning/Execution buttons for each tournament

## Next Steps
- Port Planning view to React
- Port Execution view to React
- Add Create Tournament modal
- Add more routes as needed

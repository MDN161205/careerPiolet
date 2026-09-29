# Frontend Fix: Step-by-Step

## What Was Happening

The browser showed only the app title and backend status instead of the login or registration interface. `App.jsx` imported the `Login` and `Register` components, but its JSX never rendered either component. An import makes a component available; it does not display it automatically.

## Changes Made

1. **Mounted the auth forms in `apps/web/src/App.jsx`.** Added a `mode` state, then rendered `<Login />` or `<Register />` based on that state. The Sign in and Create account buttons switch between the forms.
2. **Kept the backend health check visible.** The page still requests `/api/health` and displays the response, so the frontend and API connection can be checked separately.
3. **Replaced the starter styles.** `apps/web/src/App.css` now styles the CareerPilot header, introduction, auth form, segmented switch, inputs, buttons, and mobile layout. `apps/web/src/index.css` now provides shared colors, typography, background, and browser resets.
4. **Cleaned up the login component.** The default component function is now named `Login`, its heading is a second-level heading within the page, and it no longer adds a nested `<main>` landmark.
5. **Fixed lint errors in both forms.** Removed unused error-variable names from their `catch` blocks. The connection-failure messages remain unchanged.

## Filename Casing Note

TypeScript error TS1149 is separate from the missing-frontend issue. It means the same source file was included using two different casings, such as `Login.jsx` and `login.jsx`. Make the actual filename and every import use the same exact spelling. In `App.jsx`, the current login import is `./pages/login`. If you change the filename casing in Windows Explorer, rename it to a temporary name first, then to the desired final name; a case-only rename may otherwise be ignored. If VS Code continues showing the old casing, close the stale tab and run **TypeScript: Restart TS Server** from the Command Palette.

A `U` decoration beside a file is Git's **Untracked** status, not a JavaScript or React error. It means Git has not started tracking that file. Add only the file you intend to track, for example: `git add apps/web/src/pages/login.jsx` (adjust the casing to match the actual filename).

## Run and Verify

1. Start the API in one terminal if it is not already running: `cd apps/api` then `npm run dev`.
2. Start the web app in another terminal: `cd apps/web` then `npm run dev`.
3. Open the local URL Vite prints. Ports `5173` and `5174` were occupied during this check, so Vite served the app at `http://localhost:5175/`.
4. Confirm the Sign in form appears, then select **Create account** and confirm the registration form appears.
5. From `apps/web`, run `npm run build` and `npm run lint` to validate the frontend.

Both build and lint passed after the changes. The live page was also checked: both forms rendered, and the API health message reported that the API was running.

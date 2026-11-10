# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Art Gallery App (Recap Project 6): a React 19 + TypeScript + Vite app with React Router and SWR. Pages: **Spotlight**, **Gallery**, **Favorites**, **Details**. Users like/unlike art pieces (shown on Favorites) and comment on them; persisting favorites/comments in the browser is a bonus. The app is built story-by-story from the issue templates in `.github/templates/` (issues 4–13; 1–3 are setup). Wireframes: `docs/wireframes.excalidraw.png`.

Data comes from `https://example-apis.vercel.app/api/art` (array of pieces with `slug`, `artist`, `name`, `imageSource`, `year`, `genre`, `colors` (hex array), `dimensions {height, width, type}`). Fetch with SWR.

## Commands

- `npm run dev` — Vite dev server on port 3000 (opens browser)
- `npm run build` — production build
- `npm run serve` — preview the build
- `npm run check` — type-check (`tsc --noEmit`)
- `npm run test` — Vitest in watch mode
- `npm run test:run` — single Vitest run (used by CI)
- `npm run coverage` — Vitest run with v8 coverage (text + `coverage/lcov.info`)
- `npm run lint` — ESLint (flat config in `eslint.config.js`: `@eslint/js`, `typescript-eslint`, `eslint-plugin-sonarjs` recommended; `.github/scripts` is ignored)
- `npm run format` / `npm run format:check` — Prettier write / check
- Single test: `npx vitest run src/path/to/file.test.tsx` (add `-t "name"` to filter by test name)

## Architecture

- `src/index.tsx` mounts the app inside `StrictMode` and `BrowserRouter`; `src/App.tsx` is where routes/layout go.
- Tests: Vitest with jsdom, globals enabled (`test`, `expect`, `vi` need no imports), setup in `src/setupTests.ts`, Testing Library available.
- `vercel.json` rewrites all paths to `index.html` for client-side routing.
- Formatting follows `.prettierrc.json` (double quotes, semicolons, 2 spaces, es5 trailing commas, 80 cols).

## CI

`.github/workflows/ci.yml` runs `npm ci`, `npm run check`, `npm run lint`, `npm run test:run`, `npm run build` on Node 22.

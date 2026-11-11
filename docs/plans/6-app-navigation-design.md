# Plan for issue #6: App Navigation Design

**Status:** Issue #6 is already implemented by commit `2bd670d` (#29), together with the Spotlight page. It was also verified in the browser: the navigation shows on every page, Gallery navigates to `/art-pieces`, and an unknown URL shows "Page not found".

## 1. Summary

The app should let users switch between the Spotlight and Gallery pages through a navigation bar. The bar appears on every page, the current page's link is highlighted, and unknown URLs show "Page not found". `Navigation.tsx` uses `NavLink`, with `end` on the `/` link. `App.tsx` renders it once, below the routes.

## 2. Acceptance criteria to tests (all already exist)

| Criterion | Test | What it asserts |
|---|---|---|
| Link "Spotlight" displayed | `src/components/Navigation.test.tsx` > "shows the links Spotlight and Gallery" | A link named "Spotlight" with `href="/"` is present |
| Link "Gallery" displayed | Same test | A link named "Gallery" with `href="/art-pieces"` is present |
| Clicking "Spotlight" shows the Spotlight page | `Navigation.test.tsx` > "navigates between the pages" | Clicking "Spotlight" shows the Spotlight page |
| Clicking "Gallery" shows the Gallery page | Same test | Clicking "Gallery" shows the Gallery page |
| Current link highlighted | `Navigation.test.tsx` > "highlights only the link of the current page" | At `/art-pieces`, Gallery has the `active` class and Spotlight does not |
| Unknown URL shows "Page not found" | `src/App.test.tsx` > "shows the navigation and a message for unknown URLs" | At `/nowhere`, "Page not found" is shown |
| Navigation rendered once, on all pages (task) | Same `App.test.tsx` test | The navigation links are present on the not-found page |

## 3. Files that change

None. `Navigation.tsx`, `App.tsx`, `styles.css` (the `nav a.active` style) and their tests all exist.

## 4. Out of scope

- Favorites and Details links (issues 7-13).
- Navigation redesign, icons or a mobile menu.
- Any new routes.

## 5. Open questions (resolved)

- Branching: the branch is created from `main`, not from `feature/5-spotlight-page`.
- Highlighting is verified through the `active` class and visually in the browser. jsdom cannot verify real styles.

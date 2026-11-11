# Plan for issue #8: Mark Art Pieces as Favorites

**Depends on #7.** The favorite button must also appear on the details page, which exists only in PR #32 (issue #7). This plan is committed on a branch from `origin/main`, so it does not include #7. Implementation (`/tdd-feature`) should start after #7 is merged and this branch has been updated from `main`.

## 1. Summary

Users can mark art pieces as favorites with a heart button on the Gallery list, the Spotlight page and the Details page. The favorite status lives in state in `App` (the component that renders the `Routes`), connected to the fetched art pieces by `slug`, so all pages share it. The fetched art pieces are not changed.

## 2. Acceptance criteria to tests

| Criterion | Test | What it asserts |
|---|---|---|
| Button on each list entry | `src/components/ArtPieces.test.tsx` > "shows a favorite button for each art piece" | One button named "Favorite Piece A" and one named "Favorite Piece B" |
| Button on the details view | `src/components/ArtPieceDetails.test.tsx` > "shows a favorite button" | A button named "Favorite <piece name>" is present |
| Button on the spotlight view | `src/components/Spotlight.test.tsx` > "shows a favorite button" | A button named "Favorite <piece name>" is present |
| Click on a non-favorite saves it, with a visual indication | `src/components/FavoriteButton.test.tsx` > "calls onToggle when clicked" and `src/App.test.tsx` > "marks an art piece as favorite when its button is clicked" | The click calls the handler; in the app the button changes from `aria-pressed="false"` to `"true"` |
| Click on a favorite removes it, with a visual indication | `src/App.test.tsx` > "removes an art piece from the favorites on a second click" | The button changes back to `aria-pressed="false"` |
| Favorites are visually highlighted | `src/components/FavoriteButton.test.tsx` > "is pressed only for a favorite" and `src/App.test.tsx` > "keeps the favorite status when switching between pages" | `aria-pressed` is true only for a favorite (the existing CSS colors `[aria-pressed="true"]`); the status is still set after going from Gallery to Details |

## 3. Files that change

- `src/types.ts` (modified): add `ArtPieceInfo = { slug: string; isFavorite: boolean }`.
- `src/components/FavoriteButton.tsx` (new): heart button with `aria-pressed` and `aria-label="Favorite <name>"`; filled heart when favorite.
- `src/components/FavoriteButton.test.tsx` (new): tests for the component.
- `src/components/ArtPiecePreview.tsx` (modified): render the button next to, not inside, the details link (a button inside a link is invalid and would navigate when clicked).
- `src/components/ArtPiecePreview.test.tsx` (modified): new props; existing assertions stay.
- `src/components/ArtPieces.tsx` and `ArtPieces.test.tsx` (modified): pass favorite status and handler down; list test.
- `src/components/Spotlight.tsx` and `Spotlight.test.tsx` (modified): render the button; spotlight test.
- `src/components/ArtPieceDetails.tsx` and `ArtPieceDetails.test.tsx` (modified): render the button; details test.
- `src/App.tsx` (modified): hold the favorites state, a toggle function, and pass them to all three pages.
- `src/App.test.tsx` (modified): add, remove and cross-page tests.
- `src/styles.css` (modified only if needed): the file already has `.favorite-button` and `.art-piece` rules. If the layout needs a tweak after viewing it in the browser, only that.

Edits to existing tests are limited to new props and wrappers; no existing assertion changes.

## 4. Out of scope

- The Favorites page and its route (a later issue).
- Saving favorites in the browser (bonus per `CLAUDE.md`); state is lost on reload.
- Comments, colors and dimensions.
- Any change to the fetched data.

## 5. Decisions (open questions resolved)

- Icon: an inline SVG heart (the Lucide heart shape), not the `lucide-react` package, to avoid a new dependency. It can be swapped later.
- Accessibility: the label is fixed ("Favorite <name>") and the state is in `aria-pressed`, so screen readers say "pressed"/"not pressed". The existing CSS already styles `[aria-pressed="true"]`.
- "Visually highlighted": the button changes color and the heart fills. The art piece card itself is not highlighted.
- State shape: `ArtPieceInfo[]` in `App`, as the issue's hint suggests, looked up by `slug`.
- jsdom cannot check real colors, so the visual indication is tested through `aria-pressed`, and should be checked in the browser.

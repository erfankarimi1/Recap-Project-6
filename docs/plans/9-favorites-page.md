# Plan for issue #9: Favorites Page

**Depends on #8.** The page lists favorite art pieces, so it needs the favorite status in `App` and the favorite button from PR #33 (issue #8). This plan is committed on a branch from `origin/main`, so it does not include #8. Implementation (`/tdd-feature`) should start after #8 is merged and this branch has been updated from `main`.

## 1. Summary

Add a "Favorites" link to the navigation and a Favorites page on `/favorites` that lists only the favorite art pieces, in the same list format as the Gallery. Each entry shows image, title, artist and an active favorite button. No new component is needed: the page reuses `ArtPieces` with the pieces filtered by the existing `isFavorite` function in `App`.

## 2. Acceptance criteria to tests

| Criterion | Test | What it asserts |
|---|---|---|
| A navigation link labeled "Favorites" is displayed | `src/components/Navigation.test.tsx` > "shows a link to Favorites" | A link named "Favorites" with `href="/favorites"` is present |
| Clicking "Favorites" shows the Favorites page on `/favorites` | `src/components/Navigation.test.tsx` > "navigates to the favorites page" and `src/App.test.tsx` > "shows the favorites page on the route /favorites" | Clicking the link shows the `/favorites` route; in the app, `/favorites` renders the list (not "Page not found") |
| All favorite art pieces are displayed in a list | `src/App.test.tsx` > "shows only the favorite art pieces on /favorites" | After favoriting piece A in the Gallery and opening Favorites, piece A is listed and piece B is not; a second favorited piece appears too |
| Each piece shows image, title and artist | `src/App.test.tsx` > "shows image, title and artist of each favorite" | The favorite's `img` has the right `src` and `alt`, and its title and artist text are present |
| Each piece has an active favorite button | `src/App.test.tsx` > "shows an active favorite button on each favorite" | The button "Favorite <name>" is pressed; clicking it removes the piece from the Favorites list |

## 3. Files that change

- `src/components/Navigation.tsx` (modified): add the "Favorites" `NavLink` to `/favorites`.
- `src/components/Navigation.test.tsx` (modified): add `/favorites` to the test routes and add the two new tests. Existing tests and assertions stay as they are.
- `src/App.tsx` (modified): add the `/favorites` route rendering `ArtPieces` with only the favorite pieces.
- `src/App.test.tsx` (modified): add the new route and list tests.

No new files and no new components. `styles.css` is not changed.

## 4. Out of scope

- An empty-state message when there are no favorites (the list is simply empty; the issue does not ask for one).
- A favorites counter in the navigation (a separate idea).
- Saving favorites in the browser (a bonus issue); favorites are lost on reload.
- Comments, colors and any change to the Gallery, Spotlight or Details pages.

## 5. Decisions (open questions resolved)

- No new `Favorites` component: the issue's task says to reuse an existing component, so the route renders `ArtPieces` with `pieces.filter((piece) => isFavorite(piece.slug))`.
- The "function that checks whether an art piece is a favorite" from the hint is the `isFavorite` function that #8 adds to `App`.
- Order of the nav links: Spotlight, Gallery, Favorites.
- Removing a favorite on this page removes it from the list at once, because the list is derived from the same state.

# Plan for issue #7: Art Piece Details Page

## 1. Summary

Clicking an art piece in the Gallery opens `/art-pieces/:slug`. That page shows the piece's image, title, artist, year and genre, plus a back button to the list. An unknown slug shows "Art piece not found" instead of crashing. This needs a new `ArtPieceDetails` component, a dynamic route that reads the slug with `useParams`, and a link from each list item.

## 2. Acceptance criteria to tests

| Criterion | Test | What it asserts |
|---|---|---|
| Clicking a piece in the list goes to its details | `src/components/ArtPiecePreview.test.tsx` > "links to the details page of the art piece" | The preview has a link to `/art-pieces/wheat-field` |
| Route `/art-pieces/:slug` | `src/App.test.tsx` > "shows the details of an art piece on /art-pieces/:slug" | At `/art-pieces/b`, piece B's details are shown and piece A's are not |
| Image displayed | `src/components/ArtPieceDetails.test.tsx` > "shows image, title, artist, year and genre" | `img` has the right `src` and `alt` |
| Title displayed | Same test | The title text is present |
| Artist displayed | Same test | The artist text is present |
| Year displayed | Same test | The year text is present |
| Genre displayed | Same test | The genre text is present |
| Back button displayed | `ArtPieceDetails.test.tsx` > "shows a back button" | A back link is present |
| Back button goes to the list | `ArtPieceDetails.test.tsx` > "navigates back to the list" | Clicking it shows the list route |
| Unknown slug shows "Art piece not found" | `src/App.test.tsx` > "shows a message for an unknown art piece" | At `/art-pieces/nope`, "Art piece not found" is shown and nothing crashes |

## 3. Files that change

- `src/types.ts` (modified): add `year` and `genre` to `ArtPiece`.
- `src/components/ArtPieceDetails.tsx` (new): details view with image, title, artist, year, genre and back button.
- `src/components/ArtPieceDetails.test.tsx` (new): tests for the component.
- `src/components/ArtPiecePreview.tsx` (modified): link to the details page.
- `src/components/ArtPiecePreview.test.tsx` (modified): wrap in a router, add `year` and `genre` to the fixture, add the link test.
- `src/components/ArtPieces.test.tsx` (modified): wrap in a router, add `year` and `genre` to the fixtures.
- `src/components/Spotlight.test.tsx` and `src/utils.test.ts` (modified): add `year` and `genre` to the fixtures only, so `npm run check` passes.
- `src/App.tsx` (modified): add the `/art-pieces/:slug` route and the not-found case.
- `src/App.test.tsx` (modified): add `year` and `genre` to the fixtures, add the route and unknown-slug tests.

The edits to existing tests are limited to routers and fixture fields. No existing assertion changes.

## 4. Out of scope

- Colors, dimensions and the palette (a later issue).
- Favorites (the heart button) and comments.
- Persisting anything in the browser.
- Restyling the Gallery.

## 5. Decisions (open questions resolved)

- Edits to existing tests: allowed, limited to the router wrapper and the new fixture fields.
- Back button: a link to `/art-pieces`, not `navigate(-1)`, so it works when the URL is opened directly.
- Data: `pieces` is passed down from `App`; the piece is found by slug. No second fetch.
- The "Gallery" nav link stays highlighted on `/art-pieces/:slug` (default `NavLink` behavior).

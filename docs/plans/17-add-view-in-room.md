# Plan for story 17: Add View in Room to the Details Page (GitHub issue #43)

Story 17 is GitHub issue #43. The story number is used for the branch and file names, as for stories 14 to 16. The story does not depend on open work. PR #61 (story 16, the palette tooltip) also edits `src/styles.css`, but in the `.palette` rules; the room rules go in their own block next to `.details`, so a conflict is unlikely and would be small.

## 1. Summary

Each art piece gets a "View in room" link on its details page. It opens a new route `/art-pieces/:slug/room` that shows the art piece hanging on the wall of a simple room, drawn with CSS only, so users can imagine it at home. The image keeps the aspect ratio of the piece's `dimensions`, a "Back" link returns to the details page, and an unknown `slug` shows "Art piece not found". The API already returns `dimensions` for every piece, but the `ArtPiece` type does not have it yet.

## 2. Acceptance criteria to tests

| Criterion | Test | What it asserts |
|---|---|---|
| The details page has a link labeled "View in room" | `src/components/ArtPieceDetails.test.tsx` > "shows a link to view the art piece in a room" | A link named "View in room" has `href="/art-pieces/wheat-field/room"` |
| The link opens the room view on the route `/art-pieces/:slug/room` | `src/App.test.tsx` > "shows the room view on the route /art-pieces/:slug/room" | At `/art-pieces/b/room` the room view of piece B is shown and the details of piece B are not |
| | `App.test.tsx` > "opens the room view from the details page" | From `/art-pieces/a`, clicking "View in room" shows the room view of piece A |
| The room view shows the art piece's image on the wall, with the piece name as alt text | `src/components/RoomView.test.tsx` > "shows the image of the art piece" | An `img` named after the piece has the piece's `src`, and is inside the room view |
| The image keeps the aspect ratio of the art piece's `dimensions` | `RoomView.test.tsx` > "gives the image the width and height of the art piece" | The `img` has `width` and `height` attributes equal to `dimensions.width` and `dimensions.height`, so the browser keeps the ratio |
| The room view has a "Back" link to the details page | `RoomView.test.tsx` > "links back to the details page" | A link named "Back" has `href="/art-pieces/wheat-field"` |
| An unknown `slug` shows an "Art piece not found" message | `RoomView.test.tsx` > "shows a message for an unknown art piece" | For an unknown slug, "Art piece not found" is shown and no image is rendered |

## 3. Files that change

- `src/types.ts` (modified): add `dimensions: { height: number; width: number; type: string }` to `ArtPiece`, as the API returns it.
- `src/components/RoomView.tsx` (new): reads the `slug` with `useParams`, finds the piece, and renders the Back link, the wall with the framed image (with its `width` and `height` attributes) and the floor. Renders "Art piece not found" for an unknown slug.
- `src/components/RoomView.test.tsx` (new): the four tests above for the component.
- `src/components/ArtPieceDetails.tsx` (modified): add the "View in room" link.
- `src/components/ArtPieceDetails.test.tsx` (modified): add `dimensions` to the fixture and the new link test.
- `src/App.tsx` (modified): add the route `/art-pieces/:slug/room` that renders `RoomView`.
- `src/App.test.tsx` (modified): add `dimensions` to the fixtures and the two new route tests.
- `src/styles.css` (modified): rules for the room (wall, floor, framed picture) using color tokens only, so it works in light and dark mode. The existing CSS tests must keep passing.
- `src/utils.test.ts`, `src/components/ArtPiecePreview.test.tsx`, `src/components/ArtPieces.test.tsx`, `src/components/ArtworkInfo.test.tsx`, `src/components/Spotlight.test.tsx` (modified): add `dimensions` to the art piece fixtures only, so `npm run check` passes. No assertion changes.

Existing assertions stay as they are. No new dependency and no image file.

## 4. Out of scope

- Camera or augmented reality, and a real-world scale. The API gives `dimensions` in pixels, not centimeters, so the picture is only shown with the right aspect ratio, inside a maximum size.
- Choosing a room, furniture or other images, zooming, sharing, and transitions.
- A "View in room" link anywhere other than the details page.
- Changing the details page layout, or the "Back" link on the details page.

## 5. Decisions (open questions resolved)

- The aspect ratio is kept with the `width` and `height` attributes of the `img` plus CSS (`height: auto` and a maximum size), because jsdom cannot check the CSS `aspect-ratio` property but can check attributes. The ratios in the API range from 0.67 (wide) to 1.45 (tall), so the CSS must limit the height as well as the width.
- The room is drawn with CSS only: a wall, a floor strip and a framed picture. Its colors come from the tokens (`--color-surface` for the wall, `--color-border` for the floor, `--color-text-muted` for the frame), so no color is hard-coded and both modes work. The room is decoration, so the floor is hidden from screen readers.
- The room view has its own route, not a modal, so it can be linked and tested with the router.
- The room view's "Back" link goes to the details page of the same piece, not to the browser history.
- `dimensions` is added to the type as the API returns it, including `type` (for example "jpg"), although only `width` and `height` are used.
- jsdom cannot show how the room looks, so its layout (wall, floor, size limits for tall and wide pieces) is a visual check in a browser.

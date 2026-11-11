# Plan for story 17: Add View in Room to the Details Page (GitHub issue #43)

Story 17 is GitHub issue #43. The story number is used for the branch and file names, as for stories 14 to 16. PR #61 (story 16, the palette tooltip) also edits `src/styles.css`, but in the `.palette` rules; the room rules go in their own block next to `.details`, so a conflict is unlikely and would be small.

**Scope change after the first implementation.** The first version drew the room with CSS only (a wall, a floor strip and a framed picture), and its tests are written. The user then asked for a real room photo with the picture hanging on the wall, and for being able to move the picture with the cursor to design the room. Issue #43 was updated. The tests of the first version stay, except the CSS floor and wall drawing, which the photo replaces (see section 3).

## 1. Summary

Each art piece gets a "View in room" link on its details page. It opens `/art-pieces/:slug/room`, which shows a real photo of a room (an empty white wall above a grey sofa, a free Unsplash photo) with the art piece hanging on the wall. The picture starts in the middle of the wall and can be moved with the mouse, a finger or the arrow keys, but never off the wall. The image keeps the aspect ratio of the piece's `dimensions`, a "Back" link returns to the details page, and an unknown `slug` shows "Art piece not found". The position is not saved.

## 2. Acceptance criteria to tests

**Already built and tested (first version, unchanged)**

| Criterion | Test | What it asserts |
|---|---|---|
| The details page has a link labeled "View in room" | `src/components/ArtPieceDetails.test.tsx` > "shows a link to view the art piece in a room" | The link has `href="/art-pieces/wheat-field/room"` |
| The link opens the room view on the route `/art-pieces/:slug/room` | `src/App.test.tsx` > "shows the room view on the route /art-pieces/:slug/room" and "opens the room view from the details page" | The route shows the room view, and the link opens it |
| The art piece's image is shown with the piece name as alt text | `src/components/RoomView.test.tsx` > "shows the image of the art piece" | An `img` named after the piece is inside the room view |
| The image keeps the aspect ratio of `dimensions` | `RoomView.test.tsx` > "gives the image the width and height of the art piece" | The `img` has `width` and `height` equal to `dimensions` |
| The room view has a "Back" link | `RoomView.test.tsx` > "links back to the details page" | The link has `href="/art-pieces/wheat-field"` |
| An unknown `slug` shows "Art piece not found" | `RoomView.test.tsx` > "shows a message for an unknown art piece" | The message is shown, and no image |

**New**

| Criterion | Test | What it asserts |
|---|---|---|
| The room view shows a photo of a room as the background | `RoomView.test.tsx` > "shows a photo of a room as the background" | An `img` named "A living room with an empty wall" has `src="/room.jpg"` |
| The picture starts in the middle of the wall | `src/roomPosition.test.ts` > "starts in the middle of the wall" and `RoomView.test.tsx` > "hangs the picture in the middle of the wall at the start" | `startPosition()` is the center of the wall rectangle; the picture's `left` and `top` styles are that center in percent |
| Dragging moves the picture and it follows the pointer | `RoomView.test.tsx` > "moves the picture when it is dragged" | With the room's size mocked, pressing on the picture, moving the pointer by a number of pixels and releasing moves `left` and `top` by the matching percent; after releasing, moving the pointer does nothing |
| The picture cannot be dragged off the wall | `roomPosition.test.ts` > "keeps the whole picture inside the wall" and `RoomView.test.tsx` > "keeps the picture on the wall when it is dragged too far" | Positions beyond each edge are limited so the picture's edges stay inside the wall rectangle; dragging far to the bottom right stops at the wall's bottom right |
| A focused picture moves with the arrow keys and stays on the wall | `roomPosition.test.ts` > "moves by a step for an arrow key and stops at the wall" and `RoomView.test.tsx` > "moves the picture with the arrow keys" | The picture can be focused; ArrowRight and ArrowDown increase `left` and `top` by one step, ArrowLeft and ArrowUp decrease them, other keys do nothing, and the edge of the wall stops it |
| The position is not saved | `RoomView.test.tsx` > "starts in the middle of the wall each time the room view opens" | After moving the picture, unmounting and rendering the room view again puts it back in the middle |
| The photo's source, photographer and license are credited | `src/roomPhoto.test.ts` > "has the room photo in the public folder" and "credits the photographer and the license" | `public/room.jpg` exists and is smaller than 400 KB; `docs/credits.md` names the photographer, the license link and the source page |

## 3. Files that change

Already changed by the first version (uncommitted): `src/types.ts` (`dimensions`), `src/components/RoomView.tsx` and `RoomView.test.tsx` (new), `ArtPieceDetails.tsx` and its test, `App.tsx` and its test, the `dimensions` fixture lines in `utils.test.ts`, `ArtPiecePreview.test.tsx`, `ArtPieces.test.tsx`, `ArtworkInfo.test.tsx` and `Spotlight.test.tsx`, and the CSS room in `src/styles.css`.

For the new scope:

- `public/room.jpg` (new): the room photo, cropped to a landscape of 1600 x 1200 pixels from the top left of the original, saved as a JPEG of about 220 KB.
- `docs/credits.md` (new): "A modern grey sectional sofa in an empty room" by Costa Live, Unsplash License (https://unsplash.com/license), source page, and the crop I made.
- `src/roomPhoto.test.ts` (new): the two tests for the photo and its credit. It reads the files with Node, as `styles.test.ts` does.
- `src/roomPosition.ts` (new): the wall rectangle, `startPosition()`, `moveBy()` (move by a change in percent and keep the picture on the wall) and `moveByKey()` (a step of 2 percent per arrow key).
- `src/roomPosition.test.ts` (new): tests for those functions.
- `src/components/RoomView.tsx` (modified): the photo as the background, the picture in a focusable wrapper that is placed by percent, pointer events for dragging, and a key handler for the arrow keys.
- `src/components/RoomView.test.tsx` (modified): the new tests. The six existing tests stay as they are.
- `src/styles.css` (modified): replace the CSS-drawn room (the wall, the `::after` floor and the framed look) with the photo layout and the hanging picture. Tokens only, so the existing CSS tests must keep passing.

## 4. Out of scope

- Resizing or rotating the picture, hanging several pictures, snapping to a grid, and undo.
- Saving the position (the user chose not to save it).
- Other rooms or photos to choose from, zoom, sharing, and a real-world scale (the API's `dimensions` are in pixels).
- Finding the wall automatically: the wall rectangle is a constant measured for this one photo.
- A fallback when the photo fails to load.
- The "Back" link, camera or augmented reality.

## 5. Decisions (open questions resolved)

- **Photo:** "A modern grey sectional sofa in an empty room" by Costa Live, under the Unsplash License (free to use, no attribution required; credited anyway). I downloaded it into a scratch folder, checked that it is a valid JPEG, and looked at it. Two other candidates were rejected: one is mostly a window and a table with a frame already on the wall. The original is portrait (1600 x 2048), so it is cropped to 1600 x 1200 from the top left to show the wall and the top of the sofa. It is served from `public/room.jpg`.
- **Wall:** a rectangle in percent of the photo: left 4, right 72, top 4 and bottom 38. That keeps the picture on the left wall, above the sofa cushions and left of the corner.
- **Position:** the center of the picture in percent of the room, so it scales with the screen. The start is the center of the wall (38, 21).
- **Size:** the picture's height is 26 percent of the room's height, and its width follows the aspect ratio. Even a tall piece (ratio 1.45) and a wide piece (0.67) then fit the wall.
- **Moving:** pointer events (mouse and touch) with pointer capture, `touch-action: none` on the picture so a finger drags instead of scrolling, and a 2 percent step for the arrow keys. The picture is a focusable `group` named "Move <piece name>".
- **Testing without layout:** jsdom has no layout, so the tests mock `getBoundingClientRect` for the room and the picture. The clamping and key logic is also tested as plain functions in `roomPosition.ts`.
- **Photo alt text:** "A living room with an empty wall", so the photo and the art piece are two different images for screen readers and for tests.
- The photo is not in the repository yet. It is added in the implementation step, with `sips` for the crop.
- Where the picture sits relative to the sofa and the corner, how the drag feels, and touch dragging are visual checks in a browser, which tests cannot show.
- This is a large story for one pull request. It is built in small steps, and the position logic is kept in its own file to keep `RoomView` small.

# Plan for issue #11: Show Color Palette

**Note on PR #35 (issue #10).** Issue #10 is still open and also edits `ArtPieceDetails.tsx`, `ArtPieceDetails.test.tsx` and `types.ts`. This issue does not need its behavior, so this plan is committed on a branch from `origin/main`. Whichever PR merges second will need a small conflict resolution in those three files; nothing else overlaps.

## 1. Summary

The details page shows the color palette of the art piece: a list of all its colors, each drawn as a colored circle. The API already returns `colors` (an array of hex codes) for every piece, so the work is adding that field to the `ArtPiece` type, a new `ColorPalette` component, and rendering it on the details page. The `.palette` CSS (circles with a border) already exists in `styles.css`.

## 2. Acceptance criteria to tests

| Criterion | Test | What it asserts |
|---|---|---|
| The details page displays a list of all colors used in the image | `src/components/ColorPalette.test.tsx` > "shows one list item per color" and `src/components/ArtPieceDetails.test.tsx` > "shows the color palette" | `ColorPalette` renders a list named "Color palette" with one item per color; the details page shows that list with all colors of the viewed piece |
| Colors are displayed visually, for example in circles or squares | `ColorPalette.test.tsx` > "shows each color as a swatch with that background color" | Each list item has the matching `background-color` style (and a `title` with the hex code) |

## 3. Files that change

- `src/types.ts` (modified): add `colors: string[]` to `ArtPiece`.
- `src/components/ColorPalette.tsx` (new): `ul.palette` named "Color palette", one `li` per color with the color as its background.
- `src/components/ColorPalette.test.tsx` (new): tests for the component.
- `src/components/ArtPieceDetails.tsx` (modified): render `ColorPalette` with the piece's colors.
- `src/components/ArtPieceDetails.test.tsx` (modified): add `colors` to the fixture and add the details test.
- `src/utils.test.ts`, `src/App.test.tsx`, `src/components/ArtPiecePreview.test.tsx`, `src/components/ArtPieces.test.tsx`, `src/components/Spotlight.test.tsx` (modified): add `colors` to the art piece fixtures only, so `npm run check` passes. No assertion changes.

`styles.css` is not changed. `fetcher.test.ts` uses untyped data and needs no change.

## 4. Out of scope

- Dimensions of the art piece (the API has `dimensions`, but no issue asks for them here).
- Copying a color code, color names, or showing the palette on the Gallery, Spotlight or Favorites pages.
- Any change to the favorite or comment features.

## 5. Decisions (open questions resolved)

- The shape stays as the API returns it: `colors: string[]` of hex codes. The `ArtPiece` type gets the field as required, because every piece in the API has it.
- Accessibility: the list has an accessible name "Color palette", and each swatch has a `title` with its hex code (a tooltip). No extra text is rendered.
- Circles come from the existing `.palette li` CSS (jsdom cannot check the rendered shape, so the test checks the background color).
- A piece without colors shows an empty list.

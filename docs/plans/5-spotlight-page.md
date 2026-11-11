# Plan for issue #5: Spotlight Page

**Status:** Issue #5 is already implemented by commit `2bd670d` (#29). It was also verified in the browser: `/` shows an image with the artist caption, reloads give different pieces, and there are no console errors.

## 1. Summary

The homepage `/` should show one random art piece with its image and the artist's name. The pick must happen once, not on every re-render. `Spotlight.tsx` uses a lazy `useState` initializer. `getRandomArtPiece` in `utils.ts` makes the pick. `App.tsx` routes `/` to it.

## 2. Acceptance criteria to tests (all already exist)

| Criterion | Test | What it asserts |
|---|---|---|
| One piece randomly selected | `src/utils.test.ts` > "returns the art piece at the random index" | `Math.random` mocked to 0 and 0.99 returns the first and last pieces |
| Empty list is handled | `src/utils.test.ts` > "returns undefined for an empty list" | An empty list returns `undefined` |
| Picked only once (hint) | `src/components/Spotlight.test.tsx` > "keeps the same art piece when it re-renders" | After a re-render with a changed `Math.random`, the same piece is shown |
| Image displayed | `Spotlight.test.tsx` > "shows the image and artist of the randomly selected art piece" | The `img` has the right `src` and `alt` |
| Artist name displayed | Same test as above | The artist text is present |
| No data | `Spotlight.test.tsx` > "shows a message without art pieces" | "No art pieces to show." is shown |
| Available on `/` | `src/App.test.tsx` > "shows the spotlight on the route /" | At `/`, the mocked-random piece's artist and image render, and the other artist does not |

## 3. Files that change

None. `Spotlight.tsx`, `utils.ts`, `App.tsx` and their tests all exist.

## 4. Out of scope

- Gallery (issue 4, done) and Details, Favorites and comments (issues 6-13).
- Persisting favorites or comments.
- Restyling the spotlight, or linking it to a Details page.

## 5. Open questions

- Not yet run: `npm run check`, `npm run lint`, `npm run test:run`.

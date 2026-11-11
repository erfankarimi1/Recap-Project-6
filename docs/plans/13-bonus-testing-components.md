# Plan for issue #13: Bonus - Testing Components

**This issue is mostly done already, and the plan only fills the gaps.** Every component named in the tasks (Spotlight, art piece preview, art piece list, Navigation, art piece details) already has a test file, written test-first with the features. A coverage run (`npx vitest run --coverage`, 55 tests, measured on a tree that also had the unmerged #12) shows 100% of statements and lines, but real gaps at the function level: `Spotlight.tsx` 50% and `ArtPieceDetails.tsx` 66.67% of functions. The favorite button click handlers in those two components are never called by any test. The favorite status and the comments flowing into the components are also not tested at the component level.

This plan adds only tests. No application code changes.

## 1. Summary

Automated tests should cover the core components, ensuring they render and function as expected. The five components in the tasks already render correctly under test. This plan adds the missing "function as expected" tests: the favorite button (pressed state and click handler) in the Spotlight, the preview, the list and the details, plus the details' comments, comment submit, and unknown-slug message, and the highlighted Favorites link.

## 2. Acceptance criteria to tests

The issue has one criterion: "Automated tests cover the core components, ensuring they render and function as expected." Each task maps to the existing tests (already green) and the new tests below.

| Task | Existing tests | New test (file and name) | What it asserts |
|---|---|---|---|
| Spotlight | image/artist, same piece on re-render, no pieces, favorite button shown | `Spotlight.test.tsx` > "marks the favorite button as pressed for a favorite" | With `isFavorite` true for the picked piece, the button is pressed |
| | | `Spotlight.test.tsx` > "calls onToggleFavorite with the slug of the spotlight piece" | Clicking the button calls the handler once with that piece's slug |
| Art piece preview | image/title/artist, link to details | `ArtPiecePreview.test.tsx` > "shows a favorite button that reflects the favorite status" | The button is not pressed when `isFavorite` is false and pressed when true |
| | | `ArtPiecePreview.test.tsx` > "calls onToggleFavorite with the slug when the favorite button is clicked" | Clicking calls the handler once with the slug |
| List of art pieces | one item per piece, empty list, favorite button each | `ArtPieces.test.tsx` > "marks only the favorite pieces as pressed" | Only the pieces for which `isFavorite` is true are pressed |
| | | `ArtPieces.test.tsx` > "calls onToggleFavorite with the slug of the clicked piece" | Clicking the second piece's button calls the handler with the second slug |
| Navigation | links, highlight, navigate, Favorites link and navigation | `Navigation.test.tsx` > "highlights the Favorites link on the favorites page" | At `/favorites`, only the Favorites link has the `active` class |
| Art piece details | all details, back link, favorite button, comments section and form, palette | `ArtPieceDetails.test.tsx` > "shows the comments of the viewed piece" | Comments returned by `getComments(slug)` are displayed in the Comments section |
| | | `ArtPieceDetails.test.tsx` > "marks the favorite button as pressed for a favorite" | With `isFavorite` true, the button is pressed |
| | | `ArtPieceDetails.test.tsx` > "calls onToggleFavorite with the slug when the favorite button is clicked" | Clicking calls the handler once with the slug |
| | | `ArtPieceDetails.test.tsx` > "calls onAddComment with the slug and the text of a new comment" | Typing a comment and submitting calls `onAddComment("wheat-field", text)` |
| | | `ArtPieceDetails.test.tsx` > "shows a message for an unknown art piece" | For an unknown slug, "Art piece not found" is shown and no details are |

## 3. Files that change

All modified, none new, and only test files:

- `src/components/Spotlight.test.tsx`: two new tests.
- `src/components/ArtPiecePreview.test.tsx`: two new tests (the render helper gets the handler and status as arguments with the current defaults, so existing tests are unchanged).
- `src/components/ArtPieces.test.tsx`: two new tests (same approach for the helper).
- `src/components/Navigation.test.tsx`: one new test.
- `src/components/ArtPieceDetails.test.tsx`: five new tests (same approach for the helper).

No application code, no `setupTests.ts`, no config and no new dependency. Existing assertions stay as they are.

## 4. Out of scope

- Changing any component or any behavior. If a new test finds a real bug, I stop and report it instead of fixing it.
- New components, features or App-level integration tests beyond the existing ones.
- Tests for components that are already fully covered (`FavoriteButton`, `Comments`, `CommentForm`, `ColorPalette`, `storage`, `fetcher`, `utils`).
- The one uncovered branch in `App.tsx` (line 34), which is not part of this issue's tasks.
- A coverage threshold in CI.

## 5. Decisions (open questions resolved)

- Interpretation: because most of the issue is already done, the plan treats "done" as "function-level gaps closed". The criterion is one sentence, so the measurable gaps from the coverage report decide the scope.
- Red check: these tests describe behavior that already works, so they pass at once. For each new test, I temporarily break the code it covers (for example, remove the `onClick` wiring or ignore `isFavorite`), confirm the test fails with a clear message, then restore the code exactly. Every restore is checked.
- Test helpers: the render helpers in the existing files get optional arguments for the handler and the favorite status, with the same defaults as today, so no existing test changes.
- Base branch: `origin/main`. PR #37 (issue #12) is still open but changes only `App.tsx`, `App.test.tsx`, `setupTests.ts` and `storage*`, so there is no overlap.

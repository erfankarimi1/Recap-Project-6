# Plan: #14 Styling - Spotlight Slideshow and Color Theme

## 1. Summary
Turn the Spotlight into an accessible slideshow (autoplay, controls, dots, keyboard, swipe, reduced motion, preload, info panel) and move every hard-coded color in `src/styles.css` into CSS-variable tokens using a **charcoal + warm gold** palette. Visual only: no route/data/API changes, no new dependencies, one issue (not split), info panel uses only title/artist/year/genre.

Palette tokens (`:root` in `src/styles.css`):
- `--color-background: #1a1a1a`, `--color-surface: #262626`, `--color-text: #f2ede4`, `--color-text-muted: #b5aea2`
- `--color-accent: #d4a24c`, `--color-accent-contrast: #1a1a1a`, `--color-border: #3d3a35`, `--color-hover: #ffffff1f`, `--color-focus: #f0c674`, `--color-favorite: #e0607e`
- Contrast (AA 4.5:1) is verified for text/background, muted/surface and accent-contrast/accent.

## 2. Acceptance criteria to tests
| Criterion | Test (file / name) | Asserts |
|---|---|---|
| One piece at a time, alt = name | `Spotlight.test.tsx` / "shows one art piece at a time" | one `img` with the piece name |
| Previous/Next/Pause buttons; Next/Prev change piece | "changes the piece with Next and Previous" | buttons exist; the shown piece changes and wraps |
| Autoplay advances, stops on hover/focus | "advances automatically and pauses on hover and focus" (fake timers) | the piece changes after the interval; no change while hovered/focused |
| Pause/Play toggle | "toggles autoplay with the Pause button" | label becomes "Play"; no advance |
| Dots, `aria-current` | "shows navigation dots for the current position" | the current dot has `aria-current="true"`; clicking a dot shows that piece |
| Keyboard | "supports arrow keys and space" | ArrowRight/Left change the slide; Space toggles |
| Swipe | "changes the slide on swipe" | touchstart/touchend with dx changes the slide |
| Reduced motion | "does not autoplay with prefers-reduced-motion" (mock `matchMedia`) | no advance and the class `reduced-motion` is set |
| Preload next | "preloads the next image" | an `Image` with the next `src` is created |
| Favorite still works | existing favorite tests (kept) | `onToggleFavorite` is called with the shown slug |
| Info panel fields | "shows title, artist, year and genre" | all four texts are present |
| Panel position / fonts | CSS only, checked in the browser | not unit-testable (see section 5) |
| Tokens defined | `src/styles.test.ts` / "defines all color tokens" | reads `styles.css`; all 7+ variables exist in `:root` |
| No hard-coded colors | "has no color values outside :root" | no hex/rgb/hsl outside the `:root` block |
| Components use tokens | covered by the check above | the same stylesheet is shared by all components |
| AA contrast | `styles.test.ts` / "token pairs meet AA contrast" | a computed ratio ≥ 4.5 |
| Existing tests pass | full `npm run test:run` | green |

## 3. Files that change
- `src/styles.css` (modified): tokens, replace all hard-coded colors, slideshow/info/dots layout and transitions, `prefers-reduced-motion`.
- `src/components/Spotlight.tsx` (modified): index and playing state, timers, keyboard, swipe, preload. Starts at a random piece via `getRandomArtPiece`'s index logic in `utils.ts`.
- `src/components/SlideshowControls.tsx` (new): previous/next/play-pause buttons and dots.
- `src/components/ArtworkInfo.tsx` (new): museum-label info panel.
- `src/utils.ts` (modified, only if needed): a `getRandomIndex` helper, with its test in `utils.test.ts`.
- Tests: `Spotlight.test.tsx` (modified), `SlideshowControls.test.tsx` and `ArtworkInfo.test.tsx` (new, required by your "every component" rule), `styles.test.ts` (new).
- `docs/plans/14-styling-spotlight-slideshow-theme.md` (new): this plan, committed on the new branch `feature/14-styling-spotlight-slideshow-theme`.

## 4. Existing tests that need updating (approval requested)
- `Spotlight.test.tsx` "shows the image and artist of the randomly selected art piece": the artist moves from the `figcaption` to the info panel. The assertions stay the same and should still pass.
- "keeps the same art piece when it re-renders": it still holds, because the start index is chosen once.
- `App.test.tsx` line 66 "shows the spotlight on the route /": it should pass unchanged. If it doesn't, I'll stop and ask.

## 5. Out of scope
- No dark/light mode toggle (the project has none) and no footer (the project has none).
- No new data fields, no `dimensions`/description, and no API or route changes.
- No dependencies and no web fonts (a system serif stack such as Georgia is used).
- No changes to favorites/comments logic.

## 6. Open questions
- None blocking. Please confirm the palette hex values or give your own.
- The visual checks (layout, animation feel, mobile swipe) can't be unit-tested. I'll check them with Playwright, but the other Playwright session conflict must be resolved first.

## Verification
`npm run check`, `lint`, `test:run`, `format:check`, `build`, then manual checks on `localhost:3000` for every page.

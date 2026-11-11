# Plan for story 16: Show the Hex Code of a Palette Color on Hover (GitHub issue #42)

Story 16 is GitHub issue #42. The story number is used for the branch and file names, as for stories 14 and 15. The story is independent of the other open work: dark mode (story 15, PR #59) is merged, and the tooltip uses the color tokens, so it works in both modes.

## 1. Summary

The color swatches on the details page show their hex code in a visible tooltip when hovered or focused. Today a swatch only has a `title` attribute: a delayed browser tooltip that does not appear with the keyboard or on touch screens. Each swatch gets a button inside it, so it can be reached with the Tab key and has the hex code as its accessible name, and `ColorPalette` keeps the active color in state to show the tooltip.

## 2. Acceptance criteria to tests

| Criterion | Test (all in `src/components/ColorPalette.test.tsx`) | What it asserts |
|---|---|---|
| Hovering a swatch shows its hex code as visible text | "shows the hex code while a swatch is hovered" | Before hovering, there is no tooltip. After `user.hover` on the button named "#37412E", a `tooltip` with the text "#37412E" is shown |
| Moving the pointer away hides the hex code | "hides the hex code when the pointer leaves" | After `user.hover` and then `user.unhover`, there is no tooltip |
| Each swatch can be reached with the Tab key and shows its hex code while focused | "shows the hex code while a swatch is focused" | The first `user.tab()` focuses the first swatch and its tooltip shows "#37412E"; the next `user.tab()` moves the tooltip to the second color; tabbing out of the list hides it |
| Each swatch has the hex code as its accessible name | "gives each swatch the hex code as its accessible name" | There is one button per color, and each button's accessible name is that color's hex code |

## 3. Files that change

- `src/components/ColorPalette.tsx` (modified): each `li` keeps its circle and background and gets a transparent `button` (`aria-label` = hex code) that reports hover and focus. A state `activeColor` decides which `li` shows `<span role="tooltip">{color}</span>`. The `title` attribute is removed, so there are not two tooltips.
- `src/components/ColorPalette.test.tsx` (modified): add the four new tests. In the existing test "shows each color as a swatch with that background color", remove only the assertion that each swatch has a `title` attribute, because the `title` is replaced by the tooltip. Its background color assertions and the test "shows one list item per color" stay as they are.
- `src/styles.css` (modified): `.palette li` gets `position: relative` and keeps its `var(--color-border)` border; new rules for `.palette button` (fills the circle, transparent, same shape) and for the tooltip, using color tokens only, so it works in light and dark mode.

No other file changes. `ArtPieceDetails` and its test are unchanged: the details page keeps rendering `ColorPalette` with one list item per color. `styles.test.ts` is unchanged: its checks that `.palette li` uses a token and that no color is hard-coded outside the token blocks still apply and must keep passing.

## 4. Out of scope

- Copying the hex code on click.
- Touch screens that do not focus a button on tap (iOS Safari), long-press behavior, and tooltip animations.
- Moving or flipping the tooltip near the screen edges.
- Showing a tooltip for hover and focus on different swatches at once: the last event wins.
- Color names, or the palette on pages other than the details page.

## 5. Decisions (open questions resolved)

- The visible tooltip replaces the native `title` tooltip, to avoid two tooltips on one swatch. This is why one assertion of an existing test changes.
- The swatch stays the `li` (so the existing background and list-item tests keep their meaning); a transparent `button` inside it provides keyboard focus and the accessible name. This avoids a focusable `li`, which is not an interactive element.
- Only one tooltip is shown at a time, from one state value `activeColor`. Hover and focus both set it, and leaving or blurring clears it.
- The tooltip is plain text in a `role="tooltip"` element next to its swatch, positioned with CSS above the swatch. Its colors come from `--color-surface`, `--color-text` and `--color-border`.
- jsdom cannot check where the tooltip appears on screen, so the tests check that it is shown, hidden and moved, and its position is a visual check in a browser.

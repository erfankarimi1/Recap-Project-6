# Plan for story 15: Add a Dark Mode Toggle (GitHub issue #41)

Story 15 is GitHub issue #41. The story number is used for the branch and file names, as for story 14 (issue #39). The issue builds on the color tokens from story 14, which are merged (PR #40): `src/styles.css` has no hard-coded color outside the token block, and that one `:root` set is the current dark charcoal-and-gold theme.

## 1. Summary

Add a button to the navigation that switches the app between a light and a dark look. The current theme becomes the dark set, a light set of the same tokens is added, and the mode is applied as `data-theme` on the `<html>` element. At the start the mode comes from the saved choice, otherwise from the operating system (`prefers-color-scheme`); the choice is saved in `localStorage`. A test of `styles.css` guards that every color comes from a token defined for both modes and that the text colors keep a contrast of at least 4.5:1.

## 2. Acceptance criteria to tests

| Criterion | Test | What it asserts |
|---|---|---|
| The navigation has a button that switches between light and dark, with a label that tells what happens on click | `src/components/Navigation.test.tsx` > "shows a button that tells what happens on click" | In dark mode the button is named "Switch to light mode"; in light mode it is named "Switch to dark mode" |
| | `Navigation.test.tsx` > "calls onToggleTheme when the theme button is clicked" | Clicking the button calls the handler once |
| Clicking the button sets `data-theme` on `<html>` | `src/App.test.tsx` > "sets data-theme on the html element when the theme button is clicked" | Starting in light mode, a click sets `data-theme="dark"`, and a second click sets `data-theme="light"` |
| At the start the app uses the operating system setting | `src/theme.test.ts` > "uses the operating system setting when nothing is saved" | With `matchMedia` reporting a dark preference the initial theme is "dark", with a light preference it is "light" |
| | `App.test.tsx` > "starts with the operating system setting" | With nothing saved and a mocked dark (or light) OS setting, `data-theme` is "dark" (or "light") after the first render |
| The choice is kept after a reload | `theme.test.ts` > "saves the theme and loads it again" | `saveTheme("light")` followed by `getInitialTheme()` returns "light", even when the OS setting is dark |
| | `App.test.tsx` > "keeps the chosen theme after a reload" | After toggling, unmounting and rendering the app again (a reload), `data-theme` is still the chosen one |
| Without any saved choice, or with an invalid one, the app still works | `theme.test.ts` > "ignores an invalid saved value" | A saved value like "blue" is ignored and the OS setting is used |
| | `theme.test.ts` > "falls back to dark without matchMedia" | In the test environment (no `matchMedia`) and with nothing saved, the theme is "dark" and nothing throws |
| Every color in `styles.css` comes from a CSS variable defined for both modes | `src/styles.test.ts` > "defines every color token for both modes" | The set of `--color-*` names in the light block equals the set in the dark block |
| | `styles.test.ts` > "has no color values outside the token blocks" | After removing the two token blocks, `styles.css` contains no hex, `rgb()` or `hsl()` color |
| Text and background colors of both modes have a contrast of at least 4.5:1 | `styles.test.ts` > "keeps a contrast of at least 4.5:1 in both modes" | For each mode, the pairs text/background, text/surface, muted text/background, muted text/surface, accent/background and accent-contrast/accent reach 4.5:1 |

## 3. Files that change

- `src/types.ts` (modified): add `type Theme = "light" | "dark"`.
- `src/theme.ts` (new): `THEME_STORAGE_KEY`, `getInitialTheme()` (saved valid value, else OS setting, else "dark"), `saveTheme(theme)`.
- `src/theme.test.ts` (new): tests for the module above.
- `src/styles.css` (modified): add the light token set in `:root[data-theme="light"]` (the existing `:root` stays the dark set) and the style of the toggle button, using tokens only.
- `src/styles.test.ts` (new): tests that read `styles.css` (token sets, no stray colors, contrast).
- `src/components/Navigation.tsx` (modified): new props `theme` and `onToggleTheme`, and the toggle button.
- `src/components/Navigation.test.tsx` (modified): the render helper gets the new props with defaults, plus the two new tests. Existing assertions stay as they are.
- `src/App.tsx` (modified): `theme` state from `getInitialTheme`, an effect that sets `data-theme` and saves the theme (`useLayoutEffect`, so the attribute is set before the first paint), and the toggle handler passed to `Navigation`.
- `src/App.test.tsx` (modified): add the three new tests. Existing assertions stay as they are.
- `src/setupTests.ts` (modified): after each test also remove the `data-theme` attribute from `<html>`, so one test's theme cannot leak into the next.

No new dependency. `index.html` and the other components do not change.

## 4. Out of scope

- Preventing a flash of the wrong theme before the JavaScript has loaded (it would need an inline script in `index.html`).
- A third "follow the system" option, and following live changes of the operating system setting after the app has started.
- `color-scheme` for native controls and scrollbars, theme transitions, and per-page themes.
- Changing any feature, route or data. Stories 16 (hex code on hover) and 17 (view in room).

## 5. Decisions (open questions resolved)

- The existing charcoal-and-gold theme from story 14 is the dark set and stays in `:root`, unchanged. The light set is added as `:root[data-theme="light"]` and overrides the same tokens. The exact light colors are chosen during implementation and must pass the contrast test.
- Without a saved choice and without `matchMedia`, the app uses dark, which is its current look. With `matchMedia`, "prefers dark" gives dark and anything else gives light.
- The saved theme uses its own `localStorage` key (`"theme"`), separate from the art piece info. A saved value other than "light" or "dark" is ignored.
- The contrast test covers the text, muted text, accent and accent-contrast pairs listed above; it does not cover borders, hover or favorite colors, which are not text.
- `window.matchMedia` does not exist in the test environment, so the tests mock it with `vi.stubGlobal` and remove the mock after each test.
- Commit messages reference the real GitHub number (#41), because `#15` would link to an unrelated pull request.

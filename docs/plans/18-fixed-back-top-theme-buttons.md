# Plan for story 18: Add Fixed Back, Go-to-Top and Theme Buttons (GitHub issue #60)

Story 18 is GitHub issue #60. The story number is used for the branch and file names, as for stories 14 to 17. It builds on the dark mode toggle (story 15, merged). PR #62 (story 17, the room view) is still open and also edits `ArtPieceDetails.tsx`, `App.tsx` and `styles.css`, in other places, so any conflict should be small. This branch starts from `origin/main`, which does not contain the room view.

## 1. Summary

Three round buttons stay fixed on every page: the theme button in the top right (moved out of the navigation bar), a "Back" button in the top left, and a "Go to top" button in the bottom right that only appears after scrolling down more than 300 px. "Back" goes to the previous page, and to the Gallery when there is none. The three buttons are rendered once in `App`, outside the routes, and the old "Back" link on the details page is removed.

## 2. Acceptance criteria to tests

| Criterion | Test | What it asserts |
|---|---|---|
| The navigation bar no longer contains a theme button | `src/components/Navigation.test.tsx` > "has no theme button" | The navigation has its three links and no button |
| A theme button is fixed in the top right on every page, with a label that tells what happens on click | `src/components/ThemeButton.test.tsx` > "tells what happens on click" | In dark mode the button is named "Switch to light mode"; in light mode "Switch to dark mode" |
| | `src/App.test.tsx` > "shows the theme, back and go-to-top buttons on every page" | At `/`, `/art-pieces`, `/favorites`, `/art-pieces/a` and an unknown URL, the theme button and the "Back" button are shown, once each |
| | `src/styles.test.ts` > "fixes the corner buttons in their corners" | `.corner-button` is `position: fixed`; the theme button's rule sets `top` and `right`, the back button's `top` and `left` |
| Clicking it still switches the theme and saves the choice | `ThemeButton.test.tsx` > "calls onToggle when it is clicked" | One click calls the handler once |
| | the existing `App.test.tsx` tests "sets data-theme on the html element when the theme button is clicked" and "keeps the chosen theme after a reload" | They keep passing without any change, because they find the button by its name |
| A "Back" button is fixed in the top left on every page | `src/components/BackButton.test.tsx` > "shows a button named Back" | A button named "Back" is shown |
| | the `App.test.tsx` test and the `styles.test.ts` test above | As above |
| Clicking it goes to the previous page when there is one | `BackButton.test.tsx` > "goes to the previous page when there is one" | After opening the Gallery and then Favorites in one history, clicking "Back" shows the Gallery |
| When there is no previous page, it goes to the Gallery | `BackButton.test.tsx` > "goes to the Gallery when there is no previous page" | Starting at `/favorites` with no history, clicking "Back" shows the Gallery page |
| The "Back" link on the details page is removed | `src/components/ArtPieceDetails.test.tsx` > "has no back link of its own" | The details page has no link named "Back" |
| "Go to top" is not displayed while scrolled less than 300 px | `src/components/ScrollToTopButton.test.tsx` > "is hidden near the top of the page" | At a scroll position of 0 and of 300 there is no "Go to top" button |
| After scrolling down more than 300 px it is displayed in the bottom right above the navigation bar | `ScrollToTopButton.test.tsx` > "appears after scrolling down more than 300 px and disappears when back at the top" | After a scroll event at 301 px the button is shown; after scrolling back to 100 px it is hidden again |
| | `styles.test.ts` > "fixes the corner buttons in their corners" | The go-to-top button's rule sets `right` and a `bottom` that is above the navigation bar (`var(--nav-height)`) |
| Clicking it scrolls the page to the top | `ScrollToTopButton.test.tsx` > "scrolls to the top when it is clicked" | Clicking calls `window.scrollTo` once with `{ top: 0, behavior: "smooth" }` |
| Each button can be reached with the Tab key and has an accessible name | `ThemeButton.test.tsx`, `BackButton.test.tsx` and `ScrollToTopButton.test.tsx` > "can be reached with the Tab key" | After one `Tab`, the button has focus, and `getByRole("button", { name })` finds it |

## 3. Files that change

New:

- `src/components/ThemeButton.tsx` and `ThemeButton.test.tsx`: the round theme button (a sun or a moon as an inline SVG, the label as its accessible name). It takes `theme` and `onToggle`.
- `src/components/BackButton.tsx` and `BackButton.test.tsx`: uses `useNavigate` and `useLocation`. When the location key is `"default"` (the first page of the session) there is no previous page, so it navigates to `/art-pieces`; otherwise it navigates back by one.
- `src/components/ScrollToTopButton.tsx` and `ScrollToTopButton.test.tsx`: shows itself while `window.scrollY` is more than 300, using a scroll listener that is removed on unmount. The tests mock `window.scrollY` and `window.scrollTo`, because jsdom has no scrolling.

Modified:

- `src/components/Navigation.tsx`: remove the `theme` and `onToggleTheme` props and the button.
- `src/components/Navigation.test.tsx`: remove the theme props from the render helper and delete the two theme tests ("shows a button that tells what happens on click" and "calls onToggleTheme when the theme button is clicked"), which move to `ThemeButton.test.tsx`; add "has no theme button". The other tests stay as they are.
- `src/components/ArtPieceDetails.tsx`: remove the `Back` link, and its `Link` import if it is no longer used.
- `src/components/ArtPieceDetails.test.tsx`: delete the two tests of the old link ("shows a back button" and "navigates back to the list") and add "has no back link of its own". The other tests stay as they are.
- `src/App.tsx`: render `BackButton`, `ThemeButton` and `ScrollToTopButton` once, outside the `Routes`, and stop passing the theme props to `Navigation`.
- `src/App.test.tsx`: add "shows the theme, back and go-to-top buttons on every page". The existing theme tests are unchanged.
- `src/styles.css`: a shared `.corner-button` rule (fixed, round, centered icon, color tokens only) and one rule per corner: top left, top right, and bottom right above the navigation bar (`bottom: calc(var(--nav-height) + 1rem)`). Remove the `.theme-toggle` rules, which have no user any more.
- `src/styles.test.ts`: append "fixes the corner buttons in their corners". The existing tests stay as they are, and they must keep passing: no color is hard-coded outside the token blocks.

## 4. Out of scope

- The "Back" link of the room view (story 17, PR #62): it is not on `main` yet. After both merge, the room page will have its own "Back" link and the fixed "Back" button; removing the link would be a follow-up.
- Hiding the back button on some pages (for example on the Spotlight), and a different fallback than the Gallery.
- Respecting `prefers-reduced-motion` for the smooth scroll, and animations.
- Tooltips on the buttons, moving the buttons, and saving anything.
- Any change to the navigation links or to the theme logic (state, saving, `data-theme`).

## 5. Decisions (open questions resolved)

- The old "Back" link on the details page is removed, as the issue says, because the fixed button replaces it. This changes two existing tests, listed in section 3, with the issue's approval.
- The back button goes back by one step in the history; when the current page is the first page of the session (`location.key === "default"`), it goes to the Gallery. This is the behavior chosen for the story. On the Gallery itself with no history it stays on the Gallery.
- The go-to-top button is shown when `window.scrollY` is more than 300, so it is hidden at exactly 300. It scrolls with `window.scrollTo({ top: 0, behavior: "smooth" })`.
- The icons are inline SVG (sun, moon, arrow left, arrow up), so there is no new dependency. The label in the issue is the button's accessible name (`aria-label`).
- The three buttons are plain `button` elements, so they can be reached with the Tab key without extra code. The tests check it.
- The positions are CSS, which jsdom cannot show. The CSS test checks that each rule fixes the button in its corner, and the real layout is a visual check.
- Where the corner buttons cover other content (the full-screen Spotlight slideshow, long pages on small screens) can only be checked in a browser.

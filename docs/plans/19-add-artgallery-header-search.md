# Plan: 19 (GitHub #63) Add ArtGallery Header with Search and Filters

## 1. Summary
Add a header with the site name "ArtGallery" (`h1`) and a search and filter bar (search, artist, year, type, color) at the top of Spotlight, Gallery and Favorites, but not Details or Room. The search and filter state lives once in `App`, so it is shared by the three pages and survives navigation between them. A pure `filterArtPieces` function does the matching. Visual and data-view change only: no API, route or favorites/comments logic changes, no new dependencies.

## 2. Acceptance criteria to tests
| Criterion | Test (file / name) | Asserts |
|---|---|---|
| Header with "ArtGallery" h1 on the 3 pages, not on details | `App.test.tsx` / "shows the ArtGallery header on Spotlight, Gallery and Favorites only" | `h1` "ArtGallery" on `/`, `/art-pieces`, `/favorites`; absent on `/art-pieces/:slug` |
| Bar is in the header | `Header.test.tsx` / "contains the search and filter bar" | the search field is inside the `banner` |
| Search field "Search" | `SearchFilterBar.test.tsx` / "has a search field" | `getByRole("searchbox", {name: "Search"})` |
| Filters artist, year, color, type with accessible names | "has an artist, year and type filter and a color filter" | combobox names "Artist", "Year", "Type"; group "Color" |
| Options only from data, no duplicates | "lists each artist, year and type once" | duplicate artists give one option; an "All" option stays first |
| Color swatches with hex names | "shows a swatch for every color in the data" | one button per unique hex, name = hex, `aria-pressed` for the chosen one |
| Text search over name, artist, year, genre, case-insensitive | `utils.test.ts` / "filters by text in name, artist, year or genre, ignoring case" | one row per field |
| Artist / year / type filter | `utils.test.ts` / "filters by artist, year and type" | only exact matches stay |
| Color filter | "filters by a color of the palette" | only pieces whose `colors` contain the hex (case-insensitive) |
| All filters combine (AND) | "requires every filter to match" | piece failing one filter is dropped |
| "Clear filters" | `SearchFilterBar.test.tsx` / "clears the search and all filters" | `onClear` called; `App.test.tsx` / "shows all pieces again after Clear filters" |
| No match message | `App.test.tsx` / "shows No art pieces match your search." | text shown on the Gallery for a query with no hit |
| Gallery lists only matches | `App.test.tsx` / "filters the Gallery" | typing "Sunday" leaves one link |
| Favorites lists only matching favorites; no-favorites message unchanged | "filters the Favorites page" | only matching favorite shown; with no favorites the existing empty output is unchanged and no "match" message is shown |
| Spotlight slideshow runs over matches | `Spotlight.test.tsx` / "starts over the new pieces when the filter changes" + `App.test.tsx` / "filters the Spotlight" | dots count equals the matches; Next cycles only through them; no out-of-range index |
| Filters kept between pages | `App.test.tsx` / "keeps the search when moving to another page" | type in Gallery, click Favorites nav, the field still has the text |
| Keyboard usable | `SearchFilterBar.test.tsx` / "can be used with the keyboard" | `user.tab()` reaches each control; `user.type` fills; Enter/Space on a swatch toggles it |
| Tokens only, dark and light | `styles.test.ts` / existing "no color values outside :root" plus a new "header and filter bar take their colors from the tokens" | rule bodies use `var(--color-` |
| No horizontal scroll at 375 px | `styles.test.ts` / "wraps the filter bar on small screens" (CSS text: `flex-wrap`, `min-width: 0`) + a Playwright check at 320/375/768/1440 | jsdom has no layout, so the real check is manual |

## 3. Files that change
- `src/utils.ts` (modified): `filterArtPieces(pieces, {query, artist, year, type, color})`, `getFilterOptions(pieces)` (unique sorted artists, years, types, colors) and a `Filters` type default `EMPTY_FILTERS`. Tests in `utils.test.ts` (modified).
- `src/types.ts` (modified): `ArtFilters` type.
- `src/components/SearchFilterBar.tsx` (new): controlled search field, three selects, color swatch buttons, "Clear filters". Test `SearchFilterBar.test.tsx` (new).
- `src/components/Header.tsx` (new): `<header>` with `h1` "ArtGallery" and the bar. Test `Header.test.tsx` (new).
- `src/App.tsx` (modified): holds `filters` state; one layout route (`<Route element={<PageWithHeader/>}>` with `Outlet`) around `/`, `/art-pieces`, `/favorites`; passes filtered pieces to Spotlight / ArtPieces; shows "No art pieces match your search." when filters are active and nothing matches. `App.test.tsx` (modified, new tests only).
- `src/components/Spotlight.tsx` (modified): give the slideshow a `key` built from the piece slugs (set in `App`), so the start index is chosen again when the filter changes. No logic change inside.
- `src/styles.css` (modified): header, title, bar, swatches; small tweaks so the full-viewport Spotlight still works with a header (`main:has(.spotlight)`). Colors only through tokens. `styles.test.ts` (modified, new tests only).

## 4. Existing tests that need updating (approval requested)
- None expected. Existing tests render `ArtPieces`, `Spotlight` and `App` the same way; the `/` Spotlight route still shows one piece, so `App.test.tsx` "shows the spotlight on the route /" should pass unchanged. If any fails, I stop and ask.

## 5. Out of scope
- Search or filters on the details and room pages; URL query parameters; saving the filters in the browser; sorting; a "type" other than genre.
- Range slider for years (exact year strings only, like "1887–88").
- Changes to the navigation bar, the fixed corner buttons (story 18), or favorites/comments logic.
- New dependencies or API changes.

## 6. Open questions
1. **Branching.** Story 18 is still uncommitted on `feature/18-...` and also edits `App.tsx` and `styles.css`. Branching 19 from `main` would not contain 18's changes and would conflict later. Recommended: finish and commit 18 first (or merge its PR), then branch 19 from it, or from `main` once it is merged.
2. **Color matching** is the exact hex (case-insensitive). The 11 pieces have about 50 different colors, so the swatch list will be long. Is that fine, or should similar colors be grouped into names like "green"?
3. **Zero matches on Spotlight:** the message replaces the slideshow. OK?

## Verification
`npm run check`, `lint`, `test:run`, `coverage`, `build`, `npx prettier --check src`, then Playwright on the dev server: search, each filter, color swatch, Clear, filters kept across the three pages, no overflow at 320/375/768/1440 px, dark and light mode.

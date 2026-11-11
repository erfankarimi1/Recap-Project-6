# Plan for issue #12: Bonus - Persist Favorites and Comments in the Browser

All dependencies are on `main`: the `ArtPieceInfo` state in `App` with favorites (#8, #9) and comments (#10). PR #36 (issue #11) is still open but touches `types.ts` and the details page, not `App.tsx`, so there is no real overlap.

## 1. Summary

The favorite flags and comments, which are now lost on reload because they live only in `useState`, are saved in the browser's `localStorage`. The state is read once when `App` starts and written whenever it changes. The art pieces themselves are still fetched from the API; only the `ArtPieceInfo` list is stored. With nothing saved, the app starts empty as it does today.

## 2. Acceptance criteria to tests

| Criterion | Test | What it asserts |
|---|---|---|
| Favorite flags and comments are persisted across reloads | `src/storage.test.ts` > "saves the info and loads it again" | `saveArtPiecesInfo(info)` followed by `loadArtPiecesInfo()` returns the same favorites and comments |
| Favorites are persisted across reloads | `src/App.test.tsx` > "keeps the favorites after a reload" | After favoriting a piece, unmounting the app and rendering it again (a reload) shows that piece's button still pressed |
| Comments are persisted across reloads | `src/App.test.tsx` > "keeps the comments after a reload" | After adding a comment, unmounting and rendering again shows the comment on that piece's details page |
| Without any data in the local storage, the app still works | `src/storage.test.ts` > "returns an empty list when nothing is saved" and `src/App.test.tsx` > "starts without favorites when nothing is saved" | `loadArtPiecesInfo()` returns `[]` for an empty storage; the app renders and every favorite button is not pressed |
| (Robustness of the same criterion) saved data that is unreadable does not break the app | `src/storage.test.ts` > "returns an empty list when the saved data is not valid" | Invalid JSON and a saved value that is not an array both return `[]` instead of throwing |

## 3. Files that change

- `src/storage.ts` (new): `STORAGE_KEY`, `loadArtPiecesInfo()` (handles `null`, invalid JSON and non-array values) and `saveArtPiecesInfo(info)`.
- `src/storage.test.ts` (new): tests for the module.
- `src/App.tsx` (modified): `useState<ArtPieceInfo[]>(loadArtPiecesInfo)` and a `useEffect` that saves on every change.
- `src/App.test.tsx` (modified): add the three new tests. Existing assertions stay as they are.
- `src/setupTests.ts` (modified): add `afterEach(() => localStorage.clear())`. Without this, favorites and comments saved by one test would leak into the next and break the existing tests that expect an empty start. This is a test-environment change, not a change to any existing test.

No new dependency and no change to `types.ts` or `styles.css`.

## 4. Out of scope

- Saving the fetched art pieces (they always come from the API).
- Syncing between browser tabs, versioning or migrating the saved format, and an "empty storage" button.
- Handling `localStorage` write errors (quota exceeded, storage disabled in private mode); only unreadable saved data is handled.
- Checking every saved entry's shape: only "is it an array" is checked.
- Any change to the favorite, comment or palette features themselves.

## 5. Decisions (open questions resolved)

- Module: the load and save functions live in `src/storage.ts`, so they can be tested without rendering the app. The key is `"art-pieces-info"`.
- Loading: read once with `useState(loadArtPiecesInfo)` (a lazy initializer), as the issue's hint suggests. Saving: a `useEffect` with the state as its dependency.
- A "reload" in tests is unmounting the app and rendering a new one, with `localStorage` kept in between (jsdom keeps it for the whole test).
- Test isolation: `localStorage` is cleared after every test in `setupTests.ts`.
- The first render also writes the (empty) initial state to storage. This is harmless and avoids a special case.

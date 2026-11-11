# Plan for issue #10: Comments for Art Pieces

All dependencies are on `main`: the details page (#7) and the shared favorites state in `App` (#8, #9).

## 1. Summary

The details page gets a "Comments" section that lists the comments of the art piece being viewed (text plus date and time) and a form to add a new one. Comments are stored in `App`, in the same per-piece state as the favorite status (`ArtPieceInfo`), so each art piece keeps its own comments. Empty comments cannot be submitted.

## 2. Acceptance criteria to tests

| Criterion | Test | What it asserts |
|---|---|---|
| The detail view has a section labeled "Comments" with a list of comments | `src/components/Comments.test.tsx` > "shows a section labeled Comments with a list" and `src/components/ArtPieceDetails.test.tsx` > "shows the comments section" | A region named "Comments" with one list item per comment; the details page contains that region |
| Each comment's text is displayed | `Comments.test.tsx` > "shows the text of each comment" | Each comment text is present |
| Each comment's date and time are displayed | `Comments.test.tsx` > "shows the date and time of each comment" | A `time` element per comment shows `new Date(date).toLocaleString()` and has `dateTime` set to the stored ISO date |
| A form with a text field and a submit button is displayed | `src/components/CommentForm.test.tsx` > "shows a text field and a submit button" and `ArtPieceDetails.test.tsx` > "shows the comment form" | A text field labeled "Comment" and a button "Add comment" are present, also on the details page |
| Submitting adds the comment to this art piece only | `CommentForm.test.tsx` > "calls onSubmit with the text and clears the field" and `src/App.test.tsx` > "adds a comment to this art piece only" | The form calls `onSubmit` with the text and empties the field; in the app, a comment added on piece A appears on A and not on piece B |
| Empty comments cannot be submitted | `CommentForm.test.tsx` > "does not submit an empty or blank comment" | Submitting nothing or only spaces does not call `onSubmit` |

## 3. Files that change

- `src/types.ts` (modified): add `ArtPieceComment = { text: string; date: string }` and a `comments: ArtPieceComment[]` property on `ArtPieceInfo`.
- `src/components/Comments.tsx` (new): section labeled "Comments" with the list, each item with text and `<time>`.
- `src/components/Comments.test.tsx` (new): tests for the component.
- `src/components/CommentForm.tsx` (new): labeled text field and submit button; ignores empty or blank text; clears the field after submitting.
- `src/components/CommentForm.test.tsx` (new): tests for the component.
- `src/components/ArtPieceDetails.tsx` (modified): render `Comments` and `CommentForm` for the viewed piece; new props `getComments` and `onAddComment`.
- `src/components/ArtPieceDetails.test.tsx` (modified): pass the new props in the helper and add the two details tests. Existing assertions stay.
- `src/App.tsx` (modified): store comments in `ArtPieceInfo`, add `getComments` and `handleAddComment` (stores `new Date().toISOString()`), and keep the favorite logic working with the new property.
- `src/App.test.tsx` (modified): add the "this art piece only" test. Existing assertions stay.

`styles.css` is not changed: it already has `.comments`, `.comments time` and `.comment-form`.

## 4. Out of scope

- Editing or deleting comments, ratings, comment authors.
- Saving comments in the browser (a bonus issue); comments are lost on reload.
- Showing comments on the Gallery, Spotlight or Favorites pages.
- Limits on comment length and any sorting beyond "in the order added".

## 5. Decisions (open questions resolved)

- State: comments live in `ArtPieceInfo` in `App`, as the issue's hint suggests, so toggling a favorite must keep the comments (the existing toggle spreads the old info, and new entries start with `comments: []`).
- Date: stored as an ISO string (`new Date().toISOString()`), shown with `toLocaleString()`. Tests compute the expected text the same way, so they do not depend on the time zone.
- "Labeled Comments": a `section` with a "Comments" heading, which gives a region named "Comments".
- Empty comments: the field is `required`, and the submit handler also ignores blank text (spaces only), because `required` alone accepts spaces. The tests cover the blank case.
- Order: oldest first, in the order added.
- With no comments the list is empty, with no message (not asked for).

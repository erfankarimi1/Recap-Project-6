# 14: Styling - Spotlight Slideshow and Color Theme


The Spotlight page should feel like a museum wall, and the whole app should share one consistent color theme. This is a visual change only: no changes to routes, data or functionality.

## Value Proposition

**As an** art enthusiast

**I want to** browse the Spotlight as an immersive slideshow inside a consistent dark, gallery-like theme

**so that** the artworks stand out and the app feels like a real gallery.

## Acceptance Criteria

**Slideshow**

- [ ] Exactly one art piece is featured at a time, with its image alt text set to the piece name.
- [ ] Buttons labeled "Previous", "Next" and "Pause"/"Play" are displayed. Clicking Next or Previous changes the featured piece.
- [ ] Autoplay advances the slide on an interval and stops while the slideshow is hovered or focused.
- [ ] The Pause button stops autoplay, and its label changes to "Play".
- [ ] Navigation dots show the current position. Clicking one shows that piece, and the current dot has `aria-current="true"`.
- [ ] ArrowLeft and ArrowRight change the slide, and Space toggles play/pause.
- [ ] Swiping left or right on touch devices changes the slide.
- [ ] With `prefers-reduced-motion: reduce`, autoplay is off and the zoom/slide animation is disabled.
- [ ] The next slide's image is preloaded.
- [ ] The existing favorite button still works on the featured piece.

**Artwork info**

- [ ] The info panel shows title, artist, year and genre, using the existing data fields only.
- [ ] The info panel is next to the image on desktop and below it on mobile.
- [ ] The title uses a serif font, and the details use a sans-serif font.

**Color theme**

- [ ] The colors `--color-background`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-accent`, `--color-border` and `--color-focus` are defined once as CSS variables.
- [ ] `styles.css` contains no hard-coded color values outside the token definitions.
- [ ] Gallery, Favorites, Details, Navigation, buttons and the comment form all use the tokens.
- [ ] Text and interactive elements meet WCAG AA contrast (4.5:1 for text).
- [ ] All existing tests still pass.

## Tasks

- [ ] Define the color tokens in `:root` and replace every hard-coded color in `src/styles.css`.
- [ ] Restyle Navigation, the Gallery/Favorites cards, Details, `CommentForm` and the buttons with the tokens.
- [ ] Rebuild `Spotlight` as a slideshow with state for the current index and the playing flag.
- [ ] Add the controls, dots, keyboard, swipe and hover/focus pause.
- [ ] Add the transitions and info animation, with a reduced-motion fallback.
- [ ] Preload the next image.
- [ ] Add the info panel with serif/sans typography and the responsive layout.
- [ ] Write a test for every changed or new component, and update the tests that depend on the old Spotlight.
- [ ] Run `check`, `lint`, `test:run`, `format:check` and `build`.

import "@testing-library/jest-dom/vitest";

// Saved favorites, comments and the theme must not leak from one test into
// the next
afterEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

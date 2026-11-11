import "@testing-library/jest-dom/vitest";

// Saved favorites and comments must not leak from one test into the next
afterEach(() => localStorage.clear());

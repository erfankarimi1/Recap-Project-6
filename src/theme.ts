import type { Theme } from "./types";

export const THEME_STORAGE_KEY = "theme";

export function getInitialTheme(): Theme {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;

  // Without matchMedia the app keeps its original, dark look
  if (typeof window.matchMedia !== "function") return "dark";

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function saveTheme(theme: Theme): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

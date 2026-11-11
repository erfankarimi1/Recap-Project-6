import { THEME_STORAGE_KEY, getInitialTheme, saveTheme } from "./theme";

// matchMedia does not exist in the test environment
function mockOsTheme(prefersDark: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query === "(prefers-color-scheme: dark)" ? prefersDark : false,
    }))
  );
}

afterEach(() => vi.unstubAllGlobals());

test("uses the operating system setting when nothing is saved", () => {
  mockOsTheme(true);
  expect(getInitialTheme()).toBe("dark");

  mockOsTheme(false);
  expect(getInitialTheme()).toBe("light");
});

test("saves the theme and loads it again", () => {
  mockOsTheme(true);

  saveTheme("light");

  expect(getInitialTheme()).toBe("light");
});

test("ignores an invalid saved value", () => {
  mockOsTheme(false);
  localStorage.setItem(THEME_STORAGE_KEY, "blue");

  expect(getInitialTheme()).toBe("light");
});

test("falls back to dark without matchMedia", () => {
  expect(window.matchMedia).toBeUndefined();

  expect(getInitialTheme()).toBe("dark");
});

export {};

// Vitest turns CSS imports into empty strings, so read the file with Node.
// The module name is a variable because the project has no Node type package.
const nodeFs = "node:fs";
const { readFileSync } = await import(/* @vite-ignore */ nodeFs);
const css: string = readFileSync("src/styles.css", "utf8");

const TOKENS = [
  "--color-background",
  "--color-surface",
  "--color-text",
  "--color-text-muted",
  "--color-accent",
  "--color-accent-contrast",
  "--color-border",
  "--color-hover",
  "--color-focus",
  "--color-favorite",
];

test("defines all color tokens", () => {
  const root = /:root\s*{[^}]*}/.exec(css)?.[0] ?? "";

  for (const token of TOKENS) {
    expect(root).toContain(`${token}:`);
  }
});

test("has no color values outside :root", () => {
  const outsideRoot = css.replace(/:root\s*{[^}]*}/, "");
  const colorValue =
    /#[0-9a-f]{3,8}\b|\b(?:rgb|hsl)a?\(|\b(?:white|black|red|gray|grey)\b/i;

  expect(outsideRoot).not.toMatch(colorValue);
});

function tokenColor(name: string) {
  const root = /:root\s*{[^}]*}/.exec(css)?.[0] ?? "";
  const hex = new RegExp(`${name}:\\s*#([0-9a-f]{6})`, "i").exec(root)?.[1];
  if (!hex) throw new Error(`${name} must be a 6-digit hex color`);
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
}

function luminance(name: string) {
  const [r, g, b] = tokenColor(name).map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(foreground: string, background: string) {
  const [light, dark] = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a
  );
  return (light + 0.05) / (dark + 0.05);
}

test("token pairs meet AA contrast", () => {
  const textPairs = [
    ["--color-text", "--color-background"],
    ["--color-text", "--color-surface"],
    ["--color-text-muted", "--color-background"],
    ["--color-text-muted", "--color-surface"],
    ["--color-accent", "--color-background"],
    ["--color-accent-contrast", "--color-accent"],
  ];

  for (const [foreground, background] of textPairs) {
    expect(
      contrast(foreground, background),
      `${foreground} on ${background}`
    ).toBeGreaterThanOrEqual(4.5);
  }
});

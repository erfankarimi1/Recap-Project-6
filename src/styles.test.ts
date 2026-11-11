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

test("has no color values outside the token blocks", () => {
  // The token blocks are :root (dark) and :root[data-theme="light"]
  const outsideTokens = css.replace(
    /:root(?:\[data-theme="light"\])?\s*{[^}]*}/g,
    ""
  );
  const colorValue =
    /#[0-9a-f]{3,8}\b|\b(?:rgb|hsl)a?\(|\b(?:white|black|red|gray|grey)\b/i;

  expect(outsideTokens).not.toMatch(colorValue);
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

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// The declarations of the rule whose (last) selector is `selector`
function ruleBody(selector: string, source = css) {
  const match = new RegExp(`${escapeRegExp(selector)}\\s*{([^}]*)}`).exec(
    source
  );
  if (!match) throw new Error(`No rule found for ${selector}`);
  return match[1];
}

test("pages and components take their colors from the tokens", () => {
  const selectors = [
    "body",
    "a",
    "nav",
    "nav a",
    "nav a.active",
    ".favorite-button",
    ".palette li",
    ".comments li",
    ".comment-form textarea",
    ".comment-form button",
    ".slideshow-controls button",
    ".artwork-info p",
  ];

  for (const selector of selectors) {
    expect(ruleBody(selector), selector).toContain("var(--color-");
  }
});

test("uses a serif title and a sans-serif body font", () => {
  expect(ruleBody(".artwork-info h2")).toContain("var(--font-serif)");
  expect(ruleBody("body")).toContain("var(--font-sans)");
  expect(ruleBody(":root")).toMatch(/--font-serif:[^;]*\bserif\b/);
  expect(ruleBody(":root")).toMatch(/--font-sans:[^;]*\bsans-serif\b/);
});

test("stacks the Spotlight on small screens and uses two columns on desktop", () => {
  const desktop = /@media \(min-width: 64rem\)\s*{([\s\S]*?\n})\n/.exec(
    css
  )?.[1];

  expect(desktop).toBeDefined();
  expect(ruleBody(".spotlight")).not.toContain("grid-template-columns");
  expect(ruleBody(".spotlight", desktop)).toContain("grid-template-columns");
});

test("lays the gallery out as a grid that fills the available width", () => {
  expect(ruleBody(".art-list")).toContain("repeat(auto-fill");
});

const LIGHT_SELECTOR = ':root[data-theme="light"]';

function colorTokens(body: string) {
  const tokens = new Map<string, string>();
  for (const match of body.matchAll(/(--color-[\w-]+):([^;]+);/g)) {
    tokens.set(match[1], match[2].trim());
  }
  return tokens;
}

test("defines every color token for both modes", () => {
  const dark = [...colorTokens(ruleBody(":root")).keys()].sort();
  const light = [...colorTokens(ruleBody(LIGHT_SELECTOR)).keys()].sort();

  expect(dark.length).toBeGreaterThan(0);
  expect(light).toEqual(dark);
});

function relativeLuminance(hex: string) {
  const [r, g, b] = [1, 3, 5]
    .map((start) => parseInt(hex.slice(start, start + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastBetween(first: string, second: string) {
  const [light, dark] = [
    relativeLuminance(first),
    relativeLuminance(second),
  ].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

test("token pairs meet AA contrast in light mode", () => {
  const tokens = colorTokens(ruleBody(LIGHT_SELECTOR));
  const color = (name: string) => {
    const value = tokens.get(name);
    if (!value?.match(/^#[0-9a-f]{6}$/i)) {
      throw new Error(`${name} must be a 6-digit hex color in light mode`);
    }
    return value;
  };
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
      contrastBetween(color(foreground), color(background)),
      `${foreground} on ${background}`
    ).toBeGreaterThanOrEqual(4.5);
  }
});

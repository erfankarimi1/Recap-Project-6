export {};

// Same way as styles.test.ts: the project has no Node type package
const nodeFs = "node:fs";
const { existsSync, readFileSync, statSync } = await import(
  /* @vite-ignore */ nodeFs
);

test("has the room photo in the public folder", () => {
  expect(existsSync("public/room.jpg")).toBe(true);

  // A real JPEG starts with these three bytes, and a photo for a background
  // should stay small
  const bytes: Uint8Array = readFileSync("public/room.jpg");
  expect([...bytes.slice(0, 3)]).toEqual([0xff, 0xd8, 0xff]);
  expect(statSync("public/room.jpg").size).toBeLessThan(400 * 1024);
});

test("credits the photographer and the license", () => {
  expect(existsSync("docs/credits.md")).toBe(true);

  const credits: string = readFileSync("docs/credits.md", "utf8");
  expect(credits).toContain("public/room.jpg");
  expect(credits).toContain("Costa Live");
  expect(credits).toContain("https://unsplash.com/license");
  expect(credits).toContain(
    "https://unsplash.com/photos/a-modern-grey-sectional-sofa-in-an-empty-room-enOom2p5a1U"
  );
});

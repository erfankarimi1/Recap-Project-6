import { getRandomArtPiece } from "./utils";

const pieces = [
  { slug: "a", artist: "A", name: "A", imageSource: "a.jpg" },
  { slug: "b", artist: "B", name: "B", imageSource: "b.jpg" },
  { slug: "c", artist: "C", name: "C", imageSource: "c.jpg" },
];

afterEach(() => vi.restoreAllMocks());

test("returns the art piece at the random index", () => {
  vi.spyOn(Math, "random").mockReturnValue(0);
  expect(getRandomArtPiece(pieces)).toBe(pieces[0]);

  vi.spyOn(Math, "random").mockReturnValue(0.99);
  expect(getRandomArtPiece(pieces)).toBe(pieces[2]);
});

test("returns undefined for an empty list", () => {
  expect(getRandomArtPiece([])).toBeUndefined();
});

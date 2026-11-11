import { getRandomArtPiece } from "./utils";

const pieces = [
  {
    slug: "a",
    artist: "A",
    name: "A",
    imageSource: "a.jpg",
    year: "1",
    genre: "G",
    colors: ["#000000", "#ffffff"],
    dimensions: { height: 100, width: 200, type: "jpg" },
  },
  {
    slug: "b",
    artist: "B",
    name: "B",
    imageSource: "b.jpg",
    year: "2",
    genre: "G",
    colors: ["#000000", "#ffffff"],
    dimensions: { height: 100, width: 200, type: "jpg" },
  },
  {
    slug: "c",
    artist: "C",
    name: "C",
    imageSource: "c.jpg",
    year: "3",
    genre: "G",
    colors: ["#000000", "#ffffff"],
    dimensions: { height: 100, width: 200, type: "jpg" },
  },
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

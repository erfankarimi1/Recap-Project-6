import {
  EMPTY_FILTERS,
  filterArtPieces,
  getFilterOptions,
  getRandomArtPiece,
} from "./utils";

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

const catalog = [
  {
    slug: "sunday",
    artist: "Georges Seurat",
    name: "A Sunday on La Grande Jatte",
    imageSource: "sunday.jpg",
    year: "1884-86",
    genre: "Pointillist Painting",
    colors: ["#111111", "#222222", "#AbCdEf"],
    dimensions: { height: 100, width: 200, type: "jpg" },
  },
  {
    slug: "wheat",
    artist: "Vincent van Gogh",
    name: "Wheat Field with Cypresses",
    imageSource: "wheat.jpg",
    year: "1889",
    genre: "Landscape Painting",
    colors: ["#333333"],
    dimensions: { height: 100, width: 200, type: "jpg" },
  },
  {
    slug: "harvesters",
    artist: "Pieter Bruegel the Elder",
    name: "The Harvesters",
    imageSource: "harvesters.jpg",
    year: "1565",
    genre: "Landscape Painting",
    colors: ["#222222", "#444444"],
    dimensions: { height: 100, width: 200, type: "jpg" },
  },
];

function slugsOf(filters: Partial<typeof EMPTY_FILTERS>) {
  return filterArtPieces(catalog, { ...EMPTY_FILTERS, ...filters }).map(
    (piece) => piece.slug
  );
}

test("filters by text in name, artist, year or genre, ignoring case", () => {
  expect(slugsOf({ query: "SUNDAY" })).toEqual(["sunday"]);
  expect(slugsOf({ query: "van gogh" })).toEqual(["wheat"]);
  expect(slugsOf({ query: "1565" })).toEqual(["harvesters"]);
  expect(slugsOf({ query: "pointillist" })).toEqual(["sunday"]);
  expect(slugsOf({ query: "landscape" })).toEqual(["wheat", "harvesters"]);
  expect(slugsOf({ query: "nothing like this" })).toEqual([]);
  expect(slugsOf({ query: "" })).toEqual(["sunday", "wheat", "harvesters"]);
});

test("filters by artist, year and type", () => {
  expect(slugsOf({ artist: "Vincent van Gogh" })).toEqual(["wheat"]);
  expect(slugsOf({ year: "1565" })).toEqual(["harvesters"]);
  expect(slugsOf({ type: "Landscape Painting" })).toEqual([
    "wheat",
    "harvesters",
  ]);

  // Only exact matches stay, so a part of a value is not enough
  expect(slugsOf({ artist: "Vincent" })).toEqual([]);
  expect(slugsOf({ year: "156" })).toEqual([]);
  expect(slugsOf({ type: "Landscape" })).toEqual([]);
});

test("filters by a color of the palette", () => {
  expect(slugsOf({ color: "#222222" })).toEqual(["sunday", "harvesters"]);
  expect(slugsOf({ color: "#333333" })).toEqual(["wheat"]);
  expect(slugsOf({ color: "#999999" })).toEqual([]);

  // Hex codes are compared ignoring case
  expect(slugsOf({ color: "#abcdef" })).toEqual(["sunday"]);
  expect(slugsOf({ color: "#ABCDEF" })).toEqual(["sunday"]);
});

test("requires every filter to match", () => {
  expect(
    slugsOf({ artist: "Vincent van Gogh", type: "Landscape Painting" })
  ).toEqual(["wheat"]);
  expect(slugsOf({ type: "Landscape Painting", year: "1565" })).toEqual([
    "harvesters",
  ]);
  expect(slugsOf({ query: "landscape", color: "#222222" })).toEqual([
    "harvesters",
  ]);

  // Each of these values matches some piece, but never the same one
  expect(
    slugsOf({ artist: "Georges Seurat", type: "Landscape Painting" })
  ).toEqual([]);

  const all = {
    query: "harvest",
    artist: "Pieter Bruegel the Elder",
    year: "1565",
    type: "Landscape Painting",
    color: "#444444",
  };
  expect(slugsOf(all)).toEqual(["harvesters"]);
  expect(slugsOf({ ...all, color: "#111111" })).toEqual([]);
});

test("lists each artist, year, type and color once, sorted", () => {
  // A second piece by the same artist, with the same year, type and colors
  const duplicate = { ...catalog[1], slug: "wheat-again" };
  const options = getFilterOptions([...catalog, duplicate]);

  expect(options.artists).toEqual([
    "Georges Seurat",
    "Pieter Bruegel the Elder",
    "Vincent van Gogh",
  ]);
  expect(options.years).toEqual(["1565", "1884-86", "1889"]);
  expect(options.types).toEqual(["Landscape Painting", "Pointillist Painting"]);
  expect(options.colors).toEqual([
    "#111111",
    "#222222",
    "#333333",
    "#444444",
    "#AbCdEf",
  ]);
  expect(getFilterOptions([])).toEqual({
    artists: [],
    years: [],
    types: [],
    colors: [],
  });
});

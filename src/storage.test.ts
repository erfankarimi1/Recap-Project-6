import { STORAGE_KEY, loadArtPiecesInfo, saveArtPiecesInfo } from "./storage";
import type { ArtPieceInfo } from "./types";

const info: ArtPieceInfo[] = [
  {
    slug: "a",
    isFavorite: true,
    comments: [{ text: "Lovely", date: "2026-11-11T10:00:00.000Z" }],
  },
  { slug: "b", isFavorite: false, comments: [] },
];

test("saves the info and loads it again", () => {
  saveArtPiecesInfo(info);

  expect(loadArtPiecesInfo()).toEqual(info);
});

test("returns an empty list when nothing is saved", () => {
  expect(loadArtPiecesInfo()).toEqual([]);
});

test("returns an empty list when the saved data is not valid", () => {
  localStorage.setItem(STORAGE_KEY, "this is not json");
  expect(loadArtPiecesInfo()).toEqual([]);

  localStorage.setItem(STORAGE_KEY, JSON.stringify({ slug: "a" }));
  expect(loadArtPiecesInfo()).toEqual([]);
});

import type { ArtFilters, ArtPiece } from "./types";

export function getRandomArtPiece(pieces: ArtPiece[]): ArtPiece | undefined {
  if (pieces.length === 0) return undefined;
  // Not security-sensitive: only picks a highlight to display
  // eslint-disable-next-line sonarjs/pseudo-random
  return pieces[Math.floor(Math.random() * pieces.length)];
}

export const EMPTY_FILTERS: ArtFilters = {
  query: "",
  artist: "",
  year: "",
  type: "",
  color: "",
};

export function filterArtPieces(
  pieces: ArtPiece[],
  filters: ArtFilters
): ArtPiece[] {
  const query = filters.query.toLowerCase();

  return pieces.filter(
    (piece) =>
      [piece.name, piece.artist, piece.year, piece.genre].some((text) =>
        text.toLowerCase().includes(query)
      ) &&
      (filters.artist === "" || piece.artist === filters.artist) &&
      (filters.year === "" || piece.year === filters.year) &&
      (filters.type === "" || piece.genre === filters.type) &&
      (filters.color === "" ||
        piece.colors.some(
          (color) => color.toLowerCase() === filters.color.toLowerCase()
        ))
  );
}

// Each value once, in alphabetical order. Hex colors are compared ignoring
// case, and keep the way they are written in the data.
function uniqueSorted(values: string[]): string[] {
  const seen = new Map<string, string>();
  for (const value of values) {
    const key = value.toLowerCase();
    if (!seen.has(key)) seen.set(key, value);
  }
  return [...seen.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value);
}

// The values of the filters, built from the art pieces
export function getFilterOptions(pieces: ArtPiece[]) {
  return {
    artists: uniqueSorted(pieces.map((piece) => piece.artist)),
    years: uniqueSorted(pieces.map((piece) => piece.year)),
    types: uniqueSorted(pieces.map((piece) => piece.genre)),
    colors: uniqueSorted(pieces.flatMap((piece) => piece.colors)),
  };
}

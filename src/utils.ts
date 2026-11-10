import type { ArtPiece } from "./types";

export function getRandomArtPiece(pieces: ArtPiece[]): ArtPiece | undefined {
  if (pieces.length === 0) return undefined;
  // Not security-sensitive: only picks a highlight to display
  // eslint-disable-next-line sonarjs/pseudo-random
  return pieces[Math.floor(Math.random() * pieces.length)];
}

import type { ArtPiece } from "../types";

type ArtworkInfoProps = {
  piece: ArtPiece;
};

// A museum label: serif title, then the details in a clean sans-serif
export default function ArtworkInfo({ piece }: ArtworkInfoProps) {
  return (
    <div className="artwork-info">
      <h2>{piece.name}</h2>
      <p className="artwork-artist">{piece.artist}</p>
      <p>{piece.year}</p>
      <p>{piece.genre}</p>
    </div>
  );
}

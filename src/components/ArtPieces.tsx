import type { ArtPiece } from "../types";
import ArtPiecePreview from "./ArtPiecePreview";

type ArtPiecesProps = {
  pieces: ArtPiece[];
  isFavorite: (slug: string) => boolean;
  onToggleFavorite: (slug: string) => void;
};

export default function ArtPieces({
  pieces,
  isFavorite,
  onToggleFavorite,
}: ArtPiecesProps) {
  return (
    <ul>
      {pieces.map((piece) => (
        <li key={piece.slug}>
          <ArtPiecePreview
            piece={piece}
            isFavorite={isFavorite(piece.slug)}
            onToggleFavorite={onToggleFavorite}
          />
        </li>
      ))}
    </ul>
  );
}

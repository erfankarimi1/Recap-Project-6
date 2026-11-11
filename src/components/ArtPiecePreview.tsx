import { Link } from "react-router";

import type { ArtPiece } from "../types";
import FavoriteButton from "./FavoriteButton";

type ArtPiecePreviewProps = {
  piece: ArtPiece;
  isFavorite: boolean;
  onToggleFavorite: (slug: string) => void;
};

export default function ArtPiecePreview({
  piece,
  isFavorite,
  onToggleFavorite,
}: ArtPiecePreviewProps) {
  return (
    <div className="art-piece">
      <Link to={`/art-pieces/${piece.slug}`}>
        <figure>
          <img src={piece.imageSource} alt={piece.name} width={300} />
          <figcaption>
            <strong>{piece.name}</strong>
            <br />
            {piece.artist}
          </figcaption>
        </figure>
      </Link>
      <FavoriteButton
        name={piece.name}
        isFavorite={isFavorite}
        onToggle={() => onToggleFavorite(piece.slug)}
      />
    </div>
  );
}

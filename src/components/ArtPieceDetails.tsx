import { Link, useParams } from "react-router";

import type { ArtPiece } from "../types";
import FavoriteButton from "./FavoriteButton";

type ArtPieceDetailsProps = {
  pieces: ArtPiece[];
  isFavorite: (slug: string) => boolean;
  onToggleFavorite: (slug: string) => void;
};

export default function ArtPieceDetails({
  pieces,
  isFavorite,
  onToggleFavorite,
}: ArtPieceDetailsProps) {
  const { slug } = useParams();
  const piece = pieces.find((item) => item.slug === slug);

  if (!piece) return <p>Art piece not found</p>;

  return (
    <article className="art-piece details">
      <Link to="/art-pieces">Back</Link>
      <img src={piece.imageSource} alt={piece.name} />
      <FavoriteButton
        name={piece.name}
        isFavorite={isFavorite(piece.slug)}
        onToggle={() => onToggleFavorite(piece.slug)}
      />
      <h2>{piece.name}</h2>
      <p>{piece.artist}</p>
      <p>{piece.year}</p>
      <p>{piece.genre}</p>
    </article>
  );
}

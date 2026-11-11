import { Link, useParams } from "react-router";

import type { ArtPiece } from "../types";

type ArtPieceDetailsProps = {
  pieces: ArtPiece[];
};

export default function ArtPieceDetails({ pieces }: ArtPieceDetailsProps) {
  const { slug } = useParams();
  const piece = pieces.find((item) => item.slug === slug);

  if (!piece) return <p>Art piece not found</p>;

  return (
    <article className="details">
      <Link to="/art-pieces">Back</Link>
      <img src={piece.imageSource} alt={piece.name} />
      <h2>{piece.name}</h2>
      <p>{piece.artist}</p>
      <p>{piece.year}</p>
      <p>{piece.genre}</p>
    </article>
  );
}

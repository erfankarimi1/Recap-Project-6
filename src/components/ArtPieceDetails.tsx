import { Link, useParams } from "react-router";

import type { ArtPiece, ArtPieceComment } from "../types";
import ColorPalette from "./ColorPalette";
import CommentForm from "./CommentForm";
import Comments from "./Comments";
import FavoriteButton from "./FavoriteButton";

type ArtPieceDetailsProps = {
  pieces: ArtPiece[];
  isFavorite: (slug: string) => boolean;
  onToggleFavorite: (slug: string) => void;
  getComments: (slug: string) => ArtPieceComment[];
  onAddComment: (slug: string, text: string) => void;
};

export default function ArtPieceDetails({
  pieces,
  isFavorite,
  onToggleFavorite,
  getComments,
  onAddComment,
}: ArtPieceDetailsProps) {
  const { slug } = useParams();
  const piece = pieces.find((item) => item.slug === slug);

  if (!piece) return <p>Art piece not found</p>;

  return (
    <article className="art-piece details">
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
      <ColorPalette colors={piece.colors} />
      <Link to={`/art-pieces/${piece.slug}/room`}>View in room</Link>
      <Comments comments={getComments(piece.slug)} />
      <CommentForm onSubmit={(text) => onAddComment(piece.slug, text)} />
    </article>
  );
}

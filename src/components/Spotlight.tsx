import { useState } from "react";

import type { ArtPiece } from "../types";
import { getRandomArtPiece } from "../utils";
import FavoriteButton from "./FavoriteButton";

type SpotlightProps = {
  pieces: ArtPiece[];
  isFavorite: (slug: string) => boolean;
  onToggleFavorite: (slug: string) => void;
};

export default function Spotlight({
  pieces,
  isFavorite,
  onToggleFavorite,
}: SpotlightProps) {
  // The lazy initializer picks the art piece once, not on every re-render
  const [spotlight] = useState(() => getRandomArtPiece(pieces));

  if (!spotlight) return <p>No art pieces to show.</p>;

  return (
    <div className="art-piece spotlight">
      <figure>
        <img src={spotlight.imageSource} alt={spotlight.name} width={400} />
        <figcaption>{spotlight.artist}</figcaption>
      </figure>
      <FavoriteButton
        name={spotlight.name}
        isFavorite={isFavorite(spotlight.slug)}
        onToggle={() => onToggleFavorite(spotlight.slug)}
      />
    </div>
  );
}

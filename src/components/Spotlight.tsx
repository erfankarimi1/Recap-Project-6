import { useState } from "react";

import type { ArtPiece } from "../types";
import { getRandomArtPiece } from "../utils";

type SpotlightProps = {
  pieces: ArtPiece[];
};

export default function Spotlight({ pieces }: SpotlightProps) {
  // The lazy initializer picks the art piece once, not on every re-render
  const [spotlight] = useState(() => getRandomArtPiece(pieces));

  if (!spotlight) return <p>No art pieces to show.</p>;

  return (
    <figure>
      <img src={spotlight.imageSource} alt={spotlight.name} width={400} />
      <figcaption>{spotlight.artist}</figcaption>
    </figure>
  );
}

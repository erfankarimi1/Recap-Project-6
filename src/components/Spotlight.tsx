import { useEffect, useRef, useState } from "react";

import type { ArtPiece } from "../types";
import { getRandomArtPiece } from "../utils";
import ArtworkInfo from "./ArtworkInfo";
import FavoriteButton from "./FavoriteButton";
import SlideshowControls from "./SlideshowControls";

const AUTOPLAY_INTERVAL_MS = 5000;
const SWIPE_THRESHOLD_PX = 50;

// jsdom has no matchMedia, so guard the call
function prefersReducedMotion() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

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
  // The lazy initializer picks the first slide once, not on every re-render
  const [index, setIndex] = useState(() =>
    pieces.indexOf(getRandomArtPiece(pieces) as ArtPiece)
  );

  // Hovering or focusing the slideshow pauses the autoplay
  const [isInteracting, setIsInteracting] = useState(false);

  const [reducedMotion] = useState(prefersReducedMotion);
  const [isPlaying, setIsPlaying] = useState(!reducedMotion);

  const count = pieces.length;
  useEffect(() => {
    if (!isPlaying || isInteracting || count < 2) return;
    const timer = setInterval(
      () => setIndex((current) => (current + 1) % count),
      AUTOPLAY_INTERVAL_MS
    );
    return () => clearInterval(timer);
  }, [isPlaying, isInteracting, count]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") setIndex((i) => (i + 1) % count);
      if (event.key === "ArrowLeft") setIndex((i) => (i - 1 + count) % count);
      // A focused button already handles Space itself by being clicked
      const isButton = event.target instanceof HTMLButtonElement;
      if (event.key === " " && !isButton) setIsPlaying((playing) => !playing);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [count]);

  const touchStartX = useRef(0);

  // Loading the next image early means a transition never shows a blank frame
  const nextSource = pieces[(index + 1) % count]?.imageSource;
  useEffect(() => {
    if (nextSource) new Image().src = nextSource;
  }, [nextSource]);

  const spotlight = pieces[index];
  if (!spotlight) return <p>No art pieces to show.</p>;

  function showSlide(offset: number) {
    setIndex((current) => (current + offset + count) % count);
  }

  function handleTouchEnd(endX: number) {
    const distance = endX - touchStartX.current;
    if (Math.abs(distance) >= SWIPE_THRESHOLD_PX)
      showSlide(distance < 0 ? 1 : -1);
  }

  return (
    <section
      className={reducedMotion ? "spotlight reduced-motion" : "spotlight"}
      aria-label="Spotlight slideshow"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onFocus={() => setIsInteracting(true)}
      onBlur={() => setIsInteracting(false)}
      onTouchStart={(event) => {
        touchStartX.current = event.changedTouches[0].clientX;
      }}
      onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0].clientX)}
    >
      <div className="art-piece">
        <figure>
          <img
            key={spotlight.slug}
            src={spotlight.imageSource}
            alt={spotlight.name}
            width={400}
          />
        </figure>
        <FavoriteButton
          name={spotlight.name}
          isFavorite={isFavorite(spotlight.slug)}
          onToggle={() => onToggleFavorite(spotlight.slug)}
        />
      </div>
      <ArtworkInfo key={spotlight.slug} piece={spotlight} />
      <SlideshowControls
        names={pieces.map((piece) => piece.name)}
        currentIndex={index}
        onSelect={setIndex}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying((playing) => !playing)}
        onPrevious={() => showSlide(-1)}
        onNext={() => showSlide(1)}
      />
    </section>
  );
}

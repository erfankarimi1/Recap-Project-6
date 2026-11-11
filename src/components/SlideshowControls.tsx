type SlideshowControlsProps = {
  names: string[];
  currentIndex: number;
  onSelect: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

export default function SlideshowControls({
  names,
  currentIndex,
  onSelect,
  isPlaying,
  onTogglePlay,
  onPrevious,
  onNext,
}: SlideshowControlsProps) {
  return (
    <div className="slideshow-controls">
      <div className="slideshow-dots">
        {names.map((name, index) => (
          <button
            key={name}
            type="button"
            className="slideshow-dot"
            aria-label={`Show ${name}`}
            aria-current={index === currentIndex ? "true" : undefined}
            onClick={() => onSelect(index)}
          />
        ))}
      </div>
      <button type="button" onClick={onPrevious}>
        Previous
      </button>
      <button type="button" onClick={onTogglePlay}>
        {isPlaying ? "Pause" : "Play"}
      </button>
      <button type="button" onClick={onNext}>
        Next
      </button>
    </div>
  );
}

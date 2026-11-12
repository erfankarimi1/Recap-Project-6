import type { ArtFilters, ArtPiece } from "../types";
import SearchFilterBar from "./SearchFilterBar";

type HeaderProps = {
  pieces: ArtPiece[];
  filters: ArtFilters;
  onChange: (filters: ArtFilters) => void;
  onClear: () => void;
};

export default function Header({
  pieces,
  filters,
  onChange,
  onClear,
}: HeaderProps) {
  return (
    <header className="site-header">
      <h1>ArtGallery</h1>
      <SearchFilterBar
        pieces={pieces}
        filters={filters}
        onChange={onChange}
        onClear={onClear}
      />
    </header>
  );
}

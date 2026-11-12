import type { ArtFilters, ArtPiece } from "../types";
import { getFilterOptions } from "../utils";

type SearchFilterBarProps = {
  pieces: ArtPiece[];
  filters: ArtFilters;
  onChange: (filters: ArtFilters) => void;
  onClear: () => void;
};

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
}: SelectFieldProps) {
  return (
    <div className="filter-field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function SearchFilterBar({
  pieces,
  filters,
  onChange,
  onClear,
}: SearchFilterBarProps) {
  const options = getFilterOptions(pieces);

  return (
    <div className="filter-bar">
      <div className="filter-field">
        <label htmlFor="art-search">Search</label>
        <input
          id="art-search"
          type="search"
          value={filters.query}
          onChange={(event) =>
            onChange({ ...filters, query: event.target.value })
          }
        />
      </div>

      <SelectField
        id="art-artist"
        label="Artist"
        value={filters.artist}
        options={options.artists}
        onChange={(artist) => onChange({ ...filters, artist })}
      />
      <SelectField
        id="art-year"
        label="Year"
        value={filters.year}
        options={options.years}
        onChange={(year) => onChange({ ...filters, year })}
      />
      <SelectField
        id="art-type"
        label="Type"
        value={filters.type}
        options={options.types}
        onChange={(type) => onChange({ ...filters, type })}
      />

      <div role="group" aria-label="Color" className="filter-colors">
        {options.colors.map((color) => {
          const isChosen = color.toLowerCase() === filters.color.toLowerCase();
          return (
            <button
              key={color}
              type="button"
              className="filter-swatch"
              aria-label={color}
              aria-pressed={isChosen}
              style={{ backgroundColor: color }}
              onClick={() =>
                onChange({ ...filters, color: isChosen ? "" : color })
              }
            />
          );
        })}
      </div>

      <button type="button" className="filter-clear" onClick={onClear}>
        Clear filters
      </button>
    </div>
  );
}

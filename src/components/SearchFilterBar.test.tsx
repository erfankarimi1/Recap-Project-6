import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import type { ArtFilters, ArtPiece } from "../types";
import { EMPTY_FILTERS } from "../utils";
import SearchFilterBar from "./SearchFilterBar";

function makePiece(slug: string, overrides: Partial<ArtPiece> = {}): ArtPiece {
  return {
    slug,
    artist: "Artist A",
    name: `Piece ${slug}`,
    imageSource: `${slug}.jpg`,
    year: "1900",
    genre: "Landscape Painting",
    colors: ["#111111"],
    dimensions: { height: 100, width: 200, type: "jpg" },
    ...overrides,
  };
}

// Two pieces by the same artist, so duplicates must be listed once
const pieces = [
  makePiece("a", { colors: ["#111111", "#AA00AA"] }),
  makePiece("b", { colors: ["#111111", "#222222"] }),
  makePiece("c", {
    artist: "Artist C",
    year: "1950",
    genre: "Portrait Drawing",
    colors: ["#333333"],
  }),
];

function renderBar({
  filters = EMPTY_FILTERS,
  onChange = () => undefined,
  onClear = () => undefined,
}: {
  filters?: ArtFilters;
  onChange?: (filters: ArtFilters) => void;
  onClear?: () => void;
} = {}) {
  render(
    <SearchFilterBar
      pieces={pieces}
      filters={filters}
      onChange={onChange}
      onClear={onClear}
    />
  );
}

test("has a search field", () => {
  renderBar();

  expect(screen.getByRole("searchbox", { name: "Search" })).toBeInTheDocument();
});

test("has an artist, year and type filter and a color filter", () => {
  renderBar();

  for (const name of ["Artist", "Year", "Type"]) {
    expect(screen.getByRole("combobox", { name })).toBeInTheDocument();
  }
  expect(screen.getByRole("group", { name: "Color" })).toBeInTheDocument();
});

function optionsOf(name: string) {
  return within(screen.getByRole("combobox", { name }))
    .getAllByRole("option")
    .map((option) => option.textContent);
}

test("lists each artist, year and type once", () => {
  renderBar();

  expect(optionsOf("Artist")).toEqual(["All", "Artist A", "Artist C"]);
  expect(optionsOf("Year")).toEqual(["All", "1900", "1950"]);
  expect(optionsOf("Type")).toEqual([
    "All",
    "Landscape Painting",
    "Portrait Drawing",
  ]);
});

test("shows the chosen filters", () => {
  renderBar({
    filters: { ...EMPTY_FILTERS, artist: "Artist C", year: "1950" },
  });

  expect(screen.getByRole("combobox", { name: "Artist" })).toHaveValue(
    "Artist C"
  );
  expect(screen.getByRole("combobox", { name: "Year" })).toHaveValue("1950");
  expect(screen.getByRole("combobox", { name: "Type" })).toHaveValue("");
});

test("shows a swatch for every color in the data", () => {
  renderBar({ filters: { ...EMPTY_FILTERS, color: "#aa00aa" } });

  const group = screen.getByRole("group", { name: "Color" });
  const swatches = within(group).getAllByRole("button");

  // #111111 is in two pieces, and is listed once
  expect(swatches.map((swatch) => swatch.getAttribute("aria-label"))).toEqual([
    "#111111",
    "#222222",
    "#333333",
    "#AA00AA",
  ]);
  expect(swatches[1]).toHaveStyle({ backgroundColor: "#222222" });

  // Only the chosen color is pressed, whatever the case of its hex code
  expect(swatches.map((swatch) => swatch.getAttribute("aria-pressed"))).toEqual(
    ["false", "false", "false", "true"]
  );
});

test("clears the search and all filters", async () => {
  const user = userEvent.setup();
  const onClear = vi.fn();
  renderBar({ filters: { ...EMPTY_FILTERS, query: "sun" }, onClear });

  await user.click(screen.getByRole("button", { name: "Clear filters" }));

  expect(onClear).toHaveBeenCalledTimes(1);
});

test("reports the typed search and the chosen filters", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderBar({ onChange });

  await user.type(screen.getByRole("searchbox", { name: "Search" }), "s");
  expect(onChange).toHaveBeenLastCalledWith({ ...EMPTY_FILTERS, query: "s" });

  await user.selectOptions(
    screen.getByRole("combobox", { name: "Artist" }),
    "Artist C"
  );
  expect(onChange).toHaveBeenLastCalledWith({
    ...EMPTY_FILTERS,
    artist: "Artist C",
  });

  await user.selectOptions(
    screen.getByRole("combobox", { name: "Year" }),
    "1950"
  );
  expect(onChange).toHaveBeenLastCalledWith({ ...EMPTY_FILTERS, year: "1950" });

  await user.selectOptions(
    screen.getByRole("combobox", { name: "Type" }),
    "Portrait Drawing"
  );
  expect(onChange).toHaveBeenLastCalledWith({
    ...EMPTY_FILTERS,
    type: "Portrait Drawing",
  });
});

test("chooses a color with a swatch, and clears it with the same swatch", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  renderBar({ onChange });

  await user.click(screen.getByRole("button", { name: "#222222" }));
  expect(onChange).toHaveBeenLastCalledWith({
    ...EMPTY_FILTERS,
    color: "#222222",
  });
  cleanup();

  const onChangeAgain = vi.fn();
  renderBar({
    filters: { ...EMPTY_FILTERS, color: "#222222" },
    onChange: onChangeAgain,
  });
  await user.click(screen.getByRole("button", { name: "#222222" }));
  expect(onChangeAgain).toHaveBeenLastCalledWith({
    ...EMPTY_FILTERS,
    color: "",
  });
});

// Keeps the filters like App does, so a whole flow can be tried
function StatefulBar() {
  const [filters, setFilters] = useState<ArtFilters>(EMPTY_FILTERS);
  return (
    <SearchFilterBar
      pieces={pieces}
      filters={filters}
      onChange={setFilters}
      onClear={() => setFilters(EMPTY_FILTERS)}
    />
  );
}

test("can be used with the keyboard", async () => {
  const user = userEvent.setup();
  render(<StatefulBar />);

  // Tab reaches every control, in the order of the page
  await user.tab();
  const search = screen.getByRole("searchbox", { name: "Search" });
  expect(search).toHaveFocus();
  await user.keyboard("abc");
  expect(search).toHaveValue("abc");

  for (const name of ["Artist", "Year", "Type"]) {
    await user.tab();
    expect(screen.getByRole("combobox", { name })).toHaveFocus();
  }

  await user.tab();
  const firstSwatch = screen.getByRole("button", { name: "#111111" });
  expect(firstSwatch).toHaveFocus();
  await user.keyboard(" ");
  expect(firstSwatch).toHaveAttribute("aria-pressed", "true");
  await user.keyboard("{Enter}");
  expect(firstSwatch).toHaveAttribute("aria-pressed", "false");

  // Three more swatches, then the Clear button
  await user.tab();
  await user.tab();
  await user.tab();
  await user.tab();
  const clear = screen.getByRole("button", { name: "Clear filters" });
  expect(clear).toHaveFocus();
  await user.keyboard("{Enter}");
  expect(search).toHaveValue("");
});

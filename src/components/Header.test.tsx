import { render, screen, within } from "@testing-library/react";

import type { ArtPiece } from "../types";
import { EMPTY_FILTERS } from "../utils";
import Header from "./Header";

const pieces: ArtPiece[] = [
  {
    slug: "a",
    artist: "Artist A",
    name: "Piece A",
    imageSource: "a.jpg",
    year: "1900",
    genre: "Genre A",
    colors: ["#111111"],
    dimensions: { height: 100, width: 200, type: "jpg" },
  },
];

function renderHeader() {
  render(
    <Header
      pieces={pieces}
      filters={EMPTY_FILTERS}
      onChange={() => undefined}
      onClear={() => undefined}
    />
  );
}

test("shows the ArtGallery heading", () => {
  renderHeader();

  const header = screen.getByRole("banner");
  expect(
    within(header).getByRole("heading", { level: 1, name: "ArtGallery" })
  ).toBeInTheDocument();
});

test("contains the search and filter bar", () => {
  renderHeader();

  const header = screen.getByRole("banner");
  expect(
    within(header).getByRole("searchbox", { name: "Search" })
  ).toBeInTheDocument();
  expect(
    within(header).getByRole("combobox", { name: "Artist" })
  ).toBeInTheDocument();
  expect(
    within(header).getByRole("group", { name: "Color" })
  ).toBeInTheDocument();
  expect(
    within(header).getByRole("button", { name: "Clear filters" })
  ).toBeInTheDocument();
});

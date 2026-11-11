import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import type { ArtPiece } from "../types";
import ArtPieces from "./ArtPieces";

const pieces = [
  {
    slug: "a",
    artist: "Artist A",
    name: "Piece A",
    imageSource: "a.jpg",
    year: "1900",
    genre: "Genre A",
  },
  {
    slug: "b",
    artist: "Artist B",
    name: "Piece B",
    imageSource: "b.jpg",
    year: "1910",
    genre: "Genre B",
  },
];

function renderArtPieces(items: ArtPiece[]) {
  render(
    <MemoryRouter>
      <ArtPieces pieces={items} />
    </MemoryRouter>
  );
}

test("renders one list item per art piece", () => {
  renderArtPieces(pieces);

  expect(screen.getAllByRole("listitem")).toHaveLength(2);
  expect(screen.getByText("Piece A")).toBeInTheDocument();
  expect(screen.getByText("Piece B")).toBeInTheDocument();
});

test("renders an empty list without art pieces", () => {
  renderArtPieces([]);

  expect(screen.getByRole("list")).toBeEmptyDOMElement();
});

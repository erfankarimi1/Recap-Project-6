import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    colors: ["#000000", "#ffffff"],
  },
  {
    slug: "b",
    artist: "Artist B",
    name: "Piece B",
    imageSource: "b.jpg",
    year: "1910",
    genre: "Genre B",
    colors: ["#000000", "#ffffff"],
  },
];

function renderArtPieces(
  items: ArtPiece[],
  {
    isFavorite = () => false,
    onToggleFavorite = () => undefined,
  }: {
    isFavorite?: (slug: string) => boolean;
    onToggleFavorite?: (slug: string) => void;
  } = {}
) {
  render(
    <MemoryRouter>
      <ArtPieces
        pieces={items}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
      />
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

test("shows a favorite button for each art piece", () => {
  renderArtPieces(pieces);

  expect(
    screen.getByRole("button", { name: "Favorite Piece A" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Favorite Piece B" })
  ).toBeInTheDocument();
});

test("marks only the favorite pieces as pressed", () => {
  renderArtPieces(pieces, { isFavorite: (slug) => slug === "b" });

  expect(
    screen.getByRole("button", { name: "Favorite Piece A", pressed: false })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Favorite Piece B", pressed: true })
  ).toBeInTheDocument();
});

test("calls onToggleFavorite with the slug of the clicked piece", async () => {
  const user = userEvent.setup();
  const onToggleFavorite = vi.fn();
  renderArtPieces(pieces, { onToggleFavorite });

  await user.click(screen.getByRole("button", { name: "Favorite Piece B" }));

  expect(onToggleFavorite).toHaveBeenCalledTimes(1);
  expect(onToggleFavorite).toHaveBeenCalledWith("b");
});

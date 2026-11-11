import { render, screen } from "@testing-library/react";

import ArtworkInfo from "./ArtworkInfo";

const piece = {
  slug: "a",
  artist: "Artist A",
  name: "Piece A",
  imageSource: "a.jpg",
  year: "1900",
  genre: "Genre A",
  colors: ["#000000"],
  dimensions: { height: 100, width: 200, type: "jpg" },
};

test("shows the title as a heading", () => {
  render(<ArtworkInfo piece={piece} />);

  expect(screen.getByRole("heading", { name: "Piece A" })).toBeInTheDocument();
});

test("shows the artist, year and genre", () => {
  render(<ArtworkInfo piece={piece} />);

  expect(screen.getByText("Artist A")).toBeInTheDocument();
  expect(screen.getByText("1900")).toBeInTheDocument();
  expect(screen.getByText("Genre A")).toBeInTheDocument();
});

import { render, screen } from "@testing-library/react";

import ArtPieces from "./ArtPieces";

const pieces = [
  { slug: "a", artist: "Artist A", name: "Piece A", imageSource: "a.jpg" },
  { slug: "b", artist: "Artist B", name: "Piece B", imageSource: "b.jpg" },
];

test("renders one list item per art piece", () => {
  render(<ArtPieces pieces={pieces} />);

  expect(screen.getAllByRole("listitem")).toHaveLength(2);
  expect(screen.getByText("Piece A")).toBeInTheDocument();
  expect(screen.getByText("Piece B")).toBeInTheDocument();
});

test("renders an empty list without art pieces", () => {
  render(<ArtPieces pieces={[]} />);

  expect(screen.getByRole("list")).toBeEmptyDOMElement();
});

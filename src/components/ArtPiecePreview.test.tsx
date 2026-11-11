import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import ArtPiecePreview from "./ArtPiecePreview";

const piece = {
  slug: "wheat-field",
  artist: "Vincent van Gogh",
  name: "Wheat Field with Cypresses",
  imageSource: "https://example.com/wheat-field.jpg",
  year: "1889",
  genre: "Landscape Painting",
};

function renderPreview() {
  render(
    <MemoryRouter>
      <ArtPiecePreview piece={piece} />
    </MemoryRouter>
  );
}

test("shows the image, title and artist of the art piece", () => {
  renderPreview();

  expect(
    screen.getByRole("img", { name: "Wheat Field with Cypresses" })
  ).toHaveAttribute("src", "https://example.com/wheat-field.jpg");
  expect(screen.getByText("Wheat Field with Cypresses")).toBeInTheDocument();
  expect(screen.getByText("Vincent van Gogh")).toBeInTheDocument();
});

test("links to the details page of the art piece", () => {
  renderPreview();

  expect(
    screen.getByRole("link", { name: /Wheat Field with Cypresses/ })
  ).toHaveAttribute("href", "/art-pieces/wheat-field");
});

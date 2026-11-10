import { render, screen } from "@testing-library/react";

import ArtPiecePreview from "./ArtPiecePreview";

const piece = {
  slug: "wheat-field",
  artist: "Vincent van Gogh",
  name: "Wheat Field with Cypresses",
  imageSource: "https://example.com/wheat-field.jpg",
};

test("shows the image, title and artist of the art piece", () => {
  render(<ArtPiecePreview piece={piece} />);

  expect(
    screen.getByRole("img", { name: "Wheat Field with Cypresses" })
  ).toHaveAttribute("src", "https://example.com/wheat-field.jpg");
  expect(screen.getByText("Wheat Field with Cypresses")).toBeInTheDocument();
  expect(screen.getByText("Vincent van Gogh")).toBeInTheDocument();
});

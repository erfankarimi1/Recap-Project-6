import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";

import ArtPiecePreview from "./ArtPiecePreview";

const piece = {
  slug: "wheat-field",
  artist: "Vincent van Gogh",
  name: "Wheat Field with Cypresses",
  imageSource: "https://example.com/wheat-field.jpg",
  year: "1889",
  genre: "Landscape Painting",
  colors: ["#000000", "#ffffff"],
  dimensions: { height: 100, width: 200, type: "jpg" },
};

function renderPreview({
  isFavorite = false,
  onToggleFavorite = () => undefined,
}: {
  isFavorite?: boolean;
  onToggleFavorite?: (slug: string) => void;
} = {}) {
  return render(
    <MemoryRouter>
      <ArtPiecePreview
        piece={piece}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
      />
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

test("shows a favorite button that reflects the favorite status", () => {
  const notFavorite = renderPreview();
  expect(
    screen.getByRole("button", {
      name: "Favorite Wheat Field with Cypresses",
      pressed: false,
    })
  ).toBeInTheDocument();
  notFavorite.unmount();

  renderPreview({ isFavorite: true });
  expect(
    screen.getByRole("button", {
      name: "Favorite Wheat Field with Cypresses",
      pressed: true,
    })
  ).toBeInTheDocument();
});

test("calls onToggleFavorite with the slug when the favorite button is clicked", async () => {
  const user = userEvent.setup();
  const onToggleFavorite = vi.fn();
  renderPreview({ onToggleFavorite });

  await user.click(
    screen.getByRole("button", { name: "Favorite Wheat Field with Cypresses" })
  );

  expect(onToggleFavorite).toHaveBeenCalledTimes(1);
  expect(onToggleFavorite).toHaveBeenCalledWith("wheat-field");
});

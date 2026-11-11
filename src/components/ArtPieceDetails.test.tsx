import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";

import ArtPieceDetails from "./ArtPieceDetails";

const pieces = [
  {
    slug: "wheat-field",
    artist: "Vincent van Gogh",
    name: "Wheat Field with Cypresses",
    imageSource: "https://example.com/wheat-field.jpg",
    year: "1889",
    genre: "Landscape Painting",
  },
];

function renderDetails(path = "/art-pieces/wheat-field") {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/art-pieces" element={<p>Gallery page</p>} />
        <Route
          path="/art-pieces/:slug"
          element={<ArtPieceDetails pieces={pieces} />}
        />
      </Routes>
    </MemoryRouter>
  );
}

test("shows image, title, artist, year and genre", () => {
  renderDetails();

  expect(
    screen.getByRole("img", { name: "Wheat Field with Cypresses" })
  ).toHaveAttribute("src", "https://example.com/wheat-field.jpg");
  expect(
    screen.getByRole("heading", { name: "Wheat Field with Cypresses" })
  ).toBeInTheDocument();
  expect(screen.getByText("Vincent van Gogh")).toBeInTheDocument();
  expect(screen.getByText("1889")).toBeInTheDocument();
  expect(screen.getByText("Landscape Painting")).toBeInTheDocument();
});

test("shows a back button", () => {
  renderDetails();

  expect(screen.getByRole("link", { name: "Back" })).toHaveAttribute(
    "href",
    "/art-pieces"
  );
});

test("navigates back to the list", async () => {
  const user = userEvent.setup();
  renderDetails();

  await user.click(screen.getByRole("link", { name: "Back" }));

  expect(screen.getByText("Gallery page")).toBeInTheDocument();
});

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";

import type { ArtPieceComment } from "../types";
import ArtPieceDetails from "./ArtPieceDetails";

const pieces = [
  {
    slug: "wheat-field",
    artist: "Vincent van Gogh",
    name: "Wheat Field with Cypresses",
    imageSource: "https://example.com/wheat-field.jpg",
    year: "1889",
    genre: "Landscape Painting",
    colors: ["#37412E", "#8D7332", "#838665", "#718F98", "#9DA59E"],
    dimensions: { height: 100, width: 200, type: "jpg" },
  },
];

function renderDetails(
  path = "/art-pieces/wheat-field",
  {
    isFavorite = () => false,
    onToggleFavorite = () => undefined,
    getComments = () => [],
    onAddComment = () => undefined,
  }: {
    isFavorite?: (slug: string) => boolean;
    onToggleFavorite?: (slug: string) => void;
    getComments?: (slug: string) => ArtPieceComment[];
    onAddComment?: (slug: string, text: string) => void;
  } = {}
) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/art-pieces" element={<p>Gallery page</p>} />
        <Route
          path="/art-pieces/:slug"
          element={
            <ArtPieceDetails
              pieces={pieces}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
              getComments={getComments}
              onAddComment={onAddComment}
            />
          }
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

test("shows a favorite button", () => {
  renderDetails();

  expect(
    screen.getByRole("button", { name: "Favorite Wheat Field with Cypresses" })
  ).toBeInTheDocument();
});

test("shows the comments section", () => {
  renderDetails();

  expect(screen.getByRole("region", { name: "Comments" })).toBeInTheDocument();
});

test("shows the comment form", () => {
  renderDetails();

  expect(screen.getByRole("textbox", { name: "Comment" })).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Add comment" })
  ).toBeInTheDocument();
});

test("shows the color palette", () => {
  renderDetails();

  const palette = screen.getByRole("list", { name: "Color palette" });
  expect(within(palette).getAllByRole("listitem")).toHaveLength(5);
});

test("shows the comments of the viewed piece", () => {
  renderDetails("/art-pieces/wheat-field", {
    getComments: (slug) =>
      slug === "wheat-field"
        ? [{ text: "Lovely view", date: "2026-11-11T10:00:00.000Z" }]
        : [],
  });

  const comments = screen.getByRole("region", { name: "Comments" });
  expect(within(comments).getByText("Lovely view")).toBeInTheDocument();
});

test("marks the favorite button as pressed for a favorite", () => {
  renderDetails("/art-pieces/wheat-field", {
    isFavorite: (slug) => slug === "wheat-field",
  });

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
  renderDetails("/art-pieces/wheat-field", { onToggleFavorite });

  await user.click(
    screen.getByRole("button", { name: "Favorite Wheat Field with Cypresses" })
  );

  expect(onToggleFavorite).toHaveBeenCalledTimes(1);
  expect(onToggleFavorite).toHaveBeenCalledWith("wheat-field");
});

test("calls onAddComment with the slug and the text of a new comment", async () => {
  const user = userEvent.setup();
  const onAddComment = vi.fn();
  renderDetails("/art-pieces/wheat-field", { onAddComment });

  await user.type(screen.getByRole("textbox", { name: "Comment" }), "Lovely");
  await user.click(screen.getByRole("button", { name: "Add comment" }));

  expect(onAddComment).toHaveBeenCalledTimes(1);
  expect(onAddComment).toHaveBeenCalledWith("wheat-field", "Lovely");
});

test("shows a message for an unknown art piece", () => {
  renderDetails("/art-pieces/unknown");

  expect(screen.getByText("Art piece not found")).toBeInTheDocument();
  expect(screen.queryByRole("heading")).not.toBeInTheDocument();
});

test("shows a link to view the art piece in a room", () => {
  renderDetails();

  expect(screen.getByRole("link", { name: "View in room" })).toHaveAttribute(
    "href",
    "/art-pieces/wheat-field/room"
  );
});

test("has no back link of its own", () => {
  renderDetails();

  expect(screen.queryByRole("link", { name: "Back" })).not.toBeInTheDocument();
});

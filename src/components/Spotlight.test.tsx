import { render, screen } from "@testing-library/react";

import Spotlight from "./Spotlight";

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

const favoriteProps = {
  isFavorite: () => false,
  onToggleFavorite: () => undefined,
};

afterEach(() => vi.restoreAllMocks());

test("shows the image and artist of the randomly selected art piece", () => {
  vi.spyOn(Math, "random").mockReturnValue(0.99);
  render(<Spotlight pieces={pieces} {...favoriteProps} />);

  expect(screen.getByRole("img", { name: "Piece B" })).toHaveAttribute(
    "src",
    "b.jpg"
  );
  expect(screen.getByText("Artist B")).toBeInTheDocument();
});

test("keeps the same art piece when it re-renders", () => {
  const random = vi.spyOn(Math, "random").mockReturnValue(0);
  const { rerender } = render(<Spotlight pieces={pieces} {...favoriteProps} />);
  random.mockReturnValue(0.99);
  rerender(<Spotlight pieces={pieces} {...favoriteProps} />);

  expect(screen.getByText("Artist A")).toBeInTheDocument();
  expect(screen.queryByText("Artist B")).not.toBeInTheDocument();
});

test("shows a message without art pieces", () => {
  render(<Spotlight pieces={[]} {...favoriteProps} />);

  expect(screen.getByText("No art pieces to show.")).toBeInTheDocument();
});

test("shows a favorite button", () => {
  vi.spyOn(Math, "random").mockReturnValue(0.99);
  render(<Spotlight pieces={pieces} {...favoriteProps} />);

  expect(
    screen.getByRole("button", { name: "Favorite Piece B" })
  ).toBeInTheDocument();
});

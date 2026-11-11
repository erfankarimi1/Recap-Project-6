import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Spotlight from "./Spotlight";

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

const favoriteProps = {
  isFavorite: () => false,
  onToggleFavorite: () => undefined,
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

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

test("marks the favorite button as pressed for a favorite", () => {
  vi.spyOn(Math, "random").mockReturnValue(0.99);
  render(
    <Spotlight
      pieces={pieces}
      isFavorite={(slug) => slug === "b"}
      onToggleFavorite={() => undefined}
    />
  );

  expect(
    screen.getByRole("button", { name: "Favorite Piece B", pressed: true })
  ).toBeInTheDocument();
});

test("calls onToggleFavorite with the slug of the spotlight piece", async () => {
  vi.spyOn(Math, "random").mockReturnValue(0.99);
  const user = userEvent.setup();
  const onToggleFavorite = vi.fn();
  render(
    <Spotlight
      pieces={pieces}
      isFavorite={() => false}
      onToggleFavorite={onToggleFavorite}
    />
  );

  await user.click(screen.getByRole("button", { name: "Favorite Piece B" }));

  expect(onToggleFavorite).toHaveBeenCalledTimes(1);
  expect(onToggleFavorite).toHaveBeenCalledWith("b");
});

const threePieces = [
  ...pieces,
  {
    slug: "c",
    artist: "Artist C",
    name: "Piece C",
    imageSource: "c.jpg",
    year: "1920",
    genre: "Genre C",
    colors: ["#000000", "#ffffff"],
  },
];

test("shows one art piece at a time", () => {
  vi.spyOn(Math, "random").mockReturnValue(0);
  render(<Spotlight pieces={threePieces} {...favoriteProps} />);

  expect(screen.getAllByRole("img")).toHaveLength(1);
  expect(screen.getByRole("img", { name: "Piece A" })).toBeInTheDocument();
});

test("changes the piece with Next and Previous", async () => {
  vi.spyOn(Math, "random").mockReturnValue(0);
  const user = userEvent.setup();
  render(<Spotlight pieces={threePieces} {...favoriteProps} />);

  await user.click(screen.getByRole("button", { name: "Next" }));
  expect(screen.getByRole("img", { name: "Piece B" })).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Previous" }));
  await user.click(screen.getByRole("button", { name: "Previous" }));
  expect(screen.getByRole("img", { name: "Piece C" })).toBeInTheDocument();
});

test("advances automatically and pauses on hover and focus", () => {
  vi.useFakeTimers();
  vi.spyOn(Math, "random").mockReturnValue(0);
  render(<Spotlight pieces={threePieces} {...favoriteProps} />);

  act(() => vi.advanceTimersByTime(5000));
  expect(screen.getByRole("img", { name: "Piece B" })).toBeInTheDocument();

  const slideshow = screen.getByRole("region", { name: "Spotlight slideshow" });
  fireEvent.mouseEnter(slideshow);
  act(() => vi.advanceTimersByTime(10000));
  expect(screen.getByRole("img", { name: "Piece B" })).toBeInTheDocument();

  fireEvent.mouseLeave(slideshow);
  act(() => vi.advanceTimersByTime(5000));
  expect(screen.getByRole("img", { name: "Piece C" })).toBeInTheDocument();

  act(() => screen.getByRole("button", { name: "Next" }).focus());
  act(() => vi.advanceTimersByTime(10000));
  expect(screen.getByRole("img", { name: "Piece C" })).toBeInTheDocument();
});

test("toggles autoplay with the Pause button", () => {
  vi.useFakeTimers();
  vi.spyOn(Math, "random").mockReturnValue(0);
  render(<Spotlight pieces={threePieces} {...favoriteProps} />);

  fireEvent.click(screen.getByRole("button", { name: "Pause" }));
  expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  act(() => vi.advanceTimersByTime(10000));
  expect(screen.getByRole("img", { name: "Piece A" })).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Play" }));
  act(() => vi.advanceTimersByTime(5000));
  expect(screen.getByRole("img", { name: "Piece B" })).toBeInTheDocument();
});

test("shows navigation dots for the current position", async () => {
  vi.spyOn(Math, "random").mockReturnValue(0);
  const user = userEvent.setup();
  render(<Spotlight pieces={threePieces} {...favoriteProps} />);

  const dots = screen.getAllByRole("button", { name: /^Show / });
  expect(dots).toHaveLength(3);
  expect(dots[0]).toHaveAttribute("aria-current", "true");
  expect(dots[1]).not.toHaveAttribute("aria-current", "true");

  await user.click(screen.getByRole("button", { name: "Show Piece C" }));

  expect(screen.getByRole("img", { name: "Piece C" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Show Piece C" })).toHaveAttribute(
    "aria-current",
    "true"
  );
});

test("supports arrow keys and space", () => {
  vi.spyOn(Math, "random").mockReturnValue(0);
  render(<Spotlight pieces={threePieces} {...favoriteProps} />);

  fireEvent.keyDown(document.body, { key: "ArrowRight" });
  expect(screen.getByRole("img", { name: "Piece B" })).toBeInTheDocument();

  fireEvent.keyDown(document.body, { key: "ArrowLeft" });
  fireEvent.keyDown(document.body, { key: "ArrowLeft" });
  expect(screen.getByRole("img", { name: "Piece C" })).toBeInTheDocument();

  fireEvent.keyDown(document.body, { key: " " });
  expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  fireEvent.keyDown(document.body, { key: " " });
  expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
});

test("changes the slide on swipe", () => {
  vi.spyOn(Math, "random").mockReturnValue(0);
  render(<Spotlight pieces={threePieces} {...favoriteProps} />);
  const slideshow = screen.getByRole("region", { name: "Spotlight slideshow" });

  fireEvent.touchStart(slideshow, { changedTouches: [{ clientX: 200 }] });
  fireEvent.touchEnd(slideshow, { changedTouches: [{ clientX: 100 }] });
  expect(screen.getByRole("img", { name: "Piece B" })).toBeInTheDocument();

  fireEvent.touchStart(slideshow, { changedTouches: [{ clientX: 100 }] });
  fireEvent.touchEnd(slideshow, { changedTouches: [{ clientX: 200 }] });
  expect(screen.getByRole("img", { name: "Piece A" })).toBeInTheDocument();

  fireEvent.touchStart(slideshow, { changedTouches: [{ clientX: 100 }] });
  fireEvent.touchEnd(slideshow, { changedTouches: [{ clientX: 110 }] });
  expect(screen.getByRole("img", { name: "Piece A" })).toBeInTheDocument();
});

test("does not autoplay with prefers-reduced-motion", () => {
  vi.useFakeTimers();
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
    }))
  );
  vi.spyOn(Math, "random").mockReturnValue(0);
  render(<Spotlight pieces={threePieces} {...favoriteProps} />);

  act(() => vi.advanceTimersByTime(10000));

  expect(screen.getByRole("img", { name: "Piece A" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  expect(
    screen.getByRole("region", { name: "Spotlight slideshow" })
  ).toHaveClass("reduced-motion");
});

test("preloads the next image", async () => {
  const preloaded: string[] = [];
  vi.stubGlobal(
    "Image",
    class {
      set src(value: string) {
        preloaded.push(value);
      }
    }
  );
  vi.spyOn(Math, "random").mockReturnValue(0);
  const user = userEvent.setup();
  render(<Spotlight pieces={threePieces} {...favoriteProps} />);

  expect(preloaded).toContain("b.jpg");

  await user.click(screen.getByRole("button", { name: "Next" }));

  expect(preloaded).toContain("c.jpg");
});

test("shows title, artist, year and genre", () => {
  vi.spyOn(Math, "random").mockReturnValue(0.99);
  render(<Spotlight pieces={pieces} {...favoriteProps} />);

  expect(screen.getByRole("heading", { name: "Piece B" })).toBeInTheDocument();
  expect(screen.getByText("Artist B")).toBeInTheDocument();
  expect(screen.getByText("1910")).toBeInTheDocument();
  expect(screen.getByText("Genre B")).toBeInTheDocument();
});

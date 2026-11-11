import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SlideshowControls from "./SlideshowControls";

function setup(overrides = {}) {
  const props = {
    names: ["Piece A", "Piece B", "Piece C"],
    currentIndex: 1,
    onSelect: vi.fn(),
    isPlaying: true,
    onTogglePlay: vi.fn(),
    onPrevious: vi.fn(),
    onNext: vi.fn(),
    ...overrides,
  };
  render(<SlideshowControls {...props} />);
  return props;
}

test("calls onPrevious and onNext", async () => {
  const user = userEvent.setup();
  const props = setup();

  await user.click(screen.getByRole("button", { name: "Previous" }));
  await user.click(screen.getByRole("button", { name: "Next" }));

  expect(props.onPrevious).toHaveBeenCalledTimes(1);
  expect(props.onNext).toHaveBeenCalledTimes(1);
});

test("shows Pause while playing and Play while paused", () => {
  const { unmount } = render(
    <SlideshowControls
      names={["A"]}
      currentIndex={0}
      onSelect={() => undefined}
      isPlaying
      onTogglePlay={() => undefined}
      onPrevious={() => undefined}
      onNext={() => undefined}
    />
  );
  expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
  unmount();

  setup({ isPlaying: false });
  expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
});

test("calls onTogglePlay", async () => {
  const user = userEvent.setup();
  const props = setup();

  await user.click(screen.getByRole("button", { name: "Pause" }));

  expect(props.onTogglePlay).toHaveBeenCalledTimes(1);
});

test("marks the current dot and calls onSelect with a dot's index", async () => {
  const user = userEvent.setup();
  const props = setup();

  expect(screen.getByRole("button", { name: "Show Piece B" })).toHaveAttribute(
    "aria-current",
    "true"
  );
  expect(
    screen.getByRole("button", { name: "Show Piece A" })
  ).not.toHaveAttribute("aria-current");

  await user.click(screen.getByRole("button", { name: "Show Piece C" }));

  expect(props.onSelect).toHaveBeenCalledWith(2);
});

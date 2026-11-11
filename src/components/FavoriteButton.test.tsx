import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import FavoriteButton from "./FavoriteButton";

test("calls onToggle when clicked", async () => {
  const user = userEvent.setup();
  const onToggle = vi.fn();
  render(
    <FavoriteButton name="Piece A" isFavorite={false} onToggle={onToggle} />
  );

  await user.click(screen.getByRole("button", { name: "Favorite Piece A" }));

  expect(onToggle).toHaveBeenCalledTimes(1);
});

test("is pressed and shows a filled heart only for a favorite", () => {
  const { rerender } = render(
    <FavoriteButton name="Piece A" isFavorite={false} onToggle={vi.fn()} />
  );
  const button = screen.getByRole("button", { name: "Favorite Piece A" });
  expect(button).toHaveAttribute("aria-pressed", "false");
  expect(button.querySelector("svg")).toHaveAttribute("fill", "none");

  rerender(
    <FavoriteButton name="Piece A" isFavorite={true} onToggle={vi.fn()} />
  );
  expect(button).toHaveAttribute("aria-pressed", "true");
  expect(button.querySelector("svg")).toHaveAttribute("fill", "currentColor");
});

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ColorPalette from "./ColorPalette";

const colors = ["#37412E", "#8D7332", "#838665"];

test("shows one list item per color", () => {
  render(<ColorPalette colors={colors} />);

  const list = screen.getByRole("list", { name: "Color palette" });
  expect(within(list).getAllByRole("listitem")).toHaveLength(3);
});

test("shows each color as a swatch with that background color", () => {
  render(<ColorPalette colors={colors} />);

  const swatches = screen.getAllByRole("listitem");
  colors.forEach((color, index) => {
    expect(swatches[index]).toHaveStyle({ backgroundColor: color });
  });
});

test("shows the hex code while a swatch is hovered", async () => {
  const user = userEvent.setup();
  render(<ColorPalette colors={colors} />);
  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

  await user.hover(screen.getByRole("button", { name: "#37412E" }));

  expect(screen.getByRole("tooltip")).toHaveTextContent("#37412E");
});

test("hides the hex code when the pointer leaves", async () => {
  const user = userEvent.setup();
  render(<ColorPalette colors={colors} />);
  const swatch = screen.getByRole("button", { name: "#37412E" });

  await user.hover(swatch);
  expect(screen.getByRole("tooltip")).toBeInTheDocument();
  await user.unhover(swatch);

  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
});

test("shows the hex code while a swatch is focused", async () => {
  const user = userEvent.setup();
  render(<ColorPalette colors={colors} />);

  await user.tab();
  expect(screen.getByRole("button", { name: "#37412E" })).toHaveFocus();
  expect(screen.getByRole("tooltip")).toHaveTextContent("#37412E");

  await user.tab();
  expect(screen.getByRole("button", { name: "#8D7332" })).toHaveFocus();
  expect(screen.getByRole("tooltip")).toHaveTextContent("#8D7332");

  await user.click(document.body);
  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
});

test("gives each swatch the hex code as its accessible name", () => {
  render(<ColorPalette colors={colors} />);

  const buttons = screen.getAllByRole("button");
  expect(buttons).toHaveLength(colors.length);
  colors.forEach((color, index) => {
    expect(buttons[index]).toHaveAccessibleName(color);
  });
});

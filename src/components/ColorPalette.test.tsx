import { render, screen, within } from "@testing-library/react";

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
    expect(swatches[index]).toHaveAttribute("title", color);
  });
});

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ThemeButton from "./ThemeButton";

test("tells what happens on click", () => {
  render(<ThemeButton theme="dark" onToggle={() => undefined} />);
  expect(
    screen.getByRole("button", { name: "Switch to light mode" })
  ).toBeInTheDocument();
  cleanup();

  render(<ThemeButton theme="light" onToggle={() => undefined} />);
  expect(
    screen.getByRole("button", { name: "Switch to dark mode" })
  ).toBeInTheDocument();
});

test("calls onToggle when it is clicked", async () => {
  const user = userEvent.setup();
  const onToggle = vi.fn();
  render(<ThemeButton theme="dark" onToggle={onToggle} />);

  await user.click(screen.getByRole("button", { name: /Switch to/ }));

  expect(onToggle).toHaveBeenCalledTimes(1);
});

test("can be reached with the Tab key", async () => {
  const user = userEvent.setup();
  render(<ThemeButton theme="dark" onToggle={() => undefined} />);

  await user.tab();

  expect(screen.getByRole("button", { name: /Switch to/ })).toHaveFocus();
});

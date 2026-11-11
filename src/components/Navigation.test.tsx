import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";

import type { Theme } from "../types";
import Navigation from "./Navigation";

function renderNavigation(
  path: string,
  {
    theme = "dark",
    onToggleTheme = () => undefined,
  }: { theme?: Theme; onToggleTheme?: () => void } = {}
) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Navigation theme={theme} onToggleTheme={onToggleTheme} />
      <Routes>
        <Route path="/" element={<p>Spotlight page</p>} />
        <Route path="/art-pieces" element={<p>Gallery page</p>} />
        <Route path="/favorites" element={<p>Favorites page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

test("shows the links Spotlight and Gallery", () => {
  renderNavigation("/");

  expect(screen.getByRole("link", { name: "Spotlight" })).toHaveAttribute(
    "href",
    "/"
  );
  expect(screen.getByRole("link", { name: "Gallery" })).toHaveAttribute(
    "href",
    "/art-pieces"
  );
});

test("highlights only the link of the current page", () => {
  renderNavigation("/art-pieces");

  expect(screen.getByRole("link", { name: "Gallery" })).toHaveClass("active");
  expect(screen.getByRole("link", { name: "Spotlight" })).not.toHaveClass(
    "active"
  );
});

test("navigates between the pages", async () => {
  const user = userEvent.setup();
  renderNavigation("/");

  await user.click(screen.getByRole("link", { name: "Gallery" }));
  expect(screen.getByText("Gallery page")).toBeInTheDocument();

  await user.click(screen.getByRole("link", { name: "Spotlight" }));
  expect(screen.getByText("Spotlight page")).toBeInTheDocument();
});

test("shows a link to Favorites", () => {
  renderNavigation("/");

  expect(screen.getByRole("link", { name: "Favorites" })).toHaveAttribute(
    "href",
    "/favorites"
  );
});

test("navigates to the favorites page", async () => {
  const user = userEvent.setup();
  renderNavigation("/");

  await user.click(screen.getByRole("link", { name: "Favorites" }));

  expect(screen.getByText("Favorites page")).toBeInTheDocument();
});

test("highlights the Favorites link on the favorites page", () => {
  renderNavigation("/favorites");

  expect(screen.getByRole("link", { name: "Favorites" })).toHaveClass("active");
  expect(screen.getByRole("link", { name: "Gallery" })).not.toHaveClass(
    "active"
  );
  expect(screen.getByRole("link", { name: "Spotlight" })).not.toHaveClass(
    "active"
  );
});

test("shows a button that tells what happens on click", () => {
  renderNavigation("/", { theme: "dark" });
  expect(
    screen.getByRole("button", { name: "Switch to light mode" })
  ).toBeInTheDocument();
  cleanup();

  renderNavigation("/", { theme: "light" });
  expect(
    screen.getByRole("button", { name: "Switch to dark mode" })
  ).toBeInTheDocument();
});

test("calls onToggleTheme when the theme button is clicked", async () => {
  const user = userEvent.setup();
  const onToggleTheme = vi.fn();
  renderNavigation("/", { onToggleTheme });

  await user.click(screen.getByRole("button", { name: /Switch to/ }));

  expect(onToggleTheme).toHaveBeenCalledTimes(1);
});

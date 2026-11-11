import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";

import Navigation from "./Navigation";

function renderNavigation(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Navigation />
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

test("has no theme button", () => {
  renderNavigation("/");

  expect(screen.getAllByRole("link")).toHaveLength(3);
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

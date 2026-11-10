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

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";

import BackButton from "./BackButton";

function renderBackButton(entries: string[], index = entries.length - 1) {
  render(
    <MemoryRouter initialEntries={entries} initialIndex={index}>
      <BackButton />
      <Routes>
        <Route path="/" element={<p>Spotlight page</p>} />
        <Route path="/art-pieces" element={<p>Gallery page</p>} />
        <Route path="/favorites" element={<p>Favorites page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

test("shows a button named Back", () => {
  renderBackButton(["/favorites"]);

  expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
});

test("goes to the previous page when there is one", async () => {
  const user = userEvent.setup();
  renderBackButton(["/", "/favorites"]);
  expect(screen.getByText("Favorites page")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Back" }));

  expect(screen.getByText("Spotlight page")).toBeInTheDocument();
});

test("goes to the Gallery when there is no previous page", async () => {
  const user = userEvent.setup();
  renderBackButton(["/favorites"]);
  expect(screen.getByText("Favorites page")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Back" }));

  expect(screen.getByText("Gallery page")).toBeInTheDocument();
});

test("can be reached with the Tab key", async () => {
  const user = userEvent.setup();
  renderBackButton(["/favorites"]);

  await user.tab();

  expect(screen.getByRole("button", { name: "Back" })).toHaveFocus();
});

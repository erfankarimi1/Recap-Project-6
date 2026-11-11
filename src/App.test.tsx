import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { SWRConfig } from "swr";

import App from "./App";

const pieces = [
  {
    slug: "a",
    artist: "Artist A",
    name: "Piece A",
    imageSource: "https://example.com/a.jpg",
    year: "1900",
    genre: "Genre A",
  },
  {
    slug: "b",
    artist: "Artist B",
    name: "Piece B",
    imageSource: "https://example.com/b.jpg",
    year: "1910",
    genre: "Genre B",
  },
];

function renderApp() {
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter initialEntries={["/art-pieces"]}>
        <App />
      </MemoryRouter>
    </SWRConfig>
  );
}

afterEach(() => vi.unstubAllGlobals());

test("shows a loading state, then all art pieces with image, title and artist", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => pieces })
  );
  renderApp();
  expect(screen.getByText("Loading…")).toBeInTheDocument();

  expect(await screen.findAllByRole("listitem")).toHaveLength(2);
  expect(screen.getByRole("img", { name: "Piece A" })).toHaveAttribute(
    "src",
    "https://example.com/a.jpg"
  );
  expect(screen.getByText("Piece B")).toBeInTheDocument();
  expect(screen.getByText("Artist B")).toBeInTheDocument();
});

test("shows an error state when the request fails", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
  renderApp();
  expect(
    await screen.findByText("Failed to load art pieces.")
  ).toBeInTheDocument();
});

test("shows the spotlight on the route /", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => pieces })
  );
  vi.spyOn(Math, "random").mockReturnValue(0);
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    </SWRConfig>
  );

  expect(await screen.findByText("Artist A")).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "Piece A" })).toBeInTheDocument();
  expect(screen.queryByText("Artist B")).not.toBeInTheDocument();
  vi.restoreAllMocks();
});

test("shows the navigation and a message for unknown URLs", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => pieces })
  );
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter initialEntries={["/nowhere"]}>
        <App />
      </MemoryRouter>
    </SWRConfig>
  );

  expect(await screen.findByText("Page not found")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Spotlight" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Gallery" })).toBeInTheDocument();
});

test("shows the details of an art piece on /art-pieces/:slug", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => pieces })
  );
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter initialEntries={["/art-pieces/b"]}>
        <App />
      </MemoryRouter>
    </SWRConfig>
  );

  expect(await screen.findByText("Genre B")).toBeInTheDocument();
  expect(screen.getByText("Piece B")).toBeInTheDocument();
  expect(screen.queryByText("Piece A")).not.toBeInTheDocument();
});

test("shows a message for an unknown art piece", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => pieces })
  );
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter initialEntries={["/art-pieces/nope"]}>
        <App />
      </MemoryRouter>
    </SWRConfig>
  );

  expect(await screen.findByText("Art piece not found")).toBeInTheDocument();
});

test("marks an art piece as favorite when its button is clicked", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => pieces })
  );
  const user = userEvent.setup();
  renderApp();

  const button = await screen.findByRole("button", {
    name: "Favorite Piece A",
    pressed: false,
  });
  await user.click(button);

  expect(
    screen.getByRole("button", { name: "Favorite Piece A", pressed: true })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Favorite Piece B", pressed: false })
  ).toBeInTheDocument();
});

test("removes an art piece from the favorites on a second click", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => pieces })
  );
  const user = userEvent.setup();
  renderApp();

  await user.click(
    await screen.findByRole("button", { name: "Favorite Piece A" })
  );
  await user.click(
    screen.getByRole("button", { name: "Favorite Piece A", pressed: true })
  );

  expect(
    screen.getByRole("button", { name: "Favorite Piece A", pressed: false })
  ).toBeInTheDocument();
});

test("keeps the favorite status when switching between pages", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => pieces })
  );
  const user = userEvent.setup();
  renderApp();

  await user.click(
    await screen.findByRole("button", { name: "Favorite Piece A" })
  );
  await user.click(screen.getByRole("link", { name: /Piece A/ }));

  expect(
    screen.getByRole("button", { name: "Favorite Piece A", pressed: true })
  ).toBeInTheDocument();
});

test("shows the favorites page on the route /favorites", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => pieces })
  );
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter initialEntries={["/favorites"]}>
        <App />
      </MemoryRouter>
    </SWRConfig>
  );

  expect(await screen.findByRole("list")).toBeInTheDocument();
  expect(screen.queryByText("Page not found")).not.toBeInTheDocument();
});

test("shows only the favorite art pieces on /favorites", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => pieces })
  );
  const user = userEvent.setup();
  renderApp();

  await user.click(
    await screen.findByRole("button", { name: "Favorite Piece A" })
  );
  await user.click(screen.getByRole("link", { name: "Favorites" }));

  expect(screen.getAllByRole("listitem")).toHaveLength(1);
  expect(screen.getByText("Piece A")).toBeInTheDocument();
  expect(screen.queryByText("Piece B")).not.toBeInTheDocument();

  await user.click(screen.getByRole("link", { name: "Gallery" }));
  await user.click(screen.getByRole("button", { name: "Favorite Piece B" }));
  await user.click(screen.getByRole("link", { name: "Favorites" }));

  expect(screen.getAllByRole("listitem")).toHaveLength(2);
  expect(screen.getByText("Piece B")).toBeInTheDocument();
});

test("shows image, title and artist of each favorite", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => pieces })
  );
  const user = userEvent.setup();
  renderApp();

  await user.click(
    await screen.findByRole("button", { name: "Favorite Piece B" })
  );
  await user.click(screen.getByRole("link", { name: "Favorites" }));

  expect(screen.getByRole("img", { name: "Piece B" })).toHaveAttribute(
    "src",
    "https://example.com/b.jpg"
  );
  expect(screen.getByText("Piece B")).toBeInTheDocument();
  expect(screen.getByText("Artist B")).toBeInTheDocument();
});

test("shows an active favorite button on each favorite", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => pieces })
  );
  const user = userEvent.setup();
  renderApp();

  await user.click(
    await screen.findByRole("button", { name: "Favorite Piece A" })
  );
  await user.click(screen.getByRole("link", { name: "Favorites" }));

  const button = screen.getByRole("button", {
    name: "Favorite Piece A",
    pressed: true,
  });
  await user.click(button);

  expect(screen.queryByText("Piece A")).not.toBeInTheDocument();
  expect(screen.queryAllByRole("listitem")).toHaveLength(0);
});

test("adds a comment to this art piece only", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => pieces })
  );
  const user = userEvent.setup();
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter initialEntries={["/art-pieces/a"]}>
        <App />
      </MemoryRouter>
    </SWRConfig>
  );

  await user.type(
    await screen.findByRole("textbox", { name: "Comment" }),
    "Lovely"
  );
  await user.click(screen.getByRole("button", { name: "Add comment" }));

  const comments = screen.getByRole("region", { name: "Comments" });
  expect(within(comments).getByText("Lovely")).toBeInTheDocument();

  await user.click(screen.getByRole("link", { name: "Gallery" }));
  await user.click(screen.getByRole("link", { name: /Piece B/ }));

  const otherComments = screen.getByRole("region", { name: "Comments" });
  expect(within(otherComments).queryByText("Lovely")).not.toBeInTheDocument();
  expect(within(otherComments).queryAllByRole("listitem")).toHaveLength(0);
});

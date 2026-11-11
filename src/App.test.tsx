import { render, screen } from "@testing-library/react";
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

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
    colors: ["#000000", "#ffffff"],
    dimensions: { height: 100, width: 200, type: "jpg" },
  },
  {
    slug: "b",
    artist: "Artist B",
    name: "Piece B",
    imageSource: "https://example.com/b.jpg",
    year: "1910",
    genre: "Genre B",
    colors: ["#000000", "#ffffff"],
    dimensions: { height: 100, width: 200, type: "jpg" },
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
  // The header's artist filter lists the artist too, so look in the art list
  expect(
    within(screen.getByRole("list")).getByText("Artist B")
  ).toBeInTheDocument();
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

  // The header's artist filter lists the artists too, so look in the slideshow
  const slideshow = await screen.findByRole("region", {
    name: "Spotlight slideshow",
  });
  expect(within(slideshow).getByText("Artist A")).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "Piece A" })).toBeInTheDocument();
  expect(within(slideshow).queryByText("Artist B")).not.toBeInTheDocument();
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
  // The header's artist filter lists the artist too, so look in the art list
  expect(
    within(screen.getByRole("list")).getByText("Artist B")
  ).toBeInTheDocument();
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

test("keeps the favorites after a reload", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => pieces })
  );
  const user = userEvent.setup();
  const firstVisit = render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter initialEntries={["/art-pieces"]}>
        <App />
      </MemoryRouter>
    </SWRConfig>
  );
  await user.click(
    await screen.findByRole("button", { name: "Favorite Piece A" })
  );
  firstVisit.unmount();

  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter initialEntries={["/art-pieces"]}>
        <App />
      </MemoryRouter>
    </SWRConfig>
  );

  expect(
    await screen.findByRole("button", {
      name: "Favorite Piece A",
      pressed: true,
    })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Favorite Piece B", pressed: false })
  ).toBeInTheDocument();
});

test("keeps the comments after a reload", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => pieces })
  );
  const user = userEvent.setup();
  const firstVisit = render(
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
  firstVisit.unmount();

  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter initialEntries={["/art-pieces/a"]}>
        <App />
      </MemoryRouter>
    </SWRConfig>
  );

  const comments = await screen.findByRole("region", { name: "Comments" });
  expect(within(comments).getByText("Lovely")).toBeInTheDocument();
});

test("starts without favorites when nothing is saved", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => pieces })
  );
  renderApp();

  expect(
    await screen.findByRole("button", {
      name: "Favorite Piece A",
      pressed: false,
    })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Favorite Piece B", pressed: false })
  ).toBeInTheDocument();
});

test("sets data-theme on the html element when the theme button is clicked", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => pieces })
  );
  const user = userEvent.setup();
  renderApp();
  await screen.findByRole("button", { name: /Switch to/ });

  const root = document.documentElement;
  const start = root.dataset.theme;
  expect(["light", "dark"]).toContain(start);
  const other = start === "dark" ? "light" : "dark";

  await user.click(screen.getByRole("button", { name: /Switch to/ }));
  expect(root.dataset.theme).toBe(other);

  await user.click(screen.getByRole("button", { name: /Switch to/ }));
  expect(root.dataset.theme).toBe(start);
});

test("starts with the operating system setting", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => pieces })
  );
  const mockOsTheme = (prefersDark: boolean) =>
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches: query === "(prefers-color-scheme: dark)" ? prefersDark : false,
      }))
    );

  mockOsTheme(true);
  const dark = render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter initialEntries={["/art-pieces"]}>
        <App />
      </MemoryRouter>
    </SWRConfig>
  );
  await screen.findByRole("button", { name: /Switch to/ });
  expect(document.documentElement.dataset.theme).toBe("dark");
  dark.unmount();

  mockOsTheme(false);
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter initialEntries={["/art-pieces"]}>
        <App />
      </MemoryRouter>
    </SWRConfig>
  );
  await screen.findByRole("button", { name: /Switch to/ });
  expect(document.documentElement.dataset.theme).toBe("light");
});

test("keeps the chosen theme after a reload", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => pieces })
  );
  const user = userEvent.setup();
  const firstVisit = render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter initialEntries={["/art-pieces"]}>
        <App />
      </MemoryRouter>
    </SWRConfig>
  );
  await screen.findByRole("button", { name: /Switch to/ });
  const start = document.documentElement.dataset.theme;
  const other = start === "dark" ? "light" : "dark";
  await user.click(screen.getByRole("button", { name: /Switch to/ }));
  expect(document.documentElement.dataset.theme).toBe(other);
  firstVisit.unmount();
  document.documentElement.removeAttribute("data-theme");

  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter initialEntries={["/art-pieces"]}>
        <App />
      </MemoryRouter>
    </SWRConfig>
  );
  await screen.findByRole("button", { name: /Switch to/ });

  expect(document.documentElement.dataset.theme).toBe(other);
});

test("shows the room view on the route /art-pieces/:slug/room", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => pieces })
  );
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter initialEntries={["/art-pieces/b/room"]}>
        <App />
      </MemoryRouter>
    </SWRConfig>
  );

  const room = await screen.findByRole("region", { name: "Room view" });
  expect(
    within(room).getByRole("img", { name: "Piece B" })
  ).toBeInTheDocument();
  expect(screen.queryByText("Genre B")).not.toBeInTheDocument();
});

test("opens the room view from the details page", async () => {
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

  await user.click(await screen.findByRole("link", { name: "View in room" }));

  const room = screen.getByRole("region", { name: "Room view" });
  expect(
    within(room).getByRole("img", { name: "Piece A" })
  ).toBeInTheDocument();
});

test("shows the theme, back and go-to-top buttons on every page", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => pieces })
  );
  // The go-to-top button needs a page that is scrolled down
  Object.defineProperty(window, "scrollY", { configurable: true, value: 500 });

  try {
    for (const path of [
      "/",
      "/art-pieces",
      "/favorites",
      "/art-pieces/a",
      "/nowhere",
    ]) {
      const page = render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <MemoryRouter initialEntries={[path]}>
            <App />
          </MemoryRouter>
        </SWRConfig>
      );
      await screen.findByRole("navigation", { name: "Main navigation" });

      for (const name of [/Switch to/, "Back", "Go to top"]) {
        expect(
          screen.getAllByRole("button", { name }),
          `${String(name)} on ${path}`
        ).toHaveLength(1);
      }
      page.unmount();
    }
  } finally {
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  }
});

// Art pieces for the header and the filters
const catalog = [
  {
    slug: "sunday",
    artist: "Georges Seurat",
    name: "A Sunday on La Grande Jatte",
    imageSource: "https://example.com/sunday.jpg",
    year: "1884",
    genre: "Pointillist Painting",
    colors: ["#111111", "#222222"],
    dimensions: { height: 100, width: 200, type: "jpg" },
  },
  {
    slug: "wheat",
    artist: "Vincent van Gogh",
    name: "Wheat Field with Cypresses",
    imageSource: "https://example.com/wheat.jpg",
    year: "1889",
    genre: "Landscape Painting",
    colors: ["#333333"],
    dimensions: { height: 100, width: 200, type: "jpg" },
  },
  {
    slug: "harvesters",
    artist: "Pieter Bruegel the Elder",
    name: "The Harvesters",
    imageSource: "https://example.com/harvesters.jpg",
    year: "1565",
    genre: "Landscape Painting",
    colors: ["#444444"],
    dimensions: { height: 100, width: 200, type: "jpg" },
  },
];

function renderCatalogAt(path: string) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => catalog })
  );
  return render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </SWRConfig>
  );
}

test("shows the ArtGallery header on Spotlight, Gallery and Favorites only", async () => {
  for (const path of ["/", "/art-pieces", "/favorites"]) {
    const page = renderCatalogAt(path);
    expect(
      await screen.findByRole("heading", { level: 1, name: "ArtGallery" })
    ).toBeInTheDocument();
    page.unmount();
  }

  for (const path of [
    "/art-pieces/sunday",
    "/art-pieces/sunday/room",
    "/nowhere",
  ]) {
    const page = renderCatalogAt(path);
    await screen.findByRole("navigation", { name: "Main navigation" });
    expect(
      screen.queryByRole("heading", { level: 1, name: "ArtGallery" })
    ).not.toBeInTheDocument();
    page.unmount();
  }
});

test("filters the Gallery", async () => {
  const user = userEvent.setup();
  renderCatalogAt("/art-pieces");
  expect(
    within(await screen.findByRole("list")).getAllByRole("link")
  ).toHaveLength(3);

  await user.type(screen.getByRole("searchbox", { name: "Search" }), "Sunday");

  const links = within(screen.getByRole("list")).getAllByRole("link");
  expect(links).toHaveLength(1);
  expect(links[0]).toHaveAccessibleName(/A Sunday on La Grande Jatte/);
});

test("shows No art pieces match your search.", async () => {
  const user = userEvent.setup();
  renderCatalogAt("/art-pieces");
  await screen.findByRole("list");
  expect(
    screen.queryByText("No art pieces match your search.")
  ).not.toBeInTheDocument();

  await user.type(screen.getByRole("searchbox", { name: "Search" }), "zzzzzz");

  expect(
    screen.getByText("No art pieces match your search.")
  ).toBeInTheDocument();
  expect(screen.queryByRole("list")).not.toBeInTheDocument();
});

test("shows all pieces again after Clear filters", async () => {
  const user = userEvent.setup();
  renderCatalogAt("/art-pieces");
  await screen.findByRole("list");

  await user.type(screen.getByRole("searchbox", { name: "Search" }), "land");
  await user.selectOptions(
    screen.getByRole("combobox", { name: "Artist" }),
    "Vincent van Gogh"
  );
  await user.click(screen.getByRole("button", { name: "#333333" }));
  expect(within(screen.getByRole("list")).getAllByRole("link")).toHaveLength(1);

  await user.click(screen.getByRole("button", { name: "Clear filters" }));

  expect(within(screen.getByRole("list")).getAllByRole("link")).toHaveLength(3);
  expect(screen.getByRole("searchbox", { name: "Search" })).toHaveValue("");
  expect(screen.getByRole("combobox", { name: "Artist" })).toHaveValue("");
  expect(screen.getByRole("button", { name: "#333333" })).toHaveAttribute(
    "aria-pressed",
    "false"
  );
});

test("filters the Favorites page", async () => {
  const user = userEvent.setup();
  const page = renderCatalogAt("/art-pieces");
  await user.click(
    await screen.findByRole("button", {
      name: "Favorite A Sunday on La Grande Jatte",
    })
  );
  await user.click(
    screen.getByRole("button", { name: "Favorite Wheat Field with Cypresses" })
  );
  await user.click(screen.getByRole("link", { name: "Favorites" }));
  expect(within(screen.getByRole("list")).getAllByRole("link")).toHaveLength(2);

  // Only the favorites that match the search stay
  const search = screen.getByRole("searchbox", { name: "Search" });
  await user.type(search, "sunday");
  const links = within(screen.getByRole("list")).getAllByRole("link");
  expect(links).toHaveLength(1);
  expect(links[0]).toHaveAccessibleName(/A Sunday on La Grande Jatte/);

  // The Harvesters is not a favorite, so it never shows up here
  await user.clear(search);
  await user.type(search, "harvesters");
  expect(
    screen.getByText("No art pieces match your search.")
  ).toBeInTheDocument();
  page.unmount();

  // Without any favorites the output is the same as before: no message
  localStorage.clear();
  renderCatalogAt("/favorites");
  await user.type(
    await screen.findByRole("searchbox", { name: "Search" }),
    "zzzzzz"
  );
  expect(
    screen.queryByText("No art pieces match your search.")
  ).not.toBeInTheDocument();
  expect(screen.queryAllByRole("listitem")).toHaveLength(0);
});

test("filters the Spotlight", async () => {
  // 0.99 starts the slideshow on the last piece of the list
  vi.spyOn(Math, "random").mockReturnValue(0.99);
  try {
    const user = userEvent.setup();
    renderCatalogAt("/");
    await screen.findByRole("region", { name: "Spotlight slideshow" });
    const slideshow = () =>
      screen.getByRole("region", { name: "Spotlight slideshow" });
    const dots = () =>
      within(slideshow()).getAllByRole("button", { name: /^Show / });

    expect(
      within(slideshow()).getByRole("img", { name: "The Harvesters" })
    ).toBeInTheDocument();
    expect(dots()).toHaveLength(3);

    // One match: the slideshow starts again, on the piece that matches
    const search = screen.getByRole("searchbox", { name: "Search" });
    await user.type(search, "wheat");
    expect(
      within(slideshow()).getByRole("img", {
        name: "Wheat Field with Cypresses",
      })
    ).toBeInTheDocument();
    expect(dots()).toHaveLength(1);

    // Two matches: Next only cycles through them
    await user.clear(search);
    await user.type(search, "landscape");
    expect(dots()).toHaveLength(2);
    const seen = new Set<string>();
    for (let step = 0; step < 4; step++) {
      seen.add(within(slideshow()).getByRole("img").getAttribute("alt") ?? "");
      await user.click(
        within(slideshow()).getByRole("button", { name: "Next" })
      );
    }
    expect([...seen].sort()).toEqual([
      "The Harvesters",
      "Wheat Field with Cypresses",
    ]);

    // No match: the message takes the place of the slideshow
    await user.clear(search);
    await user.type(search, "zzzzzz");
    expect(
      screen.getByText("No art pieces match your search.")
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Spotlight slideshow" })
    ).not.toBeInTheDocument();
  } finally {
    vi.restoreAllMocks();
  }
});

test("keeps the search when moving to another page", async () => {
  const user = userEvent.setup();
  renderCatalogAt("/art-pieces");
  await user.type(
    await screen.findByRole("searchbox", { name: "Search" }),
    "landscape"
  );

  await user.click(screen.getByRole("link", { name: "Favorites" }));
  expect(screen.getByRole("searchbox", { name: "Search" })).toHaveValue(
    "landscape"
  );

  await user.click(screen.getByRole("link", { name: "Spotlight" }));
  expect(screen.getByRole("searchbox", { name: "Search" })).toHaveValue(
    "landscape"
  );
  // The filter still applies there: two pieces are landscapes
  const slideshow = screen.getByRole("region", { name: "Spotlight slideshow" });
  expect(
    within(slideshow).getAllByRole("button", { name: /^Show / })
  ).toHaveLength(2);
});

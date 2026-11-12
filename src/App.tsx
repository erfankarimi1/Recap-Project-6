import { useEffect, useLayoutEffect, useState } from "react";
import useSWR from "swr";
import { Outlet, Route, Routes } from "react-router";

import ArtPieceDetails from "./components/ArtPieceDetails";
import ArtPieces from "./components/ArtPieces";
import BackButton from "./components/BackButton";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import RoomView from "./components/RoomView";
import ScrollToTopButton from "./components/ScrollToTopButton";
import Spotlight from "./components/Spotlight";
import ThemeButton from "./components/ThemeButton";
import { ART_API_URL, fetcher } from "./fetcher";
import { loadArtPiecesInfo, saveArtPiecesInfo } from "./storage";
import { getInitialTheme, saveTheme } from "./theme";
import type { ArtFilters, ArtPieceInfo, Theme } from "./types";
import { EMPTY_FILTERS, filterArtPieces } from "./utils";
import "./styles.css";

export default function App() {
  const { data: pieces, error, isLoading } = useSWR(ART_API_URL, fetcher);
  const [artPiecesInfo, setArtPiecesInfo] =
    useState<ArtPieceInfo[]>(loadArtPiecesInfo);

  useEffect(() => {
    saveArtPiecesInfo(artPiecesInfo);
  }, [artPiecesInfo]);

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // The search and the filters are shared by Spotlight, Gallery and Favorites
  const [filters, setFilters] = useState<ArtFilters>(EMPTY_FILTERS);

  // Before the first paint, so there is no flash of the other theme
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Only a click saves the theme: the theme chosen by the operating system
  // is not a choice of the user and must not be frozen
  function handleToggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    saveTheme(next);
  }

  function isFavorite(slug: string) {
    return artPiecesInfo.some((info) => info.slug === slug && info.isFavorite);
  }

  // Changes the info of one art piece, creating its entry on first use
  function updateInfo(
    slug: string,
    update: (info: ArtPieceInfo) => ArtPieceInfo
  ) {
    setArtPiecesInfo((current) =>
      current.some((info) => info.slug === slug)
        ? current.map((info) => (info.slug === slug ? update(info) : info))
        : [...current, update({ slug, isFavorite: false, comments: [] })]
    );
  }

  function handleToggleFavorite(slug: string) {
    updateInfo(slug, (info) => ({ ...info, isFavorite: !info.isFavorite }));
  }

  function handleAddComment(slug: string, text: string) {
    const comment = { text, date: new Date().toISOString() };
    updateInfo(slug, (info) => ({
      ...info,
      comments: [...info.comments, comment],
    }));
  }

  function getComments(slug: string) {
    return artPiecesInfo.find((info) => info.slug === slug)?.comments ?? [];
  }

  if (isLoading) return <main>Loading…</main>;
  if (error || !pieces) return <main>Failed to load art pieces.</main>;

  const matches = filterArtPieces(pieces, filters);
  const filtersAreActive = Object.values(filters).some((value) => value !== "");
  const noMatches = filtersAreActive && matches.length === 0;

  const favorites = pieces.filter((piece) => isFavorite(piece.slug));
  const matchingFavorites = matches.filter((piece) => isFavorite(piece.slug));
  // Without any favorites the page stays as it was: nothing to match
  const noMatchingFavorites =
    filtersAreActive && favorites.length > 0 && matchingFavorites.length === 0;

  return (
    <>
      <main>
        <Routes>
          <Route
            element={
              <>
                <Header
                  pieces={pieces}
                  filters={filters}
                  onChange={setFilters}
                  onClear={() => setFilters(EMPTY_FILTERS)}
                />
                <Outlet />
              </>
            }
          >
            <Route
              path="/"
              element={
                noMatches ? (
                  <p>No art pieces match your search.</p>
                ) : (
                  <Spotlight
                    // A new set of pieces starts a new slideshow, so the old
                    // slide number can never point past the end of the list
                    key={matches.map((piece) => piece.slug).join(",")}
                    pieces={matches}
                    isFavorite={isFavorite}
                    onToggleFavorite={handleToggleFavorite}
                  />
                )
              }
            />
            <Route
              path="/art-pieces"
              element={
                noMatches ? (
                  <p>No art pieces match your search.</p>
                ) : (
                  <ArtPieces
                    pieces={matches}
                    isFavorite={isFavorite}
                    onToggleFavorite={handleToggleFavorite}
                  />
                )
              }
            />
            <Route
              path="/favorites"
              element={
                noMatchingFavorites ? (
                  <p>No art pieces match your search.</p>
                ) : (
                  <ArtPieces
                    pieces={matchingFavorites}
                    isFavorite={isFavorite}
                    onToggleFavorite={handleToggleFavorite}
                  />
                )
              }
            />
          </Route>
          <Route
            path="/art-pieces/:slug"
            element={
              <ArtPieceDetails
                pieces={pieces}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
                getComments={getComments}
                onAddComment={handleAddComment}
              />
            }
          />
          <Route
            path="/art-pieces/:slug/room"
            element={<RoomView pieces={pieces} />}
          />
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </main>
      <Navigation />
      <BackButton />
      <ThemeButton theme={theme} onToggle={handleToggleTheme} />
      <ScrollToTopButton />
    </>
  );
}

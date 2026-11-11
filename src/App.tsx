import { useState } from "react";
import useSWR from "swr";
import { Route, Routes } from "react-router";

import ArtPieceDetails from "./components/ArtPieceDetails";
import ArtPieces from "./components/ArtPieces";
import Navigation from "./components/Navigation";
import Spotlight from "./components/Spotlight";
import { ART_API_URL, fetcher } from "./fetcher";
import type { ArtPieceInfo } from "./types";
import "./styles.css";

export default function App() {
  const { data: pieces, error, isLoading } = useSWR(ART_API_URL, fetcher);
  const [artPiecesInfo, setArtPiecesInfo] = useState<ArtPieceInfo[]>([]);

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

  return (
    <>
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Spotlight
                pieces={pieces}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
              />
            }
          />
          <Route
            path="/art-pieces"
            element={
              <ArtPieces
                pieces={pieces}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
              />
            }
          />
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
            path="/favorites"
            element={
              <ArtPieces
                pieces={pieces.filter((piece) => isFavorite(piece.slug))}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
              />
            }
          />
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </main>
      <Navigation />
    </>
  );
}

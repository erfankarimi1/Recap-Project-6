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

  function handleToggleFavorite(slug: string) {
    setArtPiecesInfo((current) =>
      current.some((info) => info.slug === slug)
        ? current.map((info) =>
            info.slug === slug
              ? { ...info, isFavorite: !info.isFavorite }
              : info
          )
        : [...current, { slug, isFavorite: true }]
    );
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

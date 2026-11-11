import useSWR from "swr";
import { Route, Routes } from "react-router";

import ArtPieceDetails from "./components/ArtPieceDetails";
import ArtPieces from "./components/ArtPieces";
import Navigation from "./components/Navigation";
import Spotlight from "./components/Spotlight";
import { ART_API_URL, fetcher } from "./fetcher";
import "./styles.css";

export default function App() {
  const { data: pieces, error, isLoading } = useSWR(ART_API_URL, fetcher);

  if (isLoading) return <main>Loading…</main>;
  if (error || !pieces) return <main>Failed to load art pieces.</main>;

  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<Spotlight pieces={pieces} />} />
          <Route path="/art-pieces" element={<ArtPieces pieces={pieces} />} />
          <Route
            path="/art-pieces/:slug"
            element={<ArtPieceDetails pieces={pieces} />}
          />
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </main>
      <Navigation />
    </>
  );
}

import useSWR from "swr";
import { Navigate, Route, Routes } from "react-router";

import ArtPieces from "./components/ArtPieces";
import { ART_API_URL, fetcher } from "./fetcher";
import "./styles.css";

export default function App() {
  const { data: pieces, error, isLoading } = useSWR(ART_API_URL, fetcher);

  if (isLoading) return <main>Loading…</main>;
  if (error || !pieces) return <main>Failed to load art pieces.</main>;

  return (
    <main>
      <Routes>
        {/* Temporary until the Spotlight page (issue 5) takes over "/" */}
        <Route path="/" element={<Navigate to="/art-pieces" replace />} />
        <Route path="/art-pieces" element={<ArtPieces pieces={pieces} />} />
      </Routes>
    </main>
  );
}

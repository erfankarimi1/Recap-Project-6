import type { ArtPiece } from "./types";

export const ART_API_URL = "https://example-apis.vercel.app/api/art";

export async function fetcher(url: string): Promise<ArtPiece[]> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const data: ArtPiece[] = await response.json();
  return data;
}

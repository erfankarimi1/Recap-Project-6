import type { ArtPieceInfo } from "./types";

export const STORAGE_KEY = "art-pieces-info";

export function loadArtPiecesInfo(): ArtPieceInfo[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === null) return [];
  try {
    const info: unknown = JSON.parse(saved);
    // Only the list itself is checked, not every entry
    return Array.isArray(info) ? (info as ArtPieceInfo[]) : [];
  } catch {
    return [];
  }
}

export function saveArtPiecesInfo(info: ArtPieceInfo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
}

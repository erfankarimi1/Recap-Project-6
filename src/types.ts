export type ArtPiece = {
  slug: string;
  artist: string;
  name: string;
  imageSource: string;
  year: string;
  genre: string;
  colors: string[];
  dimensions: { height: number; width: number; type: string };
};

export type ArtPieceComment = {
  text: string;
  date: string;
};

export type ArtPieceInfo = {
  slug: string;
  isFavorite: boolean;
  comments: ArtPieceComment[];
};

export type Theme = "light" | "dark";

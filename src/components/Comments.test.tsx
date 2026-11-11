import { render, screen, within } from "@testing-library/react";

import type { ArtPieceComment } from "../types";
import Comments from "./Comments";

const comments: ArtPieceComment[] = [
  { text: "Beautiful colors", date: "2026-11-11T10:00:00.000Z" },
  { text: "My favorite painting", date: "2026-11-11T11:30:00.000Z" },
];

test("shows a section labeled Comments with a list", () => {
  render(<Comments comments={comments} />);

  const section = screen.getByRole("region", { name: "Comments" });
  expect(within(section).getAllByRole("listitem")).toHaveLength(2);
});

test("shows the text of each comment", () => {
  render(<Comments comments={comments} />);

  expect(screen.getByText("Beautiful colors")).toBeInTheDocument();
  expect(screen.getByText("My favorite painting")).toBeInTheDocument();
});

test("shows the date and time of each comment", () => {
  render(<Comments comments={comments} />);

  for (const comment of comments) {
    const time = screen.getByText(new Date(comment.date).toLocaleString());
    expect(time.tagName).toBe("TIME");
    expect(time).toHaveAttribute("datetime", comment.date);
  }
});

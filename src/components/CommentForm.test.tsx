import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CommentForm from "./CommentForm";

test("shows a text field and a submit button", () => {
  render(<CommentForm onSubmit={vi.fn()} />);

  expect(screen.getByRole("textbox", { name: "Comment" })).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Add comment" })
  ).toBeInTheDocument();
});

test("calls onSubmit with the text and clears the field", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<CommentForm onSubmit={onSubmit} />);

  await user.type(screen.getByRole("textbox", { name: "Comment" }), "Lovely");
  await user.click(screen.getByRole("button", { name: "Add comment" }));

  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(onSubmit).toHaveBeenCalledWith("Lovely");
  expect(screen.getByRole("textbox", { name: "Comment" })).toHaveValue("");
});

test("does not submit an empty or blank comment", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<CommentForm onSubmit={onSubmit} />);

  await user.click(screen.getByRole("button", { name: "Add comment" }));
  expect(onSubmit).not.toHaveBeenCalled();

  await user.type(screen.getByRole("textbox", { name: "Comment" }), "   ");
  await user.click(screen.getByRole("button", { name: "Add comment" }));
  expect(onSubmit).not.toHaveBeenCalled();
});

import { useState } from "react";

type CommentFormProps = {
  onSubmit: (text: string) => void;
};

export default function CommentForm({ onSubmit }: CommentFormProps) {
  const [text, setText] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (text.trim() === "") return;
    onSubmit(text);
    setText("");
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <label htmlFor="comment">Comment</label>
      <input
        id="comment"
        name="comment"
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        required
      />
      <button type="submit">Add comment</button>
    </form>
  );
}

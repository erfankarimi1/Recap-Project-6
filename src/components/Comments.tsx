import type { ArtPieceComment } from "../types";

type CommentsProps = {
  comments: ArtPieceComment[];
};

export default function Comments({ comments }: CommentsProps) {
  return (
    <section aria-labelledby="comments-heading">
      <h3 id="comments-heading">Comments</h3>
      <ul className="comments">
        {comments.map((comment) => (
          <li key={`${comment.date}-${comment.text}`}>
            {comment.text}
            <time dateTime={comment.date}>
              {new Date(comment.date).toLocaleString()}
            </time>
          </li>
        ))}
      </ul>
    </section>
  );
}

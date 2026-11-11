import { useLocation, useNavigate } from "react-router";

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // The first page of a session has the key "default": nothing to go back to
  const hasPreviousPage = location.key !== "default";

  function handleClick() {
    if (hasPreviousPage) {
      navigate(-1);
    } else {
      navigate("/art-pieces");
    }
  }

  return (
    <button
      type="button"
      className="corner-button corner-top-left"
      aria-label="Back"
      onClick={handleClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </svg>
    </button>
  );
}

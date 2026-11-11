import { useEffect, useState } from "react";

// The button appears once the page is scrolled further than this, in pixels
const SHOW_AFTER = 300;

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(() => window.scrollY > SHOW_AFTER);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > SHOW_AFTER);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className="corner-button corner-bottom-right"
      aria-label="Go to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
        <path d="m5 12 7-7 7 7" />
        <path d="M12 19V5" />
      </svg>
    </button>
  );
}

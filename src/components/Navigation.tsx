import { NavLink } from "react-router";

import type { Theme } from "../types";

type NavigationProps = {
  theme: Theme;
  onToggleTheme: () => void;
};

export default function Navigation({ theme, onToggleTheme }: NavigationProps) {
  return (
    <nav aria-label="Main navigation">
      <NavLink to="/" end>
        Spotlight
      </NavLink>
      <NavLink to="/art-pieces">Gallery</NavLink>
      <NavLink to="/favorites">Favorites</NavLink>
      <button type="button" className="theme-toggle" onClick={onToggleTheme}>
        {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      </button>
    </nav>
  );
}

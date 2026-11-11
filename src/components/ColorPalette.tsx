import { useState } from "react";

type ColorPaletteProps = {
  colors: string[];
};

export default function ColorPalette({ colors }: ColorPaletteProps) {
  const [activeColor, setActiveColor] = useState<string | null>(null);

  return (
    <ul className="palette" aria-label="Color palette">
      {colors.map((color) => (
        <li key={color} style={{ backgroundColor: color }}>
          <button
            type="button"
            aria-label={color}
            onMouseEnter={() => setActiveColor(color)}
            onMouseLeave={() => setActiveColor(null)}
            onFocus={() => setActiveColor(color)}
            onBlur={() => setActiveColor(null)}
          />
          {activeColor === color && <span role="tooltip">{color}</span>}
        </li>
      ))}
    </ul>
  );
}

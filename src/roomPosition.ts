// The center of the picture, in percent of the room photo
export type Position = { x: number; y: number };

// The wall of the room photo, in percent of the photo: the area above the
// sofa cushions and left of the corner. It is measured for public/room.jpg.
export const WALL = { left: 4, right: 72, top: 4, bottom: 38 };

export function startPosition(): Position {
  return {
    x: (WALL.left + WALL.right) / 2,
    y: (WALL.top + WALL.bottom) / 2,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

// Moves the picture by a change in percent of the room, and keeps the whole
// picture (of the given size, in percent of the room) inside the wall
export function moveBy(
  position: Position,
  change: Position,
  size: Position
): Position {
  return {
    x: clamp(
      position.x + change.x,
      WALL.left + size.x / 2,
      WALL.right - size.x / 2
    ),
    y: clamp(
      position.y + change.y,
      WALL.top + size.y / 2,
      WALL.bottom - size.y / 2
    ),
  };
}

// How far an arrow key moves the picture, in percent of the room
const KEY_STEP = 2;

const KEY_CHANGES: Record<string, Position> = {
  ArrowRight: { x: KEY_STEP, y: 0 },
  ArrowLeft: { x: -KEY_STEP, y: 0 },
  ArrowDown: { x: 0, y: KEY_STEP },
  ArrowUp: { x: 0, y: -KEY_STEP },
};

export function isArrowKey(key: string) {
  return key in KEY_CHANGES;
}

// Moves the picture one step for an arrow key, and ignores every other key
export function moveByKey(
  position: Position,
  key: string,
  size: Position
): Position {
  const change = KEY_CHANGES[key];
  return change ? moveBy(position, change, size) : position;
}

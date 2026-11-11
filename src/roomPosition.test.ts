import { moveBy, moveByKey, startPosition } from "./roomPosition";

test("starts in the middle of the wall", () => {
  // The wall is 4 to 72 percent wide and 4 to 38 percent high
  expect(startPosition()).toEqual({ x: 38, y: 21 });
});

test("keeps the whole picture inside the wall", () => {
  // A picture 20 percent wide and 20 percent high: its center can be
  // 14 to 62 percent from the left and 14 to 28 percent from the top
  const size = { x: 20, y: 20 };

  expect(moveBy({ x: 38, y: 21 }, { x: 5, y: 3 }, size)).toEqual({
    x: 43,
    y: 24,
  });
  expect(moveBy({ x: 38, y: 21 }, { x: 500, y: 500 }, size)).toEqual({
    x: 62,
    y: 28,
  });
  expect(moveBy({ x: 38, y: 21 }, { x: -500, y: -500 }, size)).toEqual({
    x: 14,
    y: 14,
  });
});

test("moves by a step for an arrow key and stops at the wall", () => {
  const size = { x: 20, y: 20 };
  const start = { x: 38, y: 21 };

  expect(moveByKey(start, "ArrowRight", size)).toEqual({ x: 40, y: 21 });
  expect(moveByKey(start, "ArrowLeft", size)).toEqual({ x: 36, y: 21 });
  expect(moveByKey(start, "ArrowDown", size)).toEqual({ x: 38, y: 23 });
  expect(moveByKey(start, "ArrowUp", size)).toEqual({ x: 38, y: 19 });
  expect(moveByKey(start, "a", size)).toEqual(start);
  expect(moveByKey({ x: 62, y: 28 }, "ArrowRight", size)).toEqual({
    x: 62,
    y: 28,
  });
  expect(moveByKey({ x: 62, y: 28 }, "ArrowDown", size)).toEqual({
    x: 62,
    y: 28,
  });
});

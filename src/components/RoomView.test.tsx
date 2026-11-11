import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";

import RoomView from "./RoomView";

const pieces = [
  {
    slug: "wheat-field",
    artist: "Vincent van Gogh",
    name: "Wheat Field with Cypresses",
    imageSource: "https://example.com/wheat-field.jpg",
    year: "1889",
    genre: "Landscape Painting",
    colors: ["#37412E", "#8D7332"],
    dimensions: { height: 1528, width: 1920, type: "jpg" },
  },
];

// jsdom has no layout: the room is 1000 x 750 px and the picture 200 x 150 px
function mockLayout() {
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
    function (this: Element) {
      const [width, height] = this.classList.contains("room-picture")
        ? [200, 150]
        : [1000, 750];
      return {
        width,
        height,
        top: 0,
        left: 0,
        right: width,
        bottom: height,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      };
    }
  );
}

afterEach(() => vi.restoreAllMocks());

// jsdom has no PointerEvent, and React listens to the native event by name.
// A MouseEvent with the pointer event name carries the coordinates.
function pointer(
  type: string,
  target: Element,
  clientX: number,
  clientY: number
) {
  fireEvent(
    target,
    new MouseEvent(type, { bubbles: true, cancelable: true, clientX, clientY })
  );
}

function renderRoomView(path = "/art-pieces/wheat-field/room") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/art-pieces/:slug/room"
          element={<RoomView pieces={pieces} />}
        />
        <Route path="/art-pieces/:slug" element={<p>Details page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

test("shows the image of the art piece", () => {
  renderRoomView();

  const room = screen.getByRole("region", { name: "Room view" });
  expect(
    within(room).getByRole("img", { name: "Wheat Field with Cypresses" })
  ).toHaveAttribute("src", "https://example.com/wheat-field.jpg");
});

test("gives the image the width and height of the art piece", () => {
  renderRoomView();

  const image = screen.getByRole("img", { name: "Wheat Field with Cypresses" });
  expect(image).toHaveAttribute("width", "1920");
  expect(image).toHaveAttribute("height", "1528");
});

test("shows a message for an unknown art piece", () => {
  renderRoomView("/art-pieces/unknown/room");

  expect(screen.getByText("Art piece not found")).toBeInTheDocument();
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
});

test("shows a photo of a room as the background", () => {
  renderRoomView();

  const room = screen.getByRole("region", { name: "Room view" });
  expect(
    within(room).getByRole("img", { name: "A living room with an empty wall" })
  ).toHaveAttribute("src", "/room.jpg");
});

test("hangs the picture in the middle of the wall at the start", () => {
  renderRoomView();

  expect(
    screen.getByRole("group", { name: "Move Wheat Field with Cypresses" })
  ).toHaveStyle({ left: "38%", top: "21%" });
});

test("moves the picture when it is dragged", () => {
  mockLayout();
  renderRoomView();
  const picture = screen.getByRole("group", {
    name: "Move Wheat Field with Cypresses",
  });

  pointer("pointerdown", picture, 100, 100);
  pointer("pointermove", picture, 150, 130);
  expect(picture).toHaveStyle({ left: "43%", top: "25%" });

  pointer("pointerup", picture, 150, 130);
  pointer("pointermove", picture, 300, 300);
  expect(picture).toHaveStyle({ left: "43%", top: "25%" });
});

test("keeps the picture on the wall when it is dragged too far", () => {
  mockLayout();
  renderRoomView();
  const picture = screen.getByRole("group", {
    name: "Move Wheat Field with Cypresses",
  });

  pointer("pointerdown", picture, 500, 400);
  pointer("pointermove", picture, 5000, 5000);
  expect(picture).toHaveStyle({ left: "62%", top: "28%" });

  pointer("pointermove", picture, -5000, -5000);
  expect(picture).toHaveStyle({ left: "14%", top: "14%" });
});

test("moves the picture with the arrow keys", () => {
  mockLayout();
  renderRoomView();
  const picture = screen.getByRole("group", {
    name: "Move Wheat Field with Cypresses",
  });
  picture.focus();
  expect(picture).toHaveFocus();

  // fireEvent returns false when the default action (scrolling) is prevented
  const notPrevented = fireEvent.keyDown(picture, { key: "ArrowRight" });
  expect(notPrevented).toBe(false);
  expect(picture).toHaveStyle({ left: "40%", top: "21%" });

  fireEvent.keyDown(picture, { key: "ArrowDown" });
  expect(picture).toHaveStyle({ left: "40%", top: "23%" });

  const otherNotPrevented = fireEvent.keyDown(picture, { key: "a" });
  expect(otherNotPrevented).toBe(true);
  expect(picture).toHaveStyle({ left: "40%", top: "23%" });

  for (let press = 0; press < 40; press++) {
    fireEvent.keyDown(picture, { key: "ArrowRight" });
  }
  expect(picture).toHaveStyle({ left: "62%", top: "23%" });
});

test("starts in the middle of the wall each time the room view opens", () => {
  mockLayout();
  const firstVisit = renderRoomView();
  const picture = screen.getByRole("group", {
    name: "Move Wheat Field with Cypresses",
  });
  fireEvent.keyDown(picture, { key: "ArrowRight" });
  expect(picture).toHaveStyle({ left: "40%", top: "21%" });
  firstVisit.unmount();

  renderRoomView();

  expect(
    screen.getByRole("group", { name: "Move Wheat Field with Cypresses" })
  ).toHaveStyle({ left: "38%", top: "21%" });
});

test("has no back link of its own", () => {
  renderRoomView();

  expect(screen.queryByRole("link", { name: "Back" })).not.toBeInTheDocument();
});

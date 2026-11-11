import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ScrollToTopButton from "./ScrollToTopButton";

// jsdom does not scroll: the scroll position is set by hand
function setScrollY(position: number) {
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: position,
  });
}

function scrollTo(position: number) {
  setScrollY(position);
  fireEvent.scroll(window);
}

afterEach(() => {
  vi.restoreAllMocks();
  setScrollY(0);
});

test("is hidden near the top of the page", () => {
  render(<ScrollToTopButton />);

  scrollTo(0);
  expect(
    screen.queryByRole("button", { name: "Go to top" })
  ).not.toBeInTheDocument();

  scrollTo(300);
  expect(
    screen.queryByRole("button", { name: "Go to top" })
  ).not.toBeInTheDocument();
});

test("appears after scrolling down more than 300 px and disappears when back at the top", () => {
  render(<ScrollToTopButton />);

  scrollTo(301);
  expect(screen.getByRole("button", { name: "Go to top" })).toBeInTheDocument();

  scrollTo(100);
  expect(
    screen.queryByRole("button", { name: "Go to top" })
  ).not.toBeInTheDocument();
});

test("scrolls to the top when it is clicked", async () => {
  const user = userEvent.setup();
  const scrollToTop = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  setScrollY(500);
  render(<ScrollToTopButton />);

  await user.click(screen.getByRole("button", { name: "Go to top" }));

  expect(scrollToTop).toHaveBeenCalledTimes(1);
  expect(scrollToTop).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
});

test("can be reached with the Tab key", async () => {
  const user = userEvent.setup();
  setScrollY(500);
  render(<ScrollToTopButton />);

  await user.tab();

  expect(screen.getByRole("button", { name: "Go to top" })).toHaveFocus();
});

import { fetcher } from "./fetcher";

afterEach(() => vi.unstubAllGlobals());

test("returns the parsed art pieces", async () => {
  const data = [{ slug: "a", artist: "A", name: "A", imageSource: "a.jpg" }];
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => data })
  );

  await expect(fetcher("/url")).resolves.toEqual(data);
});

test("throws when the response is not ok", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 404 }));

  await expect(fetcher("/url")).rejects.toThrow("status 404");
});

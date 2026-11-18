import { describe, expect, it, jest } from "@jest/globals";

import { createCachedSearch } from "./search-cache.js";
import type { CountrySearch } from "./search-session.js";

const spain = [{ name: "Spain" }];

describe("createCachedSearch", () => {
  it("reuses a cached result for the same query in another case", async () => {
    const search = jest.fn<CountrySearch>().mockResolvedValue(spain);
    const cached = createCachedSearch(search);
    const first = new AbortController();
    const second = new AbortController();

    await expect(cached("Spain", first.signal)).resolves.toEqual(spain);
    await expect(cached("  spain  ", second.signal)).resolves.toEqual(spain);

    expect(search).toHaveBeenCalledTimes(1);
  });

  it("shares one request while the same query is in flight", async () => {
    let resolveSearch: ((countries: unknown[]) => void) | undefined;
    const search = jest.fn<CountrySearch>(
      () =>
        new Promise((resolve) => {
          resolveSearch = resolve;
        }),
    );
    const cached = createCachedSearch(search);
    const first = new AbortController();
    const second = new AbortController();

    const left = cached("spain", first.signal);
    const right = cached("Spain", second.signal);

    expect(search).toHaveBeenCalledTimes(1);
    resolveSearch?.(spain);

    await expect(Promise.all([left, right])).resolves.toEqual([spain, spain]);
  });

  it("keeps the shared request when only one caller aborts", async () => {
    let resolveSearch: ((countries: unknown[]) => void) | undefined;
    const search = jest.fn<CountrySearch>(
      () =>
        new Promise((resolve) => {
          resolveSearch = resolve;
        }),
    );
    const cached = createCachedSearch(search);
    const first = new AbortController();
    const second = new AbortController();
    const left = cached("spain", first.signal);
    const right = cached("spain", second.signal);

    first.abort();

    await expect(left).rejects.toMatchObject({ name: "AbortError" });
    resolveSearch?.(spain);
    await expect(right).resolves.toEqual(spain);
    expect(search).toHaveBeenCalledTimes(1);
  });

  it("does not cache a failed search", async () => {
    const search = jest
      .fn<CountrySearch>()
      .mockRejectedValueOnce(new Error("down"))
      .mockResolvedValueOnce(spain);
    const cached = createCachedSearch(search);

    await expect(cached("spain", new AbortController().signal)).rejects.toThrow(
      "down",
    );
    await expect(
      cached("spain", new AbortController().signal),
    ).resolves.toEqual(spain);
    expect(search).toHaveBeenCalledTimes(2);
  });

  it("aborts the shared request when its only caller aborts", async () => {
    let received: AbortSignal | undefined;
    const search = jest.fn<CountrySearch>((_query, signal) => {
      received = signal;
      return new Promise(() => undefined);
    });
    const cached = createCachedSearch(search);
    const controller = new AbortController();
    const pending = cached("spain", controller.signal);

    controller.abort();

    await expect(pending).rejects.toMatchObject({ name: "AbortError" });
    expect(received?.aborted).toBe(true);
  });
});

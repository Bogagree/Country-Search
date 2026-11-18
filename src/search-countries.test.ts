import { afterEach, describe, expect, it, jest } from "@jest/globals";

import { HttpError } from "./http-error.js";
import { searchCountries } from "./search-countries.js";

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status });
}

describe("searchCountries", () => {
  const fetchMock = jest.fn<typeof fetch>();

  afterEach(() => {
    fetchMock.mockReset();
    Reflect.deleteProperty(globalThis, "fetch");
  });

  it("returns the JSON array when the response is ok", async () => {
    const countries = [{ name: "Spain" }];
    fetchMock.mockResolvedValue(jsonResponse(200, countries));
    globalThis.fetch = fetchMock;
    const signal = new AbortController().signal;

    await expect(searchCountries("spain", signal)).resolves.toEqual(countries);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://countries.dev/name/spain",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("returns an empty array on 404", async () => {
    fetchMock.mockResolvedValue(jsonResponse(404, { message: "Not Found" }));
    globalThis.fetch = fetchMock;

    await expect(
      searchCountries("nowhere", new AbortController().signal),
    ).resolves.toEqual([]);
  });

  it("throws HttpError with the status when the response is not ok", async () => {
    fetchMock.mockResolvedValue(jsonResponse(500, { message: "nope" }));
    globalThis.fetch = fetchMock;

    await expect(
      searchCountries("spain", new AbortController().signal),
    ).rejects.toMatchObject({ status: 500 });
    await expect(
      searchCountries("spain", new AbortController().signal),
    ).rejects.toBeInstanceOf(HttpError);
  });

  it("forwards a signal that aborts together with the caller signal", async () => {
    let received: AbortSignal | undefined;
    fetchMock.mockImplementation((_input, init) => {
      received = init?.signal ?? undefined;
      return Promise.resolve(jsonResponse(200, []));
    });
    globalThis.fetch = fetchMock;
    const controller = new AbortController();

    await searchCountries("spain", controller.signal);
    controller.abort();

    expect(received?.aborted).toBe(true);
  });
});

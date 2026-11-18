import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

import { HttpError } from "./http-error.js";
import {
  createSearchSession,
  type CountrySearch,
  type SearchState,
} from "./search-session.js";

const delay = 200;

const spain = {
  name: "Spain",
  flag: "🇪🇸",
  capital: "Madrid",
  region: "Europe",
  population: 47351567,
  languages: [{ name: "Spanish" }],
};

const spainCard = {
  name: "Spain",
  flag: "🇪🇸",
  capital: "Madrid",
  region: "Europe",
  population: 47351567,
  languages: ["Spanish"],
};

describe("createSearchSession", () => {
  const RealAbortController = globalThis.AbortController;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    globalThis.AbortController = RealAbortController;
  });

  function start(): {
    states: SearchState[];
    created: AbortController[];
    search: jest.Mock<CountrySearch>;
    session: ReturnType<typeof createSearchSession>;
  } {
    const states: SearchState[] = [];
    const created: AbortController[] = [];

    class RecordingController extends RealAbortController {
      constructor() {
        super();
        created.push(this);
      }
    }

    globalThis.AbortController = RecordingController;

    const search = jest.fn<CountrySearch>();
    const session = createSearchSession({
      delay,
      search,
      onChange: (state) => {
        states.push(state);
      },
    });

    return { states, created, search, session };
  }

  it("clears the list and does not fetch for an empty query", async () => {
    const { states, search, session } = start();

    session.setQuery("");
    await jest.advanceTimersByTimeAsync(delay);

    expect(search).not.toHaveBeenCalled();
    expect(states.at(-1)).toEqual({ kind: "cleared" });
  });

  it("runs a chosen query immediately and drops the pending debounce", async () => {
    const { search, session } = start();
    search.mockResolvedValue([spain]);

    session.setQuery("fr");
    session.searchNow("spain");

    expect(search).toHaveBeenCalledTimes(1);
    expect(search).toHaveBeenCalledWith("spain", expect.any(AbortSignal));

    await jest.advanceTimersByTimeAsync(delay);

    expect(search).toHaveBeenCalledTimes(1);
  });

  it("aborts the previous controller before debounce fires", () => {
    const { created, search, session } = start();

    session.setQuery("sp");
    const first = created[0];

    expect(search).not.toHaveBeenCalled();
    expect(first).toBeDefined();

    session.setQuery("spa");

    expect(first?.signal.aborted).toBe(true);
    expect(search).not.toHaveBeenCalled();
  });

  it("does not report an error when search is aborted", async () => {
    const { states, search, session } = start();
    search.mockRejectedValue(
      new DOMException("The operation was aborted", "AbortError"),
    );

    session.setQuery("sp");
    await jest.advanceTimersByTimeAsync(delay);

    expect(states.some((state) => state.kind === "error")).toBe(false);
  });

  it("treats an empty result as no matches rather than an error", async () => {
    const { states, search, session } = start();
    search.mockResolvedValue([]);

    session.setQuery("atlantis");
    await jest.advanceTimersByTimeAsync(delay);

    expect(states.at(-1)).toEqual({ kind: "empty" });
  });

  it("maps countries into cards", async () => {
    const { states, search, session } = start();
    search.mockResolvedValue([spain]);

    session.setQuery("spain");
    await jest.advanceTimersByTimeAsync(delay);

    expect(states.at(-1)).toEqual({
      kind: "results",
      hits: [{ card: spainCard, raw: spain }],
    });
  });

  it("remembers the last query when the request fails", async () => {
    const { states, search, session } = start();
    search.mockRejectedValueOnce(new HttpError(500));

    session.setQuery("spain");
    await jest.advanceTimersByTimeAsync(delay);

    expect(states.at(-1)).toEqual({ kind: "error", query: "spain" });

    search.mockRejectedValueOnce(
      new DOMException("The operation timed out", "TimeoutError"),
    );
    session.setQuery("france");
    await jest.advanceTimersByTimeAsync(delay);

    expect(states.at(-1)).toEqual({ kind: "error", query: "france" });
  });
});

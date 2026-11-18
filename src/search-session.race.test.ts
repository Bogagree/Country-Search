import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

import { createSearchSession, type SearchState } from "./search-session.js";

const delay = 200;

const spain = {
  name: "Spain",
  flag: "🇪🇸",
  capital: "Madrid",
  region: "Europe",
  population: 47351567,
  languages: [{ name: "Spanish" }],
};

const france = {
  name: "France",
  flag: "🇫🇷",
  capital: "Paris",
  region: "Europe",
  population: 67391582,
  languages: [{ name: "French" }],
};

type PendingResponse = {
  signal: AbortSignal;
  resolve: (response: Response) => void;
};

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), { status: 200 });
}

async function flushMicrotasks(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

describe("request race", () => {
  const pending: PendingResponse[] = [];

  beforeEach(() => {
    jest.useFakeTimers();
    pending.length = 0;
    globalThis.fetch = jest.fn(
      (_input: RequestInfo | URL, init?: RequestInit) => {
        const signal = init?.signal;

        if (signal === undefined) {
          throw new Error("fetch was called without a signal");
        }

        return new Promise<Response>((resolve, reject) => {
          const fail = (): void => {
            reject(new DOMException("The operation was aborted", "AbortError"));
          };

          pending.push({ signal, resolve });

          if (signal.aborted) {
            fail();
            return;
          }

          signal.addEventListener("abort", fail, { once: true });
        });
      },
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    Reflect.deleteProperty(globalThis, "fetch");
  });

  it("shows only the later response when the earlier request resolves afterwards", async () => {
    const states: SearchState[] = [];
    const session = createSearchSession({
      delay,
      onChange: (state) => {
        states.push(state);
      },
    });

    session.setQuery("fr");
    await jest.advanceTimersByTimeAsync(delay);
    const earlier = pending[0];

    expect(earlier).toBeDefined();

    session.setQuery("sp");
    expect(earlier?.signal.aborted).toBe(true);

    await jest.advanceTimersByTimeAsync(delay);
    const later = pending[1];

    expect(later).toBeDefined();

    expect(later?.signal.aborted).toBe(false);
    later?.resolve(jsonResponse([spain]));
    await flushMicrotasks();
    earlier?.resolve(jsonResponse([france]));
    await flushMicrotasks();

    const latest = states.at(-1);

    expect(latest).toEqual({
      kind: "results",
      hits: [
        {
          card: {
            name: "Spain",
            flag: "🇪🇸",
            capital: "Madrid",
            region: "Europe",
            population: 47351567,
            languages: ["Spanish"],
          },
          raw: spain,
        },
      ],
    });
  });
});

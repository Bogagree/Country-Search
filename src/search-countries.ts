import { HttpError } from "./http-error.js";

export const SEARCH_TIMEOUT_MS = 8000;

function linkSignals(signals: AbortSignal[]): AbortSignal {
  if (typeof AbortSignal.any === "function") {
    return AbortSignal.any(signals);
  }

  const controller = new AbortController();

  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort(signal.reason);
      return controller.signal;
    }

    signal.addEventListener(
      "abort",
      () => {
        controller.abort(signal.reason);
      },
      { once: true },
    );
  }

  return controller.signal;
}

export async function searchCountries(
  query: string,
  signal: AbortSignal,
): Promise<unknown[]> {
  const response = await fetch(
    `https://countries.dev/name/${encodeURIComponent(query)}`,
    {
      signal: linkSignals([signal, AbortSignal.timeout(SEARCH_TIMEOUT_MS)]),
    },
  );

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new HttpError(response.status);
  }

  const body: unknown = await response.json();

  if (!Array.isArray(body)) {
    throw new HttpError(response.status);
  }

  return body;
}

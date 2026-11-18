import type { CountrySearch } from "./search-session.js";

type Waiter = {
  signal: AbortSignal;
  resolve: (countries: unknown[]) => void;
  reject: (error: unknown) => void;
  onAbort: () => void;
};

type Flight = {
  controller: AbortController;
  waiters: Waiter[];
};

function abortError(): DOMException {
  return new DOMException("The operation was aborted", "AbortError");
}

function finish(flight: Flight): void {
  for (const waiter of flight.waiters) {
    waiter.signal.removeEventListener("abort", waiter.onAbort);
  }
}

export function createCachedSearch(search: CountrySearch): CountrySearch {
  const cache = new Map<string, unknown[]>();
  const flights = new Map<string, Flight>();

  return (query, signal) => {
    if (signal.aborted) {
      return Promise.reject(abortError());
    }

    const key = query.trim().toLowerCase();
    const cached = cache.get(key);

    if (cached !== undefined) {
      return Promise.resolve(cached);
    }

    let flight = flights.get(key);

    if (flight === undefined) {
      const controller = new AbortController();
      flight = { controller, waiters: [] };
      flights.set(key, flight);
      const current = flight;

      let pending: Promise<unknown[]>;

      try {
        pending = search(query, controller.signal);
      } catch (error) {
        pending = Promise.reject(error);
      }

      void pending.then(
        (countries) => {
          cache.set(key, countries);
          flights.delete(key);
          finish(current);

          for (const waiter of current.waiters) {
            if (waiter.signal.aborted) {
              waiter.reject(abortError());
            } else {
              waiter.resolve(countries);
            }
          }
        },
        (error: unknown) => {
          flights.delete(key);
          finish(current);

          for (const waiter of current.waiters) {
            waiter.reject(waiter.signal.aborted ? abortError() : error);
          }
        },
      );
    }

    const current = flight;

    return new Promise((resolve, reject) => {
      const waiter: Waiter = {
        signal,
        resolve,
        reject,
        onAbort: () => undefined,
      };

      waiter.onAbort = () => {
        const index = current.waiters.indexOf(waiter);

        if (index >= 0) {
          current.waiters.splice(index, 1);
        }

        reject(abortError());

        if (current.waiters.length === 0) {
          current.controller.abort();
          flights.delete(key);
        }
      };

      current.waiters.push(waiter);
      signal.addEventListener("abort", waiter.onAbort, { once: true });
    });
  };
}

import { classifySearchError } from "./classify-error.js";
import { debounce } from "./debounce.js";
import { mapCountryResponse, type CountryCard } from "./map-country.js";
import { searchCountries } from "./search-countries.js";

export type SearchHit = {
  card: CountryCard;
  raw: unknown;
};

export type SearchState =
  | { kind: "cleared" }
  | { kind: "loading" }
  | { kind: "empty" }
  | { kind: "results"; hits: SearchHit[] }
  | { kind: "error"; query: string };

export type CountrySearch = (
  query: string,
  signal: AbortSignal,
) => Promise<unknown[]>;

export type SearchSession = {
  setQuery: (text: string) => void;
  searchNow: (text: string) => void;
};

export function createSearchSession(options: {
  delay: number;
  search?: CountrySearch;
  onChange: (state: SearchState) => void;
}): SearchSession {
  const search = options.search ?? searchCountries;
  let controller: AbortController | null = null;
  let lastQuery = "";

  function execute(query: string): void {
    const current = controller;

    if (query.length === 0 || current === null || current.signal.aborted) {
      return;
    }

    void search(query, current.signal).then(
      (countries) => {
        if (current.signal.aborted) {
          return;
        }

        if (countries.length === 0) {
          options.onChange({ kind: "empty" });
          return;
        }

        options.onChange({
          kind: "results",
          hits: countries.map((raw) => ({
            card: mapCountryResponse(raw),
            raw,
          })),
        });
      },
      (error: unknown) => {
        if (current.signal.aborted || classifySearchError(error) === "abort") {
          return;
        }

        options.onChange({ kind: "error", query: lastQuery });
      },
    );
  }

  const run = debounce(execute, options.delay);

  function begin(text: string): void {
    controller?.abort();

    if (text.length === 0) {
      controller = null;
      lastQuery = "";
      options.onChange({ kind: "cleared" });
      return;
    }

    controller = new AbortController();
    lastQuery = text;
    options.onChange({ kind: "loading" });
  }

  return {
    setQuery(text: string) {
      begin(text);
      run(text);
    },
    searchNow(text: string) {
      begin(text);
      run("");
      execute(text);
    },
  };
}

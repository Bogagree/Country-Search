import { el } from "../dom.js";
import { createCachedSearch } from "../search-cache.js";
import { searchCountries } from "../search-countries.js";
import { readSearchHistory, rememberSearchQuery } from "../search-history.js";
import { createSearchSession, type SearchState } from "../search-session.js";
import { renderCountryDetail } from "./country-detail.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function flagNode(raw: unknown, name: string, fallback: string): HTMLElement {
  const flags = isRecord(raw) && isRecord(raw.flags) ? raw.flags : undefined;
  const src =
    flags !== undefined && typeof flags.svg === "string"
      ? flags.svg
      : flags !== undefined && typeof flags.png === "string"
        ? flags.png
        : undefined;

  if (src === undefined) {
    return el("span", { className: "card__flag", text: fallback });
  }

  return el("img", {
    className: "card__flag",
    attrs: { src, alt: name },
  });
}

export const SEARCH_DELAY_MS = 300;

const ERROR_TEXT = "Не удалось загрузить страны";

export function createSearchScreen(): HTMLElement {
  const input = el("input", {
    attrs: {
      id: "country-query",
      type: "search",
      autocomplete: "off",
    },
  });
  const label = el("label", {
    text: "Поиск страны",
    attrs: { for: "country-query" },
  });
  const history = el("div", { className: "history" });
  const status = el("p", {
    className: "status",
    attrs: { role: "status" },
  });
  const list = el("ul", { className: "results" });
  const message = el("p", { className: "message" });
  const detail = el("section", { className: "detail" });
  const retry = el("button", {
    className: "retry",
    text: "Повторить",
    attrs: { type: "button" },
  });
  const screen = el("main", {
    className: "app",
    children: [
      el("form", {
        className: "search",
        attrs: { role: "search" },
        children: [label, input],
      }),
      history,
      status,
      list,
      message,
      detail,
    ],
  });
  let lastQuery = "";

  screen.querySelector("form")?.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  const session = createSearchSession({
    delay: SEARCH_DELAY_MS,
    search: createCachedSearch(searchCountries),
    onChange: renderState,
  });

  function showHistory(): void {
    history.replaceChildren();
    const queries = readSearchHistory(localStorage);

    if (queries.length === 0) {
      return;
    }

    history.append(
      el("span", { className: "history__label", text: "Недавние" }),
    );

    for (const query of queries) {
      const chip = el("button", {
        className: "history__item",
        text: query,
        attrs: { type: "button" },
      });
      chip.addEventListener("click", () => {
        input.value = query;
        session.searchNow(query);
      });
      history.append(chip);
    }
  }

  function renderState(state: SearchState): void {
    status.textContent = state.kind === "loading" ? "Загрузка…" : "";
    list.replaceChildren();
    detail.replaceChildren();
    message.className = "message";
    message.replaceChildren();

    if (state.kind === "empty") {
      rememberSearchQuery(localStorage, input.value);
      showHistory();
      message.className = "message is-empty";
      message.textContent = "ничего не найдено";
      return;
    }

    if (state.kind === "error") {
      lastQuery = state.query;
      message.className = "message is-error";
      message.append(el("span", { text: ERROR_TEXT }), retry);
      return;
    }

    if (state.kind === "results") {
      rememberSearchQuery(localStorage, input.value);
      showHistory();

      for (const hit of state.hits) {
        const card = el("button", {
          className: "card",
          attrs: { type: "button" },
          children: [
            flagNode(hit.raw, hit.card.name, hit.card.flag),
            el("strong", { text: hit.card.name }),
            el("span", { text: hit.card.capital }),
            el("span", { text: hit.card.region }),
            el("span", { text: String(hit.card.population) }),
          ],
        });
        card.addEventListener("click", () => {
          renderCountryDetail(detail, hit.raw);
        });
        list.append(el("li", { children: [card] }));
      }
    }
  }

  retry.addEventListener("click", () => {
    input.value = lastQuery;
    session.setQuery(lastQuery);
  });

  input.addEventListener("input", () => {
    session.setQuery(input.value);
  });

  showHistory();

  return screen;
}

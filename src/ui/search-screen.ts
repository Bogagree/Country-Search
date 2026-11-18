import { el } from "../dom.js";
import { createSearchSession, type SearchState } from "../search-session.js";
import { renderCountryDetail } from "./country-detail.js";

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
    onChange: renderState,
  });

  function renderState(state: SearchState): void {
    status.textContent = state.kind === "loading" ? "Загрузка…" : "";
    list.replaceChildren();
    detail.replaceChildren();
    message.className = "message";
    message.replaceChildren();

    if (state.kind === "empty") {
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
      for (const hit of state.hits) {
        const card = el("button", {
          className: "card",
          attrs: { type: "button" },
          children: [
            el("span", { className: "card__flag", text: hit.card.flag }),
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

  return screen;
}

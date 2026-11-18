import { el } from "../dom.js";

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

  return el("main", {
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
}

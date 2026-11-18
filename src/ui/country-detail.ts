import { el } from "../dom.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function joinNames(value: unknown): string {
  if (!Array.isArray(value)) {
    return "нет";
  }

  const names = value.flatMap((item) => {
    if (typeof item === "string") {
      return [item];
    }

    if (isRecord(item) && typeof item.name === "string") {
      return [item.name];
    }

    return [];
  });

  return names.length === 0 ? "нет" : names.join(", ");
}

export function renderCountryDetail(
  container: HTMLElement,
  raw: unknown,
): void {
  const country = isRecord(raw) ? raw : {};
  const name = typeof country.name === "string" ? country.name : "Страна";
  const area = typeof country.area === "number" ? String(country.area) : "нет";

  container.replaceChildren(
    el("h2", { text: name }),
    el("p", { text: `Площадь: ${area}` }),
    el("p", { text: `Границы: ${joinNames(country.borders)}` }),
    el("p", { text: `Языки: ${joinNames(country.languages)}` }),
    el("p", { text: `Валюта: ${joinNames(country.currencies)}` }),
  );
}

export type CountryCard = {
  name: string;
  flag: string;
  capital: string;
  region: string;
  population: number;
  languages: string[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function mapCountryResponse(raw: unknown): CountryCard {
  const country = isRecord(raw) ? raw : {};
  const languages = Array.isArray(country.languages)
    ? country.languages.flatMap((language) => {
        if (!isRecord(language) || typeof language.name !== "string") {
          return [];
        }
        return [language.name];
      })
    : [];

  return {
    name: readString(country.name),
    flag: readString(country.flag),
    capital: readString(country.capital),
    region: readString(country.region),
    population: typeof country.population === "number" ? country.population : 0,
    languages,
  };
}

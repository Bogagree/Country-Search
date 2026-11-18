export type CountryCard = {
  name: string;
  flag: string;
  capital: string;
  region: string;
  population: number;
  languages: string[];
};

export function mapCountryResponse(raw: unknown): CountryCard {
  void raw;
  throw new Error("not implemented");
}

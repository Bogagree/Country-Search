import { describe, expect, it } from "@jest/globals";

import { mapCountryResponse } from "./map-country.js";

const spain = {
  name: "Spain",
  flag: "🇪🇸",
  capital: "Madrid",
  region: "Europe",
  population: 47351567,
  languages: [
    {
      name: "Spanish",
      iso639_1: "es",
      iso639_2: "spa",
      nativeName: "Español",
    },
  ],
};

describe("mapCountryResponse", () => {
  it("maps the Spain payload to a card", () => {
    expect(mapCountryResponse(spain)).toEqual({
      name: "Spain",
      flag: "🇪🇸",
      capital: "Madrid",
      region: "Europe",
      population: 47351567,
      languages: ["Spanish"],
    });
  });
});

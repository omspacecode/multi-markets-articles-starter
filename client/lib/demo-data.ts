export const COUNTRY_CODES = ["dk", "se", "no", "de"] as const;
export type CountryCode = (typeof COUNTRY_CODES)[number];

export interface Country {
  code: CountryCode;
  name: string;
  locale: string;
}

export const COUNTRIES: Record<CountryCode, Country> = {
  dk: { code: "dk", name: "Denmark", locale: "da-DK" },
  se: { code: "se", name: "Sweden", locale: "sv-SE" },
  no: { code: "no", name: "Norway", locale: "nb-NO" },
  de: { code: "de", name: "Germany", locale: "de-DE" },
};

export const isCountryCode = (value: string | undefined | null): value is CountryCode =>
  !!value && (COUNTRY_CODES as readonly string[]).includes(value);

export const TARGET_GROUP_CODES = ["store", "office", "logistics", "leadership"] as const;
export type TargetGroup = (typeof TARGET_GROUP_CODES)[number];

export const TARGET_GROUP_LABELS: Record<string, string> = {
  all: "Everyone",
  store: "Store teams",
  office: "Head office",
  logistics: "Logistics",
  leadership: "Leadership",
};

export const COUNTRY_LABELS: Record<string, string> = {
  global: "All countries",
  dk: "Denmark",
  se: "Sweden",
  no: "Norway",
  de: "Germany",
};

export interface Persona {
  id: string;
  name: string;
  firstName: string;
  role: string;
  location: string;
  targetGroup: TargetGroup;
  /** Countries the person works in. The first one is their home country. */
  countries: CountryCode[];
  color: string;
}

/** Stand-ins for the profile your SSO / HR system would return at login. */
export const PERSONAS: Persona[] = [
  {
    id: "mette",
    name: "Mette Jensen",
    firstName: "Mette",
    role: "Store manager",
    location: "Copenhagen",
    targetGroup: "store",
    countries: ["dk", "se"],
    color: "#FF5C39",
  },
  {
    id: "lars",
    name: "Lars Eriksson",
    firstName: "Lars",
    role: "Regional marketing lead",
    location: "Stockholm",
    targetGroup: "office",
    countries: ["se", "dk", "no", "de"],
    color: "#0F4C3F",
  },
  {
    id: "ingrid",
    name: "Ingrid Berg",
    firstName: "Ingrid",
    role: "Warehouse shift lead",
    location: "Oslo",
    targetGroup: "logistics",
    countries: ["no"],
    color: "#B7791F",
  },
  {
    id: "katrin",
    name: "Katrin Vogel",
    firstName: "Katrin",
    role: "Country manager",
    location: "Hamburg",
    targetGroup: "leadership",
    countries: ["de", "dk"],
    color: "#3A3D45",
  },
];

export const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

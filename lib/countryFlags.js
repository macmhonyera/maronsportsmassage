import { COUNTRY_CALLING_CODES } from "./countryCallingCodes.js";

function normalizeCountryName(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isoToFlag(iso2) {
  if (!/^[A-Z]{2}$/.test(String(iso2))) return "🏳️";
  const [a, b] = iso2.split("");
  return String.fromCodePoint(127397 + a.charCodeAt(0), 127397 + b.charCodeAt(0));
}

const COUNTRY_NAME_ALIASES = {
  "antigua and barbuda": "AG",
  "bolivia plurinational state of bolivia": "BO",
  "bosnia and herzegovina": "BA",
  "brunei darussalam": "BN",
  "cocos keeling islands": "CC",
  "congo": "CG",
  "congo the democratic republic of the congo": "CD",
  "cote d ivoire": "CI",
  "czech republic": "CZ",
  "falkland islands malvinas": "FK",
  "heard island and mcdonald islands": "HM",
  "holy see vatican city state": "VA",
  "hong kong": "HK",
  "iran islamic republic of persian gulf": "IR",
  "korea democratic people s republic of korea": "KP",
  "korea republic of south korea": "KR",
  kosovo: "XK",
  laos: "LA",
  "libyan arab jamahiriya": "LY",
  macao: "MO",
  macedonia: "MK",
  "micronesia federated states of micronesia": "FM",
  moldova: "MD",
  myanmar: "MM",
  "netherlands antilles": "AN",
  "palestinian territory occupied": "PS",
  pitcairn: "PN",
  reunion: "RE",
  russia: "RU",
  "saint barthelemy": "BL",
  "saint helena ascension and tristan da cunha": "SH",
  "saint kitts and nevis": "KN",
  "saint lucia": "LC",
  "saint martin": "MF",
  "saint pierre and miquelon": "PM",
  "saint vincent and the grenadines": "VC",
  "sao tome and principe": "ST",
  "south georgia and the south sandwich islands": "GS",
  "svalbard and jan mayen": "SJ",
  swaziland: "SZ",
  "syrian arab republic": "SY",
  taiwan: "TW",
  "tanzania united republic of tanzania": "TZ",
  turkey: "TR",
  "trinidad and tobago": "TT",
  "turks and caicos islands": "TC",
  "venezuela bolivarian republic of venezuela": "VE",
  vietnam: "VN",
  "virgin islands british": "VG",
  "virgin islands u s": "VI",
  "wallis and futuna": "WF",
};

const REGION_NAME_TO_ISO2 = (() => {
  if (typeof Intl === "undefined" || typeof Intl.DisplayNames !== "function") {
    return new Map();
  }

  const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
  const map = new Map();

  for (let i = 65; i <= 90; i += 1) {
    for (let j = 65; j <= 90; j += 1) {
      const iso2 = String.fromCharCode(i, j);
      const regionName = displayNames.of(iso2);
      if (regionName && regionName !== iso2) {
        map.set(normalizeCountryName(regionName), iso2);
      }
    }
  }

  return map;
})();

function getCountryIso2(name) {
  const normalized = normalizeCountryName(name);
  return (
    COUNTRY_NAME_ALIASES[normalized] ||
    REGION_NAME_TO_ISO2.get(normalized) ||
    null
  );
}

export const COUNTRY_CALLING_CODES_WITH_FLAGS = COUNTRY_CALLING_CODES.map(
  (entry) => {
    const iso2 = getCountryIso2(entry.name);
    return {
      ...entry,
      iso2,
      flag: isoToFlag(iso2),
    };
  }
);

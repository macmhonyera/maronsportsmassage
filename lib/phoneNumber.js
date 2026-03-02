import { COUNTRY_DIAL_CODES_ITU } from "./countryCallingCodes.js";

export function sanitizeDigits(value) {
  return String(value ?? "").replace(/\D/g, "");
}

export function normalizeCountryDialCode(value) {
  const digits = sanitizeDigits(value);
  return digits || null;
}

export function normalizeNationalNumber(value, countryCodeDigits = "") {
  let digits = sanitizeDigits(value);
  if (!digits) return "";

  if (countryCodeDigits && digits.startsWith(countryCodeDigits)) {
    digits = digits.slice(countryCodeDigits.length);
  }

  return digits.replace(/^0+/, "");
}

export function normalizeToE164({ countryCode, phone }) {
  const countryCodeDigits = normalizeCountryDialCode(countryCode);
  if (!countryCodeDigits) return null;

  const localNumber = normalizeNationalNumber(phone, countryCodeDigits);
  if (!localNumber) return null;

  return `+${countryCodeDigits}${localNumber}`;
}

export function normalizeAnyToE164(value) {
  const input = String(value ?? "").trim();
  if (!input) return null;

  const normalized = input.startsWith("00") ? `+${input.slice(2)}` : input;
  const digits = sanitizeDigits(normalized);
  if (!digits) return null;

  return `+${digits}`;
}

export function splitE164(value) {
  const e164 = normalizeAnyToE164(value);
  if (!e164) return null;

  const digits = e164.slice(1);
  const countryCodeDigits = COUNTRY_DIAL_CODES_ITU.find((dialCode) => digits.startsWith(dialCode));

  if (!countryCodeDigits) return null;

  const localNumber = digits.slice(countryCodeDigits.length);
  if (!localNumber) return null;

  return {
    e164,
    countryCode: `+${countryCodeDigits}`,
    countryCodeDigits,
    localNumber,
  };
}

export function buildWhatsAppPayloadFromPhone(value, fallbackCountryCode) {
  const parsed = splitE164(value);
  if (parsed) {
    return {
      countryCode: parsed.countryCodeDigits,
      phone: parsed.localNumber,
      e164: parsed.e164,
    };
  }

  const fallback = normalizeCountryDialCode(fallbackCountryCode);
  if (!fallback) return null;

  const localNumber = normalizeNationalNumber(value, fallback);
  if (!localNumber) return null;

  return {
    countryCode: fallback,
    phone: localNumber,
    e164: `+${fallback}${localNumber}`,
  };
}

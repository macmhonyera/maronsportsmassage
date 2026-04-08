const BUSINESS_TZ = "Africa/Harare";

export function toISODate(d) {
  // returns YYYY-MM-DD in local time (safe for client-side use)
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Returns YYYY-MM-DD in Africa/Harare timezone (safe for server-side use)
export function toISODateHarare(d) {
  return new Date(d).toLocaleDateString("en-CA", { timeZone: BUSINESS_TZ });
}

// Returns HH:MM in Africa/Harare timezone (safe for server-side use)
export function toHHMMHarare(d) {
  return new Date(d).toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: BUSINESS_TZ,
  });
}

export function combineLocalDateAndTime(dateISO, timeHHMM) {
  // Input is business-local time (Africa/Harare = UTC+2, no DST).
  // Build an ISO string with the correct offset so the Date stores the right UTC instant.
  return new Date(`${dateISO}T${timeHHMM}:00+02:00`);
}

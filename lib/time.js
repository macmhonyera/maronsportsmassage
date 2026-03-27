export function toISODate(d) {
  // returns YYYY-MM-DD in local time
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function combineLocalDateAndTime(dateISO, timeHHMM) {
  // Input is business-local time (Africa/Harare = UTC+2, no DST).
  // Build an ISO string with the correct offset so the Date stores the right UTC instant.
  return new Date(`${dateISO}T${timeHHMM}:00+02:00`);
}

export const BOOKING_OPEN_MINUTES = 7 * 60; // 07:00
export const BOOKING_CLOSE_MINUTES = 20 * 60; // 20:00
export const APPOINTMENT_DURATION_MINUTES = 60;
export const BREAK_DURATION_MINUTES = 15;
export const BOOKING_SLOT_STEP_MINUTES =
  APPOINTMENT_DURATION_MINUTES + BREAK_DURATION_MINUTES;

function toHHMM(totalMinutes) {
  const hh = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const mm = String(totalMinutes % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function buildBookingSlots(
  startMinutes = BOOKING_OPEN_MINUTES,
  endMinutes = BOOKING_CLOSE_MINUTES,
  stepMinutes = BOOKING_SLOT_STEP_MINUTES
) {
  const slots = [];

  for (let minute = startMinutes; minute <= endMinutes; minute += stepMinutes) {
    slots.push(toHHMM(minute));
  }

  return slots;
}

export const BOOKING_TIME_SLOTS = buildBookingSlots();
const BOOKING_SLOT_SET = new Set(BOOKING_TIME_SLOTS);

export function isValidBookingTime(timeHHMM) {
  return BOOKING_SLOT_SET.has(timeHHMM);
}

export function timeToMinutes(timeHHMM) {
  if (typeof timeHHMM !== "string") return null;
  const [hh, mm] = timeHHMM.split(":").map(Number);
  if (!Number.isInteger(hh) || !Number.isInteger(mm)) return null;
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
  return hh * 60 + mm;
}

function parseISODateLocal(dateISO) {
  const [y, m, d] = String(dateISO || "")
    .split("-")
    .map(Number);

  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) {
    return null;
  }

  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

export function isPastBookingTime(dateISO, timeHHMM, now = new Date()) {
  const slotDate = parseISODateLocal(dateISO);
  const slotMinutes = timeToMinutes(timeHHMM);

  if (!slotDate || slotMinutes === null) return false;

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  if (slotDate.getTime() < today.getTime()) return true;
  if (slotDate.getTime() > today.getTime()) return false;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return slotMinutes <= nowMinutes;
}

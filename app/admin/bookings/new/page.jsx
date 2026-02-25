"use client";

import { useEffect, useMemo, useState } from "react";
import { toISODate } from "../../../../lib/time";

function todayISO() {
  return toISODate(new Date());
}

function buildSlots(startHH = 8, endHH = 18) {
  const slots = [];
  for (let h = startHH; h < endHH; h++) {
    slots.push(`${String(h).padStart(2, "0")}:15`);
  }
  return slots;
}

function StatusBanner({ status }) {
  if (!status || status.type === "idle") return null;

  const cls = [
    "rounded-lg border p-3 text-sm",
    status.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "",
    status.type === "error" ? "border-rose-200 bg-rose-50 text-rose-900" : "",
    status.type === "loading" ? "border-slate-200 bg-slate-50 text-slate-800" : "",
  ].join(" ");

  return (
    <div className={cls} role="status" aria-live="polite">
      {status.message}
    </div>
  );
}

export default function AdminNewBooking() {
  const [services, setServices] = useState([]);
  const [therapists, setTherapists] = useState([]);

  const [dateISO, setDateISO] = useState(todayISO());
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]);

  const [serviceId, setServiceId] = useState("");
  const [therapistId, setTherapistId] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappOptIn, setWhatsappOptIn] = useState(false);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const slots = useMemo(() => buildSlots(8, 18), []);

  useEffect(() => {
    (async () => {
      const [sRes, tRes] = await Promise.all([
        fetch("/api/public/services"),
        fetch("/api/public/therapists"),
      ]);
      const s = await sRes.json();
      const t = await tRes.json();
      setServices(s);
      setTherapists(t);
      const defaultOption = s.find((item) => item.category !== "addon") || s[0];
      if (defaultOption?.id) setServiceId(defaultOption.id);
    })();
  }, []);

  async function loadAvailability(d) {
    setSelectedTime("");
    const res = await fetch(
      `/api/bookings/availability?date=${encodeURIComponent(d)}`
    );
    const data = await res.json();
    setBookedTimes(Array.isArray(data.bookedTimes) ? data.bookedTimes : []);
  }

  useEffect(() => {
    loadAvailability(dateISO);
  }, [dateISO]);

  const isBooked = (time) => bookedTimes.includes(time);

  async function submit(e) {
    e.preventDefault();

    if (!selectedTime) {
      setStatus({ type: "error", message: "Please choose a time slot." });
      return;
    }

    setStatus({ type: "loading", message: "Creating booking..." });

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dateISO,
        timeHHMM: selectedTime,
        serviceId,
        therapistId: therapistId || null,
        client: { fullName, phone, email, whatsappOptIn },
        notes,
        source: "whatsapp",
        force: true,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setStatus({ type: "error", message: data?.error || "Failed." });
      return;
    }

    setStatus({ type: "success", message: "Booking created successfully." });
    await loadAvailability(dateISO);
  }

  const disableSubmit =
    !selectedTime || !serviceId || status.type === "loading";
  const regularServices = services.filter((s) => s.category !== "addon");
  const addOnServices = services.filter((s) => s.category === "addon");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Add Booking
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Create bookings received via WhatsApp, calls, or walk-ins.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Date + Slots */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900">
              Date & Time
            </h2>
            <div className="text-xs text-slate-500">
              Select a date, then choose a slot
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700">
              Date
            </label>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
              value={dateISO}
              onChange={(e) => setDateISO(e.target.value)}
            />
          </div>

          <div className="mt-5 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              Time slot
            </label>
            <span className="text-xs text-slate-500">
              Booked slots are highlighted
            </span>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.map((t) => {
              const booked = isBooked(t);
              const selected = selectedTime === t;

              const cls = [
                "rounded-lg border px-2 py-2 text-sm font-medium transition",
                "focus:outline-none focus:ring-2 focus:ring-slate-900",
                booked
                  ? "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100"
                  : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
                selected ? "border-slate-900 bg-slate-900 text-white hover:bg-slate-800" : "",
                disableSubmit && status.type === "loading" ? "opacity-70" : "",
              ].join(" ");

              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTime(t)}
                  className={cls}
                  title={booked ? "Booked (admin may override if needed)" : "Available"}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>{t}</span>
                  </div>
                  {booked ? (
                    <div className="mt-1 text-[11px] font-normal opacity-80">
                      booked
                    </div>
                  ) : (
                    <div className="mt-1 text-[11px] font-normal opacity-60">
                      available
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            Admin can intentionally double-book if needed. This UI highlights
            booked slots; your API uses <span className="font-semibold">force: true</span>.
          </div>
        </section>

        {/* Right: Booking Details */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900">
              Booking details
            </h2>
            <div className="text-xs text-slate-500">Client & service info</div>
          </div>

          <form onSubmit={submit} className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">
                  Service or add-on
                </label>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                >
                  {regularServices.length ? (
                    <optgroup label="Services">
                      {regularServices.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </optgroup>
                  ) : null}
                  {addOnServices.length ? (
                    <optgroup label="Add-ons">
                      {addOnServices.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </optgroup>
                  ) : null}
                </select>
                <p className="mt-1 text-xs text-slate-500">
                  Add-ons can be booked without selecting a full service.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">
                  Therapist (optional)
                </label>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                  value={therapistId}
                  onChange={(e) => setTherapistId(e.target.value)}
                >
                  <option value="">No preference</option>
                  {therapists.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Client name
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Client phone
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="Phone number"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">
                  Email (optional)
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                />
              </div>

              <div className="sm:col-span-2 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <input
                  id="optin"
                  type="checkbox"
                  checked={whatsappOptIn}
                  onChange={(e) => setWhatsappOptIn(e.target.checked)}
                  className="mt-0.5"
                />
                <label htmlFor="optin" className="text-sm text-slate-700">
                  Client opted in to WhatsApp reminders
                  <div className="mt-0.5 text-xs text-slate-500">
                    Consent should be recorded when applicable.
                  </div>
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">
                  Notes (optional)
                </label>
                <textarea
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything staff should know (injuries, preferences, etc.)"
                />
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-sm text-slate-700">
                <span className="font-semibold text-slate-900">Selected:</span>{" "}
                {dateISO}{" "}
                <span className="font-semibold text-slate-900">
                  {selectedTime || "(choose a slot)"}
                </span>
              </div>
            </div>

            <button
              className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={disableSubmit}
            >
              {status.type === "loading" ? "Creating..." : "Create booking"}
            </button>

            <StatusBanner status={status} />
          </form>
        </section>
      </div>
    </div>
  );
}

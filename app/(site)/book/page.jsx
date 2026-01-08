"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { toISODate } from "../../../lib/time";

function todayISO() {
  return toISODate(new Date());
}

function buildSlots(startHH = 8, endHH = 18, stepMin = 60) {
  const slots = [];
  for (let h = startHH; h < endHH; h++) {
    const hh = String(h).padStart(2, "0");
    const mm = "00";
    slots.push(`${hh}:${mm}`);
  }
  return slots;
}

export default function BookPage() {
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
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);
  const [notes, setNotes] = useState("");

  const [status, setStatus] = useState({ type: "idle", message: "" });

  const slots = useMemo(() => buildSlots(8, 18, 60), []);

  useEffect(() => {
    (async () => {
      const [sRes, tRes] = await Promise.all([fetch("/api/public/services"), fetch("/api/public/therapists")]);
      const s = await sRes.json();
      const t = await tRes.json();
      setServices(s);
      setTherapists(t);
      if (s?.[0]?.id) setServiceId(s[0].id);
    })();
  }, []);

  async function loadAvailability(d) {
    setSelectedTime("");
    const res = await fetch(`/api/bookings/availability?date=${encodeURIComponent(d)}`);
    const data = await res.json();
    setBookedTimes(Array.isArray(data.bookedTimes) ? data.bookedTimes : []);
  }

  useEffect(() => {
    loadAvailability(dateISO);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateISO]);

  const isBooked = (time) => bookedTimes.includes(time);

  async function submitBooking(e) {
    e.preventDefault();
    setStatus({ type: "loading", message: "Submitting booking..." });

    try {
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
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: "error", message: data?.error || "Booking failed." });
        return;
      }

      setStatus({ type: "success", message: "Booking created. We will confirm shortly." });
      await loadAvailability(dateISO);
    } catch (err) {
      setStatus({ type: "error", message: "Network error. Please try again." });
    }
  }

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0F172A] py-16 md:py-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&q=80"
            alt="Book online"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">Book Online</h1>
            <p className="mt-4 text-lg text-slate-200 sm:text-xl">
              Select a date to see which time slots are already booked. Choose an available slot, then complete your details.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Date & Time Selection */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-bold text-[#0F172A] mb-2">1) Pick a date</h2>
              <input
                type="date"
                className="mt-4 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[#0F172A] focus:border-[#14B8A6] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20"
                value={dateISO}
                min={todayISO()}
                onChange={(e) => setDateISO(e.target.value)}
              />

              <h2 className="text-2xl font-bold text-[#0F172A] mt-8 mb-2">2) Available time slots</h2>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {slots.map((t) => {
                  const booked = isBooked(t);
                  const selected = selectedTime === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={booked}
                      onClick={() => setSelectedTime(t)}
                      className={[
                        "rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                        booked
                          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-[#64748B]"
                          : selected
                          ? "border-[#0F172A] bg-[#0F172A] text-white shadow-md"
                          : "border-[#14B8A6] bg-white text-[#0F172A] hover:bg-[#14B8A6] hover:text-white",
                      ].join(" ")}
                      title={booked ? "Booked" : "Available"}
                    >
                      {t} {booked ? "•" : ""}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm text-[#64748B]">
                Note: This is a single-location calendar. Admin bookings (including WhatsApp) also block slots.
              </div>
            </div>

            {/* Booking Details Form */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-bold text-[#0F172A] mb-6">3) Your booking details</h2>

              <form onSubmit={submitBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-1">Service</label>
                  <select
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[#0F172A] focus:border-[#14B8A6] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20"
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-1">Therapist (optional)</label>
                  <select
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[#0F172A] focus:border-[#14B8A6] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20"
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-[#0F172A] mb-1">Full name</label>
                    <input
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[#0F172A] focus:border-[#14B8A6] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0F172A] mb-1">Phone</label>
                    <input
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[#0F172A] focus:border-[#14B8A6] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-1">Email (optional)</label>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[#0F172A] focus:border-[#14B8A6] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <input
                    id="optin"
                    type="checkbox"
                    checked={whatsappOptIn}
                    onChange={(e) => setWhatsappOptIn(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-[#14B8A6] focus:ring-[#14B8A6]"
                  />
                  <label htmlFor="optin" className="text-sm text-[#64748B]">
                    I agree to receive WhatsApp reminders (optional)
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-1">Notes (optional)</label>
                  <textarea
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[#0F172A] focus:border-[#14B8A6] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 resize-none"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm">
                    <span className="font-semibold text-[#0F172A]">Selected:</span>{" "}
                    <span className="text-[#64748B]">
                      {dateISO} {selectedTime || "(choose a time slot)"}
                    </span>
                  </div>
                </div>

                <button
                  className="w-full rounded-lg bg-[#14B8A6] px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#0D9488] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!selectedTime || !serviceId || status.type === "loading"}
                >
                  {status.type === "loading" ? "Submitting..." : "Confirm Booking Request"}
                </button>

                {status.type !== "idle" && (
                  <div
                    className={[
                      "rounded-lg p-4 text-sm",
                      status.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "",
                      status.type === "error" ? "bg-red-50 text-red-800 border border-red-200" : "",
                      status.type === "loading" ? "bg-slate-50 text-[#64748B] border border-slate-200" : "",
                    ].join(" ")}
                  >
                    {status.message}
                  </div>
                )}

                <p className="text-xs text-[#64748B]">
                  By booking, you agree to the{" "}
                  <a href="/terms" className="text-[#14B8A6] font-semibold hover:underline">
                    terms and conditions
                  </a>
                  .
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

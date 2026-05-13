"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toISODate } from "../../../lib/time";
import { BOOKING_TIME_SLOTS, isPastBookingTime } from "../../../lib/bookingSlots";
import { COUNTRY_CALLING_CODES_WITH_FLAGS } from "../../../lib/countryFlags.js";
import { ADD_ON_SERVICES, FOCUS_AREA_GROUPS } from "../../../lib/bookables.js";
import {
  STEPS,
  THERAPIST_OPTIONS,
  buildServiceGroups,
  priceLabel,
  serviceAllowsAddOns,
} from "../../../lib/serviceGroups.js";

function todayISO() {
  return toISODate(new Date());
}

export default function BookPage() {
  const router = useRouter();
  const slots = BOOKING_TIME_SLOTS;

  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [durationMin, setDurationMin] = useState(null);
  const [focusAreas, setFocusAreas] = useState([]);
  const [addOns, setAddOns] = useState([]);

  const [therapistPreference, setTherapistPreference] = useState("any");
  const [dateISO, setDateISO] = useState(todayISO());
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]);

  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);
  const [notes, setNotes] = useState("");

  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [nowTick, setNowTick] = useState(() => Date.now());

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/public/services");
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    })();
  }, []);

  const serviceGroups = useMemo(() => buildServiceGroups(services), [services]);
  const selectedGroup = serviceGroups.find((g) => g.id === selectedGroupId) || null;
  const selectedStyle = selectedGroup?.styles?.find((s) => s.serviceName === serviceName) || null;
  const durationsForSelection = selectedStyle?.durations || selectedGroup?.durations || [];
  const selectedDuration =
    durationsForSelection.find((d) => d.durationMin === durationMin) || null;
  const serviceId = selectedDuration?.id || "";
  const displayServiceName = selectedStyle
    ? `${selectedGroup.title} · ${selectedStyle.name}`
    : selectedGroup?.title || serviceName;

  async function loadAvailability(d) {
    setSelectedTime("");
    const res = await fetch(`/api/bookings/availability?date=${encodeURIComponent(d)}`);
    const data = await res.json();
    setBookedTimes(Array.isArray(data.bookedTimes) ? data.bookedTimes : []);
  }

  useEffect(() => {
    if (step === 5) loadAvailability(dateISO);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateISO, step]);

  useEffect(() => {
    const timer = setInterval(() => setNowTick(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedTime && isPastBookingTime(dateISO, selectedTime, new Date(nowTick))) {
      setSelectedTime("");
    }
  }, [dateISO, selectedTime, nowTick]);

  const isBooked = (time) => bookedTimes.includes(time);
  const isPast = (time) => isPastBookingTime(dateISO, time, new Date(nowTick));

  function toggleArrayValue(setter, current, value) {
    setter(current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
  }

  const addOnsEnabled = serviceAllowsAddOns(serviceName);

  // Drop any selected add-ons when switching to a service that doesn't support them.
  useEffect(() => {
    if (!addOnsEnabled && addOns.length > 0) setAddOns([]);
  }, [addOnsEnabled, addOns.length]);

  function canAdvance() {
    if (step === 1) return Boolean(serviceName);
    if (step === 2) return Boolean(durationMin && serviceId);
    if (step === 3) return true;
    if (step === 4) return true;
    if (step === 5) return Boolean(selectedTime);
    return true;
  }

  function goNext() {
    if (!canAdvance()) return;
    let next = step + 1;
    if (next === 4 && !addOnsEnabled) next = 5;
    if (next <= STEPS.length) setStep(next);
  }

  function goBack() {
    let prev = step - 1;
    if (prev === 4 && !addOnsEnabled) prev = 3;
    if (prev >= 1) setStep(prev);
  }

  async function submitBooking(e) {
    e.preventDefault();
    if (!serviceId || !selectedTime) {
      setStatus({ type: "error", message: "Please complete all required steps." });
      return;
    }
    setStatus({ type: "loading", message: "Submitting booking..." });

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dateISO,
          timeHHMM: selectedTime,
          serviceId,
          therapistPreference,
          focusAreas,
          addOns,
          client: { fullName, countryCode, phone, email, whatsappOptIn },
          notes,
          source: "website",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: "error", message: data?.error || "Booking failed." });
        return;
      }

      setStatus({ type: "success", message: "Booking received. Redirecting..." });
      router.push("/book/thank-you");
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." });
    }
  }

  return (
    <div className="space-y-0">
      <section className="relative overflow-hidden bg-[#0F172A] pt-28 pb-10 sm:pt-32 sm:pb-12 md:pt-36 md:pb-16">
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
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Book Online
            </h1>
            <p className="mt-3 text-base text-slate-200 sm:text-lg">
              A guided booking — tell us what you need before you arrive, and your therapist will be ready.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 md:py-14">
        <div className="mx-auto max-w-3xl px-4">
          <ProgressBar step={step} skippedStepIds={addOnsEnabled ? [] : [4]} />

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            {step === 1 && (
              <StepService
                groups={serviceGroups}
                selectedGroupId={selectedGroupId}
                serviceName={serviceName}
                onSelectGroup={(group) => {
                  setSelectedGroupId(group.id);
                  setDurationMin(null);
                  if (group.styles) {
                    setServiceName("");
                  } else {
                    setServiceName(group.serviceName);
                  }
                }}
                onSelectStyle={(style) => {
                  setServiceName(style.serviceName);
                  setDurationMin(null);
                }}
              />
            )}

            {step === 2 && (
              <StepDuration
                label={displayServiceName}
                durations={durationsForSelection}
                value={durationMin}
                onChange={setDurationMin}
              />
            )}

            {step === 3 && (
              <StepFocusAreas
                value={focusAreas}
                onToggle={(id) => toggleArrayValue(setFocusAreas, focusAreas, id)}
              />
            )}

            {step === 4 && (
              <StepAddOns
                value={addOns}
                onToggle={(id) => toggleArrayValue(setAddOns, addOns, id)}
              />
            )}

            {step === 5 && (
              <StepDateTime
                dateISO={dateISO}
                onDateChange={setDateISO}
                slots={slots}
                selectedTime={selectedTime}
                onSelectTime={setSelectedTime}
                isBooked={isBooked}
                isPast={isPast}
              />
            )}

            {step === 6 && (
              <StepDetails
                summary={{
                  serviceName: displayServiceName,
                  durationMin,
                  priceCents: selectedDuration?.priceCents,
                  focusAreas,
                  addOns,
                  dateISO,
                  selectedTime,
                }}
                therapistPreference={therapistPreference}
                onTherapistChange={setTherapistPreference}
                fullName={fullName}
                onFullName={setFullName}
                countryCode={countryCode}
                onCountryCode={setCountryCode}
                phone={phone}
                onPhone={setPhone}
                email={email}
                onEmail={setEmail}
                whatsappOptIn={whatsappOptIn}
                onWhatsappOptIn={setWhatsappOptIn}
                notes={notes}
                onNotes={setNotes}
                onSubmit={submitBooking}
                status={status}
              />
            )}

            {step !== 6 && (
              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 1}
                  className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[#0F172A] transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ← Back
                </button>
                <div className="text-xs text-[#64748B]">
                  Step {step} of {STEPS.length}
                </div>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canAdvance()}
                  className="rounded-lg bg-[#14B8A6] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#0D9488] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {step === 3 && focusAreas.length === 0
                    ? "Skip →"
                    : step === 4 && addOns.length === 0
                    ? "Skip →"
                    : "Next →"}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProgressBar({ step, skippedStepIds = [] }) {
  const skipped = new Set(skippedStepIds);
  return (
    <div className="flex items-center justify-between gap-1 sm:gap-2">
      {STEPS.map((s, idx) => {
        const isSkipped = skipped.has(s.id);
        const isActive = step === s.id;
        const isDone = step > s.id;
        return (
          <div key={s.id} className="flex flex-1 items-center gap-1 sm:gap-2">
            <div
              className={[
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                isSkipped
                  ? "bg-slate-100 text-slate-300 line-through"
                  : isActive
                  ? "bg-[#14B8A6] text-white"
                  : isDone
                  ? "bg-[#0F172A] text-white"
                  : "bg-slate-100 text-[#64748B]",
              ].join(" ")}
              aria-label={isSkipped ? `${s.label} (skipped)` : s.label}
            >
              {isSkipped ? "—" : isDone ? "✓" : s.id}
            </div>
            <div
              className={[
                "hidden text-xs font-medium md:block",
                isSkipped ? "text-slate-300 line-through" : "text-[#0F172A]",
              ].join(" ")}
            >
              {s.label}
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={[
                  "h-0.5 flex-1 rounded-full",
                  isDone ? "bg-[#0F172A]" : "bg-slate-200",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StepService({ groups, selectedGroupId, serviceName, onSelectGroup, onSelectStyle }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-[#0F172A] sm:text-2xl">Choose your service</h2>
      <p className="mt-1 text-sm text-[#64748B]">Pick the treatment style that fits what you need today.</p>

      <div className="mt-6 grid gap-3">
        {groups.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-[#64748B]">
            Loading services…
          </div>
        )}
        {groups.map((g) => {
          const isOpen = selectedGroupId === g.id;
          const isDirectSelected = !g.styles && isOpen;
          return (
            <div key={g.id}>
              <button
                type="button"
                onClick={() => onSelectGroup(g)}
                className={[
                  "flex w-full items-start gap-4 rounded-xl border-2 px-5 py-4 text-left transition-all",
                  isOpen
                    ? "border-[#14B8A6] bg-[#14B8A6]/5"
                    : "border-slate-200 bg-white hover:border-[#14B8A6]/40",
                ].join(" ")}
              >
                <div
                  className={[
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                    isDirectSelected || (g.styles && serviceName)
                      ? "border-[#14B8A6] bg-[#14B8A6]"
                      : isOpen
                      ? "border-[#14B8A6] bg-white"
                      : "border-slate-300 bg-white",
                  ].join(" ")}
                >
                  {(isDirectSelected || (g.styles && isOpen && serviceName)) && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-[#0F172A]">{g.title}</span>
                    {g.styles && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                        Choose modality
                      </span>
                    )}
                  </div>
                  {g.description && (
                    <div className="mt-1 text-sm text-[#64748B]">{g.description}</div>
                  )}
                </div>
              </button>

              {g.styles && isOpen && (
                <div className="mt-3 ml-4 grid gap-2 border-l-2 border-[#14B8A6]/30 pl-4 sm:grid-cols-2">
                  {g.styles.map((s) => {
                    const styleSelected = serviceName === s.serviceName;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => onSelectStyle(s)}
                        className={[
                          "flex items-start gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all",
                          styleSelected
                            ? "border-[#14B8A6] bg-[#14B8A6]/5"
                            : "border-slate-200 bg-white hover:border-[#14B8A6]/40",
                        ].join(" ")}
                      >
                        <div
                          className={[
                            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                            styleSelected ? "border-[#14B8A6] bg-[#14B8A6]" : "border-slate-300 bg-white",
                          ].join(" ")}
                        >
                          {styleSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-[#0F172A]">{s.name}</div>
                          {s.description && (
                            <div className="mt-0.5 text-xs text-[#64748B]">{s.description}</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepDuration({ label, durations, value, onChange }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-[#0F172A] sm:text-2xl">Choose your session length</h2>
      <p className="mt-1 text-sm text-[#64748B]">
        {label ? `Pricing for ${label}` : "Pricing"}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {durations.map((d) => {
          const selected = value === d.durationMin;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => onChange(d.durationMin)}
              className={[
                "flex flex-col items-center justify-center rounded-xl border-2 px-4 py-6 transition-all",
                selected
                  ? "border-[#14B8A6] bg-[#14B8A6]/5"
                  : "border-slate-200 bg-white hover:border-[#14B8A6]/40",
              ].join(" ")}
            >
              <div className="text-lg font-bold text-[#0F172A]">{d.durationMin} min</div>
              <div className="mt-1 text-2xl font-bold text-[#14B8A6]">{priceLabel(d.priceCents)}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepFocusAreas({ value, onToggle }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-[#0F172A] sm:text-2xl">Where would you like us to focus?</h2>
      <p className="mt-1 text-sm text-[#64748B]">
        Tell us your problem areas so your therapist is ready before you arrive. Skip if you&apos;d rather decide on the day.
      </p>

      <div className="mt-6 space-y-6">
        {FOCUS_AREA_GROUPS.map((group) => (
          <div key={group.id}>
            <div className="text-sm font-semibold text-[#0F172A]">{group.label}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {group.areas.map((area) => {
                const selected = value.includes(area.id);
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => onToggle(area.id)}
                    className={[
                      "rounded-full border-2 px-4 py-2 text-sm font-medium transition-all",
                      selected
                        ? "border-[#14B8A6] bg-[#14B8A6] text-white"
                        : "border-slate-200 bg-white text-[#0F172A] hover:border-[#14B8A6]/40",
                    ].join(" ")}
                  >
                    {area.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepAddOns({ value, onToggle }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-[#0F172A] sm:text-2xl">Optional extras</h2>
      <p className="mt-1 text-sm text-[#64748B]">
        Add these to your session at no extra cost. Skip if you don&apos;t want either.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {ADD_ON_SERVICES.map((a) => {
          const selected = value.includes(a.id);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => onToggle(a.id)}
              className={[
                "flex items-start gap-3 rounded-xl border-2 px-5 py-4 text-left transition-all",
                selected
                  ? "border-[#14B8A6] bg-[#14B8A6]/5"
                  : "border-slate-200 bg-white hover:border-[#14B8A6]/40",
              ].join(" ")}
            >
              <div
                className={[
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2",
                  selected ? "border-[#14B8A6] bg-[#14B8A6]" : "border-slate-300 bg-white",
                ].join(" ")}
              >
                {selected && (
                  <svg viewBox="0 0 16 16" fill="white" className="h-3 w-3">
                    <path d="M13.485 4.515a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L6.778 9.808l5.293-5.293a1 1 0 0 1 1.414 0z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-[#0F172A]">{a.name}</span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    Free
                  </span>
                </div>
                <div className="mt-1 text-sm text-[#64748B]">{a.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepDateTime({ dateISO, onDateChange, slots, selectedTime, onSelectTime, isBooked, isPast }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-[#0F172A] sm:text-2xl">Pick a date and time</h2>
      <p className="mt-1 text-sm text-[#64748B]">Greyed-out slots are already booked or in the past.</p>

      <div className="mt-6">
        <label className="block text-sm font-semibold text-[#0F172A] mb-2">Date</label>
        <input
          type="date"
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[#0F172A] focus:border-[#14B8A6] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20"
          value={dateISO}
          min={todayISO()}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>

      <div className="mt-6">
        <label className="block text-sm font-semibold text-[#0F172A] mb-2">Available time slots</label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {slots.map((t) => {
            const booked = isBooked(t);
            const past = isPast(t);
            const selected = selectedTime === t;
            return (
              <button
                key={t}
                type="button"
                disabled={booked || past}
                onClick={() => onSelectTime(t)}
                className={[
                  "rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                  booked || past
                    ? "cursor-not-allowed border-slate-200 bg-slate-100 text-[#64748B]"
                    : selected
                    ? "border-[#0F172A] bg-[#0F172A] text-white shadow-md"
                    : "border-[#14B8A6] bg-white text-[#0F172A] hover:bg-[#14B8A6] hover:text-white",
                ].join(" ")}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StepDetails({
  summary,
  therapistPreference,
  onTherapistChange,
  fullName,
  onFullName,
  countryCode,
  onCountryCode,
  phone,
  onPhone,
  email,
  onEmail,
  whatsappOptIn,
  onWhatsappOptIn,
  notes,
  onNotes,
  onSubmit,
  status,
}) {
  const focusList = summary.focusAreas.length
    ? summary.focusAreas
        .map((id) => {
          const group = FOCUS_AREA_GROUPS.find((g) => g.areas.some((a) => a.id === id));
          const area = group?.areas.find((a) => a.id === id);
          return area?.label || id;
        })
        .join(", ")
    : "None";
  const addOnList = summary.addOns.length
    ? summary.addOns
        .map((id) => ADD_ON_SERVICES.find((a) => a.id === id)?.name || id)
        .join(", ")
    : "None";

  return (
    <div>
      <h2 className="text-xl font-bold text-[#0F172A] sm:text-2xl">Your details</h2>
      <p className="mt-1 text-sm text-[#64748B]">Last step — we just need a way to reach you.</p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
        <div className="font-semibold text-[#0F172A]">Your booking</div>
        <ul className="mt-2 space-y-1 text-[#64748B]">
          <li>
            <span className="font-medium text-[#0F172A]">Service:</span> {summary.serviceName || "—"}{" "}
            {summary.durationMin ? `· ${summary.durationMin} min` : ""}{" "}
            {summary.priceCents != null ? `· ${priceLabel(summary.priceCents)}` : ""}
          </li>
          <li>
            <span className="font-medium text-[#0F172A]">Focus areas:</span> {focusList}
          </li>
          <li>
            <span className="font-medium text-[#0F172A]">Add-ons:</span> {addOnList}
          </li>
          <li>
            <span className="font-medium text-[#0F172A]">When:</span> {summary.dateISO}{" "}
            {summary.selectedTime || "(choose a time)"}
          </li>
        </ul>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-1">Therapist preference</label>
          <select
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[#0F172A] focus:border-[#14B8A6] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20"
            value={therapistPreference}
            onChange={(e) => onTherapistChange(e.target.value)}
          >
            {THERAPIST_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_10.5rem_minmax(0,1fr)]">
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-1">Full name</label>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[#0F172A] focus:border-[#14B8A6] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20"
              value={fullName}
              onChange={(e) => onFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-1">Country code</label>
            <select
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[#0F172A] focus:border-[#14B8A6] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20"
              value={countryCode}
              onChange={(e) => onCountryCode(e.target.value)}
              required
            >
              <option value="">Select code</option>
              {COUNTRY_CALLING_CODES_WITH_FLAGS.map((entry) => (
                <option key={`${entry.name}-${entry.dialCode}`} value={entry.dialCode}>
                  {entry.flag} {entry.iso2 || "--"} ({entry.dialCode})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-1">Phone</label>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[#0F172A] focus:border-[#14B8A6] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20"
              value={phone}
              placeholder="e.g. 775432682"
              onChange={(e) => onPhone(e.target.value)}
              required
            />
            <p className="mt-1 text-xs text-[#64748B]">Local number only, without leading 0.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-1">Email</label>
          <input
            type="email"
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[#0F172A] focus:border-[#14B8A6] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20"
            value={email}
            onChange={(e) => onEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <input
            id="optin"
            type="checkbox"
            checked={whatsappOptIn}
            onChange={(e) => onWhatsappOptIn(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-[#14B8A6] focus:ring-[#14B8A6]"
          />
          <label htmlFor="optin" className="text-sm text-[#64748B]">
            I agree to receive WhatsApp reminders (optional)
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-1">
            Anything else we should know? (optional)
          </label>
          <textarea
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[#0F172A] focus:border-[#14B8A6] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 resize-none"
            rows={3}
            value={notes}
            onChange={(e) => onNotes(e.target.value)}
            placeholder="Injuries, recent surgeries, marathon prep, sciatica, posture issues, etc."
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-[#14B8A6] px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#0D9488] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!countryCode || status.type === "loading"}
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
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toISODate } from "../../../lib/time";
import { BOOKING_TIME_SLOTS, isPastBookingTime } from "../../../lib/bookingSlots";
import { COUNTRY_CALLING_CODES_WITH_FLAGS } from "../../../lib/countryFlags.js";
import { ADD_ON_SERVICES, FOCUS_AREA_GROUPS } from "../../../lib/bookables.js";
import {
  STEPS,
  THERAPIST_OPTIONS,
  buildServiceGroups,
  findGroupForServiceName,
  getDurationNote,
  priceLabel,
  serviceAllowsAddOns,
} from "../../../lib/serviceGroups.js";

function todayISO() {
  return toISODate(new Date());
}

function buildInitialValues(initialValues = {}) {
  return {
    dateISO: initialValues.dateISO || todayISO(),
    timeHHMM: initialValues.timeHHMM || "",
    serviceId: initialValues.serviceId || "",
    serviceName: initialValues.serviceName || "",
    therapistPreference: initialValues.therapistPreference || "any",
    therapistId: initialValues.therapistId || "",
    fullName: initialValues.fullName || "",
    countryCode: initialValues.countryCode || "",
    phone: initialValues.phone || "",
    email: initialValues.email || "",
    whatsappOptIn: Boolean(initialValues.whatsappOptIn),
    notes: initialValues.notes || "",
    focusAreas: Array.isArray(initialValues.focusAreas) ? initialValues.focusAreas : [],
    addOns: Array.isArray(initialValues.addOns) ? initialValues.addOns : [],
    bookingStatus: initialValues.bookingStatus || "PENDING",
  };
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

export default function BookingForm({
  mode = "create",
  bookingId = null,
  initialValues,
  initialOptions,
}) {
  const router = useRouter();
  const isEditing = mode === "edit";
  const initialFormValues = buildInitialValues(initialValues);

  const initialSlotRef = useRef({
    dateISO: initialFormValues.dateISO,
    timeHHMM: initialFormValues.timeHHMM,
  });
  const didLoadInitialAvailability = useRef(false);

  const [step, setStep] = useState(isEditing ? 6 : 1);
  const [services, setServices] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [catalogLoaded, setCatalogLoaded] = useState(false);

  const initialGroupId = useMemo(() => {
    const initName =
      initialFormValues.serviceName || initialOptions?.service?.name || "";
    const group = findGroupForServiceName(initName);
    return group?.id || "";
  }, [initialFormValues.serviceName, initialOptions?.service?.name]);

  const [selectedGroupId, setSelectedGroupId] = useState(initialGroupId);
  const [serviceName, setServiceName] = useState(
    initialFormValues.serviceName || initialOptions?.service?.name || ""
  );
  const [durationMin, setDurationMin] = useState(
    initialOptions?.service?.durationMin || null
  );

  const [focusAreas, setFocusAreas] = useState(initialFormValues.focusAreas);
  const [addOns, setAddOns] = useState(initialFormValues.addOns);

  const [dateISO, setDateISO] = useState(initialFormValues.dateISO);
  const [selectedTime, setSelectedTime] = useState(initialFormValues.timeHHMM);
  const [bookedTimes, setBookedTimes] = useState([]);

  const [therapistPreference, setTherapistPreference] = useState(
    initialFormValues.therapistPreference
  );
  const [therapistId, setTherapistId] = useState(initialFormValues.therapistId);

  const [fullName, setFullName] = useState(initialFormValues.fullName);
  const [countryCode, setCountryCode] = useState(initialFormValues.countryCode);
  const [phone, setPhone] = useState(initialFormValues.phone);
  const [email, setEmail] = useState(initialFormValues.email);
  const [whatsappOptIn, setWhatsappOptIn] = useState(initialFormValues.whatsappOptIn);
  const [notes, setNotes] = useState(initialFormValues.notes);

  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [nowTick, setNowTick] = useState(() => Date.now());

  const slots = BOOKING_TIME_SLOTS;

  useEffect(() => {
    let cancelled = false;
    async function loadCatalog() {
      try {
        const [servicesRes, therapistsRes] = await Promise.all([
          fetch("/api/public/services"),
          fetch("/api/public/therapists"),
        ]);
        const [servicesData, therapistsData] = await Promise.all([
          servicesRes.json(),
          therapistsRes.json(),
        ]);

        if (!servicesRes.ok) throw new Error(servicesData?.error || "Failed to load services.");
        if (!therapistsRes.ok) throw new Error(therapistsData?.error || "Failed to load therapists.");
        if (cancelled) return;

        setServices(Array.isArray(servicesData) ? servicesData : []);
        setTherapists(Array.isArray(therapistsData) ? therapistsData : []);
        setCatalogLoaded(true);
      } catch (err) {
        if (cancelled) return;
        setStatus({ type: "error", message: err?.message || "Failed to load booking form data." });
      }
    }
    loadCatalog();
    return () => {
      cancelled = true;
    };
  }, []);

  const serviceGroups = useMemo(() => buildServiceGroups(services), [services]);
  const selectedGroup = serviceGroups.find((g) => g.id === selectedGroupId) || null;
  const selectedStyle = selectedGroup?.styles?.find((s) => s.serviceName === serviceName) || null;
  const durationsForSelection = selectedStyle?.durations || selectedGroup?.durations || [];
  const selectedDuration = durationsForSelection.find((d) => d.durationMin === durationMin) || null;
  const serviceId = selectedDuration?.id || "";
  const displayServiceName = selectedStyle
    ? `${selectedGroup.title} · ${selectedStyle.name}`
    : selectedGroup?.title || serviceName;

  async function loadAvailability(nextDateISO, { preserveSelection = false } = {}) {
    if (!preserveSelection) setSelectedTime("");

    const params = new URLSearchParams({ date: nextDateISO });
    if (isEditing && bookingId) params.set("excludeBookingId", bookingId);

    const res = await fetch(`/api/bookings/availability?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Failed to load availability.");
    setBookedTimes(Array.isArray(data.bookedTimes) ? data.bookedTimes : []);
  }

  useEffect(() => {
    if (step !== 5) return;
    let cancelled = false;
    (async () => {
      try {
        const preserveSelection =
          !didLoadInitialAvailability.current &&
          Boolean(initialSlotRef.current.timeHHMM) &&
          dateISO === initialSlotRef.current.dateISO;
        await loadAvailability(dateISO, { preserveSelection });
      } catch (err) {
        if (cancelled) return;
        setStatus({ type: "error", message: err?.message || "Failed to load availability." });
      } finally {
        didLoadInitialAvailability.current = true;
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateISO, bookingId, isEditing, step]);

  useEffect(() => {
    const timer = setInterval(() => setNowTick(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  function isOriginalSlot(time) {
    return (
      isEditing &&
      dateISO === initialSlotRef.current.dateISO &&
      time === initialSlotRef.current.timeHHMM
    );
  }

  const isBooked = (time) => bookedTimes.includes(time);
  const isPast = (time) =>
    isOriginalSlot(time) ? false : isPastBookingTime(dateISO, time, new Date(nowTick));

  function toggleArrayValue(setter, current, value) {
    setter(current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
  }

  const addOnsEnabled = serviceAllowsAddOns(serviceName);

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

  function jumpToStep(target) {
    if (target < 1 || target > STEPS.length) return;
    if (target === 4 && !addOnsEnabled) return; // step is skipped for this service
    if (isEditing) {
      setStep(target);
      return;
    }
    // Create mode: only allow jumping back to visited steps (anything < current step)
    if (target <= step) setStep(target);
  }

  async function submit(e) {
    e.preventDefault();
    if (!serviceId) {
      setStatus({ type: "error", message: "Please choose a service." });
      setStep(1);
      return;
    }
    if (!selectedTime) {
      setStatus({ type: "error", message: "Please choose a time slot." });
      setStep(5);
      return;
    }

    setStatus({
      type: "loading",
      message: isEditing ? "Updating booking..." : "Creating booking...",
    });

    try {
      const endpoint = isEditing
        ? `/api/admin/bookings/${bookingId}`
        : "/api/admin/bookings";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dateISO,
          timeHHMM: selectedTime,
          serviceId,
          therapistPreference,
          therapistId: therapistId || null,
          focusAreas,
          addOns,
          client: { fullName, countryCode, phone, email, whatsappOptIn },
          notes,
          force: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: "error", message: data?.error || "Failed to save booking." });
        return;
      }

      setStatus({
        type: "success",
        message: isEditing ? "Booking updated. Redirecting..." : "Booking created. Redirecting...",
      });
      router.push("/admin/bookings");
    } catch (err) {
      setStatus({ type: "error", message: err?.message || "Network error. Please try again." });
    }
  }

  const disableSubmit =
    !selectedTime || !serviceId || !countryCode || !catalogLoaded || status.type === "loading";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {isEditing ? "Edit Booking" : "Add Booking"}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {isEditing
              ? "Update the appointment details and save your corrections."
              : "Create and approve bookings received via WhatsApp, calls, or walk-ins."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isEditing && (
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
              Status: {initialFormValues.bookingStatus}
            </span>
          )}
          <Link
            href="/admin/bookings"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to bookings
          </Link>
        </div>
      </div>

      <ProgressBar
        step={step}
        onJump={jumpToStep}
        isEditing={isEditing}
        skippedStepIds={addOnsEnabled ? [] : [4]}
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        {step === 1 && (
          <StepService
            groups={serviceGroups}
            selectedGroupId={selectedGroupId}
            serviceName={serviceName}
            onSelectGroup={(group) => {
              setSelectedGroupId(group.id);
              setDurationMin(null);
              if (group.styles) setServiceName("");
              else setServiceName(group.serviceName);
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
            serviceName={serviceName}
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
          <StepAdminDetails
            summary={{
              serviceName: displayServiceName,
              durationMin,
              durationNote: getDurationNote(serviceName, durationMin),
              priceCents: selectedDuration?.priceCents,
              focusAreas,
              addOns,
              dateISO,
              selectedTime,
            }}
            therapistPreference={therapistPreference}
            onTherapistPreferenceChange={setTherapistPreference}
            therapistId={therapistId}
            onTherapistIdChange={setTherapistId}
            therapists={therapists}
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
            onSubmit={submit}
            status={status}
            isEditing={isEditing}
            disableSubmit={disableSubmit}
          />
        )}

        {step !== 6 && (
          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 1}
              className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ← Back
            </button>
            <div className="text-xs text-slate-500">
              Step {step} of {STEPS.length}
            </div>
            <button
              type="button"
              onClick={goNext}
              disabled={!canAdvance()}
              className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
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
  );
}

function ProgressBar({ step, onJump, isEditing, skippedStepIds = [] }) {
  const skipped = new Set(skippedStepIds);
  return (
    <div className="flex items-center justify-between gap-1 sm:gap-2">
      {STEPS.map((s, idx) => {
        const isSkipped = skipped.has(s.id);
        const isActive = step === s.id;
        const isDone = step > s.id;
        const isClickable = !isSkipped && (isEditing || isDone || isActive);
        return (
          <div key={s.id} className="flex flex-1 items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => isClickable && onJump(s.id)}
              disabled={!isClickable}
              className={[
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                isClickable ? "cursor-pointer" : "cursor-not-allowed",
                isSkipped
                  ? "bg-slate-100 text-slate-300 line-through"
                  : isActive
                  ? "bg-slate-900 text-white ring-2 ring-slate-900/20"
                  : isDone
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-500",
              ].join(" ")}
              aria-label={`Step ${s.id}: ${s.label}${isSkipped ? " (skipped)" : ""}`}
            >
              {isSkipped ? "—" : isDone ? "✓" : s.id}
            </button>
            <div
              className={[
                "hidden text-xs font-medium md:block",
                isSkipped ? "text-slate-300 line-through" : "text-slate-900",
              ].join(" ")}
            >
              {s.label}
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={[
                  "h-0.5 flex-1 rounded-full",
                  isDone ? "bg-slate-900" : "bg-slate-200",
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
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Choose service</h2>
      <p className="mt-1 text-sm text-slate-600">Pick the treatment style for this booking.</p>

      <div className="mt-6 grid gap-3">
        {groups.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
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
                    ? "border-slate-900 bg-slate-50"
                    : "border-slate-200 bg-white hover:border-slate-400",
                ].join(" ")}
              >
                <div
                  className={[
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                    isDirectSelected || (g.styles && serviceName)
                      ? "border-slate-900 bg-slate-900"
                      : isOpen
                      ? "border-slate-900 bg-white"
                      : "border-slate-300 bg-white",
                  ].join(" ")}
                >
                  {(isDirectSelected || (g.styles && isOpen && serviceName)) && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-slate-900">{g.title}</span>
                    {g.styles && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                        Choose Intensity
                      </span>
                    )}
                  </div>
                  {g.description && (
                    <div className="mt-1 text-sm text-slate-600">{g.description}</div>
                  )}
                </div>
              </button>

              {g.styles && isOpen && (
                <div className="mt-3 ml-4 grid gap-2 border-l-2 border-slate-300 pl-4 sm:grid-cols-2">
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
                            ? "border-slate-900 bg-slate-50"
                            : "border-slate-200 bg-white hover:border-slate-400",
                        ].join(" ")}
                      >
                        <div
                          className={[
                            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                            styleSelected ? "border-slate-900 bg-slate-900" : "border-slate-300 bg-white",
                          ].join(" ")}
                        >
                          {styleSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-slate-900">{s.name}</div>
                          {s.description && (
                            <div className="mt-0.5 text-xs text-slate-600">{s.description}</div>
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

function StepDuration({ label, serviceName, durations, value, onChange }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Choose session length</h2>
      <p className="mt-1 text-sm text-slate-600">{label ? `Pricing for ${label}` : "Pricing"}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {durations.map((d) => {
          const selected = value === d.durationMin;
          const note = getDurationNote(serviceName, d.durationMin);
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => onChange(d.durationMin)}
              className={[
                "flex flex-col items-center justify-center rounded-xl border-2 px-4 py-6 transition-all",
                selected
                  ? "border-slate-900 bg-slate-50"
                  : "border-slate-200 bg-white hover:border-slate-400",
              ].join(" ")}
            >
              <div className="text-lg font-bold text-slate-900">{d.durationMin} min</div>
              {note && <div className="mt-0.5 text-xs font-medium text-slate-500">({note})</div>}
              <div className="mt-1 text-2xl font-bold text-slate-900">{priceLabel(d.priceCents)}</div>
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
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Focus areas</h2>
      <p className="mt-1 text-sm text-slate-600">
        Mark problem areas the client mentioned. Skip if none specified.
      </p>

      <div className="mt-6 space-y-6">
        {FOCUS_AREA_GROUPS.map((group) => (
          <div key={group.id}>
            <div className="text-sm font-semibold text-slate-900">{group.label}</div>
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
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-900 hover:border-slate-400",
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
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Free extras</h2>
      <p className="mt-1 text-sm text-slate-600">
        Cupping or Hot Stones at no extra cost. Skip if none.
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
                  ? "border-slate-900 bg-slate-50"
                  : "border-slate-200 bg-white hover:border-slate-400",
              ].join(" ")}
            >
              <div
                className={[
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2",
                  selected ? "border-slate-900 bg-slate-900" : "border-slate-300 bg-white",
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
                  <span className="text-base font-semibold text-slate-900">{a.name}</span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    Free
                  </span>
                </div>
                <div className="mt-1 text-sm text-slate-600">{a.description}</div>
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
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Date & time</h2>
      <p className="mt-1 text-sm text-slate-600">
        Booked slots stay selectable so admin can override (force-book).
      </p>

      <div className="mt-6">
        <label className="block text-sm font-semibold text-slate-900 mb-2">Date</label>
        <input
          type="date"
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none"
          value={dateISO}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>

      <div className="mt-6">
        <label className="block text-sm font-semibold text-slate-900 mb-2">Time slot</label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {slots.map((time) => {
            const booked = isBooked(time);
            const past = isPast(time);
            const selected = selectedTime === time;
            const cls = [
              "rounded-lg border px-2 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-900",
              past
                ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                : booked
                ? "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100"
                : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
              selected && !past ? "border-slate-900 bg-slate-900 text-white hover:bg-slate-800" : "",
            ].join(" ");
            return (
              <button
                key={time}
                type="button"
                disabled={past}
                onClick={() => onSelectTime(time)}
                className={cls}
                title={
                  past
                    ? "Past time"
                    : booked
                    ? "Booked (admin may override)"
                    : "Available"
                }
              >
                <div>{time}</div>
                <div className="mt-0.5 text-[11px] font-normal opacity-70">
                  {past ? "past" : booked ? "booked" : "available"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
        Admin can intentionally double-book if needed. Occupied slots are highlighted in amber.
      </div>
    </div>
  );
}

function StepAdminDetails({
  summary,
  therapistPreference,
  onTherapistPreferenceChange,
  therapistId,
  onTherapistIdChange,
  therapists,
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
  isEditing,
  disableSubmit,
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
    ? summary.addOns.map((id) => ADD_ON_SERVICES.find((a) => a.id === id)?.name || id).join(", ")
    : "None";

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Client & therapist details</h2>
      <p className="mt-1 text-sm text-slate-600">
        Fill in client contact info and (optionally) assign a therapist.
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
        <div className="font-semibold text-slate-900">Booking summary</div>
        <ul className="mt-2 space-y-1 text-slate-600">
          <li>
            <span className="font-medium text-slate-900">Service:</span> {summary.serviceName || "—"}{" "}
            {summary.durationMin
              ? `· ${summary.durationMin} min${summary.durationNote ? ` (${summary.durationNote})` : ""}`
              : ""}{" "}
            {summary.priceCents != null ? `· ${priceLabel(summary.priceCents)}` : ""}
          </li>
          <li>
            <span className="font-medium text-slate-900">Focus areas:</span> {focusList}
          </li>
          <li>
            <span className="font-medium text-slate-900">Add-ons:</span> {addOnList}
          </li>
          <li>
            <span className="font-medium text-slate-900">When:</span> {summary.dateISO}{" "}
            {summary.selectedTime || "(choose a time)"}
          </li>
        </ul>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1">
              Therapist preference
            </label>
            <select
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none"
              value={therapistPreference}
              onChange={(e) => onTherapistPreferenceChange(e.target.value)}
            >
              {THERAPIST_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1">
              Assigned therapist (optional)
            </label>
            <select
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none"
              value={therapistId}
              onChange={(e) => onTherapistIdChange(e.target.value)}
            >
              <option value="">No therapist assigned</option>
              {therapists.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-1">Client name</label>
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none"
            value={fullName}
            onChange={(e) => onFullName(e.target.value)}
            required
            placeholder="Full name"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-[10.5rem_minmax(0,1fr)]">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1">Country code</label>
            <select
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none"
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
            <label className="block text-sm font-semibold text-slate-900 mb-1">Phone</label>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none"
              value={phone}
              placeholder="e.g. 775432682"
              onChange={(e) => onPhone(e.target.value)}
              required
            />
            <p className="mt-1 text-xs text-slate-500">Local number only, without leading 0.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-1">Email</label>
          <input
            type="email"
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none"
            value={email}
            onChange={(e) => onEmail(e.target.value)}
            placeholder="name@email.com"
            required
          />
        </div>

        <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <input
            id="optin"
            type="checkbox"
            checked={whatsappOptIn}
            onChange={(e) => onWhatsappOptIn(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
          />
          <label htmlFor="optin" className="text-sm text-slate-600">
            Client opted in to WhatsApp reminders
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-1">Notes (optional)</label>
          <textarea
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none resize-none"
            rows={3}
            value={notes}
            onChange={(e) => onNotes(e.target.value)}
            placeholder="Anything staff should know (injuries, preferences, etc.)"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={disableSubmit}
          >
            {status.type === "loading"
              ? isEditing
                ? "Saving..."
                : "Creating..."
              : isEditing
              ? "Save changes"
              : "Create booking"}
          </button>
          {isEditing && (
            <Link
              href="/admin/bookings"
              className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Cancel
            </Link>
          )}
        </div>

        <StatusBanner status={status} />
      </form>
    </div>
  );
}

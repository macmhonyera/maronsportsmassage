"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toISODate } from "../../../lib/time";
import {
  BOOKING_TIME_SLOTS,
  isPastBookingTime,
} from "../../../lib/bookingSlots";
import { COUNTRY_CALLING_CODES_WITH_FLAGS } from "../../../lib/countryFlags.js";

const THERAPIST_OPTIONS = [
  { id: "any", label: "Anyone Available" },
  { id: "male", label: "Male Therapist" },
  { id: "female", label: "Female Therapist" },
];

function todayISO() {
  return toISODate(new Date());
}

function buildInitialValues(initialValues = {}) {
  return {
    dateISO: initialValues.dateISO || todayISO(),
    timeHHMM: initialValues.timeHHMM || "",
    serviceId: initialValues.serviceId || "",
    therapistPreference: initialValues.therapistPreference || "any",
    therapistId: initialValues.therapistId || "",
    fullName: initialValues.fullName || "",
    countryCode: initialValues.countryCode || "",
    phone: initialValues.phone || "",
    email: initialValues.email || "",
    whatsappOptIn: Boolean(initialValues.whatsappOptIn),
    notes: initialValues.notes || "",
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

function ensureOptionPresent(list, option, categoryFallback) {
  if (!option?.id) return list;
  if (list.some((item) => item.id === option.id)) return list;

  return [
    {
      ...option,
      category: option.category || categoryFallback,
    },
    ...list,
  ];
}

export default function BookingForm({
  mode = "create",
  bookingId = null,
  initialValues,
  initialOptions,
}) {
  const router = useRouter();
  const initialFormValues = buildInitialValues(initialValues);
  const initialSlotRef = useRef({
    dateISO: initialFormValues.dateISO,
    timeHHMM: initialFormValues.timeHHMM,
  });
  const didLoadInitialAvailability = useRef(false);

  const [services, setServices] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [catalogLoaded, setCatalogLoaded] = useState(false);

  const [dateISO, setDateISO] = useState(initialFormValues.dateISO);
  const [selectedTime, setSelectedTime] = useState(initialFormValues.timeHHMM);
  const [bookedTimes, setBookedTimes] = useState([]);

  const [serviceId, setServiceId] = useState(initialFormValues.serviceId);
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
  const isEditing = mode === "edit";

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

        if (!servicesRes.ok) {
          throw new Error(servicesData?.error || "Failed to load services.");
        }

        if (!therapistsRes.ok) {
          throw new Error(therapistsData?.error || "Failed to load therapists.");
        }

        if (cancelled) return;

        const nextServices = ensureOptionPresent(
          Array.isArray(servicesData) ? servicesData : [],
          initialOptions?.service,
          "service"
        );
        const nextTherapists = ensureOptionPresent(
          Array.isArray(therapistsData) ? therapistsData : [],
          initialOptions?.therapist,
          "therapist"
        );

        setServices(nextServices);
        setTherapists(nextTherapists);
        setServiceId((current) => {
          if (current) return current;
          const defaultOption =
            nextServices.find((item) => item.category !== "addon") || nextServices[0];
          return defaultOption?.id || "";
        });
        setCatalogLoaded(true);
      } catch (err) {
        if (cancelled) return;
        setStatus({
          type: "error",
          message: err?.message || "Failed to load booking form data.",
        });
      }
    }

    loadCatalog();

    return () => {
      cancelled = true;
    };
  }, [initialOptions?.service, initialOptions?.therapist]);

  async function loadAvailability(nextDateISO, { preserveSelection = false } = {}) {
    if (!preserveSelection) {
      setSelectedTime("");
    }

    const params = new URLSearchParams({ date: nextDateISO });
    if (isEditing && bookingId) {
      params.set("excludeBookingId", bookingId);
    }

    const res = await fetch(`/api/bookings/availability?${params.toString()}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Failed to load availability.");
    }

    setBookedTimes(Array.isArray(data.bookedTimes) ? data.bookedTimes : []);
  }

  useEffect(() => {
    let cancelled = false;

    async function syncAvailability() {
      try {
        const preserveSelection =
          !didLoadInitialAvailability.current &&
          Boolean(initialSlotRef.current.timeHHMM) &&
          dateISO === initialSlotRef.current.dateISO;

        await loadAvailability(dateISO, { preserveSelection });
      } catch (err) {
        if (cancelled) return;
        setStatus({
          type: "error",
          message: err?.message || "Failed to load availability.",
        });
      } finally {
        didLoadInitialAvailability.current = true;
      }
    }

    syncAvailability();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateISO, bookingId, isEditing]);

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

  useEffect(() => {
    if (
      selectedTime &&
      !isOriginalSlot(selectedTime) &&
      isPastBookingTime(dateISO, selectedTime, new Date(nowTick))
    ) {
      setSelectedTime("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateISO, nowTick, selectedTime, isEditing]);

  const isBooked = (time) => bookedTimes.includes(time);
  const isPast = (time) =>
    isOriginalSlot(time) ? false : isPastBookingTime(dateISO, time, new Date(nowTick));

  async function submit(e) {
    e.preventDefault();

    if (!selectedTime) {
      setStatus({ type: "error", message: "Please choose a time slot." });
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
          client: { fullName, countryCode, phone, email, whatsappOptIn },
          notes,
          force: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({
          type: "error",
          message: data?.error || "Failed to save booking.",
        });
        return;
      }

      if (isEditing) {
        router.push("/admin/bookings");
        return;
      }

      setStatus({
        type: "success",
        message: "Booking created and approved successfully.",
      });
      await loadAvailability(dateISO);
    } catch (err) {
      setStatus({
        type: "error",
        message: err?.message || "Network error. Please try again.",
      });
    }
  }

  const disableSubmit =
    !selectedTime || !serviceId || !countryCode || !catalogLoaded || status.type === "loading";
  const regularServices = services.filter((s) => s.category !== "addon");
  const addOnServices = services.filter((s) => s.category === "addon");
  const selectedService = services.find((s) => s.id === serviceId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            {isEditing ? "Edit Booking" : "Add Booking"}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {isEditing
              ? "Update the appointment details and save your corrections."
              : "Create and approve bookings received via WhatsApp, calls, or walk-ins."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
              Status: {initialFormValues.bookingStatus}
            </span>
          ) : null}

          <Link
            href="/admin/bookings"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to bookings
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900">Date & Time</h2>
            <div className="text-xs text-slate-500">
              Select a date, then choose a slot
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700">Date</label>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
              value={dateISO}
              onChange={(e) => setDateISO(e.target.value)}
            />
          </div>

          <div className="mt-5 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">Time slot</label>
            <span className="text-xs text-slate-500">
              Booked slots are highlighted
            </span>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.map((time) => {
              const booked = isBooked(time);
              const past = isPast(time);
              const selected = selectedTime === time;

              const cls = [
                "rounded-lg border px-2 py-2 text-sm font-medium transition",
                "focus:outline-none focus:ring-2 focus:ring-slate-900",
                past
                  ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                  : booked
                  ? "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100"
                  : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
                selected && !past ? "border-slate-900 bg-slate-900 text-white hover:bg-slate-800" : "",
                disableSubmit && status.type === "loading" ? "opacity-70" : "",
              ].join(" ");

              return (
                <button
                  key={time}
                  type="button"
                  disabled={past}
                  onClick={() => setSelectedTime(time)}
                  className={cls}
                  title={
                    past
                      ? "Past time (cannot select)"
                      : booked
                      ? "Booked (admin may still override)"
                      : "Available"
                  }
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>{time}</span>
                  </div>
                  {past ? (
                    <div className="mt-1 text-[11px] font-normal opacity-80">past</div>
                  ) : booked ? (
                    <div className="mt-1 text-[11px] font-normal opacity-80">booked</div>
                  ) : (
                    <div className="mt-1 text-[11px] font-normal opacity-60">available</div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            Admin can intentionally double-book if needed. This form still highlights
            occupied slots before you save.
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900">
              Booking details
            </h2>
            <div className="text-xs text-slate-500">Client, service, and therapist info</div>
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
                      {regularServices.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </optgroup>
                  ) : null}
                  {addOnServices.length ? (
                    <optgroup label="Add-ons">
                      {addOnServices.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </optgroup>
                  ) : null}
                </select>
                {selectedService?.description ? (
                  <p className="mt-1 text-xs text-slate-500">{selectedService.description}</p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">
                    Add-ons can be booked without selecting a full service.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Therapist preference
                </label>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                  value={therapistPreference}
                  onChange={(e) => setTherapistPreference(e.target.value)}
                >
                  {THERAPIST_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Assigned therapist (optional)
                </label>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                  value={therapistId}
                  onChange={(e) => setTherapistId(e.target.value)}
                >
                  <option value="">No therapist assigned</option>
                  {therapists.map((therapist) => (
                    <option key={therapist.id} value={therapist.id}>
                      {therapist.name}
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

              <div className="sm:col-span-2 grid gap-3 sm:grid-cols-[10.5rem_minmax(0,1fr)]">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Country code
                  </label>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
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
                  <label className="block text-sm font-medium text-slate-700">
                    Client phone
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="e.g. 775432682 (no leading 0)"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Local number only, without leading 0.
                  </p>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onInvalid={(e) => {
                    const input = e.currentTarget;

                    if (input.validity.valueMissing) {
                      input.setCustomValidity("Email is required");
                      setStatus({ type: "error", message: "Email is required" });
                    } else if (input.validity.typeMismatch) {
                      input.setCustomValidity("Please enter a valid email address");
                      setStatus({
                        type: "error",
                        message: "Please enter a valid email address",
                      });
                    } else {
                      input.setCustomValidity("");
                    }
                  }}
                  onInput={(e) => {
                    e.currentTarget.setCustomValidity("");
                    if (status.type === "error") {
                      setStatus({ type: "idle", message: "" });
                    }
                  }}
                  placeholder="name@email.com"
                  required
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

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
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

              {isEditing ? (
                <Link
                  href="/admin/bookings"
                  className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </Link>
              ) : null}
            </div>

            <StatusBanner status={status} />
          </form>
        </section>
      </div>
    </div>
  );
}

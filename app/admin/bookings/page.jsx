import { prisma } from "../../../lib/prisma";
import Link from "next/link";
import BookingActions from "./BookingActions";
import { FOCUS_AREA_LABELS, ADD_ON_LABELS } from "../../../lib/bookables.js";

export const metadata = { title: "Bookings | Admin" };
const PAGE_SIZE = 20;
const ALLOWED_STATUSES = new Set([
  "",
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
]);

function fmt(d) {
  return new Date(d).toLocaleString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Harare",
  });
}

function formatTherapistPreference(value) {
  switch (String(value ?? "").toLowerCase()) {
    case "male":
      return "Male Therapist";
    case "female":
      return "Female Therapist";
    case "any":
      return "Anyone Available";
    default:
      return "Not specified";
  }
}

function statusBadge(status) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset";

  switch (status) {
    case "PENDING":
      return (
        <span className={`${base} bg-amber-50 text-amber-800 ring-amber-200`}>
          Pending
        </span>
      );
    case "CONFIRMED":
      return (
        <span className={`${base} bg-blue-50 text-blue-800 ring-blue-200`}>
          Confirmed
        </span>
      );
    case "COMPLETED":
      return (
        <span
          className={`${base} bg-emerald-50 text-emerald-800 ring-emerald-200`}
        >
          Completed
        </span>
      );
    case "CANCELLED":
      return (
        <span className={`${base} bg-rose-50 text-rose-800 ring-rose-200`}>
          Cancelled
        </span>
      );
    case "NO_SHOW":
      return (
        <span className={`${base} bg-slate-100 text-slate-800 ring-slate-200`}>
          No show
        </span>
      );
    default:
      return (
        <span className={`${base} bg-slate-50 text-slate-700 ring-slate-200`}>
          {status || "—"}
        </span>
      );
  }
}

function firstQueryValue(value) {
  if (Array.isArray(value)) return value[0] ?? "";
  return typeof value === "string" ? value : "";
}

function parsePage(value) {
  const n = Number.parseInt(firstQueryValue(value), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function buildBookingsHref({ status, page }) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/admin/bookings?${query}` : "/admin/bookings";
}

export default async function AdminBookingsPage({ searchParams }) {
  const sp = await searchParams;

  const requestedStatus = firstQueryValue(sp?.status);
  const status = ALLOWED_STATUSES.has(requestedStatus) ? requestedStatus : "";
  const requestedPage = parsePage(sp?.page);
  const where = status ? { status } : {};

  const totalBookings = await prisma.booking.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalBookings / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const bookings = await prisma.booking.findMany({
    where,
    include: { client: true, service: true, therapist: true },
    orderBy: { startAt: "desc" },
    skip,
    take: PAGE_SIZE,
  });

  const firstRow = totalBookings === 0 ? 0 : skip + 1;
  const lastRow = totalBookings === 0 ? 0 : skip + bookings.length;

  const TABS = [
    { label: "All", value: "" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" },
    { label: "No Show", value: "NO_SHOW" },
  ];

  return (
    <div className="w-full px-4 py-6 space-y-5 sm:px-6 sm:py-8 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Bookings</h1>
        <Link
          href="/admin/bookings/new"
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 sm:self-start"
        >
          + New booking
        </Link>
      </div>

      {/* STATUS TABS */}
      <div className="-mx-4 overflow-x-auto px-4 pb-0 sm:mx-0 sm:overflow-visible sm:px-0">
        <div className="flex gap-2 whitespace-nowrap border-b border-slate-200 pb-3">
          {TABS.map((tab) => (
            <Link
              key={tab.label}
              href={buildBookingsHref({ status: tab.value, page: 1 })}
              className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition sm:px-4 ${
                status === tab.value
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* MOBILE: CARD LIST */}
      <div className="space-y-3 md:hidden">
        {bookings.length ? (
          bookings.map((b) => (
            <article
              key={b.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-slate-900">
                    {b.client.fullName}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">{b.client.phone}</div>
                </div>
                {statusBadge(b.status)}
              </div>

              <div className="mt-3 grid gap-2 text-sm">
                <div className="text-slate-600">
                  <span className="font-medium text-slate-900">When:</span> {fmt(b.startAt)}
                </div>
                <div className="text-slate-600">
                  <span className="font-medium text-slate-900">Service:</span>{" "}
                  {b.service?.name || "—"}
                  {b.service?.durationMin ? (
                    <span className="text-slate-500"> · {b.service.durationMin} min</span>
                  ) : null}
                </div>
                <div className="text-slate-600">
                  <span className="font-medium text-slate-900">Therapist:</span>{" "}
                  {formatTherapistPreference(b.therapistPreference)}
                  {b.therapist?.name ? (
                    <span className="text-slate-500"> · {b.therapist.name}</span>
                  ) : null}
                </div>
              </div>

              {(Array.isArray(b.focusAreas) && b.focusAreas.length) ||
              (Array.isArray(b.addOns) && b.addOns.length) ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {Array.isArray(b.focusAreas) &&
                    b.focusAreas.map((id) => (
                      <span
                        key={id}
                        className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                      >
                        {FOCUS_AREA_LABELS[id] || id}
                      </span>
                    ))}
                  {Array.isArray(b.addOns) &&
                    b.addOns.map((id) => (
                      <span
                        key={id}
                        className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200"
                      >
                        + {ADD_ON_LABELS[id] || id}
                      </span>
                    ))}
                </div>
              ) : null}

              <div className="mt-4 flex items-center justify-end border-t border-slate-100 pt-3">
                <BookingActions id={b.id} status={b.status} />
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-600 shadow-sm">
            No bookings found.
          </div>
        )}
      </div>

      {/* DESKTOP: TABLE */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-3 lg:px-5">Date / Time</th>
                <th className="px-4 py-3 lg:px-5">Client</th>
                <th className="px-4 py-3 lg:px-5">Service</th>
                <th className="px-4 py-3 lg:px-5">Preferred Therapist</th>
                <th className="px-4 py-3 lg:px-5">Status</th>
                <th className="px-4 py-3 text-center lg:px-5">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {bookings.length ? (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 whitespace-nowrap lg:px-5">{fmt(b.startAt)}</td>

                    <td className="px-4 py-4 lg:px-5">
                      <div className="font-semibold text-slate-900">{b.client.fullName}</div>
                      <div className="text-xs text-slate-600">{b.client.phone}</div>
                    </td>

                    <td className="px-4 py-4 text-slate-700 lg:px-5">
                      <div className="font-medium text-slate-900">
                        {b.service?.name || "—"}
                        {b.service?.durationMin ? (
                          <span className="text-slate-500"> · {b.service.durationMin} min</span>
                        ) : null}
                      </div>
                      {Array.isArray(b.focusAreas) && b.focusAreas.length ? (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {b.focusAreas.map((id) => (
                            <span
                              key={id}
                              className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                            >
                              {FOCUS_AREA_LABELS[id] || id}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      {Array.isArray(b.addOns) && b.addOns.length ? (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {b.addOns.map((id) => (
                            <span
                              key={id}
                              className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200"
                            >
                              + {ADD_ON_LABELS[id] || id}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </td>

                    <td className="px-4 py-4 text-slate-700 lg:px-5">
                      <div>{formatTherapistPreference(b.therapistPreference)}</div>
                      {b.therapist?.name ? (
                        <div className="text-xs text-slate-500">
                          Assigned: {b.therapist.name}
                        </div>
                      ) : null}
                    </td>

                    <td className="px-4 py-4 lg:px-5">{statusBadge(b.status)}</td>

                    <td className="px-4 py-4 text-center lg:px-5">
                      <BookingActions id={b.id} status={b.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-600">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-600 sm:text-sm">
          Showing {firstRow}-{lastRow} of {totalBookings}
        </p>

        <div className="flex items-center justify-between gap-2 sm:justify-end">
          {currentPage > 1 ? (
            <Link
              href={buildBookingsHref({ status, page: currentPage - 1 })}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Previous
            </Link>
          ) : (
            <span className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-400">
              Previous
            </span>
          )}

          <span className="text-xs text-slate-600 sm:text-sm">
            Page {currentPage} of {totalPages}
          </span>

          {currentPage < totalPages ? (
            <Link
              href={buildBookingsHref({ status, page: currentPage + 1 })}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Next
            </Link>
          ) : (
            <span className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-400">
              Next
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

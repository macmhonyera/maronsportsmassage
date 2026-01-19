import { prisma } from "../../../lib/prisma";
import Link from "next/link";
import BookingActions from "./BookingActions";

export const metadata = { title: "Bookings | Admin" };

function fmt(d) {
  return new Date(d).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
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
        <span className={`${base} bg-emerald-50 text-emerald-800 ring-emerald-200`}>
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

function preferenceLabel(pref) {
  const p = String(pref || "").toLowerCase();
  if (p === "male") return "Male therapist";
  if (p === "female") return "Female therapist";
  if (p === "any") return "Anyone available";
  return "";
}

export default async function AdminBookingsPage({ searchParams }) {
  const sp = await searchParams;

  const q = (sp?.q ? String(sp.q) : "").trim();
  const status = sp?.status ? String(sp.status) : "";

  const where = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { client: { fullName: { contains: q, mode: "insensitive" } } },
            { client: { phone: { contains: q, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const bookings = await prisma.booking.findMany({
    where,
    include: { client: true, service: true, therapist: true },
    orderBy: { startAt: "desc" },
    take: 200,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Bookings
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Search, filter, and manage recent bookings.
          </p>
        </div>

        <Link
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
          href="/admin/bookings/new"
        >
          + Add booking
        </Link>
      </div>

      {/* Filters */}
      <form
        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        action="/admin/bookings"
        method="get"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Search
            </label>
            <div className="mt-1">
              <input
                name="q"
                defaultValue={q}
                placeholder="Client name or phone"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Status
            </label>
            <div className="mt-1">
              <select
                name="status"
                defaultValue={status}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
              >
                <option value="">All</option>
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="NO_SHOW">NO_SHOW</option>
              </select>
            </div>
          </div>

          <div className="flex items-end gap-3">
            <button
              type="submit"
              className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              Apply filters
            </button>
          </div>
        </div>

        {(q || status) && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <div className="truncate">
              Showing results for{" "}
              <span className="font-semibold">
                {q ? `“${q}”` : "all clients"}
              </span>
              {status ? (
                <>
                  {" "}
                  with status <span className="font-semibold">{status}</span>
                </>
              ) : null}
              .
            </div>
            <Link
              href="/admin/bookings"
              className="shrink-0 rounded-md px-2 py-1 text-sm font-medium text-slate-700 hover:bg-white hover:text-slate-900"
            >
              Clear
            </Link>
          </div>
        )}
      </form>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div className="text-sm font-medium text-slate-900">
            Latest bookings
          </div>
          <div className="text-xs text-slate-500">
            Showing up to {bookings.length} records
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-5 py-3">Date / Time</th>
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">Therapist</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Source</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {bookings.length ? (
                bookings.map((b) => {
                  const assignedTherapistName = b.therapist?.name || "";
                  const pref = preferenceLabel(b.therapistPreference);

                  return (
                    <tr key={b.id} className="transition-colors hover:bg-slate-50">
                      <td className="px-5 py-4 whitespace-nowrap text-slate-900">
                        {fmt(b.startAt)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900">
                          {b.client.fullName}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-600">
                          {b.client.phone}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {b.service?.name || "-"}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {assignedTherapistName ? (
                          <div className="space-y-1">
                            <div className="font-medium text-slate-900">
                              {assignedTherapistName}
                            </div>
                            {pref ? (
                              <div className="text-xs text-slate-500">
                                Preference: {pref}
                              </div>
                            ) : null}
                          </div>
                        ) : pref ? (
                          <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200">
                            {pref}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="px-5 py-4">{statusBadge(b.status)}</td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200">
                          {b.source || "-"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <BookingActions id={b.id} status={b.status} />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="px-5 py-10 text-center text-slate-600" colSpan={7}>
                    No bookings found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
        The public booking calendar blocks time slots as soon as a booking is created (including WhatsApp/admin bookings).
      </div>
    </div>
  );
}

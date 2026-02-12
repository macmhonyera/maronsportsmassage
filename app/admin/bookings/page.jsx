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

export default async function AdminBookingsPage({ searchParams }) {
  const sp = await searchParams;

  const status = sp?.status ? String(sp.status) : "";

  const bookings = await prisma.booking.findMany({
    where: status ? { status } : {},
    include: { client: true, service: true, therapist: true },
    orderBy: { startAt: "desc" },
    take: 200,
  });

  return (
    <div className="w-full px-6 py-8 space-y-6">
      <h1 className="text-3xl font-semibold text-slate-900">Bookings</h1>

      {/* STATUS TABS */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { label: "All", value: "" },
          { label: "Confirmed", value: "CONFIRMED" },
          { label: "Completed", value: "COMPLETED" },
          { label: "Cancelled", value: "CANCELLED" },
          { label: "No Show", value: "NO_SHOW" },
        ].map((tab) => (
          <Link
            key={tab.label}
            href={`/admin/bookings${tab.value ? `?status=${tab.value}` : ""}`}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              status === tab.value
                ? "bg-slate-900 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-5 py-3">Date / Time</th>
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {bookings.length ? (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 whitespace-nowrap">
                      {fmt(b.startAt)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">
                        {b.client.fullName}
                      </div>
                      <div className="text-xs text-slate-600">
                        {b.client.phone}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {b.service?.name || "-"}
                    </td>

                    <td className="px-5 py-4">{statusBadge(b.status)}</td>

                    <td className="px-5 py-4 text-center">
                      <BookingActions id={b.id} status={b.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-slate-600"
                  >
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

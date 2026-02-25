import Link from "next/link";
import { prisma } from "../../lib/prisma";

export const metadata = { title: "Admin | Maron Fitness Massage &Spa" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

function dayRange(date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function StatCard({ label, value, hint }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      {/* subtle accent glow */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-20 blur-2xl"
        style={{ background: "rgba(20,184,166,0.35)" }}
      />
      <div className="relative">
        <div className="text-sm font-medium text-slate-600">{label}</div>
        <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          {value}
        </div>
        {hint ? (
          <div className="mt-2 text-xs text-slate-500">{hint}</div>
        ) : null}
      </div>
    </div>
  );
}

function ActionCard({ href, title, description, icon }) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all
                 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md
                 focus:outline-none focus:ring-2 focus:ring-slate-900"
    >
      {/* left accent bar */}
      <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-[#14B8A6] to-[#0B1224]" />

      {/* soft highlight */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-[#14B8A6]/10 via-transparent to-transparent" />
      </div>

      <div className="relative flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B1224] text-white shadow-sm">
            <span className="text-lg">{icon}</span>
          </div>

          <div>
            <div className="text-base font-semibold text-slate-900">{title}</div>
            <div className="mt-0.5 text-sm text-slate-600">{description}</div>
          </div>
        </div>

        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all group-hover:translate-x-1 group-hover:border-slate-300 group-hover:text-slate-900">
          →
        </span>
      </div>
    </Link>
  );
}

export default async function AdminHome() {
  const now = new Date();
  const { start, end } = dayRange(now);

  const [todaysBookings, upcomingSessions, pendingActions, manualBookings] =
    await Promise.all([
      prisma.booking.count({
        where: {
          startAt: { gte: start, lte: end },
          status: { notIn: ["CANCELLED"] },
        },
      }),
      prisma.booking.count({
        where: {
          startAt: { gt: now },
          status: { notIn: ["CANCELLED"] },
        },
      }),
      prisma.booking.count({
        where: { status: "PENDING" },
      }),
      prisma.booking.count({
        where: {
          source: { in: ["whatsapp", "admin"] }, // adjust if needed
        },
      }),
    ]);

  return (
    <div className="relative">
      {/* subtle page background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-slate-50" />
        <div
          className="absolute -top-24 left-1/2 h-72 w-[900px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(20,184,166,0.35), rgba(20,184,166,0))",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 space-y-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#14B8A6]" />
              Admin Overview
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
              Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Manage bookings, create manual entries, and monitor activity across
              Maron Fitness Massage &Spa.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin/bookings"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
            >
              View bookings
            </Link>
            <Link
              href="/admin/bookings/new"
              className="rounded-xl bg-[#14B8A6] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0D9488] active:scale-95"
            >
              + New booking
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Today’s Bookings"
            value={todaysBookings}
            hint="Non-cancelled sessions scheduled today."
          />
          <StatCard
            label="Upcoming Sessions"
            value={upcomingSessions}
            hint="Future bookings excluding cancelled."
          />
          <StatCard
            label="Pending Actions"
            value={pendingActions}
            hint="Bookings still awaiting confirmation."
          />
          <StatCard
            label="Manual Bookings"
            value={manualBookings}
            hint="Created via WhatsApp/admin entries."
          />
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Quick Actions
            </h2>
            <div className="text-xs text-slate-500">
              Shortcuts to common tasks
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ActionCard
              href="/admin/bookings"
              title="Bookings"
              description="View, search, filter, and manage appointments."
              icon="📋"
            />
            <ActionCard
              href="/admin/bookings/new"
              title="Add Booking"
              description="Create bookings from WhatsApp, calls, or walk-ins."
              icon="➕"
            />
          </div>
        </div>

        {/* Optional note */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
          <span className="font-semibold text-slate-900">Tip:</span> Use{" "}
          <span className="font-semibold">Add Booking</span> for WhatsApp/call
          requests to block the public booking calendar immediately.
        </div>
      </div>
    </div>
  );
}

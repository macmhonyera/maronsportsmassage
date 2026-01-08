"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BookingActions({ id, status }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setStatus(nextStatus) {
    try {
      setLoading(true);

      const res = await fetch(`/api/admin/bookings/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update booking");

      router.refresh(); // refresh server component data
    } catch (err) {
      alert(err.message || "Failed.");
    } finally {
      setLoading(false);
    }
  }

  // Only show approve/decline when pending
  if (status !== "PENDING") return <span className="text-xs text-slate-500">—</span>;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setStatus("CONFIRMED")}
        disabled={loading}
        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
      >
        Approve
      </button>

      <button
        type="button"
        onClick={() => {
          const ok = confirm("Decline this booking? This will mark it as CANCELLED.");
          if (ok) setStatus("CANCELLED");
        }}
        disabled={loading}
        className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-800 hover:bg-rose-100 disabled:opacity-60"
      >
        Decline
      </button>
    </div>
  );
}

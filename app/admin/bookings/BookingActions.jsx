"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function BookingActions({ id, status }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function setStatus(nextStatus) {
    try {
      setLoading(true);
      setOpen(false);

      const res = await fetch(`/api/admin/bookings/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update booking");

      router.refresh();
    } catch (err) {
      alert(err.message || "Failed.");
    } finally {
      setLoading(false);
    }
  }

  // COMPLETED & CANCELLED locked
  if (status === "COMPLETED" || status === "CANCELLED") {
    return <span className="text-xs text-slate-400">—</span>;
  }

  // Build actions dynamically
  let actions = [];

  if (status === "PENDING") {
    actions = [
      { label: "Approve", action: () => setStatus("CONFIRMED") },
      {
        label: "Decline",
        action: () => {
          if (confirm("Decline this booking?")) {
            setStatus("CANCELLED");
          }
        },
        danger: true,
      },
    ];
  }

  if (status === "CONFIRMED") {
    actions = [
      {
        label: "Mark Completed",
        action: () => {
          if (confirm("Mark this booking as COMPLETED?")) {
            setStatus("COMPLETED");
          }
        },
      },
      {
        label: "Mark No Show",
        action: () => {
          if (confirm("Mark this booking as NO SHOW?")) {
            setStatus("NO_SHOW");
          }
        },
      },
      {
        label: "Cancel Booking",
        action: () => {
          if (confirm("Cancel this confirmed booking?")) {
            setStatus("CANCELLED");
          }
        },
        danger: true,
      },
    ];
  }

  if (status === "NO_SHOW") {
    actions = [
      {
        label: "Confirm Again",
        action: () => {
          if (confirm("Move this booking back to CONFIRMED?")) {
            setStatus("CONFIRMED");
          }
        },
      },
      {
        label: "Cancel Booking",
        action: () => {
          if (confirm("Cancel this booking?")) {
            setStatus("CANCELLED");
          }
        },
        danger: true,
      },
    ];
  }

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* 3-dot button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-2xl font-bold text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 hover:shadow-md active:scale-95 disabled:opacity-50"
      >
        ⋯
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="py-1">
            {actions.map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                disabled={loading}
                className={`w-full px-4 py-2.5 text-left text-sm font-medium transition ${
                  item.danger
                    ? "text-rose-600 hover:bg-rose-200"
                    : "text-slate-700 hover:bg-slate-500 hover:text-slate-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

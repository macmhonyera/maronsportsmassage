"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const MENU_WIDTH = 192;

export default function BookingActions({ id, status }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

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

  let actions = [];

  if (status === "PENDING") {
    actions = [
      { label: "Approve", action: () => setStatus("CONFIRMED") },
      {
        label: "Decline",
        action: () => {
          if (confirm("Decline this booking?")) setStatus("CANCELLED");
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
          if (confirm("Mark this booking as COMPLETED?")) setStatus("COMPLETED");
        },
      },
      {
        label: "Mark No Show",
        action: () => {
          if (confirm("Mark this booking as NO SHOW?")) setStatus("NO_SHOW");
        },
      },
      {
        label: "Cancel Booking",
        action: () => {
          if (confirm("Cancel this confirmed booking?")) setStatus("CANCELLED");
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
          if (confirm("Move this booking back to CONFIRMED?")) setStatus("CONFIRMED");
        },
      },
      {
        label: "Cancel Booking",
        action: () => {
          if (confirm("Cancel this booking?")) setStatus("CANCELLED");
        },
        danger: true,
      },
    ];
  }

  useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;

      const menuHeight = actions.length * 46 + 12;
      const preferredTop = rect.bottom + 8;
      const top =
        preferredTop + menuHeight > window.innerHeight
          ? Math.max(8, rect.top - menuHeight - 8)
          : preferredTop;
      const left = Math.max(
        8,
        Math.min(window.innerWidth - MENU_WIDTH - 8, rect.right - MENU_WIDTH)
      );

      setMenuPosition({ top, left });
    }

    function closeOnOutsideClick(e) {
      const target = e.target;
      if (menuRef.current?.contains(target) || buttonRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    }

    function closeOnEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }

    updatePosition();
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, actions.length]);

  if (actions.length === 0) {
    return <span className="text-xs text-slate-400">—</span>;
  }

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={loading}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-2xl font-bold text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 hover:shadow-md active:scale-95 disabled:opacity-50"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        ⋯
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              className="fixed z-[1200] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
              style={{
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
                width: `${MENU_WIDTH}px`,
              }}
            >
              <div className="py-1">
                {actions.map((item, i) => (
                  <button
                    key={i}
                    onClick={item.action}
                    disabled={loading}
                    className={`w-full px-4 py-2.5 text-left text-sm font-medium transition ${
                      item.danger
                        ? "text-rose-600 hover:bg-rose-50"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

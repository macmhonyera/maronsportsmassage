import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Admin | Maron's Muscle Studio",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top admin bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-3 sm:h-16 sm:px-4">
          {/* Left: logo + admin label */}
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Link href="/admin" className="flex shrink-0 items-center gap-2">
              <div className="relative h-8 w-[140px] sm:h-10 sm:w-[180px]">
                <Image
                  src="/logo/newlogo.png"
                  alt="Maron's Muscle Studio"
                  fill
                  priority
                  sizes="(min-width: 640px) 180px, 140px"
                  className="object-contain"
                />
              </div>
            </Link>

            <div className="hidden sm:flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0F5E61]" />
              <span className="text-sm font-semibold text-slate-900">Admin</span>
            </div>
          </div>

          {/* Center: admin nav (desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/admin"
              className="text-slate-600 hover:text-slate-900 hover:underline decoration-[#0F5E61] decoration-2 underline-offset-4"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/bookings"
              className="text-slate-600 hover:text-slate-900 hover:underline decoration-[#0F5E61] decoration-2 underline-offset-4"
            >
              Bookings
            </Link>
            <Link
              href="/admin/bookings/new"
              className="text-slate-600 hover:text-slate-900 hover:underline decoration-[#0F5E61] decoration-2 underline-offset-4"
            >
              Add booking
            </Link>
          </nav>

          {/* Right: actions */}
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/"
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-900 hover:bg-slate-50 sm:px-3 sm:py-2 sm:text-sm"
            >
              View site
            </Link>

            <Link
              href="/admin/bookings/new"
              className="hidden sm:inline-flex rounded-lg bg-[#0F5E61] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0A4548] active:scale-95"
            >
              + New
            </Link>
          </div>
        </div>

        {/* Mobile nav (visible only below md) */}
        <nav className="border-t border-slate-100 md:hidden">
          <div className="flex gap-1 overflow-x-auto px-3 py-2 text-sm font-medium">
            <Link
              href="/admin"
              className="shrink-0 rounded-lg px-3 py-1.5 text-slate-700 hover:bg-slate-100"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/bookings"
              className="shrink-0 rounded-lg px-3 py-1.5 text-slate-700 hover:bg-slate-100"
            >
              Bookings
            </Link>
            <Link
              href="/admin/bookings/new"
              className="shrink-0 rounded-lg bg-[#0F5E61] px-3 py-1.5 text-white shadow-sm hover:bg-[#0A4548]"
            >
              + Add
            </Link>
          </div>
        </nav>
      </header>

      {/* Main grows to push footer down */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-5 sm:px-4 sm:py-8">
        {children}
      </main>

      {/* Footer sticks to bottom */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-500">
          © {new Date().getFullYear()} Maron&apos;s Muscle Studio — Admin
        </div>
      </footer>
    </div>
  );
}

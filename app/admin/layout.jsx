import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Admin | Maron Fitness Massage &Spa",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top admin bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          {/* Left: logo + admin label */}
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative h-10 w-[180px]">
                <Image
                  src="/logo/logo3.png"
                  alt="Maron Sports Massage"
                  fill
                  priority
                  sizes="180px"
                  className="object-contain"
                />
              </div>
            </Link>

            <div className="hidden sm:flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#14B8A6]" />
              <span className="text-sm font-semibold text-slate-900">Admin</span>
            </div>
          </div>

          {/* Center: admin nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/admin"
              className="text-slate-600 hover:text-slate-900 hover:underline decoration-[#14B8A6] decoration-2 underline-offset-4"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/bookings"
              className="text-slate-600 hover:text-slate-900 hover:underline decoration-[#14B8A6] decoration-2 underline-offset-4"
            >
              Bookings
            </Link>
            <Link
              href="/admin/bookings/new"
              className="text-slate-600 hover:text-slate-900 hover:underline decoration-[#14B8A6] decoration-2 underline-offset-4"
            >
              Add booking
            </Link>
          </nav>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              View site
            </Link>

            <Link
              href="/admin/bookings/new"
              className="hidden sm:inline-flex rounded-lg bg-[#14B8A6] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0D9488] active:scale-95"
            >
              + New
            </Link>
          </div>
        </div>
      </header>

      {/* Main grows to push footer down */}
      <main className="flex-1 mx-auto max-w-6xl px-4 py-8">
        {children}
      </main>

      {/* Footer sticks to bottom */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-500">
          © {new Date().getFullYear()} Maron Fitness Massage &Spa — Admin
        </div>
      </footer>
    </div>
  );
}

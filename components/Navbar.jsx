"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

function isActivePath(pathname, href) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      {/* Top stripe */}
      <div className="h-1 w-full bg-[#0F172A]" />

      {/* Header glass bar */}
      <div
        className="border-b border-slate-900/10 backdrop-blur-md shadow-sm"
        style={{ background: "#ffffff" }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
          {/* Left: Logo */}
          <div className="flex w-1/4 items-center">
            <Link href="/" className="group flex items-center">
              <div className="relative h-12 w-[240px]">
                <Image
                  src="/logo/logo3.png"
                  alt="Maron Sports Massage"
                  fill
                  priority
                  sizes="240px"
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>
          </div>

          {/* Center: Menu */}
          <nav className="hidden w-1/2 items-center justify-center gap-2 text-sm font-medium md:flex">
            {menuItems.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "relative rounded-lg px-3 py-2 transition-all",
                    active
                      ? "text-slate-900 bg-white/70"
                      : "text-slate-700 hover:text-slate-900 hover:bg-white/50",
                  ].join(" ")}
                >
                  {item.label}

                  {/* Active underline */}
                  <span
                    className={[
                      "absolute left-3 right-3 -bottom-[6px] h-[3px] rounded-full transition-all",
                      active ? "bg-[#14B8A6]" : "bg-transparent",
                    ].join(" ")}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right: CTA */}
          <div className="flex w-1/4 items-center justify-end gap-2">
            <Link
              href="/book"
              className="rounded-lg bg-[#14B8A6]/90 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300
                         hover:bg-[#0D9488] hover:shadow-lg active:scale-95"
            >
              Book Now
            </Link>
          </div>
        </div>

        {/* Mobile menu row */}
        <div className="border-t border-slate-900/10 bg-white/60 backdrop-blur-md md:hidden">
          <nav className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-3 text-sm font-medium">
            {menuItems
              .filter((i) => i.href !== "/") // keep Home in logo for mobile
              .map((item) => {
                const active = isActivePath(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "rounded-lg px-3 py-2 transition-all",
                      active
                        ? "bg-[#14B8A6]/10 text-slate-900"
                        : "text-slate-700 hover:text-slate-900 hover:bg-white/50",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
          </nav>
        </div>
      </div>
    </header>
  );
}

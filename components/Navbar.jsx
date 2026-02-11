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

      {/* Header bar */}
      <div className="border-b border-slate-900/10 backdrop-blur-md shadow-sm bg-white">
        <div className="mx-auto flex h-20 sm:h-24 max-w-7xl items-center px-6">
          
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center">
              <div className="relative h-16 w-36 sm:h-20 sm:w-64 md:h-24 md:w-[380px]">
                <Image
                  src="/logo/logo3.png"
                  alt="Maron Sports Massage"
                  fill
                  priority
                  sizes="(max-width: 640px) 140px, (max-width: 768px) 260px, 380px"
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>
          </div>

          {/* Center: Desktop Menu (True Centered) */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 text-sm font-medium">
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
          <div className="ml-auto flex items-center">
            <Link
              href="/book"
              className="whitespace-nowrap rounded-lg bg-[#14B8A6]/90 px-3 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#0D9488] hover:shadow-lg active:scale-95"
            >
              Book Now
            </Link>
          </div>
        </div>

        {/* Mobile Menu Row (UNCHANGED) */}
        <div className="border-t border-slate-900/10 bg-white/60 backdrop-blur-md md:hidden">
          <nav className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-3 text-sm font-medium">
            {menuItems
              .filter((i) => i.href !== "/")
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

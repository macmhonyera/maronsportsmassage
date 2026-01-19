import Link from "next/link";

export default function Footer() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_LINK || "https://wa.me/";
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_LINK || "#";
  const facebook = process.env.NEXT_PUBLIC_FACEBOOK_LINK || "#";

  return (
    <footer className="border-t border-white/10 bg-[#0F172A]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl grid gap-10 px-4 py-12 md:grid-cols-3">
        {/* Brand */}
        <div>
          <div className="text-xl font-semibold tracking-tight text-white">
            Sports Massage
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Recovery-focused therapy for athletes and active people. Book online
            in minutes.
          </p>

          <p className="mt-4 text-sm text-slate-300">
            <span className="font-medium text-white">Phone:</span> +27 00 000 0000
            <br />
            <span className="font-medium text-white">Address:</span> Your Street,
            Your City
          </p>
        </div>

        {/* Links */}
        <div>
          <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/90">
            Quick Links
          </div>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/services", label: "Services" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
              { href: "/terms", label: "Terms & Conditions" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-slate-300 transition-colors hover:text-[#5EEAD4] hover:underline underline-offset-4"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/90">
            Connect
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="text-slate-300 transition-colors hover:text-[#5EEAD4] hover:underline underline-offset-4"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                className="text-slate-300 transition-colors hover:text-[#5EEAD4] hover:underline underline-offset-4"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={facebook}
                target="_blank"
                rel="noreferrer"
                className="text-slate-300 transition-colors hover:text-[#5EEAD4] hover:underline underline-offset-4"
              >
                Facebook
              </a>
            </li>
            <li>
              <Link
                href="/admin"
                className="text-slate-400 transition-colors hover:text-white hover:underline underline-offset-4"
              >
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-[#0F172A]/70">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Sports Massage. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

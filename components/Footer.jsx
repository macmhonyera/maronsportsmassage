import Link from "next/link";

export default function Footer() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_LINK || "https://wa.me/263780525557";
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_LINK || "https://www.instagram.com/maron_zw/?utm_source=ig_web_button_share_sheet";
  const facebook = process.env.NEXT_PUBLIC_FACEBOOK_LINK || "https://www.facebook.com/profile.php?id=61577595272486#";

  return (
    <footer className="border-t border-white/10 bg-[#0F172A]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl grid gap-10 px-4 py-12 md:grid-cols-3">
        {/* Brand */}
        <div>
          <div className="text-xl font-semibold tracking-tight text-white">
            Maron Fitness | Massage &Spa
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Personalised massage therapy for recovery, relaxation, and wellbeing.
          </p>

          <p className="mt-4 text-sm text-slate-300">
            <span className="font-medium text-white">Phone:</span> +263 78 0525 557
            <br />
            <span className="font-medium text-white">Address:</span> 116 Fife Ave, Harare
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
            {/* <li>
              <Link
                href="/admin"
                className="text-slate-400 transition-colors hover:text-white hover:underline underline-offset-4"
              >
                Admin
              </Link>
            </li> */}
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

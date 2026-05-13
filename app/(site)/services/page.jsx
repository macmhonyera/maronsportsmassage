import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Services | Sports Massage",
  description: "Browse massage and spa services. Book online.",
};

function moneyUSD(amount) {
  return `$${Number(amount).toFixed(0)}`;
}

const SERVICES = [
  {
    id: "sports",
    name: "Sports Massage",
    tagline: "Enhance performance & reduce soreness",
    fromPrice: 20,
    durationLabel: "30 / 60 / 90 min",
    image: "/images/thai.jpg",
    benefits: ["Speeds up recovery", "Reduces muscle soreness", "Improves performance readiness"],
  },
  {
    id: "full-body",
    name: "Full Body Massage",
    tagline: "Comprehensive Muscular Therapy",
    fromPrice: 20,
    durationLabel: "30 / 60 / 90 min",
    image: "/images/man.jpg",
    benefits: ["Full-body reset", "Boosts overall wellness", "Supports relaxation and recovery"],
    styles: [
      { name: "Swedish", description: "Long, flowing strokes to relax and reduce tension." },
      { name: "Deep Tissue", description: "Firm pressure to release chronic knots and pain." },
    ],
  },
  {
    id: "stretch",
    name: "Assisted Stretching",
    tagline: "Guided stretching for mobility & flexibility",
    fromPrice: 20,
    durationLabel: "30 min only",
    image: "/images/neck.jpg",
    benefits: ["Improves flexibility", "Releases tight muscles", "Supports posture and balance"],
  },
];

const SPECIALS = [
  {
    id: "gentlemens-package",
    name: "Gentlemen’s Package",
    tagline: "Best-value bundle for a full refresh",
    price: 50,
    durationLabel: "60 min",
    image: "/images/gent.png",
    includes: ["Foot Scrub", "Full Body Massage", "Underarm Wax"],
    benefits: ["Complete head-to-toe refresh", "Great value bundle", "Perfect for events and self-care days"],
  },
];

const ADD_ONS = [
  { id: "cupping", name: "Cupping", price: 0, tagline: "Release tension & improve circulation" },
  { id: "hotstones", name: "Hot Stones", price: 0, tagline: "Melt stress & soothe muscles" },
];

export default function ServicesPage() {
  return (
    <div className="space-y-0">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0B1224] mt-5">
        <div className="absolute inset-0">
          <Image
            src="/images/man.jpg"
            alt="Services"
            fill
            className="object-cover opacity-25"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1224]/60 via-[#0B1224]/90 to-[#0B1224]" />
          <div
            className="absolute inset-0 opacity-80"
            style={{
              background:
                "radial-gradient(900px 360px at 70% 15%, rgba(20,184,166,0.25) 0%, rgba(151, 248, 237, 0) 60%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-10 md:pt-20 md:pb-14">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#14B8A6]" />
              Recovery • Spa Wellness • Performance
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
              Choose Your Perfect Session To {" "}
              <span className="text-[#5EEAD4]">Recover</span>,{" "}
              <span className="text-white">Relax</span>, And{" "}
              <span className="text-white">Reset</span>.
            </h1>

            <p className="mt-5 text-base text-slate-200 sm:text-lg">
              From specialized sports recovery to restorative wellness, we tailor every session to your body’s unique
              requirements. Experience professional care with the convenience of instant online booking.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-xl bg-[#14B8A6] px-7 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0D9488] hover:shadow-xl active:scale-95"
              >
                Book Now
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              <a
                href="#services"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15 hover:border-white/30"
              >
                Browse Services
              </a>
            </div>
          </div>
        </div>

        <div className="h-10 bg-gradient-to-b from-[#0B1224] to-white" />
      </section>

      {/* SERVICES GRID */}
      <section id="services" className="bg-white py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#0F172A] md:text-4xl">
              Services
            </h2>
            <p className="mt-3 text-base text-slate-600 md:text-lg">
              Clear services, real benefits, and a premium experience choose what fits your goal.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {SERVICES.map((s) => (
              <article
                key={s.id}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-900/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-[#14B8A6]/40 hover:shadow-xl hover:ring-[#14B8A6]/10"
              >
                <div
                  className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-40"
                  style={{ background: "rgba(20,184,166,0.35)" }}
                />

                {/* Image */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100 sm:h-48">
                  <Image
                    src={s.image}
                    alt={s.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-slate-900/10 to-transparent" />

                  <div className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#0F172A] shadow-sm backdrop-blur">
                    <svg className="h-3.5 w-3.5 text-[#0D9488]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .2.08.39.22.53l3 3a.75.75 0 1 0 1.06-1.06l-2.78-2.78V5Z" clipRule="evenodd" />
                    </svg>
                    {s.durationLabel}
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold tracking-tight text-[#0F172A] sm:text-xl">
                      {s.name}
                    </h3>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                        From
                      </div>
                      <div className="mt-0.5 text-xl font-bold text-[#0F172A] sm:text-2xl">
                        {moneyUSD(s.fromPrice)}
                      </div>
                    </div>
                  </div>

                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{s.tagline}</p>

                  <div className="my-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                  <ul className="space-y-2 text-sm text-slate-700">
                    {s.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2.5">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#14B8A6]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.4L8 12.58l7.3-7.3a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
                        </svg>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {s.styles && (
                    <div className="mt-4 rounded-xl bg-gradient-to-br from-[#14B8A6]/[0.07] to-transparent p-3.5 ring-1 ring-[#14B8A6]/15">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#0D9488]">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 1.5a.75.75 0 0 1 .68.43l1.94 4.06 4.47.62a.75.75 0 0 1 .42 1.28l-3.24 3.13.79 4.43a.75.75 0 0 1-1.1.78L10 14.05l-3.96 2.18a.75.75 0 0 1-1.1-.78l.78-4.43L2.5 7.89a.75.75 0 0 1 .42-1.28l4.47-.62L9.32 1.93A.75.75 0 0 1 10 1.5Z" />
                        </svg>
                        Available styles
                      </div>
                      <div className="mt-2 space-y-2">
                        {s.styles.map((st) => (
                          <div key={st.name} className="text-sm leading-relaxed">
                            <span className="font-semibold text-[#0F172A]">{st.name}</span>
                            <span className="text-slate-600"> — {st.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-5">
                    <Link
                      href="/book"
                      className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#14B8A6] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0D9488] hover:shadow-md hover:shadow-[#14B8A6]/20"
                    >
                      Book this session
                      <svg className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.69l-3.22-3.22a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mx-auto mt-6 flex max-w-3xl items-center justify-center gap-3 rounded-2xl border border-[#14B8A6]/20 bg-[#14B8A6]/[0.04] px-5 py-3 text-sm text-[#0F172A]">
            <svg className="h-5 w-5 shrink-0 text-[#0D9488]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10 1.5a.75.75 0 0 1 .68.43l1.94 4.06 4.47.62a.75.75 0 0 1 .42 1.28l-3.24 3.13.79 4.43a.75.75 0 0 1-1.1.78L10 14.05l-3.96 2.18a.75.75 0 0 1-1.1-.78l.78-4.43L2.5 7.89a.75.75 0 0 1 .42-1.28l4.47-.62L9.32 1.93A.75.75 0 0 1 10 1.5Z" />
            </svg>
            <span>
              <span className="font-semibold">Bonus:</span> Cupping and Hot Stones are free add-ons you can include at the booking step.
            </span>
          </div>
        </div>
      </section>

      {/* SPECIALS */}
      <section id="specials" className="bg-slate-50 py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-amber-800">
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10 1.5a.75.75 0 0 1 .68.43l1.94 4.06 4.47.62a.75.75 0 0 1 .42 1.28l-3.24 3.13.79 4.43a.75.75 0 0 1-1.1.78L10 14.05l-3.96 2.18a.75.75 0 0 1-1.1-.78l.78-4.43L2.5 7.89a.75.75 0 0 1 .42-1.28l4.47-.62L9.32 1.93A.75.75 0 0 1 10 1.5Z" />
              </svg>
              Curated bundle
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] md:text-4xl">
              Specials
            </h2>
            <p className="mt-3 text-base text-slate-600 md:text-lg">
              A premium package designed for a complete refresh.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {SPECIALS.map((sp) => (
              <article
                key={sp.id}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-900/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl hover:ring-amber-200/40 md:col-span-2 lg:col-span-1"
              >
                <div
                  className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-40"
                  style={{ background: "rgba(251,191,36,0.35)" }}
                />

                <div className="relative h-44 w-full overflow-hidden bg-slate-100 sm:h-48">
                  <Image
                    src={sp.image}
                    alt={sp.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-slate-900/10 to-transparent" />
                  <div className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-amber-950 shadow-sm">
                    Special
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold tracking-tight text-[#0F172A] sm:text-xl">
                      {sp.name}
                    </h3>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                        Package
                      </div>
                      <div className="mt-0.5 text-xl font-bold text-[#0F172A] sm:text-2xl">
                        {moneyUSD(sp.price)}
                      </div>
                    </div>
                  </div>

                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{sp.tagline}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">{sp.durationLabel}</p>

                  <div className="my-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-3.5 ring-1 ring-slate-200/60">
                      <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                        Includes
                      </div>
                      <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                        {sp.includes.map((i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
                            <span>{i}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl bg-white p-3.5 ring-1 ring-slate-200/60">
                      <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                        Benefits
                      </div>
                      <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                        {sp.benefits.map((b) => (
                          <li key={b} className="flex items-start gap-2">
                            <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#14B8A6]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.4L8 12.58l7.3-7.3a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
                            </svg>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-auto pt-5">
                    <Link
                      href="/book"
                      className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-amber-950 shadow-sm transition-all hover:bg-amber-400 hover:shadow-md"
                    >
                      Book this package
                      <svg className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.69l-3.22-3.22a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ADD-ONS */}
      <section id="addons" className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-12 md:py-16">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-96 w-[60rem] -translate-x-1/2 opacity-30 blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(20,184,166,0.25), transparent)" }}
        />

        <div className="relative mx-auto max-w-5xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10 1.5a.75.75 0 0 1 .68.43l1.94 4.06 4.47.62a.75.75 0 0 1 .42 1.28l-3.24 3.13.79 4.43a.75.75 0 0 1-1.1.78L10 14.05l-3.96 2.18a.75.75 0 0 1-1.1-.78l.78-4.43L2.5 7.89a.75.75 0 0 1 .42-1.28l4.47-.62L9.32 1.93A.75.75 0 0 1 10 1.5Z" />
              </svg>
              Always free
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] md:text-4xl">
              Free Add-ons
            </h2>
            <p className="mt-3 text-base text-slate-600 md:text-lg">
              Elevate any session with our signature extras — at no extra cost.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {ADD_ONS.map((a) => (
              <article
                key={a.id}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-900/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-[#14B8A6]/40 hover:shadow-xl hover:ring-[#14B8A6]/10"
              >
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
                  style={{ background: "rgba(20,184,166,0.4)" }}
                />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#14B8A6]/15 to-[#14B8A6]/5 text-[#0D9488] ring-1 ring-[#14B8A6]/15">
                    {a.id === "cupping" ? (
                      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 7h14l-1.2 9a3 3 0 0 1-3 2.6H9.2a3 3 0 0 1-3-2.6L5 7Z" />
                        <path d="M4 7h16" />
                        <path d="M9 4c0 1.5 1 2 1 3M14 4c0 1.5-1 2-1 3" />
                      </svg>
                    ) : (
                      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <ellipse cx="9" cy="14" rx="5" ry="3" />
                        <ellipse cx="15" cy="10" rx="4.5" ry="2.5" />
                        <ellipse cx="11" cy="7" rx="3.5" ry="1.8" />
                      </svg>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold tracking-wide text-emerald-700 ring-1 ring-emerald-200">
                    FREE
                  </span>
                </div>

                <h3 className="relative mt-4 text-lg font-semibold tracking-tight text-[#0F172A] sm:text-xl">
                  {a.name}
                </h3>
                <p className="relative mt-1.5 text-sm leading-relaxed text-slate-600">
                  {a.tagline}
                </p>

                <div className="relative my-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                <div className="relative flex items-center gap-2 text-xs font-medium text-slate-500">
                  <svg className="h-4 w-4 text-[#14B8A6]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.58l-1.3-1.3a1 1 0 0 0-1.4 1.42l2 2a1 1 0 0 0 1.4 0l4-4Z" clipRule="evenodd" />
                  </svg>
                  Included with any session
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/book"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#14B8A6] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#14B8A6]/20 transition-all hover:bg-[#0D9488] hover:shadow-xl hover:shadow-[#14B8A6]/30 active:scale-95"
            >
              Book your treatment
              <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.69l-3.22-3.22a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-40 blur-3xl"
              style={{ background: "rgba(20,184,166,0.25)" }}
            />
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h3 className="text-2xl font-semibold text-[#0F172A] md:text-3xl">
                  Not sure what to book?
                </h3>
                <p className="mt-3 text-slate-600">
                  Choose any service and add your goals (pain, stress, recovery) in the notes.
                  We will tailor the session for you.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center rounded-xl bg-[#14B8A6] px-7 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0D9488] hover:shadow-xl active:scale-95"
                >
                  Book Now
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

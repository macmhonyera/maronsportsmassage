import Image from "next/image";
import Link from "next/link";
import AddOnCarousel from "./AddOnCarousel";

export const metadata = {
  title: "Services | Sports Massage",
  description: "Browse massage and spa services. Book online.",
};

function moneyUSD(amount) {
  return `$${Number(amount).toFixed(0)}`;
}

const SERVICES = [
  {
    id: "swedish-60",
    name: "Swedish Massage",
    tagline: "Relax & reduce muscle tension",
    price: 30,
    durationMin: 60,
    image: "/images/thai.jpg",
    benefits: ["Relieves stress and tension", "Improves circulation", "Promotes better sleep"],
  },
  {
    id: "deep-tissue-60",
    name: "Deep Tissue Massage",
    tagline: "Relieve pain & knots",
    price: 35,
    durationMin: 60,
    image: "/images/pain.jpg",
    benefits: ["Targets deep knots", "Reduces chronic tightness", "Improves mobility"],
  },
  {
    id: "full-body-60",
    name: "Full Body Massage",
    tagline: "Improve circulation & overall well-being",
    price: 40,
    durationMin: 60,
    image: "/images/man.jpg",
    benefits: ["Full-body reset", "Boosts overall wellness", "Supports relaxation and recovery"],
  },
  {
    id: "sports-60",
    name: "Sports Massage",
    tagline: "Enhance performance & reduce soreness",
    price: 40,
    durationMin: 60,
    image: "/images/spo.png",
    benefits: ["Speeds up recovery", "Reduces muscle soreness", "Improves performance readiness"],
  },
  {
    id: "thai-60",
    name: "Thai Massage",
    tagline: "Improve flexibility & balance",
    price: 40,
    durationMin: 60,
    image: "/images/thai.jpg",
    benefits: ["Improves flexibility", "Releases tight muscles", "Supports posture and balance"],
  },
  {
    id: "aromatherapy-60",
    name: "Aromatherapy Massage",
    tagline: "Promote relaxation & emotional balance",
    price: 30,
    durationMin: 60,
    image: "/images/aro.png",
    benefits: ["Calms the nervous system", "Reduces stress and anxiety", "Enhances mood and relaxation"],
  },
  {
    id: "hotstone-60",
    name: "Hot Stone Massage",
    tagline: "Melt stress & soothe muscles",
    price: 35,
    durationMin: 60,
    image: "/images/hot.png",
    benefits: ["Deep muscle relaxation", "Eases stiffness with heat", "Improves circulation"],
  },
  {
    id: "cupping-therapy-60",
    name: "Cupping Therapy",
    tagline: "Release tension & improve circulation",
    price: 35,
    durationMin: 60,
    image: "/images/neck.jpg",
    benefits: ["Releases deep tightness", "Supports circulation", "Aids recovery and mobility"],
  },
  {
    id: "lymphatic-drainage-60",
    name: "Lymphatic Drainage",
    tagline: "Boost immunity & reduce swelling",
    price: 30,
    durationMin: 60,
    image: "/images/man.jpg",
    benefits: ["Reduces fluid retention", "Supports immune function", "Promotes detox and recovery"],
  },
];

const SPECIALS = [
  {
    id: "gentlemens-package",
    name: "Gentlemen’s Package",
    price: 50,
    image: "/images/gent.png",
    tagline: "Best-value bundle for a full refresh",
    includes: ["Foot Scrub", "Full Body Massage", "Facial Cleanse", "Underarm Wax"],
    benefits: ["Complete head-to-toe refresh", "Great value bundle", "Perfect for events and self-care days"],
  },
];

const ADD_ONS = [
  { id: "foot-scrub", name: "Foot Scrub", price: 20, tagline: "Refresh tired feet" },
  { id: "back-scrub", name: "Back Scrub", price: 15, tagline: "Smooth skin & deep cleanse" },
  { id: "quads-hamstrings", name: "Quads & Hamstrings", price: 15, tagline: "Focused recovery for legs" },
  { id: "back-neck-head", name: "Back, Neck & Head", price: 15, tagline: "Target upper-body tension" },
  { id: "waxing", name: "Waxing", price: 10, tagline: "Smooth skin & reduce hair" },
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

        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 md:pt-28 md:pb-20">
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
      <section id="services" className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#0F172A] md:text-4xl">
              Services
            </h2>
            <p className="mt-3 text-base text-slate-600 md:text-lg">
              Clear services, real benefits, and a premium experience choose what fits your goal.
            </p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <div
                key={s.id}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Glow accent */}
                <div
                  className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-40"
                  style={{ background: "rgba(20,184,166,0.35)" }}
                />

                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={s.image}
                    alt={s.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />

                  {/* Top pills: duration + price */}
                  <div className="absolute left-5 top-5 flex items-center gap-2">
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      {s.durationMin} min
                    </span>

                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-[#0F172A]">
                        {s.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">{s.tagline}</p>
                    </div>

                    {/* PRICE */}
                    <div className="text-right">
                      <div className="text-xs text-slate-500">From</div>
                      <div className="text-lg font-semibold text-[#0F172A]">
                        {moneyUSD(s.price)}
                      </div>
                    </div>
                  </div>


                  <ul className="mt-4 space-y-2 text-sm text-slate-700">
                    {s.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[#14B8A6]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex items-center gap-3">
                    <Link
                      href="/book"
                      className="inline-flex w-full items-center justify-center rounded-xl bg-[#14B8A6] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0D9488] hover:shadow-md"
                    >
                      Book Now
                    </Link>
                    <a
                      href="#addons"
                      className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                    >
                      Add-ons
                    </a>
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    Tip: Add-ons can be requested during booking notes or via WhatsApp.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIALS */}
      <section id="specials" className="bg-slate-50 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#0F172A] md:text-4xl">
              Specials
            </h2>
            <p className="mt-3 text-base text-slate-600 md:text-lg">
              Bundles designed for maximum value and a complete refresh.
            </p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {SPECIALS.map((sp) => (
              <div
                key={sp.id}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={sp.image}
                    alt={sp.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/45 via-transparent to-transparent" />

                  <div className="absolute left-5 top-5 flex items-center gap-2">
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      Special
                    </span>

                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-semibold text-[#0F172A]">
                      {sp.name}
                    </h3>

                    <div className="text-right">
                      <div className="text-xs text-slate-500">Package</div>
                      <div className="text-xl font-semibold text-[#0F172A]">
                        {moneyUSD(sp.price)}
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{sp.tagline}</p>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-sm font-semibold text-slate-900">
                        Includes
                      </div>
                      <ul className="mt-2 space-y-2 text-sm text-slate-700">
                        {sp.includes.map((i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[#14B8A6]" />
                            <span>{i}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="text-sm font-semibold text-slate-900">
                        Benefits
                      </div>
                      <ul className="mt-2 space-y-2 text-sm text-slate-700">
                        {sp.benefits.map((b) => (
                          <li key={b} className="flex items-start gap-2">
                            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[#14B8A6]" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <Link
                      href="/book"
                      className="inline-flex w-full items-center justify-center rounded-xl bg-[#14B8A6] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0D9488] hover:shadow-md"
                    >
                      Book Package
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                    >
                      Ask a Question
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADD-ONS */}
      <section id="addons" className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#0F172A] md:text-4xl">
              Add-ons
            </h2>
            <p className="mt-3 text-base text-slate-600 md:text-lg">
              Upgrade your session with targeted extras.
            </p>
          </div>

          <div className="mt-10 relative">
            {/* <div className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4">
    {ADD_ONS.map((a) => (
      <div
        key={a.id}
        className="min-w-[280px] sm:min-w-[320px] snap-start rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-900">{a.name}</div>
            <div className="mt-1 text-sm text-slate-600">{a.tagline}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">Add-on</div>
            <div className="text-lg font-semibold text-[#0F172A]">
              {moneyUSD(a.price)}
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Request this add-on during booking (notes) or via WhatsApp.
        </p>
      </div>
    ))}
  </div> */}
            <AddOnCarousel items={ADD_ONS} />
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-xl bg-[#14B8A6] px-7 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0D9488] hover:shadow-xl active:scale-95"
            >
              Book your Treatment
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
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

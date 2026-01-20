import Link from "next/link";
import Image from "next/image";
import Section from "../../components/Section";
import Reviews from "../../components/Reviews";
import GoogleMapEmbed from "../../components/GoogleMapEmbed";

export const metadata = {
  title: "Maron Sports Massage | Book Recovery & Performance Sessions",
  description: "Book sports massage sessions online. Recovery-focused treatments.",
};

function randInt(n) {
  return Math.floor(Math.random() * n);
}

function centsToZAR(cents) {
  return `R ${(cents / 100).toFixed(0)}`;
}

/**
 * HARD-CODED SERVICES
 * - Keep this list in sync with your /services page and booking dropdown
 * - The homepage shows only the first 3 (sorted by durationMin)
 */
const SERVICES = [
  {
    id: "sports-60",
    name: "Sports Massage",
    description:
      "Targeted deep-tissue massage designed to improve performance, reduce soreness, and speed up recovery.",
    durationMin: 60,
    priceCents: 65000,
  },
  {
    id: "relax-60",
    name: "Relaxation Massage",
    description:
      "A calming full-body massage to reduce stress, improve circulation, and promote total relaxation.",
    durationMin: 60,
    priceCents: 60000,
  },
  {
    id: "recovery-75",
    name: "Recovery Massage",
    description:
      "A balanced blend of therapeutic and relaxation techniques ideal for fitness enthusiasts.",
    durationMin: 75,
    priceCents: 70000,
  },
  {
    id: "deep-90",
    name: "Deep Tissue Massage",
    description:
      "Intensive muscle therapy to release chronic tension and restore mobility.",
    durationMin: 90,
    priceCents: 80000,
  },
  {
    id: "stretch-45",
    name: "Assisted Stretch Therapy",
    description:
      "Guided stretching to improve flexibility, joint range of motion, and post-workout recovery.",
    durationMin: 45,
    priceCents: 55000,
  },
];

export default async function HomePage() {
  // Ensure consistent ordering, then take 3 for homepage
  const services = [...SERVICES].sort((a, b) => a.durationMin - b.durationMin).slice(0, 3);

  const features = [
    {
      title: "Sport-Specific Care",
      description: "Treatment plans tailored to your training load and competition schedule.",
    },
    {
      title: "Easy Online Booking",
      description: "Pick a slot, confirm instantly, and get reminders before your session.",
    },
    {
      title: "WhatsApp Support",
      description: "Fast communication for rescheduling, questions, and appointment updates.",
    },
    {
      title: "Personalized Sessions",
      description: "Each session is adapted to your body’s needs—whether recovery, relaxation, or both.",
    },
  ];

  const serviceImages = ["/images/man.jpg", "/images/pain.jpg", "/images/tissue.jpg"];

  return (
    <div className="space-y-0">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0B1224]/80">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=2400&q=80"
            alt="Athlete recovery and therapy"
            fill
            className="object-cover mix-blend-luminosity"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1224]/60 via-[#0B1224]/85 to-[#0B1224]" />
          <div
            className="absolute inset-0 opacity-80"
            style={{
              background:
                "radial-gradient(900px 360px at 70% 15%, rgba(20,184,166,0.25) 0%, rgba(151, 248, 237, 0) 60%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-28 pb-16 md:pt-36 md:pb-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#14B8A6]" />
                Recovery • Performance • Mobility
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
                Modern massage for <span className="text-[#5EEAD4]">peak performance</span> and{" "}
                <span className="text-white">total relaxation</span>.
              </h1>

              <p className="mt-5 max-w-2xl text-base text-slate-200 sm:text-lg">
                We delivers targeted treatment for athletes and active individuals. Reduce soreness, improve mobility,
                and stay ready for your next session.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center rounded-xl bg-[#14B8A6] px-7 py-4 text-sm font-semibold text-white shadow-lg transition
                             hover:bg-[#0D9488] hover:shadow-xl active:scale-95"
                >
                  Book Your Session
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-7 py-4 text-sm font-semibold text-white
                             backdrop-blur transition hover:bg-white/15 hover:border-white/30"
                >
                  Explore Services
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { k: "60–90 min", v: "Sessions" },
                  { k: "Home Visits", v: "Availability" },
                  { k: "Online", v: "Booking" },
                  { k: "WhatsApp", v: "Support" },
                ].map((item) => (
                  <div
                    key={item.v}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 text-white/90 backdrop-blur"
                  >
                    <div className="text-sm font-semibold">{item.k}</div>
                    <div className="mt-1 text-xs text-white/70">{item.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
                <div className="flex items-center justify-center">
                  <div className="relative h-24 w-[360px]">
                    <Image
                      src="/logo/logo3.png"
                      alt="Maron Sports Massage"
                      fill
                      className="object-contain"
                      priority
                      sizes="360px"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    "Deep tissue, trigger point & assisted stretching",
                    "Sport-specific recovery for training blocks",
                    "Online booking + reminder workflow",
                    "Transformative Touch: At your door steps",
                  ].map((t) => (
                    <div
                      key={t}
                      className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85"
                    >
                      <span className="mt-1 inline-block h-2 w-2 flex-none rounded-full bg-[#14B8A6]" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>

                <div
                  className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-40 blur-3xl"
                  style={{ background: "rgba(20,184,166,0.35)" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="h-10 bg-gradient-to-b from-[#0B1224] to-white" />
      </section>

      {/* FEATURES */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#0F172A] md:text-4xl">
              Built for recovery and performance
            </h2>
            <p className="mt-3 text-base text-slate-600 md:text-lg">
              A modern therapy experience—from booking to treatment to follow-up.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-900">{feature.title}</div>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#14B8A6]/10 text-[#0D9488]">
                    ✓
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-slate-600">{feature.description}</p>
                <div className="mt-5 h-1 w-12 rounded-full bg-[#14B8A6]/40 transition-all group-hover:w-16" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES (ONLY 3) */}
      <section className="bg-slate-50 py-14 md:py-20">
        <div className="mx-auto max-w-[1600px] px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#0F172A] md:text-4xl">Our Services</h2>
            <p className="mt-3 text-base text-slate-600 md:text-lg">
              A preview of our most popular treatments. Explore more on the services page.
            </p>
          </div>

          <div className="mt-4 grid gap-6 md:grid-cols-3">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={serviceImages[(index + randInt(serviceImages.length)) % serviceImages.length]}
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />

                  <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    {service.durationMin} min
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold text-[#0F172A]">{service.name}</h3>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.description}</p>

                  <div className="mt-5 flex items-center gap-3">
                    <Link
                      href="/book"
                      className="inline-flex w-full items-center justify-center rounded-xl bg-[#14B8A6] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0D9488] hover:shadow-md"
                    >
                      Book Now
                    </Link>
                    <Link
                      href="/services"
                      className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                    >
                      Explore
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex items-center text-sm font-semibold text-[#0D9488] hover:text-[#0B766E] hover:underline decoration-[#14B8A6] decoration-2 underline-offset-4"
            >
              View All Services
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <Section title="What Our Clients Say" subtitle="Real feedback from athletes and active individuals">
            <Reviews />
          </Section>
        </div>
      </section>

      {/* LOCATION */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0">
          <Image
            src="/images/img2.jpg"
            alt="Sports recovery location"
            fill
            className="object-cover"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/20 to-white/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-4xl rounded-3xl border border-white/30 bg-white/80 p-6 shadow-xl backdrop-blur-lg md:p-10">
            <Section title="Visit Us" subtitle="Conveniently located with easy access and parking">
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <GoogleMapEmbed />
              </div>
            </Section>
          </div>
        </div>
      </section>
    </div>
  );
}

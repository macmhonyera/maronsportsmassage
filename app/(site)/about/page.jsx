import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About | Maron Fitnes  Massage &Spa",
  description: "Learn about our mission, approach, and therapist standards.",
};

export default function AboutPage() {
  const values = [
    {
      title: "Precision",
      description: "Every session is tailored to your body needs comfort level and goals whether recovery, relaxation or mobility.",
    },
    {
      title: "Performance",
      description: "Supporting your body to move, function and feel its best in daily life work and physical activity.",
    },
    {
      title: "Partnership",
      description: "We work with you to achieve your training and competition goals.",
    },
    {
      title: "Evidence-Based",
      description: "Using proven techniques backed by sports science and research.",
    },
  ];

  const benefits = [
    {
      title: "Injury & Tension Prevention",
      description: "Identify and address tightness, imbalances and stress before they turn into bigger issues.",
    },
    {
      title: "Improved Movement & Performance",
      description: "Enhance flexibility, mobility, and overall body function.",
    },
    {
      title: "Personalised Care",
      description: "Every session is adapted to your body needs whether recovery relaxtion mobility or deep relief.",
    },
     {
      title: "Evidence-Informed Care",
      description: "We use proven massage techniques guided by anatomy, movement science and hands-on experience.",
    },
  ];

  const approach = [
    {
      title: "Assessment First",
      description:
        "We begin by understanding your body, lifestyle and goals-wheteher for stress relief, recovery, mobility, or perfomance.",
    },
    {
      title: "Customized Treatment",
      description:
        "Each session is tailored to your needs-deep tissue, relaxation, Swedish, Thai or sports-focused techniques ensuring you get the right care every time.",
    },
    {
      title: "Continuous Support",
      description:
        "We follow your progress adapt treatments as your body changes and help you mantain wellness, mobility and overall balance.",
    },
  ];

  return (
    <div className="space-y-0">
      {/* HERO (match home page style) */}
      <section className="relative overflow-hidden bg-[#0B1224]">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=2400&q=80"
            alt="About Maron Sports Massage"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1224]/35 via-[#0B1224]/70 to-[#0B1224]" />
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(900px 320px at 70% 10%, rgba(20,184,166,0.22) 0%, rgba(20,184,166,0) 65%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-28 pb-16 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#14B8A6]" />
              About Maron Fitness | Massage &Spa
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
              Built for movement. Designed for recovery and {" "}
              <span className="text-[#5EEAD4]">wellness</span>.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base text-slate-200 sm:text-lg">
              We combine sports science, hands-on expertise, and a modern client
              experience—from booking to follow-up—to keep you moving at your best.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-xl bg-[#14B8A6] px-7 py-4 text-sm font-semibold text-white shadow-lg transition
                           hover:bg-[#0D9488] hover:shadow-xl active:scale-95"
              >
                Book a Session
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-7 py-4 text-sm font-semibold text-white
                           backdrop-blur transition hover:bg-white/15 hover:border-white/25"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>

        <div className="h-10 bg-gradient-to-b from-[#0B1224] to-white" />
      </section>

      {/* STORY (same layout, modern card + label) */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative h-96 overflow-hidden rounded-3xl bg-slate-100 shadow-sm lg:h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&h=1000&fit=crop"
                alt="Sports massage therapy"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent" />

              {/* subtle corner badge */}
              <div className="absolute left-5 top-5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                Athlete-first care
              </div>
            </div>

            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-900">
                <span className="h-2 w-2 rounded-full bg-[#14B8A6]" />
                Our Story
              </div>

              <h2 className="text-4xl font-semibold tracking-tight text-[#0B1224] md:text-5xl">
                Built for recovery. Guided by movement.
              </h2>

              <p className="mt-6 text-lg leading-relaxed text-slate-700">
                We understand the demands that movement, work and everyday life place on the body. Our massage therapy approach blends sports-informed 
                techniques with therapeutic and relaxation-based care, supporting everyone from active individulas and fitness enthusiasts to those managing stress, tension or fatigue.
              </p>

              <p className="mt-4 text-lg leading-relaxed text-slate-700">
               We offer evidence-informed massage focused on recovery, mobility and wellbeing. Every session is
               personalised to your bodys needs, goals and lifestyle so you leave feeling restored, balanced and ready for whats next.
              </p>

              <div className="mt-8">
                <Link
                  href="/book"
                  className="inline-flex items-center rounded-xl bg-[#0B1224] px-6 py-3 text-sm font-semibold text-white shadow-sm transition
                             hover:bg-slate-900 hover:shadow-md active:scale-95"
                >
                  Book Your Session
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES (replace emojis with classy icon tiles like home page) */}
      <section className="bg-slate-50 py-10 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-[#0B1224] md:text-5xl">
              Our Core Values
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              What drives our standard of care—every session, every client.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#14B8A6]/40"
              >
                <div className="flex items-center justify-between">
                  <div className="text-base font-semibold text-slate-900">
                    {value.title}
                  </div>

                  {/* classy icon tile */}
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#14B8A6]/10 text-[#0D9488] ring-1 ring-inset ring-[#14B8A6]/20">
                    ✓
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {value.description}
                </p>

                <div className="mt-5 h-1 w-12 rounded-full bg-[#14B8A6]/30 transition-all group-hover:w-16" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS (same card style, no emojis, sporty accents) */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-900">
                <span className="h-2 w-2 rounded-full bg-[#14B8A6]" />
                What You Get
              </div>

              <h2 className="text-4xl font-semibold tracking-tight text-[#0B1224] md:text-5xl">
                Why Choose Maron Fitness | Massage &Spa?
              </h2>

              <p className="mt-6 text-lg leading-relaxed text-slate-700">
                Clear communication, professional standards, and an outcome-driven approach.
                Tell us about your event or training block—we tailor the work accordingly.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#14B8A6]/10 text-[#0D9488] ring-1 ring-inset ring-[#14B8A6]/20">
                        ✓
                      </span>
                      <div>
                        <h3 className="font-semibold text-slate-900">{benefit.title}</h3>
                        <p className="mt-1 text-sm text-slate-600">{benefit.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative order-1 h-96 overflow-hidden rounded-3xl bg-slate-100 shadow-sm lg:order-2 lg:h-[500px]">
              <Image
                src="/images/pain.jpg"
                alt="Athlete recovery"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* APPROACH (use same modern cards, consistent icon tiles) */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-900 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#14B8A6]" />
              Our Approach
            </div>

            <h2 className="text-4xl font-semibold tracking-tight text-[#0B1224] md:text-5xl">
              Evidence-Informed. Personalised for Every body.
            </h2>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {approach.map((a, idx) => (
                <div
                  key={a.title}
                  className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#14B8A6]/10 text-[#0D9488] ring-1 ring-inset ring-[#14B8A6]/20">
                      {idx + 1}
                    </span>
                    <div className="h-1 w-12 rounded-full bg-[#14B8A6]/30" />
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {a.title}
                  </h3>
                  <p className="text-slate-600">{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 md:py-28">
  {/* Background image */}
  <div className="absolute inset-0">
    <Image
      src="/images/img2.jpg"
      alt="Athlete performance and recovery"
      fill
      className="object-cover"
      priority={false}
    />

    {/* Contrast overlays (do NOT reduce image opacity) */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#0B1224]/40 via-[#0B1224]/65 to-[#0B1224]/80" />
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(900px 360px at 50% 20%, rgba(20,184,166,0.25) 0%, rgba(20,184,166,0) 60%)",
      }}
    />
  </div>

  {/* Content */}
  <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
      <span className="h-2 w-2 rounded-full bg-[#14B8A6]" />
      Start Your Recovery
    </div>

    <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
      Ready to feel your best?
    </h2>

    <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-200">
      Book your session today and experience the difference expert massage therapy can make whether it is recovery, relaxation, mobility or overal wellbeing.
    </p>

    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <Link
        href="/book"
        className="inline-flex items-center rounded-xl bg-[#14B8A6] px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300
                   hover:bg-[#0D9488] hover:shadow-xl active:scale-95"
      >
        Book Now
        <svg
          className="ml-2 h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </Link>

      <Link
        href="/services"
        className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-8 py-3 text-sm font-semibold text-white
                   backdrop-blur transition hover:bg-white/20 hover:border-white/30"
      >
        View Services
      </Link>
    </div>
  </div>
</section>
<div className="h-10 bg-gradient-to-b from-[#0B1224] to-white" />

    </div>
  );
}

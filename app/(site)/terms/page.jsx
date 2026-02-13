import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Sports Massage",
  description: "Terms, cancellations, payments, and studio policies.",
};

export default function TermsPage() {
  const sections = [
    {
      title: "1) Booking Policy",
      items: [
        "Online booking is recommended to secure your preferred time.",
        "Your booking is considered confirmed once you receive a confirmation message/email or it is marked confirmed by admin.",
        "If you do not receive confirmation, please contact us to verify your booking.",
      ],
    },
    {
      title: "2) Arrival & Late Arrivals",
      items: [
        "Please arrive 10 minutes before your appointment to complete any consultation and begin your relaxation process.",
        "If you arrive late, your session may be shortened to avoid delaying other clients.",
        "Late arrivals are charged the full service fee. Where possible, we will do our best to accommodate the full session time.",
      ],
    },
    {
      title: "3) Cancellations & Rescheduling",
      items: [
        "Please cancel or reschedule at least 24 hours before your appointment.",
        "Same-day cancellations or no-shows may be subject to a fee or may require prepayment for future bookings.",
        "To cancel or reschedule, contact us via WhatsApp or the contact page.",
      ],
    },
    {
      title: "4) Payments & Pricing",
      items: [
        "Accepted payment methods: Cash, EcoCash.",
        "For mobile payments, please include any applicable cash-out charges.",
        "Service prices may be subject to applicable taxes.",
        "Gratuities are appreciated but not required.",
      ],
    },
    {
      title: "5) Health & Safety",
      items: [
        "Please inform us before your session of any medical conditions, injuries, pregnancy, allergies, or sensitivities.",
        "We may advise against certain treatments or adjust techniques based on health considerations (contraindications).",
        "If you are feeling unwell (flu-like symptoms, fever, contagious illness), please reschedule for the safety of all guests.",
      ],
    },
    {
      title: "6) Privacy & Confidentiality",
      items: [
        "Any personal information you share with us is treated as confidential.",
        "We do not sell or share your personal details with third parties except where required for booking operations or legal compliance.",
      ],
    },
    {
      title: "7) Studio Conduct & Professional Boundaries",
      items: [
        "We maintain a respectful, professional environment. Inappropriate behavior will not be tolerated.",
        "You may undress to your comfort level. Proper draping techniques are always used to ensure privacy.",
        "We reserve the right to end a session immediately if conduct is inappropriate or unsafe.",
      ],
    },
    {
      title: "8) Liability Waiver",
      items: [
        "By booking, you acknowledge that massage and bodywork may involve physical contact and movement that may cause temporary discomfort.",
        "You agree to release and hold harmless the business and therapist(s) from liability related to discomfort, injury, or other outcomes that may arise during or after treatment, except where prohibited by law.",
        "If you experience pain during a session, please inform your therapist immediately so pressure/technique can be adjusted.",
      ],
    },
    {
      title: "9) WhatsApp & Communication",
      items: [
        "If you opt in, we may send appointment confirmations, reminders, and booking updates via WhatsApp.",
        "You can opt out at any time by informing us or by updating your preferences where available.",
      ],
    },
    {
      title: "10) Feedback & Customer Support",
      items: [
        "We welcome feedback to improve your experience.",
        "If anything was not satisfactory, please contact us as soon as possible after your appointment so we can assist.",
      ],
    },
  ];

  return (
    <div className="space-y-0">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0B1224] py-16 md:py-24">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1224]/70 via-[#0B1224]/90 to-[#0B1224]" />
          <div
            className="absolute inset-0 opacity-80"
            style={{
              background:
                "radial-gradient(900px 360px at 70% 15%, rgba(20,184,166,0.22) 0%, rgba(151, 248, 237, 0) 60%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#14B8A6]" />
              Policies • Terms • Studio Guidelines
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Terms & Conditions
            </h1>

            <p className="mt-4 text-lg text-slate-200 sm:text-xl">
              Clear, simple policies so you know what to expect before your appointment.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-xl bg-[#14B8A6] px-7 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0D9488] hover:shadow-xl active:scale-95"
              >
                Book Your Treatment
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15 hover:border-white/30"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
            {/* Quick note */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">Note:</span> These terms are intended to keep appointments
              smooth, safe, and professional for everyone. If you have questions, please contact us before booking.
            </div>

            {/* Sections */}
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {sections.map((s) => (
                <div
                  key={s.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <h2 className="text-lg font-bold text-[#0F172A]">{s.title}</h2>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-2 inline-block h-2 w-2 rounded-full bg-[#14B8A6]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Footer note */}
            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
              <div className="font-semibold text-slate-900">Agreement</div>
              <p className="mt-2">
                By booking a service, you acknowledge that you have read and agree to these terms and policies.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

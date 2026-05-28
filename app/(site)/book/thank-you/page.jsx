import Link from "next/link";

export const metadata = {
  title: "Booking Received | Maron's Muscle Studio",
  description: "Your booking request has been received.",
};

export default function ThankYouPage() {
  return (
    <div className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200">
          <svg className="h-10 w-10 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="reveal mt-8 font-serif text-4xl font-normal tracking-tight text-[#0F1F2E] sm:text-5xl md:text-6xl leading-[1.05]">
          Booking received
        </h1>
        <p className="mt-4 text-base text-slate-600 sm:text-lg">
          Thanks for booking with Maron&apos;s Muscle Studio. We&apos;ve received your request and will confirm it shortly via email and WhatsApp.
        </p>

        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left text-sm text-slate-700">
          <div className="font-semibold text-[#0F1F2E]">What happens next</div>
          <ul className="mt-3 space-y-2">
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#0EA5A8]" />
              <span>Our team will review your request and confirm your slot.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#0EA5A8]" />
              <span>You&apos;ll get a confirmation email once your booking is approved.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#0EA5A8]" />
              <span>We&apos;ll send a reminder one hour before your session.</span>
            </li>
          </ul>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0EA5A8] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#0B7E80] hover:shadow-lg"
          >
            Back to home
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-[#0F1F2E] transition hover:bg-slate-50"
          >
            Browse services
          </Link>
        </div>

        <p className="mt-8 text-xs text-slate-500">
          Need to change something? Reach us on{" "}
          <a href="/contact" className="font-semibold text-[#0EA5A8] hover:underline">
            our contact page
          </a>
          .
        </p>
      </div>
    </div>
  );
}

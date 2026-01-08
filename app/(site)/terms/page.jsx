export const metadata = {
  title: "Terms & Conditions | Sports Massage",
  description: "Terms, cancellations, and policies.",
};

export default function TermsPage() {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="bg-[#0B1F3A] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">Terms & Conditions</h1>
            <p className="mt-4 text-lg text-slate-200 sm:text-xl">Please read our policies and terms of service.</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-2xl border border-[#CBD5E1] bg-white p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <div className="space-y-6 text-[#64748B]">
                <div className="rounded-lg border border-[#CBD5E1] bg-white p-6">
                  <h2 className="text-xl font-bold text-[#0B1F3A] mb-3">Bookings</h2>
                  <p>Your booking is confirmed once accepted by the practice (or marked confirmed by admin).</p>
                </div>

                <div className="rounded-lg border border-[#CBD5E1] bg-white p-6">
                  <h2 className="text-xl font-bold text-[#0B1F3A] mb-3">Cancellations</h2>
                  <p>Please cancel or reschedule at least 12 hours before your appointment.</p>
                </div>

                <div className="rounded-lg border border-[#CBD5E1] bg-white p-6">
                  <h2 className="text-xl font-bold text-[#0B1F3A] mb-3">Late Arrivals</h2>
                  <p>Late arrivals may reduce session time to avoid delaying other clients.</p>
                </div>

                <div className="rounded-lg border border-[#CBD5E1] bg-white p-6">
                  <h2 className="text-xl font-bold text-[#0B1F3A] mb-3">Medical Disclaimer</h2>
                  <p>Please consult a clinician for medical advice. Inform us of injuries and conditions.</p>
                </div>

                <div className="rounded-lg border border-[#CBD5E1] bg-white p-6">
                  <h2 className="text-xl font-bold text-[#0B1F3A] mb-3">WhatsApp Reminders</h2>
                  <p>If you opt in, we may send appointment or rebooking reminders via WhatsApp. You can opt out at any time.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

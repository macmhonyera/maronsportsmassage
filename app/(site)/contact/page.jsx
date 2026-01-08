import Image from "next/image";
import GoogleMapEmbed from "../../../components/GoogleMapEmbed";
import ContactForm from "../../../components/ContactForm";

export const metadata = {
  title: "Contact | Sports Massage",
  description: "Get in touch, find our location, and book your session.",
};

export default function ContactPage() {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0F172A] py-16 md:py-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80"
            alt="Contact us"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">Contact Us</h1>
            <p className="mt-4 text-lg text-slate-200 sm:text-xl">Get in touch with us. We&apos;re here to help!</p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Get In Touch</h2>
                <div className="space-y-4 text-[#64748B]">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">📞</div>
                    <div>
                      <div className="font-semibold text-[#0F172A]">Phone</div>
                      <div className="text-[#64748B]">+27 00 000 0000</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">✉️</div>
                    <div>
                      <div className="font-semibold text-[#0F172A]">Email</div>
                      <div className="text-[#64748B]">hello@example.com</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🕐</div>
                    <div>
                      <div className="font-semibold text-[#0F172A]">Hours</div>
                      <div className="text-[#64748B]">Mon–Sat 08:00–18:00</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <a
                    href={process.env.NEXT_PUBLIC_WHATSAPP_LINK || "https://wa.me/"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-lg bg-[#14B8A6] px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#0D9488] hover:shadow-lg"
                  >
                    💬 WhatsApp us
                  </a>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <GoogleMapEmbed />
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

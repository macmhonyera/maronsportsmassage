import Image from "next/image";
import Link from "next/link";
import { prisma } from "../../../lib/prisma";

export const metadata = {
  title: "Services | Sports Massage",
  description: "Browse massage services and durations. Book online.",
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { durationMin: "asc" },
  });

  const serviceImages = [
    "/images/man.jpg",
    "/images/pain.jpg",
    "/images/man.jpg",
  ];

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0F172A] py-16 md:py-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/man.jpg"
            alt="Services"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Our Services
            </h1>
            <p className="mt-4 text-lg text-slate-200 sm:text-xl">
              Professional sports massage tailored to your recovery needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={serviceImages[index % serviceImages.length]}
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-[#0F172A]">
                    {service.name}
                  </h3>

                  <p className="mt-2 text-[#64748B]">
                    {service.description}
                  </p>

                  <div className="mt-6 border-t border-slate-200 pt-4">
                    <div className="text-sm text-[#64748B]">Session length</div>
                    <div className="font-semibold text-[#0F172A]">
                      {service.durationMin} minutes
                    </div>
                  </div>

                  <Link
                    href="/book"
                    className="mt-6 inline-block w-full rounded-lg bg-[#14B8A6] px-4 py-3 text-center font-semibold text-white transition-all duration-300 hover:bg-[#0D9488] hover:shadow-md"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import Image from "next/image";
import { prisma } from "../../../lib/prisma";
import TherapistCard from "../../../components/TherapistCard";

export const metadata = {
  title: "Therapists | Sports Massage",
  description: "Meet our therapists and their specialties. Book online.",
};

export default async function TherapistsPage() {
  const therapists = await prisma.therapist.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0B1F3A] py-16 md:py-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1920&q=80"
            alt="Therapists"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">Our Therapists</h1>
            <p className="mt-4 text-lg text-slate-200 sm:text-xl">Choose a therapist based on your sport and recovery needs.</p>
          </div>
        </div>
      </section>

      {/* Therapists Grid */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-2">
            {therapists.map((therapist) => (
              <TherapistCard key={therapist.id} therapist={therapist} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

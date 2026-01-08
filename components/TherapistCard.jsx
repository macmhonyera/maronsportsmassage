"use client";

import Image from "next/image";
import { useState } from "react";

export default function TherapistCard({ therapist }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group overflow-hidden rounded-2xl border border-[#CBD5E1] bg-white shadow-sm transition-all duration-300 hover:border-[#38BDF8] hover:shadow-xl hover:-translate-y-1">
      <div className="md:flex">
        <div className="relative h-64 w-full overflow-hidden bg-[#CBD5E1] md:h-auto md:w-64">
          {therapist.photoUrl && !imageError ? (

            <Image
              src={therapist.photoUrl}
              alt={therapist.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#0B1F3A] text-6xl font-bold text-white">
              {therapist.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-2xl font-semibold text-[#0B1F3A]">{therapist.name}</h3>
          {therapist.specialties && (
            <div className="mt-2 flex flex-wrap gap-2">
              {therapist.specialties.split(",").map((specialty, idx) => (
                <span
                  key={idx}
                  className="inline-block rounded-full bg-[#CBD5E1]/50 px-3 py-1 text-sm font-medium text-[#0B1F3A]"
                >
                  {specialty.trim()}
                </span>
              ))}
            </div>
          )}
          {therapist.bio && (
            <p className="mt-4 flex-1 text-[#64748B] leading-relaxed">{therapist.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
}

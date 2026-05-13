import { notFound } from "next/navigation";
import BookingForm from "../../BookingForm";
import { prisma } from "../../../../../lib/prisma";
import { splitE164 } from "../../../../../lib/phoneNumber.js";
import { toISODateHarare, toHHMMHarare } from "../../../../../lib/time";

export const metadata = { title: "Edit Booking | Admin" };

export default async function AdminEditBookingPage({ params }) {
  const p = await params;
  const id = p?.id;

  if (!id) {
    notFound();
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      client: true,
      service: true,
      therapist: true,
    },
  });

  if (!booking) {
    notFound();
  }

  const parsedPhone = splitE164(booking.client?.phone || "");

  return (
    <BookingForm
      mode="edit"
      bookingId={booking.id}
      initialValues={{
        dateISO: toISODateHarare(booking.startAt),
        timeHHMM: toHHMMHarare(booking.startAt),
        serviceId: booking.serviceId,
        serviceName: booking.service?.name || "",
        therapistPreference: booking.therapistPreference || "any",
        therapistId: booking.therapistId || "",
        fullName: booking.client?.fullName || "",
        countryCode: parsedPhone?.countryCode || "",
        phone: parsedPhone?.localNumber || booking.client?.phone || "",
        email: booking.client?.email || "",
        whatsappOptIn: Boolean(booking.client?.whatsappOptIn),
        notes: booking.notes || "",
        focusAreas: Array.isArray(booking.focusAreas) ? booking.focusAreas : [],
        addOns: Array.isArray(booking.addOns) ? booking.addOns : [],
        bookingStatus: booking.status,
      }}
      initialOptions={{
        service: booking.service
          ? {
              id: booking.service.id,
              name: booking.service.name,
              description: booking.service.description,
              durationMin: booking.service.durationMin,
              priceCents: booking.service.priceCents,
              category: "service",
            }
          : null,
        therapist: booking.therapist
          ? {
              id: booking.therapist.id,
              name: booking.therapist.name,
            }
          : null,
      }}
    />
  );
}

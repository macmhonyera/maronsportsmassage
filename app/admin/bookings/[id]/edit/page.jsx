import { notFound } from "next/navigation";
import BookingForm from "../../BookingForm";
import { prisma } from "../../../../../lib/prisma";
import { splitE164 } from "../../../../../lib/phoneNumber.js";
import { toISODate } from "../../../../../lib/time";

export const metadata = { title: "Edit Booking | Admin" };

function toHHMM(value) {
  const date = new Date(value);
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
}

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
        dateISO: toISODate(new Date(booking.startAt)),
        timeHHMM: toHHMM(booking.startAt),
        serviceId: booking.serviceId,
        therapistPreference: booking.therapistPreference || "any",
        therapistId: booking.therapistId || "",
        fullName: booking.client?.fullName || "",
        countryCode: parsedPhone?.countryCode || "",
        phone: parsedPhone?.localNumber || booking.client?.phone || "",
        email: booking.client?.email || "",
        whatsappOptIn: Boolean(booking.client?.whatsappOptIn),
        notes: booking.notes || "",
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

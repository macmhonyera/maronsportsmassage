import { prisma } from "../../../lib/prisma";
import {
  BookingRequestError,
  PublicBookingBodySchema,
  buildBookingWriteData,
  sendAdminNewBookingEmail,
  sendClientBookingPendingEmail,
} from "../../../lib/bookingMutations";

export async function POST(req) {
  try {
    const json = await req.json();
    const body = PublicBookingBodySchema.parse(json);

    const bookingData = await buildBookingWriteData(body);

    const booking = await prisma.booking.create({
      data: {
        ...bookingData,
        source: body.source || "website",
        status: "PENDING",
        therapistId: null,
      },
      include: { client: true, service: true, therapist: true },
    });

    try {
      await sendAdminNewBookingEmail(booking);
    } catch (emailError) {
      console.error("Failed to send admin booking notification:", emailError);
    }

    try {
      await sendClientBookingPendingEmail(booking);
    } catch (emailError) {
      console.error("Failed to send client booking confirmation:", emailError);
    }

    return Response.json({ booking });
  } catch (e) {
    const status = e instanceof BookingRequestError ? e.status : 400;
    const msg = e?.message || "Invalid request";

    return new Response(JSON.stringify({ error: msg }), { status });
  }
}

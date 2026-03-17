import { prisma } from "../../../../lib/prisma";
import { getAdminSession } from "../../../../lib/auth";
import {
  AdminBookingBodySchema,
  BookingRequestError,
  buildBookingWriteData,
  sendAdminNewBookingEmail,
  sendClientBookingApprovedEmail,
} from "../../../../lib/bookingMutations";

export async function POST(req) {
  const session = await getAdminSession();

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const json = await req.json();
    const body = AdminBookingBodySchema.parse(json);

    const bookingData = await buildBookingWriteData(body);

    const booking = await prisma.booking.create({
      data: {
        ...bookingData,
        source: "admin",
        status: "CONFIRMED",
      },
      include: { client: true, service: true, therapist: true },
    });

    try {
      await sendAdminNewBookingEmail(booking);
    } catch (emailError) {
      console.error("Failed to send admin booking notification:", emailError);
    }

    try {
      await sendClientBookingApprovedEmail(booking);
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

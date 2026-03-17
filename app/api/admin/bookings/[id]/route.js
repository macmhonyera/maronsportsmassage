import { prisma } from "../../../../../lib/prisma";
import { getAdminSession } from "../../../../../lib/auth";
import {
  AdminBookingBodySchema,
  BookingRequestError,
  buildBookingWriteData,
} from "../../../../../lib/bookingMutations";

export async function PATCH(req, ctx) {
  const session = await getAdminSession();

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const { params } = ctx || {};
    const p = await params;
    const id = p?.id;

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing id" }), {
        status: 400,
      });
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingBooking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404,
      });
    }

    const json = await req.json();
    const body = AdminBookingBodySchema.parse(json);

    const bookingData = await buildBookingWriteData(body, {
      allowPast: true,
      excludeBookingId: id,
      allowInactiveSelections: true,
    });

    const booking = await prisma.booking.update({
      where: { id },
      data: bookingData,
      include: { client: true, service: true, therapist: true },
    });

    return Response.json({ booking });
  } catch (e) {
    const status = e instanceof BookingRequestError ? e.status : 400;
    const msg = e?.message || "Invalid request";

    return new Response(JSON.stringify({ error: msg }), { status });
  }
}

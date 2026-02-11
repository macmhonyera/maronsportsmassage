import { prisma } from "../../../../../../lib/prisma";
import { sendWhatsApp } from "../../../../../../lib/wbiztool";
import { z } from "zod";

const BodySchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "COMPLETED",
    "CANCELLED",
    "NO_SHOW",
  ]),
});

export async function POST(req, ctx) {
  try {
    const { params } = ctx || {};
    const p = await params;
    const id = p?.id;

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing id" }), {
        status: 400,
      });
    }

    const json = await req.json();
    const body = BodySchema.parse(json);

    // Get previous booking (to prevent duplicate sends)
    const prevBooking = await prisma.booking.findUnique({
      where: { id },
    });

    const booking = await prisma.booking.update({
      where: { id },
      data: { status: body.status },
      include: { client: true, service: true, therapist: true },
    });

    // 🔔 SEND WHATSAPP MESSAGE ON STATUS CHANGE
    if (prevBooking?.status !== body.status && booking.client?.phone) {
      // ✅ CONFIRMED
      if (body.status === "CONFIRMED") {
        await sendWhatsApp({
          phone: booking.client.phone,
          message: `✅ Booking Confirmed

Hi ${booking.client?.fullName || ""},

Your booking has been confirmed.

Date: ${booking.startAt.toLocaleDateString()}
Time: ${booking.startAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
Service: ${booking.service?.name || ""}

We look forward to seeing you! Maron Fitness | Massage &Spa`,
        });
      }

      // ❌ CANCELLED / REJECTED
      if (body.status === "CANCELLED") {
        await sendWhatsApp({
          phone: booking.client.phone,
          message: `❌ Booking Update

Hi ${booking.client?.name || ""},

Unfortunately, your booking on ${booking.startAt.toLocaleDateString()} at ${booking.startAt.toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" }
          )} has been cancelled.

Please contact us if you’d like to reschedule.`,
        });
      }
    }

    return Response.json({ booking });
  } catch (e) {
    const msg = e?.message || "Invalid request";
    return new Response(JSON.stringify({ error: msg }), { status: 400 });
  }
}

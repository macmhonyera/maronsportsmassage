import { prisma } from "../../../../../../lib/prisma";
import { sendWhatsApp } from "../../../../../../lib/wbiztool";
import { z } from "zod";
import nodemailer from "nodemailer";

const BodySchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"]),
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

    const prevBooking = await prisma.booking.findUnique({
      where: { id },
      include: { client: true, service: true },
    });

    if (!prevBooking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404,
      });
    }

    if (prevBooking.status === "COMPLETED") {
      return new Response(
        JSON.stringify({ error: "Completed bookings cannot be changed." }),
        { status: 400 }
      );
    }

    if (prevBooking.status === "CANCELLED") {
      return new Response(
        JSON.stringify({ error: "Cancelled bookings cannot be changed." }),
        { status: 400 }
      );
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status: body.status },
      include: { client: true, service: true, therapist: true },
    });

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 🔔 Send notifications only if status changed
    if (prevBooking.status !== body.status) {
      const baseMessage = `
Hi ${booking.client?.fullName || ""},

Date: ${booking.startAt.toLocaleDateString()}
Time: ${booking.startAt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
Service: ${booking.service?.name || ""}

Maron Fitness | Massage &Spa
`;

      // ✅ CONFIRMED
      if (body.status === "CONFIRMED") {
        const message = `✅ Booking Confirmed

Your booking has been confirmed.

${baseMessage}

We look forward to seeing you!`;

        // WhatsApp
        if (booking.client?.phone) {
          await sendWhatsApp({
            phone: booking.client.phone,
            message,
          });
        }

        // Email
        if (booking.client?.email) {
          await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: booking.client.email,
            subject: "Booking Confirmed ✅",
            text: message,
          });
        }
      }

      // ❌ CANCELLED
      if (body.status === "CANCELLED") {
        const message = `❌ Booking Cancelled

Unfortunately your booking has been cancelled.

${baseMessage}

Please contact us if you'd like to reschedule.`;

        // WhatsApp
        if (booking.client?.phone) {
          await sendWhatsApp({
            phone: booking.client.phone,
            message,
          });
        }

        // Email
        if (booking.client?.email) {
          await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: booking.client.email,
            subject: "Booking Cancelled ❌",
            text: message,
          });
        }
      }

      // 🚫 NO_SHOW and COMPLETED do nothing
    }

    return Response.json({ booking });
  } catch (e) {
    const msg = e?.message || "Invalid request";
    return new Response(JSON.stringify({ error: msg }), { status: 400 });
  }
}

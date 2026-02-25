import { prisma } from "../../../../../../lib/prisma";
import { sendWhatsApp } from "../../../../../../lib/wbiztool";
import { z } from "zod";
import nodemailer from "nodemailer";

const BodySchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"]),
});

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 465),
    secure: true,
    auth: { user, pass },
  });
}

async function sendStatusNotifications(booking, nextStatus) {
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

  let message = "";
  let emailSubject = "";

  if (nextStatus === "CONFIRMED") {
    emailSubject = "Booking Confirmed";
    message = `Booking Confirmed

Your booking has been confirmed.

${baseMessage}

We look forward to seeing you!`;
  }

  if (nextStatus === "CANCELLED") {
    emailSubject = "Booking Cancelled";
    message = `Booking Cancelled

Unfortunately your booking has been cancelled.

${baseMessage}

Please contact us if you'd like to reschedule.`;
  }

  if (!message) return;

  if (booking.client?.phone) {
    try {
      await sendWhatsApp({
        phone: booking.client.phone,
        message,
      });
    } catch (err) {
      console.error("WhatsApp notification failed:", err?.message || err);
    }
  }

  const transporter = createTransporter();
  if (booking.client?.email && transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: booking.client.email,
        subject: emailSubject,
        text: message,
      });
    } catch (err) {
      console.error("Email notification failed:", err?.message || err);
    }
  }
}

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

    if (prevBooking.status !== body.status) {
      await sendStatusNotifications(booking, body.status);
    }

    return Response.json({ booking });
  } catch (e) {
    const msg = e?.message || "Invalid request";
    return new Response(JSON.stringify({ error: msg }), { status: 400 });
  }
}

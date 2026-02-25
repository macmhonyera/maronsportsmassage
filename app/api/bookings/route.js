import { prisma } from "../../../lib/prisma";
import { z } from "zod";
import { combineLocalDateAndTime } from "../../../lib/time";
import nodemailer from "nodemailer";

const BodySchema = z.object({
  dateISO: z.string().min(10),
  timeHHMM: z.string().regex(/^\d{2}:\d{2}$/),

  serviceId: z.string().min(1),

  therapistPreference: z.enum(["any", "male", "female"]).optional().default("any"),

  notes: z.string().optional(),
  source: z.string().optional(),
  force: z.boolean().optional(),

  client: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(5),
    email: z.string().optional().or(z.literal("")),
    whatsappOptIn: z.boolean().optional(),
  }),
});

const DEFAULT_ADMIN_BOOKING_EMAIL = "admin@maronfitness.co.zw";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendAdminNewBookingEmail(booking) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;
  const adminEmail = process.env.BOOKING_ALERT_EMAIL || DEFAULT_ADMIN_BOOKING_EMAIL;

  if (!smtpHost || !smtpUser || !smtpPass || !smtpFrom || !adminEmail) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const bookingTime = booking.startAt.toLocaleString("en-ZW", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: process.env.BUSINESS_TIMEZONE || "Africa/Harare",
  });

  const clientName = booking.client?.fullName || "N/A";
  const clientPhone = booking.client?.phone || "N/A";
  const clientEmail = booking.client?.email || "N/A";
  const serviceName = booking.service?.name || "N/A";
  const source = booking.source || "website";
  const notes = booking.notes?.trim() ? booking.notes.trim() : "None";
  const subject = `New booking: ${clientName} - ${serviceName}`;

  const text = `A new booking has been created.

Client: ${clientName}
Phone: ${clientPhone}
Email: ${clientEmail}
Service: ${serviceName}
Date & time: ${bookingTime}
Source: ${source}
Status: ${booking.status}
Notes: ${notes}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
      <h2>New Booking Received</h2>
      <p>A new booking has been created in the system.</p>
      <p><strong>Client:</strong> ${escapeHtml(clientName)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(clientPhone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(clientEmail)}</p>
      <p><strong>Service:</strong> ${escapeHtml(serviceName)}</p>
      <p><strong>Date &amp; time:</strong> ${escapeHtml(bookingTime)}</p>
      <p><strong>Source:</strong> ${escapeHtml(source)}</p>
      <p><strong>Status:</strong> ${escapeHtml(booking.status)}</p>
      <p><strong>Notes:</strong> ${escapeHtml(notes)}</p>
    </div>
  `;

  await transporter.sendMail({
    from: smtpFrom,
    to: adminEmail,
    subject,
    text,
    html,
  });
}

export async function POST(req) {
  try {
    const json = await req.json();
    const body = BodySchema.parse(json);

    const startAt = combineLocalDateAndTime(body.dateISO, body.timeHHMM);

    // 1) Conflict check
    const conflict = await prisma.booking.findFirst({
      where: {
        startAt,
        status: { notIn: ["CANCELLED"] },
      },
      select: { id: true },
    });

    if (conflict && !body.force) {
      return new Response(JSON.stringify({ error: "Selected slot is already booked." }), { status: 409 });
    }

    // 2) Ensure service exists
    const service = await prisma.service.findFirst({
      where: { id: body.serviceId, isActive: true },
      select: { id: true },
    });

    if (!service) {
      return new Response(JSON.stringify({ error: "Invalid service selected." }), { status: 400 });
    }

    // 3) Upsert client by phone
    const phone = body.client.phone.trim();
    const email = body.client.email ? body.client.email.trim() : "";

    const existing = await prisma.client.findFirst({
      where: { phone },
      select: { id: true },
    });

    const client = existing
      ? await prisma.client.update({
          where: { id: existing.id },
          data: {
            fullName: body.client.fullName,
            email: email || null,
            whatsappOptIn: Boolean(body.client.whatsappOptIn),
          },
        })
      : await prisma.client.create({
          data: {
            fullName: body.client.fullName,
            phone,
            email: email || null,
            whatsappOptIn: Boolean(body.client.whatsappOptIn),
          },
        });

    // 4) Create booking: therapistId stays null for public flow
    const booking = await prisma.booking.create({
      data: {
        startAt,
        notes: body.notes || null,
        source: body.source || "website",
        status: "PENDING",
        therapistPreference: body.therapistPreference,
        therapistId: null,
        serviceId: body.serviceId,
        clientId: client.id,
      },
      include: { client: true, service: true, therapist: true },
    });

    try {
      await sendAdminNewBookingEmail(booking);
    } catch (emailError) {
      console.error("Failed to send admin booking notification:", emailError);
    }

    return Response.json({ booking });
  } catch (e) {
    const msg = e?.message || "Invalid request";
    return new Response(JSON.stringify({ error: msg }), { status: 400 });
  }
}

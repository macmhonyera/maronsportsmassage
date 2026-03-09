import { prisma } from "../../../lib/prisma";
import { z } from "zod";
import { combineLocalDateAndTime } from "../../../lib/time";
import nodemailer from "nodemailer";
import { getAddOnById } from "../../../lib/bookables";
import { isPastBookingTime, isValidBookingTime } from "../../../lib/bookingSlots";
import { normalizeAnyToE164, normalizeCountryDialCode, normalizeToE164 } from "../../../lib/phoneNumber.js";

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
    countryCode: z.string().regex(/^\+\d{1,6}$/).optional(),
    phone: z.string().min(4),
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .min(1, "Email is required")
      .email("Invalid email address"),
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

function formatTherapistPreference(value) {
  switch (String(value ?? "").toLowerCase()) {
    case "male":
      return "Male Therapist";
    case "female":
      return "Female Therapist";
    case "any":
      return "Anyone Available";
    default:
      return "Not specified";
  }
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
  const therapistPreference = formatTherapistPreference(booking.therapistPreference);
  const source = booking.source || "website";
  const notes = booking.notes?.trim() ? booking.notes.trim() : "None";
  const subject = `New booking: ${clientName} - ${serviceName}`;

  const text = `A new booking has been created.

Client: ${clientName}
Phone: ${clientPhone}
Email: ${clientEmail}
Service: ${serviceName}
Preferred therapist: ${therapistPreference}
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
      <p><strong>Preferred therapist:</strong> ${escapeHtml(therapistPreference)}</p>
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

    if (!isValidBookingTime(body.timeHHMM)) {
      return new Response(
        JSON.stringify({
          error:
            "Invalid time slot. Please choose a valid booking time from 07:00 to 20:00.",
        }),
        { status: 400 }
      );
    }

    if (isPastBookingTime(body.dateISO, body.timeHHMM)) {
      return new Response(
        JSON.stringify({
          error: "Selected time has already passed. Please choose a future slot.",
        }),
        { status: 400 }
      );
    }

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

    // 2) Ensure service exists (or create known add-on service on demand)
    let service = await prisma.service.findFirst({
      where: { id: body.serviceId, isActive: true },
      select: { id: true, name: true },
    });

    if (!service) {
      const addOn = getAddOnById(body.serviceId);

      if (!addOn) {
        return new Response(JSON.stringify({ error: "Invalid service selected." }), { status: 400 });
      }

      service = await prisma.service.upsert({
        where: { id: addOn.id },
        update: {
          name: addOn.name,
          description: addOn.description,
          durationMin: addOn.durationMin,
          priceCents: addOn.priceCents,
          isActive: true,
        },
        create: {
          id: addOn.id,
          name: addOn.name,
          description: addOn.description,
          durationMin: addOn.durationMin,
          priceCents: addOn.priceCents,
          isActive: true,
        },
        select: { id: true, name: true },
      });
    }

    // 3) Upsert client by normalized E.164 phone
    const rawCountryCode = body.client.countryCode?.trim() || "";
    let phone = rawCountryCode
      ? normalizeToE164({
          countryCode: rawCountryCode,
          phone: body.client.phone,
        })
      : normalizeAnyToE164(body.client.phone);

    // Backward compatibility for legacy callers that submit local numbers only.
    if (!phone) {
      const fallbackCountryCode = normalizeCountryDialCode(process.env.WBIZTOOL_COUNTRY_CODE);
      if (fallbackCountryCode) {
        phone = normalizeToE164({
          countryCode: `+${fallbackCountryCode}`,
          phone: body.client.phone,
        });
      }
    }

    if (!phone) {
      return new Response(
        JSON.stringify({
          error: "Please provide a valid phone number with country code (for example +263).",
        }),
        { status: 400 }
      );
    }

    const fullName = body.client.fullName.trim();
    if (fullName.length < 2) {
      return new Response(JSON.stringify({ error: "Client name must be at least 2 characters." }), {
        status: 400,
      });
    }

    const email = body.client.email.trim();

    const existing = await prisma.client.findFirst({
      where: { phone },
      select: { id: true },
    });

    const client = existing
      ? await prisma.client.update({
          where: { id: existing.id },
          data: {
            fullName,
            email,
            whatsappOptIn: Boolean(body.client.whatsappOptIn),
          },
        })
      : await prisma.client.create({
          data: {
            fullName,
            phone,
            email,
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

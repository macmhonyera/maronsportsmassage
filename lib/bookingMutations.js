import nodemailer from "nodemailer";
import { z } from "zod";
import { prisma } from "./prisma";
import { getAddOnById } from "./bookables";
import { combineLocalDateAndTime } from "./time";
import { isPastBookingTime, isValidBookingTime } from "./bookingSlots";
import {
  normalizeAnyToE164,
  normalizeCountryDialCode,
  normalizeToE164,
} from "./phoneNumber.js";

const ClientInputSchema = z.object({
  fullName: z.string().min(2),
  countryCode: z.string().regex(/^\+\d{1,6}$/).optional(),
  phone: z.string().min(4),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),
  whatsappOptIn: z.boolean().optional(),
});

export const PublicBookingBodySchema = z.object({
  dateISO: z.string().min(10),
  timeHHMM: z.string().regex(/^\d{2}:\d{2}$/),
  serviceId: z.string().min(1),
  therapistPreference: z.enum(["any", "male", "female"]).optional().default("any"),
  notes: z.string().optional(),
  source: z.string().optional(),
  client: ClientInputSchema,
});

export const AdminBookingBodySchema = z.object({
  dateISO: z.string().min(10),
  timeHHMM: z.string().regex(/^\d{2}:\d{2}$/),
  serviceId: z.string().min(1),
  therapistPreference: z.enum(["any", "male", "female"]).optional().default("any"),
  therapistId: z.union([z.string(), z.null()]).optional(),
  notes: z.string().optional(),
  force: z.boolean().optional(),
  client: ClientInputSchema,
});

export class BookingRequestError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "BookingRequestError";
    this.status = status;
  }
}

const DEFAULT_ADMIN_BOOKING_EMAIL = "admin@maronfitness.co.zw";

function getSmtpConfig() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;
  const replyTo =
    process.env.BOOKING_REPLY_TO || process.env.ADMIN_EMAIL || DEFAULT_ADMIN_BOOKING_EMAIL;

  return { smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom, replyTo };
}

function createSmtpTransporter() {
  const { smtpHost, smtpPort, smtpUser, smtpPass } = getSmtpConfig();

  if (!smtpHost || !smtpUser || !smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatTherapistPreference(value) {
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

export async function sendAdminNewBookingEmail(booking) {
  const { smtpHost, smtpUser, smtpPass, smtpFrom, replyTo } = getSmtpConfig();
  const transporter = createSmtpTransporter();
  const adminEmail = process.env.BOOKING_ALERT_EMAIL || DEFAULT_ADMIN_BOOKING_EMAIL;

  if (!transporter || !smtpFrom || !adminEmail) {
    console.warn("Booking admin email skipped due to missing config.", {
      hasSmtpHost: Boolean(smtpHost),
      hasSmtpUser: Boolean(smtpUser),
      hasSmtpPass: Boolean(smtpPass),
      hasSmtpFrom: Boolean(smtpFrom),
      hasAdminEmail: Boolean(adminEmail),
    });
    return;
  }

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
    replyTo,
    subject,
    text,
    html,
  });
}

export async function sendClientBookingApprovedEmail(booking) {
  const { smtpHost, smtpUser, smtpPass, smtpFrom, replyTo } = getSmtpConfig();
  const transporter = createSmtpTransporter();
  const clientEmail = booking.client?.email?.trim();

  if (!transporter || !smtpFrom || !clientEmail) {
    console.warn("Client approved booking email skipped due to missing config.", {
      hasSmtpHost: Boolean(smtpHost),
      hasSmtpUser: Boolean(smtpUser),
      hasSmtpPass: Boolean(smtpPass),
      hasSmtpFrom: Boolean(smtpFrom),
      hasClientEmail: Boolean(clientEmail),
    });
    return;
  }

  const bookingTime = booking.startAt.toLocaleString("en-ZW", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: process.env.BUSINESS_TIMEZONE || "Africa/Harare",
  });

  const clientName = booking.client?.fullName || "there";
  const serviceName = booking.service?.name || "your session";
  const therapistName = booking.therapist?.name?.trim();
  const notes = booking.notes?.trim();
  const subject = "Booking Created and Approved";

  const therapistLine = therapistName ? `Therapist: ${therapistName}\n` : "";
  const notesLine = notes ? `Notes: ${notes}\n` : "";

  const text = `Booking Created and Approved

Hi ${clientName},

Your booking has been created by our team and approved.

Date & time: ${bookingTime}
Service: ${serviceName}
${therapistLine}${notesLine}
We look forward to seeing you.

Maron Fitness | Massage &Spa`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
      <h2>Booking Created and Approved</h2>
      <p>Hi ${escapeHtml(clientName)},</p>
      <p>Your booking has been created by our team and approved.</p>
      <p><strong>Date &amp; time:</strong> ${escapeHtml(bookingTime)}</p>
      <p><strong>Service:</strong> ${escapeHtml(serviceName)}</p>
      ${
        therapistName
          ? `<p><strong>Therapist:</strong> ${escapeHtml(therapistName)}</p>`
          : ""
      }
      ${
        notes
          ? `<p><strong>Notes:</strong> ${escapeHtml(notes)}</p>`
          : ""
      }
      <p>We look forward to seeing you.</p>
      <p>Maron Fitness | Massage &amp;Spa</p>
    </div>
  `;

  await transporter.sendMail({
    from: smtpFrom,
    to: clientEmail,
    replyTo,
    subject,
    text,
    html,
  });
}

export async function sendClientBookingPendingEmail(booking) {
  const { smtpHost, smtpUser, smtpPass, smtpFrom, replyTo } = getSmtpConfig();
  const transporter = createSmtpTransporter();
  const clientEmail = booking.client?.email?.trim();

  if (!transporter || !smtpFrom || !clientEmail) {
    console.warn("Client pending booking email skipped due to missing config.", {
      hasSmtpHost: Boolean(smtpHost),
      hasSmtpUser: Boolean(smtpUser),
      hasSmtpPass: Boolean(smtpPass),
      hasSmtpFrom: Boolean(smtpFrom),
      hasClientEmail: Boolean(clientEmail),
    });
    return;
  }

  const bookingTime = booking.startAt.toLocaleString("en-ZW", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: process.env.BUSINESS_TIMEZONE || "Africa/Harare",
  });

  const clientName = booking.client?.fullName || "there";
  const serviceName = booking.service?.name || "your session";
  const therapistPreference = formatTherapistPreference(booking.therapistPreference);
  const notes = booking.notes?.trim();
  const subject = "Booking Received";
  const notesLine = notes ? `Notes: ${notes}\n` : "";

  const text = `Booking Received

Hi ${clientName},

Thanks for your booking request. We have received it and will confirm it shortly.

Date & time: ${bookingTime}
Service: ${serviceName}
Preferred therapist: ${therapistPreference}
${notesLine}
Maron Fitness | Massage &Spa`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
      <h2>Booking Received</h2>
      <p>Hi ${escapeHtml(clientName)},</p>
      <p>Thanks for your booking request. We have received it and will confirm it shortly.</p>
      <p><strong>Date &amp; time:</strong> ${escapeHtml(bookingTime)}</p>
      <p><strong>Service:</strong> ${escapeHtml(serviceName)}</p>
      <p><strong>Preferred therapist:</strong> ${escapeHtml(therapistPreference)}</p>
      ${notes ? `<p><strong>Notes:</strong> ${escapeHtml(notes)}</p>` : ""}
      <p>Maron Fitness | Massage &amp;Spa</p>
    </div>
  `;

  await transporter.sendMail({
    from: smtpFrom,
    to: clientEmail,
    replyTo,
    subject,
    text,
    html,
  });
}

export function getBookingStartAt({ dateISO, timeHHMM, allowPast = false }) {
  if (!isValidBookingTime(timeHHMM)) {
    throw new BookingRequestError(
      "Invalid time slot. Please choose a valid booking time from 07:00 to 20:00."
    );
  }

  if (!allowPast && isPastBookingTime(dateISO, timeHHMM)) {
    throw new BookingRequestError(
      "Selected time has already passed. Please choose a future slot."
    );
  }

  return combineLocalDateAndTime(dateISO, timeHHMM);
}

export async function ensureBookingSlotAvailable({
  startAt,
  excludeBookingId = null,
  force = false,
}) {
  const conflict = await prisma.booking.findFirst({
    where: {
      startAt,
      status: { notIn: ["CANCELLED"] },
      ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
    },
    select: { id: true },
  });

  if (conflict && !force) {
    throw new BookingRequestError("Selected slot is already booked.", 409);
  }

  return conflict;
}

export async function resolveService(serviceId, { allowInactive = false } = {}) {
  let service = await prisma.service.findFirst({
    where: {
      id: serviceId,
      ...(allowInactive ? {} : { isActive: true }),
    },
    select: { id: true, name: true },
  });

  if (!service) {
    const addOn = getAddOnById(serviceId);

    if (!addOn) {
      throw new BookingRequestError("Invalid service selected.");
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

  return service;
}

export async function resolveTherapistId(therapistId, { allowInactive = false } = {}) {
  const candidate = String(therapistId ?? "").trim();

  if (!candidate) {
    return null;
  }

  const therapist = await prisma.therapist.findFirst({
    where: {
      id: candidate,
      ...(allowInactive ? {} : { isActive: true }),
    },
    select: { id: true },
  });

  if (!therapist) {
    throw new BookingRequestError("Invalid therapist selected.");
  }

  return therapist.id;
}

export async function upsertBookingClient(clientInput) {
  const rawCountryCode = clientInput.countryCode?.trim() || "";

  let phone = rawCountryCode
    ? normalizeToE164({
        countryCode: rawCountryCode,
        phone: clientInput.phone,
      })
    : normalizeAnyToE164(clientInput.phone);

  if (!phone) {
    const fallbackCountryCode = normalizeCountryDialCode(process.env.WBIZTOOL_COUNTRY_CODE);

    if (fallbackCountryCode) {
      phone = normalizeToE164({
        countryCode: `+${fallbackCountryCode}`,
        phone: clientInput.phone,
      });
    }
  }

  if (!phone) {
    throw new BookingRequestError(
      "Please provide a valid phone number with country code (for example +263)."
    );
  }

  const fullName = clientInput.fullName.trim();

  if (fullName.length < 2) {
    throw new BookingRequestError("Client name must be at least 2 characters.");
  }

  const email = clientInput.email.trim();

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
          whatsappOptIn: Boolean(clientInput.whatsappOptIn),
        },
      })
    : await prisma.client.create({
        data: {
          fullName,
          phone,
          email,
          whatsappOptIn: Boolean(clientInput.whatsappOptIn),
        },
      });

  return client;
}

export async function buildBookingWriteData(
  body,
  { allowPast = false, excludeBookingId = null, allowInactiveSelections = false } = {}
) {
  const startAt = getBookingStartAt({
    dateISO: body.dateISO,
    timeHHMM: body.timeHHMM,
    allowPast,
  });

  await ensureBookingSlotAvailable({
    startAt,
    excludeBookingId,
    force: Boolean(body.force),
  });

  const [service, therapistId, client] = await Promise.all([
    resolveService(body.serviceId, { allowInactive: allowInactiveSelections }),
    resolveTherapistId(body.therapistId, { allowInactive: allowInactiveSelections }),
    upsertBookingClient(body.client),
  ]);

  return {
    startAt,
    notes: body.notes?.trim() ? body.notes.trim() : null,
    serviceId: service.id,
    clientId: client.id,
    therapistPreference: body.therapistPreference ?? "any",
    therapistId,
  };
}

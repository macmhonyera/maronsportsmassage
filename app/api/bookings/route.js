import { prisma } from "../../../lib/prisma";
import { z } from "zod";
import { combineLocalDateAndTime } from "../../../lib/time";

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

    return Response.json({ booking });
  } catch (e) {
    const msg = e?.message || "Invalid request";
    return new Response(JSON.stringify({ error: msg }), { status: 400 });
  }
}

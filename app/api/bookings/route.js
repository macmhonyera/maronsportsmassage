import { prisma } from "../../../lib/prisma";
import { z } from "zod";
import { combineLocalDateAndTime } from "../../../lib/time";

const BodySchema = z.object({
  dateISO: z.string().min(10),
  timeHHMM: z.string().regex(/^\d{2}:\d{2}$/),
  serviceId: z.string().min(1),
  therapistId: z.string().nullable().optional(),
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

    // check conflicts (simple: any non-cancelled booking in same slot)
    const conflict = await prisma.booking.findFirst({
      where: {
        startAt,
        status: { notIn: ["CANCELLED"] },
      },
      select: { id: true },
    });

    if (conflict && !body.force) {
      return new Response(
        JSON.stringify({ error: "Selected slot is already booked." }),
        { status: 409 }
      );
    }

    // normalize phone (optional but recommended)
    const phone = body.client.phone.trim();
    const email = body.client.email ? body.client.email.trim() : "";

    // find existing client by phone
    const existing = await prisma.client.findFirst({
      where: { phone },
      select: { id: true },
    });

    let client;
    if (existing) {
      client = await prisma.client.update({
        where: { id: existing.id },
        data: {
          fullName: body.client.fullName,
          email: email || null,
          whatsappOptIn: Boolean(body.client.whatsappOptIn),
        },
      });
    } else {
      client = await prisma.client.create({
        data: {
          fullName: body.client.fullName,
          phone,
          email: email || null,
          whatsappOptIn: Boolean(body.client.whatsappOptIn),
        },
      });
    }

    const booking = await prisma.booking.create({
      data: {
        startAt,
        notes: body.notes || null,
        source: body.source || "website",
        status: "PENDING",
        therapistId: body.therapistId || null,
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

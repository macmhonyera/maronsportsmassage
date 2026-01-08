import { prisma } from "../../../../../../lib/prisma";
import { z } from "zod";

const BodySchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"]),
});

export async function POST(req, ctx) {
  try {
    const { params } = ctx || {};
    const p = await params; // ✅ required by Next.js sync dynamic APIs
    const id = p?.id;

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing id" }), {
        status: 400,
      });
    }

    const json = await req.json();
    const body = BodySchema.parse(json);

    const booking = await prisma.booking.update({
      where: { id },
      data: { status: body.status },
      include: { client: true, service: true, therapist: true },
    });

    return Response.json({ booking });
  } catch (e) {
    const msg = e?.message || "Invalid request";
    return new Response(JSON.stringify({ error: msg }), { status: 400 });
  }
}

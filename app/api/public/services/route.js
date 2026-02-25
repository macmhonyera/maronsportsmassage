import { prisma } from "../../../../lib/prisma";
import { ADD_ON_SERVICES } from "../../../../lib/bookables";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { durationMin: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        durationMin: true,
        priceCents: true,
      },
    });

    const existingIds = new Set(services.map((s) => s.id));

    const addOnIds = new Set(ADD_ON_SERVICES.map((a) => a.id));

    const serviceOptions = services.map((s) => ({
      ...s,
      category: addOnIds.has(s.id) ? "addon" : "service",
    }));

    const addOnOptions = ADD_ON_SERVICES.filter((a) => !existingIds.has(a.id)).map((a) => ({
      ...a,
      category: "addon",
    }));

    return Response.json([...serviceOptions, ...addOnOptions]);
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to load services." }), { status: 500 });
  }
}

import { prisma } from "../../../../lib/prisma";

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

    return Response.json(services);
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to load services." }), { status: 500 });
  }
}

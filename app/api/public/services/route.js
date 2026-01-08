import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { durationMin: "asc" },
    select: { id: true, name: true, description: true, durationMin: true, priceCents: true },
  });
  return Response.json(services);
}

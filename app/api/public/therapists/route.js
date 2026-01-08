import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const therapists = await prisma.therapist.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, bio: true, specialties: true, photoUrl: true },
  });
  return Response.json(therapists);
}

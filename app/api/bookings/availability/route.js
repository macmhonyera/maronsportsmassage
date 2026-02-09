import { prisma } from "./../../../../lib/prisma";

function parseISODate(dateISO) {
  const [y, m, d] = dateISO.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

function fmtHHMM(date) {
  const d = new Date(date);
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const dateISO = searchParams.get("date");

  if (!dateISO) {
    return new Response(JSON.stringify({ error: "Missing date" }), {
      status: 400,
    });
  }

  const dayStart = parseISODate(dateISO);
  if (!dayStart) {
    return new Response(JSON.stringify({ error: "Invalid date" }), {
      status: 400,
    });
  }

  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const bookings = await prisma.booking.findMany({
    where: {
      startAt: { gte: dayStart, lt: dayEnd },
      status: { notIn: ["CANCELLED"] },
    },
    select: {
      startAt: true,
      client: {
        select: {
          phone: true,
          fullName: true,
        },
      },
    },
  });

  const bookedTimes = bookings.map((b) => fmtHHMM(b.startAt));

  return Response.json({
    dateISO,
    bookedTimes,
  });
}

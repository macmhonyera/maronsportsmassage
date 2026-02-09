import { prisma } from "./../../../../lib/prisma";
import { sendWhatsApp } from "./../../../../lib/wbiztool";

export async function GET() {
  const now = new Date();

  // Start of day 7 days from now
  const targetStart = new Date(now);
  targetStart.setDate(now.getDate() + 7);
  targetStart.setHours(0, 0, 0, 0);

  // End of that day
  const targetEnd = new Date(targetStart);
  targetEnd.setHours(23, 59, 59, 999);

  const bookings = await prisma.booking.findMany({
    where: {
      startAt: { gte: targetStart, lt: targetEnd },
      status: { notIn: ["CANCELLED"] },
    },
  });

  let sent = 0;

  for (const b of bookings) {
    if (!b.phone) continue;

    await sendWhatsApp({
      phone: b.phone,
      message: `📅 Weekly Reminder

Hi ${b.fullName || ""}, this is a reminder that you have a booking in 1 week.

🗓 Date: ${b.startAt.toLocaleDateString()}
⏰ Time: ${b.startAt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}

We look forward to seeing you!`,
    });

    sent++;
  }

  return Response.json({
    type: "weekly",
    date: targetStart.toISOString().split("T")[0],
    sent,
  });
}

import { prisma } from "../../../../lib/prisma";
import nodemailer from "nodemailer";
import { sendWhatsApp } from "../../../../lib/wbiztool";

export async function GET() {
  const now = new Date();

  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
  const oneHourFiveMinFromNow = new Date(now.getTime() + 65 * 60 * 1000);

  const bookings = await prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
      reminderSent: false,
      startAt: {
        gte: oneHourFromNow,
        lte: oneHourFiveMinFromNow,
      },
    },
    include: {
      client: true,
      service: true,
    },
  });

  // Create email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  let whatsappSent = 0;
  let whatsappFailed = 0;
  let emailSent = 0;
  let emailFailed = 0;

  for (const b of bookings) {
    const message = `⏰ Booking Reminder

Hi ${b.client?.fullName || ""},

This is a reminder that you have a booking with Maron Fitness | Massage &Spa in 1 hour.

Date: ${b.startAt.toLocaleDateString()}
Time: ${b.startAt.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}
Service: ${b.service?.name || ""}

We look forward to seeing you!

Maron Fitness | Massage &Spa`;

    let sentAny = false;

    // WhatsApp reminder
    if (b.client?.phone) {
      try {
        await sendWhatsApp({
          phone: b.client.phone,
          message,
        });
        whatsappSent++;
        sentAny = true;
      } catch (error) {
        whatsappFailed++;
        console.error(`WhatsApp reminder failed for booking ${b.id}:`, error?.message || error);
      }
    }

    // 📧 Email
    if (b.client?.email) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: b.client.email,
          subject: "Reminder: Your Booking in 1 Hour ⏰",
          text: message,
        });
        emailSent++;
        sentAny = true;
      } catch (error) {
        emailFailed++;
        console.error(`Email reminder failed for booking ${b.id}:`, error?.message || error);
      }
    }

    // Mark reminder as sent only when at least one channel succeeds.
    if (sentAny) {
      await prisma.booking.update({
        where: { id: b.id },
        data: { reminderSent: true },
      });
    }
  }

  return Response.json({
    type: "1-hour-reminder",
    found: bookings.length,
    whatsappSent,
    whatsappFailed,
    emailSent,
    emailFailed,
  });
}

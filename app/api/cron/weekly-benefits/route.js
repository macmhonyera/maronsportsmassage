import { prisma } from "../../../../lib/prisma";
import { sendWhatsApp } from "../../../../lib/wbiztool";
import nodemailer from "nodemailer";

export async function GET() {
  const clients = await prisma.client.findMany({
    where: {
      whatsappOptIn: true,
    },
    select: {
      phone: true,
      fullName: true,
      email: true,
    },
  });

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
  let emailSent = 0;

  for (const client of clients) {
    const name = client.fullName ? client.fullName : "there";

    // WhatsApp (plain text but nicely formatted)
    const whatsappMessage = `Rejuvenate Your Body & Mind

Hi ${name},

​This is a gentle reminder of the incredible benefits that regular massage therapy brings to your daily life. It’s not just a luxury; it’s an essential part of your recovery and wellness routine.

Why Regular Massage Matters:

✅ Reduce Muscle Tension: Release physical stress held in your body.

✅ Improve Circulation: Enhance oxygen and nutrient flow.

✅ Boost Recovery & Performance: Get back to your best faster.

✅ Lower Stress Levels: Calm your nervous system.
  
✅ Enhance Sleep Quality: Rest deeper and wake refreshed.  

Find Your Frequency

​For optimal results, we recommend a session every 2 to 4 weeks. This helps keep your body relaxed and functioning at its peak. Of course, we can always adjust this frequency to perfectly match your specific lifestyle and activity levels.

Ready to Feel the Difference?

​Don't wait until you're in pain to take care of yourself. Book your next session today and prioritize your well being.

Website: https://www.maronfitness.co.zw  or simply reply to this message to schedule your next visit.`;

    // Email (HTML for clickable links + better layout)
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
        <h2 style="color: #0d6efd;">Rejuvenate Your Body & Mind</h2>

        <p>Hi <strong>${name}</strong>,</p>

        <p>
          This is a gentle reminder of the incredible benefits that regular massage therapy brings to your daily life.
          It’s not just a luxury it’s an essential part of your recovery and wellness routine.
        </p>

        <h3 style="margin-top: 20px;">Why Regular Massage Matters:</h3>
        <ul>
          <li><strong>Reduce Muscle Tension:</strong> Release the physical stress held in your body.</li>
          <li><strong>Improve Circulation:</strong> Enhance the flow of oxygen and nutrients to your tissues.</li>
          <li><strong>Boost Recovery & Performance:</strong> Get back to your peak physical state faster.</li>
          <li><strong>Lower Stress Levels:</strong> Calm your nervous system and find your balance.</li>
          <li><strong>Enhance Sleep Quality:</strong> Rest deeper and wake up feeling refreshed.</li>
        </ul>

        <h3 style="margin-top: 20px;">Find Your Frequency</h3>
        <p>
          For optimal results, we recommend a session every <strong>2 to 4 weeks</strong>.
          This helps keep your body relaxed and functioning at its peak.
          We can always adjust this frequency to perfectly match your lifestyle and activity levels.
        </p>

        <h3 style="margin-top: 20px;">Ready to Feel the Difference?</h3>
        <p>
          Don't wait until you're in pain book your next session today and prioritize your well-being.
        </p>

        <p>
          Visit our website:
          <a href="https://www.maronfitness.co.zw" target="_blank">
            www.maronfitness.co.zw
          </a>
        </p>

        <p>or simply reply to this email/message to schedule your next visit.</p>

        <hr />
        <p style="font-size: 12px; color: gray;">
          Maron Fitness & Wellness
        </p>
      </div>
    `;

    // WhatsApp
    if (client.phone) {
      await sendWhatsApp({
        phone: client.phone,
        message: whatsappMessage,
      });

      whatsappSent++;
    }

    // Email
    if (client.email) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: client.email,
        subject: "Rejuvenate Your Body & Mind",
        text: whatsappMessage, // fallback for clients that don’t support HTML
        html: emailHtml, // clickable links + formatting
      });

      emailSent++;
    }
  }

  return Response.json({
    type: "weekly-benefits-broadcast",
    totalClients: clients.length,
    whatsappSent,
    emailSent,
  });
}

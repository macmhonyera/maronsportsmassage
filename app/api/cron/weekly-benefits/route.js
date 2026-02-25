import { prisma } from "../../../../lib/prisma";
import { sendWhatsApp } from "../../../../lib/wbiztool";
import nodemailer from "nodemailer";

const BIWEEKLY_ANCHOR_UTC = Date.UTC(2025, 0, 6); // Monday
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function isBiweeklyRunDate(date) {
  const todayUtc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const weeksSinceAnchor = Math.floor((todayUtc - BIWEEKLY_ANCHOR_UTC) / WEEK_MS);
  return weeksSinceAnchor >= 0 && weeksSinceAnchor % 2 === 0;
}

export async function GET(req) {
  const isForced = new URL(req.url).searchParams.get("force") === "1";

  if (!isForced && !isBiweeklyRunDate(new Date())) {
    return Response.json({
      type: "biweekly-benefits-broadcast",
      skipped: true,
      reason: "Off week for biweekly reminders. Use ?force=1 to override.",
    });
  }

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
    const whatsappMessage = `Hi ${name}! Hope you're doing well.

Just checking in to see if you're due for your next relaxation or recovery treatment?

​Regular body maintenance helps keep that muscle tension away and your sleep quality high. 

Don't wait for the pain to kick in! Keep your body performing at its peak with a treatment every 2-4 weeks.

​Book Now: www.maronfitness.co.zw
Email: admin@maronfitness.co.zw
Or just Reply to this chat to grab a slot!`;

    // Email (HTML for clickable links + better layout)
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
        <h2 style="color: #0d6efd;">Rejuvenate Your Body & Mind</h2>

        <p>Hi <strong>${name}</strong>,</p>

        <p>
         ​This is a gentle reminder of the incredible benefits that regular massage therapy brings to your daily life. It’s not just a luxury; it’s an essential part of your recovery and wellness routine.
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
        ​For optimal results, we recommend a session every 2 to 4 weeks. This helps keep your body relaxed and functioning at its peak. Of course, we can always adjust this frequency to perfectly match your specific lifestyle and activity levels.
        </p>

        <h3 style="margin-top: 20px;">Ready to Feel the Difference?</h3>
        <p>
        ​Don't wait until you're in pain to take care of yourself. Book your next session today and prioritize your well being.
        </p>

        <p>
          Visit our website on 
          <a href="https://www.maronfitness.co.zw" target="_blank">
            www.maronfitness.co.zw
          </a>
          to schedule your next visit or contact us on +263 78 0525 557.
        </p>
        <hr />
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
    type: "biweekly-benefits-broadcast",
    totalClients: clients.length,
    whatsappSent,
    emailSent,
  });
}

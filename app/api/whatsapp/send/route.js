import twilio from "twilio";
import { z } from "zod";

const Schema = z.object({
  to: z.string().min(5), // "whatsapp:+27..."
  body: z.string().min(1),
});

export async function POST(req) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!sid || !token || !from) {
    return new Response(JSON.stringify({ error: "Twilio WhatsApp not configured." }), { status: 400 });
  }

  try {
    const body = Schema.parse(await req.json());
    const client = twilio(sid, token);
    const msg = await client.messages.create({ from, to: body.to, body: body.body });
    return Response.json({ sid: msg.sid, status: msg.status });
  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message || "Failed" }), { status: 400 });
  }
}

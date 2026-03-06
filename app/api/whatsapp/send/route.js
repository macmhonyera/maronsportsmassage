import { z } from "zod";
import { sendWhatsApp } from "../../../../lib/wbiztool";

const BodySchema = z
  .object({
    phone: z.string().optional(),
    countryCode: z.string().optional(),
    message: z.string().optional(),

    // Legacy Twilio-style input compatibility.
    to: z.string().optional(),
    body: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    const hasPhone = Boolean(value.phone?.trim() || value.to?.trim());
    const hasMessage = Boolean(value.message?.trim() || value.body?.trim());

    if (!hasPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either `phone` or `to` is required.",
        path: ["phone"],
      });
    }

    if (!hasMessage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either `message` or `body` is required.",
        path: ["message"],
      });
    }
  });

function normalizeLegacyPhone(value) {
  return String(value ?? "")
    .trim()
    .replace(/^whatsapp:/i, "");
}

export async function POST(req) {
  try {
    const json = await req.json();
    const body = BodySchema.parse(json);

    const phone = normalizeLegacyPhone(body.phone || body.to);
    const message = String(body.message || body.body || "").trim();

    const result = await sendWhatsApp({
      phone,
      countryCode: body.countryCode,
      message,
    });

    return Response.json({ success: true, result });
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: e?.message || "Failed to send WhatsApp message.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
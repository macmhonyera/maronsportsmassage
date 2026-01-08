import { z } from "zod";
import nodemailer from "nodemailer";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    // Get email configuration from environment variables
    const adminEmail = process.env.ADMIN_EMAIL || process.env.CONTACT_EMAIL;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;

    // If email is not configured, return an error
    if (!adminEmail || !smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      console.error("Email configuration missing. Please set SMTP environment variables.");
      return new Response(
        JSON.stringify({
          error: "Contact form is not configured. Please contact us directly via phone or WhatsApp.",
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: smtpPort === "465", // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Email content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d97706;">New Contact Form Submission</h2>
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
          <p><strong>Subject:</strong> ${data.subject}</p>
        </div>
        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #fcd34d; border-radius: 8px;">
          <h3 style="color: #92400e; margin-top: 0;">Message:</h3>
          <p style="white-space: pre-wrap; color: #1f2937;">${data.message}</p>
        </div>
        <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
          This email was sent from the contact form on your website.
        </p>
      </div>
    `;

    const emailText = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ""}
Subject: ${data.subject}

Message:
${data.message}
    `;

    // Send email
    await transporter.sendMail({
      from: smtpFrom,
      to: adminEmail,
      replyTo: data.email,
      subject: `Contact Form: ${data.subject}`,
      text: emailText,
      html: emailHtml,
    });

    return Response.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact form error:", error);

    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: "Invalid form data. Please check all fields." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Failed to send message. Please try again later." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


import WhatsAppFloat from "../components/WhatsAppFloat";
import WhatsAppWidget from "../components/WhatsAppWidget";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
      {/* <WhatsAppWidget
          phoneE164="27821234567"
          message="Hi Maron Fitness, I would like to enquire about your services."
          label="WhatsApp us"
          position="bottom-right"
        /> */}
        <WhatsAppFloat />
    </html>
  );
}

import WhatsAppFloat from "../components/WhatsAppFloat";
import WhatsAppWidget from "../components/WhatsAppWidget";
import "./globals.css";

export const metadata = {
  icons: {
    icon: "/logo/favico.png",
    shortcut: "/logo/favico.png",
    apple: "/logo/favico.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
      {/* <WhatsAppWidget
          phoneE164="27821234567"
          message="Hi Maron's Muscle Studio, I would like to enquire about your services."
          label="WhatsApp us"
          position="bottom-right"
        /> */}
        <WhatsAppFloat />
    </html>
  );
}

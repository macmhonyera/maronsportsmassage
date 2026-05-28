import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import WhatsAppFloat from "../components/WhatsAppFloat";
import WhatsAppWidget from "../components/WhatsAppWidget";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata = {
  icons: {
    icon: "/logo/favico.png",
    shortcut: "/logo/favico.png",
    apple: "/logo/favico.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${instrument.variable}`}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
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

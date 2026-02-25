const SITE_URL = "https://maronfitness.co.zw";
const OG_IMAGE_PATH = "/og-image.jpg";

export const metadata = {
  title: "Book a Massage | Maron Fitness Zimbabwe",
  description:
    "Book your sports massage, wellness or spa session online at Maron Fitness in Zimbabwe.",
  keywords: [
    "book massage Zimbabwe",
    "book massage Harare",
    "massage appointment Zimbabwe",
    "online booking massage Zimbabwe",
    "sports massage booking",
    "spa booking Zimbabwe",
    "wellness booking Harare",
    "Maron Fitness booking",
  ],
  alternates: {
    canonical: "/book",
  },
  openGraph: {
    title: "Book a Massage | Maron Fitness Zimbabwe",
    description:
      "Reserve your massage session online with Maron Fitness in Zimbabwe.",
    type: "website",
    url: `${SITE_URL}/book`,
    siteName: "Maron Fitness",
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: "Book your massage session at Maron Fitness",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a Massage | Maron Fitness Zimbabwe",
    description:
      "Reserve your massage session online with Maron Fitness in Zimbabwe.",
    images: [OG_IMAGE_PATH],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

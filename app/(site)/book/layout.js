const SITE_URL = "https://maronfitness.co.zw";

export const metadata = {
  title: "Book a Massage | Maron Fitness Zimbabwe",
  description:
    "Book your sports massage, wellness or spa session online at Maron Fitness in Zimbabwe.",
  alternates: {
    canonical: "/book",
  },
  openGraph: {
    title: "Book a Massage | Maron Fitness Zimbabwe",
    description:
      "Reserve your massage session online with Maron Fitness in Zimbabwe.",
    type: "website",
    url: `${SITE_URL}/book`,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

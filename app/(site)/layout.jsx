import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const SITE_URL = "https://maronfitness.co.zw";
const OG_IMAGE_PATH = "/og-image.jpg";

export const metadata = {
  title: "Maron Fitness | Sports Massage & Deep Tissue Harare",
  description:
    "Maron Fitness offers sports massage, wellness and spa services in Zimbabwe. Book online for recovery, relaxation and performance support.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "sports massage Zimbabwe",
    "sports massage Harare",
    "massage Zimbabwe",
    "massage Harare",
    "spa Zimbabwe",
    "spa Harare",
    "fitness Zimbabwe",
    "fitness Harare",
    "wellness Zimbabwe",
    "wellness Harare",
    "deep tissue massage Zimbabwe",
    "deep tissue massage Harare",
    "relaxation massage Zimbabwe",
    "relaxation massage Harare",
    "hot stone massage Zimbabwe",
    "hot stone massage Harare",
    "recovery massage Zimbabwe",
    "sports recovery massage",
    "injury recovery massage",
    "athlete massage Zimbabwe",
    "physio massage Zimbabwe",
    "therapeutic massage Zimbabwe",
    "body massage Zimbabwe",
    "mobile massage Zimbabwe",
    "best massage in Harare",
    "massage booking Zimbabwe",
    "book massage online",
    "Maron Fitness",
  ],
  openGraph: {
    title: "Maron Fitness | Sports Massage & Deep Tissue Harare",
    description:
      "Book sports massage, deep tissue, and other therapeutic treatments at Maron Fitness in Harare, Zimbabwe.",
    type: "website",
    url: SITE_URL,
    siteName: "Maron Fitness",
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: "Maron Fitness sports massage and wellness",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maron Fitness | Sports Massage & Deep Tissue Harare",
    description:
      "Book sports massage, deep tissue, and other therapeutic treatments at Maron Fitness in Harare, Zimbabwe.",
    images: [OG_IMAGE_PATH],
  },
};

export default function SiteLayout({ children }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const SITE_URL = "https://maronfitness.co.zw";

export const metadata = {
  title: "Maron Fitness | Sports Massage, Fitness & Spa in Zimbabwe",
  description:
    "Maron Fitness offers sports massage, wellness and spa services in Zimbabwe. Book online for recovery, relaxation and performance support.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "sports massage Zimbabwe",
    "massage Harare",
    "spa Zimbabwe",
    "fitness massage",
    "Maron Fitness",
  ],
  openGraph: {
    title: "Maron Fitness | Sports Massage, Fitness & Spa in Zimbabwe",
    description:
      "Book sports massage and spa sessions online at Maron Fitness in Zimbabwe.",
    type: "website",
    url: SITE_URL,
    siteName: "Maron Fitness",
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

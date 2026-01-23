import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export const metadata = {
  title: "Sports Massage | Recovery & Performance",
  description:
    "Sports massage for recovery, mobility, and performance. Book online.",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  openGraph: {
    title: "Sports Massage | Recovery & Performance",
    description:
      "Book sports massage sessions online. Mobile responsive, local, professional.",
    type: "website",
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

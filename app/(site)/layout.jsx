import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const SITE_URL = "https://maronfitness.co.zw";
const OG_IMAGE_PATH = "/og-image.jpg";

export const metadata = {
  title: "Maron's Muscle Studio | Sports Massage & Deep Tissue Harare",
  description:
    "Maron's Muscle Studio in Harare — premium sports massage, deep tissue, Swedish, and assisted stretching. Book online for recovery, mobility and performance.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Maron's Muscle Studio",
    "Maron's Muscle Studio Harare",
    "Maron's Muscle Studio Zimbabwe",
    "Maron Muscle Studio",
    "Maron's Massage Harare",
    "Maron's Studio Harare",
    "Maron's Muscle Studio booking",
    "sports massage Harare",
    "sports massage Zimbabwe",
    "deep tissue massage Harare",
    "swedish massage Harare",
    "full body massage Harare",
    "assisted stretching Harare",
    "structural massage Harare",
    "restorative massage Harare",
    "cupping therapy Harare",
    "hot stone massage Harare",
    "massage Harare",
    "massage Zimbabwe",
    "spa Harare",
    "wellness Harare",
    "athlete massage Zimbabwe",
    "physio massage Zimbabwe",
    "therapeutic massage Zimbabwe",
    "best massage in Harare",
    "massage booking Zimbabwe",
    "book massage online",
    "264 Herbert Chitepo Avenue Harare",
  ],
  openGraph: {
    title: "Maron's Muscle Studio | Sports Massage & Deep Tissue Harare",
    description:
      "Premium sports massage, deep tissue, Swedish and assisted stretching at Maron's Muscle Studio in Harare. Book online.",
    type: "website",
    url: SITE_URL,
    siteName: "Maron's Muscle Studio",
    locale: "en_ZW",
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: "Maron's Muscle Studio — sports massage and wellness in Harare",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maron's Muscle Studio | Sports Massage & Deep Tissue Harare",
    description:
      "Premium sports massage, deep tissue, Swedish and assisted stretching at Maron's Muscle Studio in Harare. Book online.",
    images: [OG_IMAGE_PATH],
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  "@id": `${SITE_URL}/#business`,
  name: "Maron's Muscle Studio",
  alternateName: ["Maron Muscle Studio", "Maron's Studio"],
  description:
    "Premium sports massage, deep tissue, Swedish and assisted stretching in Harare. Recovery, mobility and performance therapy by certified therapists.",
  url: SITE_URL,
  logo: `${SITE_URL}/logo/newlogo.png`,
  image: `${SITE_URL}${OG_IMAGE_PATH}`,
  telephone: "+263780525557",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "264 Herbert Chitepo Avenue",
    addressLocality: "Harare",
    addressCountry: "ZW",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -17.8199352,
    longitude: 31.0548965,
  },
  areaServed: {
    "@type": "City",
    name: "Harare",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "07:00",
      closes: "20:00",
    },
  ],
  sameAs: [
    "https://www.facebook.com/profile.php?id=61590121575664",
    "https://www.instagram.com/maron_zw/",
    "https://wa.me/263780525557",
  ],
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: "Sports Massage" },
    },
    {
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: "Full Body Massage (Structural)" },
    },
    {
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: "Full Body Massage (Restorative)" },
    },
    {
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: "Assisted Stretching" },
    },
    {
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: "Gentlemen's Package" },
    },
  ],
};

export default function SiteLayout({ children }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

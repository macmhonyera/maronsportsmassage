export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/sitemap.xml`,
  };
}

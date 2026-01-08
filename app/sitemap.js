export default function sitemap() {
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const routes = ["", "/about", "/services", "/therapists", "/contact", "/terms", "/book", "/admin/login"];
  return routes.map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
  }));
}

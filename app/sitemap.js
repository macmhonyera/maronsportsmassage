export default function sitemap() {
  const base = "https://maronfitness.co.zw";
  const routes = ["", "/about", "/services", "/contact", "/terms", "/book", "/admin/login"];
  return routes.map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
    changeFrequency: r === "" || r === "/book" ? "weekly" : "monthly",
    priority: r === "" ? 1 : r === "/book" ? 0.9 : 0.7,
  }));
}

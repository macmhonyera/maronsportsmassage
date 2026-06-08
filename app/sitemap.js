// Bump LAST_CONTENT_UPDATE when meaningful content ships. Google reads the
// lastmod field as one signal for re-crawl priority — an honest, monotonic
// date is better than `new Date()` on every build (which silently churns it).
const LAST_CONTENT_UPDATE = "2026-06-08";

const ROUTES = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/services", priority: 0.95, changeFrequency: "weekly" },
  { path: "/book", priority: 0.9, changeFrequency: "weekly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap() {
  const base = "https://maronfitness.co.zw";
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path}`,
    lastModified: LAST_CONTENT_UPDATE,
    changeFrequency,
    priority,
  }));
}

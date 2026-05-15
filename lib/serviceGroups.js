export const ALLOWED_DURATIONS = [30, 60, 90];

export const STEPS = [
  { id: 1, label: "Service" },
  { id: 2, label: "Duration" },
  { id: 3, label: "Focus areas" },
  { id: 4, label: "Add-ons" },
  { id: 5, label: "Date & time" },
  { id: 6, label: "Details" },
];

export const THERAPIST_OPTIONS = [
  { id: "any", label: "Anyone Available" },
  { id: "male", label: "Male Therapist" },
  { id: "female", label: "Female Therapist" },
];

export const SERVICE_GROUP_CONFIG = [
  {
    id: "sports",
    title: "Sports Massage",
    description: "Targeted release for performance, recovery, and soreness.",
    serviceName: "Sports Massage",
  },
  {
    id: "full-body",
    title: "Full Body Massage",
    description: "Comprehensive muscular therapy — choose your intensity.",
    styles: [
      {
        id: "structural",
        name: "Structural",
        serviceName: "Structural",
        description: "Firm, deep pressure to release chronic tension.",
      },
      {
        id: "restorative",
        name: "Restorative",
        serviceName: "Restorative",
        description: "Long, soothing strokes to relax and ease tension.",
      },
    ],
  },
  {
    id: "stretch",
    title: "Assisted Stretching",
    description: "Guided stretching to improve mobility and flexibility.",
    serviceName: "Assisted Stretching",
  },
  {
    id: "gentlemens",
    title: "Gentlemen's Package",
    description: "Premium 90-min bundle: Foot Scrub, Full Body Massage, and Underarm Wax.",
    serviceName: "Gentlemen's Package",
  },
];

export function priceLabel(cents) {
  return `$${(cents / 100).toFixed(0)}`;
}

function indexServicesByName(services) {
  const map = new Map();
  for (const s of services) {
    if (!ALLOWED_DURATIONS.includes(s.durationMin)) continue;
    if (!map.has(s.name)) map.set(s.name, []);
    map.get(s.name).push({
      id: s.id,
      durationMin: s.durationMin,
      priceCents: s.priceCents,
    });
  }
  for (const list of map.values()) list.sort((a, b) => a.durationMin - b.durationMin);
  return map;
}

export function buildServiceGroups(services) {
  const byName = indexServicesByName(services);
  return SERVICE_GROUP_CONFIG.map((g) => {
    if (g.styles) {
      const styles = g.styles
        .map((s) => ({ ...s, durations: byName.get(s.serviceName) || [] }))
        .filter((s) => s.durations.length > 0);
      return { ...g, styles };
    }
    return { ...g, durations: byName.get(g.serviceName) || [] };
  }).filter((g) => (g.styles ? g.styles.length > 0 : g.durations.length > 0));
}

// Returns a display label for the service. If the service is a style under
// a multi-style group (e.g. Structural or Restorative under Full Body Massage),
// returns "Full Body Massage — Structural". Otherwise the name unchanged.
export function displayServiceName(serviceName) {
  if (!serviceName) return "";
  for (const g of SERVICE_GROUP_CONFIG) {
    if (g.styles && g.styles.some((s) => s.serviceName === serviceName)) {
      return `${g.title} — ${serviceName}`;
    }
  }
  return serviceName;
}

export function findGroupForServiceName(serviceName) {
  for (const g of SERVICE_GROUP_CONFIG) {
    if (g.styles) {
      if (g.styles.some((s) => s.serviceName === serviceName)) return g;
    } else if (g.serviceName === serviceName) {
      return g;
    }
  }
  return null;
}

// Services that don't offer free add-ons (Cupping / Hot Stones).
// The wizard skips the add-ons step when one of these is selected.
const NO_ADDON_SERVICE_NAMES = new Set(["Assisted Stretching", "Gentlemen's Package"]);

export function serviceAllowsAddOns(serviceName) {
  if (!serviceName) return true;
  return !NO_ADDON_SERVICE_NAMES.has(serviceName);
}

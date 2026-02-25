export const ADD_ON_SERVICES = [
  {
    id: "addon-foot-scrub-30",
    name: "Add-on: Foot Scrub",
    description: "Refresh tired feet and improve skin texture.",
    durationMin: 30,
    priceCents: 2000,
  },
  {
    id: "addon-back-scrub-15",
    name: "Add-on: Back Scrub",
    description: "Deep cleanse to smooth and revive skin.",
    durationMin: 15,
    priceCents: 1500,
  },
  {
    id: "addon-quads-hamstrings-30",
    name: "Add-on: Quads & Hamstrings",
    description: "Focused recovery for tight leg muscles.",
    durationMin: 30,
    priceCents: 1500,
  },
  {
    id: "addon-back-neck-head-30",
    name: "Add-on: Back, Neck & Head",
    description: "Targeted upper-body tension release.",
    durationMin: 30,
    priceCents: 1500,
  },
  {
    id: "addon-waxing-15",
    name: "Add-on: Waxing",
    description: "Quick waxing treatment for smooth skin.",
    durationMin: 15,
    priceCents: 1000,
  },
];

export function getAddOnById(id) {
  return ADD_ON_SERVICES.find((item) => item.id === id) || null;
}

export const ADD_ON_SERVICES = [
  {
    id: "cupping",
    name: "Cupping",
    description: "Suction therapy to release tension and improve circulation.",
    durationMin: 0,
    priceCents: 0,
  },
  {
    id: "hotstones",
    name: "Hot Stones",
    description: "Warm basalt stones to melt tight muscles and ease stress.",
    durationMin: 0,
    priceCents: 0,
  },
];

export const ADD_ON_IDS = ADD_ON_SERVICES.map((a) => a.id);

export function getAddOnById(id) {
  return ADD_ON_SERVICES.find((item) => item.id === id) || null;
}

export const FOCUS_AREA_GROUPS = [
  {
    id: "upper",
    label: "Upper body",
    areas: [
      { id: "neck", label: "Neck" },
      { id: "shoulders", label: "Shoulders" },
      { id: "upper-back", label: "Upper back" },
      { id: "lower-back", label: "Lower back" },
      { id: "arms", label: "Arms" },
    ],
  },
  {
    id: "lower",
    label: "Lower body",
    areas: [
      { id: "glutes", label: "Glutes" },
      { id: "hamstrings", label: "Hamstrings" },
      { id: "quads", label: "Quads" },
      { id: "calves", label: "Calves" },
      { id: "feet", label: "Feet" },
    ],
  },
];

export const FOCUS_AREA_IDS = FOCUS_AREA_GROUPS.flatMap((g) => g.areas.map((a) => a.id));

export const FOCUS_AREA_LABELS = FOCUS_AREA_GROUPS.reduce((acc, g) => {
  for (const a of g.areas) acc[a.id] = a.label;
  return acc;
}, {});

export const ADD_ON_LABELS = ADD_ON_SERVICES.reduce((acc, a) => {
  acc[a.id] = a.name;
  return acc;
}, {});

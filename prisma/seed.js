import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL in environment. Add it to .env and retry.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const FULL_LADDER_SERVICES = [
  { slug: "sports", name: "Sports Massage", description: "Targeted release for performance, recovery, and soreness." },
  { slug: "deep-tissue", name: "Deep Tissue", description: "Firm pressure to relieve chronic knots and deep pain." },
  { slug: "swedish", name: "Swedish", description: "Long flowing strokes to relax and reduce muscle tension." },
];

// USD cents. 30 min = $20 (all), 90 min = $50 (all). 60 min varies per service.
const PRICE_60 = {
  sports: 4000,
  "deep-tissue": 3500,
  swedish: 3000,
};

const ACTIVE_SERVICES = [
  ...FULL_LADDER_SERVICES.flatMap((s) => [
    { id: `${s.slug}-30`, name: s.name, description: s.description, durationMin: 30, priceCents: 2000 },
    { id: `${s.slug}-60`, name: s.name, description: s.description, durationMin: 60, priceCents: PRICE_60[s.slug] },
    { id: `${s.slug}-90`, name: s.name, description: s.description, durationMin: 90, priceCents: 5000 },
  ]),
  // Assisted Stretching is offered as a single 30-minute session only.
  {
    id: "stretch-30",
    name: "Assisted Stretching",
    description: "Guided stretching to improve mobility and flexibility.",
    durationMin: 30,
    priceCents: 2000,
  },
  // Gentlemen's Package — fixed 90-min premium bundle.
  {
    id: "gentlemens-package",
    name: "Gentlemen's Package",
    description: "Foot Scrub, Full Body Massage, and Underarm Wax in a single curated session.",
    durationMin: 90,
    priceCents: 5000,
  },
];

const ACTIVE_IDS = new Set(ACTIVE_SERVICES.map((s) => s.id));

async function main() {
  for (const s of ACTIVE_SERVICES) {
    await prisma.service.upsert({
      where: { id: s.id },
      update: {
        name: s.name,
        description: s.description,
        durationMin: s.durationMin,
        priceCents: s.priceCents,
        isActive: true,
      },
      create: {
        id: s.id,
        name: s.name,
        description: s.description,
        durationMin: s.durationMin,
        priceCents: s.priceCents,
        isActive: true,
      },
    });
  }

  const result = await prisma.service.updateMany({
    where: { id: { notIn: Array.from(ACTIVE_IDS) } },
    data: { isActive: false },
  });

  console.log(`Seeded ${ACTIVE_SERVICES.length} active services. Soft-deleted ${result.count} legacy rows.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

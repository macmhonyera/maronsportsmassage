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

const SERVICES = [
  { id: "swedish-60", name: "Swedish Massage", description: "Relax & reduce muscle tension", durationMin: 60, priceCents: 3000 },
  { id: "deep-tissue-60", name: "Deep Tissue Massage", description: "Relieve pain & knots", durationMin: 60, priceCents: 3500 },
  { id: "full-body-60", name: "Full Body Massage", description: "Improve circulation & overall well-being", durationMin: 60, priceCents: 4000 },
  { id: "sports-60", name: "Sports Massage", description: "Enhance performance & reduce muscle soreness", durationMin: 60, priceCents: 4000 },
  { id: "thai-60", name: "Thai Massage", description: "Improve flexibility & balance", durationMin: 60, priceCents: 4000 },
  { id: "aromatherapy-60", name: "Aromatherapy Massage", description: "Promote relaxation & emotional balance", durationMin: 60, priceCents: 3000 },
  { id: "hotstone-60", name: "Hotstone Massage", description: "Melt stress & soothe muscles", durationMin: 60, priceCents: 3500 },
  { id: "cupping-therapy-60", name: "Cupping Therapy", description: "Release tension & improve circulation", durationMin: 60, priceCents: 3500 },
  { id: "lymphatic-drainage-60", name: "Lymphatic Drainage", description: "Boost immunity & reduce swelling", durationMin: 60, priceCents: 3000 },
  { id: "gentlemens-package", name: "Gentlemen's Package", description: "Foot Scrub + Full Body Massage + Facial Cleanse + Underarm Wax", durationMin: 60, priceCents: 5000 },
];

async function main() {
  for (const s of SERVICES) {
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

  console.log("Seeded services:", SERVICES.length);
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

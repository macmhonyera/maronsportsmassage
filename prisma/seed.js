/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const existingServices = await prisma.service.count();
  if (existingServices === 0) {
    await prisma.service.createMany({
      data: [
        { name: "Sports Massage (60 min)", description: "Targeted recovery massage for athletes.", durationMin: 60, priceCents: 65000, isActive: true },
        { name: "Deep Tissue (60 min)", description: "Deeper pressure to address persistent tension.", durationMin: 60, priceCents: 70000, isActive: true },
        { name: "Recovery Session (45 min)", description: "Shorter recovery-focused session.", durationMin: 45, priceCents: 55000, isActive: true },
      ],
    });
  }

  const existingTherapists = await prisma.therapist.count();
  if (existingTherapists === 0) {
    await prisma.therapist.createMany({
      data: [
        { name: "Alex Ndlovu", bio: "Sports therapist focused on runners and cyclists.", specialties: "Sports recovery, Mobility, Trigger points", photoUrl: "/therapists/alex.jpg", isActive: true },
        { name: "Sam Patel", bio: "Deep tissue and injury-prevention specialist.", specialties: "Deep tissue, Injury prevention, Mobility", photoUrl: "/therapists/sam.jpg", isActive: true },
      ],
    });
  }
}

main()
  .then(async () => {
    console.log("Seed completed.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

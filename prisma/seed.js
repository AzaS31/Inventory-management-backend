import prisma from '../src/config/database.js';

async function main() {
    const categories = [
        { name: "Fiction" },
        { name: "Science/Research" },
        { name: "Education/Textbook" },
        { name: "Reference" },
        { name: "Professional/Tech" },
        { name: "Children" },
        { name: "Other" },
    ];

    for (const category of categories) {
        await prisma.category.upsert({
            where: { name: category.name },
            update: {},
            create: { name: category.name },
        });
    }

    console.log("✅ Categories seeded successfully!");
}

main()
    .catch((error) => {
        console.error("❌ Error seeding categories:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

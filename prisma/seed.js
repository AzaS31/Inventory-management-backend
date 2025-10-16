import prisma from '../src/config/database.js';

async function main() {
    console.log('Seeding roles...');

    await prisma.role.createMany({
        data: [
            { id: 1, name: 'CREATOR' },
            { id: 2, name: 'ADMIN' },
        ],
        skipDuplicates: true, 
    });

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

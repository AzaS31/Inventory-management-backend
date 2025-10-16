import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

prisma.$on('query', (e) => {
    console.log('Query: ' + e.query);
});

prisma.$on('error', (e) => {
    console.error('Prisma error:', e);
});

export default prisma;

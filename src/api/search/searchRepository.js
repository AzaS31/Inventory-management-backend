import prisma from "../../config/database.js";

export const searchRepository = {
    findInventories(query, isGuest) {
        return prisma.inventory.findMany({
            where: {
                AND: [
                    isGuest ? { isPublic: true } : {},
                    {
                        OR: [
                            { title: { contains: query, mode: "insensitive" } },
                            { description: { contains: query, mode: "insensitive" } },
                            { tags: { some: { tag: { name: { contains: query, mode: "insensitive" } } } } },
                        ],
                    },
                ],
            },
            include: {
                owner: { select: { username: true } },
                category: true,
                tags: { include: { tag: true } },
            },
            take: 20,
        });
    },

    findItems(query, isGuest) {
        return prisma.item.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                    { customValues: { some: { value: { contains: query, mode: "insensitive" } } } },
                ],
                inventory: isGuest ? { isPublic: true } : {},
            },
            include: {
                inventory: { select: { id: true, title: true, isPublic: true } },
            },
            take: 20,
        });
    },
};

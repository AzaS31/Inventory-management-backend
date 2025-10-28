import crypto from "crypto";
import prisma from "../config/database.js";
import dayjs from "dayjs";

export async function generateCustomId(inventoryId, formatParts) {
    if (!formatParts || !Array.isArray(formatParts)) {
        throw new Error("customIdFormat must be a valid JSON array");
    }
    
    let customId = "";

    for (const part of formatParts) {
        switch (part.type) {
            case "TEXT":
                customId += part.value ?? "";
                break;

            case "RAND6":
                customId += Math.floor(100000 + Math.random() * 900000).toString();
                break;

            case "RAND9":
                customId += Math.floor(100000000 + Math.random() * 900000000).toString();
                break;

            case "RAND20":
                customId += Math.floor(Math.random() * 1048576).toString();
                break;

            case "RAND32":
                customId += Math.floor(Math.random() * 4294967296).toString();
                break;

            case "GUID":
                customId += crypto.randomUUID();
                break;

            case "DATE":
                customId += dayjs().format(part.format || "YYYYMMDD");
                break;

            case "SEQ":
                customId += await generateSequence(inventoryId, part.digits || 6);
                break;

            default:
                throw new Error(`Unsupported ID part type: ${part.type}`);
        }
    }

    return customId;
}

async function generateSequence(inventoryId, digits = 6) {
    const lastItem = await prisma.item.findFirst({
        where: { inventoryId },
        orderBy: { createdAt: "desc" },
        select: { customId: true },
    });

    let lastSeq = 0;

    if (lastItem && lastItem.customId) {
        const match = lastItem.customId.match(/\d+$/);
        if (match) lastSeq = parseInt(match[0], 10);
    }

    const nextSeq = lastSeq + 1;
    return nextSeq.toString().padStart(digits, "0");
}

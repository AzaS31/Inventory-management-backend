import crypto from "crypto";
import prisma from "../config/database.js";
import dayjs from "dayjs";

export async function generateCustomId(inventoryId, formatParts) {
    if (!formatParts || !Array.isArray(formatParts)) {
        throw new Error("customIdFormat must be a valid JSON array");
    }

    const hasDate = formatParts.some(p => p.type === "DATE");
    const hasUnique = formatParts.some(p =>
        ["SEQ", "RAND6", "RAND9", "RAND20", "RAND32", "GUID"].includes(p.type)
    );

    if (hasDate && !hasUnique) {
        throw new Error("Invalid customIdFormat: DATE must be combined with SEQ, RAND, or GUID for uniqueness.");
    }

    if (!hasDate && !hasUnique) {
        throw new Error("Invalid customIdFormat: must include at least one unique part (SEQ, RAND, or GUID).");
    }

    const parts = [];

    for (const part of formatParts) {
        switch (part.type) {
            case "TEXT":
                parts.push(part.value ?? "");
                break;

            case "RAND6":
                parts.push(Math.floor(100000 + Math.random() * 900000).toString());
                break;

            case "RAND9":
                parts.push(Math.floor(100000000 + Math.random() * 900000000).toString());
                break;

            case "RAND20":
                parts.push(Math.floor(Math.random() * 1048576).toString());
                break;

            case "RAND32":
                parts.push(Math.floor(Math.random() * 4294967296).toString());
                break;

            case "GUID":
                parts.push(crypto.randomUUID());
                break;

            case "DATE":
                parts.push(dayjs().format(part.format || "YYYYMMDD"));
                break;

            case "SEQ":
                parts.push(await generateSequence(inventoryId, part.digits || 6));
                break;

            default:
                throw new Error(`Unsupported ID part type: ${part.type}`);
        }
    }

    return parts.join("-");
}

async function generateSequence(inventoryId, digits = 6) {
    const counter = await prisma.$transaction(async (tx) => {
        const updated = await tx.sequenceCounter.upsert({
            where: { inventoryId },
            update: { currentValue: { increment: 1 } },
            create: { inventoryId, currentValue: 1 },
        });
        return await tx.sequenceCounter.findUnique({ where: { inventoryId } });
    });

    return counter.currentValue.toString().padStart(digits, "0");
}

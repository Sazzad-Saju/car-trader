import { prisma } from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
    const { listingId } = event.context.params;
    
    return prisma.car.delete({
        where: { id: parseInt(listingId) },
    });
});
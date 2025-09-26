import { prisma } from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
    const { userId } = event.context.params;
    
    return prisma.car.findMany({
        where: { listerId: userId },
        select: {
            id: true,
            image: true,
            name: true,
            price: true,
        }
    });
});
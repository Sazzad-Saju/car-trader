import { prisma } from "~/server/utils/prisma";

 export default defineEventHandler(async (event) => {
    const { id } = event.context.params;

    const car = await prisma.car.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if(!car) {
        throw createError({ 
            statusCode: 404,
            statusMessage: `Car with id of ${id} not found`
        });
    }

    return car;
});
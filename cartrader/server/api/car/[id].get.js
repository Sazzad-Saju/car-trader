import cars from "@/data/cars.json";

 export default defineEventHandler(async (event) => {
    const { id } = event.context.params;

    const car = cars.find(c => c.id === parseInt(id));

    if(!car) {
        throw createError({
            statusCode: 404,
            statusMessage: `Car with id of ${id} not found`
        });
    }

    return car;
});
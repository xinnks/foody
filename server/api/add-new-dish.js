/** Dish addition endpoint
 * Submit new dish to database
 * Takes dish payload
 */

import { serverSupabaseClient } from "#supabase/server";
import { Novu } from '@novu/node';

export default defineEventHandler(async (event) => {
    const { dish } = await readBody(event);
    const supabase = serverSupabaseClient(event);
    const config = useRuntimeConfig();
    const novu = new Novu(config.novuApiKey);


    // * Create a new dish
    const {data: newDishData, error: newDishError} = await supabase
    .from('dishes')
    .insert(dish)
    .select();

    if(newDishError){
        throw createError({
            statusCode: 401,
            statusMessage: newDishError,
            message: "Failed to add dish"
        })
    }

    // * Create dish topic
    const {data: createdTopicData} = await novu.topics.create({
        key: "customers:favorite:" + newDishData[0].id,
        name: "Customers that love " + newDishData[0].name
    });
    

    return {
        message: 'Added dish!',
    }
})
/** Order placement endpoint
 * Notifies customers when their orders have been successfully placed
 * Takes order
 */

import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import { Novu } from '@novu/node';

function generateOrderNumber(seconds) {
    const date = new Date(seconds);
    return `${date.getDate()}${date.getMonth()+1}${String(date.getFullYear()).slice(2)}${date.getUTCSeconds()}`
}

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event);
    const { order } = await readBody(event);
    const supabase = serverSupabaseClient(event);
    const config = useRuntimeConfig();
    const novu = new Novu(config.novuApiKey);

    // * Create new order
    let {data: newOrderData, error: newOrderError} = await supabase
    .from('orders')
    .insert({
        profile_id: user.id,
        price: order.totalFee,
        final_price: parseInt(order.totalFee + order.deliveryFee + (order.discount || 0)),
        delivery_fee: order.deliveryFee,
        updated_at: new Date(),
        comment: order.comment,
    })
    .select();
    if(newOrderError){
        throw createError({
            statusCode: 401,
            statusMessage: "Failed to create new order",
            data: newOrderError
        })
    }
    newOrderData = newOrderData[0]

    // * Add order dishes
    const {data: newOrderDishesData, error: newOrderDishesError } = await supabase
        .from('order_dishes')
        .insert(order.dishes.map(
            dish => ({dish_id: dish.id, order_id: newOrderData.id, count: dish.count})
        ))
        .select();
    if(newOrderDishesError){
        throw createError({
            statusCode: 401,
            statusMessage:  "Failed to create order dishes",
            data: newOrderDishesError
        })
    }

    const topicKey = 'customer:favorites:' + order.dishes[0].id;
    const subscriberId = user.id;

    //* Add a customer to topic based on their purchasing behavior
    const {data: addedSubscriberToTopic} = await novu.topics.addSubscribers(topicKey, {
        subscribers: [subscriberId],
    })
    // * Send order confirmation notification to customer
    const [firstName] = user.user_metadata.full_name.split(" ")
      const { data: orderConfirmationResponse } = await novu.trigger('order-confirmation', {
          to: {
            subscriberId: user.id,
            email: user.user_metadata.email,
            firstName
          },
          payload: {
            dishes: order.dishes,
            orderNumber: generateOrderNumber(newOrderData.created_at),
            deliveryFee: order.deliveryFee,
            totalFee: order.totalFee,
            firstName
          },
        });

    return {
        message: 'Created order!'
    }
})
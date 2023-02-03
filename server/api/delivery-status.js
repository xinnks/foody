/** Order delivered status notification
 * Updates database
 * Send's order delivery status update notification to customer
 * Takes orderId and status
 */

import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import { Novu } from '@novu/node';

function generateOrderNumber(seconds) {
    const date = new Date(seconds);
    return `${date.getDate()}${date.getMonth()+1}${String(date.getFullYear()).slice(2)}${date.getUTCSeconds()}`
}

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event);
    const { order_id, status } = await readBody(event);
    const supabase = serverSupabaseClient();
    const config = useRuntimeConfig();
    const novu = new Novu(config.novuApiKey);

    // TODO: Get order information using order_id
    const {data: orderData, error: orderError} = await supabase
    .from('orders')
    .match({id: order_id})
    .select();
    if(orderError){
        throw createError({
            statusCode: 401,
            statusMessage: "Failed to fetch order information",
            data: orderError
        })
    }

    // * Send order status update to customer
    const [order] = orderData;
    const {data: orderConfirmationNotificationData } = await novu.trigger('delivery-status', {
        to: {
        subscriberId: user.id,
        email: user.user_metadata.email
        },
        payload: {
        status: status ? "picked for delivery" : "delivered",
        orderNumber: generateOrderNumber(newOrderDishesData.created_at),
        delivered: order.delivered,
        feedbackUrl: config.public.feedbackUrl + "/" + order.id
        },
    });

    return {
        message: 'Created order!'
    }
})
/** Customer feedback endpoint
 * Submits feedback to database and sends a notification to customer
 * Takes orderId and feedback payload
*/
import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import { Novu } from '@novu/node';

export default defineEventHandler(async (event) => {
    const { information, orderId } = await readBody(event);
    const supabase = serverSupabaseClient(event);
    let user = serverSupabaseUser();
    const config = useRuntimeConfig();
    const novu = new Novu(config.novuApiKey);

    // * Submit customer feedback
    let {data: feedbackData, error: feedbackError} = await supabase
    .from('orders')
    .upsert({
        id: orderId,
        information,
    })
    .select();
    if(feedbackError){
        throw createError({
            statusCode: 401,
            statusMessage: feedbackError,
            message: "Failed to submit user feedback"
        })
    }

    // * Get user information
    if(!user){
        let {data: orderInfo, error: orderError} = await supabase
        .from('orders')
        .select("*, profiles(*)")
        .match({ id: orderId})
        .select();

        console.log({orderInfo, orderError});
        if(orderError){
            throw createError({
                statusCode: 401,
                statusMessage: orderError,
                message: "Failed to get user information"
            })
        }

        user = orderInfo[0].profiles;
    }

    // * Send feeback appreciation notification
    const [firstName] = (user.user_metadata.full_name || user.full_name).split(" ");
      await novu.trigger('feedback-appreciation', {
          to: {
            subscriberId: user.id,
            email: user.user_metadata.email || user.email
          },
          payload: {
            firstName
          },
        });

    return {
        message: 'Feedback submitted!',
    }
})
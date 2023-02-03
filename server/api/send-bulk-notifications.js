/** Send bulk notifications
 * Sends notification to many customers
 * Takes notification payload and dishId
 * 
 */
import { Novu } from '@novu/node';
import { TriggerRecipientsTypeEnum } from '@novu/shared'

export default defineEventHandler(async (event) => {
    const { dishId, title: promotionTitle, information: promotionDetails } = await readBody(event);
    const config = useRuntimeConfig();
    const novu = new Novu(config.novuApiKey);

    const topicKey = 'customer:favorites:' + dishId;

    // * Send notification to topic
    const {data: bulkNotificationResponse} = await novu.trigger('dish-based-promotional-notification',{
        to: [{ type: TriggerRecipientsTypeEnum.TOPIC, topicKey }],
        payload: {
            promotionTitle,
            promotionDetails,
            topicKey,
            optOutLink: config.public.optOutLink
        }
    });

    return {
        message: 'Promotion submitted!'
    }
})
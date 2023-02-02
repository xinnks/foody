/** Opt out of topic
*/
import { Novu } from '@novu/node';

export default defineEventHandler(async (event) => {
    const { userId, topicKey } = getQuery(event);
    const config = useRuntimeConfig();
    const novu = new Novu(config.novuApiKey);

    // * Remove subscriber from topic
    const {data: optOutResponse} = await novu.topics.removeSubscribers(topicKey, {
        subscribers: [userId]
    });

    return {
        message: 'You have unsubscribed from these emails!'
    }
})
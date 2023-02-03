/** Creates a new Novu topic
 * Takes topic payload
*/
import { Novu } from '@novu/node';

export default defineEventHandler(async (event) => {
    const { topicKey, topicName } = await readBody(event);
    const config = useRuntimeConfig();
    const novu = new Novu(config.novuApiKey);

    // * Create a Novu topic
    const result = await novu.topics.create({
        key: topicKey,
        name: topicName,
    });

    return {
        message: 'Successfully created topic!'
    }
})
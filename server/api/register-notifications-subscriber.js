/** Register Novu notifications subscriber
*/
import { serverSupabaseUser } from "#supabase/server";
import { Novu } from '@novu/node';

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event);
    const config = useRuntimeConfig();
    const novu = new Novu(config.novuApiKey);

    // * Send welcome notification to new user
    const [firstName, lastName] = user.user_metadata.full_name.split(" ");
      await novu.trigger('welcome-new-user', {
          to: {
            subscriberId: user.id,
            email: user.user_metadata.email,
            firstName,
            lastName,
            phone: user.user_metadata.phone,
          },
          payload: {
            firstName
          },
        });

    return {
        message: 'Successfully registered!'
    }
})
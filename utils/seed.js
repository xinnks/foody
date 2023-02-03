const dotenv = require('dotenv');
dotenv.config();

const { createClient } = require('@supabase/supabase-js');
const { Novu } = require('@novu/node');
const { TriggerRecipientsTypeEnum } = require('@novu/shared')
const novu = new Novu(process.env.NUXT_NOVU_API_KEY);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Add some data
(async function insertData(){
    const {dishes} = require("./seedData.json");

    const {data: supabaseData, error} = await supabase
        .from("dishes")
        .insert(dishes)
        .select()

        supabaseData.forEach(async (dish) => {
            const { data: newTopics } = await novu.topics.create({
                key: "customer:favorites:" + dish.id,
                name: dish.name + " lovers topic",
            });
        })
})()
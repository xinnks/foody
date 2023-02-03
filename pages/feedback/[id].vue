<script setup>
const router = useRouter();
const route = useRoute();
const supabase = useSupabaseClient();
const config = useRuntimeConfig();

const feedback = reactive({
    information: ''
});
let loading = ref(true);
let feedbackIdIsValid = ref(false);

// check if feedback id is present
if(!route.params.id){
    alert("Request is invalid!");
    router.push("/dishes");
}

// Checks if feedback request id is legit
(async function validateFeedbackRequest(){
    const {data, error} = await supabase
        .from("orders")
        .select("*, feedbacks(*)")
        .match({id: route.params.id})
        .eq('feedbacks.information', null);
    if(!error){
        feedbackIdIsValid.value = true;
    } else {
        router.push("/dishes");
    }
})();

// Sends user feedback
async function sendFeedback() {
    const { information } = feedback;
    if(!information) return alert("Feedback field cannot be empty!");
    loading.value = true;
    const { error, data } = await useFetch('/api/submit-feedback', {
        method: 'post',
        body: { information, orderId: route.params.id }
    });
    if(!error) return alert(data.message);
    console(error.message);
    router.push("/dishes");
    loading.value = false;
}

function orderNumber() {
    const date = new Date(order.created_at);
    return `${date.getDate()}${date.getMonth()+1}${String(date.getFullYear()).slice(2)}${date.getUTCSeconds()}`
}

useHead({
    title: 'Feedback',
    meta: [
        { name: 'description', content: 'Order feedback' }
    ]
})
</script>

<template>
    <div
        v-if="!route.params.id || !feedbackIdIsValid"
        class="flex p-8 justify-center"
    >
        <p>Processing request.. </p>
    </div>
    <div
        v-else
        class="flex flex-col space-y-8 px-2"
    >
        <h1 class="text-center p-2 text-3xl text-secondary">We'd like to hear your feedback for the food order #{{ orderNumber }}</h1>

        <section class="flex flex-col rounded-md w-full md:w-[75vw] lg:w-[50vw] pb-4">
            <form
                @submit.prevent="sendFeedback()"
                class="flex flex-col space-y-6 py-8 px-1"
            >
                <div class="flex items-center space-x-2">
                    <textarea
                        v-model="feedback.comment"
                        placeholder="Your service and dishes are superb, keep it up!"
                        class="flex-1 rounded-md px-3 py-2 outline outline-2 outline-primary-100"
                        rows="4"
                    ></textarea>
                </div>
                <div class="flex justify-center items-center p-2">
                    <button
                        type="submit"
                        class="py-2 text-center full md:w-1/2 lg:w-1/3 bg-primary text-white rounded-full"
                    >
                        {{ loading ? 'Loading..' : 'Submit' }}
                    </button>
                </div>

            </form>
        </section>
    </div>
</template>
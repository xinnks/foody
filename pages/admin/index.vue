<script setup>
definePageMeta({
    middleware: 'admin',
    layout: 'admin-dashboard'
})

const user = useSupabaseUser();
const client = useSupabaseClient();
let topicLoading = ref(false);
let promotionLoading = ref(false);
let dishLoading = ref(false);

const userData = computed(() => ({...user.value.user_metadata}));

const topic = reactive({
    name: "",
    key: ""
});

const promotion = reactive({
    title: "",
    dishId: "",
    information: ""
});

const newDish = reactive({
    name: "",
    image: "",
    ingredients: "",
    description: "",
    price: 0,
    calories: ""
})
const dishCopy = {...newDish}

const { data: dishes } = await useAsyncData('dishes', async () => client.from('dishes').select('id, image, name, price, calories'), {
    transform: (result) => result.data
});

// Creates a new topic
async function createTopic(){
    const {name, key} = topic;
    if(!name) return alert("Name cannot be empty!");
    if(!key) return alert("Key cannot be empty!");
    topicLoading.value = true;
    const {data, error} = await useFetch('/api/create-topic', {
        method: 'post',
        body: { name, key }
    });
    if(!error) {
        clearStore();
        topicLoading.value = false;
        console.log({data})
        return;
    }
    console.log({error})
    topicLoading.value = false;
}

// Creates a new promotion based on a dish
async function createPromotion(){
    const {title, dishId, information} = promotion;
    if(!title) return alert("title cannot be empty!");
    if(!dishId) return alert("dish cannot be empty!");
    if(!information) return alert("information cannot be empty!");
    promotionLoading.value = true;
    const {data: responseData, error} = await useFetch('/api/send-bulk-notifications', {
        method: 'post',
        body: { title, dishId, information }
    });
    if(!error) {
        promotionLoading.value = false;
        console.log({responseData})
        return;
    }
    console.log({error})
    promotionLoading.value = false;
}

// Submits a new dish to the database
async function submitDish(){
    const {name, image, ingredients, description, price, calories} = newDish;
    console.log({newDish});
    if(!name) return;
    if(!image) return;
    if(!ingredients) return;
    if(!description) return;
    if(!price) return;
    if(!calories) return;
    dishLoading.value = true;
    const {data, error} = await useFetch('/api/add-new-dish', {
        method: 'post',
        body: { dish: newDish }
    });
    if(!error) {
        newDish = {...dishCopy}
        dishLoading.value = false;
        console.log({data})
        return;
    }
    console.log({error})
    dishLoading.value = false;
}

useHead({
  title: 'Admin',
  meta: [
    { name: 'description', content: 'Admin account dashboard.' }
  ]
})
</script>

<template>
    <div class="flex flex-col px-4 space-y-4">
        <div class="flex justify-end space-y-2 px-2">
            <h1
                class="flex text-primary text-2xl font-semibold py-2"
            >
                {{ userData.full_name }}.
            </h1>
        </div>

        <hr>

        <section class="flex flex-col rounded-md w-full md:w-[75vw] lg:w-[50vw] pb-4">
            <h2>Create A New Topic</h2>
            <form
                @submit.prevent="createTopic()"
                class="flex flex-col space-y-6 py-8 px-1"
            >
                <div class="flex items-center space-x-2">
                    <label class="w-1/3" for="email">Name </label>
                    <input
                        v-model="topic.name"
                        id="email"
                        class="flex-1 rounded-full px-3 py-2 outline outline-2 outline-primary-100"
                        type="email"
                    >
                </div>
                <div class="flex items-center space-x-2">
                    <label class="w-1/3" for="email">Unique Key </label>
                    <input
                        v-model="topic.key"
                        id="email"
                        class="flex-1 rounded-full px-3 py-2 outline outline-2 outline-primary-100"
                        type="email"
                    >
                </div>
                <div class="flex justify-center items-center p-2">
                    <button
                        type="submit"
                        class="py-2 text-center full md:w-1/2 lg:w-1/3 bg-primary text-white rounded-full"
                    >
                        {{ topicLoading ? "loading.." : 'Submit' }}
                    </button>
                </div>

            </form>
        </section>
        
        <hr>

        <section class="flex flex-col rounded-md w-full md:w-[75vw] lg:w-[50vw] pb-4">
            <h2>Create a promotion</h2>
            <form
                @submit.prevent="createPromotion()"
                class="flex flex-col space-y-6 py-8 px-1"
            >
                <div class="flex items-center space-x-2">
                    <label class="w-1/3" for="title">Title </label>
                    <input
                        v-model="promotion.title"
                        id="title"
                        class="flex-1 rounded-full px-3 py-2 outline outline-2 outline-primary-100"
                        type="text"
                    >
                </div>
                <div class="flex items-center space-x-2">
                    <label class="w-1/3" for="dish">Dish </label>
                    <select
                        v-model="promotion.dishId"
                        id="dish"
                        class="flex-1 rounded-full px-3 py-2 outline outline-2 outline-primary-100"
                        type="text"
                    >
                        <option v-for="(dish, key) of dishes" :key="key" :value="dish.id">{{ dish.name }} [{{ dish.price }}$]</option>
                    </select>
                </div>
                <div class="flex items-center space-x-2">
                    <textarea
                        v-model="promotion.information"
                        placeholder="Promotion Details"
                        class="flex-1 rounded-md px-3 py-2 outline outline-2 outline-primary-100"
                        rows="4"
                    ></textarea>
                </div>
                <div class="flex justify-center items-center p-2">
                    <button
                        type="submit"
                        class="py-2 text-center full md:w-1/2 lg:w-1/3 bg-primary text-white rounded-full"
                    >
                        {{ promotionLoading ? "loading.." : 'Submit' }}
                    </button>
                </div>

            </form>
        </section>

        <hr>

        <section class="flex flex-col rounded-md w-full md:w-[80vw] lg:w-[50vw] pb-4">
            <h2>Add a new dish</h2>
            <form
                @submit.prevent="submitDish()"
                class="flex flex-col space-y-6 py-8 px-1"
            >
                <div class="flex items-center space-x-2">
                    <input
                        v-model="newDish.name"
                        placeholder="Bitter sweet soup"
                        class="flex-1 rounded-full px-3 py-2 outline outline-2 outline-primary-100"
                        type="text"
                    >
                </div>
                <div class="flex items-center space-x-2">
                    <input
                        v-model="newDish.image"
                        placeholder="https://cdn.domain.eg/image.png"
                        class="flex-1 rounded-full px-3 py-2 outline outline-2 outline-primary-100"
                        type="text"
                    />
                </div>
                <div class="flex items-center space-x-2">
                    <input
                        v-model="newDish.price"
                        placeholder="12"
                        class="flex-1 rounded-full px-3 py-2 outline outline-2 outline-primary-100"
                        type="number"
                    />
                </div>
                <div class="flex items-center space-x-2">
                    <input
                        v-model="newDish.calories"
                        placeholder="150 - 220"
                        class="flex-1 rounded-full px-3 py-2 outline outline-2 outline-primary-100"
                        type="text"
                    />
                </div>
                <div class="flex items-center space-x-2">
                    <textarea
                        v-model="newDish.ingredients"
                        placeholder="Ingredients"
                        class="flex-1 rounded-md px-3 py-2 outline outline-2 outline-primary-100"
                        rows="3"
                    ></textarea>
                </div>
                <div class="flex items-center space-x-2">
                    <textarea
                        v-model="newDish.description"
                        placeholder="Description"
                        class="flex-1 rounded-md px-3 py-2 outline outline-2 outline-primary-100"
                        rows="3"
                    ></textarea>
                </div>
                <div class="flex justify-center items-center p-2">
                    <button
                        type="submit"
                        class="py-2 text-center full md:w-1/2 lg:w-1/3 bg-primary text-white rounded-full"
                    >
                        {{ dishLoading ? "loading.." : 'Submit' }}
                    </button>
                </div>

            </form>
        </section>
    </div>
</template>
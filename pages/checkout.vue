<script setup>
import { storeToRefs } from "pinia";
import { useCartStore } from "~~/store/cart";

definePageMeta({
    middleware: 'auth',
    layout: 'dashboard'
});

const cartStore = useCartStore();
const user = useSupabaseUser();
const deliveryFee = ref(50);

const { totalPrice, items: dishes, showCart } = storeToRefs(cartStore);
const { toggleCart, clearStore } = cartStore;

let order = reactive({
    user: {id: user.value.id, ...user.value.user_metadata},
    address: user.value.user_metadata.address,
    dishes: dishes.value,
    comment: "",
    deliveryFee,
    totalFee: parseInt(totalPrice.value) + parseInt(deliveryFee.value)
})
let processing = ref(false);
let addressAvailable = ref(true);

async function placeOrder(){
    processing.value = true;
    if(!order.address && !user.value.user_metadata.address){
        addressAvailable.value = false;
        processing.value = false;
        return;
    }
    const {data: responseData, error} = await useFetch('/api/place-order', {
        method: 'post',
        body: { order }
    });
    if(responseData) {
        alert("Created order, now clearing the store.")
        clearStore();
        processing.value = false;
        console.log({responseData})
        return;
    } else {
        console.log({error})
    }
    processing.value = false;
}

useHead({
  title: 'Checkout',
  meta: [
    { name: 'description', content: 'Checking out.' }
  ]
})
</script>

<template>
    <div class="flex flex-col px-4 space-y-4">
        <div class="flex space-y-2 px-2">
            <h1
                class="flex text-primary text-2xl font-semibold py-2"
            >
               Checkout
            </h1>
        </div>
        <hr>
        <div class="flex flex-col space-y-2 px-2">
            <h2
                class="flex text-primary text-xl font-semibold py-1"
            >Account Information</h2>
            <ul class="px-2">
                <li class="p-1">
                    <input
                        v-model="order.user.email"
                        class="outline outline-secondary-400 active:outline-secondary-500 p-2 w-full disabled:bg-slate-100"
                        type="text"
                        disabled
                    >
                </li>
                <li class="p-1">
                    <input
                        v-model="order.user.phone"
                        class="outline outline-secondary-400 active:outline-secondary-500 p-2 w-full disabled:bg-slate-100"
                        type="text"
                        disabled
                    >
                </li>
                <li class="p-1">
                    <textarea
                        v-model="order.address"
                        class="outline outline-secondary-400 active:outline-secondary-500 px-1 p-2 w-full resize-none disabled:bg-slate-100"
                        type="text"
                    ></textarea>
                    <span v-show="!addressAvailable" class="flex p-2 bg-red-200 text-red-700">
                        {{ addressAvailable ? '' : 'Fill in the delivery adress' }}
                    </span>
                </li>
            </ul>
        </div>
        <hr>
        <div class="flex flex-col px-2 pb-8">
            <h1
                class="flex text-primary text-xl font-semibold py-2"
            >
                Order Details
            </h1>

            <div
                v-if="!dishes.length"
                class="p-2 text-gray-700"
            >
                No Dishes
            </div>

            <div
                v-else
                class="flex flex-col space-y-2 px-2 pb-8"
            >
                <CheckoutCard
                    v-for="(dish, key) of dishes"
                    :key="key"
                    :dish="dish"
                ></CheckoutCard>

                <div
                    v-if="dishes.length"
                    class="w-full text-right font-bold justify-between px-8 border-slate-200 rounded py-2"
                >
                    Delivery Fee: <span>{{ deliveryFee }}$</span>
                </div>

                <div
                    v-if="dishes.length"
                    class="w-full text-right font-bold justify-between px-8 border-slate-200 rounded py-2"
                >
                    <span>{{ parseInt(totalPrice) + parseInt(deliveryFee) }}$</span>
                </div>

                <div
                    v-if="dishes.length"
                    class="p-1"
                >
                    <textarea
                        v-model="order.comment"
                        placeholder="Order comments"
                        class="outline outline-secondary-400 active:outline-secondary-500 p-1 w-full resize-none"
                        type="text"
                        rows="4"
                    ></textarea>
                </div>

                <div
                    v-if="dishes.length"
                    class="p-2 flex justify-center"
                >
                    <button @click="placeOrder()" class="px-8 py-2 rounded bg-primary-400 hover:bg-primary-500 text-white">
                        {{ processing ? "Loading.." : "Checkout" }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    order: {
        type: Object,
    }
})

const {order} = props;

let showOrderDetails = ref(false);

const calculatePrice = (count, price) => (count * price).toFixed(2);

const totalPrice = order.order_dishes.reduce((acc, curr) => {
    return acc + (curr.dishes.price * curr.count);
}, 0).toFixed(2);

function orderNumber() {
    const date = new Date(order.created_at);
    return `${date.getDate()}${date.getMonth()+1}${String(date.getFullYear()).slice(2)}${date.getUTCSeconds()}`
}

function orderDate (){
    const date = new Date(order.created_at);
    return `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}/${(date.getMonth()+1) < 10 ? '0' + (date.getMonth()+1) : date.getMonth()+1}/${date.getFullYear()}`
} 

</script>

<template>
    <div
        class="flex space-x-3 justify-between px-8 bg-slate border border-secondary-100 200¸rounded"
    >
        <div class="flex items-center p-2">
            {{ orderDate() }}
        </div>

        <div class="flex items-center p-2">
            Order # {{ orderNumber() }} ({{ totalPrice }})
        </div>

        <div class="flex justify-center p-4">
            <div
                class="px-3 py-2 rounded"
                :class="{
                    'text-blue-500 font-semibold': order.in_transit,
                    'text-green-600 font-semibold': order.delivered,
                    'text-slate-600 font-semibold': !order.delivered && !order.in_transit
                }"
            >
                {{ order.delivered ? "delivered" : (order.in_transit ? "in-transit" : "preparing") }}
            </div>
        </div>

        <div class="flex justify-center p-5">
            <button
                @click="showOrderDetails = !showOrderDetails"
                class="px-3 py-1 rounded bg-primary-400 hover:bg-primary-500 text-white"
            >Order Details</button>
        </div>
    </div>
    <ul
        v-show="showOrderDetails"
        class="p-2"
    >
        <li
            v-for="(dish, key) in order.order_dishes"
            :key="key"
            class="p-1 flex flex-col md:flex-row justify-start md:justify-between"
        >
            <span>{{ dish.dishes.name }}</span>
            <span>{{ dish.count }} x {{ dish.dishes.price }}</span>
            <span>{{ calculatePrice(dish.count, dish.dishes.price) }}$</span>
        </li>
        <li
            class="p-1 flex justify-end"
        >
            <span class="font-semibold">TOTAL: {{ totalPrice }}$</span>
        </li>
    </ul>
</template>
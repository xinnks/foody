<script setup>
import { useCartStore } from "~~/store/cart";

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})

const { item } = props;
const cartStore = useCartStore();
const { removeItem, updateCount } = cartStore;

let count = computed({
    get(){
        return item.count
    },
    set(newValue){
        updateCount({dish: item, count: newValue})
    }
})
</script>

<template>
    <div class="w-full pl-2 py-1 flex justify-around items-center border-2 border-primary rounded-md">
        <div class="p-2">
            <select name="" id="" v-model="count">
                <option
                    v-for="val in 100"
                    :value="val"
                    :selected="count === val"
                >{{ val }}</option>
            </select>
        </div>
        <div class="p-2 flex-1">{{ item.title }}</div>
        <div class="p-2">${{ (item.price * item.count).toFixed(2) }}</div>
        <button
            @click="removeItem(item)"
            class="p-1"
            title="Remove item"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6 fill-red-500"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/></svg>
        </button>
    </div>
</template>
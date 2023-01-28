<script setup>
const props = defineProps({
    dish: {
        type: Object,
    }
})

const {dish} = props;

const totalPrice = (dish.count * dish.price).toFixed(2);
</script>

<template>
    <div
        class="flex space-x-3 justify-between px-8 bg-slate border border-secondary-100 200¸rounded"
    >
        <div class="flex items-center p-1">
            {{ dish.name }} x {{ dish.count }}
        </div>

        <div class="flex justify-center p-1">
            {{ totalPrice }}$
        </div>
    </div>
</template>
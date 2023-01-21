<script setup>

const props = defineProps({
    dish: {
        type: Object,
    }
})

const {dish} = props

</script>

<template>
    <NuxtLink
        :to="'/dish/' + dish.id"
        class="grid grid-cols-2 bg-primary-300 m-3 rounded-2xl border border-primary-50">
        <div class="flex rounded-l-2xl h-40 justify-center overflow-hidden backdrop-blur-sm">
            <img
                :src="`${dish.image}?twic=v1/resize=300`" :alt="dish.name"
                class="relative flex-1 h-40 w-auto max-w-none"
            />
        </div>
        <div class="flex flex-col space-y-2 p-2 md:text-lg">
            <h3
                class="font-semibold"
            >
                {{ dish.name }}
            </h3>
            <p class="flex-1 text-secondary-800 md:text-sm">
                {{ dish.calories }} Cal
            </p>
            <p class="text-lg">
                ${{ dish.price }}
            </p>
        </div>
    </NuxtLink>
</template>
<script setup>
const client = useSupabaseClient();

// Fetch data from supabase
const { data: dishes } = await useAsyncData('dishes', async () => client.from('dishes').select('id, image, name, price, calories'), {
    transform: (result) => result.data
})

useHead({
  title: 'Our Dishes',
  meta: [
    { name: 'description', content: 'The dishes page.' }
  ]
})
</script>

<template>
    <div class="flex flex-col space-y-8 px-2">

        <h1
            class="flex justify-center text-primary text-4xl font-semibold p-8"
        >
            Our delicious dishes
        </h1>

        <section
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-auto"
        >
            <DishCard
                v-for="(dish, key) of dishes"
                :key="key"
                :dish="dish"
            ></DishCard>
        </section>
    </div>
</template>
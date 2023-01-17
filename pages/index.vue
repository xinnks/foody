<script setup>
useHead({
  title: "Home",
  meta: [
    { name: 'description', content: "Order the food you deserve." }
  ]
})
</script>

<template>
    <div class="flex flex-col space-y-8 px-2">
        <h1 class="text-center my-4 text-6xl font-bold text-primary-dark">Foody</h1>

        <section
            class="my-5 py-20 max-h-[80vh] px-5 rounded-xl text-white text-4xl justify-around backdrop:blur-xl bg-no-repeat bg-center"
            style="background-image: url(https://images.pexels.com/photos/1893569/pexels-photo-1893569.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load);"
        >
            Where the best meals are served
        </section>
    </div>
</template>
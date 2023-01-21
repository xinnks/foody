<script setup>
import { useCartStore } from '~~/store/cart';

const client = useSupabaseClient();
const route = useRoute();
let count = ref(1)

const cartStore = useCartStore();

const { addItem } = cartStore;

watch(count, (newCount) => {
    if(newCount <= 0){
        count.value = 1
    }
})

const { data: dish } = await useAsyncData('dish', async () => client.from('dishes').select('id, image, name, price, calories, description, ingredients').eq("id", route.params.id), {
    transform: (result) => result.data[0]
})

const modifyImageUrl = (url) => url.replace("https://asset-train.twic.pics","")

useHead({
  title: dish.value?.name,
  meta: [
    { name: 'description', content: dish.value?.description }
  ],
  script: [
    { src: 'https://asset-train.twic.pics/?v1', defer: true, async: true}
  ]
})
</script>

<template>
    <div class="flex flex-col md:flex-row space-y-8 md:space-y-0 space-x-8 p-4">
        <div class="w-3/5 flex">
            <figure
                :style="`background-image: url(${dish.image}?twic=v1/output=preview)`"
                class="w-full h-full md:h-auto flex-1 bg-no-repeat bg-cover bg-center"
            >
                <img 
                    :data-twic-src="`image:${modifyImageUrl(dish.image)}?twic=v1/resize=1024`" :alt="dish.name"
                    class="w-full h-full md:h-auto flex-1"
                >
            </figure>
        </div>
        <div class="flex-1 flex flex-col justify-between space-y-6">
            <div class="flex flex-col space-y-2">
                <h1 class="text-2xl font-bold">{{ dish.name }}</h1>
                <div>
                    {{ dish.calories }} Cal
                </div>
                <div class="font-semibold">
                    ${{ dish.price }}
                </div>
                <div class="py-4">
                    {{ dish.description }}
                </div>
                <div class="flex space-x-2 text-16">
                    <button class="font-semibold cursor-pointer select-none" @click="count--">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM7 11v2h10v-2H7z"/></svg>
                    </button>
                    <span class="flex flex-col items-center justify-center border-2 border-secondary w-12 h-6 rounded-full">{{ count }}</span>
                    <button class="font-semibold cursor-pointer select-none" @click="count++">
                        <svg class="text-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11H7v2h4v4h2v-4h4v-2h-4V7h-2v4z"/></svg>
                    </button>
                </div>
            </div>
            <div>
                <button
                    @click="addItem({dish, count})"
                    class="w-full rounded-md p-4 bg-primary hover:bg-primary-500 text-light"
                > Add to Order (${{ (count * dish.price).toFixed(2) }}) </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    img {
        opacity: 0;
        will-change: opacity;
        transition: opacity 1s linear;
    }

    img.twic-done {
        opacity: 1;
    }
</style>
<script setup>
import { storeToRefs } from "pinia";
import { useCartStore } from "../store/cart.js"
const cartStore = useCartStore();
const route = useRoute();

const { totalPrice, items, showCart } = storeToRefs(cartStore);
const { toggleCart } = cartStore;
</script>

<template>
    <Transition name="slide">
        <div
            v-show="showCart"
            class="cart px-2 pb-2 flex flex-col space-y-2 fixed right-3 left-3 sm:left-auto bg-shade-200 w-full md:w-80 z-80 backdrop-blur-sm bg-opacity-80"
        >
            <div class="flex justify-between">
                <button class="w-8" @click="toggleCart() ">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><title>Close Cart</title><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-9.414l2.828-2.829 1.415 1.415L13.414 12l2.829 2.828-1.415 1.415L12 13.414l-2.828 2.829-1.415-1.415L10.586 12 7.757 9.172l1.415-1.415L12 10.586z"/></svg>
                </button>
                <h3 class="flex-1 p-4 text-center text-xl">Order Items</h3>
            </div>

            <TransitionGroup name="list" tag="div" class="py-4 flex flex-col space-y-2">
                <CartItem v-for="(item, key) of items" :key="key" :item="item"></CartItem>
            </TransitionGroup>

            <div v-if="!items.length" class="px-2 py-8 text-center"> Add a dish to your order </div>

            <NuxtLink
                to="/checkout"
                class="w-full rounded-sm px-4 py-2 bg-primary hover:bg-primary-500 text-light font-semibold text-center"
            >
                Go to checkout: ${{ totalPrice }}
            </NuxtLink>
        </div>
    </Transition>
</template>

<style scoped>
.cart{
    top: 60px;
}

.slide-enter-active {
  animation: slide 0.3s cubic-bezier(1, 0.6, 0.9, 1) reverse;
}
.slide-leave-active {
  animation: slide 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

@keyframes slide {
    0%{
        transform: translate(0);
    }
    100%{
        transform: translate(200px);
    }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

</style>
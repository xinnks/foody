<script setup>
import { storeToRefs } from "pinia";
import { useCartStore } from "~~/store/cart";

const cartStore = useCartStore();
const { showCart } = storeToRefs(cartStore);
const { toggleCart } = cartStore;

function closeCart() {
  if(showCart.value){
    toggleCart()
  }
}
</script>

<template>
  <div class="bg-light flex flex-col min-h-[100vh]">
    <NavigationBar />
    <main class="flex-1 flex flex-col w-full md:max-w-6xl mx-auto relative z-0" @click="closeCart()">
        <slot></slot>
    </main>
    <Cart/>
    <AppFooter/>
  </div>
</template>
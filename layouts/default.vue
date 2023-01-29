<script setup>
import { storeToRefs } from "pinia";
import { useCartStore } from "~~/store/cart";

const cartStore = useCartStore();
const { showCart } = storeToRefs(cartStore);
const { toggleCart } = cartStore;

const main = ref('main')

watch(showCart, (val) => {
  if(val){
    main.value.setAttribute("inert","");
  } else {
    main.value.removeAttribute("inert");
  }
})

function closeCart() {
  if(showCart.value){
    toggleCart()
  }
}
</script>

<template>
  <div class="flex flex-col min-h-[100vh]">
    <NavigationBar />
    <main ref="main" class="flex-1 max-w-6xl mx-auto relative z-0" @click="closeCart()">
        <slot></slot>
    </main>
    <Cart/>
    <AppFooter/>
  </div>
</template>

<style scoped>
[inert]{
  opacity: 0.4;
  user-select: none;
}
</style>
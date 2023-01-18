import { defineStore } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { ref } from 'vue'

export const useCartStore = defineStore('cart',() => {
  const items = ref([]);
  const showCart = ref(false);
  
  const totalPrice = computed(() => items.value.reduce((acc, curr) => acc + (curr.price * curr.count), 0).toFixed(2));

  const dishesCount = computed(() => items.value.reduce((acc, curr) => acc + curr.count, 0));

  // Utility function to help find index of cart items using their ids
  const findItem = (id) => items.value.findIndex(item => item.id === id);

  // Add cart item to list
  function addItem({dish, count}){
    const index = findItem(dish.id);
    if(index !== -1){
      items.value[index].count += count;
    } else {
      items.value.push({...dish, count});
    }
  }

  // Udpate the count of item inside the list
  function updateCount({dish, count}){
    const index = findItem(dish.id);
    if(index !== -1){
      items.value[index].count = count;
    }
  }

  // Remove item from list
  function removeItem(payload){
    const index = findItem(payload.id);
    items.value.pop(index, 1);
  }

  function clearStore(){
    items.value = []
  }

  function toggleCart(){
    showCart.value = !showCart.value;
  }

  return {
    items, totalPrice, addItem, removeItem, dishesCount, showCart, toggleCart, updateCount, clearStore
  }
}, {
  persist: true
})

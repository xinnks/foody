<script setup>
const router = useRouter();
const client = useSupabaseAuthClient();
const user = useSupabaseUser();
const config = useRuntimeConfig();

const adminUser = user.value?.user_metadata.email.includes(config.public.adminDomain)

async function signOut(){
  await client.auth.signOut();
  router.push('/');
}
</script>

<template>
  <nav
    class="px-2 py-3 flex justify-between flex-shrink-0 bg-slate-200 dark:bg-slate-500 sticky top-0 z-10"
  >
    <div class="logo flex justify-around space-x-3 items-center">
      <NuxtLink to="/" class="px-2 text-xl font-semibold text-primary rounded-full">Foody</NuxtLink>
      <NuxtLink to="/dishes" class="px-2 text-xl font-semibold text-primary rounded-full">Dishes</NuxtLink>
    </div>
    <div class="flex justify-around items-center space-x-3">
      <CartButton v-if="!adminUser"></CartButton>
      <button
        v-if="false"
        @click="change()"
        class="p-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M10 7a7 7 0 0 0 12 4.9v.1c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2h.1A6.979 6.979 0 0 0 10 7zm-6 5a8 8 0 0 0 15.062 3.762A9 9 0 0 1 8.238 4.938 7.999 7.999 0 0 0 4 12z"/></svg>
      </button>

      <slot></slot>

      <NuxtLink
        v-if="!user"
        to="/sign-in"
        class="rounded-full px-3 py-1 text-white bg-secondary-700" 
      >
        Log In
      </NuxtLink>
      <NuxtLink
        v-if="!user"
        to="/register"
        class="rounded-full px-3 py-1 text-white bg-secondary-700" 
      >
        Sign Up
      </NuxtLink>
      <NuxtLink
        v-if="user"
        :to="!adminUser ? '/account' : '/admin/'"
        class="rounded-full px-3 py-1 text-white bg-secondary-700" 
      >
        Account
      </NuxtLink>
      <button
        v-if="user"
        @click="signOut()"
        class="rounded-full px-3 py-1 text-white bg-secondary-700"
      >
        Log Out
      </button>
    </div>
  </nav>
</template>

<style>
body {
  background-color: #fff;
  color: rgba(0,0,0,0.8);
}
.dark-mode body {
  background-color: #091a28;
  color: #ebf4f1;
}
.sepia-mode body {
  background-color: #f1e7d0;
  color: #433422;
}
</style>

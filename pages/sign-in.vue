<script setup>
definePageMeta(({
    middleware: 'forms'
}))
const route = useRoute();
const router = useRouter();
const client = useSupabaseAuthClient();
const user = useSupabaseUser();
const config = useRuntimeConfig();
let loading = ref(false);

const { ft: firstTimeAuthentication } = route.query;

const logInCredentials = reactive({
    email: "",
    password: ""
});

async function redirectToDashboard(email){
    if(email?.includes(config.public.adminDomain)) return router.push('/admin/')
    return router.push("/account");
}

// Authenticates users
async function logIn() {
    const {email, password} = logInCredentials;
    if(!email || !password) return;
    loading.value = true;
    const { error } = await client.auth.signInWithPassword({email, password});
    if(!error){
        loading.value = false
        redirectToDashboard(email)
    }
    console.log(error);
}

watchEffect(async () => {
    if(user.value){
        redirectToDashboard(
            logInCredentials.email
            || user.value.email
        )
    }
});

useHead({
    title: 'Log In',
    meta: [
        { name: 'description', content: 'Log in page.' }
    ]
})
</script>

<template>
    <div class="flex flex-col space-y-8 px-2">
        <h1 class="text-center p-2 text-3xl text-secondary">Sign In </h1>

        <section class="flex flex-col rounded-md w-full md:w-[75vw] lg:w-[50vw] pb-4">
            <form
                @submit.prevent="logIn()"
                class="flex flex-col space-y-6 py-8 px-1"
            >
                <div class="flex items-center space-x-2">
                    <label class="w-1/3" for="email">Email </label>
                    <input
                        v-model="logInCredentials.email"
                        id="email"
                        class="flex-1 rounded-full px-3 py-2 outline outline-2 outline-primary-100"
                        type="email"
                    >
                </div>
                <div class="flex items-center space-x-2">
                    <label class="w-1/3" for="password">Password</label>
                    <input
                        v-model="logInCredentials.password"
                        id="password"
                        class="flex-1 rounded-full px-3 py-2 outline outline-2 outline-primary-100"
                        type="password"
                    >
                </div>
                <div class="flex justify-center items-center p-2">
                    <button
                        type="submit"
                        class="py-2 text-center full md:w-1/2 lg:w-1/3 bg-primary text-white rounded-full"
                    >
                        {{ loading ? "loading.." : 'Submit' }}
                    </button>
                </div>

            </form>
        </section>
    </div>
</template>
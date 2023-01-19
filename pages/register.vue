<script setup>
definePageMeta(({
    middleware: 'forms'
}))
const client = useSupabaseAuthClient();
const config = useRuntimeConfig();

// Decide what authentication form to display
const registrationCredentials = reactive({
    email: '',
    password: '',
    passwordRepeat: '',
    fullName: '',
    phoneNumber: ''
});

// Registers new users
async function register() {
    const {
        email, password, passwordRepeat, fullName, phoneNumber
    } = registrationCredentials;
    if(password !== passwordRepeat) return alert("Passwords do not match!");
    const { error } = await client.auth.signUp({
        email, password,
        options: {
            emailRedirectTo: config.public.firstTimeLoginPageLink,
            data: {full_name: fullName, phone: phoneNumber, email}
        }
    })
    if (error) {
        return alert('Something went wrong !');
    } else {
        // notify user to open their email and validate their account
        alert("Open the email we sent you to verify your account!")
    }
}

useHead({
    title: 'Register',
    meta: [
        { name: 'description', content:'Registration page.' }
    ]
})
</script>

<template>
    <div class="flex flex-col space-y-8 px-2">
        <h1 class="text-center p-2 text-3xl text-secondary">Sign Up </h1>

        <section class="flex flex-col rounded-md w-full md:w-[75vw] lg:w-[50vw] pb-4">

            <form
                @submit.prevent="register()"
                class="flex flex-col space-y-6 py-4 px-1"
            >
                <div class="flex items-center space-x-2">
                    <label class="w-1/3" for="full-name">Full Name</label>
                    <input
                        v-model="registrationCredentials.fullName"
                        id="full-name"
                        class="flex-1 rounded-full px-3 py-2 outline outline-2 outline-primary-100"
                        type="text"
                    >
                </div>
                <div class="flex items-center space-x-2">
                    <label class="w-1/3" for="email">Email</label>
                    <input
                        v-model="registrationCredentials.email"
                        id="email"
                        class="flex-1 rounded-full px-3 py-2 outline outline-2 outline-primary-100"
                        type="email"
                    >
                </div>
                <div class="flex items-center space-x-2">
                    <label class="w-1/3" for="phone-number">Phone Number</label>
                    <input
                        v-model="registrationCredentials.phoneNumber"
                        id="phone-number"
                        class="flex-1 rounded-full px-3 py-2 outline outline-2 outline-primary-100"
                        type="tel"
                    >
                </div>
                <div class="flex items-center space-x-2">
                    <label class="w-1/3" for="password">Password</label>
                    <input
                        v-model="registrationCredentials.password"
                        id="password"
                        class="flex-1 rounded-full px-3 py-2 outline outline-2 outline-primary-100"
                        type="password"
                    >
                </div>
                <div class="flex items-center space-x-2">
                    <label class="w-1/3" for="password-repeat">Repeat Password</label>
                    <input
                        v-model="registrationCredentials.passwordRepeat"
                        id="password-repeat"
                        class="flex-1 rounded-full px-3 py-2 outline outline-2 outline-primary-100"
                        type="password"
                    >
                </div>
                <div class="flex justify-center items-center p-2">
                    <button
                        type="submit"
                        class="p-2 text-center md:w-1/2 lg:w-1/3 bg-primary text-white rounded-full"
                    >
                        Register
                    </button>
                </div>

            </form>
        </section>
    </div>
</template>
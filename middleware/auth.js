export default defineNuxtRouteMiddleware((to, _from) => {
    const user = useSupabaseUser()
    const config = useRuntimeConfig();

    // redirect unauthenticated users to login page
    if(!user.value) {
        return navigateTo(config.public.loginPageLink)
    }

    // redirect admin users to admin dashboard
    if(user.value?.user_metadata.email.includes(config.adminDomain)){
        return navigateTo('/admin/')
    }
})
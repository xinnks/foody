export default defineNuxtRouteMiddleware((to, _from) => {
    const user = useSupabaseUser();
    const config = useRuntimeConfig();

    console.log({user})

    // redirect authenticated users to their respective dashboards
    if(user.value){
        if(user.value.email.includes(config.adminDomain)){
            return navigateTo('/admin/')
        }
        return navigateTo('/account')
    }
})
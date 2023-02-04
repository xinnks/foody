// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      titleTemplate: '%s - Foody',
      charset: 'utf-8',
      viewport: 'width=500, initial-scale=1',
      meta: [
        { name: 'description', content: 'Eat the food you deserve.' }
      ]
    }
  },
  runtimeConfig: {
    novuApiKey: '',
    public: {
      loginPageLink: '',
      firstTimeLoginPageLink: '',
      novuApiIdentifier: '',
      passwordResetLink: '',
      adminDomain: '',
      optOutLink: '',
      feedbackUrl: ''
    },
  },
  modules: [
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/supabase'
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})

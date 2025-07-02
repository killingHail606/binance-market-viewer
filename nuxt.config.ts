import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  ssr: false,

  app: {
    head: {
      title: 'Binance Market Viewer',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }, { charset: 'utf-8' }],
    },
  },

  modules: ['@nuxt/eslint', '@nuxt/icon', '@nuxt/image', '@nuxt/ui', '@pinia/nuxt', '@vueuse/nuxt'],

  css: ['~/assets/css/main.css', '~/assets/scss/main.scss', 'vue-virtual-scroller/dist/vue-virtual-scroller.css'],

  vite: {
    plugins: [tailwindcss()],
  },
})

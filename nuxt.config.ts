import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ['vuetify'],
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    '@pinia/nuxt', 
    'pinia-plugin-persistedstate/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@nuxtjs/google-fonts'
  ],
  googleFonts: {
    families: {
      Montserrat: [500],
    },
    display: 'swap'
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  css: [
    "~/assets/style/main.scss",
  ],
  ssr: false,
})
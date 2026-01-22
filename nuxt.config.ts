import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
    build: {
        transpile: ['vuetify', '@pinia/nuxt'],
    },
    vite: {
        plugins: [
            // @ts-expect-error
            vuetify({ autoImport: true }),
        ],
        vue: {
            template: {
                transformAssetUrls,
            },
        },
    },
})

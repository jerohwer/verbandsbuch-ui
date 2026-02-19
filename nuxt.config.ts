import vuetify, {transformAssetUrls} from 'vite-plugin-vuetify'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    runtimeConfig: {
        public: {
            msExternalBaseUrl: "",
            isDev: false,
            devUserIndex: 0
        },
        msInternalBaseUrl: ""
    },

    build: {
        transpile: ['vuetify', '@pinia/nuxt'],
    },
    vite: {
        plugins: [
            vuetify({autoImport: true}),
        ],
        vue: {
            template: {
                transformAssetUrls,
            },
        },
    },

    modules: ['nuxt-auth-utils', '@pinia/nuxt'],
})
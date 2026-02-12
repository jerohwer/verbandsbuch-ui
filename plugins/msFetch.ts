// https://nuxt.com/docs/4.x/guide/recipes/custom-usefetch
// https://github.com/atinux/nuxt-auth-utils


export default defineNuxtPlugin((nuxtApp) => {
    const {session} = useUserSession()
    const config = useRuntimeConfig();

    const msFetch = $fetch.create({
        baseURL: import.meta.server ? config.msInternalBaseUrl : config.public.msExternalBaseUrl,
        onRequest({request, options, error}) {
            if (session.value?.token) {
                options.headers.set('Authorization', `Bearer ${session.value?.token}`)
            }
        },
        async onResponseError({response, request}) {
            console.error(`[ERROR] route: ${request} error: ${response}`)
        },
    })

    return {
        provide: {
            msFetch,
        },
    }
})

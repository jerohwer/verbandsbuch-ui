import {NoAuthError} from "#shared/errors/no-auth.error";

export default defineNitroPlugin((nuxt) => {
    sessionHooks.hook('fetch', async (session, event) => {
        // TODO : Authentifizeruugn refreshen. https://nuxt.com/modules/auth-utils#extend-session
    })
})
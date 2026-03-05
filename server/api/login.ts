import {setUserSession} from "#imports";
import type {User} from "#auth-utils";

export default defineEventHandler(async (event) => {
    const {email, password} = await readBody(event)
    const config = useRuntimeConfig();

    let result: {
        message: string,
        user: User,
        token: string
    } | undefined = undefined;

    if (config.public.isDev) {
        const fs = await import('fs');
        const path = await import('path');
        const jsonFilePath = path.join(process.cwd(), 'devUser.json');
        const devUsers = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
        result = {
            user: devUsers[config.public.devUserIndex],
            token: "dev-token-1234",
            message: ""
        }
    } else {
        result = await $fetch<{
            user: User,
            token: string,
            message: string
        }>(`${config.msInternalBaseUrl}/auth/login`, {
            method: "POST",
            body: {
                email,
                password
            }
        })
    }

    if (result) {
        await setUserSession(event, result, {
            maxAge: 60 * 60
        })
        console.info(`[INFO] /api/login - User ${result.user.id} authentifiziert`)
    }

})

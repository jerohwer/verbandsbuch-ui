import {NoAuthError} from "#shared/errors/no-auth.error";

export default async function validateUser() {
    const {fetch, session} = useUserSession();
    await fetch();
    console.log("User: ", session.value?.token)
    if (!session.value?.user) throw createError(new NoAuthError())
}
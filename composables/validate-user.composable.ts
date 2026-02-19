import {NoAuthError} from "#shared/errors/no-auth.error";

export default async function validateUser() {
    const {fetch, session} = useUserSession();
    await fetch();

    if (!session.value?.user) throw createError(new NoAuthError())
}
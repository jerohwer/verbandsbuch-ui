import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack';
import { useRuntimeConfig } from "#imports";

export function useMsFetch() {
    const config = useRuntimeConfig();

    async function $msFetch<T>(url: NitroFetchRequest, fetchOptions?: NitroFetchOptions<NitroFetchRequest>) {
        // eslint-disable-next-line no-undef
        try {
            const response = await $fetch<T>(url, {
                baseURL: config.public.msBaseUrl,
                ...fetchOptions,
            });
            return response
        }
        catch(error) {
            return "Error response"
        }
    }


    return { $msFetch };
}


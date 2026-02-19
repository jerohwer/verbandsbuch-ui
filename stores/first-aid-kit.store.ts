import validateUser from "~/composables/validate-user.composable";
import {type FirstAidKit, FirstAidKitSchema} from "#shared/schemas/first-aid-kit.schema";
import {type Product, ProductSchema} from "#shared/schemas/product.schema";

export const useFirstAidKitStore = defineStore('first-aid-kit-store', {
    state: () => ({
        _route: '/firstAidKit',
        _productRoute: '/product',
        _firstAidKits: [] as FirstAidKit[],
        _currentFirstAidKitProducts: [] as Product[]
    }),
    actions: {
        async getAllFirstAidKits(): Promise<void> {
            await validateUser();
            const {$msFetch} = useNuxtApp();

            const result = await $msFetch(`${this._route}/`)
            const parsedData = FirstAidKitSchema.array().safeParse(result)

            if (!parsedData.success) throw createError(parsedData.error)

            this._firstAidKits = parsedData.data
        },
        async getAllAvailableProductsOfFirstAidKit(id: string): Promise<void> {
            await validateUser();
            const {$msFetch} = useNuxtApp();

            const result = await $msFetch(`${this._productRoute}/1b2f781b-90db-40d3-89da-f42653ed838e`)
            const parsedData = ProductSchema.array().safeParse(result)

            if (!parsedData.success) throw createError(parsedData.error)

            this._currentFirstAidKitProducts = parsedData.data
        }
    },
    getters: {
        firstAidKits: (state) => state._firstAidKits,
        currentFirstAidKitProducts: (state) => state._currentFirstAidKitProducts
    },
})
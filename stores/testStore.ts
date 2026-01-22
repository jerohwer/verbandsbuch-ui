// stores/counter.ts
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
    // state ist die "Quelle der Wahrheit"
    state: () => ({
        count: 0,
        name: 'Eduard Edeka',
    }),
    // getters sind wie berechnete Eigenschaften für deinen Store
    getters: {
        doubleCount: (state) => state.count * 2,
        greeting: (state) => `Hallo, mein Name ist ${state.name}!`,
    },
    // actions sind Methoden, die deinen State ändern können (auch asynchron)
    actions: {
        increment() {
            this.count++
        },
        decrement() {
            this.count--
        },
        reset() {
            this.count = 0
        },
    },
})
// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import {aliases, mdi} from 'vuetify/iconsets/mdi'
import {createRulesPlugin} from 'vuetify/labs/rules'

export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        icons: {
            defaultSet: 'mdi',
            aliases,
            sets: {
                mdi,
            },
        },
        ssr: true
    })

    app.vueApp.use(createRulesPlugin({
        aliases: {
            required: (err = 'Dieses Feld ist erforderlich') => v => !!v || err,
            email: (err = 'Bitte geben Sie eine valide E-Mail an.') => v => new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').test(v) || err,
        }
    }, vuetify.locale))

    app.vueApp.use(vuetify)
})

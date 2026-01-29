<template>
  <v-container
      :width="$vuetify.display.mdAndDown ? '80%' : '50%'"
      class="d-flex align-center flex-column pa-6"
  >
    <v-img src="/bbz-logo.png" width="50%"/>
    <p class="text-lg-h3 text-md-h4 text-h5 pt-6 pb-2 text-center">Willkommen auf dem Verbandsbuch des BBZ</p>
    <p class="text-body-1 pb-6 text-center">
      Bitte melden Sie sich mit Ihren Zugangsdaten an, um fortzufahren.<br>
    </p>
    <v-form
        v-model="form"
        @submit.prevent="login"
        style="width: 100%"
    >
      <v-col>
        <v-row>
          <v-text-field
              v-model="credentials.email"
              label="E-mail"
              :rules="[rules.required()]"
          ></v-text-field>
        </v-row>
        <v-row>
          <v-text-field
              v-model="credentials.password"
              label="Passwort"
              :rules="[rules.required()]"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
          ></v-text-field>
        </v-row>
        <v-row>
          <v-btn type="Submit" class="ml-auto">Anmelden</v-btn>
        </v-row>
      </v-col>
    </v-form>
  </v-container>
</template>
<script setup lang="ts">
import {useRules} from 'vuetify/labs/rules'

const {fetch: refreshSession} = useUserSession()
const form = ref(false)
const showPassword = ref<boolean>(false);
const rules = useRules()
const credentials = reactive({
  email: '',
  password: '',
})

async function login() {
  if (!form.value) return
  try {
    await $fetch('/api/login', {
      method: 'POST',
      body: credentials,
    })

    await refreshSession()
    await navigateTo('/')
  } catch {
    alert('Bad credentials')
  }
}

function required(v) {
  return !!v || 'Field is required'
}
</script>


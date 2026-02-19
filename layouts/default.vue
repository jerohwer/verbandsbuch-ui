<template>
  <v-layout>
    <v-navigation-drawer
        v-model="isDrawerOpen"
        temporary
    >
      <v-list>
        <v-list-item to="/">Verbandsbuch</v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="isDrawerOpen = !isDrawerOpen"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title @click="$router.push('/')">Verbandsbuch</v-app-bar-title>
      <v-btn variant="text" class="ml-auto mr-4 justify-end" max-width="40%">
        <p class="user-name">{{ user?.name }}</p>
        <v-menu activator="parent">
          <v-list>
            <v-list-item @click="logout()">Logout</v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </v-app-bar>


    <v-main>
      <v-container>
        <v-sheet rounded="lg" elevation="4" class="pa-4">
          <slot/>
        </v-sheet>
      </v-container>
    </v-main>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="4000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-layout>
</template>
<script setup lang="ts">
import {useSnackBar, useUserSession} from "#imports";

const isDrawerOpen = ref<boolean>(false);
const {user, clear} = useUserSession();
const {snackbar} = useSnackBar()

async function logout() {
  await clear();
  navigateTo('/login');
}
</script>
<style>

.v-application__wrap {
  min-height: unset !important;
}

.user-name {
  text-wrap: auto;
  font-size: clamp(0.7rem, 2vw, 1rem);
}
</style>

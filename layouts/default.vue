<template>
  <v-layout>
    <v-navigation-drawer
        v-model="isDrawerOpen"
        temporary
    >
      <v-list>
        <v-list-item to="/">Verbandsbuch</v-list-item>
        <v-list-item to="/formular">Verbandsbuch-Formular</v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="isDrawerOpen = !isDrawerOpen"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title @click="$router.push('/')">Verbandsbuch</v-app-bar-title>
      <template v-slot:append>
        <v-btn variant="text" class="mr-2">{{ user?.name }}
          <v-menu activator="parent">
            <v-list>
              <v-list-item @click="logout()">Logout</v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </template>
    </v-app-bar>


    <v-main>
      <v-container>
        <v-sheet rounded="lg" elevation="4">
          <slot/>
        </v-sheet>
      </v-container>
    </v-main>
  </v-layout>
</template>
<script setup lang="ts">
import {useUserSession} from "#imports";

const isDrawerOpen = ref<boolean>(false);
const {user, clear} = useUserSession();

async function logout() {
  await clear();
  navigateTo('/login');
}
</script>
<style>
.v-main {
  padding-top: 64px !important;
}
</style>

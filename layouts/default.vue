<template>
  <v-layout>
    <v-app-bar>
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="isDrawerOpen = !isDrawerOpen"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title @click="$router.push('/')">Verbandsbuch</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer
        v-model="isDrawerOpen"
        temporary
    >
      <v-list>
        <v-list-item to="/">Verbandsbuch</v-list-item>
        <v-list-item to="/info">Info</v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <v-sheet rounded="lg">
          <slot/>
        </v-sheet>
      </v-container>
    </v-main>
  </v-layout>
</template>
<script setup lang="ts">
const isDrawerOpen = ref<boolean>(false);
</script>

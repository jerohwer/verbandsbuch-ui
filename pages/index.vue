<template>
  <div v-if="!loading && accidentReportStore.accidentReports.length === 0" class="d-flex align-center flex-column">
    <p class="text-body-1 text-sm-body-2 text-center pb-2">
      Es wurden bisher keine Verbandsbucheinträge erstellt. Bitte legen Sie einen neuen Eintrag an.
    </p>
    <v-btn to="/formular/new" color="primary">Verbandsbucheintrag erstellen</v-btn>
  </div>
  <div v-else>
    <v-text-field
        label="Suche"></v-text-field>
    <v-data-table :loading="loading" :items="accidentReportStore.accidentReports" :headers="headers">
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
      </template>
    </v-data-table>
  </div>
</template>
<script lang="ts" setup>
import {useAccidentReportStore} from "~/stores/accident-report.store";

definePageMeta({
  middleware: ['authenticated'],
})
const accidentReportStore = useAccidentReportStore()
const loading = ref<boolean>(true)
const headers = [
  {
    key: 'user.name',
    title: "Ersteller"
  },
  {
    key: "occurredAt",
    title: "Unfalldatum"
  },
  {
    key: "kit.location",
    title: "Verbandskasten"
  }
]

onMounted(async () => {
  loading.value = true
  await accidentReportStore.getAllAccidentReportsForUser()
  loading.value = false
})
</script>
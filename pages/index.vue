<template>
  <div>
    {{ accidentReportStore.accidentReports }}
  </div>
</template>
<script lang="ts" setup>
import {useAccidentReportStore} from "~/stores/accident-report.store";

definePageMeta({
  middleware: ['authenticated'],
})
const accidentReportStore = useAccidentReportStore()

onMounted(() => {
  accidentReportStore.getAllAccidentReportsForUser()
})
</script>
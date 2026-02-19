<template>
  <v-container class="py-4" style="max-width: 900px;">
    <v-card rounded="xl" elevation="2">
      <v-card-title class="text-h6">Verbandsbuch – Eintrag</v-card-title>
      <v-card-subtitle class="text-body-2">
        Felder mit <b>*</b> sind Pflichtfelder.
      </v-card-subtitle>

      <v-divider class="my-2"/>

      <v-card-text>
        <v-form
            ref="formRef"
            v-model="formValid"
            @submit.prevent="submit"
        >
          <v-row>
            <!-- Datum und Uhrzeit -->
            <v-col cols="12">
              <v-text-field
                  v-model="occurredAt"
                  type="datetime-local"
                  label="Datum und Uhrzeit *"
                  :rules="[rules.required()]"
                  hint="Bitte Datum und Uhrzeit des Vorfalls eintragen."
                  persistent-hint
                  density="comfortable"
              />
            </v-col>

            <!-- Hergang -->
            <v-col cols="12">
              <v-textarea
                  v-model="report.description"
                  label="Hergang *"
                  :rules="[rules.required()]"
                  auto-grow
                  rows="4"
                  hint="Kurz schildern: Was ist passiert? (wer/was/wo/wie)"
                  persistent-hint
                  density="comfortable"
              />
            </v-col>

            <!-- Art und Umfang -->
            <v-col cols="12">
              <v-text-field
                  v-model="report.incident"
                  label="Art und Umfang der Verletzung / Erkrankung *"
                  :rules="[rules.required()]"
                  hint="z.B. Schnittwunde (ca. 2 cm), Schwindel, Verbrennung Grad 1…"
                  persistent-hint
                  density="comfortable"
              />
            </v-col>

            <!-- Erste-Hilfe-Maßnahme -->
            <v-col cols="12">
              <v-text-field
                  v-model="report.measures"
                  label="Art und Weise der Erste-Hilfe-Maßnahme *"
                  :rules="[rules.required()]"
                  hint="z.B. Wunde gereinigt, desinfiziert, Verband angelegt…"
                  persistent-hint
                  density="comfortable"
              />
            </v-col>

            <!-- Ersthelfer -->
            <v-col cols="12">
              <v-text-field
                  v-model="report.firstAider"
                  label="Name des Ersthelfers / Ersthelferin *"
                  :rules="[rules.required()]"
                  hint="Vor- und Nachname der Person, die geholfen hat."
                  persistent-hint
                  density="comfortable"
              />
            </v-col>

            <!-- Verbandskasten (Freitext) -->
            <v-col cols="12">
              <v-autocomplete
                  v-model="report.kit"
                  label="Verbandskasten (Raum/Ort) *"
                  :rules="[rules.required()]"
                  :items="firstAidKitStore.firstAidKits"
                  no-data-text="Keinen Eintrag gefunden"
                  item-title="location"
                  hint="Bitte angeben, wo der Verbandskasten steht (z.B. Raum 203)."
                  persistent-hint
                  return-object
                  density="comfortable"
              />
            </v-col>

            <!-- Material-Liste -->
            <v-col cols="12">
              <v-autocomplete
                  v-if="report.kit"
                  v-model="report.materialList"
                  :items="materialOptions"
                  item-title="type"
                  label="Material-Liste (Mehrfachauswahl)"
                  multiple
                  chips
                  clearable
                  hint="Wähle die entnommenen Materialien aus. Danach Anzahl je Material eintragen."
                  persistent-hint
                  return-object
                  density="comfortable"
              />
            </v-col>

            <!-- Mengen je Material -->
            <v-col cols="12" v-if="report.materialList.length">
              <v-card variant="tonal" rounded="xl">
                <v-card-title class="text-subtitle-1">
                  Entnommenes Material – Mengen
                </v-card-title>
                <v-card-text class="pt-0">
                  <v-row dense>
                    <v-col cols="12" v-for="item in report.materialList" :key="item.type">
                      <v-text-field
                          v-model.number="item.quantity"
                          type="number"
                          min="0"
                          step="1"
                          :label="`${item.type} – Anzahl`"
                          hint="Anzahl der entnommenen Stücke/Einheiten."
                          persistent-hint
                          density="comfortable"
                      />
                    </v-col>
                  </v-row>

                  <v-divider class="my-3"/>

                  <div class="text-subtitle-2 mb-2">
                    Nachricht an Gesundheitsbeauftragten (Vorschau)
                  </div>
                  <v-textarea
                      :model-value="internalMaterialMessage"
                      readonly
                      auto-grow
                      rows="3"
                      density="comfortable"
                  />
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Zeuge -->
            <v-col cols="12">
              <v-text-field
                  v-model="report.witness"
                  label="Zeuge (optional)"
                  hint="Falls vorhanden: Name des Zeugen / der Zeugin."
                  persistent-hint
                  density="comfortable"
              />
            </v-col>

            <!-- Button -->
            <v-col cols="12" class="d-flex justify-end">
              <v-btn type="submit" color="primary">
                Speichern
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import type {AccidentReport} from "#shared/schemas/accident-report.schema";

definePageMeta({
  middleware: ['authenticated'],
})

import {computed, reactive, ref, watch} from 'vue'
import {useTheme} from 'vuetify'
import {useRules} from "vuetify/labs/rules";
import {useSnackBar} from "#imports";

const route = useRoute()
const rules = useRules();
const accidentReportId = computed<string>(() => route.params.id as string)
const isEditing = computed<boolean>(() => accidentReportId.value === "nem")
const accidentReportStore = useAccidentReportStore()
const firstAidKitStore = useFirstAidKitStore()
const occurredAt = ref<string>("")
const report = ref<AccidentReport>({
  materialList: [] as { type: string, quantity: number }[]
} as AccidentReport)


onMounted(async () => {
  await firstAidKitStore.getAllFirstAidKits()
  if (isEditing.value) {
    report.value = await accidentReportStore.getAccidentReportById(accidentReportId.value)
    occurredAt.value = toDateString(report.value.occurredAt)
  } else {
    occurredAt.value = toDateString(new Date())
  }
})


const formRef = ref<any>(null)
const formValid = ref(false)


const materialOptions = [
  {type: 'Pflasterstrips', quantity: 1},
  {type: 'Wundpflaster (groß)', quantity: 1},
  {type: 'Sterile Kompresse', quantity: 1},
  {type: 'Mullbinde', quantity: 1},
  {type: 'Elastische Binde', quantity: 1},
  {type: 'Dreiecktuch', quantity: 1},
  {type: 'Einmalhandschuhe', quantity: 1},
  {type: 'Desinfektionstuch', quantity: 1},
  {type: 'Kühlkompresse', quantity: 1},
  {type: 'Schere', quantity: 1}
];

// const selectedMaterials = ref<{
//   type: string,
//   quantity: number
// }[]>([])


function toDateString(date: Date) {
  return date.toISOString().slice(0, 16);
}

function formatDatetimeGerman(dt: string) {
  if (!dt) return '—'
  const [datePart, timePart] = dt.split('T')
  if (!datePart || !timePart) return dt

  const [y, m, d] = datePart.split('-')
  const hhmm = timePart.slice(0, 5)
  if (!y || !m || !d) return dt

  return `${d}.${m}.${y}, ${hhmm} Uhr`
}

const internalMaterialMessage = computed(() => {
  if (!report.value.materialList.length) return '—'

  const lines = report.value.materialList.map((material) => {
    return `- ${material.type}: ${material.quantity}`
  })

  return [
    'Materialentnahme aus Verbandskasten:',
    `Verbandskasten (Raum): ${report.value.kit.location || '—'}`,
    `Datum/Uhrzeit: ${formatDatetimeGerman(occurredAt.value)}`,
    '',
    ...lines,
  ].join('\n')
})

async function submit() {
  const ok = await formRef.value?.validate?.()
  if (!ok?.valid) return

  report.value.message = internalMaterialMessage.value
  report.value.occurredAt = new Date(occurredAt.value)

  if (isEditing.value) {
    await accidentReportStore.updateReport(report.value)
  } else {
    await accidentReportStore.saveAccidentReport(report.value)
  }
}

</script>

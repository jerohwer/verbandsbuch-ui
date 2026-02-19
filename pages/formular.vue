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
            validate-on="submit"
            @submit.prevent="submit"
        >
          <v-row dense>
            <!-- Datum und Uhrzeit -->
            <v-col cols="12">
              <v-text-field
                  v-model="model.datetime"
                  type="datetime-local"
                  label="Datum und Uhrzeit *"
                  :rules="[rules.required]"
                  hint="Bitte Datum und Uhrzeit des Vorfalls eintragen."
                  persistent-hint
                  density="comfortable"
              />
            </v-col>

            <!-- Ort -->
            <v-col cols="12">
              <v-text-field
                  v-model="model.place"
                  label="Ort (Raum / Flur) *"
                  :rules="[rules.required]"
                  hint="z.B. Raum 1.12, Flur EG, Werkstatt…"
                  persistent-hint
                  density="comfortable"
              />
            </v-col>

            <!-- Hergang -->
            <v-col cols="12">
              <v-textarea
                  v-model="model.cause"
                  label="Hergang *"
                  :rules="[rules.required]"
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
                  v-model="model.injury"
                  label="Art und Umfang der Verletzung / Erkrankung *"
                  :rules="[rules.required]"
                  hint="z.B. Schnittwunde (ca. 2 cm), Schwindel, Verbrennung Grad 1…"
                  persistent-hint
                  density="comfortable"
              />
            </v-col>

            <!-- Erste-Hilfe-Maßnahme -->
            <v-col cols="12">
              <v-text-field
                  v-model="model.firstAid"
                  label="Art und Weise der Erste-Hilfe-Maßnahme *"
                  :rules="[rules.required]"
                  hint="z.B. Wunde gereinigt, desinfiziert, Verband angelegt…"
                  persistent-hint
                  density="comfortable"
              />
            </v-col>

            <!-- Ersthelfer -->
            <v-col cols="12">
              <v-text-field
                  v-model="model.helper"
                  label="Name des Ersthelfers / Ersthelferin *"
                  :rules="[rules.required]"
                  hint="Vor- und Nachname der Person, die geholfen hat."
                  persistent-hint
                  density="comfortable"
              />
            </v-col>

            <!-- Verbandskasten (Freitext) -->
            <v-col cols="12">
              <v-text-field
                  v-model="model.kit"
                  label="Verbandskasten (Raum/Ort) *"
                  :rules="[rules.required]"
                  hint="Bitte angeben, wo der Verbandskasten steht (z.B. Raum 203)."
                  persistent-hint
                  density="comfortable"
              />
            </v-col>

            <!-- Material-Liste -->
            <v-col cols="12">
              <v-autocomplete
                  v-model="selectedMaterials"
                  :items="materials"
                  label="Material-Liste (Mehrfachauswahl)"
                  multiple
                  chips
                  clearable
                  hint="Wähle die entnommenen Materialien aus. Danach Anzahl je Material eintragen."
                  persistent-hint
                  density="comfortable"
              />
            </v-col>

            <!-- Mengen je Material -->
            <v-col cols="12" v-if="selectedMaterials.length">
              <v-card variant="tonal" rounded="xl">
                <v-card-title class="text-subtitle-1">
                  Entnommenes Material – Mengen
                </v-card-title>
                <v-card-text class="pt-0">
                  <v-row dense>
                    <v-col cols="12" v-for="name in selectedMaterials" :key="name">
                      <v-text-field
                          v-model.number="materialQty[name]"
                          type="number"
                          min="0"
                          step="1"
                          :label="`${name} – Anzahl`"
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
                      :model-value="healthMessage"
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
                  v-model="model.witness"
                  label="Zeuge (optional)"
                  hint="Falls vorhanden: Name des Zeugen / der Zeugin."
                  persistent-hint
                  density="comfortable"
              />
            </v-col>

            <!-- Button -->
            <v-col cols="12" class="d-flex justify-end">
              <v-btn color="primary" type="submit" :disabled="!formValid">
                Speichern
              </v-btn>
            </v-col>
          </v-row>
        </v-form>

        <v-snackbar v-model="snackbar" timeout="2500">
          Eintrag validiert – (Demo) in Konsole ausgegeben.
        </v-snackbar>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import {useRules} from "vuetify/labs/rules";

definePageMeta({
  middleware: ['authenticated'],
})
import {computed, reactive, ref, watch} from "vue";

const formRef = ref<any>(null);
const formValid = ref(false);
const snackbar = ref(false);
const rules = useRules()

const materials = [
  "Pflasterstrips",
  "Wundpflaster (groß)",
  "Sterile Kompresse",
  "Mullbinde",
  "Elastische Binde",
  "Dreiecktuch",
  "Einmalhandschuhe",
  "Desinfektionstuch",
  "Kühlkompresse",
  "Schere",
];

const model = reactive({
  datetime: "",
  place: "",
  cause: "",
  injury: "",
  firstAid: "",
  helper: "",
  kit: "", // Freitext (Raum/Ort)
  witness: "",
});

// Multiselect + Mengen
const selectedMaterials = ref<string[]>([]);
const materialQty = reactive<Record<string, number>>({});

watch(selectedMaterials, (newVal) => {
  for (const name of newVal) {
    if (materialQty[name] === undefined) materialQty[name] = 1;
  }
  for (const key of Object.keys(materialQty)) {
    if (!newVal.includes(key)) delete materialQty[key];
  }
});

function formatDatetimeGerman(dt: string) {
  if (!dt) return "—";
  // erwartet: "YYYY-MM-DDTHH:mm"
  const [datePart, timePart] = dt.split("T");
  if (!datePart || !timePart) return dt;

  const [y, m, d] = datePart.split("-");
  const hhmm = timePart.slice(0, 5); // "HH:mm"
  if (!y || !m || !d) return dt;

  return `${d}.${m}.${y}, ${hhmm} Uhr`;
}

const healthMessage = computed(() => {
  if (!selectedMaterials.value.length) return "—";

  const lines = selectedMaterials.value.map((name) => {
    const qty = materialQty[name] ?? 0;
    return `- ${name}: ${qty}`;
  });

  return [
    "Materialentnahme aus Verbandskasten:",
    `Verbandskasten (Raum): ${model.kit || "—"}`,
    `Datum/Uhrzeit: ${formatDatetimeGerman(model.datetime)}`,
    "",
    ...lines,
  ].join("\n");
});

async function submit() {
  const ok = await formRef.value?.validate?.();
  if (!ok?.valid) return;

  const payload = {
    ...model,
    materials: selectedMaterials.value.map((name) => ({
      name,
      qty: materialQty[name] ?? 0,
    })),
    healthMessage: healthMessage.value,
  };

  console.log("Verbandsbuch Payload:", payload);
  snackbar.value = true;
}
</script>

<style scoped>
.v-card-title {
  padding-bottom: 0;
}
</style>

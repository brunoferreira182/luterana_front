<template>
  <q-dialog :model-value="props.open" @hide="closeDialog">
    <q-card style="width: 600px;height: 750px;">
      <q-card-section class="text-h6 text-center">
        Informações sobre os cultos:
      </q-card-section>
      <q-separator/>
      <q-card-section class="q-mt-sm">
        <div>
          <strong>
            Frequência:
          </strong>
        </div>
        <q-select
          class="q-mt-md"
          outlined
          v-model="data.selectedOption"
          :options="selectOptions"
          label="Frequência"
        />
      </q-card-section>
      <q-card-section class="q-mt-sm" v-if="data.selectedOption">
        <div>
          <strong>
            Marque os dias da semana que irão ocorrer os cultos:
          </strong>
        </div>
        <div class="text-center">
          <q-date
            mask="DD/MM/YYYY"
            class="q-mt-md"
            multiple
            minimal
            v-model="data.date"
            landscape
          />
        </div>
      </q-card-section>
      <q-card-section class="q-mt-sm" v-if="data.date">
        <div>
          <strong>
            Informe o horário dos cultos:
          </strong>
        </div>
        <q-input
          type="time"
          class="q-mt-md"
          label="Horário dos cultos"
          outlined
          v-model="data.time"
        />
      </q-card-section>
      <q-card-actions align="center" v-if="data.time">
        <q-btn
          flat
          label="depois"
          color="primary"
          rounded
          @click="closeDialog"
        />
        <q-btn
          rounded
          color="primary"
          label="confirmar"
          unelevated
          @click="confirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
const data = ref({
  step: 'frequency',
  selectedOption: null,
  time: null,
  date: null
})
const selectOptions = [ 'Semanal','2x Semana', 'Quinzenal', 'Mensal']
const props = defineProps(['open', 'edit'])
const emits = defineEmits(['closeDialog', 'addServicesData'])

function confirm() {
  emits('addServicesData', data.value.selectedOption, data.value.date, data.value.time)
  data.value.step = 'frequency'
  data.value.selectedOption = null
  data.value.date = null
  data.value.time = null
}
function closeDialog() {
  emits('closeDialog')
}
</script>

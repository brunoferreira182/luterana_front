<template>
  <q-dialog :model-value="props.open" @hide="closeDialog">
    <q-card style="width: 600px;height: 550px;">
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
            Informe os dias da semana que irão ocorrer os cultos:
          </strong>
        </div>
        <div v-if="data.selectedOption === '4x semana'">
          
        </div>
        <!-- <div class="text-center">
          <q-input
            class="q-mt-md"
            label="Dias da semana"
            outlined
            v-model="data.date"
          />
        </div> -->
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
import { ref, watchEffect } from 'vue'

const data = ref({
  step: 'frequency',
  selectedOption: null,
  time: null,
  date: null
})

const selectOptions = ['4x semana', '3x semana', '2x semana', '1x semana', '4x mês', '3x mês', '2x mês', '1x mês']
// const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
const props = defineProps(['open', 'action', 'editData'])
const emits = defineEmits(['closeDialog', 'addServicesData'])

watchEffect(() => {
  if (props.action === 'edit') {
    data.value.selectedOption = props.editData.frequency;
    data.value.time = props.editData.time;
    data.value.date = props.editData.days;
  }
})

function confirm() {
  emits('addServicesData', data.value.selectedOption, data.value.date, data.value.time, props.action)
  data.value.step = 'frequency'
  data.value.selectedOption = null
  data.value.date = null
  data.value.time = null
}

function closeDialog() {
  emits('closeDialog')
}
</script>

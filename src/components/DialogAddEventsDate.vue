<template>
  <q-dialog :model-value="props.open" @hide="closeDialog">
    <q-carousel
      v-model="data.step"
      transition-prev="scale"
      transition-next="scale"
      swipeable
      animated
      control-color="primary"
    >
      <q-carousel-slide name="frequency" class="column no-wrap flex-center">
        <div>
          <div>
            Selecione a frequência do culto
          </div>
          <q-select
            v-model="data.selectedOption"
            :options="selectOptions"
            label="Frequência"
          />
          <q-btn
            class="full-width"
            color="primary"
            label="Próximo"
            @click="clkNext1"
            :loading="btnNextLoading"
            unelevated
            no-caps
          />
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="dayOption" class="column no-wrap flex-center">
        <div class="q-mt-md text-center">
          <div class="text-h6">
            Quais os dias do mês 
          </div>
          <q-input
            class="q-pa-sm"
            v-model="data.daysOfMonth"
            outlined
            >
          </q-input>
          <q-btn
            class="full-width"
            color="primary"
            label="Próximo"
            @click="clkNext2"
            :loading="btnNextLoading"
            unelevated
            no-caps
          />
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="time" class="column no-wrap flex-center">
        <div class="text-h6">
            Quais os dias do mês 
        </div>
        <q-input
          class="q-pa-sm"
          v-model="data.daysOfMonth"
          outlined
          >
        </q-input>
        <q-btn
          class="full-width"
          color="primary"
          label="Confirmar"
          @click="clkNext3"
          :loading="btnNextLoading"
          unelevated
          no-caps
        />
      </q-carousel-slide>
    </q-carousel>
  </q-dialog>
</template>

<script setup>
// import useFetch from "../boot/useFetch";
// import utils from '../../boot/utils'
import { ref } from 'vue'
const data = ref({
  step: 'frequency',
  selectedOption: null,
  daysOfMonth: null,
  time: null
})
const selectOptions = ['2x Semana', 'Semanal', 'Quinzenal', 'Mensal']
const props = defineProps(['open'])
const emits = defineEmits(['closeDialog', 'addOrganism'])

function clkNext1() {
  if (!data.value.selectedOption) {
    console.log("Ainda não")
    return
  }
  data.value.step = 'dayOption'
};

function clkNext2() {
  if (!data.value.daysOfMonth) {
    console.log("Ainda não")
    return
  }
  data.value.step = 'time'
};

function clkNext3() {
  if (!data.value.time) {
    console.log("Ainda não")
    return
  }
  console.log("concluiu a etapa de seleção")
};

function closeDialog() {
  emits('closeDialog')
};

</script>

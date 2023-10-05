<template>
  <q-dialog :model-value="open" @hide="closeDialog">
    <q-card style="border-radius: 1rem; height: 150x; width: 400px">
      <q-card-section>
        <div class="text-h6 text-center">Informe os dados da formação</div>
      </q-card-section>
      <q-card-section class="q-gutter-md">
        <q-input outlined label="Informe o grau" v-model="data.degree"/>
        <q-input outlined label="Informe o nome da formação" v-model="data.name"/>
        <q-input outlined label="Instituição de ensino" v-model="data.institution" />
        <q-input outlined label="Data da formatura" mask="##/##/####" v-model="data.collationDate" />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          flat
          label="Depois"
          no-caps
          color="primary"
          @click="closeDialog"
        />
        <q-btn
          unelevated
          rounded
          label="Confirmar"
          no-caps
          color="primary"
          @click="confirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
// import useFetch from "../boot/useFetch";
import { ref, watch } from 'vue'

const props = defineProps(['open', 'dataProp', 'fieldIndex', 'tabsIndex'])
const emits = defineEmits(['closeDialog', 'confirm'])

watch(() => props.dataProp, (nV) => {
  data.value = nV
}, { deep: true })

const data = ref({
  degree: '',
  name: '',
  institution: '',
  collationDate: ''
})

function confirm () {
  emits('confirm', data.value)
}

function closeDialog() {
  emits('closeDialog')
}

</script>

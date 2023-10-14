<template>
  <q-dialog :model-value="open" @hide="closeDialog">
    <q-card style="border-radius: 1rem; height: 150x; width: 400px">
      <q-card-section class="text-center">
        <div class="text-h6 text-center">Informe os dados</div>
        <q-badge color="orange" v-if="hint">{{ hint }}</q-badge>
      </q-card-section>
      <q-card-section class="q-gutter-md">
        <q-input
          label="Celular"
          hint="Informe seu celular"
          mask="(##) #####-####"
          v-model="data.value"
          outlined
          v-if="type.type === 'mobile'"
        />
        <q-input
          label="Telefone fixo"
          hint="Informe seu telefone fixo"
          mask="(##) ####-####"
          v-model="data.value"
          outlined
          v-else-if="type.type === 'phone'"
        />
        <q-input
          label="Email"
          hint="Informe seu email"
          v-model="data.value"
          outlined
          v-else-if="type.type === 'email'"
        />
        <q-select
          :options="options"
          v-model="data.type"
          outlined
          label="Tipo"
        />
        <q-checkbox label="Permitir divulgação" v-model="data.allowPublication"/>
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
import { ref, watch } from 'vue'
import { Notify } from 'quasar'

const props = defineProps(['open', 'dataProp', 'type', 'label', 'hint'])
const emits = defineEmits(['closeDialog', 'confirm'])

watch(() => props.dataProp, (nV) => {
  data.value = nV
}, { deep: true })

const data = ref({
  value: '',
  type: '',
  allowPublication: false
})

const options = ref(['Pessoal', 'Profissional', 'Outro'])

function confirm () {
  if (data.value.value === '' || data.value.type === '') {
    Notify('Prencha os campos')
    return
  }
  emits('confirm', data.value)
}

function closeDialog() {
  emits('closeDialog')
}

</script>

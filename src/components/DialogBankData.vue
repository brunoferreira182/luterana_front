<template>
  <q-dialog :model-value="open" @hide="closeDialog">
    <q-card style="border-radius: 1rem; height: 150x; width: 400px">
      <q-card-section>
        <div class="text-h6 text-center">Informe os dados bancários</div>
      </q-card-section>
      <q-card-section class="q-gutter-md">
        <q-input
          outlined
          label="Seu documento"
          v-model="doc"
          :disable="hasDoc"
          mask="###.###.###-##"
        />
        <q-input
          outlined
          label="Banco"
          v-model="data.bank"
          hint="Ex: Banco do Brasil, Bradesco, etc" />
        <q-input
          outlined
          label="Agência"
          v-model="data.agency"
          hint="Número da agência" />
        <q-input
          outlined
          label="Conta"
          v-model="data.account"
          hint="Número da conta" />
        <q-input
          outlined
          label="Chave PIX"
          v-model="data.pix"
          hint="Chave PIX" />
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

const props = defineProps(['open', 'dataProp', 'docProp', 'hasDoc'])
const emits = defineEmits(['closeDialog', 'confirm'])

const data = ref({
  bank: '',
  agency: '',
  aacount: '',
  pix: ''
})

const doc = ref('')

watch(() => props.dataProp, (nV) => {
  data.value = nV
}, { deep: true })

watch(() => props.docProp, (nV) => {
  doc.value = nV
}, { deep: true })

function confirm() {
  let errorMessage = ''
  if (doc.value === '') errorMessage = 'Preencha o documento'
  else if (data.value.bank === '') errorMessage = 'Preencha o banco'
  else if (data.value.bank !== '' && data.value.agency === '') errorMessage = 'Preencha a agência'
  else if (data.value.bank !== '' && data.value.agency !== '' && data.value.account === '') errorMessage = 'Preencha a conta'
  if (errorMessage !== '') {
    Notify(errorMessage)
    return
  }
  emits('confirm', data.value, doc.value)
}


function closeDialog() {
  emits('closeDialog')
}

</script>

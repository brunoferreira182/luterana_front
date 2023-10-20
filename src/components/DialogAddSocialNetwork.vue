<template>
  <q-dialog :model-value="open" @hide="closeDialog">
    <q-card style="border-radius: 1rem;width: 400px;">
      <q-card-section class="text-center">
        <div class="text-h6 text-center">Selecione a rede social</div>
      </q-card-section>
      <q-card-section>
        <q-select outlined v-model="data.selectedSocialType" :options="data.options" label="Outlined" />
      </q-card-section>
      <q-card-section v-if="data.selectedSocialType === 'Instagram'">
        <q-input
          label="Seu @ do instagram"
          hint="Informe seu nome de usuário do Instagram"
          v-model="data.instagramUsername"
          outlined
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
// import { Notify } from 'quasar'

const props = defineProps(['open', 'dataProp', 'type', 'label', 'hint'])
const emits = defineEmits(['closeDialog', 'confirm'])

watch(() => props.dataProp, (nV) => {
  data.value = nV
}, { deep: true })

const data = ref({
  value: '',
  type: '',
  allowPublication: false,
  options: [
    'Instagram', 'Facebook', 'Youtube', 'Site pessoal'
  ],
  selectedSocialType: null,
  instagramUsername: '@'
})

// const options = ref(['Pessoal', 'Profissional', 'Outro'])

// function confirm () {
//   if (data.value.value === '' || data.value.type === '') {
//     Notify('Prencha os campos')
//     return
//   }
//   emits('confirm', data.value)
// }

function closeDialog() {
  emits('closeDialog')
}

</script>

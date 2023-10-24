<template>
  <q-dialog :model-value="open" @hide="closeDialog">
    <q-card style="border-radius: 1rem;width: 400px;">
      <q-card-section class="text-center">
        <div class="text-h6 text-center">Selecione a rede social</div>
      </q-card-section>
      <q-card-section v-if="data">
        <q-select 
          outlined
          v-model="data.selectedSocialType" 
          :options="options" 
          label="Selecione" 
          @update:model-value="clearInputs"
        />
      </q-card-section>
      <q-card-section v-if="data.selectedSocialType === 'Instagram'">
        <q-input
          label="Seu @ do Instagram"
          hint="Informe seu nome de usuário do Instagram"
          prefix="https://www.instagram.com/"
          v-model="data.name"
          outlined
        />
        <q-select
          label="Tipo de perfil"
          hint="Insira o tipo de perfil"
          v-model="data.type"
          :options="typeProfileOptions"
          outlined
        />
      </q-card-section>
      <q-card-section v-if="data.selectedSocialType === 'Facebook'">
        <q-input
          label="Seu nome do perfil do Facebook"
          hint="Informe seu nome de usuário do Facebook"
          prefix="https://www.facebook.com/"
          v-model="data.name"
          outlined
        />
        <q-select
          label="Tipo de perfil"
          hint="Insira o tipo de perfil"
          v-model="data.type"
          :options="typeProfileOptions"
          outlined
        />
      </q-card-section>
      <q-card-section v-if="data.selectedSocialType === 'Youtube'">
        <q-input
          label="Nome do seu canal"
          hint="Informe o nome do seu canal no Youtube"
          prefix="https://youtube.com/"
          v-model="data.name"
          outlined
        />
        <q-select
          label="Tipo de perfil"
          hint="Insira o tipo de perfil"
          v-model="data.type"
          :options="typeProfileOptions"
          outlined
        />
      </q-card-section>
      <q-card-section v-if="data.selectedSocialType === 'Site pessoal'">
        <q-input
          label="URL"
          hint="Insira a url do seu site"
          v-model="data.value"
          outlined
        />
        <q-select
          label="Tipo de perfil"
          hint="Insira o tipo de perfil"
          v-model="data.type"
          :options="typeProfileOptions"
          outlined
        />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          unelevated
          rounded
          label="Fechar"
          no-caps
          color="primary"
          @click="closeDialog"
        />
        <q-btn
          unelevated
          rounded
          label="Confimar"
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
import { useQuasar } from 'quasar'

const quasar = useQuasar()
const props = defineProps(['open', 'dataProp', 'type', 'label', 'hint'])
const emits = defineEmits(['confirm', 'closeDialog'])
const options = ref([ 'Instagram', 'Facebook', 'Youtube', 'Site pessoal'])
const typeProfileOptions = ref (['Pessoal', 'Profissional'])

watch(() => props.dataProp, (nV) => {
  data.value = nV
}, { deep: true })

const data = ref({
  name: '',
  value: '',
  type: '',
  selectedSocialType: null,
})
function clearInputs () {
  data.value.name = ''
  data.value.value = ''
  data.value.type = ''
}
function confirm () {
  if (data.value.selectedSocialType === 'Instagram'
      ||data.value.selectedSocialType === 'Facebook'
      || data.value.selectedSocialType === 'Site pessoal' ) {
        if (data.value.type === '') {
          quasar.notify("Preencha todos os dados")
          return
        }
      }
  if (data.value.selectedSocialType === 'Site pessoal') {
      if (data.value.value === '') {
        quasar.notify('Preencha os campos')
        return
      }
    }
  emits('confirm', data.value)
}

function closeDialog() {
  emits('closeDialog')
}

</script>

<template>
  <q-dialog :model-value="open" @hide="closeDialog">
    <q-card style="border-radius: 1rem; height: 150x; width: 400px">
      <q-card-section>
        <div class="text-h6 text-center">
          Informe o título que o usuário irá receber
        </div>
      </q-card-section>
      <q-card-section align="center">
        <q-select
          v-model="titleSelected"
          filled
          label="Nome do título"
          option-label="titleName"
          :options="titleOptions"
          :option-value="(item) => item._id"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Nenhum resultado
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          flat
          label="Depois"
          no-caps
          rounded
          color="primary"
          @click="openDialogVinculateUserToTitle = false"
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

const props = defineProps(['open'])
const emits = defineEmits(['closeDialog', 'confirm'])

watch(() => props.open, (nV) => {
  if (nV) getTitleNamesList()
}, { deep: true })

const titleSelected = ref(null)
const titleOptions = ref(null)

function confirm () {
  emits('confirm', titleSelected.value)
}

function closeDialog() {
  emits('closeDialog')
}

function getTitleNamesList() {
  const opt = {
    route: '/desktop/commonUsers/getTitlesList',
  };
  useFetch(opt).then((r) => {
    titleOptions.value = r.data;
  })
}

</script>

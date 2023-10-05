<template>
  <q-dialog :model-value="props.open" @hide="closeDialog">
    <q-card style="border-radius: 1rem; height: 150x; width: 400px">
      <q-card-section>
        <div class="text-h6 text-center">Selecione o organismo</div>
      </q-card-section>
      <q-card-section class="q-gutter-md">
        <q-select
          v-model="organismSelected"
          filled
          use-input
          label="Nome do organismo"
          option-label="organismName"
          :options="options"
          @filter="getOrganismByString"
          :option-value="(item) => item"
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
          label="Voltar"
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
          @click="confirmAddOrganism"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import useFetch from "../boot/useFetch";
// import utils from '../../boot/utils'
import { ref } from 'vue'

const props = defineProps(['open'])
const emits = defineEmits(['closeDialog', 'addOrganism'])

const options = ref(null)
const organismSelected = ref(null)

function confirmAddOrganism () {
  console.log(organismSelected.value)
  emits('addOrganism', organismSelected.value)
}

function getOrganismByString(val, update) {
  if (val < 2) return
  const opt = {
    route: '/desktop/adm/getOrganismsNames',
    body: {
      searchString: val
    }
  }
  useFetch(opt).then(r => {
    if (r.error) return this.$q.notify(r.errorMessage)
    update(() => {
      options.value = r.data
    })
  })
}

function closeDialog() {
  emits('closeDialog')
}

</script>

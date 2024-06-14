<template>
  <q-dialog :model-value="open" @hide="closeDialog">
      <q-card style="border-radius: 1rem; height: 150x; width: 400px">
          <div class="text-h6 text-center q-pa-md ">Editar Membro</div>
          <q-card-section class="q-gutter-md">
            <q-input
              :readonly= "data.dataInicio !== ''"
              outlined
              label="Data de inicio" mask="##/##/####"
              autogrow
              v-model="data.dataInicio"
            />
            <q-input
              outlined
              label="Data de Fim" mask="##/##/####"
              autogrow
              v-model="data.dataFim"
            />
          <q-select
            v-model="data.organism.organismName"
            filled
            use-input
            label="Nome do organismo"
            option-label="organismName"
            :options="options"
            @filter="getOrganismByString"
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
          <!-- <q-card-section class="q-gutter-md"> -->
          <!-- </q-card-section> -->
          <q-card-actions align="center">
            <q-btn
              flat
              label="Voltar"
              no-caps
              color="primary"
              rounded
              @click="closeDialog"
            />
            <q-btn
              flat
              label="Salvar"
              no-caps
              color="primary"
              rounded
              @click="confirmEdition"
            />
            <q-btn
              unelevated
              size="11px"
              label="Excluir"
              no-caps
              color="red"
              rounded
              @click="deleteMembership"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import useFetch from "../boot/useFetch.js";

const props = defineProps(['open', 'dataProp'])
const emits = defineEmits(['closeDialog', 'confirm', 'delete'])

const data = ref({
  dataInicio: '',
  dataFim: '',
  organism: {
    organismName: '',
    organismId: ''
  }, 
})

const options =  ref([])

watch(() => props.dataProp, (nV) => {
  data.value = nV
}, { deep: true })

// watch(() => props.docProp, (nV) => {
//   doc.value = nV
// }, { deep: true })

function confirmEdition() {
  console.log(data)
  emits('confirm', data.value )
}

function deleteMembership() {
  console.log(data)
  emits('delete', data.value )
}

function getOrganismByString(val, update){
    if (val < 2) return
    const opt = {
      route: "/desktop/adm/getOrganismsNames",
      body: {
        searchString: val
      }
    }
    useFetch(opt).then((r) => {
      if(r.error){
        this.$q.notify('Ocorreu um erro, tente novamente por favor')
        return
      }
      update(() => {
        options.value = r.data
      })
    })
  }

function closeDialog() {
  emits('closeDialog')
}

</script>

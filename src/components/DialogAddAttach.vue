<template>
  <q-dialog :model-value="props.open" @hide="closeDialog">
    <q-card style="border-radius: 1rem; height: 150x; width: 400px">
      <q-card-section>
        <div class="text-h6 text-center">Selecione um arquivo</div>
      </q-card-section>
      <q-card-section>
        <q-file outlined v-model="attach" label="Clique aqui para selecionar um arquivo">
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
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
          @click="confirmAddAttach"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
// import useFetch from "../boot/useFetch";
// import utils from '../../boot/utils'
import { ref } from 'vue'

const props = defineProps(['open'])
const emits = defineEmits(['closeDialog', 'addAttach'])
const attach = ref(null)


function confirmAddAttach () {
  emits('addAttach', attach)
}


function closeDialog() {
  emits('closeDialog')
}

</script>

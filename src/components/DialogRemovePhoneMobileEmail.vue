<template>
  <q-dialog :model-value="open" @hide="closeDialog">
    <q-card style="border-radius: 1rem; width: 400px">
      <q-card-section class="text-center">
        <div class="text-h6 text-center">Tem certeza que deseja remover?</div>
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
const props = defineProps(['open', 'dataType' ])
const emits = defineEmits(['closeDialog', 'confirm'])

watch(() => props.dataProp, (nV) => {
  data.value = nV
}, { deep: true })

const data = ref({
  value: '',
  type: '',
  allowPublication: false
})


function confirm () {
  emits('confirm')
}

function closeDialog() {
  emits('closeDialog')
}

</script>

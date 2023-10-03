<template>
  <q-dialog :model-value="props.open">
    <q-card style="border-radius: 1rem; height: 150x; width: 400px">
      <q-card-section>
        <div class="text-h6 text-center">Selecione a pessoa</div>
      </q-card-section>
      <q-card-section class="q-gutter-md">
        <q-select
          v-model="userSelected"
          filled
          use-input
          label="Nome do usuário"
          option-label="userName"
          :options="usersOptions"
          @filter="getUserByString"
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
          rounded
          @click="closeDialog"
        />
        <q-btn
          unelevated
          rounded
          label="Confirmar"
          no-caps
          color="primary"
          @click="confirmAddPerson"
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
const emits = defineEmits(['closeDialog', 'addPerson'])

const usersOptions = ref(null)
const userSelected = ref(null)

function confirmAddPerson () {
  console.log(userSelected.value)
  emits('addPerson', userSelected.value)
}

function getUserByString (val, update) {
  if (val < 2) return
  const opt = {
    route: '/desktop/users/getUsersList',
    body: {
      searchString: val
    }
  }
  useFetch(opt).then(r => {
    if (r.error) return this.$q.notify(r.errorMessage)
    update(() => {
      usersOptions.value = r.data.list
    })
  })
}

function closeDialog() {
  emits('closeDialog')
}

</script>

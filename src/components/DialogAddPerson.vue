<template>
  <q-dialog :model-value="props.open" @hide="closeDialog">
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
          @update:model-value="updatedSelectedValue"
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

  <q-dialog :model-value="newUser.open" @hide="closeDialog">
    <q-card style="border-radius: 1rem; height: 150x; width: 400px">
      <q-card-section>
        <div class="text-h6 text-center">Informe os dados da pessoa</div>
      </q-card-section>
      <q-card-section class="q-gutter-md">
        <div
          v-for="(field, fieldIndex) in newUser.userDataTabs.fields"
          :key="fieldIndex"
          class="q-my-md"
        >
          <div class="row q-gutter-sm justify-left items-left">
            <div class="col q-mx-lg">
              <div v-if="
                field.type.type === 'string'
                || field.type.type === 'int'
                || field.type.type === 'date'
                || field.type.type === 'cpf'
                || field.type.type === 'cnpj'
                || field.type.type === 'money'
                || field.type.type === 'textarea'
                "
              >
                <q-input
                  :label="field.label"
                  :hint="field.hint"
                  :mask="field.type.mask"
                  v-model="field.value"
                  outlined
                >
                </q-input>
              </div>

              <div class="text-right" v-if="field.type.type === 'options'">
                <q-select
                  outlined
                  :label="field.label"
                  option-label="optionName"
                  emit-value
                  map-options
                  :hint="field.hint"
                  v-model="field.value"
                  :options="field.options"
                >
                </q-select>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          flat
          label="Voltar"
          no-caps
          color="primary"
          rounded
          @click="newUser.open = false"
        />
        <q-btn
          unelevated
          rounded
          label="Confirmar"
          no-caps
          color="primary"
          @click="confirmNewPerson"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script setup>
import useFetch from "../boot/useFetch";
// import utils from '../../boot/utils'
import { ref } from 'vue'
import { Loading, Notify } from 'quasar'

const props = defineProps(['open'])
const emits = defineEmits(['closeDialog', 'addPerson'])

const usersOptions = ref(null)
const userSelected = ref(null)
const newUser = ref({
  open: false,
  userDataTabs: null
})

async function updatedSelectedValue(val) {
  if (val.value !== 'newUser') return
  const opt = {
    route: "/desktop/users/getUserConfigToNewUser",
  };
  Loading.show()
  const r = await useFetch(opt)
  Loading.hide()
  if (r.error) {
    Notify('Ocorreu um erro. Tente novamente.')
    return
  }
  newUser.value.open = true
  newUser.value.userDataTabs = r.data.userDataTabs[0]
}

async function confirmNewPerson () {
  const opt = {
    route: "/auth/createUserFromInside",
    body: {
      userDataTabs: [ newUser.value.userDataTabs ],
      fromUser: true
    }
  }
  Loading.show()
  const r = await useFetch(opt)
  Loading.hide()
  if (r.error) {
    Notify('Ocorreu um erro. Tente novamente')
    return
  }
  emits('addPerson', r.data)
}

function confirmAddPerson () {
  console.log(userSelected.value)
  emits('addPerson', userSelected.value)
}

function getUserByString (val, update) {
  if (val < 2) return
  const opt = {
    route: '/desktop/users/findUsersByString',
    body: {
      searchString: val
    }
  }
  useFetch(opt).then(r => {
    if (r.error) return this.$q.notify(r.errorMessage)
    update(() => {
      usersOptions.value = [...r.data.list]
      usersOptions.value.push({ userName: 'Não encontrei - cadastrar', value: 'newUser' })
    })
  })
}

function closeDialog() {
  emits('closeDialog')
}

</script>

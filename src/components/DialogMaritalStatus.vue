<template>
  <q-dialog :model-value="props.open" @hide="closeDialog">
    <q-card style="border-radius: 1rem; height: 150x; width: 400px">
      <q-card-section>
        <div class="text-h6 text-center">Selecione a pessoa</div>
      </q-card-section>
      <q-card-section class="q-gutter-md">
        <q-select
          v-model="newSpouse.person"
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
        <q-input
          label="Data casamento"
          v-model="newSpouse.weddingDate"
          outlined
          mask="##/##/####"
          hint="Insira a data de casamento"
        />
        <q-input
          label="Data separação"
          v-model="newSpouse.separationDate"
          outlined
          mask="##/##/####"
          hint="Deixe em branco se não houver"
        />
        <q-input
          label="Data falecimento"
          v-model="newSpouse.deathDate"
          outlined
          mask="##/##/####"
          hint="Deixe em branco se não houver"
        />
        <!-- <q-checkbox label="Casamento atual ou último" v-model="newSpouse.current"/><br> -->
        <q-btn
          label="Adicionar"
          @click="addSpouse"
          no-caps
          icon="add"
          flat
          color="primary"
          rounded
        />
      </q-card-section>
      <q-card-section>
        <q-list separator>
          <q-item
            v-for="(item, i) in data.spouses"
            :key="`spouse${i}`"
          >
            <q-item-section>
              <q-item-label>{{ item.person.userName }}</q-item-label>
              <q-item-label caption>Data casamento: {{ item.weddingDate }}</q-item-label>
              <q-item-label
                caption
                v-if="item.separationDate !== ''"
              >Data separação: {{ item.separationDate }}</q-item-label>
              <q-item-label
                caption
                v-if="item.deathDate !== ''"
              >Data falecimento: {{ item.deathDate }}</q-item-label>
              <q-item-label>
                <q-badge v-if="item.status" :label="item.status"/>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
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
import { ref, watch } from 'vue'

const props = defineProps(['open', 'dataProp'])
const emits = defineEmits(['closeDialog', 'addPerson'])

const newSpouse = ref({
  weddingDate: '',
  separationDate: '',
  deathDate: '',
  person: '',
})

const data = ref(null)
const usersOptions = ref(null)
const userSelected = ref(null)
watch(() => props.dataProp, (nV) => {
  data.value = nV
}, { deep: true })

function addSpouse() {
  data.value.spouses.push({...newSpouse.value})
  orderSpousessByDate()
  verifyMaritalStatus()
}

function confirmAddPerson () {
  emits('addPerson', userSelected.value)
}

function orderSpousessByDate () {
  data.value.spouses.sort((a, b) => {
    if (a.weddingDate > b.weddingDate) {
      return 1;
    }
    if (b.weddingDate > a.weddingDate) {
      return -1;
    }
    return 0;
  })
}

function verifyMaritalStatus () {
  data.value.spouses.forEach((s, i) => {
    data.value.spouses[i].status = null
  })
  const len = data.value.spouses.length
  if (data.value.spouses[len - 1].separationDate !== '') {
    data.value.spouses[len - 1].status = 'Último casamento'
    data.value.status = 'Divorciado'
  } else if (data.value.spouses[len - 1].deathDate !== '') {
    data.value.spouses[len - 1].status = 'Último casamento'
    data.value.status = 'Viúvo'
  } else {
    data.value.spouses[len - 1].status = 'Casamento atual'
    data.value.status = 'Casado'
  }
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

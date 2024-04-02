<template>
  <q-dialog :model-value="props.open" v-if="data.statusOptions">
    <q-card style="border-radius: 1rem;width: 300px;">
      <q-card-section>
        <div class="text-center text-h6 q-mb-sm">
          Selecione um status
        </div>
        <q-select
          outlined
          :options="data.statusOptions"
          v-model="data.selectedStatusOption"
        />
      </q-card-section>
      <q-card-section
        v-if="data.selectedStatusOption && data.selectedStatusOption.value === 'retired'"
      >
        <q-input
          class="q-mb-md"
          label="Data de início"
          outlined
          mask="##/##/####"
          v-model="retiredData.initialDate"
        />
        <q-input
          class="q-mb-md"
          label="Data de término"
          outlined
          mask="##/##/####"
          v-model="retiredData.finalDate"
        />
        <q-input
          label="Prazo final"
          mask="##/##/####"
          outlined
          :disable="retiredData.disable"
          v-model="retiredData.deadline"
        />
        <q-checkbox
          v-model="retiredData.noDeadLine"
          label="Prazo final indefinido"
          @update:model-value="changeRetiredDeadline"
        />
      </q-card-section>
      <q-card-section
        v-if="data.selectedStatusOption && data.selectedStatusOption.value === 'license'"
      >
        <q-select
          class="q-mb-md"
          outlined
          options-dense
          label="Motivo da lincença"
          :options="licenseData.licenseOptions"
          :option-value="(item) => item"
          v-model="licenseData.selectedlicenseOption"
        />
        <q-input
          v-if="licenseData && licenseData.selectedlicenseOption === 'Outro'"
          v-model="licenseData.otherReason"
          outlined
          label="Motivo da licença"
          class="q-mb-md"
        />
        <q-input
          class="q-mb-md"
          label="Data de início"
          outlined
          mask="##/##/####"
          v-model="licenseData.initialDate"
        />
        <q-input
          class="q-mb-md"
          label="Data de término"
          outlined
          mask="##/##/####"
          v-model="licenseData.finalDate"
        />
        <q-input
          class="q-mb-md"
          label="Prazo final"
          outlined
          :disable="licenseData.disable"
          mask="##/##/####"
          v-model="licenseData.deadline"
        />
        <q-checkbox
          v-model="licenseData.noDeadLine"
          label="Prazo final indefinido"
          @update:model-value="changeLicenseDeadline"
        />
      </q-card-section>
      <q-card-section
        v-if="data.selectedStatusOption && data.selectedStatusOption.value === 'trainee'"
      > 
        <q-select
          class="q-mb-md"
          label="Qual congregação"
          use-input
          option-label="nome"
          outlined
          @filter="getOrganismsList"
          :options="organismsList.data"
          v-model="traineeData.organismSelected"
        />
        <q-select
          class="q-mb-md"
          label="qual o Pastor orientador"
          use-input
          option-label="userName"
          outlined
          @filter="getUsers"
          :options="pastorList.data"
          v-model="traineeData.guildingPastor"
        />
        <q-input
          class="q-mb-md"
          label="Data de início"
          outlined
          mask="##/##/####"
          v-model="traineeData.initialDate"
        />
        <q-input
          class="q-mb-md"
          label="Data de término"
          outlined
          mask="##/##/####"
          v-model="traineeData.finalDate"
        />
        <q-input
          class="q-mb-md"
          label="Prazo final"
          outlined
          mask="##/##/####"
          :disable="traineeData.disable"
          v-model="traineeData.deadline"
        />
        <q-checkbox
          v-model="traineeData.noDeadLine"
          label="Prazo final indefinido"
          @update:model-value="changeTraineeDeadline"
        />
      </q-card-section>
      <q-card-section
        v-if="data.selectedStatusOption && data.selectedStatusOption.value === 'withoutCall'"
      >
        <q-select
          label="Posição do chamado"
          :options="withoutCallData.optionsType"
          v-model="withoutCallData.optionSelected"
          class="q-mb-md"
          outlined
        />
        <q-input
          v-model="withoutCallData.initialDate"
          outlined
          class="q-mb-md"
          label="Data de início"
        />
        <q-input
          v-model="withoutCallData.finalDate"
          outlined
          class="q-mb-md"
          label="Data de término"
        />
        <q-input
          v-model="withoutCallData.deadline"
          outlined
          class="q-mb-md"
          :disable="withoutCallData.disable"
          label="Prazo final"
        />
        <q-checkbox
          v-model="withoutCallData.noDeadLine"
          label="Prazo final indefinido"
          @update:model-value="changewithoutCallDeadline"
        />
      </q-card-section>
      <q-card-section
        v-if="data.selectedStatusOption && data.selectedStatusOption.value === 'student'"
      >
        <q-select
          :options="studentData.goalOptions"
          v-model="studentData.selectedGoal"
          outlined
          label="Finalidade"
          class="q-mb-md"
        />          
        <q-input
          v-model="studentData.where"
          outlined
          label="Local"
          class="q-mb-md"
        />
        <q-input
          v-model="studentData.initialDate"
          outlined
          class="q-mb-md"
          label="Data de início"
        />
        <q-input
          v-model="studentData.finalDate"
          outlined
          class="q-mb-md"
          label="Data de término"
        />
        <q-input
          v-model="studentData.deadline"
          outlined
          class="q-mb-md"
          label="Prazo final"
          :disable="studentData.disable"
        />
        <q-checkbox
          v-model="studentData.noDeadLine"
          label="Prazo final indefinido"
          @update:model-value="changeStudentDeadline"
        />
      </q-card-section>
      <q-card-section
        v-if="data.selectedStatusOption && data.selectedStatusOption.value === 'ceded'"
      >
        Aguardando importação para ajustar de acordo a lista de organismos que podem ser selecionaos aqui hauhauhau
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          label="Voltar"
          color="primary"
          rounded
          unelevated
          flat
          no-caps
        />
        <q-btn
          label="Adicionar status"
          color="primary"
          rounded
          unelevated
          no-caps
          @click="verifyIfCanAddStatus"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import useFetch from "../boot/useFetch";
import { Notify } from 'quasar';

const organismsList = ref({
  data: ''
})
const pastorList = ref({
  data: ''
})


const data = ref({
  statusOptions: null,
  selectedStatusOption: null,
})

const retiredData = ref({
  initialDate: '',
  finalDate: '',
  deadline: null,
  noDeadLine: false,
  disable: false
})

// const cededData = ref({
//   local: null,
//   where: null,
//   initialDate: '',
//   finalDate: '',
//   deadline: ''
// })

const traineeData = ref({
  organismSelected: null,
  guildingPastor: null,
  initialDate: '',
  finalDate: '',
  deadline: null,
  noDeadLine: false,
  disable: false
})

const licenseData = ref({
  licenseOptions: ['Saúde', 'Estudos', 'Interesse', 'Outro'],
  selectedlicenseOption: null,
  otherReason: '',
  initialDate: '',
  finalDate: '',
  deadline: '',
  disable: false,
  noDeadLine: false
})

const studentData = ref({
  goalOptions: ['Intercâmbio', 'Pós-pastoral'],
  selectedGoal: null,
  where: '',
  initialDate: '',
  finalDate: '',
  deadline: '',
  noDeadLine: false,
  disable: false
})

const withoutCallData = ref({
  optionsType: ['Em colóquio', 'Aguardando chamado'],
  optionSelected: null,
  initialDate: '',
  finalDate: '',
  deadline: '',
  noDeadLine: false,
  disable: false
})

const props = defineProps(['open'])

onBeforeMount(async () => {
  await getStatusOptions()
})

async function getStatusOptions() {
  const opt = {
    route: '/desktop/adm/getStatusTypes'
  }
  let r = await useFetch(opt)
  if (r.error) return
  data.value.statusOptions = r.data
}

function changeStudentDeadline() {
  if (studentData.value.noDeadLine) {
    studentData.value.deadline = '',
    studentData.value.disable = true
  } else {
    studentData.value.disable = false
  }
}
function changewithoutCallDeadline() {
  if (withoutCallData.value.noDeadLine) {
    withoutCallData.value.deadline = '',
    withoutCallData.value.disable = true
  } else {
    withoutCallData.value.disable = false
  }
}
function changeTraineeDeadline() {
  if (traineeData.value.noDeadLine) {
    traineeData.value.deadline = '',
    traineeData.value.disable = true
  } else {
    traineeData.value.disable = false
  }
}
function changeRetiredDeadline() {
  if (retiredData.value.noDeadLine) {
    retiredData.value.deadline = '',
    retiredData.value.disable = true
  } else {
    retiredData.value.disable = false
  }
}
function changeLicenseDeadline() {
  if (licenseData.value.noDeadLine) {
    licenseData.value.deadline = '',
    licenseData.value.disable = true
  } else {
    licenseData.value.disable = false
  }
}

function verifyIfCanAddStatus() {
  if (data.value.selectedStatusOption.value === 'retired') {
    if (retiredData.value.initialDate === '' || (retiredData.value.deadline === '' && !retiredData.value.noDeadLine)) {
      Notify.create('Preencha a data inicial e o prazo.')
      return
    }
  } else if (data.value.selectedStatusOption.value === 'license') {
    if (!licenseData.value.selectedlicenseOption || (licenseData.value.selectedlicenseOption === 'Outro' && licenseData.value.otherReason === '') || (licenseData.value.deadline === '' && !licenseData.value.noDeadLine)) {
      Notify.create('Preencha a data inicial e o motivo')
      return
    }
  } else if (data.value.selectedStatusOption.value === 'trainee') {
    if (!traineeData.value.organismSelected || !traineeData.value.guildingPastor || traineeData.value.initialDate === '' || (traineeData.value.deadline && !traineeData.value.noDeadLine)) {
      Notify.create('Preencha a congregação, o pastor orientador, a data de início e o prazo para prosseguir')
      return
    } 
  } else if (data.value.selectedStatusOption.value === 'withoutCall') {
    if (!withoutCallData.value.optionSelected || withoutCallData.value.initialDate === '' || (withoutCallData.value.deadline === '' && !withoutCallData.value.noDeadLine)) {
      return
    }
  }
  
}

function getOrganismsList(val, update, abort) {
  if(val.length < 3) {
    abort()
    return
  }
  const opt = {
    route: "/desktop/adm/getOrganismsList",
    body: {
      searchString: val,
      page: 1,
      rowsPerPage: 50
    }
  };
  useFetch(opt).then((r) => {
    console.log(r)
    update(() => {
      organismsList.value.data = r.data.list
    })
  });
}

function getUsers(val, update, abort) {
  if(val.length < 3) {
    abort()
    return
  }
  let route = "/desktop/adm/getPastores"
  
  const opt = {
    route: route,
    body: {
      searchString: val,
      isActive: 1,
      page: 1,
      rowsPerPage: 50
    }
  }
  useFetch(opt).then((r) => {
    console.log(r, 'fuwhu')
    update(() => {
      pastorList.value.data = r.data.list
    })
  });
}
</script>
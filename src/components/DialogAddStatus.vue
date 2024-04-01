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
          v-model="retiredData.deadline"
        >

        </q-input>
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
          mask="##/##/####"
          v-model="licenseData.deadline"
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
          v-model="traineeData.deadline"
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
          label="Prazo final"
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
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import useFetch from "../boot/useFetch";
// import { Notify, Loading } from 'quasar'; // Importe apenas os métodos necessários do Quasar

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
  deadline: null
})

const traineeData = ref({
  organismSelected: null,
  guildingPastor: null,
  initialDate: '',
  finalDate: '',
  deadline: null
})

const licenseData = ref({
  licenseOptions: ['Saúde', 'Estudos', 'Interesse', 'Outro'],
  selectedlicenseOption: null,
  otherReason: '',
  initialDate: '',
  finalDate: '',
  deadline: ''
})

const studentData = ref({
  goalOptions: ['Intercâmbio', 'Pós-pastoral'],
  selectedGoal: null,
  where: '',
  initialDate: '',
  finalDate: '',
  deadline: ''
})

const withoutCallData = ref({
  optionsType: ['Em colóquio', 'Aguardando chamado'],
  optionSelected: null,
  initialDate: '',
  finalDate: '',
  deadline: ''
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
  console.log(r, 'fhasuhfuahuhuh')
  if (r.error) return
  data.value.statusOptions = r.data
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
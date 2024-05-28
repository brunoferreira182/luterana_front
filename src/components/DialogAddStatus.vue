<template>
  <q-dialog :model-value="props.open" v-if="data.statusOptions" @hide="closeDialog">
    <q-card style="border-radius: 1rem;width: 300px;">
      <q-card-section>
        <div class="text-center text-h6 q-mb-sm">
          Selecione um status
        </div>
        <q-select
          outlined
          :options="data.statusOptions"
          v-model="data.selectedStatusOption"
          @update:model-value="clearDialogInfo"
        />
      </q-card-section>
      <q-card-section
        v-if="data.selectedStatusOption && data.selectedStatusOption.value === 'retired'"
      >
        <q-select
          v-model="retiredData.selectedPastor"
          outlined
          use-input
          label="Nome do pastor"
          class="q-mb-md"
          option-label="userName"
          :options="pastorList.data"
          hint="Pastor que ocupará a função"
          @filter="getUsers"
          :loading="false"
          :option-value="(item) => item._id"
          :disable="pastorDisable"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Nenhum resultado
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.userName }}</q-item-label>
                <q-item-label caption>{{ scope.opt.email }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
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
          v-if="!retiredData.noDeadline"
          label="Prazo final"
          mask="##/##/####"
          outlined
          :disable="retiredData.disable"
          v-model="retiredData.deadline"
        />
        <q-input
          v-if="retiredData.noDeadline"
          label="Prazo final"
          outlined
          :disable="retiredData.disable"
          v-model="retiredData.deadline"
        />
        <q-checkbox
          v-model="retiredData.noDeadline"
          label="Prazo final indefinido"
          @update:model-value="changeRetiredDeadline"
        />
      </q-card-section>
      <q-card-section
        v-if="data.selectedStatusOption && data.selectedStatusOption.value === 'license'"
      >
        <q-select
          v-model="licenseData.selectedPastor"
          outlined
          use-input
          label="Nome do pastor"
          class="q-mb-md"
          option-label="userName"
          :options="pastorList.data"
          hint="Pastor que ocupará a função"
          @filter="getUsers"
          :loading="false"
          :option-value="(item) => item._id"
          :disable="pastorDisable"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Nenhum resultado
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.userName }}</q-item-label>
                <q-item-label caption>{{ scope.opt.email }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-select
          class="q-mb-md"
          outlined
          options-dense
          label="Motivo da lincença"
          :options="licenseData.licenseOptions"
          :option-value="(item) => item"
          v-model="licenseData.selectedLicenseOption"
        />
        <q-input
          v-if="licenseData && licenseData.selectedLicenseOption === 'Outro'"
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
          v-if="!licenseData.noDeadline"
          class="q-mb-md"
          label="Prazo final"
          outlined
          :disable="licenseData.disable"
          mask="##/##/####"
          v-model="licenseData.deadline"
        />
        <q-input
          v-if="licenseData.noDeadline"
          class="q-mb-md"
          label="Prazo final"
          outlined
          :disable="licenseData.disable"
          v-model="licenseData.deadline"
        />
        <q-checkbox
          v-model="licenseData.noDeadline"
          label="Prazo final indefinido"
          @update:model-value="changeLicenseDeadline"
        />
      </q-card-section>
      <q-card-section
        v-if="data.selectedStatusOption && data.selectedStatusOption.value === 'trainee'"
      > 
        <q-select
          v-model="traineeData.selectedPastor"
          outlined
          use-input
          label="Nome do pastor"
          class="q-mb-md"
          option-label="userName"
          :options="pastorList.data"
          hint="Pastor que ocupará a função"
          @filter="getUsers"
          :loading="false"
          :option-value="(item) => item._id"
          :disable="pastorDisable"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Nenhum resultado
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.userName }}</q-item-label>
                <q-item-label caption>{{ scope.opt.email }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-select
          class="q-mb-md"
          label="Qual congregação"
          use-input
          option-label="nome"
          outlined
          @filter="getFiliatedOrganismsList"
          :options="filiatedOrganismsList.data"
          v-model="traineeData.selectedOrganism"
          :disable="traineeData.selectOrganismDisable"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Nenhum resultado
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.nome }}</q-item-label>
                <q-item-label caption>{{ scope.opt.city }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
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
          v-if="!traineeData.noDeadline"
          class="q-mb-md"
          label="Prazo final"
          outlined
          mask="##/##/####"
          :disable="traineeData.disable"
          v-model="traineeData.deadline"
        />
        <q-input
          v-if="traineeData.noDeadline"
          class="q-mb-md"
          label="Prazo final"
          outlined
          :disable="traineeData.disable"
          v-model="traineeData.deadline"
        />
        <q-checkbox
          v-model="traineeData.noDeadline"
          label="Prazo final indefinido"
          @update:model-value="changeTraineeDeadline"
        />
      </q-card-section>
      <q-card-section
        v-if="data.selectedStatusOption && data.selectedStatusOption.value === 'withoutCall'"
      >
        <q-select
          v-model="withoutCallData.selectedPastor"
          outlined
          use-input
          label="Nome do pastor"
          class="q-mb-md"
          option-label="userName"
          :options="pastorList.data"
          hint="Pastor que ocupará a função"
          @filter="getUsers"
          :loading="false"
          :option-value="(item) => item._id"
          :disable="pastorDisable"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Nenhum resultado
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.userName }}</q-item-label>
                <q-item-label caption>{{ scope.opt.email }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
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
          mask="##/##/####"
        />
        <q-input
          v-model="withoutCallData.finalDate"
          outlined
          class="q-mb-md"
          label="Data de término"
          mask="##/##/####"
        />
        <q-input
          v-if="!withoutCallData.noDeadline"
          v-model="withoutCallData.deadline"
          outlined
          class="q-mb-md"
          mask="##/##/####"
          :disable="withoutCallData.disable"
          label="Prazo final"
        />
        <q-input
          v-if="withoutCallData.noDeadline"
          v-model="withoutCallData.deadline"
          outlined
          class="q-mb-md"
          :disable="withoutCallData.disable"
          label="Prazo final"
        />
        <q-checkbox
          v-model="withoutCallData.noDeadline"
          label="Prazo final indefinido"
          @update:model-value="changewithoutCallDeadline"
        />
      </q-card-section>
      <q-card-section
        v-if="data.selectedStatusOption && data.selectedStatusOption.value === 'student'"
      >
        <q-select
          v-model="studentData.selectedPastor"
          outlined
          use-input
          label="Nome do pastor"
          class="q-mb-md"
          option-label="userName"
          :options="pastorList.data"
          hint="Pastor que ocupará a função"
          @filter="getUsers"
          :loading="false"
          :option-value="(item) => item._id"
          :disable="pastorDisable"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Nenhum resultado
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.userName }}</q-item-label>
                <q-item-label caption>{{ scope.opt.email }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
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
          mask="##/##/####"
        />
        <q-input
          v-model="studentData.finalDate"
          outlined
          class="q-mb-md"
          label="Data de término"
          mask="##/##/####"
        />
        <q-input
          v-if="!studentData.noDeadline"
          v-model="studentData.deadline"
          outlined
          class="q-mb-md"
          label="Prazo final"
          mask="##/##/####"
          :disable="studentData.disable"
        />
        <q-input
          v-if="studentData.noDeadline"
          v-model="studentData.deadline"
          outlined
          class="q-mb-md"
          label="Prazo final"
          
          :disable="studentData.disable"
        />
        <q-checkbox
          v-model="studentData.noDeadline"
          label="Prazo final indefinido"
          @update:model-value="changeStudentDeadline"
        />
      </q-card-section>
      <q-card-section
        v-if="data.selectedStatusOption && data.selectedStatusOption.value === 'withCall'"
      > 
        <q-select
          class="q-mb-md"
          v-model="withCallData.selectedCallOption"       
          :options="withCallData.callOptions"   
          outlined
          options-dense
          @update:model-value="resetOrganismName"
          label="Quem chamou"
          :disable="withCallData.selectOrganismDisable"
        />
        <q-select
          v-if="withCallData.selectedCallOption === 'Congregação'"
          class="q-mb-md"
          v-model="withCallData.selectedOrgamism"
          outlined
          use-input
          label="Nome do organismo de chamado"
          option-label="nome"
          options-dense
          :options="filiatedOrganismsList.data"
          @filter="getFiliatedOrganismsList"
          :option-value="(item) => item"
          :disable="withCallData.selectOrganismDisable"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Nenhum resultado
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.nome }}</q-item-label>
                <q-item-label caption>{{ scope.opt.city }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-select
          v-if="withCallData.selectedCallOption === 'Diretoria Nacional'"
          class="q-mb-md"
          v-model="withCallData.selectedOrgamism"
          outlined
          label="Nome do organismo de chamado"
          option-label="organismName"
          options-dense
          :options="nacionalBoard.data"
          :option-value="(item) => item"
          :disable="withCallData.selectOrganismDisable"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Nenhum resultado
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.organismName }}</q-item-label>
                <q-item-label caption>{{ scope.opt.city }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-select
          v-model="withCallData.selectedPastor"
          outlined
          use-input
          label="Nome do pastor"
          class="q-mb-md"
          option-label="userName"
          :options="pastorList.data"
          hint="Pastor que ocupará a função"
          @filter="getUsers"
          :loading="false"
          :option-value="(item) => item._id"
          :disable="pastorDisable"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Nenhum resultado
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.userName }}</q-item-label>
                <q-item-label caption>{{ scope.opt.email }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-input
          class="q-mb-md"
          outlined
          mask="##/##/####"
          label="Data de início"
          v-model="withCallData.initialDate"
        />
        <q-input
          class="q-mb-md"
          outlined
          mask="##/##/####"
          label="Data de término"
          v-model="withCallData.finalDate"
        />
        <q-input
          v-if="!withCallData.noDeadline"
          class="q-mb-md"
          outlined
          mask="##/##/####"
          label="Prazo final"
          v-model="withCallData.deadline"
          :disable="withCallData.disable"
        />
        <q-input
          v-if="withCallData.noDeadline"
          class="q-mb-md"
          outlined
          label="Prazo final"
          v-model="withCallData.deadline"
          :disable="withCallData.disable"
        />
        <q-checkbox
          v-model="withCallData.noDeadline"
          label="Prazo final indefinido"
          @update:model-value="changewithCallDeadline"
        />
      </q-card-section>
      <q-card-section
        v-if="data.selectedStatusOption && data.selectedStatusOption.value === 'ceded'"
      >
        <q-select
          v-model="cededData.selectedPastor"
          outlined
          use-input
          label="Nome do pastor"
          class="q-mb-md"
          option-label="userName"
          hint="Pastor que ocupará a função"
          @filter="getUsers"
          :loading="false"
          :option-value="(item) => item._id"
          :disable="pastorDisable"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Nenhum resultado
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.userName }}</q-item-label>
                <q-item-label caption>{{ scope.opt.email }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-select
          label="Qual igreja"
          :options="cededData.localOptions"
          v-model="cededData.local"
          outlined
          class="q-mb-md"
        />
        <q-select
          v-if="cededData.local === 'Igreja irmã'"
          :options="sisterChurch.data"
          outlined
          class="q-mb-md"
          label="Selecione a igreja"
          option-label="organismName"
          v-model="cededData.where"
        />
        <q-select
          v-if="cededData.local === 'Outra denominação'"
          :options="otherDenomination.data"
          outlined
          class="q-mb-md"
          label="Selecione a igreja"
          option-label="organismName"
          v-model="cededData.where"
        />
        <q-input
          class="q-mb-md"
          outlined
          mask="##/##/####"
          label="Data de início"
          v-model="cededData.initialDate"
        />
        <q-input
          class="q-mb-md"
          outlined
          mask="##/##/####"
          label="Data de término"
          v-model="cededData.finalDate"
        />
        <q-input
          v-if="!cededData.noDeadline"
          class="q-mb-md"
          outlined
          mask="##/##/####"
          label="Prazo final"
          v-model="cededData.deadline"
          :disable="cededData.disable"
        />
        <q-input
          v-if="cededData.noDeadline"
          class="q-mb-md"
          outlined
          label="Prazo final"
          v-model="cededData.deadline"
          :disable="cededData.disable"
        />
        <q-checkbox
          v-model="cededData.noDeadline"
          label="Prazo final indefinido"
          @update:model-value="changeCededDeadline"
        />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          label="Voltar"
          color="primary"
          rounded
          unelevated
          flat
          no-caps
          @click="closeDialog"
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

const pastorList = ref({
  data: ''
})
const filiatedOrganismsList = ref({
  data: ''
})
const nacionalBoard = ref({
  data: ''
})
const sisterChurch = ref({
  data: ''
})
const otherDenomination = ref({
  data: ''
})


const emits = defineEmits(['confirm', 'closeDialog'])

const data = ref({
  statusOptions: null,
  selectedStatusOption: null,
})
let pastorDisable = false
const retiredData = ref({
  initialDate: '',
  finalDate: '',
  selectedPastor: null,
  deadline: null,
  noDeadline: false,
  disable: false,
  pastorDisable: false
})

const cededData = ref({
  localOptions: ['Outra denominação', 'Igreja irmã'],
  local: null,
  where: null,
  selectedPastor: null,
  initialDate: '',
  finalDate: '',
  deadline: '',
  noDeadline: false,
  disable: false,
  pastorDisable: false
})

const traineeData = ref({
  selectedOrganism: null,
  guildingPastor: null,
  selectedPastor: null,
  initialDate: '',
  finalDate: '',
  deadline: null,
  noDeadline: false,
  disable: false,
  pastorDisable: false,
  selectOrganismDisable: false
})

const licenseData = ref({
  licenseOptions: ['Saúde', 'Estudos', 'Interesse', 'Outro'],
  selectedLicenseOption: null,
  selectedPastor: null,
  otherReason: '',
  initialDate: '',
  finalDate: '',
  deadline: '',
  disable: false,
  noDeadline: false,
  pastorDisable: false
})

const studentData = ref({
  goalOptions: ['Intercâmbio', 'Pós-pastoral'],
  selectedGoal: null,
  selectedPastor: null,
  where: '',
  initialDate: '',
  finalDate: '',
  deadline: '',
  noDeadline: false,
  disable: false,
  pastorDisable: false
})

const withoutCallData = ref({
  optionsType: ['Em colóquio', 'Aguardando chamado'],
  selectedPastor: null,
  optionSelected: null,
  initialDate: '',
  finalDate: '',
  deadline: '',
  noDeadline: false,
  disable: false,
  pastorDisable: false
})

const withCallData = ref({
  selectedOrgamism: [],
  selectedPastor: null,
  callOptions: ['Diretoria Nacional', 'Congregação'],
  selectedCallOption: null,
  initialDate: '',
  finalDate: '',
  deadline: '',
  noDeadline: false,
  disable: false,
  pastorDisable: false,
  selectOrganismDisable: false
})

const props = defineProps(['open', 'userId', 'userName', 'organismId', 'organismName'])

onBeforeMount(async () => {
  await getStatusOptions()
  await getNacionalBoardOrganisms()
  await getSisterChurchOrganisms()
  await getOtherDenominationOrganisms()
  await verifyIfIsUserScreen()
  await getOrganismData()
})

function getOrganismData() {
  if( props.organismId && props.organismName) {
    withCallData.value.selectedCallOption = 'Congregação'
    withCallData.value.selectedOrgamism.push({
      nome: props.organismName,
      organismId: props.organismId
    })
    withCallData.value.selectOrganismDisable = true

    traineeData.value.selectedOrganism = {
      nome: props.organismName,
      organismId: props.organismId
    }
    traineeData.value.selectOrganismDisable = true
  }
}

async function verifyIfIsUserScreen() {
  if (props.userId && props.userName) {
    pastorDisable = true
    retiredData.value.selectedPastor = {
      userIdString: props.userId,
      userName: props.userName,
    }
    cededData.value.selectedPastor = {
      userIdString: props.userId,
      userName: props.userName,
    }
    traineeData.value.selectedPastor = {
      userIdString: props.userId,
      userName: props.userName,
    }
    licenseData.value.selectedPastor = {
      userIdString: props.userId,
      userName: props.userName,
      pastorDisable: true    }
    studentData.value.selectedPastor = {
      userIdString: props.userId,
      userName: props.userName,
    }
    withoutCallData.value.selectedPastor = {
      userIdString: props.userId,
      userName: props.userName,
    }
    withCallData.value.selectedPastor = {
      userIdString: props.userId,
      userName: props.userName,
    }
  }
}

async function getStatusOptions() {
  const opt = {
    route: '/desktop/adm/getStatusTypes'
  }
  let r = await useFetch(opt)
  if (r.error) return
  r.data.forEach((status, i) => {
    if (status.value === 'acting') {
      r.data.splice(i, 1)
    }
  })
  data.value.statusOptions = r.data
  data.value.statusOptions.forEach((status, i) => {
    if (status.label === 'Atuação') {
      data.value.statusOptions.splice(i, 1)
    }
  })
}


function changeCededDeadline() {
  if (cededData.value.noDeadline) {
    cededData.value.deadline = 'indefinido',
    cededData.value.disable = true
  } else {
    cededData.value.disable = false
    cededData.value.deadline = ''
  }
}
function changewithCallDeadline() {
  console.log(withCallData.value.noDeadline)
  if (withCallData.value.noDeadline) {
    withCallData.value.deadline = 'indefinido',
    
    withCallData.value.disable = true
  } else {
    withCallData.value.disable = false
    withCallData.value.deadline = ''
  }
}
function changeStudentDeadline() {
  if (studentData.value.noDeadline) {
    studentData.value.deadline = 'indefinido',
    studentData.value.disable = true
  } else {
    studentData.value.disable = false
    studentData.value.deadline = ''
  }
}
function changewithoutCallDeadline() {
  if (withoutCallData.value.noDeadline) {
    withoutCallData.value.deadline = 'indefinido',
    withoutCallData.value.disable = true
  } else {
    withoutCallData.value.disable = false
    withoutCallData.value.deadline = ''
  }
}
function changeTraineeDeadline() {
  if (traineeData.value.noDeadline) {
    traineeData.value.deadline = 'indefinido',
    traineeData.value.disable = true
  } else {
    traineeData.value.disable = false
    traineeData.value.deadline = ''
  }
}
function changeRetiredDeadline() {
  if (retiredData.value.noDeadline) {
    retiredData.value.deadline = 'indefinido',
    retiredData.value.disable = true
  } else {
    retiredData.value.disable = false
    retiredData.value.deadline = ''
  }
}
function changeLicenseDeadline() {
  if (licenseData.value.noDeadline) {
    licenseData.value.deadline = 'indefinido',
    licenseData.value.disable = true
  } else {
    licenseData.value.disable = false
    licenseData.value.deadline = ''
  }
}

function verifyIfCanAddStatus() {
  if (data.value.selectedStatusOption.value === 'retired') {
    if ((retiredData.value.deadline === '' && !retiredData.value.noDeadline) || !retiredData.value.selectedPastor) {
      Notify.create('Preencha o prazo.')
      return
    }
    emits('confirm', data.value.selectedStatusOption.value, retiredData.value)
  } else if (data.value.selectedStatusOption.value === 'license') {
    if (!licenseData.value.selectedLicenseOption || (licenseData.value.selectedLicenseOption === 'Outro' && licenseData.value.otherReason === '') || (licenseData.value.deadline === '' && !licenseData.value.noDeadline) || !licenseData.value.selectedPastor) {
      Notify.create('Preencha o motivo')
      return
    }
    emits('confirm', data.value.selectedStatusOption.value, licenseData.value)
  } else if (data.value.selectedStatusOption.value === 'trainee') {
    console.log('entrou no primeiro if')
    if (!traineeData.value.selectedOrganism || !traineeData.value.guildingPastor || (traineeData.value.deadline === '' && !traineeData.value.noDeadline) || !traineeData.value.selectedPastor) {
      Notify.create('Preencha a congregação, o pastor orientador e o prazo para prosseguir')
      return
    } 
    console.log('emitiu, bora de next')
    emits('confirm', data.value.selectedStatusOption.value, traineeData.value)
  } else if (data.value.selectedStatusOption.value === 'withoutCall') {
    if (!withoutCallData.value.optionSelected || (withoutCallData.value.deadline === '' && !withoutCallData.value.noDeadline) || !withCallData.value.selectedPastor) {
      Notify.create('Preencha a posição do chamado  e o prazo final')
      return
    }
    emits('confirm', data.value.selectedStatusOption.value, withoutCallData.value)
  } else if (data.value.selectedStatusOption.value === 'student') {
    if (!studentData.value.selectedGoal || studentData.value.where === '' || (studentData.value.deadline === '' && ! studentData.value.noDeadline) || !studentData.value.selectedPastor) {
      Notify.create('Preencha a finalidade, o local e o prazo final')
      return
    }
    emits('confirm', data.value.selectedStatusOption.value, studentData.value)
  } else if (data.value.selectedStatusOption.value === 'withCall') {
    if ((withCallData.value.selectedCallOption === 'Congregação' && withCallData.value.selectedOrgamism.length < 0) || !withCallData.value.selectedPastor || (withCallData.value.deadline === '' && !withCallData.value.noDeadline)) {
      Notify.create('Preencha quem chamou o pastor e o prazo final')
      return
    }
    emits('confirm', data.value.selectedStatusOption.value, withCallData.value)
  } else if (data.value.selectedStatusOption.value === 'ceded') {
    if (!cededData.value.local || !cededData.value.where || (cededData.value.deadline === '' && !cededData.value.noDeadline) || !cededData.value.selectedPastor) {
      Notify.create('Preencha qual a igreja, onde e o prazo final')
      return
    }
    emits('confirm', data.value.selectedStatusOption.value, cededData.value)
  }
}

function clearDialogInfo() {

  retiredData.value.initialDate = '';
  retiredData.value.finalDate = '';
  retiredData.value.deadline = null;
  retiredData.value.noDeadline = false;
  retiredData.value.disable = false;
  retiredData.value.pastorDisable = false;

  cededData.value.localOptions = ['Outra denominação', 'Igreja irmã'];
  cededData.value.local = null;
  cededData.value.where = null;
  cededData.value.initialDate = '';
  cededData.value.finalDate = '';
  cededData.value.deadline = '';  
  cededData.value.noDeadline = false;
  cededData.value.disable = false;
  cededData.value.pastorDisable = false;

  traineeData.value.selectedOrganism = null;
  traineeData.value.guildingPastor = null;
  traineeData.value.initialDate = '';
  traineeData.value.finalDate = '';
  traineeData.value.deadline = null;  
  traineeData.value.noDeadline = false;
  traineeData.value.disable = false;
  traineeData.value.pastorDisable = false;
  traineeData.value.selectOrganismDisable = false;

  licenseData.value.licenseOptions = ['Saúde', 'Estudos', 'Interesse', 'Outro'];
  licenseData.value.selectedLicenseOption = null;
  licenseData.value.otherReason = '';
  licenseData.value.initialDate = '';
  licenseData.value.finalDate = '';
  licenseData.value.deadline = '';  
  licenseData.value.disable = false;
  licenseData.value.noDeadline = false;
  licenseData.value.pastorDisable = false;

  studentData.value.goalOptions = ['Intercâmbio', 'Pós-pastoral'];
  studentData.value.selectedGoal = null;
  studentData.value.where = '';
  studentData.value.initialDate = '';
  studentData.value.finalDate = '';
  studentData.value.deadline = '';  
  studentData.value.noDeadline = false;
  studentData.value.disable = false;
  studentData.value.pastorDisable = false;

  withoutCallData.value.optionsType = ['Em colóquio', 'Aguardando chamado'];
  withoutCallData.value.optionSelected = null;
  withoutCallData.value.initialDate = '';
  withoutCallData.value.finalDate = '';
  withoutCallData.value.deadline = ''; 
  withoutCallData.value.noDeadline = false;
  withoutCallData.value.disable = false;
  withoutCallData.value.pastorDisable = false;

  withCallData.value.selectedOrgamism = [];
  withCallData.value.callOptions = ['Diretoria Nacional', 'Congregação'];
  withCallData.value.selectedCallOption = null;
  withCallData.value.initialDate = '';
  withCallData.value.finalDate = '';
  withCallData.value.deadline = '';  
  withCallData.value.noDeadline = false;
  withCallData.value.disable = false;
  withCallData.value.pastorDisable = false;
  withCallData.value.selectOrganismDisable = false;

}

function closeDialog() {
  emits('closeDialog')
  clearDialogInfo()
}

function resetOrganismName() {
  withCallData.value.selectedOrgamism = null
}

async function getOtherDenominationOrganisms() {
  const opt = {
    route: "/desktop/adm/getOtherDenomination",
  };
  let r = await useFetch(opt)
  if (r.error) return
  otherDenomination.value.data = r.data
}
async function getNacionalBoardOrganisms() {
  const opt = {
    route: "/desktop/adm/getNacionalBoardOrganisms",
  };
  let r = await useFetch(opt)
  if (r.error) return
  nacionalBoard.value.data = r.data
}
async function getSisterChurchOrganisms() {
  const opt = {
    route: "/desktop/adm/getSisterChurch",
  };
  let r = await useFetch(opt)
  if (r.error) return
  sisterChurch.value.data = r.data
}

function getFiliatedOrganismsList(val, update, abort) {
  if(val.length < 3) {
    Notify.create('Digite no mínimo 3 caracteres')
    abort()
    return
  }
  const opt = {
    route: "/desktop/adm/getFiliatedOrganismsList",
    body: {
      searchString: val,
      page: 1,
      rowsPerPage: 50
    }
  };
  useFetch(opt).then((r) => {
    update(() => {
      filiatedOrganismsList.value.data = r.data.list;
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
    update(() => {
      pastorList.value.data = r.data.list
    })
  });
}
</script>
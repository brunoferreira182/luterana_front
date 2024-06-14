<template>
  <q-dialog :model-value="props.open" @hide="clearDialog">
    <q-card
      style="width: 300px;"
    >
      <q-card-section class="text-h6 text-center">
        Adicionar atuação para {{ props.userName }}
      </q-card-section>
      <q-card-section>
        <q-select
          class="q-mb-md"
          label="Organismo de chamado"
          use-input
          option-label="nome"
          outlined
          v-model="actingData.organismSelected"
          :disable="actingData.selectOrganismDisable"
        />
        <q-checkbox
          label="Organismo de atuação não faz parte da composição"
          v-model="actingData.otherCompositionActingOrganism"
          @update:model-value="resetSelectedActing"
          class="q-mb-md"
        />
        <q-select
          v-if="!actingData.otherCompositionActingOrganism"
          v-model="actingData.selectedActingOrganism"
          outlined
          label="Nome do organismo de atuação"
          option-label="nome"
          options-dense
          :options="actingOptionsByCallerId.data"
          class="q-mb-md"
          :option-value="(item) => item"
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
          v-else-if="actingData.otherCompositionActingOrganism"
          class="q-mb-md"
          v-model="actingData.selectedActingOrganism"
          outlined
          use-input
          label="Nome do organismo de atuação"
          option-label="nome"
          options-dense
          :options="actingData.organismsListGeneral"
          @filter="getFiliatedOrganismsList"
          :option-value="(item) => item"
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
        <q-checkbox
          label="Ativo"
          v-model="actingData.active"
          class="q-mb-md"
        />
        <q-input
          label="Data de início"
          mask="##/##/####"
          v-model="actingData.initialDate"
          outlined
          class="q-mb-md"
        />
        <q-input
          outlined
          label="Data de término"
          mask="##/##/####"
          v-model="actingData.finalDate"
        />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          label="Voltar"
          color="primary"
          rounded
          flat
          unelevated
          no-caps
          @click="clearDialog"
        />
        <q-btn
          label="Confirmar"
          color="primary"
          rounded
          @click="confirmAddActing"
          unelevated
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>

const emits =  defineEmits(['confirm', 'clearDialog'])
const props = defineProps(['open', 'userName','userId', 'organismName', 'organismId'])

import { onBeforeMount, ref} from 'vue';
import { Notify } from 'quasar';
import useFetch from 'src/boot/useFetch';

onBeforeMount(async () => {
  await putCongregationName()
  await getActingOptionsByCallerId()
  await getOrganismsTypes()
})



function confirmAddActing() {
  if (!actingData.value.organismSelected || !actingData.value.selectedActingOrganism) {
    Notify.create('Preencha o organismo de chamado e atuação para continuar')
    return
  }
  emits('confirm', actingData)
}

function clearDialog() {
  actingData.value = {
    organismSelected: null,
    selectOrganismDisable: true,
    selectedActingOrganism: null,
    otherCompositionActingOrganism: false,
    organismsListGeneral: [],
    active: true,
    initialDate: '',
    finalDate: ''
  }
  emits('clearDialog', true)
}

async function getOrganismsTypes() {
  const opt = {
    route: '/desktop/adm/getOrganismsConfigs'
  }
  let r = await useFetch(opt)
  if (r.error) return
  console.log(r.data, 'caralhos me mordam')
  organismsTypes.value.list = r.data
}

async function getActingOptionsByCallerId() {
  const opt = {
    route: '/desktop/adm/getActingOrganismsByParishId',
    body: {
      callerId: props.organismId
    }
  }
  let r = await useFetch(opt)
  if (r.error) return
  actingOptionsByCallerId.value.data = r.data
}

function putCongregationName() {
  if (props.organismName && props.organismId) {
    actingData.value.organismSelected = {
      nome: props.organismName,
      organismId: props.organismId
    }
  }
}



function resetSelectedActing() {
  actingData.value.selectedActingOrganism = null
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
      actingData.value.organismsListGeneral = r.data.list;
    })
  });
}

const organismsTypes = ref({
  list: []
})

const actingData = ref({
  organismSelected: null,
  selectOrganismDisable: true,
  selectedActingOrganism: null,
  otherCompositionActingOrganism: false,
  organismsListGeneral: [],
  active: true,
  initialDate: '',
  finalDate: ''
})

const actingOptionsByCallerId = ref({
  data: []
})

</script>
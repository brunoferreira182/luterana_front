<template>
  <q-dialog
    :model-value="open"
    @hide="closeDialog"
  >
    <q-card style="border-radius: 1rem; width: 400px">
      <q-card-section>
        <div class="text-h6 text-center">
          Adicionar status pastoral: 
        </div>
      </q-card-section>
      <q-card-section>
        <strong>
          Selecione o status:
        </strong>
        <q-select
          class="q-pa-sm"
          outlined
          use-input
          label="Status"
          :option-label="(item) => item.label"
          :options="props.pastoralStatusTypes.statusTypes"
          v-model="data.status"
          :loading="false"
          :option-value="(item) => item._id"
        />
        <strong>
          Selecione o sub-status:
        </strong>
        <q-select
          class="q-pa-sm"
          outlined
          use-input
          label="Sub-status"
          :option-label="(item) => item.label"
          v-model="data.subStatus"
          :options="props.pastoralStatusTypes.subStatusTypes"
          :loading="false"
          :option-value="(item) => item._id"
        />
        <div>
          <strong>
            Selecione o local:
          </strong>
          <q-select
            class="q-pa-sm"
            outlined
            use-input
            label="Local"
            :option-label="(item) => item.label"
            v-model="data.local"
            :options="props.pastoralStatusTypes.localStatusTypes"
            :loading="false"
            :option-value="(item) => item._id"
          />
        </div>
        <strong v-if="props.route === 'user'">
          Selecione o organismo:
        </strong>
        <strong v-if="props.route === 'organism'">
          Selecione o usuário:
        </strong>
        <q-select
          v-if="props.route === 'user'"
          class="q-pa-sm"
          outlined
          use-input
          label="Nome do organismo"
          :option-label="(item) => item.name"
          v-model="data.organism"
          :options="data.organismList"
          @filter="getOrganisms"
          :loading="false"
          :option-value="(item) => item._id"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Nenhum resultado
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-select
          v-if="props.route === 'organism'"
          class="q-pa-sm"
          outlined
          use-input
          label="Nome do usuário"
          :option-label="(item) => item.userName"
          v-model="data.user"
          :options="data.usersList"
          @filter="getUsers"
          :loading="false"
          :option-value="(item) => item._id"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Nenhum resultado
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <strong>
          Datas:
        </strong>
        <div class="row">
          <q-input 
            type="date" 
            outlined 
            class="col-6 q-pa-sm" 
            label="Ínicio"
            v-model="data.initialDate"
          />
          <q-input 
            type="date" 
            outlined 
            v-model="data.finalDate"
            class="col-6 q-pa-sm"
            label="Fim"
          />
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          no-caps
          label="Sair"
          flat
          @click="closeDialog"
          color="primary"
        />
        <q-btn
          no-caps
          label="Confirmar"
          unelevated
          rounded
          @click="confirm"
          color="primary"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import { ref, watchEffect  } from 'vue'
  import useFetch from "../boot/useFetch";
  const props = defineProps(['open', 'pastoralStatusTypes', 'editStatus', 'route'])
  const emits = defineEmits(['closeDialog', 'confirm'])

  const data = ref({
    organism: null,
    initialDate: '',
    finalDate: '',
    status: null,
    subStatus: null,
    local: null,
    organismList: null,
    usersList: null,
    user: null,
    edit: false,
    editId: ''
  })

  watchEffect (() => {
    if (props.editStatus && data.value.edit !== true) {
      console.log(props.editStatus.userData)
      data.value.organism = props.editStatus.organismData
      data.value.initialDate = props.editStatus.dates.initialDate
      data.value.finalDate = props.editStatus.dates.finalDate 
      data.value.status = props.editStatus.pastoralStatusData.status
      data.value.subStatus = props.editStatus.pastoralStatusData.subStatus
      data.value.local= props.editStatus.pastoralStatusData.local
      data.value.editId = props.editStatus._id
      if (props.editStatus.userData) {
        data.value.user= props.editStatus.userData
        data.value.user.userName = data.value.user.name
      }
      data.value.edit = true
    } else if (data.value.edit !== true) {
      data.value.organism = null
      data.value.initialDate = ''
      data.value.finalDate = ''
      data.value.status = null
      data.value.subStatus = null
      data.value.local= null
      data.value.user = null
      data.value.editId = ''
    }
  })

  function closeDialog () {
    emits('closeDialog')
  }

  function getOrganisms(val, update, abort) {

    if (val.length < 3) {
      abort();
      return;
    }

    const opt = {
      route: '/desktop/adm/getOrganismsListInUser',
      body: {
        searchString: val,
        isActive: 1,
        page: 1,
        rowsPerPage: 50
      }
    };
    useFetch(opt).then((r) => {
      if (r.error) {
          return
      }
      update(() => {
        data.value.organismList = r.data.list;
      })
    });
  }

  function confirm () {
    emits('confirm', data.value.organism, 
    data.value.initialDate, data.value.finalDate, 
    data.value.status, data.value.subStatus, data.value.local,
    data.value.user, data.value.editId
    )
  }

  function getUsers(val, update, abort) {
    if(val.length < 3) {
      abort()
      return
    }
    const opt = {
      route: "/desktop/adm/getUsers",
      body: {
        searchString: val,
        isActive: 1,
        page: 1,
        rowsPerPage: 50
      },
    };
    useFetch(opt).then((r) => {
      update(() => {
        data.value.usersList = r.data.list;
      })
    });
  }
</script>
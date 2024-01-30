<template>
  <q-page-container class="no-padding">
    <q-page >
      
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs align="center">
          <q-breadcrumbs-el 
            style="cursor: pointer;" 
            icon="home" 
            label="Introdução" 
            @click="$router.push('/statistic/introWriteStatisticData')"
          />
            <q-breadcrumbs-el label="Gestão paroquial" />
        </q-breadcrumbs>
      </div>
      <div class="row justify-center q-pa-md">
        <div class="col q-gutter-y-md">
          <div style="border-radius: 1rem; background-color: rgb(245, 245, 245);" class="q-pa-md">
            <q-option-group
              :options="options"
              type="radio"
              v-model="group"
            />
            <q-input
              v-if="group==='outro'"
              label="Outro"
              v-model="other"
            />
          </div>
        </div>
      </div>
      <div class="text-center">
        
        <q-chip
          v-if="validated"
          color="green"
          label="Validado"
          text-color="white"
          icon="done"
        />
  
        <q-chip
          v-if="!validated"
          color="red"
          label="Não Validado"
          text-color="white"
          icon="warning"
        /><br>
  
        <q-btn
          label="Salvar"
          color="primary"
          class="q-my-lg"
          no-caps
          @click="insertParoquialManagementType"
        />
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "src/boot/useFetch";
export default defineComponent({
  name: "ParoquialManagement",
  data() {
    return {
      congregationName:'',
      validated: false,
      status: null,
      other: '',
      group: null,
      options: [
        { label: 'SIPAR', value: 'SIPAR' },
        { label: 'Prover', value: 'Prover', color: 'green' },
        { label: 'Inchurch', value: 'Inchurch', color: 'red' },
        { label: 'F5 Sapi', value: 'F5 Sapi', color: 'yellow-8' },
        { label: 'Não possuo', value: 'Não possuo', color: 'pink-8' },
        { label: 'Outro: Qual', value: 'outro', color: 'purple' }
      ],
    }
  },
  beforeMount() {
    // this.getOrganismNameForBreadCrumbs()
    this.getParoquialManagementType()
  },
  methods: {
    insertParoquialManagementType(){
      const opt = {
        route: "/desktop/statistics/insertParoquialManagementType",
        body:{
          managementType: this.group
        }
      }
      if(this.group === 'outro'){
        opt.body.managementType = this.other
      }
      this.$q.loading.show()
      useFetch(opt).then(() => {
        this.$q.loading.hide()
        this.$q.notify('Salvo com sucesso!')
        this.getParoquialManagementType()
      });
    },
    getParoquialManagementType(){
      const opt = {
        route:'/desktop/statistics/getParoquialManagementType',
        }
        useFetch(opt).then((r)=>{
          if (r.data && r.data.managementType) {
            this.group = r.data.managementType
          }
          if (r.data && r.data.status) {
            this.status = r.data.status
          }
          if (r.data && r.data.validated) {
            this.validated = r.data.validated
          }
        })
    }
  }
})
</script>
<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          Nova função
        </div>
        <div class="col text-right">
          <q-btn
            @click="createFunction"
            rounded
            color="primary"
            unelevated
            no-caps
          >
            Criar função
          </q-btn>
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-around q-pa-md">
        <div class="col-5 q-gutter-md" align="start">
          <div class="text-h5">Tipo de organismo</div>
          <div class="row q-gutter-x-sm q-mx-none">
            <div class="col q-ml-md">
              <q-select
                outlined
                option-label="name"
                :option-value="(item) => item._id"
                emit-value
                map-options
                hint="Informe qual tipo de organismo esta função está atrelada"
                label="Tipo de organismo"
                :options="organismTypesOptions"
                v-model="functionInfo.organismTypeId"
              />
            </div>
          </div>
          <div class="text-h5">Tipo de estrutura</div>
            <q-select
              outlined
              option-label="name"
              @update:model-value="getStructures"
              :option-value="(item) => item._id"
              emit-value
              map-options
              hint="Informe o tipo de estrutura ao qual esta função pertencerá"
              label="Tipo"
              :options="structuresTypeOptions"
              v-model="functionInfo.structureTypeId"
            />
          
          <div class="text-h5">Estrutura</div>
            <q-select
              outlined
              option-label="name"
              :option-value="(item) => item._id"
              emit-value
              map-options
              hint="Informe a estrutura"
              label="Estrutura"
              :options="structuresOptions"
              v-model="functionInfo.structureId"
            />
          
        </div>
        <div class="separator"></div>
        <div class="col-5 q-gutter-md" align="start">
          <div class="text-h5">Nome</div>
          <q-input
            label="Escreva o nome"
            outlined
            hint="Nome da função"
            v-model="functionInfo.name"
          />
          <div class="text-h5">Escreva uma descrição de forma sugestiva</div>
          <div class="row q-gutter-x-sm q-mx-none">
            <div class="col">
              <q-input
                outlined
                class="q-ml-sm"
                autogrow
                hint="Uma descrição completa sobre a função"
                label="Descrição"
                v-model="functionInfo.description"
              />
            </div>
          </div>
          <div class="text-h5">Esta função requer algum título específico?</div>
          <div class="row q-gutter-x-sm q-mx-none">
            <div class="col q-ml-md">
              <q-select
                outlined
                clearable
                option-label="titleName"
                :option-value="(item) => item._id"
                emit-value
                map-options
                label="Título (opcional)"
                :options="titlesOptions"
                v-model="functionInfo.requiredTitleId"
              />
            </div>
          </div>
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: "CreateFunction",
  data() {
    return {
      structuresTypeOptions: [],
      organismTypesOptions: [],
      structuresOptions: [],
      titlesOptions: [],
      functionInfo: {
        name: '',
        description: '',
        structureTypeId: null,
        structureId: null,
        organismTypeId: null,
        requiredTitleId: null
      },
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount(){
    this.getOrganismsTypes()
    this.getStructuresTypes()
    this.getTitleConfigsList()
  },
  methods: {
    getTitleConfigsList () {
      const opt = {
        route: "/desktop/config/getTitleConfigsList",
        body: {
          isActive: 1
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (!r.error) {
          this.titlesOptions = r.data
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    getStructuresTypes() {
      const opt = {
        route: "/desktop/config/getStructuresTypes",
        body: {
          isActive: 1
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (!r.error) {
          this.structuresTypeOptions = r.data
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    getStructures(structureTypeId) {
      console.log(structureTypeId)
      const opt = {
        route: "/desktop/config/getStructures",
        body: {
          structureTypeId,
          isActive: 1
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (!r.error) {
          this.structuresOptions = r.data
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    getOrganismsTypes() {
      const opt = {
        route: "/desktop/config/getOrganismsTypes",
        body: {
          isActive: 1
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (!r.error) {
          this.organismTypesOptions = r.data
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    createFunction() {
      const opt = {
        route: "/desktop/config/createFunction",
        body: {
          functionInfo : this.functionInfo 
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (!r.error) {
          this.$q.notify("Função criada com sucesso!");
          this.functionInfo = {}
          this.$router.push('/config/functionsList')
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    getStructureDetail() {
      const structureId = this.$route.query.structureId
      const opt = {
        route: "/desktop/config/getStructureDetail",
        body: {
          structureId: structureId
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (!r.error) {
          this.functionInfo = r.data.functionInfo
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
  },
});
</script>
<style scoped>

.separator {
  position: fixed;
  top: 68px;
  border-left: 2px solid rgb(216, 216, 216);
  height: 806px;
}
</style>

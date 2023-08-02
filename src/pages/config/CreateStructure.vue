<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          Nova estrutura
        </div>
        <div class="col text-right">
          <q-btn
            @click="createStructure"
            rounded
            color="primary"
            unelevated
            no-caps
          >
            Criar estrutura
          </q-btn>
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-center q-pa-md">
        <div class="col-8 q-gutter-md" align="start">
          <div class="text-h5">Tipo de estrutura</div>
            <q-select
              outlined
              option-label="name"
              :option-value="(item) => item._id"
              emit-value
              map-options
              hint="Informe o tipo de estrutura que você está criando"
              label="Tipo"
              :options="structuresTypeOptions"
              v-model="structureInfo.structureTypeId"
            />
          <div class="text-h5">Tipo de organismo</div>
          <div class="row q-gutter-x-sm q-mx-none">
            <div class="col q-ml-md">
              <q-select
                outlined
                option-label="name"
                :option-value="(item) => item._id"
                emit-value
                map-options
                hint="Informe a qual tipo de organismo essa estrutura pertence"
                label="Tipo de organismo"
                :options="organismTypesOptions"
                v-model="structureInfo.organismTypeId"
              />
            </div>
          </div>
        </div>
        <div class="col-8 q-gutter-md" align="start">
          <div class="text-h5">Nome</div>
          <q-input
            label="Escreva o nome"
            outlined
            hint="Nome da estrutura"
            v-model="structureInfo.name"
          />
          <div class="text-h5">Escreva uma descrição de forma sugestiva</div>
          <div class="row q-gutter-x-sm q-mx-none">
            <div class="col">
              <q-input
                outlined
                class="q-ml-sm"
                autogrow
                hint="Uma descrição completa"
                label="Descrição"
                v-model="structureInfo.description"
              />
            </div>
            
          </div>
          <div class="row">
            <q-checkbox
              class="q-pt-lg"
              v-model="structureInfo.requiredInOrganismCreation"
              label="Estrutura obrigatória ao criar organismo"
            />
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
  name: "CreateStructure",
  data() {
    return {
      structuresTypeOptions: [],
      organismTypesOptions: [],
      structureInfo: {
        name: '',
        description: '',
        structureTypeId: null,
        organismTypeId: null,
        requiredInOrganismCreation: false,
      },
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount(){
    this.getOrganismsTypes()
    this.getStructuresTypes()
  },
  methods: {
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
    createStructure() {
      const opt = {
        route: "/desktop/config/createStructure",
        body: {
          structureInfo: this.structureInfo,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (!r.error) {
          this.$q.notify("Estrutura criada com sucesso!");
          this.structureInfo = {}
          this.$router.push('/config/structuresList')
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
  },
});
</script>

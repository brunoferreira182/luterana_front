<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-capitalize"> 
          <div class="text-h5">
            detalhe do organismo {{ organismName }}
          </div>
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <q-tabs
        v-model="tab"
        dense
        no-caps
        class="text-grey q-py-sm"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="organismData" label="Organismo" />
        <q-tab name="createStructure" label="Estruturas" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated class="q-my-md bg-accent">
        <q-tab-panel name="organismData">
          <div class="row justify-center q-pa-md">
            <div class="col-8 q-gutter-md" align="start">
              <div class="text-h5">Tipo de organismo</div>
              <q-select
                outlined
                label="Tipo de organismo"
                option-label="name"
                :option-value="(item) => item._id"
                emit-value
                readonly
                map-options
                hint="O tipo de organismo que a configuração está aplicada"
                v-model="organismTypeName"
                :options="organismTypesOptions"
              />
              <q-separator v-if="fields.length" />
              <div v-if="fields.length" class="text-h5">
                Dados necessários
              </div>
              <div v-for="(field, i) in fields" :key="i">
                <q-input
                  v-if="field.type.type !== 'boolean'"
                  v-model="field.value"
                  outlined
                  readonly
                  :type="getInputType(field.type.type)"
                  :reverse-fill-mask="field.type.type === 'money'"
                  :prefix="field.type.type === 'money' ? 'R$' : null"
                  :label="field.label + (field.required ? '' : ' (Opcional)')"
                  :mask="field.type.mask"
                  :hint="field.hint"
                />
                <q-checkbox
                  v-else-if="field.type.type === 'boolean'"
                  :label="field.label"
                  v-model="newOrganism[field.model]"
                ></q-checkbox>
              </div>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="createStructure">
          <div class="row justify-end q-px-md">
            <q-btn
              icon="add"
              outline
              rounded
              color="primary"
              no-caps
              @click="dialogAddStructure.open = true"
              label="Adicionar estrutura"
            />
          </div>
          <div class="row justify-around q-gutter-md q-py-md">
            <div
              v-for="sector in structureDetailCards"
              :key="sector"
              class="col-4 q-py-md"
            >
              <q-card class="sector-card bg-grey-1">
                <div class="row justify-end">
                  <div class="col-4">
                    <q-btn 
                      v-if="!sector.structureConfigData.requiredInOrganismCreation"
                      color="red-6" 
                      rounded 
                      outline
                      no-caps
                      label="Deletar"
                      icon="delete" 
                      @click="inactivateOrganismStructureById(sector)"
                    />
                  </div>
                  <div class="col-4">
                    <q-btn
                      rounded
                      color="primary"
                      no-caps
                      unelevated
                      @click="clkEditStructureDetail(sector)"
                      label="Editar detalhe"
                    />
                  </div>
                </div>
                <q-card-section class="q-gutter-sm">
                  <q-select
                    outlined
                    option-label="name"
                    :option-value="(item) => item._id"
                    emit-value
                    map-options
                    readonly
                    hint="Tipo de estrutura que está sendo configurando"
                    label="Tipo"
                    :options="structuresTypeOptions"
                    v-model="sector.structureTypeData.name"
                  />
                  <q-select
                    outlined
                    option-label="name"
                    :option-value="(item) => item._id"
                    emit-value
                    map-options
                    readonly
                    hint="A estrutura que está sendo configurada"
                    label="Estrutura"
                    :options="structuresOptions"
                    v-model="sector.structureConfigData.name"
                  />
                  <q-input
                    filled
                    readonly
                    autogrow
                    v-model="sector.structureData.description"
                    label="Descrição"
                  />
                </q-card-section>
              </q-card>
            </div>
            <q-dialog v-model="dialogAddStructure.open" persistent>
              <q-card class="sector-card bg-grey-1" >
                <q-card-section class="q-gutter-sm">
                  <q-select
                    outlined
                    option-label="name"
                    :option-value="(item) => item._id"
                    emit-value
                    map-options
                    @update:model-value="(e) => getStructures(e, sectorIndex)"
                    hint="Informe o tipo de estrutura que você está configurando"
                    label="Tipo"
                    :options="structuresTypeOptions"
                    v-model="organismData.structureData.structureTypeId"
                  />
                  <q-select
                    outlined
                    option-label="name"
                    :option-value="(item) => item._id"
                    emit-value
                    map-options
                    hint="Informe a estrutura"
                    label="Estrutura"
                    :options="structuresOptions"
                    v-model="organismData.structureData.structureId"
                  />
                  <q-input
                    filled
                    autogrow
                    v-model="organismData.structureData.description"
                    label="Descrição"
                  />
                  <div class="text-center q-gutter-sm">
                    <q-btn
                      flat
                      color="primary"
                      no-caps
                      rounded
                      label="Fechar"
                      @click="dialogAddStructure.open = false"
                    />
                      
                    <q-btn
                      rounded
                      color="primary"
                      no-caps
                      unelevated
                      @click="createOrganismStructure"
                      label="Salvar estrutura"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </q-dialog>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: "OrganismDetail",
  data() {
    return {
      tab: 'organismData',
      structuresTypeOptions: [],
      organismTypesOptions: [],
      structuresOptions: [],
      structureDetailCards: [],
      organismTypeId: null,
      organismName: '',
      organismTypeName: null,
      organism: null,
      fields: [],
      newOrganism: {},
      organismData: {
        structureData: {
          structureId: null,
          description: "",
        },
      },
      dialogAddStructure: {
        open: false,
      },
    };
  },
  mounted() {
    this.getOrganismDetailById();
    this.getOrganismsTypes()
    this.getStructuresTypes()
    this.getStructuresFromOrganism()
  },
  methods: {
    clkEditStructureDetail(sector){
      const organismStructureId = sector._id
      this.$router.push('/admin/OrganismStructureDetail?organismStructureId=' + organismStructureId)
    },
    getStructuresFromOrganism() {
      const organismId = this.$route.query.organismId
      const opt = {
        route: "/desktop/adm/getStructuresFromOrganism",
        body: {
          organismId: organismId
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (!r.error) {
          this.structureDetailCards = r.data
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    inactivateOrganismStructureById(sector) {
      const organismStructureId = sector._id
      const opt = {
        route: "/desktop/adm/inactivateOrganismStructureById",
        body: {
          organismStructureId: organismStructureId
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (!r.error) {
          this.structureDetailCards = r.data
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    getFunctions(sector, sectorIndex) {
      const opt = {
        route: "/desktop/adm/getFunctions",
        body: {
          structureId: sector.structureId,
          isActive: 1
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (!r.error) {
          this.functionsOptions[sectorIndex] = r.data
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    // addStructureData(sector){
    //   const sectors = this.organismData.structureData;
    //   for (let i = 0; i < sectors.length; i++) {
    //     const sector = sectors[i];
    //     if (sector.structureTypeId === null || sector.structureId === null) {
    //       this.$q.notify('Preencha o tipo e a estrutura para prosseguir');
    //       return;
    //     }
    //   }
    //   const structureId = sector.structureId
    //   this.createOrganismStructure()
      
    // },
    createOrganismStructure() {
      if(
        this.organismData.structureData.structureTypeId === null || 
        this.organismData.structureData.structureId === null
      ) {
        this.$q.notify('Preencha o tipo e a estrutura para prosseguir');
        return;
      }
      const organismId = this.$route.query.organismId
      const opt = {
        route: "/desktop/adm/createOrganismStructure",
        body: {
          structureData: this.organismData.structureData,
          organismId: organismId
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (!r.error) {
          this.$q.notify("Estrutura criada com sucesso!");
          this.dialogAddStructure.open = false
          this.organismData.structureData.description = ''
          this.organismData.structureData.structureId = null
          this.organismData.structureData.structureTypeId = null
          this.getStructuresFromOrganism()
          // this.$router.push('/admin/OrganismStructureDetail ?structureId=' + structureId)
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    addSector() {
      this.organismData.structureData = {
        structureTypeId: null,
        structureId: null,
        description: "",
      };
      this.dialogAddStructure.open = true
    },
    addFunction(sectorIndex, sector) {
      

      this.organismData.structureData[sectorIndex].functions.push({
        functionId: ''
      });

      this.getFunctions(sector, sectorIndex);
    },
    getStructures(item, i) {
      console.log(item, i)
      const opt = {
        route: "/desktop/adm/getStructures",
        body: {
          structureTypeId: item,
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
    getOrganismConfigByType() {
      const opt = {
        route: "/desktop/adm/getOrganismConfigByType",
        body: {
          organismTypeId: this.organismTypeId,
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.organismData.fields = r.data.organismFields;
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    getStructuresTypes() {
      const opt = {
        route: "/desktop/adm/getStructuresTypes",
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
        route: "/desktop/adm/getOrganismsTypes",
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.organismTypesOptions = r.data;
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    getOrganismDetailById() {
      const organismId = this.$route.query.organismId
      const opt = {
        route: "/desktop/adm/getOrganismDetailById",
        body: {
          organismId: organismId,
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.organismTypeName = r.data.organismData.organismTypeName
          this.organismName = r.data.organismName
          this.fields = r.data.organismData.fields;
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    getInputType(type) {
      switch (type) {
        case "date":
          return "date";
        case "int":
          return "number";
        default:
          return "text";
      }
    },
  },
});
</script>
<style scoped>
.sector-card {
  height: 150x; 
  width: 400px;
  padding: 10px;
  border-radius: 1rem;
}
</style>

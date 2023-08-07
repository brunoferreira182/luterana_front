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
      <div class="row justify-around q-pa-md">
        <div class="col-7 q-gutter-md" align="start">
          <div class="text-h5">Organismo</div>
          <!-- <q-input
            outlined
            readonly
            label="Tipo de organismo"
            hint="O tipo de organismo que a configuração está aplicada"
            v-model="organismName"
          /> -->
          <q-separator v-if="fields.length" />
          <div v-if="fields.length" class="text-h5">
            Dados
          </div>
          <div v-for="(field, i) in organismData.fields" :key="i">
            <q-input
              v-if="field.type.type !== 'boolean'"
              v-model="field.value"
              outlined
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
        <q-separator vertical class="q-ma-md" />
        <div class="col-4">
          <div class="row">
            <div
              class="text-h5"
            >
              Funções
            </div>
          </div>
          <div v-for="(func, funcIndex) in functions" :key="funcIndex">
            <q-card
              style="border-radius: 1rem"
              class="bg-grey-3 q-ma-sm"
              flat
            >
              <q-item>
                <q-item-section top left>
                  <div class="text-subtitle2 text-capitalize">{{ func.functionName }}</div>
                  <div>Descrição: {{ func.functionDescription }}</div>
                  <div class="text-caption text-grey-7">Título necessário: {{ func.requiredTitle ? func.requiredTitle.titleName : 'nenhum' }}</div>
                </q-item-section>
                <q-item-section top align="right">
                  <div class="text-subtitle2">
                    <q-badge color="orange-8" v-if="func.isRequired">
                      Obrigatório
                    </q-badge>
                  </div>
                </q-item-section>
              </q-item>
              <q-expansion-item
                color="primary"
                class="q-pa-sm"
                icon="group"
                :label="func.users ? `${func.users.length} Participantes` : '0 Participantes'"
                caption="Clique para ver ou adicionar"
              >
                <q-item
                  v-for="(user, userIndex) in func.users"
                  :key="userIndex"
                  style="border-radius: 0.5rem; margin-top: 8px;"
                  class="bg-white"
                  transition="user-bounce"
                >
                  <q-item-section avatar>
                    <q-avatar rounded>
                      <img src="https://cdn.quasar.dev/img/avatar.png" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section class="text-capitalize text-wrap" lines="2">
                    {{ user.userName }}
                    <div class="text-caption text-grey-7">
                      Data Início:
                      {{ formatDate(user.initialDate) }}
                    </div>
                    <div
                      v-if="user.dataFim"
                      class="text-caption text-grey-7"
                    >
                      Data Fim: {{ formatDate(user.dataFim) }}
                    </div>
                  </q-item-section>
                  <q-item-section side>
                    <div class="text-grey-8 q-gutter-xs">
                      <q-btn
                        @click="dialogInsertObservation(user)"
                        class="gt-xs"
                        size="12px"
                        color="secondary"
                        flat
                        dense
                        round
                        icon="library_books"
                      >
                        <q-tooltip> Observações </q-tooltip>
                      </q-btn>
                      <q-btn
                        @click="deleteUserFromFunction(user, funcIndex)"
                        class="gt-xs"
                        size="12px"
                        color="red-8"
                        flat
                        dense
                        round
                        icon="delete"
                      >
                        <q-tooltip> Deletar usuário da função </q-tooltip>
                      </q-btn>
                    </div>
                  </q-item-section>
                </q-item>
                <q-item-section class="q-pa-xs">
                  <q-btn
                    label="Adicionar pessoa"
                    color="primary"
                    dense
                    icon="add"
                    rounded
                    flat
                    no-caps
                    @click="linkUserToFunction(func, funcIndex)"
                  />
                </q-item-section>
              </q-expansion-item>
            </q-card>
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
      organism: null,
      fields: [],
      newOrganism: {},
      organismData: {
        organismConfigId: null,
        fields: [],
      },
      functions: [],
      dialogAddStructure: {
        open: false,
      },
    };
  },
  mounted() {
    this.$q.loading.hide()
  },
  beforeMount(){
    this.getOrganismDetailById();
  },
  methods: {
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
          this.organismName = r.data.organismData.organismName
          this.organismData.fields = r.data.organismData.fields;
          this.functions = r.data.functions
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

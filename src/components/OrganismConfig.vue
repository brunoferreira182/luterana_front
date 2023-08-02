<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div 
          v-if="
            $route.path === '/config/organismConfigDetail'
          "
          class="col-6 text-h5 text-capitalize">{{ organismTypeName }}
        </div>
        <div 
          v-if="
            $route.path === '/config/CreateOrganismsConfig'
          "
          class="col-6 text-h5 text-capitalize">Criar configuração de organismo
        </div>
        <div class="col text-right">
          <q-btn
            v-if="
              organismTypeId || $route.path === '/config/organismConfigDetail'
            "
            @click="clkSaveConfig"
            rounded
            color="primary"
            unelevated
            no-caps
          >
            {{
              $route.path === "/config/organismConfigDetail"
                ? "Salvar"
                : "Criar"
            }}
            configuração
          </q-btn>
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-center q-pa-md">
        <div class="col-8 q-gutter-md" align="start">
          <div 
            class="text-h5" 
            v-if="$route.path !== '/config/organismConfigDetail'">
            Selecione o Tipo de organismo
          </div>
          <div 
            class="text-h5" 
            v-if="$route.path === '/config/organismConfigDetail'">
            Tipo de organismo
          </div>
          <q-select
            v-if="$route.path !== '/config/organismConfigDetail'"
            outlined
            label="Tipo de organismo"
            option-label="name"
            :option-value="(item) => item._id"
            emit-value
            map-options
            hint="Informe o tipo de organismo que a configuração será aplicada para prosseguir"
            v-model="organismTypeId"
            :options="organismTypesOptions"
          />
          <q-input
            v-else
            readonly
            outlined
            label="Tipo de organismo"
            v-model="selectedType"
          />
          <q-separator
            v-if="
              organismTypeId ||
              $route.path === '/config/organismConfigDetail'
            "
          />
          <div
            class="text-h5"
            v-if="
              organismTypeId ||
              $route.path === '/config/organismConfigDetail'
            "
          >
            Adicione os campos de preenchimento
          </div>
          <div
            v-if="
              organismTypeId ||
              $route.path === '/config/organismConfigDetail'
            "
            class="row q-gutter-x-sm q-mx-none"
          >
            <div class="col">
              <q-input
                outlined
                class="q-ml-sm"
                hint="Nome do dado que será solicitado na hora do cadastro do organismo"
                label="Novo dado"
                v-model="newField.label"
              />
            </div>
            <div class="col">
              <q-input
                outlined
                hint="Descrição abaixo do campo para facilitar entendimento"
                label="Dica"
                v-model="newField.hint"
              />
            </div>
            <div class="col">
              <q-select
                outlined
                hint="O tipo do dado"
                label="Tipo de dado"
                option-label="label"
                :options="fieldTypesOptions"
                v-model="newField.type"
              />
            </div>
          </div>

          <q-checkbox
            v-if="
              organismTypeId ||
              $route.path === '/config/organismConfigDetail'
            "
            class="q-pt-lg"
            v-model="newField.required"
            label="Preenchimento Obrigatório"
          />
          <q-checkbox
            :disable="
              newField.type ? newField.type.type === 'boolean' : false
            "
            v-if="
              organismTypeId ||
              $route.path === '/config/organismConfigDetail'
            "
            class="q-pt-lg"
            v-model="newField.multiple"
            label="Campo múltiplo"
          />
          <div
            v-if="
              organismTypeId ||
              $route.path === '/config/organismConfigDetail'
            "
            class="row justify-center"
          >
            <q-btn
              label="Adicionar campo"
              no-caps
              rounded
              unelevated
              @click="addField"
              color="primary"
            />
          </div>
          <q-separator
            v-if="
              organismTypeId ||
              $route.path === '/config/organismConfigDetail'
            "
          />
          <div
            v-if="
              organismTypeId ||
              $route.path === '/config/organismConfigDetail'
            "
            class="text-h5"
          >
            Visualização
          </div>
          <div
            v-if="
              organismTypeId ||
              $route.path === '/config/organismConfigDetail'
            "
          >
            <div
              v-for="(field, i) in organismFields"
              :key="i"
              class="q-my-md"
            >
              <div class="row q-gutter-sm items-center">
                <div class="col">
                  <q-input
                    readonly
                    :label="field.label"
                    :hint="field.hint"
                    outlined
                  >
                    <template
                      v-slot:append
                      v-if="
                        field.multiple &&
                        $route.path === '/config/organismConfigDetail'
                      "
                    >
                      <q-btn
                        disabled
                        icon="add"
                        color="primary"
                        flat
                        round
                        @click="addMultipleField"
                      >
                        <q-tooltip
                          >Adicionar multiplo
                          {{ field.type.label }}</q-tooltip
                        >
                      </q-btn>
                    </template>
                  </q-input>
                </div>
                <div class="col-2 q-mb-md">
                  <q-badge class="q-pa-xs">{{
                    organismFields[i].type.label
                  }}</q-badge
                  ><br />
                  <q-badge color="orange" class="q-pa-xs">
                    {{ field.required ? "obrigatório" : "opcional" }}
                  </q-badge>
                </div>
                <div class="col-1">
                  <q-btn
                    icon="delete"
                    size="large"
                    class="q-mb-md"
                    rounded
                    @click="organismFields.splice(i, 1)"
                    flat
                    color="primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import useFetch from "../boot/useFetch";
export default defineComponent({
  name: "OrganismsConfig",
  data() {
    return {
      organismTypesOptions: [],
      fieldTypesOptions: [],
      organismTypeName: '',
      titlesList: [],
      organismTypeId: null,
      typeSelected: null,
      valueSelected: "",
      tab: "createConfig",
      dialogConfirmMultipleFields: {
        open: false,
      },
      
      organismFields: [
        {
          label: "Nome",
          type: {
            _id: "64ad55727cb57d0bd22b10d5",
            type: "string",
            label: "Texto",
          },
          hint: "Informe o nome",
          required: true,
          model: "nome",
        },
        {
          label: "Data de criação",
          type: {
            _id: "64ad55ce7cb57d0bd22b10d9",
            type: "date",
            label: "Data",
          },
          hint: "Data de criação do organismo",
          required: true,
          model: "data_de_criacao",
        },
      ],
      newField: {
        label: null,
        type: null,
        hint: null,
        required: true,
        multiple: false,
      },
      selectedType: "",
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    if (this.$route.path === "/config/organismConfigDetail") {
      this.getOrganismConfigById();
    } else {
      this.getOrganismsTypes();
    }
    
    this.getTitlesByStatus();
    this.getFieldTypes();
  },
  methods: {
    addField() {
      if (
        this.newField.label &&
        this.newField.hint &&
        (this.organismTypeId ||
          this.$route.path === "/config/organismConfigDetail")
      ) {
        this.organismFields.push({ ...this.newField });
        this.newField.label = null;
        this.newField.hint = null;
        this.newField.type = null;
        this.newField.required = true;
        this.newField.multiple = false;
        return;
      }
      this.$q.notify("preencha todos os dados antes de adicionar um campo");
    },
    addMultipleField() {
      this.dialogConfirmMultipleFields.open = false;
      this.userData.generalData.phones.push(this.valueSelected);
      this.newPhone = "";
      this.typeSelected = null;
    },
    getTitlesByStatus() {
      const opt = {
        route: "/desktop/adm/getTitlesByStatus",
        body: {
          isActive: 1,
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.titlesList = r.data.list;
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    getOrganismsTypes() {
      const opt = {
        route: "/desktop/config/getOrganismsTypes",
        body: {
          isActive: 1,
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.organismTypesOptions = r.data;
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    getFieldTypes() {
      const opt = {
        route: "/desktop/config/getDataTypesList",
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.fieldTypesOptions = r.data;
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },

    createOrganismsConfig() {
      const opt = {
        route: "/desktop/config/createOrganismsConfig",
        body: {
          organismTypeId: this.organismTypeId,
          organismFields: this.organismFields,
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.$q.notify("Organismo cadastrado com sucesso!");
          this.position = "";
          this.multiple = "";
          this.organismName = "";
          this.$router.push('/config/organismConfigurationList')
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    updateOrganismConfig() {
      const _id = this.$route.query._id;
      const opt = {
        route: "/desktop/config/updateOrganismConfig",
        body: {
          organismConfigId: _id,
          organismFields: this.organismFields,
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.$q.notify("Os campos foram atualizados com sucesso!");
          this.$router.push('/config/organismConfigurationList')
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    getOrganismConfigById() {
      const _id = this.$route.query._id;
      const opt = {
        route: "/desktop/config/getOrganismConfigById",
        body: {
          _id: _id,
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.organismTypeName = r.data.organismTypeName;
          this.organismFields = r.data.organismFields;
          this.selectedType = r.data.organismTypeName;
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    clkSaveConfig() {
      if (this.$route.path === "/config/organismConfigDetail") {
        this.updateOrganismConfig();
      } else {
        this.createOrganismsConfig();
      }
    },
  },
});
</script>


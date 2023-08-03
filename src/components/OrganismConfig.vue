<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div 
          v-if="
            $route.path === '/config/organismConfigDetail'
          "
          class="col-6 text-h5 text-capitalize">{{ organismConfigName }}
        </div>
        <div 
          v-if="
            $route.path === '/config/CreateOrganismsConfig'
          "
          class="col-6 text-h5 text-capitalize">Criar configuração de organismo
        </div>
        <div class="col text-right">
          <q-btn
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
        <div class="col-7 q-gutter-md" align="start">
          <div
            class="text-h5"
          >
            Nome
          </div>
          <q-input
            :readonly="$route.path === '/config/organismConfigDetail'"
            outlined
            label="Tipo de organismo"
            hint="Informe o tipo de organismo que a configuração será aplicada para prosseguir"
            v-model="organismConfigName"
          />
          <q-separator
          />
          <div
            class="text-h5"
          >
            Adicione os campos de preenchimento
          </div>
          <div
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
            class="q-pt-lg"
            v-model="newField.required"
            label="Preenchimento Obrigatório"
          />
          <q-checkbox
            :disable="
              newField.type ? newField.type.type === 'boolean' : false
            "
            class="q-pt-lg"
            v-model="newField.multiple"
            label="Campo múltiplo"
          />
          <div
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
          />
          <div
            class="text-h5"
          >
            Visualização
          </div>
          <div
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
        <q-separator class="q-mx-md" vertical/>
        <div class="col-4">
          <div class="row">
            <div
              class="text-h5"
            >
              Funções
            </div>
            <q-btn
              @click="newFunctionDialog = true"
              class="q-mx-md"
              label="Adicionar"
              rounded
              flat
              color="primary"
              no-caps
              icon-right="add"
            />
          </div>
          <q-item
            style="border-radius: 1rem"
            class="bg-grey-3 q-ma-sm q-pa-md"
            v-for="(item,i) in functions" 
            :key="i"
          >
            <q-item-section>
              <div class="text-subtitle2">{{ item.name }}</div>
              <div>Descrição: {{ item.description }}</div>
              <div class="text-caption text-grey-7">
                Título necessário: {{ item.requiredTitle ? item.requiredTitle.titleName : 'nenhum' }}
              </div>
            </q-item-section>
            <q-item-section top side>
              <div>
                <q-btn
                  flat
                  color="primary"
                  icon="edit"
                  dense
                  size="sm"
                  @click="editFunction(item)"
                />
                <q-btn
                  flat
                  dense
                  color="red-9"
                  icon="delete"
                  size="sm"
                  @click="deleteFunction(item)"
                />
              </div>
            </q-item-section>
          </q-item>
        </div>
      </div>
      <q-dialog v-model="newFunctionDialog" @hide="functionDialogClosed">
        <q-card style="border-radius: 1rem; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">Nova função</div>
          </q-card-section>
          <q-card-section>
            <div class="q-gutter-md">
              <q-input
                label="Escreva o nome"
                outlined
                hint="Nome da função"
                v-model="newFunction.name"
              />
              <q-input
                outlined
                autogrow
                hint="Uma descrição completa sobre a função"
                label="Descrição"
                v-model="newFunction.description"
              />
              <q-select
                outlined
                clearable
                option-label="titleName"
                emit-value
                map-options
                label="Título (opcional)"
                :options="titlesOptions"
                v-model="newFunction.requiredTitle"
              />
              <q-checkbox
                label="Obrigatória?"
                v-model="newFunction.isRequired"
              />
            </div>
          </q-card-section>
          <q-card-actions align="center" class="q-mb-md">
            <q-btn
              flat
              label="Depois"
              no-caps
              color="primary"
              @click="newFunctionDialog = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="addFunction"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
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
      fieldTypesOptions: [],
      organismConfigName: '',
      typeSelected: null,
      valueSelected: "",
      tab: "createConfig",
      newFunctionDialog: false,
      newFunction: {
        name: '',
        description: '',
        requiredTitle: null,
        isRequired: true
      },
      functions: [],
      titlesOptions: [],
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
    
    this.getTitleConfigsList();
    this.getFieldTypes();
  },
  methods: {
    addField() {
      if (
        this.newField.label &&
        this.newField.hint &&
        (this.organismConfigName ||
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
      this.userData.generalData.phones.push(this.valueSelected);
      this.newPhone = "";
      this.typeSelected = null;
    },
    getTitleConfigsList() {
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
    getOrganismsTypes() {
      const opt = {
        route: "/desktop/config/getOrganismsTypes",
        body: {
          isActive: 1,
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.organismConfigNamesOptions = r.data;
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
          organismConfigName: this.organismConfigName,
          organismFields: this.organismFields,
          functions: this.functions
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.$q.notify("Organismo cadastrado com sucesso!");
          this.multiple = "";
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
          this.organismConfigName = r.data.organismConfigName;
          this.organismFields = r.data.organismFields;
          this.functions = r.data.functions
          this.selectedType = r.data.organismConfigName;
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
    addFunction () {
      if (this.newFunction.name && this.newFunction.description) {
        this.functions.push({...this.newFunction})
        this.newFunctionDialog = false
      } else this.$q.notify('preencha os campos obrigatórios!')
    },
    functionDialogClosed () {
      this.newFunction = {
        name: '',
        description: '',
        requiredTitle: null,
        isRequired: true,
      }
    }
  },
});
</script>
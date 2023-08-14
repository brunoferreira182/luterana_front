<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div 
          class="col-6 text-h5 text-capitalize">Formulário {{ formConfigName }}
        </div>
        <div class="col text-right">
          <q-btn
            @click="updateForm"
            rounded
            color="primary"
            unelevated
            no-caps
          >
            {{
              $route.path === "/config/formConfigDetail"
                ? "Salvar"
                : "Criar"
            }}
            configuração
          </q-btn>
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-around q-pa-md">
        <div class="col-7 q-gutter-md" align="start">
          <div
            class="text-h5"
          >
            Informações 
          </div>
          <q-select
            outlined
            label="Configuração de organismo"
            option-label="organismConfigName"
            :option-value="(item) => item._id"
            emit-value
            map-options
            hint="Informe a qual configuração de organismo pertencerá esse formulário"
            v-model="organismConfigId"
            :options="organismConfigOptions"
          />
          <q-input
            :readonly="$route.path === '/config/organismConfigDetail'"
            outlined
            label="Nome da configuração"
            v-model="formConfigName"
            hint="Informe qual será o nome da configuração deste formulário"
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
              v-for="(field, i) in formFields"
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
                    formFields[i].type.label
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
                    @click="formFields.splice(i, 1)"
                    flat
                    color="primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <q-separator vertical />
        <div class="col-4">
          <div class="text-grey-8 text-h6 q-px-xs">Visões:</div>
          <div class="text-caption text-grey-8 q-px-sm">
            Selecione quais visões terão acesso a este formulário
          </div>
          <div class="visions-field q-mt-none row">
            <div
              v-for="(vision, i) in visionsList"
              :key="i"
              class="col-12 q-my-xs"
            >
              <q-checkbox 
                :label="vision.name"
                :val="vision"
                v-model="visions"
              >
                <div class="text-caption text-grey-7">
                  {{ vision.description }}
                </div>
              </q-checkbox>
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
  name: "FormConfigDetail",
  data() {
    return {
      fieldTypesOptions: [],
      visions: [],
      formFields: [
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
          hint: "Data de criação do formulário",
          required: true,
          model: "data_de_criacao",
        },
      ],
      formConfigName: '',
      newField: {
        label: null,
        type: null,
        hint: null,
        required: true,
        multiple: false,
      },
      selectedType: "",
      visionsList: [],
      organismConfigId: '',
      organismConfigName: '',
      organismConfigOptions: [],
      checkedVisionsList: []
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  created(){
    this.getVisions()
    this.getFormDetailById()
  },
  beforeMount() {
    this.getFieldTypes()
    this.getOrganismsConfigs()
  },
  methods: {
    getOrganismsConfigs() {
      const opt = {
        route: "/desktop/config/getOrganismsConfigs",
        body: {
          isActive: 1,
        },
      };
      useFetch(opt).then((r) => {
        this.organismConfigOptions = r.data;
      });
    },
    getVisions() {
      const opt = {
        route: "/desktop/config/getVisions",
        body: {
          isActive: 1,
        },
      };
      useFetch(opt).then((r) => {
        this.visionsList = r.data.map(vision => {
          return {
            name: vision.visionInfo.name,
            visionId: vision._id, 
            description: vision.visionInfo.description
          }
        });
      });
    },
    getFormDetailById() {
      const formId = this.$route.query.formId
      const opt = {
        route: "/desktop/config/getFormDetailById",
        body: {
          formId: formId
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.formConfigName = r.data.formName
          this.organismConfigId = r.data.organismConfigId
          this.formFields = r.data.formFields
          this.checkedVisionsList = r.data.visions
          this.checkedVisionsList.forEach((check,i) => {
            this.visionsList.forEach(vision => {
              if (check.visionId === vision.visionId) {
                this.visions[i] = vision 
              }
            })
          })
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    updateForm() {
      const formId = this.$route.query.formId
      // if(this.organismTypeId === '' || this.organismConfigName === '' || this.functions.length === 0){
      //   this.$q.notify('Preencha o tipo de organismo, o nome da configuração e insira uma função para prosseguir')
      //   return
      // }
      const opt = {
        route: "/desktop/config/updateForm",
        body: {
          formId: formId,
          formName: this.formConfigName,
          formFields: this.formFields,
          visions: this.visions
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.$q.notify("Configuração de formulário atualizado com sucesso!");
          this.multiple = "";
          this.$router.push('/config/formConfigList')
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
    addField() {
      if (   this.newField.label &&
          this.newField.hint &&  
          ( this.formConfigName ||  
          this.$route.path === "/config/formConfigDetail")
      ) {
        this.formFields.push({ ...this.newField });
        this.newField.label = null;
        this.newField.hint = null;
        this.newField.type = null;
        this.newField.required = true;
        this.newField.multiple = false;
        return;
      }
      this.$q.notify("preencha todos os dados antes de adicionar um campo");
    },
  },
});
</script>
<style scoped>
.visions-field {
  border: 1px solid #c2c2c2;
  padding: 7px;
  border-radius: 0.2rem;
  max-height: 300px;
  overflow-y: auto;
}
</style>
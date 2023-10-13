<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div 
          class="col-6 text-h5 text-capitalize">{{ formConfigName }}
          <div class="text-caption">
            Formulário
          </div>
        </div>
        <div class="col text-right">
          <q-btn
            @click="updateForm"
            rounded
            color="primary"
            unelevated
            class="q-pa-sm"
            icon="bookmark"
            no-caps
          >
            {{
              $route.path === "/config/formConfigDetail"
                ? "Salvar"
                : "Criar"
            }}
            Configuração
          </q-btn>
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-around q-pa-md">
        <div class="col-7 q-gutter-md" align="start">
          <div
            class="text-h5"
          >
            Informações e filtros
          </div>
          <q-select
            outlined
            label="Filtro de formulário"
            option-label="label"
            :option-value="(item) => item"
            emit-value
            map-options
            hint="Selecione o filtro de destinatários para prosseguir"
            v-model="filterType"
            :options="filterDestinataries"
          />
          
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
          <div class="text-h5">
            Nome do formulário
          </div>
          <q-input
            :readonly="$route.path === '/config/organismConfigDetail'"
            outlined
            label="Nome"
            v-model="formConfigName"
            hint="Informe qual será o nome da configuração deste formulário"
          />
          <div class="text-h5">
            Vigência do formulário
          </div>
          <q-select
            outlined
            label="Vigência de formulário"
            option-label="label"
            emit-value
            map-options
            :option-value="(item) => item"
            v-model="formDatesSelected.formType.type"
            hint="Informe o tempo de preenchimento do formulário"
            :options="formDates"
          />
          <q-select
            v-if="formDatesSelected.formType.type === 'weekly'"
            outlined
            v-model="formDatesSelected.dayOfWeek"
            label="Dia da semana"
            option-label="label"
            hint="Escolha o dia da semana"
            :option-value="(item) => item"
            emit-value
            map-options
            :options="daysOfTheWeek"
            type="date"
          />
          <q-input
            outlined
            v-if="formDatesSelected.formType.type === 'yearly'"
            label="Data fim"
            mask="##/##"
            hint="Digite uma data no formato DD/MM"
            v-model="formDatesSelected.finalDate1"
          />
          <div 
            v-else-if="formDatesSelected.formType.type === 'monthly'"
            class="row justify-between" 
          >
            <div class="col">
              <q-select
                outlined
                label="Dia do mês"
                v-model="formDatesSelected.finalDate1"
                :options="dayOfMonthOptions"
              />
            </div>
          </div>
          <div 
            v-else-if="formDatesSelected.formType.type === 'semester'"
            class="row justify-between" 
          >
            <div class="col-6">
              <q-input
                outlined
                label="Data 1"
                mask="##/##"
                hint="Digite uma data no formato DD/MM"
                v-model="formDatesSelected.finalDate1"
                class="q-mr-xs"
              />
            </div>
            <div class="col-6">
              <q-input
                outlined
                label="Data 2"
                mask="##/##"
                hint="Digite uma data no formato DD/MM"
                v-model="formDatesSelected.finalDate2"
                class="q-ml-xs"
              />
            </div>
          </div>
          <div class="text-h5">
            Vincular formulário
          </div>
          <q-select
            outlined
            label="Vínculo"
            option-label="label"
            emit-value
            map-options
            :option-value="(item) => item.type"
            v-model="formAttachSelected"
            hint="Há uma conexão deste formulário com um usuário ou organismo?"
            :options="attachUserAndOrganism"
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
          <div v-if="formFields.length">
            <div class="text-h5">Visualização</div>
            <div
              v-for="(field, i) in formFields"
              :key="i"
              class="q-my-md"
            >
              <div class="row q-gutter-sm items-center">
                <div class="col">
                  <q-input
                    v-if="field.type.type !== 'wisiwig'"
                    readonly
                    :label="field.label"
                    :hint="field.hint"
                    outlined
                  >
                    <template
                      #append
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
                          {{ field.type.label }}
                          </q-tooltip
                        >
                      </q-btn>
                    </template>
                  </q-input>
                  <q-editor 
                    v-if="field.type.type === 'wisiwig'"
                    v-model="field.value" 
                    min-height="5rem" 
                  />
                  <q-uploader
                    v-if="field.type.type === 'image'"
                    style="max-width: 300px"
                    url="http://localhost:4444/upload"
                    label="Filtered (png only)"
                    multiple
                    :filter="checkFileType"
                    @rejected="onRejected"
                  />
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
      formFields: [],
      filterType: null,
      attachUserAndOrganism: [
        { label: 'Usuário', type: 'user'},
        { label: 'Organismo', type: 'organism' }
      ],
      daysOfTheWeek: [
        { label: 'Domingo', value: 1 },
        { label: 'Segunda-feira', value: 2 },
        { label: 'Terça-feira', value: 3 },
        { label: 'Quarta-feira', value: 4 },
        { label: 'Quinta-feira', value: 5 },
        { label: 'Sexta-feira', value: 6 },
        { label: 'Sábado', value: 7 }
      ],
      dayOfWeek: null,
      formDatesSelected: {
        formType: {
          type: null
        },
        finalDate1: '',
        finalDate2: '',
      },
      formDates:[
        {
          label: 'Sem vigência',
          type: 'none',
          selected: false
        }, 
        {
          label: 'Diário',
          type: 'daily',
          selected: false
        }, 
        {
          label: 'Semanal',
          type: 'weekly',
          selected: false
        },
        {
          label: 'Mensal',
          type: 'monthly',
          selected: false
        }, 
        {
          label: 'Semestral',
          type: 'semester',
          selected: false
        },
        {
          label: 'Anual',
          type: 'yearly',
          selected: false
        }
      ],
      formConfigName: '',
      formConfigs: {},
      newField: {
        label: null,
        type: null,
        hint: null,
        required: true,
        multiple: false,
      },
      filterDestinataries: [
        {
          label: 'Tipo de organismo',
          type: 'byOrganismType'
        },
        {
          label: 'Organismo',
          type: 'byOrganism'
        },
        {
          label: 'Função',
          type: 'byFunction'
        },
      ],
      formConfigType: [
        {
          label: 'Entrada em organismo',
          type: 'enterOrganism',
          selected: false
        }, 
        {
          label: 'Troca de função',
          type: 'switchFunction',
          selected: false
        }
      ],
      formType: null,
      visionsList: [],
      organismConfigId: '',
      organismConfigName: '',
      organismConfigOptions: [],
      checkedVisionsList: []
    };
  },
  async created() {
    await this.getVisions();
    this.getFormDetailById();
  },
  beforeMount() {
    this.getFieldTypes()
    this.getOrganismsConfigs()
  },
  mounted(){
    this.$q.loading.hide();
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
    async getVisions() {
      const opt = {
        route: "/desktop/config/getVisions",
        body: {
          isActive: 1,
        },
      };
      try {
        const r = await useFetch(opt);
        this.visionsList = r.data.map((vision) => {
          return {
            name: vision.visionInfo.name,
            visionId: vision._id,
            description: vision.visionInfo.description,
          };
        });
      } catch (error) {
        this.$q.notify("Erro ao buscar visões:", error);
      }
      return this.visionsList;
    },
    async getFormDetailById() {
      const formId = this.$route.query.formId;
      const visionsList = await this.getVisions();
      const opt = {
        route: "/desktop/config/getFormDetailById",
        body: {
          formId: formId,
        },
      };
      try {
        const r = await useFetch(opt);
        this.formConfigName = r.data.formName;
        this.formConfig = r.data.configs;
        this.formDatesSelected.formType.type = r.data.configs.recurrency.label;
        this.filterType = r.data.configs.recurrency.type
        this.organismConfigId = r.data.filters.organismsConfigs;
        this.dayOfWeek = r.data.configs.recurrency.rule.label
        this.formFields = r.data.fields;
        this.formType = r.data.formType;
        this.checkedVisionsList = r.data.filters.visions;
        this.checkedVisionsList.forEach((check, i) => {
          visionsList.forEach((vision) => {
            if (check === vision.visionId) {
              this.visions[i] = vision;
              return;
            }
          });
        });
      } catch (error) {
        this.$q.notify("Erro ao buscar detalhes do formulário", error);
      }
    },
    updateForm() {
      const formId = this.$route.query.formId
      const opt = {
        route: "/desktop/config/updateForm",
        body: {
          formId: formId,
          organismConfigId: this.organismConfigId,
          formName: this.formConfigName,
          formFields: this.formFields,
          visions: this.visions
        },
      };
      if(this.noOrganism === true){
        opt.body.organismConfigId = this.noOrganismConfig
        opt.body.visions = []
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.$q.notify("Configuração de formulário atualizado com sucesso!");
          this.multiple = "";
          this.$router.push('/config/formConfigList')
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
        this.noOrganism = false;
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
<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div 
          v-if="
            $route.path === '/config/organismConfigDetail'
          "
          class="col-6 text-h5 text-capitalize">{{ formConfigName }}
        </div>
        <div 
          v-if="
            $route.path === '/config/CreateFormConfig'
          "
          class="col-6 text-h5 text-capitalize">Criar formulário
        </div>
        <div class="col text-right">
          <q-btn
            @click="createFormConfig"
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
            formulário
          </q-btn>
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-around q-pa-md" >
        <div class="col-7 q-gutter-md" align="start">
          <div class="text-h5 q-px-md">
            Informações 
          </div>
          <q-select
            class="q-pl-md"
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
          <div v-if="filterType" class="q-gutter-md">
            <q-select
              v-if="filterType.type === 'byOrganismType' || filterType.type === 'byFunctionConfig'"
              outlined
              label="Configuração de organismo"
              option-label="organismConfigName"
              :option-value="(item) => item._id"
              map-options
              emit-value
              use-chips
              multiple
              @filter="getOrganismsNamesBySearchString"
              hint="Informe a qual configuração de organismo pertencerá esse formulário"
              v-model="organismConfigId"
              :options="organismConfigOptions"
            />
            <q-select
              v-if="filterType.type === 'byOrganism' "
              v-model="organismSelected"
              outlined
              label="Nome do organismo"
              option-label="organismName"
              hint="Selecione uma configuração para exibir relacionados"
              :options="organismsNames"
              emit-value
              map-options
              use-chips
              multiple
              use-input
              @filter="getOrganismsNamesBySearchString"
              :option-value="(item) => item._id"
            />
            <q-select
              v-if="filterType.type === 'byFunctionConfig'"
              v-model="functionsSelected"
              outlined
              label="Funções"
              option-label="organismFunctionConfigName"
              hint="Selecione o filtro de funções"
              @focus="getOrganismFunctionConfigNames"
              :options="functionsNames"
              use-chips
              multiple
              :option-value="(item) => item._id"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.organismFunctionConfigName }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.organismConfigName }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-input
              :readonly="$route.path === '/config/organismConfigDetail'"
              outlined
              label="Nome do formulário"
              v-model="formConfigName"
              hint="Informe qual será o nome da configuração deste formulário"
            />
            <div class="text-h5">
              Selecione a vigência do formulário
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
              v-if="formDatesSelected.formType.type && formDatesSelected.formType.type.type === 'weekly'"
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
              v-if="formDatesSelected.formType.type && formDatesSelected.formType.type.type === 'yearly'"
              label="Data fim"
              mask="##/##"
              hint="Digite uma data no formato DD/MM"
              v-model="formDatesSelected.finalDate1"
            />
            <div 
              v-else-if="formDatesSelected.formType.type && formDatesSelected.formType.type.type === 'monthly'"
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
              v-else-if="formDatesSelected.formType.type && formDatesSelected.formType.type.type === 'semester'"
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
            <div
              class="q-mt-xl"
              v-if="newField.type ? newField.type.type === 'options' : false" 
            >
            <q-input
              outlined
              label="Opção" 
              v-model="newOptionValue[0].newValue"
            >
              <q-btn icon="add" flat @click="addOptionValue"></q-btn>
            </q-input>
            <q-chip
              v-for=" option, i  in newField.options"
              :key="option"
              color="primary"
              text-color="white"
            >
              {{ option }}
              <q-btn
                size="sm"
                icon="close"
                padding="none"
                rounded
                class="q-ml-sm"
                @click="newField.options.splice(i, 1)"
                >
              </q-btn>
            </q-chip>
            </div>
            <div
              v-for="(field) in formFields"
              :key="field"
            >
            </div>
            <div>
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
            </div>
          </div>
          <q-separator 
            v-if="formFields.length"
          />
          <div
            v-if="formFields.length"
            class="text-h5"
          >
            Visualização
          </div>
          <div
            v-if="filterType"
          >
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
                        {{ field.type.label }}</q-tooltip
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
              <div
                v-if="field.type.type === 'options'"
              >
                <q-chip
                  v-for="option in field.options"
                  :key="option"
                >
                  {{ option }}
                </q-chip>
              </div>
            </div>
          </div>
        </div>
        <q-separator vertical v-if="filterType"/>
        <div class="col-4" v-if="filterType">
          <div class="text-grey-8 text-h6 q-px-xs">Visões:</div>
          <div class="text-caption text-grey-8 q-px-sm">
            Selecione quais visões terão acesso a este formulário, 
          </div>
          <div class="visions-field q-mt-none row">
            <div
              v-for="(vision,i) in visionsList"
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
import { defineComponent, ref } from "vue";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: "CreateFormConfig",
  data() {
    return {
      newOptionValue: [
        {newValue: ''}
      ],
      fieldTypesOptions: [],
      organismConfigId: ref([]),
      visions: [],
      formFields: [],
      organismSelected: [],
      functionsSelected: [],
      filterType: null,
      filterDestinataries: [
        {
          label: 'Nenhum filtro',
          type: 'noFilter'
        },
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
          type: 'byFunctionConfig'
        },
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
      newField: {
        label: null,
        type: null,
        hint: null,
        required: true,
        multiple: false,
      },
      visionsList: [],
      organismConfigOptions: [],
      organismsNames: [],
      functionsNames: [],
      dayOfMonthOptions: []
    };
  },
  mounted() {
    this.$q.loading.hide();
    for (let i = 1; i <= 31; i++) {
      this.dayOfMonthOptions.push(i)
    }
  },
  beforeMount() {
    this.getFieldTypes()
    this.getOrganismsConfigs()
    this.getVisions()
  },
  methods: {
    addOptionValue(){
      if(!this.newField.options) {
        this.newField.options = []
      }
      this.newField.options.push(this.newOptionValue[0].newValue.toUpperCase());
      this.newOptionValue[0].newValue = ''
    },
    getOrganismsNamesBySearchString(val, update) {
      const opt = {
        route: "/desktop/adm/getOrganismsNames",
        body: {
          organismsTypes: this.organismConfigId,
          searchString: val,
        },
      };
      useFetch(opt).then((r) => {
        update(() => {
          this.organismsNames = r.data;
        })
      });
    },
    getOrganismsNames() {
      const opt = {
        route: "/desktop/adm/getOrganismsNames",
        body: {
          searchString: this.searchString,
          organismsTypes: this.organismConfigId
        },
      };
      useFetch(opt).then((r) => {
        this.organismsNames = r.data;
      });
    },
    getOrganismFunctionConfigNames() {
      console.log(this.organismConfigId)
      const opt = {
        route: "/desktop/config/getOrganismFunctionConfigNames",
        body: {
          organismsConfigsIds: this.organismConfigId
        },
      };
      useFetch(opt).then((r) => {
        this.functionsNames = r.data;
      });
    },
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
    createFormConfig() {
      if(this.formConfigName === ''){
        this.$q.notify('Preencha o nome do formulário')
        return
      }
      let visions = []
      this.visions.forEach(v => {
        visions.push(v.visionId)
      })
      const opt = {
        route: "/desktop/config/createForm",
        body: {
          formName: this.formConfigName,
          formFields: this.formFields,
          formConfigs: {
            recurrency: {}
          },
          formFilters: {
            visions
          },
          filterType: this.filterType
        },
      };
      switch(this.formDatesSelected.formType.type) {
        case 'weekly':
          opt.body.formConfigs.recurrency.rule = {
            value: this.formDatesSelected.dayOfWeek.value,
            label: this.formDatesSelected.dayOfWeek.label
          }
        break;
        case 'monthly': 
          opt.body.formConfigs.recurrency.rule = {
            value: this.formDatesSelected.finalDate1,
            label: this.formDatesSelected.finalDate1
          }
        break;
        case 'semester': 
          opt.body.formConfigs.recurrency.rule = {
            finalDate1: {
              value: this.formDatesSelected.finalDate1,
              label: this.formDatesSelected.finalDate1,
            },
            finalDate2: {
              value: this.formDatesSelected.finalDate2,
              label: this.formDatesSelected.finalDate2,
            }
          }
        break;
        case 'yearly':
          opt.body.formConfigs.recurrency.rule = {
            value: this.formDatesSelected.finalDate1,
            label: this.formDatesSelected.finalDate1,
          }
        break;
      }
      opt.body.formConfigs.recurrency.type = this.formDatesSelected.formType.type
      opt.body.formConfigs.recurrency.label = this.formDatesSelected.formType.label

      switch(this.filterType.type) {
        case 'byOrganismType':
          opt.body.formFilters.organismsConfigs = this.organismConfigId
        break;
        case 'byOrganism':
          opt.body.formFilters.organismsNames = this.organismSelected
        break;
        case 'byFunctionConfig':
          opt.body.formFilters.organismsFunctionsConfig = this.functionsSelected,
          opt.body.formFilters.organismsConfigs = this.organismConfigId
        break;
      }
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
          return
        }
        this.$q.notify("Configuração de formulário criada com sucesso!");
        this.$router.push('/config/formConfigList')
      });
    },
    getFieldTypes() {
      const opt = {
        route: "/desktop/config/getDataTypesList",
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.fieldTypesOptions = r.data;
        }
      });
    },
    addField() {
      if (  this.newField.label &&
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
        if(this.newField.options) {
          this.newField.options = []
        }
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
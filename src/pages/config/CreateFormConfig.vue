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
            configuração
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
            :option-value="(item) => item.type"
            emit-value
            map-options
            hint="Selecione o filtro de destinatários para prosseguir"
            v-model="filterType"
            :options="filterDestinataries"
          />
          <div v-if="filterType" class="q-gutter-md">
            <q-select
              v-if="filterType === 'byOrganismType' || filterType === 'byFunction'"
              outlined
              label="Configuração de organismo"
              option-label="organismConfigName"
              :option-value="(item) => item._id"
              emit-value
              map-options
              use-chips
              multiple
              @filter="getOrganismsNamesBySearchString"
              @update:model-value="getFunctionsNames"
              hint="Informe a qual configuração de organismo pertencerá esse formulário"
              v-model="organismConfigId"
              :options="organismConfigOptions"
            />
            <q-select
              v-if="filterType === 'byOrganism' "
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
              v-if="filterType === 'byFunction'"
              v-model="functionsSelected"
              outlined
              label="Funções"
              option-label="functionName"
              hint="Selecione o filtro de funções"
              :options="functionsNames"
              use-chips
              multiple
              :option-value="(item) => item"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.functionName }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.organismName }}</q-item-label>
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
              :option-value="(item) => item.type"
              v-model="formDatesSelected.formType"
              hint="Informe o tempo de preenchimento do formulário"
              :options="formDates"
            />
            <q-select
              v-if="formDatesSelected.formType === 'weekly'"
              outlined
              v-model="formDatesSelected.dayOfWeek"
              label="Dia da semana"
              option-label="label"
              hint="Escolha o dia da semana"
              :option-value="(item) => item.label"
              emit-value
              map-options
              :options="daysOfTheWeek"
              type="date"
            />
            <q-input
              outlined
              v-if="formDatesSelected.formType === 'yearly'"
              label="Data fim"
              mask="##/##"
              v-model="formDatesSelected.finalDate1"
            />
            <div 
              v-else-if="formDatesSelected.formType === 'semester' || formDatesSelected.formType === 'monthly'"
              class="row justify-between" 
            >
              <div class="col-5">
                <q-input
                  outlined
                  label="Data fim"
                  mask="##/##"
                  v-model="formDatesSelected.finalDate1"
                />
              </div>
              <div class="col-5">
                <q-input
                  outlined
                  label="Data fim"
                  mask="##/##"
                  v-model="formDatesSelected.finalDate2"
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
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: "CreateFormConfig",
  data() {
    return {
      fieldTypesOptions: [],
      organismConfigId: [],
      visions: [],
      formFields: [],
      organismSelected: [],
      functionsSelected: [],
      filterType: '',
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
          type: 'byFunction'
        },
      ],
      daysOfTheWeek: [
        { label: 'Domingo' },
        { label: 'Segunda-feira' },
        { label: 'Terça-feira' },
        { label: 'Quarta-feira' },
        { label: 'Quinta-feira' },
        { label: 'Sexta-feira' },
        { label: 'Sábado' }
      ],
      dayOfWeek: null,
      formDatesSelected: {
        formType: null,
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
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getFieldTypes()
    this.getOrganismsConfigs()
    this.getVisions()
  },
  methods: {
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
    getFunctionsNames() {
      const opt = {
        route: "/desktop/adm/getFunctionsNames",
        body: {
          organismsConfigIds: this.organismSelected
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
      // if(this.organismTypeId === '' || this.organismConfigId === '' ){
      //   this.$q.notify('Preencha o tipo de organismo, o nome da configuração e insira uma função para prosseguir')
      //   return
      // }
      const opt = {
        route: "/desktop/config/createForm",
        body: {
          formName: this.formConfigName,
          formFields: this.formFields,
          formConfigs: {},
          formFilters: {
            visions: this.visions,
          }
        },
      };
      switch(this.formDatesSelected.formType){
        case 'weekly':
          opt.body.formConfigs.dayOfWeek = this.dayOfWeek
        break;
        case 'monthly': 
          opt.body.formConfigs.monthly = this.formDatesSelected.finalDate1
        break;
        case 'semester': 
          opt.body.formConfigs.semester = this.formDatesSelected
        break;
        case 'yearly':
          opt.body.formConfigs.monthly = this.formDatesSelected
        break;
      }
      switch(this.filterType){
        case 'byOrganismType':
          opt.body.formFilters.organismConfigFilter = this.organismConfigId
        break;
        case 'byOrganism':
          opt.body.formFilters.organismsNameFilter = this.organismSelected
        break;
        case 'byFunction':
          opt.body.formFilters.organismFunctionFilter = this.functionsSelected,
          opt.body.formFilters.organismConfigFilter = this.organismConfigId
        break;
      }
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.$q.notify("Configuração de formulário criada com sucesso!");
        }
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
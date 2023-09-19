<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div 
          class="col-6 text-h5 text-capitalize">Formulário {{ formName }}
        </div>
        <div 
          class="col-2 text-h5 text-capitalize">
          <q-chip 
            v-if="formStatus === 'draft'"
            color="positive" 
            text-color="white" 
            icon="cloud"
            align="right"
          >
            Status: Ativa
          </q-chip>
          <q-chip 
            v-if="formStatus === 'sent'"
            color="negative" 
            text-color="white" 
            icon="cloud"
            align="right"
          >
            Status: Inativa
          </q-chip>
        </div>
        <div class="col text-right q-gutter-sm" v-if="formStatus === 'draft'">
          <q-btn
            v-if="$route.query.savedFormId"
            @click="updateDraftFormData"
            rounded
            color="primary"
            unelevated
            outline
            label="Salvar como rascunho"
            no-caps
          />
          <q-btn
            v-if="$route.query.savedFormId"
            @click="updateSentFormData"
            rounded
            color="primary"
            unelevated
            label="Salvar"
            no-caps
          />
          <q-btn
            v-if="$route.query.formId"
            @click="saveFormSketchData"
            rounded
            color="primary"
            unelevated
            outline
            label="Salvar como rascunho"
            no-caps
          />
          <q-btn
            v-if="$route.query.formId"
            @click="saveFormData"
            rounded
            color="primary"
            unelevated
            label="Salvar"
            no-caps
          />
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-around q-pa-md">
        <div class="col-12 q-gutter-md" align="start">
          <div
            class="text-h5"
          >
            Dados
          </div>
          <div
            class="q-gutter-sm"
            v-if="formFields.length"
          >
            <div v-for="(field, i) in formFields" :key="i">
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
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: "UserFormDetail",
  data() {
    return {
      formFields: [],
      formName: '',
      formStatus: '',
      formType: null,
    };
  },
  beforeMount() {
    if (this.$route.query.savedFormId !== undefined) {
      this.getSavedFormById()
    } else {
      this.getFormDetailById();
    }
  },
  mounted(){
    this.$q.loading.hide();
  },
  methods: {
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
    updateDraftFormData() {
      const opt = {
        route: "/desktop/commonUsers/updateFormData",
        body: {
          fields: this.formFields,
          formStatus: 'draft',
          savedFormId: this.$route.query.savedFormId
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify(r.errorMessage);
        } else {
          this.$q.notify("Formulário preenchido com sucesso!");
        }
      });
    },
    updateSentFormData() {
      const opt = {
        route: "/desktop/commonUsers/updateFormData",
        body: {
          fields: this.formFields,
          formStatus: 'sent',
          savedFormId: this.$route.query.savedFormId
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify(r.errorMessage);
        } else {
          this.$q.notify("Formulário preenchido com sucesso!");
        }
      });
    },
    saveFormSketchData() {
      const opt = {
        route: "/desktop/commonUsers/saveFormData",
        body: {
          fields: this.formFields,
          formStatus: 'draft',
          formId: this.$route.query.formId
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.$q.notify("Rascunho de formulário preenchido com sucesso!");
          this.$router.push('/user/userFormDetail?savedFormId=' + r.data.savedFormId) 
        }
      });
    },
    saveFormData() {
      const opt = {
        route: "/desktop/commonUsers/saveFormData",
        body: {
          fields: this.formFields,
          formStatus: 'sent',
          formId: this.$route.query.formId
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.$q.notify("Formulário preenchido com sucesso!");
          this.$router.push('/user/userFormDetail?SavedFormId=' + r.data.savedFormId) 
        }
      });
    },
    getSavedFormById() {
      const opt = {
        route: "/desktop/commonUsers/getSavedFormById",
        body: {
          savedFormId: this.$route.query.savedFormId
        },
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.formName = r.data.name
          r.data.status ? this.formStatus = r.data.status : this.formStatus = ''
          this.formFields = r.data.fields
        }
      });
    },
    getFormDetailById() {
      const opt = {
        route: "/desktop/commonUsers/getFormDetailById",
        body: {
          formId: this.$route.query.formId
        },
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.formName = r.data.name
          r.data.status ? this.formStatus = r.data.status : this.formStatus = ''
          this.formFields = r.data.fields
        }
      });
    },
    updateForm() {
      const opt = {
        route: "/desktop/config/updateForm",
        body: {
          formId: this.$route.query.formId,
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
  },
});
</script>
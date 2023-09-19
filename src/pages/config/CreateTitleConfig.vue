<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          nova configuração de título
        </div>
        <div class="col text-right">
          <q-btn
            @click="createTitleConfig"
            rounded
            color="primary"
            unelevated
            no-caps
          >
            Criar Título
          </q-btn>
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-center q-pa-md">
        <div class="col-8 q-gutter-md" align="start">
          <div class="text-subtitle1">
            A seguir adicione campos com informações que sejam relevantes para
            constar no cadastro de quem receber o título que está sendo criado.
            Cada um desses campos deverá ser preenchido quando alguém receber
            esse título. (Ex.: Pastor deve informar sua data de formação)
          </div>
          <div class="text-h5">Nome</div>
          <q-input
            label="Escreva o nome do novo título"
            outlined
            v-model="titleName"
          />
          <div class="text-h5">Adicione os campos de preenchimento</div>
          <div class="row q-gutter-x-sm q-mx-none">
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
            :disable="newField.type ? newField.type.type === 'boolean' : false"
            class="q-pt-lg"
            v-model="newField.multiple"
            label="Campo múltiplo"
          />
          <q-checkbox
            :disable="newField.type ? newField.type.type === 'boolean' : false"
            class="q-pt-lg"
            v-model="newField.admEvaluate"
            label="Este título deve ser avaliado pelo administrador?"
          />
          <div class="row justify-center">
            <q-btn
              label="Adicionar campo"
              no-caps
              rounded
              unelevated
              @click="addField"
              color="primary"
            />
          </div>
          <q-separator />
          <div class="text-h5">Visualização</div>
          <div>
            <div v-for="(field, i) in fields" :key="i" class="q-my-md">
              <div class="row q-gutter-sm items-center">
                <div class="col">
                  <q-input
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
                      <q-btn disabled icon="add" color="primary" flat round>
                        <q-tooltip
                          >Adicionar multiplo {{ field.type.label }}</q-tooltip
                        >
                      </q-btn>
                    </template>
                  </q-input>
                </div>
                <div class="col-2 q-mb-md">
                  <q-badge class="q-pa-xs">{{ fields[i].type.label }}</q-badge
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
                    @click="fields.splice(i, 1)"
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
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: "CreateTitleConfig",
  data() {
    return {
      fieldTypesOptions: [],
      titlesList: [],
      titleName: "",
      fields: [
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
      ],
      newField: {
        label: null,
        type: null,
        hint: null,
        required: true,
        multiple: false,
        admEvaluate: false
      },
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getFieldTypes();
  },
  methods: {
    addField() {
      if (this.newField.label && this.newField.hint && this.newField.type) {
        this.fields.push({ ...this.newField });
        this.newField.label = null;
        this.newField.hint = null;
        this.newField.type = null;
        this.newField.required = true;
        this.newField.multiple = false;
        return;
      }
      this.$q.notify("preencha todos os dados antes de adicionar um campo");
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
    createTitleConfig() {
      const opt = {
        route: "/desktop/config/createTitleConfigs",
        body: {
          titleName: this.titleName,
          titleFields: this.fields,
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.$q.notify("Título cadastrado com sucesso!");
          this.titleName = "";
          this.$router.push('/config/titleConfigurationList')
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
  },
});
</script>

<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          Configuração de formação
        </div>
        <div class="col q-gutter-sm text-right">
          <q-btn
            @click="updateFormationConfigs"
            rounded
            color="primary"
            unelevated
            no-caps
            class="q-pa-sm"
            icon="bookmark"
            label="Salvar Alterações"
          />
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-center q-pa-md">
        <div class="col-12 q-gutter-md" align="start">
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
  name: "FormationConfigDetail",
  data() {
    return {
      fieldTypesOptions: [],
      isActive: 1,
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
      },
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getFieldTypes();
    this.getFormationConfigDetail()
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
    getFormationConfigDetail() {
      const opt = {
        route: "/desktop/config/getFormationConfigDetail",
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          if(r.data) this.fields = r.data.fields;
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    updateFormationConfigs() {
      const opt = {
        route: "/desktop/config/updateFormationConfigs",
        body: {
          fields: this.fields,
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.$q.notify("Título atualizado com sucesso!");
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
  },
});
</script>

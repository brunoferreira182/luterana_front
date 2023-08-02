<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          nova configuração de título
        </div>
        <div class="col q-gutter-sm text-right">
          <q-btn
            v-if="isActive === 1"
            @click="dialogInactiveTitle.open = true"
            rounded
            outline
            color="primary"
            unelevated
            no-caps
          >
            Inativar
          </q-btn>
          <q-btn
            v-else
            @click="dialogInactiveTitle.open = true"
            rounded
            outline
            color="primary"
            unelevated
            no-caps
          >
            Ativar
          </q-btn>
          <q-btn
            @click="clkSaveConfig"
            rounded
            color="primary"
            unelevated
            no-caps
          >
            Salvar alterações
          </q-btn>
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-center q-pa-md">
        <div class="col-8 q-gutter-md" align="start">
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
                      v-slot:append
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
      <q-dialog v-model="dialogInactiveTitle.open">
        <q-card style="border-radius: 1rem">
          <q-card-section>
            <div class="text-h6 text-center">
              Tem certeza que deseja {{ isActive ? "inativar" : "ativar" }} esse
              título?
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Depois"
              no-caps
              color="primary"
              @click="dialogInactiveTitle.open = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="changeStatus"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: "titleConfigDetail",
  data() {
    return {
      fieldTypesOptions: [],
      titlesList: [],
      titleName: "",
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
      dialogInactiveTitle: {
        open: false,
      },
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
    this.getTitleConfigsDetailById();
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
    getTitleConfigsDetailById() {
      const opt = {
        route: "/desktop/config/getTitleConfigsDetailById",
        body: {
          titleConfigsId: this.$route.query.titleId,
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.titleName = r.data.titleName;
          this.fields = r.data.titleFields;
          this.isActive = r.data.isActive;
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    updateTitleConfigs() {
      const opt = {
        route: "/desktop/config/updateTitleConfigs",
        body: {
          titleConfigsId: this.$route.query.titleId,
          titleName: this.titleName,
          titleFields: this.fields,
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
    inactivateTitleConfigs() {
      const opt = {
        route: "/desktop/config/inactivateTitleConfigs",
        body: {
          titleConfigsId: this.$route.query.titleId,
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.$q.notify("Título inativado com sucesso!");
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    activateTitleConfigs() {
      const opt = {
        route: "/desktop/config/activateTitleConfigs",
        body: {
          titleConfigsId: this.$route.query.titleId,
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.$q.notify("Título ativado com sucesso!");
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    changeStatus() {
      this.isActive
        ? this.inactivateTitleConfigs()
        : this.activateTitleConfigs();
    },
    clkSaveConfig() {
      this.updateTitleConfigs();
    },
  },
});
</script>

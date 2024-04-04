<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          nova configuração de título
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
import utils from "../../boot/utils";
export default defineComponent({
  name: "TitleDetail",
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
    this.startView()
  },
  methods: {
    async startView () {
      const permStatus = await utils.getPermissionStatus('ADMIN')
      if (permStatus.data === 'onMaitenance') {
        this.$router.push('/maitenancePage')
        return
      }
      this.getFieldTypes();
      this.getTitleConfigsDetailById();
    },
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
          this.fieldTypesOptions = r.data.list;
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

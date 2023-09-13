<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div 
          class="col-6 text-h5 text-capitalize">Criar configuração de usuário
        </div>
        <div class="col text-right">
          <q-btn
            @click="createUsersConfig"
            rounded
            color="primary"
            unelevated
            no-caps
          >
            Salvar
          </q-btn>
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="text-right q-px-md q-pt-md" >
        <q-btn 
          outline 
          rounded 
          no-caps 
          color="primary" 
          icon="add" 
          label="Adicionar nova aba"
          @click="dialogNewTab.open = true"
        />
      </div>
      <div class="row q-ma-md q-col-gutter-md" >
        <div
          v-for="(tabCard, tabIndex) in userDataTabs"
          :key="tabIndex"
          class="col-6"
        >
          <q-card class="userDataTabs-card bg-grey-1">
            <div class="row">
              <div class="text-h6 q-mx-sm">{{ tabCard.tabLabel }}</div>
                
                <q-btn
                  v-if="tabIndex > 0"
                  rounded
                  color="primary"
                  no-caps
                  unelevated
                  flat
                  class="q-ml-sm"
                  icon="edit"
                  @click="clkDialogClkEditName(tabCard, tabIndex)"
                />           
                <q-btn
                  v-if="tabIndex > 0"
                  rounded
                  style="margin-left: auto;"
                  color="grey-7"
                  no-caps
                  flat
                  icon="close"
                  @click="dialogDeleteTab.open = true,
                    dialogDeleteTab.tabIndex = tabIndex"
                >
                <q-tooltip>Excluir aba</q-tooltip>
              </q-btn>
            </div>
            <div
              v-for="(field, i) in tabCard.fields"
              :key="i"
              class="q-my-md"
            >
              <div class="row q-gutter-sm items-center">
                <div class="col-8">
                  <q-input
                    v-if="field.type.type !== 'boolean'"
                    readonly
                    :label="field.label"
                    :hint="field.hint"
                    outlined
                  >
                    <template
                      #append
                    >
                      <q-btn
                        v-if="field.multiple === true"
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
                  <div v-if="field.type.type === 'options'">
                    <q-chip
                      v-for="options in field.options"
                      :key="options"
                      size="sm"
                      color="primary" 
                      text-color="white" 
                    >
                    {{ options }}
                    </q-chip>
                  </div>
                  <q-checkbox
                    v-if="field.type.type === 'boolean'"
                    class="q-pt-lg"
                    readonly
                    :label="field.label"
                    :hint="field.hint"
                  />
                </div>
                <div class="col-2 q-mb-md">
                  <q-badge class="q-pa-xs">{{
                    field.type.label
                  }}</q-badge
                  ><br />
                  <q-badge color="orange" class="q-pa-xs">
                    {{ field.required ? "Obrigatório" : "opcional" }}
                  </q-badge>
                </div>
                <div class="col-1">
                  <div>
                    <q-btn 
                      v-if="(tabIndex > 0 )"
                      icon="delete"
                      size="large"
                      class="q-mb-md"
                      rounded
                      @click="tabCard.fields.splice(i, 1), 
                      notifyRemoved()"
                      flat
                      color="primary"
                    />
                  </div>
                </div>
              </div>
            </div>
            <q-btn
              v-if="tabIndex > 0"
              rounded
              color="primary"
              no-caps
              class
              unelevated
              outline
              icon="add"
              @click="clkAddTabData(tabIndex)"
              label="Adicionar campo"
            />
            <q-card-section class="q-gutter-sm">
            </q-card-section>
          </q-card>
        </div>
      </div>
      <q-dialog v-model="dialogInsertFields.open">
        <div class="row">
          <div class="col-10">
            <q-card class="card-insert-fields">
              <div
                class="text-h5 q-pa-md text-center"
              >
                Adicione os campos de preenchimento
              </div>
              <div class="q-gutter-y-md">
                <q-input
                  outlined
                  hint="Nome do dado que será solicitado na hora do cadastro do organismo"
                  label="Novo dado"
                  v-model="newField.label"
                />
                <q-input
                  outlined
                  hint="Descrição abaixo do campo para facilitar entendimento"
                  label="Dica"
                  v-model="newField.hint"
                />
                <q-select
                  outlined
                  hint="O tipo do dado"
                  label="Tipo de dado"
                  option-label="label"
                  :options="fieldTypesOptions"
                  v-model="newField.type"
                />
                <div v-if="newField.type.type === 'options'">
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
              </div>
              <div class="text-center q-gutter-x-md"> 
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
              </div>
              <div
                class="row justify-center q-pa-sm"
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
            </q-card>
          </div>
        </div>
      </q-dialog>
      <q-dialog v-model="dialogNewTab.open">
        <q-card style="border-radius: 1rem; width: 400px">
          <q-card-section>
            <div
              class="text-h5"
            >
              Informe o nome da aba
            </div>
          </q-card-section>
          <q-card-section>
            <q-input
              outlined
              class="q-ml-sm"
              hint="Nome da aba que será exibida na tela de criar usuário e envolverá todos os dados criados a seguir"
              label="Nome"
              v-model="tabLabel"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Depois"
              no-caps
              color="primary"
              @click="dialogNewTab.open = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="addTab"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="dialogDeleteTab.open">
        <q-card style="border-radius: 1rem; width: 400px">
          <q-card-section>
            <div
              class="text-h5"
            >
              Deseja mesmo excluir essa aba?
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Cancelar"
              no-caps
              color="primary"
              @click="dialogDeleteTab.open = false"
            />
            <q-btn
              unelevated
              rounded
              label="Excluir"
              no-caps
              color="primary"
              @click="userDataTabs.splice(dialogDeleteTab.tabIndex,1),
                dialogDeleteTab.open = false"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="dialogClkEditName">
        <q-card style="border-radius: 1rem; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">
              Informe o novo nome:
            </div>
          </q-card-section>
          <q-card-section align="center">
            <q-input
              class="q-px-xl"
              v-model="tabLabel"
              outlined
              label="Nome da aba"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Depois"
              no-caps
              rounded
              color="primary"
              @click="dialogClkEditName = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="updateTabLabel"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </q-page-container>
</template>
<script>
import utils from "../../boot/utils";
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: "CreateUserConfig",
  data() {
    return {
      userInfo: {},
      tabIndexToEdit: null,
      tabSelected: '',
      newOptionValue: [
        {newValue: ''}
      ],
      organismTypesOptions: [],
      tabName: '',
      fieldTypesOptions: [],
      dialogClkEditName: false,
      organismTypeName: '',
      titlesList: [],
      organismTypeId: null,
      typeSelected: null,
      valueSelected: "",
      dialogNewTab: {
        open: false,
      },
      dialogInsertFields: {
        open: false,
      },
      userDataTabs: [
        {
          tabLabel: "Dados obrigatórios",
          fields:[]
        },
      ],
      dialogDeleteTab: {
        open: false,
        tabIndex: null
      },
      tabLabel: null,
      newField: {
        label: null,
        type: '',
        hint: null,
        multiple: false,
        required: true,
        options: [],
        value: ''
      },
      tabIndexToAddField: '',
      selectedType: "",
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.userInfo = utils.presentUserInfo();
    this.getUsersConfig();
    this.getOrganismsTypes();
    // this.getTitlesByStatus();
    this.getFieldTypes();
  },
  methods: {
    clkAddTabData(tabIndex){
      this.dialogInsertFields.open = true
      this.tabIndexToAddField = tabIndex
      this.newField.options = []
    },
    addTab() {
      this.userDataTabs.push({
        tabLabel: this.tabLabel,
        fields: []
      });
      this.dialogNewTab.open = false
      this.tabLabel = ''
    },
    addField() {
      const tabIndex = this.tabIndexToAddField;
      if (this.newField.label && this.newField.hint && this.newField.type) {
        this.userDataTabs[tabIndex].fields.push({ ...this.newField });
        this.newField.label = null;
        this.newField.hint = null;
        this.newField.type = '';
        this.newField.options = null;
        this.newField.required = true;
        this.newField.multiple = false;
        this.dialogInsertFields.open = false; // Feche o diálogo após adicionar o campo
      } else {
        this.$q.notify("Preencha todos os dados antes de adicionar um campo");
      }
    },
    addMultipleField() {
      this.dialogConfirmMultipleFields.open = false;
      this.userData.generalData.phones.push(this.valueSelected);
      this.newPhone = "";
      this.typeSelected = null;
    },
    getTitlesByStatus() {
      const opt = {
        route: "/desktop/adm/getTitlesByStatus",
        body: {
          isActive: 1,
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.titlesList = r.data.list;
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
          this.organismTypesOptions = r.data;
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
    createUsersConfig() {
      const opt = {
        route: "/desktop/config/createUsersConfig",
        body: {
          userDataTabs: this.userDataTabs,
        },
      };
      useFetch(opt).then(r => {
        if (!r.error) {
          this.$q.notify("Configuração de usuário criada com sucesso!");
          // this.position = "";
          // this.multiple = "";
          // this.organismName = "";
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
          userDataTabs: this.userDataTabs,
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
    getUsersConfig() {
      const opt = {
        route: "/desktop/config/getUsersConfig",
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.organismTypeName = r.data.organismTypeName;
          this.userDataTabs = r.data.userDataTabs;
          this.selectedType = r.data.organismTypeName;
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
    notifyRemoved() {
      this.$q.notify("Campo removido")
    },
    addOptionValue() {
      this.newField.options.push(this.newOptionValue[0].newValue.toUpperCase());
      this.newOptionValue[0].newValue = ''
    },
    clkDialogClkEditName(tabCard, tabIndex) {
      this.tabIndexToEdit = tabIndex
      this.dialogClkEditName =  true
    },
    updateTabLabel() {
      const tabIndex = this.tabIndexToEdit
      if (tabIndex !== null && this.tabLabel) {
        this.userDataTabs[tabIndex].tabLabel = this.tabLabel
        this.dialogClkEditName = false
        this.tabLabel = ''
        const opt = {
          route: '/desktop/user/updateUserData',
          body: {
            userId: this.userInfo.userId,
            userDataTabs: this.userDataTabs
          }
        }
        useFetch(opt).then((r) => {
          console.log("userDataTabs" + this.userDataTabs)
          if (!r.error) {
            this.$q.notify("Nome da aba atualizado com sucesso");
          } else {
            this.$q.notify("Ocorreu um erro ao atualizar o nome da aba. Tente novamente.");
          }
        });
      } else {
        this.$q.notify("Ocorreu um erro, tente novamente")
      }
    }
  },
});
</script>
<style scoped>
.card-insert-fields {
  border-radius: 1rem; 
  width: 556px;
  padding: 16px;
}
.userDataTabs-card {
  padding: 10px;
  border-radius: 1rem;
}
</style>


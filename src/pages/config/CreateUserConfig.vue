<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div 
          class="col-6 text-h5 text-capitalize">Criar configuração de {{ userType === 'pastor' ? 'Pastor' : 'Usuário' }}
        </div>
        <div class="col text-right">
          <q-btn 
            outline 
            rounded 
            no-caps 
            color="primary" 
            icon="add" 
            label="Adicionar nova aba"
            @click="dialogNewTab.open = true"
            class="q-mr-sm"
          />
          <q-btn
            @click="createUsersConfig"
            rounded
            color="primary"
            unelevated
            no-caps
            label="Salvar"
          />
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row q-ma-sm q-col-gutter-sm" >
        <div
          v-for="(tabCard, tabIndex) in userDataTabs"
          :key="tabIndex"
          class="col-12"
        >
          <q-expansion-item
            expand-separator
            :label="tabCard.tabLabel"
            header-style="font-weight: 700"
          >
          <q-card class="userDataTabs-card bg-grey-3">
            <div class="row">
              <!-- <div class="text-h6 q-mx-sm">{{ tabCard.tabLabel }}</div> -->
              <!-- <q-btn
                v-if="tabIndex > 0"
                round
                color="orange"
                no-caps
                unelevated
                flat
                icon="edit"
                @click="0(tabCard, tabIndex)"
              >
                <q-tooltip>Editar nome da aba</q-tooltip>
              </q-btn> -->
              <q-btn
                v-if="tabIndex > 0"
                round
                no-caps
                flat
                icon="close"
                color="negative"
                @click="dialogDeleteTab.open = true,
                  dialogDeleteTab.tabIndex = tabIndex"
              >
                <q-tooltip>Excluir aba</q-tooltip>
              </q-btn>
              <q-badge outline color="primary" v-if="tabCard.onlyAdm">Somente ADM preenche</q-badge>
            </div>
            <q-list separator>
              <q-item
                v-for="(field, fieldIndex) in tabCard.fields"
                :key="fieldIndex"
              >
                <q-item-section>
                  <q-item-label>{{ field.label }}</q-item-label>
                  <q-item-label caption>{{ field.hint }}</q-item-label>
                  <q-item-label caption>
                    Tipo: 
                    <q-badge :label="field.type.label" color="green"/>
                    <q-icon size="sm" v-if="field.required" name="error_outline" color="red"><q-tooltip>Campo obrigatório</q-tooltip> </q-icon>
                  </q-item-label>
                  <q-item-label caption v-if="field.type.type === 'options'">
                    Opções: 
                    <q-badge
                      v-for="options in field.options"
                      :key="options"
                      size="sm"
                      color="primary" 
                      text-color="white"
                      class="q-mr-xs"
                      outline
                    >
                      {{ options }}
                    </q-badge>
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>
                  <q-btn 
                    v-if="fieldIndex > 1 || tabIndex > 0"
                    icon="edit"
                    round
                    @click="editField(tabIndex, fieldIndex, field)"
                    flat
                    color="warning"
                  />
                  <q-btn 
                    v-if="fieldIndex > 1 || tabIndex > 0"
                    icon="delete"
                    round
                    @click="tabCard.fields.splice(fieldIndex, 1)"
                    flat
                    color="negative"
                  />
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <q-btn
              rounded
              color="primary"
              no-caps
              class
              flat
              icon="add"
              @click="clkAddTabData(tabIndex)"
              label="Adicionar campo"
            />
          </q-card>
          </q-expansion-item>
        </div>
      </div>
      <q-dialog v-model="dialogInsertFields.open">
        <div class="row">
          <div class="col-10">
            <q-card class="card-insert-fields">
              <div class="text-h5 q-pa-md text-center">
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
                <div
                  v-if="newField.type.type === 'multiple_select'"
                >
                  <q-btn 
                    @click="addNewSelectField"
                    color="primary"
                    outline
                    icon="add"
                    rounded
                    class="q-mb-md"
                  >
                    Adicionar novo campo de seleção
                  </q-btn>
                  <div 
                    v-for="(option, optionIndex) in multipleOptionsValue"
                    :key="option"
                  >
                    <div style="display: flex;">
                      <q-input
                        outlined
                        class="q-pa-sm"
                        label="De um nome para o campo de seleção abaixo:"
                        v-model="multipleOptionsValue[optionIndex].label"
                        style="width: 50%;"
                        >
                      </q-input>
                      <q-input
                        v-model="multipleOptionsValue[optionIndex].newValue"
                        outlined
                        label="Opção" 
                        class="q-pa-sm"
                        style="width: 50%;"
                      >
                        <q-btn icon="add" @click="insertMultipleField(option, optionIndex)" flat></q-btn>
                      </q-input>
                    </div>
                    <div>
                      <q-chip
                        v-for="(select, selectIndex) in multipleOptionsValue[optionIndex].select"
                        :key="select"
                        class="q-pa-sm"
                      >
                        {{ select }}
                        <q-btn
                          @click="multipleOptionsValue[optionIndex].select.splice(selectIndex, 1)"
                          icon="close"
                          round
                          flat/>
                      </q-chip>
                    </div>
                  </div>
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
                  label="Confirmar"
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
              class="q-ml-sm q-mb-md"
              hint="Nome da aba que será exibida na tela de criar usuário e envolverá todos os dados criados a seguir"
              label="Nome"
              v-model="tabLabel"
            />
            <q-checkbox label="Somente ADM preenche" v-model="dialogNewTab.onlyAdm"/>
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
      userType: null,
      multipleOptionsValue: [
        {select: [], label: ''},
        {select: [], label: ''}
      ],
      userInfo: {},
      tabIndexToEdit: null,
      tabSelected: '',
      newOptionValue: [
        {newValue: ''}
      ],
      tabName: '',
      fieldTypesOptions: [],
      dialogClkEditName: false,
      typeSelected: null,
      valueSelected: "",
      dialogNewTab: {
        open: false,
        onlyAdm: false
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
        selects: [
          {label: [], options: []},
          {label: [], options: []}
        ],
      },
      tabIndexToAddField: '',
      fieldIndexToEdit: null,
      action: null
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.userType = this.$route.query.userType
    this.userInfo = utils.presentUserInfo();
    this.getUsersConfig();
    this.getFieldTypes();
  },
  watch: {
    $route () {
      this.userType = this.$route.query.userType
      this.getUsersConfig()
    }
  },
  methods: {
    editField (tabIndex, fieldIndex, field) {
      this.newField = {
        label: field.label,
        type: field.type,
        hint: field.hint,
        multiple: field.multiple,
        required: field.required,
        options: [...field.options],
      }
      if (field.selects) {
        this.multipleOptionsValue =  [...field.selects]
      }
      this.dialogInsertFields.open = true
      this.tabIndexToAddField = tabIndex
      this.fieldIndexToEdit = fieldIndex
      this.action = 'edit'
    },
    insertMultipleField(option, optionIndex) {
      const newValue = this.multipleOptionsValue[optionIndex].newValue;
      this.multipleOptionsValue[optionIndex].select.push(newValue);
      this.multipleOptionsValue[optionIndex].newValue = '';
      this.newField.selects[optionIndex].options = this.multipleOptionsValue[optionIndex].select;
      this.newField.selects[optionIndex].label = this.multipleOptionsValue[optionIndex].label
    },
    addNewSelectField() {
      this.newField.selects.push(
        {label: [], options: []},
        {label: [], options: []})
      this.multipleOptionsValue.push({select: [], label: ''})
    },
    clkAddTabData(tabIndex){
      this.dialogInsertFields.open = true
      this.tabIndexToAddField = tabIndex
      this.newField.options = []
      this.newField.selects = [{label: [], options: []},
          {label: [], options: []}]
      this.action = 'add'
    },
    addTab() {
      this.userDataTabs.push({
        tabLabel: this.tabLabel,
        onlyAdm: this.dialogNewTab.onlyAdm,
        fields: []
      });
      this.dialogNewTab.open = false
      this.dialogNewTab.onlyAdm = false
      this.tabLabel = ''
    },
    addField() {
      if (this.newField.label === '' || this.newField.hint === '' || this.newField.type === '') {
        this.$q.notify("Preencha todos os dados antes de adicionar um campo");
        return
      }
      const tabIndex = this.tabIndexToAddField;
      if (this.action === 'add') {
        this.userDataTabs[tabIndex].fields.push({ ...this.newField });
      } else if (this.action === 'edit') {
        this.userDataTabs[tabIndex].fields[this.fieldIndexToEdit] = {...this.newField}
      }
      this.clearAddFieldInputs()
    },
    clearAddFieldInputs () {
      this.newField.label = null;
      this.newField.hint = null;
      this.newField.type = '';
      this.newField.options = null;
      this.newField.required = true;
      this.newField.multiple = false;
      this.multipleOptionsValue = [
        {select: [], label: ''},
        {select: [], label: ''}
      ]
      this.dialogInsertFields.open = false;
    },
    addMultipleField() {
      this.dialogConfirmMultipleFields.open = false;
      this.userData.generalData.phones.push(this.valueSelected);
      this.newPhone = "";
      this.typeSelected = null;
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
          userType: this.userType
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
    // updateOrganismConfig() {
    //   const _id = this.$route.query._id;
    //   const opt = {
    //     route: "/desktop/config/updateOrganismConfig",
    //     body: {
    //       organismConfigId: _id,
    //       userDataTabs: this.userDataTabs,
    //     },
    //   };
    //   useFetch(opt).then((r) => {
    //     if (!r.error) {
    //       this.$q.notify("Os campos foram atualizados com sucesso!");
    //       this.$router.push('/config/organismConfigurationList')
    //     } else {
    //       this.$q.notify("Ocorreu um erro, tente novamente por favor");
    //     }
    //   });
    // },
    getUsersConfig() {
      const opt = {
        route: "/desktop/config/getUsersConfig",
        body: {
          userType: this.userType
        }
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor")
          return
        }
        else if (!r.data) {
          this.$q.notify("Ainda não há configuração salva. Inicie uma.")
          return
        }
        this.userDataTabs = r.data.userDataTabs;
      });
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


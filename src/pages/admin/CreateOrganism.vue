<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">novo organismo</div>
        <div class="col-2 text-center">
          <q-btn
            @click="createOrganism"
            no-caps
            color="primary"
            rounded
            unelevated
            label="Criar organismo"
            />
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-around q-ma-md">
        <div class="col q-gutter-md" align="start">
          <div class="text-h5">Selecione o tipo de configuração de organismo</div>
          <q-select
            outlined
            label="Nome da configuração"
            option-label="organismConfigName"
            :option-value="(item) => item._id"
            emit-value
            map-options
            hint="Informe qual o tipo de configuração que está aplicando"
            v-model="organismData.organismConfigId"
            :options="organismConfigOptions"
            @update:modelValue="getOrganismConfigById"
          />
          <q-separator class="q-ma-md" v-if="organismList.length"/>
          <div v-if="organismList.length">
            <q-btn
              label="Gerenciar Vínculos"
              color="primary"
              rounded
              unelevated
              @click="dialogLinks = true"
            />
          </div>
          <q-separator v-if="organismData.fields.length" />
          <div v-if="organismData.fields.length" class="text-h5">
            Preencha os dados necessários:
          </div>
          <div v-for="(field, i) in organismData.fields" :key="i">
            <div v-if="field.multiple">
              <q-input
                v-model="organismData.fields[i].newMultipleValue"
                @blur="delete organismData.fields[i].newMultipleValue"
                outlined
                :type="getInputType(field.type.type)"
                :reverse-fill-mask="field.type.type === 'money'"
                :prefix="field.type.type === 'money' ? 'R$' : null"
                :label="field.label + (field.required ? '' : ' (Opcional)')"
                :mask="field.type.mask"
                :hint="field.hint"
              >
                <template v-slot:append v-if="field.multiple">
                  <q-btn
                    icon="add"
                    color="primary"
                    flat
                    rounded
                    @click="addMultipleField(field)"
                  >
                    Adicionar
                  </q-btn>
                </template>
              </q-input>
              <div
                v-if="field.value && field.value.length"
                class="q-mt-sm"
              >
                <q-chip
                  removable
                  @remove="field.value.splice(i, 1)"
                  color="secondary"
                  class="q-pa-md"
                  text-color="white"
                  v-for="(value, i) in field.value"
                  :key="i"
                >
                  {{ value }}
                </q-chip>
              </div>
            </div>
            <q-input
              v-else-if="field.type.type !== 'boolean'"
              v-model="organismData.fields[i].value"
              outlined
              :type="getInputType(field.type.type)"
              :reverse-fill-mask="field.type.type === 'money'"
              :prefix="field.type.type === 'money' ? 'R$' : null"
              :label="field.label + (field.required ? ' (Obrigatório)' : ' (Opcional)')"
              :mask="field.type.mask"
              :hint="field.hint"
            />
            <q-checkbox
              v-else
              :label="field.label"
              v-model="organismData.fields[i].value"
            ></q-checkbox>
          </div>
        </div>
        <q-separator vertical class="q-ma-md" />
        <div class="col">
          <div class="row">
            <div
              class="text-h5"
            >
              Funções
            </div>
          </div>
          <div v-for="(func, funcIndex) in functions" :key="funcIndex">
            <q-card
              style="border-radius: 1rem"
              class="bg-grey-3 q-ma-sm"
              flat
            >
              <q-item>
                <q-item-section >
                  <div class="text-subtitle2 text-capitalize">{{ func.name }}</div>
                  <div>Descrição: {{ func.description }}</div>
                  <div class="text-caption text-grey-7">Título necessário: {{ func.requiredTitle ? func.requiredTitle.titleName : 'nenhum' }}</div> 
                  <div>
                    <q-icon name="visibility" color="primary" size="sm"/>
                    <q-chip
                      v-for="(vision,i) in func.visions"
                      :key="i"
                    >
                    {{ vision.name }}
                    </q-chip>
                    <span 
                      class="text-caption text-grey-7"
                      v-if="!func.visions.length"
                    >
                      Nenhuma visão
                    </span>
                  </div>
                </q-item-section>
                <q-item-section top side>
                  <div class="text-subtitle2">
                    <q-badge color="orange-8" v-if="func.isRequired">
                      Obrigatório
                    </q-badge>
                  </div>
                </q-item-section>
              </q-item>
              <q-expansion-item
                color="primary"
                class="q-pa-sm"
                icon="group"
                :label="func.users ? `${func.users.length} Participantes` : '0 Participantes'"
                caption="Clique para ver ou adicionar"
              >
                <q-item
                  v-for="(user, userIndex) in func.users"
                  :key="userIndex"
                  style="border-radius: 0.5rem; margin-top: 8px;"
                  class="bg-white"
                  transition="user-bounce"
                >
                  <q-item-section avatar>
                    <q-avatar rounded>
                      <img src="https://cdn.quasar.dev/img/avatar.png" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section class="text-capitalize text-wrap" lines="2">
                    {{ user.userName }}
                    <div class="text-caption text-grey-7">
                      Data Início:
                      {{ formatDate(user.initialDate) }}
                    </div>
                    <div
                      v-if="user.dataFim"
                      class="text-caption text-grey-7"
                    >
                      Data Fim: {{ formatDate(user.finalDate) }}
                    </div>
                  </q-item-section>
                  <q-item-section side>
                    <div class="text-grey-8 q-gutter-xs">
                      <!-- <q-btn
                        @click="dialogInsertObservation(user)"
                        class="gt-xs"
                        size="12px"
                        color="secondary"
                        flat
                        dense
                        round
                        icon="library_books"
                      >
                        <q-tooltip> Observações </q-tooltip>
                      </q-btn> -->
                      <q-btn
                        @click="deleteUserFromFunction(user, funcIndex)"
                        class="gt-xs"
                        size="12px"
                        color="red-8"
                        flat
                        dense
                        round
                        icon="delete"
                      >
                        <q-tooltip> Deletar usuário da função </q-tooltip>
                      </q-btn>
                    </div>
                  </q-item-section>
                </q-item>
                <q-item-section class="q-pa-xs">
                  <q-btn
                    label="Adicionar pessoa"
                    color="primary"
                    dense
                    icon="add"
                    rounded
                    flat
                    no-caps
                    @click="linkUserToFunction(func, funcIndex)"
                  />
                </q-item-section>
              </q-expansion-item>
            </q-card>
          </div>
        </div>
        <q-dialog v-model="newFunctionDialog">
          <q-card style="border-radius: 1rem; width: 400px">
            <q-card-section>
              <div class="text-h6 text-center">Nova função</div>
            </q-card-section>
            <q-card-section>
              <q-select
                outlined
                clearable
                option-label="titleName"
                emit-value
                map-options
                label="Nome da função"
                :options="titlesOptions"
              />
            </q-card-section>
            <q-card-actions align="center" class="q-mb-md">
              <q-btn
                flat
                label="Depois"
                no-caps
                color="primary"
                @click="newFunctionDialog = false"
              />
              <q-btn
                unelevated
                rounded
                label="Confirmar"
                no-caps
                color="primary"
                @click="addFunction"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-dialog
          v-model="dialogDeleteUserFromFunction.open"
          @hide="clearDialogAndFunctions"
        >
          <q-card style="border-radius: 1rem; width: 400px">
            <q-card-section>
              <div class="text-h6 text-center">
                Tem certeza que deseja inativar
                {{ dialogDeleteUserFromFunction.data.userName }}?
              </div>
            </q-card-section>
            <q-card-section align="center" class="q-gutter-sm">
              <q-input
                filled
                label="Observação"
                v-model="dialogDeleteUserFromFunction.obsText"
                hint="Informe o motivo"
              />
              <q-input
                filled
                type="date"
                label="Data final"
                v-model="dialogDeleteUserFromFunction.finalDate"
                hint="Informe a data final de ocupação da função"
              />
            </q-card-section>
            <q-card-actions align="center">
              <q-btn
                flat
                label="Depois"
                no-caps
                rounded
                color="primary"
                @click="dialogDeleteUserFromFunction.open = false"
              />
              <q-btn
                unelevated
                rounded
                label="Confirmar"
                no-caps
                color="primary"
                @click="inactivateUserFromFunction"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-dialog full-height full-width v-model="dialogLinks" @hide="clearDialogAndFunctions" animated>
          <q-card>
            <q-card-section>
              <div class="text-h6 text-center">
                Vínculos
              </div>
            </q-card-section>
            <q-card-section>
              <div  class="text-subtitle2 q-mb-sm">
                Organismos vinculados:
              </div>
              <q-input 
                v-if="organismLinks.length" 
                label="Buscar" 
                outlined
                v-model="organismVinculated"
                @update:model-value="filterInOrganismLinks"
                type="search"
              >
                <template v-slot:append>
                  <q-icon v-if="organismVinculated !== ''" name="close" @click="organismVinculated = ''" class="cursor-pointer" />
                  <q-icon name="search" />
                </template>
              </q-input>
              <div v-if="organismLinks.length">
                <q-chip removable @remove="removeLink(chip,i)" v-for="(chip, i) in organismLinks" :key="i">
                  {{ chip.nome }}
                </q-chip>
              </div>
              <div v-else class="text-center q-mt-md">Nenhum vínculo.</div>
            </q-card-section>
            <q-card-section>
              <div class="text-subtitle2 q-mb-sm">
                Vincular novo organismo:
              </div>
              <q-input 
                label="Buscar"
                outlined
                type="search"
                v-model="organismSelected"
                hint="Faça uma busca para visualizar os organismos disponíveis"
                @update:model-value="getOrganismsList"
              >
                <template v-slot:append>
                  <q-icon v-if="organismSelected !== ''" name="close" @click="organismSelected = ''" class="cursor-pointer" />
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-list bordered class="q-mt-sm">
                <q-item
                  clickable
                  :disable="organismLinks.includes(organism)"
                  @click="addNewLink(organism,i)"
                  v-for="(organism,i) in organismList"
                  :key="i"
                >
                  <q-item-section>
                    {{ organism.nome }}
                  </q-item-section>
                  <q-item-section class="text-primary" side>
                    {{ organismLinks.includes(organism) ? 'Adicionado' : 'Adicionar'}}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-card-actions align="center">
              <q-btn
                flat
                label="Fechar"
                no-caps
                rounded
                color="primary"
                @click="dialogLinks = false"
              />
              <q-btn 
                label="Salvar vínculo"
                no-caps
                rounded
                unelevated
                @click="dialogLinks = false"
                color="primary"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-dialog v-model="dialogInsertUserInFunction.open">
          <q-card style="border-radius: 1rem; width: 400px">
            <q-card-section>
              <div class="text-h6 text-center">
                Informe o usuário que ocupará a função
              </div>
            </q-card-section>
            <q-card-section align="center">
              <q-select
                v-model="userSelected"
                filled
                use-input
                option-label="userName"
                input-debounce="100"
                label="Nome do usuário"
                :options="usersOptions"
                @keyup="getUsers"
                :option-value="(item) => item"
                emit-value
                map-options
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Nenhum resultado
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-card-section>
            <q-card-section align="center">
              <q-input
                filled
                label="Data início"
                type="date"
                hint="Informe a data início de ocupação da função"
                v-model="dialogInsertUserInFunction.initialDate"
              />
            </q-card-section>
            <q-card-actions align="center">
              <q-btn
                flat
                label="Depois"
                no-caps
                rounded
                color="primary"
                @click="dialogInsertUserInFunction.open = false"
              />
              <q-btn
                unelevated
                rounded
                label="Confirmar"
                no-caps
                color="primary"
                @click="assignUserToFunction"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import { date } from "quasar";
export default defineComponent({
  name: "CreateOrganism",
  data() {
    return {
      userInput: '',
      userSelected: '',
      selectedFunc: "",
      selectedFuncIndex: "",
      usersOptions: [],
      organismConfigOptions: [],
      organismFunctionConfigId: null,
      dialogInsertUserInFunction:{
        initialDate: '',
        open: false,
      },
      dialogDeleteUserFromFunction: {
        obsText: "",
        finalDate: "",
        functionUserId: "",
        open: false,
        data: {},
      },
      newOrganism: {},
      newMultipleValue: "",
      structureInfo: {
        description: '',
        organismFunctionConfigId: null,
        functionId: null,
      },
      newFunctionDialog: false,
      organismData: {
        organismConfigId: null,
        fields: [],
      },
      functions: [],
      organismList: [],
      organismLinks: [],
      organismLinkEvent: '',
      organismSelected: '',
      organismVinculated: '',
      dialogLinks: false
    };
  },
  mounted() {
    this.$q.loading.hide()
  },
  beforeMount(){
    this.getOrganismsConfigs()
  },
  methods: {
    filterInOrganismLinks(val){
      console.log(val)
    },
    getOrganismsList() {
      const opt = {
        route: "/desktop/adm/getOrganismsList",
        body: {
          searchString: this.organismSelected
        }
      };
      useFetch(opt).then(r => {
        this.organismList = r.data.list;
      })
    },
    dialogInsertObservation(user) {
      this.dialogOpenObservation.data = user;
      this.dialogOpenObservation.open = true;
      this.dialogOpenObservation.functionUserId = user._id;
    },
    deleteUserFromFunction(user, funcIndex){
      const functionData = this.functions[funcIndex];
      
      const userId = user.functionUserId;
      const userIndex = functionData.users.findIndex(user => user._id === userId);

      if (userIndex !== -1) {
        functionData.users.splice(userIndex, 1);
      }
    },
    dialogOpenDeleteUserFromFunction(user, funcIndex) {
      this.dialogDeleteUserFromFunction.open = true;
      this.dialogDeleteUserFromFunction.data = user;
      this.dialogDeleteUserFromFunction.functionUserId = user._id;
      this.dialogDeleteUserFromFunction.funcIndex = funcIndex;
    },
    linkUserToFunction(func, funcIndex ) {
      console.log(func, 'FUNC OASDKAPKDOPAS')
      console.log(funcIndex, 'funcIndex OASDKAPKDOPAS')
      this.selectedFuncIndex = funcIndex;
      this.selectedFunc = func;
      this.dialogInsertUserInFunction.open = true;
    },
    inactivateUserFromFunction() {
      const funcIndex = this.dialogDeleteUserFromFunction.funcIndex;
      const functionData = this.functions[funcIndex];
      
      const userId = this.dialogDeleteUserFromFunction.functionUserId;
      const userIndex = functionData.users.findIndex(user => user._id === userId);

      if (userIndex !== -1) {
        functionData.users.splice(userIndex, 1);
        this.dialogDeleteUserFromFunction.open = false;
        this.dialogDeleteUserFromFunction.data = {};
        this.dialogDeleteUserFromFunction.functionUserId = "";
      }
    },
    assignUserToFunction() {
      const selectedFuncIndex = this.selectedFuncIndex;
      if (this.userSelected === "" || this.dialogInsertUserInFunction.initialDate === "") {
        this.$q.notify("Preencha usuário e a data início");
        return;
      }
      if (!this.functions[selectedFuncIndex].users) {
        this.functions[selectedFuncIndex].users = [];
      }
      this.functions[selectedFuncIndex].users.push({
        organismFunctionConfigId: this.selectedFunc.organismFunctionId,
        userName: this.userSelected.userName,
        functionName: this.selectedFunc.name,
        userId: this.userSelected._id,
        initialDate: this.dialogInsertUserInFunction.initialDate,
      });
      this.clearDialogAndFunctions();
    },
    saveUserFunction() {
      if (
        this.userSelected === "" ||
        this.dialogInsertUserInFunction.initialDate === ""
      ) {
        this.$q.notify("Preencha usuário e a data início");
        return;
      }
      const opt = {
        route: "/desktop/adm/saveUserFunction",
        body: {
          initialDate: this.dialogInsertUserInFunction.initialDate,
          userId: this.userSelected,
          organismFunctionConfigId:
            this.selectedFunc.organismStructureFunctionId,
          functionId: this.selectedFunc.functionId,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if (!r.error) {
          this.getOrganismStructureDetailById();
          this.$q.notify("Usuário vinculado na função com sucesso!");
          this.clearDialogAndFunctions();
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    clearDialogAndFunctions() {
      this.selectedFunc = {};
      this.userSelected = "";
      this.functionSelected = "";
      this.dialogInsertUserInFunction.open = false;
    },
    checkOrganismSelected(){
      if(this.organismData.organismConfigId === null){
        this.$q.notify('Preencha o nome da configuração para adicionar funções')
        return
      }
      this.newFunctionDialog = true
    },
    formatDate(newDate) {
      return date.formatDate(newDate, "DD/MM/YYYY");
    },
    getUsers() {
      const opt = {
        route: "/desktop/adm/getUsers",
        body: {
          searchString: this.userSelected,
          isActive: 1,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        this.usersOptions = r.data;
      });
    },
    getOrganismConfigById() {
      const opt = {
        route: "/desktop/adm/getOrganismConfigById",
        body: {
          _id: this.organismData.organismConfigId
        }
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (!r.error) {
          this.getOrganismsList()
          this.organismData.fields = r.data.organismFields;
          this.functions = r.data.functions
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    addMultipleField(field) {
      if (!field.value) {
        field.value = [];
      }
      console.log(field.newMultipleValue);
      field.value.push(field.newMultipleValue);
      console.log(field);
    },
    getOrganismsTypes() {
      const opt = {
        route: "/desktop/adm/getOrganismsTypes",
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          
          this.organismTypesOptions = r.data;
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    getOrganismsConfigs() {
      const opt = {
        route: "/desktop/adm/getOrganismsConfigs",
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.organismConfigOptions = r.data
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    createOrganism() {
      if (this.checkRequiredFields()) {
        const userData = [];
        for (const func of this.functions) {
          if (func.users && func.users.length > 0) {
            for (const user of func.users) {
              userData.push({
                organismFunctionConfigId: user.organismFunctionConfigId,
                userId: user.userId,
                dates: {
                  initialDate: user.initialDate
                }
              });
            }
          }
        }
        const organismLinksIds = this.organismLinks.map(organism => organism.organismId)
        const opt = {
          route: "/desktop/adm/createOrganism",
          body: {
            organismData: this.organismData,
            functions: userData,
            organismLinks: organismLinksIds
          },
        };
        this.$q.loading.show()
        useFetch(opt).then(r => {
          this.$q.loading.hide()
          if (!r.error) {
            this.$q.notify('Organismo criado com sucesso!');
            const organismId = r.data
            this.$router.push('/admin/organismDetail?organismId=' + organismId)
          } else {
            this.$q.notify("Ocorreu um erro, tente novamente por favor");
          }
        });
      } else {
        this.$q.notify("Há campos obrigatórios não preenchidos");
      }
    },
    checkRequiredFields() {
      let allRight = true;
      this.organismData.fields.forEach((field) => {
        if (field.required && (!field.value || field.value === "")) {
          allRight = false;
        }
      });
      return allRight;
    },
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
    addNewLink (organism) {
      this.organismLinks.push(organism)
    },
    removeLink(i) {
      this.organismLinks.splice(i,1)
    }

  },
});
</script>



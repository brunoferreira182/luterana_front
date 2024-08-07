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
      <q-breadcrumbs class="q-px-lg">
        <q-breadcrumbs-el 
          style="cursor: pointer;"
          :label="parentOrganismName" 
          @click="$router.push('/admin/organismDetail?organismId=' + this.$route.query.organismParentId)"
        >
          <q-tooltip>
            Voltar para organismo
          </q-tooltip>
        </q-breadcrumbs-el>
      </q-breadcrumbs>
      <q-separator class="q-mx-md" />
      <div class="row justify-around q-pa-md">
        <div class="col q-gutter-md" align="start">
          <div class="text-h5">Tipo de configuração de organismo</div>
          <q-select
            outlined
            readonly
            label="Nome da configuração"
            option-label="organismConfigName"
            :option-value="(item) => item._id"
            emit-value
            map-options
            hint="O tipo de configuração que está aplicado"
            v-model="organismConfigName"
          />
          <q-separator class="q-ma-md" />
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
                <template #append v-if="field.multiple">
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
                clearable
                use-input
                label="Nome do usuário"
                option-label="userName"
                :options="usersOptions"
                @filter="getUsers"
                :option-value="(item) => item._id"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Nenhum resultado
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.userName }}</q-item-label>
                      <q-item-label caption>{{ scope.opt.email }}</q-item-label>
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
import utils from "../../boot/utils";
import { date } from "quasar";
export default defineComponent({
  name: "CreateChildOrganism",
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
      newFunctionDialog: false,
      organismConfigName: '',
      organismData: {
        organismParentId: null,
        organismConfigId: null,
        fields: [],
      },
      functions: [],
      organismList: [],
      organismLinks: [],
      parentOrganismName: '',
      organismSelected: '',
      organismVinculated: '',
      originalRouteParams: {}, 
      dialogLinks: false
    };
  },
  mounted() {
    this.$q.loading.hide()
  },
  beforeMount(){
    this.startView()
  },
  methods: {
    async startView () {
      const permStatus = await utils.getPermissionStatus('ADMIN')
      if (permStatus.data === 'onMaitenance') {
        this.$router.push('/maitenancePage')
        return
      }
      this.getOrganismConfigById()
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
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.$q.notify("Usuário vinculado na função com sucesso!");
          this.clearDialogAndFunctions();
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
    getUsers(val, update, abort) {
      if(val.length < 3) {
        this.$q.notify('Digite no mínimo 3 caracteres')
        abort()
        return
      }
      const opt = {
        route: "/desktop/adm/getUsers",
        body: {
          searchString: val,
          isActive: 1,
          page: 1,
          rowsPerPage: 50
        }
      }
      if (this.dialogInsertUserInFunction.selectedFunc.functionRequiredTitleId) {
        opt.body.filterByTitleId = this.dialogInsertUserInFunction.selectedFunc.functionRequiredTitleId
      }
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if(r.error){ this.$q.notify(r.errorMessage) }
        update(() => {
          this.usersOptions = r.data.list;
        })
      });
    },
    getOrganismConfigById() {
      const organismChildConfigId = this.$route.query.organismChildConfigId
      const opt = {
        route: "/desktop/adm/getOrganismConfigById",
        body: {
          _id: organismChildConfigId
        }
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor")
          return
        }
        this.organismConfigName = r.data.organismConfigData.organismConfigName;
        this.organismData.fields = r.data.organismConfigData.organismFields;
        this.organismFields = r.data.organismConfigData.organismFields;
        r.data.organismConfigData.functions[0].organismFunctionId
          ? this.functions = r.data.organismConfigData.functions
          : this.functions = []
        this.selectedType = r.data.organismConfigData.organismConfigName;
        this.requiresLink = r.data.organismConfigData.requiresLink
        if (r.data.parentOrganismConfigName){
          this.parentOrganismConfigName = r.data.parentOrganismConfigData.parentOrganismConfigName
        }

        // if (r.data.organismConfigData){
        //   this.parentOrganismName = r.data.parentOrganismConfigData.parentOrganismName
        //   this.organismConfigName = r.data.organismConfigData.organismConfigName
        //   this.organismData.fields = r.data.organismConfigData.organismFields;
        //   this.functions = r.data.organismConfigData.functions
        // } else {
        //   this.getOrganismsList()
        //   this.organismConfigName = r.data.organismConfigName
        //   this.organismData.fields = r.data.organismFields;
        //   this.functions = r.data.functions
        // }
      });
    },
    addMultipleField(field) {
      if (!field.value) {
        field.value = [];
      }
      field.value.push(field.newMultipleValue);
    },
    getOrganismsTypes() {
      const opt = {
        route: "/desktop/adm/getOrganismsTypes",
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.organismTypesOptions = r.data;
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
        this.organismData.organismConfigId = this.$route.query.organismChildConfigId
        this.organismData.organismParentId = this.$route.query.organismParentId
        const opt = {
          route: "/desktop/adm/createChildOrganism",
          body: {
            organismData: this.organismData,
            functions: userData,
            organismLinks: organismLinksIds
          },
        };
        this.$q.loading.show()
        useFetch(opt).then(r => {
          this.$q.loading.hide()
          if (r.error) {
            this.$q.notify("Ocorreu um erro, tente novamente por favor");
          } else {
            const organismId = r.data
            this.$q.notify('Organismo criado com sucesso!');
            this.$router.push('/admin/organismDetail?organismId=' + organismId)
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

  },
});
</script>
<style scoped>
.pointer-breadcrumb {
  cursor: pointer;
}
</style>



<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">novo organismo</div>
        <div class="col-2">
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
      <div class="row justify-around q-pa-md">
        <div class="col-7 q-gutter-md" align="start">
          <div class="text-h5">Selecione o tipo de configuração de organismo</div>
          <q-select
            outlined
            label="Nome da configuração"
            option-label="organismConfigName"
            :option-value="(item) => item._id"
            emit-value
            map-options
            hint="Informe qual o tipo de configuração que está aplicando"
            v-model="organismData.organismConfigTypeId"
            :options="organismConfigOptions"
            @update:modelValue="getOrganismConfigById"
          />
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
                style="
                  border: 1px solid #c2c2c2;
                  border-radius: 3px;
                  padding: 5px;
                "
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
                  {{ field.label }} {{ i + 1 }} - {{ value }}
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
              :label="field.label + (field.required ? '' : ' (Opcional)')"
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
        <div class="col-4">
          <div class="row">
            <div
              class="text-h5"
            >
              Funções
            </div>
            <q-btn
              @click="checkOrganismSelected"
              class="q-mx-md"
              label="Adicionar"
              rounded
              flat
              color="primary"
              no-caps
              icon-right="add"
            />
          </div>
          <div v-for="(func, funcIndex) in functions" :key="func">
            <q-card
              style="border-radius: 1rem"
              class="bg-grey-3 q-ma-sm"
              flat
            >
              <q-item 
            
              >
                <q-item-section top left>
                  <div class="text-subtitle2 text-capitalize">{{ func.name }}</div>
                  <div>Descrição: {{ func.description }}</div>
                  <div class="text-caption text-grey-7">Título necessário: {{ func.requiredTitle ? func.requiredTitle.titleName : 'nenhum' }}</div>
            
                </q-item-section>
                
                <q-item-section top align="right">
                  <div class="text-subtitle2">
                    <q-badge color="orange-8" v-if="func.isRequired">
                      Obrigatório
                    </q-badge>
                  </div>
                </q-item-section>
              </q-item>
              <q-expansion-item
                icon="group"
                color="primary"
                class="q-pa-sm"
                label="Participantes"
                caption="Clique para ver ou adicionar"
              >
                <q-item
                  style="border-radius: 1rem"
                  class="bg-white q-ma-sm"
                >
                <q-item-section
                  v-for="user in organismData.functions"
                  :key="user"
                >
                  {{ user.userName }}
                </q-item-section>
                <q-item-section align="left">
                    <q-btn
                      label="Adicionar pessoa"
                      flat
                      color="primary"
                      dense
                      no-caps
                      @click="linkUserToFunction(func, funcIndex)"
                    />
                  </q-item-section>
                </q-item>
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
        <q-dialog v-model="dialogInsertUserInFunction.open" @hide="clearDialogAndFunctions">
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
                hint="Informe a data início da ocupação da função"
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
      userSelected: '',
      selectedFunc: "",
      selectedFuncIndex: "",
      usersOptions: [],
      organismConfigOptions: [],
      functions: [],
      organismFunctionConfigId: null,
      dialogInsertUserInFunction:{
        initialDate: '',
        open: false,
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
        organismConfigTypeId: null,
        fields: [],
        functions: []
      },
    };
  },
  mounted() {
    this.$q.loading.hide()
  },
  beforeMount(){
    this.getOrganismsConfigs()
  },
  methods: {
    linkUserToFunction(func, funcIndex ) {
      this.selectedFuncIndex = funcIndex;
      this.selectedFunc = func;
      this.dialogInsertUserInFunction.open = true;
    },
    assignUserToFunction() {
      if (this.userSelected === "" || this.dialogInsertUserInFunction.initialDate === "") {
        this.$q.notify("Preencha usuário e a data início");
        return;
      }
      this.organismData.functions.push({
        organismFunctionConfigId: this.selectedFunc.organismFunctionId,
        userName: this.userSelected.userName,
        functionName: this.selectedFunc.name,
        userId: this.userSelected._id,
        initialDate: this.dialogInsertUserInFunction.initialDate,
      });
      this.clearDialogAndFunctions();
    },
    // assignUserToFunction() {
    //   const { selectedFunc, userSelected } = this;
    //   if (!selectedFunc.userSelected) {
    //     selectedFunc.userSelected = [];
    //   }
    //   selectedFunc.userSelected.push(userSelected);
    //   this.dialogInsertUserInFunction.open = false;
    //   this.userSelected = "";
    // },
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
      // this.dialogOpenObservation.data = {};
      // this.dialogDeleteUserFromFunction.data = {};
      // this.dialogDeleteUserFromFunction.finalDate = "";
      // this.dialogDeleteUserFromFunction.functionUserId = "";
      // this.dialogDeleteUserFromFunction.obsText = "";
      // this.dialogOpenObservation.obsText = "";
      // this.dialogDeleteUserFromFunction.open = false;
      // this.dialogOpenObservation.open = false;
      this.dialogInsertUserInFunction.open = false;
    },
    checkOrganismSelected(){
      if(this.organismData.organismConfigTypeId === null){
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
   
    addFunction () {
      if (this.newFunction.name && this.newFunction.description) {
        this.functions.push({...this.newFunction})
        this.newFunctionDialog = false
      } else this.$q.notify('preencha os campos obrigatórios!')
    },
    getOrganismConfigById() {
      const opt = {
        route: "/desktop/adm/getOrganismConfigById",
        body: {
          _id: this.organismData.organismConfigTypeId
        }
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (!r.error) {
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
          // this.organismData.organismConfigId = r.data.organismConfigId
          // this.organismData.fields = r.data.organismFields;
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    createOrganism() {
      if (this.checkRequiredFields()) {
        const opt = {
          route: "/desktop/adm/createOrganism",
          body: {
            organismData: this.organismData,
          },
        };
        useFetch(opt).then((r) => {
          if (!r.error) {
            this.$q.notify('Organismo criado com sucesso!')
            const organismId = r.data
            this.$router.push('/admin/organismDetail?organismId=' + organismId)
          } else {
            this.$q.notify("Ocorreu um erro, tente novamente por favor");
          }
        });
      } else console.log("Há campos obrigatórios não preenchidos");
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



<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-capitalize"> 
          <div class="text-h5">
            detalhe do organismo {{ organismName }}
          </div>
        </div>
        <div class="col-2 text-center">
          <q-btn
            no-caps
            color="primary"
            rounded
            unelevated
            label="Salvar"
          />
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-around q-pa-md">
        <div class="col-7 q-gutter-md" align="start">
          <div class="text-h5">Organismo</div>
          <q-separator v-if="fields.length" />
          <div v-if="fields.length" class="text-h5">
            Dados
          </div>
          <div v-for="(field, i) in organismData.fields" :key="i">
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
        <q-separator vertical class="q-ma-md" />
        <div class="col-4">
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
                <q-item-section top left>
                  <div class="text-subtitle2 text-capitalize">{{ func.functionName }}</div>
                  <div>Descrição: {{ func.functionDescription }}</div>
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
                color="primary"
                class="q-pa-sm"
                icon="group"
                :label="func.users ? `${func.users.length} Participantes` : '0 Participantes'"
                caption="Clique para ver ou adicionar"
              >
                <q-item
                  v-for="user in func.users"
                  :key="user"
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
                      {{ formatDate(user.dates.initialDate) }}
                    </div>
                    <div
                      v-if="user.dataFim"
                      class="text-caption text-grey-7"
                    >
                      Data Fim: {{ formatDate(user.dates.finalDate) }}
                    </div>
                  </q-item-section>
                  <q-item-section side>
                    <div class="text-grey-8 q-gutter-xs">
                      <q-btn
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
                      </q-btn>
                      <q-btn
                        @click="dialogOpenDeleteUserFromFunction(user, funcIndex)"
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
            <q-dialog
              v-model="dialogOpenObservation.open"
              @hide="clearDialogAndFunctions"
            >
              <q-card style="border-radius: 1rem; width: 400px">
                <q-card-section>
                  <div 
                    v-if="dialogOpenObservation.data.obs.length"
                    class="text-subtitle1 text-center">
                    Histórico de observações:
                  </div>
                  <q-item
                    style="
                      border-radius: 0.5rem;
                      background-color: #e7e7e7;
                      margin: 10px;
                    "
                    v-for="obs in dialogOpenObservation.data.obs"
                    :key="obs"
                  >
                    
                    <q-item-section>
                      {{ obs.obsText }}
                    </q-item-section>
                    <q-item-section align="end" class="text-caption">
                      <div>
                        Publicado em
                      </div>
                      <div>
                        {{ obs.createdAt.createdAtOnlyDate }}
                      </div>
                    </q-item-section>
                  </q-item>
                </q-card-section>
                <q-card-section>
                  <div class="text-h6 text-center">
                    Insira uma observação à respeito de
                    {{ dialogOpenObservation.data.userName }}
                  </div>
                </q-card-section>
                <q-card-section align="center" class="q-gutter-sm">
                  <q-input
                    filled
                    label="Observação"
                    v-model="dialogOpenObservation.obsText"
                    hint="Insira aqui sua observação"
                  />
                </q-card-section>
                <q-card-actions align="center">
                  <q-btn
                    flat
                    label="Depois"
                    no-caps
                    rounded
                    color="primary"
                    @click="dialogOpenObservation.open = false"
                  />
                  <q-btn
                    unelevated
                    rounded
                    label="Confirmar"
                    no-caps
                    color="primary"
                    @click="addObservationForFunctionUser"
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
          </div>
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import { date } from "quasar";
export default defineComponent({
  name: "OrganismDetail",
  data() {
    return {
      tab: 'organismData',
      usersOptions: [],
      organismTypeId: null,
      organismName: '',
      userSelected: '',
      organism: null,
      fields: [],
      newOrganism: {},
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
      dialogOpenObservation: {
        open: false,
        functionUserId: "",
        obsText: "",
        data: {},
      },
      organismData: {
        organismConfigId: null,
        fields: [],
      },
      functions: [],
    };
  },
  mounted() {
    this.$q.loading.hide()
  },
  beforeMount(){
    this.getOrganismDetailById();
  },
  methods: {
    dialogInsertObservation(user) {
      console.log(user, 'OPKAOPKSDOP USER USER')
      this.dialogOpenObservation.data = user;
      this.dialogOpenObservation.open = true;
      this.dialogOpenObservation.functionUserId = user.userIdMongo
    },
    addObservationForFunctionUser() {
      if (
        this.dialogOpenObservation.obsText === ''
      ) {
        this.$q.notify("Preencha o campo observação");
        return;
      }
      const opt = {
        route: "/desktop/adm/addObservationForFunctionUser",
        body: {
          obsText: this.dialogOpenObservation.obsText,
          functionUserId: this.dialogOpenObservation.functionUserId
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if (!r.error) {
          this.getOrganismDetailById();
          this.$q.notify("Observação inserida com sucesso!");
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
      this.dialogOpenObservation.data = {};
      this.dialogDeleteUserFromFunction.data = {};
      this.dialogDeleteUserFromFunction.finalDate = "";
      this.dialogDeleteUserFromFunction.functionUserId = "";
      this.dialogDeleteUserFromFunction.obsText = "";
      this.dialogOpenObservation.obsText = "";
      this.dialogDeleteUserFromFunction.open = false;
      this.dialogOpenObservation.open = false;
      this.dialogInsertUserInFunction.open = false;
    },
    dialogOpenDeleteUserFromFunction(user, funcIndex) {
      this.dialogDeleteUserFromFunction.open = true;
      this.dialogDeleteUserFromFunction.data = user;
      this.dialogDeleteUserFromFunction.functionUserId = user.userIdMongo;
      this.dialogDeleteUserFromFunction.funcIndex = funcIndex;
    },
    inactivateUserFromFunction() {
      if (
        this.dialogDeleteUserFromFunction.obsText === "" ||
        this.dialogDeleteUserFromFunction.finalDate === ""
      ) {
        this.$q.notify("Preencha observação e data final para prosseguir!");
        return;
      }
      const opt = {
        route: "/desktop/adm/inactivateUserFromFunction",
        body: {
          functionUserId: this.dialogDeleteUserFromFunction.functionUserId,
          finalDate: this.dialogDeleteUserFromFunction.finalDate,
          obsText: this.dialogDeleteUserFromFunction.obsText,
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.getOrganismDetailById();
          this.$q.notify("Usuário deletado com sucesso!");
          this.clearDialogAndFunctions();
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
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
    formatDate(newDate) {
      return date.formatDate(newDate, "DD/MM/YYYY");
    },
    assignUserToFunction() {
      const selectedFuncIndex = this.selectedFuncIndex;
      console.log(selectedFuncIndex, 'OPKASPODKOSAP selectedFuncIndex');
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
    linkUserToFunction(func, funcIndex ) {
      console.log(func, 'FUNC OASDKAPKDOPAS')
      console.log(funcIndex, 'funcIndex OASDKAPKDOPAS')
      this.selectedFuncIndex = funcIndex;
      this.selectedFunc = func;
      this.dialogInsertUserInFunction.open = true;
    },
    getOrganismDetailById() {
      const organismId = this.$route.query.organismId
      const opt = {
        route: "/desktop/adm/getOrganismDetailById",
        body: {
          organismId: organismId,
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.organismName = r.data.organismData.organismName
          this.organismData.fields = r.data.organismData.fields;
          this.functions = r.data.functions
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
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
.sector-card {
  height: 150x; 
  width: 400px;
  padding: 10px;
  border-radius: 1rem;
}
</style>

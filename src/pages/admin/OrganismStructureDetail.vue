<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md row justify-start">
        <q-btn
          rounded
          class="q-mx-md"
          dense
          flat
          color="primary"
          @click="$router.back()"
          icon="arrow_back_ios_new"
        />
        <div class="col-6 text-capitalize">
          <div class="text-h5">detalhe da estrutura</div>
          <q-breadcrumbs>
            <q-breadcrumbs-el
              class="pointer-breadcrumb"
              :label="organismDetail.organismTypeName"
              @click="
                $router.push(
                  '/config/organismTypeDetail?organismTypeId=' +
                    organismDetail.organismTypeId
                )
              "
            />
            <q-breadcrumbs-el
              class="pointer-breadcrumb"
              :label="organismDetail.organismName"
              @click="
                $router.push(
                  '/admin/organismDetail?organismId=' +
                    organismDetail.organismId
                )
              "
            />
            <q-breadcrumbs-el :label="structureDetail.structureName" />
          </q-breadcrumbs>
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="text-right q-pa-md">
        <q-btn
          no-caps
          unelevated
          rounded
          outline
          @click="dialogInsertFunction.open = true"
          color="primary"
          icon="add"
          label="Adicionar função"
        />
      </div>
      <div class="row justify-left">
        <div
          v-for="(func, funcIndex) in structureFunctionData.functions"
          :key="func"
          class="col-6"
        >
          <q-card class="sector-card bg-grey-1">
            <div class="row justify-start">
              <div class="text-h6 q-mx-md">{{ func.functionName }}</div>
            </div>
            <q-card-section class="q-gutter-sm">
              <q-list v-if="func.users.length">
                <q-item
                  :disable="user.dates.dataFim ? true : false"
                  style="
                    border-radius: 0.5rem;
                    background-color: #e7e7e7;
                    margin: 10px;
                  "
                  v-for="user in func.users"
                  :key="user"
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
                      {{ formatDate(user.dates.dataInicio.local) }}
                    </div>
                    <div
                      v-if="user.dates.dataFim"
                      class="text-caption text-grey-7"
                    >
                      Data Fim: {{ formatDate(user.dates.dataFim.local) }}
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
                        @click="dialogOpenDeleteUserFromFunction(user)"
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
              </q-list>
              <div
                v-else
                style="
                  border-radius: 0.5rem;
                  background-color: #e7e7e7;
                  margin: 10px;
                  padding: 16px;
                "
              >
                Nenhum usuário vinculado nesta função
                <q-icon size="sm" color="yellow-10" name="warning" />
              </div>
              <div align="end">
                <q-btn
                  rounded
                  flat
                  color="primary"
                  icon="person_add_alt_1"
                  no-caps
                  unelevated
                  @click="linkUserToFunction(funcIndex, func)"
                  label="Adicionar pessoa"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      
      <q-dialog
        v-model="dialogInsertFunction.open"
        @hide="clearDialogAndFunctions"
      >
        <q-card style="border-radius: 1rem; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">Selecione a função</div>
          </q-card-section>
          <q-card-section align="center">
            <q-select
              filled
              option-label="name"
              :option-value="(item) => item.functionId"
              emit-value
              map-options
              label="Nome da função"
              :options="functionsOptions"
              v-model="functionSelected"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Depois"
              no-caps
              rounded
              color="primary"
              @click="dialogInsertFunction.open = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="createOrganismStructureFunction"
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
              hint="Informe a data final da ocupação da função"
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
      <q-dialog
        v-model="dialogOpenObservation.open"
        @hide="clearDialogAndFunctions"
      >
        <q-card style="border-radius: 1rem; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">Observações:</div>
            <q-item
              style="
                border-radius: 0.5rem;
                background-color: #e7e7e7;
                margin: 10px;
              "
              v-for="(obs, i) in dialogOpenObservation.data.userObs"
              :key="i"
            >
              <q-item-section>
                {{ obs.obsText }}
              </q-item-section>
            </q-item>
          </q-card-section>
          <q-card-section>
            <div class="text-h6 text-center">
              Insira observação à respeito de
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
              @click="dialogDeleteUserFromFunction.open = false"
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
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";

export default defineComponent({
  name: "OrganismStructureDetail",
  data() {
    return {
      structureDetail: {},
      organismDetail: {},
      usersOptions: [],
      functionsOptions: [],
      structureFunctionData: [],
      breadCrumbOrganism: "",
      breadCrumbStructure: "",
      breadCrumbOrganismTypeName: "",
      dialogInsertUser: {
        initialDate: "",
        open: false,
      },
      dialogInsertFunction: {
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
      userSelected: "",
      functionSelected: "",
      functionData: {
        functionId: null,
        description: "",
      },
      organismId: "",
      selectedSector: "",
      selectedFunc: "",
      selectedFuncIndex: "",
      selectedSectorIndex: "",
      structureId: "",
      organismStructureFunctionId: "",
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  created() {
    this.getAvailableFunctionsByStructureId();
  },
  beforeMount() {
    this.getOrganismStructureDetailById();
  },
  methods: {
    dialogInsertObservation(user) {
      this.dialogOpenObservation.data = user;
      this.dialogOpenObservation.open = true;
      this.dialogOpenObservation.functionUserId = user._id;
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
      this.dialogInsertFunction.open = false;
      this.dialogInsertUser.open = false;
    },
    dialogOpenDeleteUserFromFunction(user) {
      this.dialogDeleteUserFromFunction.data = user;
      this.dialogDeleteUserFromFunction.functionUserId = user._id;
      this.dialogDeleteUserFromFunction.open = true;
    },
    linkUserToFunction(funcIndex, func) {
      this.selectedFuncIndex = funcIndex;
      this.selectedFunc = func;
      this.dialogInsertUser.open = true;
    },
    addObservationForFunctionUser() {
      const opt = {
        route: "/desktop/adm/addObservationForFunctionUser",
        body: {
          functionUserId: this.dialogOpenObservation.functionUserId,
          obsText: this.dialogOpenObservation.obsText,
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.getOrganismStructureDetailById();
          this.$q.notify("Usuário deletado com sucesso!");
          this.clearDialogAndFunctions();
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
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
          this.getOrganismStructureDetailById();
          this.$q.notify("Usuário deletado com sucesso!");
          this.clearDialogAndFunctions();
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    getAvailableFunctionsByStructureId() {
      const opt = {
        route: "/desktop/adm/getAvailableFunctionsByStructureId",
        body: {
          structureId: this.structureId,
        },
      };
      useFetch(opt).then((r) => {
        this.functionsOptions = r.data;
      });
    },
   
    
    assignUserToFunction() {
      const { selectedFunc, userSelected } = this;
      if (!selectedFunc.userSelected) {
        selectedFunc.userSelected = [];
      }
      selectedFunc.userSelected.push(userSelected);
      this.dialogInsertUser.open = false;
      this.userSelected = "";
    },
    createOrganismStructureFunction() {
      const organismStructureId = this.$route.query.organismStructureId;
      const opt = {
        route: "/desktop/adm/createOrganismStructureFunction",
        body: {
          organismStructureId: organismStructureId,
          functionId: this.functionSelected,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if (!r.error) {
          this.getOrganismStructureDetailById();
          this.$q.notify("Função criada com sucesso!");
          this.clearDialogAndFunctions();
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    saveUserFunction() {
      if (
        this.userSelected === "" ||
        this.dialogInsertUser.initialDate === ""
      ) {
        this.$q.notify("Preencha usuário e a data início");
        return;
      }
      const opt = {
        route: "/desktop/adm/saveUserFunction",
        body: {
          initialDate: this.dialogInsertUser.initialDate,
          userId: this.userSelected,
          organismStructureFunctionId:
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
    getOrganismStructureDetailById() {
      const organismStructureId = this.$route.query.organismStructureId;
      const opt = {
        route: "/desktop/adm/getOrganismStructureDetailById",
        body: {
          organismStructureId: organismStructureId,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if (!r.error) {
          this.breadCrumbOrganism = r.data.organismName;
          this.breadCrumbStructure = r.data.structureName;
          this.breadCrumbOrganismTypeName = r.data.organismTypeName;
          this.organismDetail = r.data.organismData;
          this.structureDetail = r.data.structureData;
          this.structureId = r.data.structureId;
          this.organismId = r.data.organismId;
          this.structureFunctionData = r.data;
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
  },
});
</script>
<style scoped>
.pointer-breadcrumb {
  cursor: pointer;
}
.sector-card {
  border-radius: 1rem;
  margin: 10px;
}
</style>

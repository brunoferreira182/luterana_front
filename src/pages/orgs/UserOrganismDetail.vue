<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-capitalize"> 
          <div class="text-h5">
            detalhe do organismo {{ organismName }}
          </div>
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <q-tabs
        v-model="tab"
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="generalData" label="Dados gerais" />
        <q-tab name="solicitation" label="Solicitações" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="generalData">
          <div class="row justify-around q-pa-md">
            <div class="col-7 q-gutter-md q-mt-sm" align="start">
              <q-select
                outlined
                label="Nome da configuração"
                option-label="organismConfigName"
                :option-value="(item) => item._id"
                emit-value
                readonly
                map-options
                hint="O tipo de configuração que está aplicado"
                v-model="organismConfigName"
                :options="organismConfigOptions"
              />
              <div v-if="fields.length" class="text-h5">
                Dados
              </div>
              <div v-for="(field, i) in organismData.fields" :key="i">
                <q-input
                  v-if="field.type.type !== 'boolean'"
                  v-model="field.value"
                  outlined
                  readonly
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
                  readonly
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
              <div v-for="func in functions" :key="func">
                <q-card
                  style="border-radius: 1rem"
                  class="bg-grey-3 q-ma-sm"
                  flat
                >
                  <q-item>
                    <q-item-section top>
                      <div class="text-subtitle2 text-capitalize">{{ func.functionName }}</div>
                      <div>Descrição: {{ func.functionDescription }}</div>
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
                          v-if="!func.visions || !func.visions.length"
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
                    class="q-pa-sm"
                    icon="group"
                    :label="func.users ? `${func.users.length} Participantes` : '0 Participantes'"
                    caption="Clique para ver"
                  >
                    <q-item
                      v-for="(user, userIndex) in func.users"
                      :key="userIndex"
                      style="border-radius: 0.5rem; margin-top: 8px;"
                      class="bg-white"
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
                    </q-item>
                  </q-expansion-item>
                  <q-item-section class="q-pa-xs">
                    <q-btn
                      label="Quero participar"
                      color="primary"
                      dense
                      icon="add"
                      rounded
                      flat
                      no-caps
                      @click="clkOpenDialogSolicitation(func)"
                    />
                  </q-item-section>
                </q-card>
                <q-dialog v-model="dialogOpenSolicitation.open" >
                  <q-card style="border-radius: 1rem; width: 456px; padding: 10px">
                    <q-card-section align="center">
                      <div class="text-h6">
                        Solicitação de participação na função {{ dialogOpenSolicitation.data.functionName }}
                      </div>
                    </q-card-section>
                    <q-card-section align="center">
                      <q-input
                        filled
                        label="Observação"
                        hint="Escreva uma breve descrição explicando o motivo para participar desta função"
                        v-model="dialogOpenSolicitation.obs"
                      />
                    </q-card-section>
                    <q-card-actions align="center">
                      <q-btn
                        flat
                        label="Depois"
                        no-caps
                        rounded
                        color="primary"
                        @click="dialogOpenSolicitation.open = false"
                      />
                      <q-btn
                        unelevated
                        rounded
                        label="Enviar"
                        no-caps
                        color="primary"
                        @click="addFunctionSolicitation"
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
                <q-dialog full-height full-width v-model="dialogLinks" @hide="clearDialogAndFunctions">
                  <q-card>
                    <q-card-section>
                      <div class="text-h6 text-center">
                        Vínculos
                      </div>
                    </q-card-section>
                    <q-card-section>
                      <div class="row">
                        <div class="col-6">
                          <q-separator/>
                          <div class="text-subtitle2 q-ma-sm">
                            Organismos filiados vinculados:
                          </div>
                          <div v-if="childOrganism.length">
                            <q-chip removable @remove="removeChildRelation(chip)" v-for="chip in childOrganism" :key="chip._id">
                              {{ chip.organismName }}
                            </q-chip>
                          </div>
                          <div v-else-if="!organismLinks.length" class="text-center q-mt-md">Nenhum vínculo.</div>
                        </div>
                        <q-separator vertical />
                        <div class="col">
                          <q-separator/>
                          <div class="text-subtitle2 q-ma-sm">
                            Organismos superiores vinculados:
                          </div>
                          <div v-if="parentOrganism.length">
                            <q-chip removable @remove="removeParentRelation(chip)" v-for="chip in parentOrganism" :key="chip._id">
                              {{ chip.organismName }}
                            </q-chip>
                          </div>
                          <div v-else-if="!parentOrganism.length" class="text-center q-mt-md">Nenhum vínculo.</div>
                        </div>
                      </div>
                      <div v-if="organismLinks.length">
                        <q-chip removable @remove="removeLink(chip,i)" v-for="(chip, i) in organismLinks" :key="i">
                          {{ chip.nome }}
                        </q-chip>
                      </div>
                      <div v-else-if="$router.query === '/admin/createOrganism' && !organismLinks.length" class="text-center q-mt-md">Nenhum vínculo.</div>
                    </q-card-section>
                    <q-card-section>
                      <div class="text-subtitle2 q-mb-sm">Vincular novo organismo:</div>
                      <q-input 
                        label="Buscar"
                        outlined
                        type="search"
                        v-model="organismSelected"
                        hint="Faça uma busca para visualizar os organismos disponíveis"
                        @update:model-value="getOrganismsList"
                      >
                        <template #append>
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
                        unelevated
                        rounded
                        color="primary"
                        @click="clkSaveVinculo"
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
              </div>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="solicitation">
          <div class="text-h6">Alarms</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import { date } from "quasar";
export default defineComponent({
  name: "UserOrganismDetail",
  data() {
    return {
      usersOptions: [],
      organismVinculated: '',
      organismTypeId: null,
      tab: 'generalData',
      organismName: '',
      userSelected: '',
      organism: null,
      fields: [],
      organismConfigOptions: [],
      dialogOpenSolicitation: {
        obs: '',
        data: {},
        open: false, 
      },
      newOrganism: {},
      organismSelected: '',
      dialogDeleteUserFromFunction: {
        obsText: "",
        finalDate: "",
        functionUserId: "",
        open: false,
        data: {},
      },
      organismData: {
        organismConfigId: null,
        fields: [],
      },
      functions: [],
      organismList: [],
      organismLinks: [],
      parentOrganism: [],
      childOrganism: [],
      organismConfigName: '',
      organismSearch: '',
      dialogLinks: false
    };
  },
  mounted() {
    this.$q.loading.hide()
  },
  beforeMount(){
    this.getOrganismDetailById();
    this.getOrganismsList()
    this.getOrganismsConfigs()
    this.getParentOrganismsById()
    this.getChildOrganismsById()
  },
  methods: {
    clkOpenDialogSolicitation(func){
      this.dialogOpenSolicitation.data = func
      this.dialogOpenSolicitation.open = true
    },
    filterInOrganismLinks(val){
      console.log(val)
    },
    addFunctionSolicitation() {
      const organismId = this.$route.query.organismId
      const opt = {
        route: "/desktop/adm/addFunctionSolicitation",
        body: {
          organismId: organismId,
          functionId: this.dialogOpenSolicitation.data.functionId,
          obs: this.dialogOpenSolicitation.obs
        }
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.$q.notify("Solicitação encaminhada para análise!");
          this.getOrganismDetailById()
          this.dialogOpenSolicitation.open = false
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
    checkRequiredFields() {
      let allRight = true;
      this.organismData.fields.forEach((field) => {
        if (field.required && (!field.value || field.value === "")) {
          allRight = false;
        }
      });
      return allRight;
    },
    updateOrganism(){
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
        const organismId = this.$route.query.organismId
        const opt = {
          route: '/desktop/adm/removeParentRelation',
          body: {
            organismData: this.organismData,
            functions: userData,
            organismId: organismId
          }
        }
        this.$q.loading.show()
        useFetch(opt).then(r => {
          this.$q.loading.hide()
          if(!r.error){
            this.$q.notify('Organismo editado com sucesso!')
            this.getOrganismDetailById()
          } else {
            this.$q.notify('Ocorreu um erro, tente novamente')
          }
        })
      } else {
        this.$q.notify("Há campos obrigatórios não preenchidos");
      }
    },
    removeParentRelation(chip){
      const organismParentId = chip._id
      const opt = {
        route: '/desktop/adm/removeParentRelation',
        body: {
          organismId: organismParentId
        }
      }
      this.$q.loading.show()
      useFetch(opt).then(r => {
        this.$q.loading.hide()
        if(!r.error){
          this.$q.notify('Vínculo removido com sucesso!')
          this.getParentOrganismsById()
        } else {
          this.$q.notify('Ocorreu um erro, tente novamente')
        }
      })
    },
    removeChildRelation(chip){
      const organismChildId = chip._id
      const opt = {
        route: '/desktop/adm/removeChildRelation',
        body: {
          organismId: organismChildId
        }
      }
      this.$q.loading.show()
      useFetch(opt).then(r => {
        this.$q.loading.hide()
        if(!r.error){
          this.$q.notify('Vínculo removido com sucesso!')
          this.getChildOrganismsById()
        } else {
          this.$q.notify('Ocorreu um erro, tente novamente')
        }
      })
    },
    clkSaveVinculo(){
      const organismLinksIds = this.organismLinks.map(organism => organism.organismId)
      const organismId = this.$route.query.organismId
      const opt = {
        route: '/desktop/adm/createRelation',
        body: {
          organismId: organismId,
          organismLinks: organismLinksIds
        }
      }
      this.$q.loading.show()
      useFetch(opt).then(r => {
        this.$q.loading.hide()
        if(!r.error){
          this.$q.notify('Vínculo salvo com sucesso!')
          this.dialogLinks = false
          this.getParentOrganismsById()
        } else {
          this.$q.notify('Ocorreu um erro, tente novamente')
        }
      })
    },
    dialogInsertObservation(user) {
      this.dialogOpenObservation.data = user;
      this.dialogOpenObservation.open = true;
      this.dialogOpenObservation.functionUserId = user.userIdMongo
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
    getOrganismsList(val) {
      console.log(this.organismSearch, 'serach')
      console.log(val, 'valval')
      const opt = {
        route: "/desktop/adm/getOrganismsList",
        body: {
          searchString: val
        }
      };
      useFetch(opt).then((r) => {
        this.organismList = r.data.list;
      });
    },
    getChildOrganismsById() {
      const childOrganismId = this.$route.query.organismId
      const opt = {
        route: "/desktop/adm/getChildOrganismsById",
        body: {
          organismId: childOrganismId
        }
      };
      useFetch(opt).then((r) => {
        this.childOrganism = r.data;
      });
    },
    getParentOrganismsById() {
      const parentOrganismId = this.$route.query.organismId
      const opt = {
        route: "/desktop/adm/getParentOrganismsById",
        body: {
          organismId: parentOrganismId
        }
      };
      useFetch(opt).then((r) => {
        this.parentOrganism = r.data;
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
          this.getOrganismDetailById();
          this.$q.notify("Usuário deletado com sucesso!");
          this.clearDialogAndFunctions();
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    getUsers(val, update) {
      console.log(val, 'AUQI VAL')
      const opt = {
        route: "/desktop/adm/getUsers",
        body: {
          searchString: val,
          isActive: 1,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        update(() => {
          this.usersOptions = r.data;
        })
      });
    },
    formatDate(newDate) {
      return date.formatDate(newDate, "DD/MM/YYYY");
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
    linkUserToFunction(func, funcIndex ) {
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
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.functions = r.data.functions
          this.organismName = r.data.organismData.organismName
          this.organismData.fields = r.data.organismData.fields;
          this.organismConfigName = r.data.organismData.organismConfigName
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
    addNewLink (organism) {
      this.organismLinks.push(organism)
    },
    removeLink(i) {
      this.organismLinks.splice(i,1)
    }
  },
});
</script>

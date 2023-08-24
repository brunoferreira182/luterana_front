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
        dense
        no-caps
        class="text-grey q-py-sm"
        active-color="primary"
        indicator-color="primary"
        inline-label
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
                      <div class="text-caption text-grey-7">Título necessário: {{ func.functionIsRequired ? func.functionRequiredTitleName : 'nenhum' }}</div>
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
                      v-for="user in func.users"
                      :key="user"
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
                        @click="sendFunctionSolicitation"
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
              </div>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="solicitation">
          <div class="text-h5">Solicitações</div>
          <q-list>
            <div class="row q-gutter-md" v-if="solicitationData !== 0">
              <div 
                v-for="(solic, solicIndex) in solicitationData.solicitations" 
                :key="solicIndex"
                class="col-5" 
              >
                <q-item 
                  class="solicitation-cards"
                >
                  <q-item-section>
                    <div class="row justify-between">
                      <div class="col text-capitalize text-subtitle1">
                        {{ solic.userName }}
                      </div>
                      <div class="col-2 text-caption">
                        {{ solic.createdAt.createdAtOnlyDate }}
                      </div>
                    </div>
                    <q-item-label caption lines="10">
                      {{ solic.solicitationData.obs.substring(0, obsMaxLength) }}
                        <span v-if="solic.solicitationData.obs.length > obsMaxLength">
                          {{ showFullText[solicIndex] ? solic.solicitationData.obs.substring(obsMaxLength) : '...' }}
                          <q-btn
                            rounded
                            color="primary"
                            dense
                            no-caps
                            flat
                            :label="this.showFullText[solicIndex] ? 'Ver menos' : 'Ver mais'"
                            @click="toggleExpandText(solicIndex)"
                          />
                        </span>
                    </q-item-label>
                    <q-item-label class="text-center q-gutter-md">
                      <q-btn
                        rounded
                        color="primary"
                        dense
                        no-caps
                        flat
                        @click="clkReproveSolicitation(solic, solicIndex)"
                        label="Reprovar"
                      />
                      <q-btn
                        rounded
                        color="primary"
                        unelevated
                        no-caps
                        @click="dialogAproveSolicitation"
                        label="Aprovar"
                      />
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-dialog v-model="dialogReproveSolicitation.open" >
                  <q-card style="border-radius: 1rem; width: 456px; padding: 10px">
                    <q-card-section align="center">
                      <div class="text-h6">
                        Informe o motivo para reprovar a solicitação
                      </div>
                    </q-card-section>
                    <q-card-section align="center">
                      <q-input
                        filled
                        label="Observação"
                        autogrow
                        hint="Escreva uma breve descrição explicando o motivo para reprovar esta solicitação"
                        v-model="dialogReproveSolicitation.obs"
                      />
                    </q-card-section>
                    <q-card-actions align="center">
                      <q-btn
                        flat
                        label="Depois"
                        no-caps
                        rounded
                        color="primary"
                        @click="dialogReproveSolicitation.open = false"
                      />
                      <q-btn
                        unelevated
                        rounded
                        label="Enviar"
                        no-caps
                        color="primary"
                        @click="sendReproveFeedback"
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
              </div>
            </div>
            <div class="text-subtitle1" v-else-if="solicitationData === 0">
              Nenhuma solicitação <q-icon name="warning" size="sm" color="warning"></q-icon>
            </div>
          </q-list>
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
      showFullDescription: false,
      tab: 'generalData',
      organismName: '',
      userSelected: '',
      myUserIdMongo: '',
      organism: null,
      fields: [],
      obsMaxLength: 55,
      showFullText: [],
      dialogAproveSolicitation: {
        open: false,
        data: {},
      },
      dialogReproveSolicitation: {
        open: false,
        obs: '',
        data: {},
      },
      organismConfigOptions: [],
      dialogOpenSolicitation: {
        obs: '',
        functionConfigId: '',
        open: false, 
      },
      newOrganism: {},
      organismSelected: '',
      organismData: {
        organismConfigId: null,
        fields: [],
      },
      functions: [],
      solicitationData: [],
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
    this.getUserIdMongo()
    this.getOrganismDetailById();
    this.getOrganismsConfigs()
    this.getSolicitationsByOrganismId()
  },
  methods: {
    getUserIdMongo(){
      const opt = {
        route: '/desktop/adm/getUserIdMongo',
      }
      useFetch(opt).then(r => {
        if(r.error){
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
          return
        }else{ this.myUserIdMongo = r.data.userIdMongo}
      })
    },
    sendReproveFeedback(){
      this.$q.notify('IMPLEMENTAR ROTA')
      this.dialogReproveSolicitation.open = false
    },
    clkReproveSolicitation(solic, solicIndex){
      console.log(solic, 'solic')
      console.log(solicIndex, 'solicindex')
      this.dialogReproveSolicitation.open = true
    },
    toggleExpandText(solicIndex){
      this.showFullText[solicIndex] = !this.showFullText[solicIndex];
    },
    clkOpenDialogSolicitation(func) {
      for (const user of func.users) {
        if (user.userIdMongo === this.myUserIdMongo) {
          this.$q.notify('Você já participa desta função')
          return
        }
      }
      this.dialogOpenSolicitation.functionConfigId = func.functionConfigId
      this.dialogOpenSolicitation.open = true;
    },
    getSolicitationsByOrganismId() {
      const organismId = this.$route.query.organismId
      const opt = {
        route: "/desktop/adm/getSolicitationsByOrganismId",
        body: {
          organismId: organismId,
        }
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          if(!r.data){
            this.solicitationData = 0
          } else {
            this.solicitationData = r.data
          }
        }
      });
    },
    sendFunctionSolicitation() {
      const organismId = this.$route.query.organismId
      const opt = {
        route: "/desktop/adm/addFunctionSolicitation",
        body: {
          organismId: organismId,
          functionId: this.dialogOpenSolicitation.data,
          obs: this.dialogOpenSolicitation.obs
        }
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.$q.notify("Solicitação encaminhada para análise!");
          this.getSolicitationsByOrganismId()
          this.dialogOpenSolicitation.open = false
        }
      });
    },
    getOrganismsConfigs() {
      const opt = {
        route: "/desktop/adm/getOrganismsConfigs",
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.organismConfigOptions = r.data
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
    formatDate(newDate) {
      return date.formatDate(newDate, "DD/MM/YYYY");
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
  },
});
</script>
<style scoped>
.solicitation-cards{
  border-radius: 1rem;
  height: auto;
  width: auto;
  background-color: #e4e4e4;
}
.more-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #747474;
}
</style>

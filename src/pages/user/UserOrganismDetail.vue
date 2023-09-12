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
      <div class="row justify-around q-pa-md">
        <div class="col-7 q-gutter-md q-mt-sm" align="start">
          <div class="text-h5 no-margin q-px-md">
            Dados
          </div>
          <q-select outlined label="Nome da configuração" option-label="organismConfigName"
            :option-value="(item) => item._id" emit-value readonly map-options
            hint="O tipo de configuração que está aplicado" v-model="organismConfigName"
            :options="organismConfigOptions" />
          <div v-if="fields.length" class="text-h5">
            Dados
          </div>
          <div v-for="(field, i) in organismData.fields" :key="i">
            <q-input v-if="field.type.type !== 'boolean'" v-model="field.value" outlined readonly
              :type="getInputType(field.type.type)" :reverse-fill-mask="field.type.type === 'money'"
              :prefix="field.type.type === 'money' ? 'R$' : null"
              :label="field.label + (field.required ? '' : ' (Opcional)')" :mask="field.type.mask" :hint="field.hint" />
            <q-checkbox v-else-if="field.type.type === 'boolean'" :label="field.label" readonly
              v-model="newOrganism[field.model]"></q-checkbox>
          </div>
        </div>
        <q-separator vertical class="q-ma-md" />
        <div class="col-4">
          <div class="row">
            <div class="text-h5">
              Funções
            </div>
          </div>
          <div v-for="(func, funcIndex) in functions" :key="func">
            <CardFunction
              :func="func"
              :funcIndex="funcIndex"
              @clkOpenDialogSolicitation="clkOpenDialogSolicitation"
            />
            <q-dialog v-model="dialogOpenSolicitation.open" @hide="clearDialogSolicitation">
              <q-card style="border-radius: 1rem; width: 456px; padding: 10px">
                <q-card-section align="center">
                  <div class="text-h6">
                    Solicitação de participação na função {{ dialogOpenSolicitation.data.functionName }}
                  </div>
                </q-card-section>
                <q-card-section>
                  <q-select
                    v-model="userSelected"
                    filled
                    clearable
                    use-input
                    label="Quem convidar"
                    option-label="userName"
                    :options="usersOptions"
                    @filter="getUsers"
                    :option-value="(item) => item._id"
                    hint="Digite o nome de quem você vai convidar"
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
                  <q-list class="q-mt-md">
                    <q-item-label header>Irá substituir algúem que já está na função?</q-item-label>
                    <q-item
                      tag="label"
                      v-ripple
                      v-for="item in dialogOpenSolicitation.data.users"
                      :key="item._id"
                    >
                      <q-item-section avatar>
                        <q-radio
                          v-model="dialogOpenSolicitation.userToReplace"
                          :val="item"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ item.userName }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                <!-- <q-card-section>
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
                </q-card-section> -->
                <!-- <q-card-section align="center">
                  <q-input filled label="Observação"
                    hint="Escreva uma breve descrição explicando o motivo para participar desta função"
                    v-model="dialogOpenSolicitation.obs" />
                    <q-checkbox 
                      :disable="disableIsReplacement"
                      class="q-pt-lg full-width" 
                      v-model="isReplacement"
                      label="Substituir por outro usuário nessa função?" 
                    />
                    <div class="text-caption">
                      Quando marcada, o usuário selecionado estará substituindo a sua posição nesta função
                    </div>
                </q-card-section> -->
                <q-card-actions align="center">
                  <q-btn flat label="Depois" no-caps rounded color="primary"
                    @click="dialogOpenSolicitation.open = false" />
                  <q-btn
                    unelevated
                    rounded
                    label="Enviar"
                    no-caps
                    color="primary"
                    @click="sendFunctionSolicitation" />
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
import CardFunction from '../../components/CardFunction.vue'
import useFetch from "../../boot/useFetch";
import { date } from "quasar";
export default defineComponent({
  name: "UserOrganismDetail",
  components: {
    CardFunction
  },
  data() {
    return {
      usersOptions: [],
      isReplacement: false,
      disableIsReplacement: false,
      hasPermission: '',
      organismName: '',
      userSelected: '',
      myUserIdMongo: '',
      organism: null,
      fields: [],
      organismConfigOptions: [],
      dialogOpenSolicitation: {
        obs: '',
        data: {},
        functionId: '',
        open: false,
      },
      newOrganism: {},
      organismData: {
        organismConfigId: null,
        fields: [],
      },
      functions: [],
      solicitationData: [],
      organismConfigName: '',
    };
  },
  mounted() {
    this.$q.loading.hide()
  },
  beforeMount() {
    this.getUserIdMongo()
    this.getOrganismDetailById();
    this.getOrganismsConfigs()
    this.getFunctionsSolicitationsByOrganismId()
  },
  methods: {
    clearDialogSolicitation() {
      this.dialogOpenSolicitation.functionId = ''
      this.userSelected = ''
      this.dialogOpenSolicitation.obs = ''
      this.isReplacement = false
      this.disableIsReplacement = false
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
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if(r.error){
          this.$q.notify(r.errorMessage)
          return
        }
        update(() => {
          this.usersOptions = r.data.list;
        })
      });
    },
    getUserIdMongo() {
      const opt = {
        route: '/desktop/adm/getUserIdMongo',
      }
      useFetch(opt).then(r => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
          return
        } else { this.myUserIdMongo = r.data.userIdMongo }
      })
    },
    clkOpenDialogSolicitation(func) {
      console.log(func)
      this.dialogOpenSolicitation.open = true;
      if(func.functionNumOfOccupants === func.numOfUser){
        this.isReplacement = true
        this.disableIsReplacement = true
        this.dialogOpenSolicitation.data = func
        this.dialogOpenSolicitation.functionId = func.functionId
      }else if(func.functionNumOfOccupants < func.numOfUser){
        this.dialogOpenSolicitation.data = func
        this.dialogOpenSolicitation.functionId = func.functionId
      }
    },
    getFunctionsSolicitationsByOrganismId() {
      const organismId = this.$route.query.organismId
      const opt = {
        route: "/desktop/adm/getFunctionsSolicitationsByOrganismId",
        body: {
          organismId: organismId,
        }
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          if (r.data) {
            this.solicitationData = r.data
          } else {
            this.solicitationData = 0
          }
        }
      });
    },
    sendFunctionSolicitation() {
      if (this.userSelected._id === this.myUserIdMongo) {
        this.$q.notify('Você já participa desta função')
        return
      }
      const opt = {
        route: "/desktop/commonUsers/addFunctionSolicitation",
        body: {
          organismId: this.$route.query.organismId,
          organismFunctionId: this.dialogOpenSolicitation.functionId,
          userId: this.userSelected._id,
          obs: this.dialogOpenSolicitation.obs,
          // isReplacement: this.isReplacement,
          // userIdMongo: this.myUserIdMongo
        }
      };
      if (this.dialogOpenSolicitation.userToReplace) {
        opt.body.userFunctionIdToInactivate = this.dialogOpenSolicitation.userToReplace._id
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.$q.notify("Dados alterados com sucesso!");
          this.getOrganismDetailById()
          this.getFunctionsSolicitationsByOrganismId()
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
          this.hasPermission = r.data.hasPermission
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
.solicitation-cards {
  border-radius: 0.5rem;
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
.opaco {
  background-color: #ffffff;
  opacity: 0.5;
  
}
</style>

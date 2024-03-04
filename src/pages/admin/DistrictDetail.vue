<template>
  <q-page-container class="no-padding">
    <q-page v-if="organismListTree">
      <div class="text-center q-mt-md">
        <div class="col text-capitalize"> 
          <div class="text-h4">Distrito {{ organismName }}</div>
          <!-- <q-chip
            :style="{background: organismConfigStyle}"
            text-color="white"
          >
            {{ numOfParishs }} Paróquias | {{numOfCongregations}} Congregaçoes | {{ numOfMissionPoints }} Pontos de Missão | {{numOfPastor}} Pastores
          </q-chip> -->
          <div class="fit row wrap justify-center items-start content-start q-mt-md">
            <q-list
              class="q-mx-md"
              v-for="info in districtInfo"
              :key="info"
              bordered
              style="border-radius: 1rem;"
            >
              <q-item class="q-pa-sm">
                <q-item-section class="text-left">
                  {{ info.label }}:
                  <q-item-label class="text-center">
                    {{ info.num }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </div>
      <div class="q-pa-sm q-ma-lg">
        <div class="text-h6">Composição:
          <q-btn
            flat
            unelevated
            rounded
            @click="addNewParish()"
          />
        </div>
        <q-tree
          class="q-ml-sm"
          default-expand-all
          :nodes="organismListTree"
          node-key="label"
          ref="tree"
        >
          <template v-slot:default-header="prop">
            <div class=" items-center" v-if="prop.node.header">
              <span class="text-weight-bold">{{ prop.node.label }}</span>
              <q-btn
                icon="navigate_next"
                round
                unelevated
                color="primary"
                flat
                v-on:click.stop="clkParent(prop.node.organismId)"
              >
                <q-tooltip>Abrir informações sobre a paróquia {{ prop.node.type }}</q-tooltip>
              </q-btn>
            </div>
            <div class="items-center" v-else>
              <q-icon
                v-if="prop.node.type === 'Congregação'"
                name="church"
                color="blue"
                size="20px"
                class="q-mr-sm"
              />
              <q-icon
                v-if="prop.node.type === 'Paróquia'"
                name="workspaces"
                color="blue"
                size="20px"
                class="q-mr-sm"
              />
              <span
                class="cursor-pointer"
              >{{ prop.node.label }}</span>
            </div>
            <div
              v-if="prop.node.type === 'Congregação'"
              class="items-center"
            >
              <q-btn
                icon="navigate_next"
                round
                unelevated
                color="primary"
                flat
                v-on:click.stop="openCongregationDetail(prop.node.organismId)"
              >
                <q-tooltip>Abrir informações sobre a congregação {{ prop.node.type }}</q-tooltip>
              </q-btn>
            </div>
          </template>
        </q-tree>
      </div>
      <q-separator class="q-my-sm q-mx-lg"/>
      <div v-if="functions" class="q-ma-lg">
        <div class="text-h6">
          Funções distritais:
        </div>
        <div class="q-ml-sm">
          <q-tree
            class="q-ml-sm"
            :nodes="functionsListTree"
            node-key="label"
            ref="tree"
          >
            <template v-slot:default-header="prop">
              <div class="items-center" v-if="prop.node.type === 'function' || prop.node.type === 'coordination'">
                <span class="text-weight-bold">{{ prop.node.label }}</span>
                <q-btn
                  icon="add"
                  round
                  unelevated
                  color="primary"
                  flat
                  v-on:click.stop="addUserToDistrictFunction(prop.node.functionId)"
                >
                  <q-tooltip>Adicionar pessoa nesta função {{ prop.node.type }}</q-tooltip>
                </q-btn>
              </div>
              <div class="items-center" v-else-if="prop.node.type === 'user'">
                <span>{{ prop.node.label }}</span>
                <q-btn
                  icon="delete"
                  round
                  unelevated
                  color="red"
                  flat
                  v-on:click.stop="removeUserFromDistrictFunction(prop.node)"
                >
                  <q-tooltip>Remover pessoa da função</q-tooltip>
                </q-btn>
              </div>
              <div v-else-if="prop.node.type === 'userData'" class="items-center"> 
                <span>{{ prop.node.label }}</span>
              </div>
            </template>
          </q-tree>
        </div>
      </div>
      <q-dialog
        v-model="dialogParishDetail.open"
      >
        <q-card
          style="width: 500px;"
        >
          <q-card-section class="text-h6 text-center">
            {{ dialogParishDetail.data.organismConfigName + ' - ' + dialogParishDetail.data.childName }}
          </q-card-section>
          <q-separator class="q-mx-md"/>
          <q-card-section>
            <div class="text-h6 q-ma-sm">
              Funções:
            </div>
            <div class="q-ml-md">
              <div
                v-for="(func, iFunc) in dialogParishDetail.data.functions"
                :key="func"
              >
                {{ func.functionName }}
                <q-btn
                  color="primary"
                  icon="add"
                  rounded
                  unelevated
                  @click="addUserToOrganismFunction(dialogParishDetail.data.childId, iFunc, true)"
                  class="q-pa-sm"
                  flat
                />
                <div
                  v-for="(user, iUser) in func.users"
                  :key="user"
                  class="q-ml-sm"
                >
                  {{ user.userName }}
                  <q-btn
                    color="red"
                    flat
                    unelevated
                    rounded
                    @click="removeUserFromFunction(iFunc, iUser, true)"
                    icon="delete"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogCongregationDetail.open"
      >
        <q-card
          style="width: 500px;border-radius: 1rem;"
        >
          <q-card-section class="text-h6">
            {{ dialogCongregationDetail.data.childName }}
          </q-card-section>
          <q-card-section>
            <strong>Funções:</strong>
          </q-card-section>
          <q-card-section
            class="q-ml-md"
          >
            <div
              v-for="(func, iFunc) in dialogCongregationDetail.data.functions"
              :key="func"
            >
              {{ func.functionName }}
              <q-btn
                icon="add"
                color="primary"
                flat
                unelevated
                rounded
                @click="addUserToOrganismFunction(dialogCongregationDetail.data.childId, iFunc, false)"
              />
              <div
                v-for="(user, iUser) in func.users"
                :key="user"
                class="q-ml-sm q-mt-sm"
              >
                {{ user.userName }}
                <q-btn
                  icon="delete"
                  color="red"
                  flat
                  rounded
                  @click="removeUserFromFunction(iFunc, iUser, false)"
                  unelevated
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogAddUserToCongregationFunction.open"
        @hide="clearDialogAddUserInFunction"
      >
        <q-card
          style="width: 400px;border-radius: 1rem;"
        >
          <q-card-section class="text-center text-h6">
            Informe o usuário que ocupará a função
          </q-card-section>
          <q-card-section>
            <q-select
              v-model="dialogAddUserToCongregationFunction.selectedUser"
              filled
              use-input
              label="Nome do usuário"
              option-label="userName"
              :options="usersOptions"
              @filter="getUsers"
              :loading="false"
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
          <q-card-section>
            <q-input
              label="Data início"
              class="q-pa-sm"
              filled
              type="date"
              v-model="dialogAddUserToCongregationFunction.initialDate"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              label="Cancelar"
              color="primary"
              flat
              unelevated
              rounded
              @click="clearDialogAddUserInFunction"
              no-caps
            />
            <q-btn
              label="Confirmar"
              color="primary"
              unelevated
              rounded
              @click="addUserToFunction"
              no-caps
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogDeleteUserFromFunction.open"
        @hide="clearDialogRemoveUserFromFunction"
      >
        <q-card style="border-radius: 1rem; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">
              Tem certeza que deseja inativar
              {{ dialogDeleteUserFromFunction.userData.userName }}?
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
      <q-dialog
        v-model="dialogAddUserToDistrictFunction.open"
        @hide="clearDialogAddUserToDistrictFunction"
      >
        <q-card
          style="width: 400px;border-radius: 1rem;"
        >
          <q-card-section class="text-center text-h6">
            Informe o usuário que ocupará a função
          </q-card-section>
          <q-card-section>
            <q-select
              v-model="dialogAddUserToDistrictFunction.selectedUser"
              filled
              use-input
              label="Nome do usuário"
              option-label="userName"
              :options="usersOptions"
              @filter="getUsers"
              :loading="false"
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
          <q-card-section>
            <q-input
              label="Data início"
              class="q-pa-sm"
              filled
              type="date"
              v-model="dialogAddUserToDistrictFunction.initialDate"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              label="Cancelar"
              color="primary"
              flat
              unelevated
              @click="clearDialogAddUserToDistrictFunction"
              rounded
              no-caps
            />
            <q-btn
              label="Confirmar"
              color="primary"
              unelevated
              rounded
              @click="confirmAddUserToDistrictFunction"
              no-caps
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogRemoveUserFromDistrictFunction.open"
        @hide="clearDialogRemoveUserFromDistrictFunction"
      >
        <q-card style="border-radius: 1rem; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">
              Tem certeza que deseja inativar
              {{ dialogDeleteUserFromFunction.userName }}?
            </div>
          </q-card-section>
          <q-card-section align="center" class="q-gutter-sm">
            <q-input
              filled
              label="Observação"
              v-model="dialogRemoveUserFromDistrictFunction.obsText"
              hint="Informe o motivo"
            />
            <q-input
              filled
              type="date"
              label="Data final"
              v-model="dialogRemoveUserFromDistrictFunction.finalDate"
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
              @click="clearDialogRemoveUserFromDistrictFunction"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="inactivateUserFromDistrictFunction"
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
  name: "DistrictDetail",
  data() {
    return {
      parentOrganismId: null,
      organismConfigId: null,
      organismName: null,
      organismConfigStyle: null,
      organismData: {
        fields: null
      },
      organismConfigName: null,
      functions: null,
      organismParentData: null,
      organismChildData: null,
      parentData: null,
      idLegado: null,
      congregacaoSedeAddress: null,
      organismListTree: [],
      functionsListTree: [],
      numOfParishs: null,
      numOfCongregations: 0,
      numOfMissionPoints: 0,
      numOfPastor: 0,
      dialogParishDetail: {
        open: false,
        data: null,
        functionId: null
      },
      dialogCongregationDetail: {
        open: false,
        data: null
      },
      dialogAddUserToCongregationFunction: {
        open: false,
        selectedUser: null,
        orgId: null,
        iFunc: null,
        functionId: null,
        initialDate: ''
      },
      usersOptions: null,
      dialogDeleteUserFromFunction: {
        open: false,
        userData: null,
        obsText: '',
        finalDate: ''
      },
      districtInfo: [
        {
          num: 0,
          label: 'Paróquias'
        },
        {
          num: 0,
          label: 'Congregações'
        },
        {
          num: 0,
          label: 'Pontos de Missão'
        },
        {
          num: 0,
          label: 'Pastores'
        },
      ],
      dialogAddUserToDistrictFunction: {
        open:false,
        funcId: null,
        selectedUser: null,
        initialDate: null
      },
      dialogRemoveUserFromDistrictFunction: {
        funcId: null,
        userId: null,
        userName: null,
        obsText: '',
        open: false,
        finalDate: ''
      }
    }
  },
  beforeMount() {
    this.getOrganismDetailById()
  },
  methods: {
    clearDialogParishDetail() {
      this.dialogParishDetail = {
        open: false,
        data: null,
        functionId: null
      }
    },
    clearDialogRemoveUserFromFunction() {
      this.dialogDeleteUserFromFunction = {
        open: false,
        userData: null,
        obsText: '',
        finalDate: ''
      }
    },
    clearDialogRemoveUserFromDistrictFunction() {
      this.dialogRemoveUserFromDistrictFunction = {
        funcId: null,
        userId: null,
        userName: null,
        obsText: '',
        open: false,
        finalDate: ''
      }
    },
    async inactivateUserFromDistrictFunction() {
      if (
        this.dialogRemoveUserFromDistrictFunction.obsText === "" ||
        this.dialogRemoveUserFromDistrictFunction.finalDate === ""
      ) {
        this.$q.notify("Preencha observação e data final para prosseguir!");
        return;
      }
      const opt = {
        route: "/desktop/adm/inactivateUserFromFunction",
        body: {
          userFunctionId: this.dialogRemoveUserFromDistrictFunction.funcId,
          finalDate: this.dialogRemoveUserFromDistrictFunction.finalDate,
          obsText: this.dialogRemoveUserFromDistrictFunction.obsText,
        },
      };
      let r = await useFetch(opt)
      if (r.error) {
        this.$q.notify('Ocorreu um erro, tente novamnte mais tarde')
        return
      }
      this.getOrganismDetailById()
      this.clearDialogRemoveUserFromDistrictFunction()
    },
    async inactivateUserFromFunction() {
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
          userFunctionId: this.dialogDeleteUserFromFunction.userData._id,
          finalDate: this.dialogDeleteUserFromFunction.finalDate,
          obsText: this.dialogDeleteUserFromFunction.obsText,
        },
      };
      let r = await useFetch(opt)
      if (r.error) {
        this.$q.notify('Ocorreu um erro, tente novamnte mais tarde')
        return
      }
      this.getOrganismDetailById()
      this.clearDialogRemoveUserFromFunction()
      this.clearDialogCongregationDetail()
      this.clearDialogParishDetail()
    },
    removeUserFromFunction(iFunc, iUser, parish)  {
      if (parish) {
        this.dialogParishDetail.data.functions.forEach((func, i) => {
          if (i === iFunc) {
            func.users.forEach((user, j) => {
              if (j === iUser) {
                this.dialogDeleteUserFromFunction.userData = user
              }
            })
          }
        })
      } else if (!parish) {
        this.dialogCongregationDetail.data.functions.forEach((func, i) => {
          if (i === iFunc) {
            func.users.forEach((user, j) => {
              if (j === iUser) {
                this.dialogDeleteUserFromFunction.userData = user
              }
            })
          }
        })
      }
      this.dialogDeleteUserFromFunction.open = true
    },
    clearDialogCongregationDetail() {
      this.dialogCongregationDetail = {
        open: false,
        data: null
      }
    },
    removeUserFromDistrictFunction(data) {
      this.dialogRemoveUserFromDistrictFunction.funcId = data.userFunctionId
      this.dialogRemoveUserFromDistrictFunction.userName = data.label
      this.dialogRemoveUserFromDistrictFunction.userId = data.userId
      this.dialogRemoveUserFromDistrictFunction.open = true
    },
    clearDialogAddUserInFunction() {
      this.dialogAddUserToCongregationFunction = {
        open: false,
        selectedUser: null,
        orgId: null,
        iFunc: null,
        functionId: null,
        initialDate: ''
      }
    },
    async addUserToFunction() {
      let organismFunctionId
      if (this.dialogAddUserToCongregationFunction) {
        organismFunctionId = this.dialogAddUserToCongregationFunction.functionId
      } else if (this.dialogParishDetail) {
        organismFunctionId = this.dialogParishDetail.functionId
      }
      if (!this.dialogAddUserToCongregationFunction.selectedUser || this.dialogAddUserToCongregationFunction.initialDate === '') {
        this.$q.notify('Preencha o usuário e a data de início')
        return
      }
      const opt = {
        route: '/desktop/adm/addUserToFunction',
        body: {
          organismFunctionId,
          userId: this.dialogAddUserToCongregationFunction.selectedUser.userId,
          dates: {
            initialDate: this.dialogAddUserToCongregationFunction.initialDate
          }
        }
      }
      let r = await useFetch(opt)
      if (r.error) return
      this.$q.notify('Usuário inserido na função')
      this.getOrganismDetailById()
      this.clearDialogAddUserInFunction()
      this.clearDialogCongregationDetail()
      this.clearDialogParishDetail()
      // if (this.verifyIfUserIsAlreadyInFunction(selectedFuncIndex, this.dialogAddUserToCongregationFunction.selectedUser.userId, )) {
      //   this.$q.notify('Usuário já incluído nesta função')
      //   return
      // }
    },
    // verifyIfUserIsAlreadyInFunction (functionIndex, userIdToVerify) {
    //   let ret = false
    //   if ( this.functions && this.functions[functionIndex] && this.functions[functionIndex].functions) {
    //     this.functions[functionIndex].functions.users.forEach(u => {
    //       if (u.userId === userIdToVerify) ret = true
    //     }) 
    //   } else if (this.functions && this.functions[functionIndex] && this.functions[functionIndex].users) {
    //     this.functions[functionIndex].users.forEach(u => {
    //       if (u.userId === userIdToVerify) ret = true
    //     }) 
    //   }
    //   return ret
    // },
    getUsers(val, update, abort) {
      if(val.length < 3) {
        this.$q.notify('Digite no mínimo 3 caracteres')
        abort()
        return
      }
      let route
      if (this.dialogAddUserToCongregationFunction.open === true) {
        route = "/desktop/adm/getPastores" 
      } else if (this.dialogAddUserToDistrictFunction.open === true) {
        route = "/desktop/adm/getUsers" 
      } else {
        route = '/desktop/adm/getUsers'
      }
      const opt = {
        route: route,
        body: {
          searchString: val,
          isActive: 1,
          page: 1,
          rowsPerPage: 50
        }
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
    addUserToDistrictFunction(funcId) {
      this.dialogAddUserToDistrictFunction.funcId = funcId
      this.dialogAddUserToDistrictFunction.open = true
    },
    clearDialogAddUserToDistrictFunction() {
      this.dialogAddUserToDistrictFunction = {
        open:false,
        funcId: null,
        selectedUser: null,
        initialDate: null
      }
    },
    async confirmAddUserToDistrictFunction() {
      if (!this.dialogAddUserToDistrictFunction.selectedUser || this.dialogAddUserToDistrictFunction.initialDate === '') {
        this.$q.notify('Preencha todos os campos para prosseguir')
        return
      }
      const opt = {
        route: '/desktop/adm/addUserToFunction',
        body: {
          organismFunctionId: this.dialogAddUserToDistrictFunction.funcId,
          userId: this.dialogAddUserToDistrictFunction.selectedUser.userId,
          dates: {
            initialDate: this.dialogAddUserToDistrictFunction.initialDate
          }
        }
      }
      let r = await useFetch(opt)
      if (r.error) return
      this.getOrganismDetailById()
      this.clearDialogAddUserToDistrictFunction()
    },
    addUserToOrganismFunction(orgId, iFunc, parish) {
      if (parish) {
        this.dialogAddUserToCongregationFunction.functionId = this.dialogParishDetail.data.functions[iFunc].functionId
      } else if (!parish) {
        this.organismChildData.forEach((parish) => {
          parish.organismChildData.forEach((congregation) => {
            if (congregation.childId === orgId) {
              congregation.functions.forEach((func, funcI) => {
                if (funcI === iFunc) {
                  this.dialogAddUserToCongregationFunction.functionId = func.functionId
                  return
                }
              })
            }
          })
        })
      }
      this.dialogAddUserToCongregationFunction.orgId = orgId
      this.dialogAddUserToCongregationFunction.iFunc = iFunc
      this.dialogAddUserToCongregationFunction.open = true
    },
    openCongregationDetail(id) {
      this.organismChildData.forEach((parish) => {
        parish.organismChildData.forEach((congregation) => {
          if (congregation.childId === id) {
            this.dialogCongregationDetail.data = congregation
            this.dialogCongregationDetail.open = true
            return
          }
        })
      })
    },
    // addNewParish() {
    //   const opt = {
    //     route: '/desktop/adm/getOrganismConfigById'
    //   }
    //   console.log('HAHAHA, eu estava escondido!')
    // },
    clkParent(id) {
      this.organismChildData.forEach((parish) => {
        if (parish.childId === id) {
          this.dialogParishDetail.data = parish
        }
      })
      this.dialogParishDetail.open = true
    },
    mountTreeFunctions() {
      let tree = []
      this.functions.forEach((func) => {
        tree = {
          type: func.group,
          label: func.functionName,
          header: 'generic',
          functionId: func.functionId,
          children: []
        }
        func.users.forEach((user, iUser) => {
          tree.children.push({
            type: 'user',
            label: user.userName,
            header: 'normal',
            userId: user.userId,
            userFunctionId: user._id,
            children: []
          })
          if (user.userEmail) {
            tree.children[iUser].children.push({
              type: 'userData',
              label: 'E-mail:' + ' ' + user.userEmail,
              header: 'normal',
              userId: user.userId
            })
          }
          if (user.userPhone) {
            user.userPhone.forEach((num) => {
              tree.children[iUser].children.push({
                type: 'userData',
                label: 'Contato:' + ' ' + num.value,
                header: 'normal',
                userId: user.userId
              })
            })
          }
        })
        this.functionsListTree.push(tree)
      })
    },
    mountTree() {
      let tree = []
      this.organismChildData.forEach((parish) => {
        tree = {
          type: parish.organismConfigName,
          label: parish.organismConfigName + ' ' + parish.childName,
          header: 'generic',
          organismId: parish.childId,
          children: []
        }
        if (parish.organismChildData && parish.organismChildData.length > 0) {
          parish.organismChildData.forEach((congregation, iCongregation) => {
            this.districtInfo.forEach((info) => {
              if (info.label === 'Congregações') {
                info.num++
              }
            })
            tree.children.push({
              type: congregation.organismConfigName,
              label: congregation.organismConfigName + ' ' + congregation.childName,
              body: 'normal',
              organismId: congregation.childId,
              children: []
            })
            congregation.organismChildData.forEach((dept) => {
              if (dept) {
                tree.children[iCongregation].children.push({
                  type: dept.organismChildConfig.organismConfigName,
                  label: dept.organismChildConfig.organismConfigName + ' ' + dept.organismChildData.childName,
                  body: 'normal',
                  organismId: dept._id
                })
              }
              if (dept && dept.organismChildConfig && dept.organismChildConfig.organismConfigName === 'Ponto de Missão') {
                this.districtInfo.forEach((info) => {
                  if (info.label === 'Pontos de Missão') {
                    info.num++
                  }
                })
              }
            })
          })
        }
        this.organismListTree.push(tree)
      })
    },
    getOrganismDetailById() {
      this.organismListTree = []
      this.functionsListTree = []
      const organismId = this.$route.query.organismId
      const opt = {
        route: "/desktop/adm/getDistrictDetail",
        body: {
          organismId: organismId,
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.parentOrganismId = r.data.organismData.organismParentId
          this.organismConfigId = r.data.organismData.organismConfigId
          this.organismName = r.data.organismData.organismName
          this.organismConfigStyle = r.data.organismData.organismConfigStyle
          this.organismData.fields = r.data.organismData.fields
          this.organismConfigName = r.data.organismData.organismConfigName
          this.functions = r.data.functions
          this.organismParentData = r.data.relations.parent
          this.organismChildData = r.data.relations.child
          if (this.organismConfigName === 'Paróquia') {
            if (this.organismChildData.length === 1) {
              this.$router.push('/admin/organismDetail?organismId=' + this.organismChildData[0].childId)
            }
          }
          this.parentData = r.data.parentData
          this.idLegado = r.data.idLegado
          for(let i = 0; r.data.relations.length > i; i++) {
            if(r.data.relations[i].organismRelationIsMain === 'SIM') {
              this.congregacaoSedeAddress = r.data.relations[i].organismRelationAddress
            }
          }
          this.districtInfo.forEach((info) => {
            if (info.label === 'Paróquias') {
              info.num = this.organismChildData.length
            }
          })
          this.mountTree()
          this.mountTreeFunctions()
          this.organismChildData.forEach((parish) => {
            parish.functions.forEach((func) => {
              if (func.functionName === 'Pastor em Paróquia') {
                func.users.forEach(() => {
                  this.districtInfo.forEach((info) => {
                    if (info.label === 'Pastores') {
                      info.num++
                    }
                  })
                })
              }
            })
          })
        }
      });
    },
  }
})
</script>
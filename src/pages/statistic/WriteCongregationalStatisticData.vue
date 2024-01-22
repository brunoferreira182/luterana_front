<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="text-h5  text-center">
        Composição
      </div>
      <!-- <div>
        - Para correções, clique na canetinha ao lado da informação;
      </div>
      <div>
        - Caso não deseje concluir a seção no momento, salve as alterações no botão 'Salvar' Rascunho;
      </div>
      <div>
        - Ao terminar a conferência, clique em 'Seguir' para prosseguir.
      </div> -->
      <q-item
        v-if="composition"
        style="border-radius: 1rem;"
        class="bg-grey-2 q-ma-sm"
      >
        <q-item-section>
          <div class="text-h6 text-left">
            Paróquia: {{ composition.organismParentName }}
          </div>
          <div class="q-mt-sm text-left text-h6">
            Congregações:
            <q-btn
              icon="add"
              color="primary"
              flat
              rounded
              @click="addCongregation"
            >

            </q-btn>
          </div>
          <q-item-label 
            class="bg-white q-mt-sm text-center"
            style="border-radius: .7rem;"
            v-for="(org, iOrg) in composition.congregations"
            :key="org"
          > 
            <div class="text-center text-h6 q-ma-md">
              <strong>{{ org.organismChildName }}</strong>
            </div>
            <div class="q-mt-sm bg-grey-2 q-ma-sm" style="border-radius: .5rem;">
              <div class="text-left q-ma-md text-h6">
                <strong>Funções:</strong>
              </div>
              <div 
                class="text-left q-ml-lg"
                v-for="(func, iFunc) in org.organismFunctions" 
                :key="func"
              >
                <strong>{{ func.functionName }}:</strong>
                <q-btn
                  color="primary"
                  flat
                  rounded
                  icon="add"
                  @click="addFunctionUser(iFunc, iOrg, func.functionName)"
                  size="12px"
                >

                </q-btn>
                <div
                  class="q-ml-sm q-pa-sm"
                >
                  <q-item
                    class="no-padding"
                    v-for="(user, iUser) in func.functionUsers"
                    :key="user"
                  >
                    <q-item-section class="no-padding">
                      <q-item-label>
                        {{ user.userName }}
                        <q-btn
                          color="red"
                          flat
                          rounded
                          unelevated
                          icon="delete"
                          @click="deleteUserFromFunction(iOrg, iFunc, iUser)"
                        ></q-btn>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
              </div>
            </div>
            <div class="q-mt-sm bg-grey-2 q-ma-sm" style="border-radius: .5rem;">
              <div class="text-left q-ma-md text-h6">
                <strong>Departamentos:</strong>
              </div>
              <div  
                v-for="(dep, iDep) in org.depts"
                :key="dep"
              >
                <div v-if="dep.existingDepartaments.length > 0">
                  <q-list
                    class="text-left q-ma-md q-pa-sm q-ml-md bg-white"
                    style="border-radius: .3rem;"
                    v-for="(departament, iExistsDept) in dep.existingDepartaments"
                    :key="departament"
                  >
                  <q-item >
                    <q-item-section>
                      <q-item-label>
                        {{ dep.organismConfigName }}
                      </q-item-label>
                      <q-item-label>
                        Nome: {{ departament.departamentName }}
                      </q-item-label>
                        <q-item-label>
                          <div class="text-h6">
                            <strong>Funções:</strong>
                          </div>
                            <q-list>
                              <q-item
                                v-for="(func, iFunc) in departament.organismFunctions"
                                :key="func"
                              >
                                <q-item-section>
                                  <q-item-label>
                                    <strong>{{ func.functionName }}:</strong>
                                    <q-btn
                                      color="primary"
                                      flat
                                      rounded
                                      icon="add"
                                      @click="addFuncToDept(iOrg, iDep, iExistsDept, iFunc )"
                                    >
                                      <q-tooltip>
                                        Adicionar usuário a função
                                      </q-tooltip>
                                    </q-btn>
                                  </q-item-label>
                                  <q-item-label  
                                    v-for="(user, iUser) in func.functionUsers"
                                    :key="user"
                                  >
                                    {{ user.userName }}
                                    <q-btn
                                      color='red'
                                      flat
                                      rounded
                                      icon="delete"
                                      @click="removeUserFromFunctionDept(iOrg, iDep, iExistsDept, iFunc, iUser)"
                                    > 
                                      <q-tooltip>Excluir usuário da função</q-tooltip>
                                    </q-btn>
                                  </q-item-label>
                                </q-item-section>
                                <!-- {{ func }} -->
                              </q-item>
                            </q-list>
                        </q-item-label>
                    </q-item-section>
                  </q-item>
                    <!-- <div v-if="dep.existingDepartaments.length > 0">
                    {{ dep.departamentName }}
                      <div>
                        <div class="q-ml-sm">
                          Funções:
                        </div>
                        <div 
                          v-for="func in dep.organismFunctions"
                          :key="func"
                        >
                          <div class="q-ml-lg">
                            {{ func.functionName }}:
                            <div 
                              class="q-ml-lg"
                              v-for="user in func.functionUsers"
                              :key="user"
                            >
                              {{ user.userName }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>-->
                  </q-list> 
                </div>
              </div>
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-dialog
        v-model="dialogAddFunction.open"
      >
        <q-card
          style="width: 400px;"
          @hide="clearDialogAddFunction"
        >
          <q-card-section class="text-h6 text-center">
            Selecione o usuário que irá ocupar a função:
          </q-card-section>
          <q-card-section>
            <q-select
              v-model="dialogAddFunction.userSelected"
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
            </q-select>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Voltar"
              no-caps
              rounded
              color="primary"
              @click="clearDialogAddFunction"
            />
            <q-btn
              label="Adicionar"
              unelevated  
              no-caps
              rounded
              color="primary"
              @click="confirmAddUserToFunction"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogAddFunctionToDept.open"
        @hide="clearDialogAddUserToFunctionInDept"
      >
        <q-card
          style="width: 400px;"
          @hide="clearDialogAddFunction"
        >
          <q-card-section class="text-h6 text-center">
            Selecione o usuário que irá ocupar a função:
          </q-card-section>
          <q-card-section>
            <q-select
              v-model="dialogAddFunctionToDept.userSelected"
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
            </q-select>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Voltar"
              no-caps
              rounded
              color="primary"
              @click="clearDialogAddUserToFunctionInDept"
            />
            <q-btn
              label="Adicionar"
              unelevated  
              no-caps
              rounded
              color="primary"
              @click="confirmAddUserToFunctionInDept"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-btn
        @click="saveDraft"
      ></q-btn>
    </q-page>
  </q-page-container>
</template>
<script>
import useFetch from "src/boot/useFetch";
// import utils from "../../boot/utils";s
import { defineComponent } from "vue";
export default defineComponent({
  name:"WriteCongregationalStatisticData",
  data() {
    return {
      filter: '',
      pagination: {
        sortBy: '',
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: 'desc',
        descending: false,
        searchString: ''
      },
      composition: null,
      dialogAddFunction: {
        open: false,
        iFunc: null,
        iOrg: null,
        functionName: null,
        userSelected: null
      },
      usersOptions: null,
      dialogAddFunctionToDept: {
        open: false,
        iFunc: null,
        iExistsDept: null,
        iDep: null,
        iOrg: null,
        userSelected: null
      },
      dialogAddCongregation: {
        open: false,
        name: '', 
        functions: [],
        address: {
          city: '',
          cep: '',
          steet: '',
          number: '',
          state: '',
          district: '',
          complement: ''
        },
        configId: '6525360fd7cd5c09a8d759be'
      },
      congregationConfig: null,
      presidentFunctionConfigId: '6525360fd7cd5c09a8d759bf',
      treasurerFunctionConfigId: '6526cc6c8c23183a40ace584',
      secretaryFunctionConfigId: '6527f72131e6d7501490ec76'
    }
  }, 
  beforeMount() {
    this.getCompositionByUserId()
  },
  methods: {
    // getCongregationConfig() {
    //   const opt = {
    //     route: '/desktop/statistics/getCongregationFunctions'
    //     body:
    //   }
    // },
    addCongregation() {
      this.getCongregationConfig()
      this.dialogAddCongregation.open = true
    },
    clearDialogAddUserToFunctionInDept() {
      this.dialogAddFunctionToDept = {
        open: false,
        iFunc: null,
        iExistsDept: null,
        iDep: null,
        iOrg: null,
        userSelected: null
      }
    },
    confirmAddUserToFunctionInDept() {
      console.log(this.dialogAddFunctionToDept.iOrg, this.dialogAddFunctionToDept.iDep, this.dialogAddFunctionToDept.iExistsDept, this.dialogAddFunctionToDept.iFunc)
      this.composition.
      congregations[this.dialogAddFunctionToDept.iOrg].
      depts[this.dialogAddFunctionToDept.iDep].
      existingDepartaments[this.dialogAddFunctionToDept.iExistsDept].
      organismFunctions[this.dialogAddFunctionToDept.iFunc].
      functionUsers.push({
        userName: this.dialogAddFunctionToDept.userSelected.userName,
        _id: this.dialogAddFunctionToDept.userSelected.userIdString
      })
      this.clearDialogAddUserToFunctionInDept()
    },
    removeUserFromFunctionDept(iOrg, iDep, iExistsDept, iFunc, iUser) {
      this.composition.congregations[iOrg].depts[iDep].existingDepartaments[iExistsDept].organismFunctions[iFunc].functionUsers.splice(iUser, 1)
    },
    addFuncToDept(iOrg, iDep, iExistsDept, iFunc) {
      this.dialogAddFunctionToDept.iExistsDept = iExistsDept
      this.dialogAddFunctionToDept.iDep = iDep
      this.dialogAddFunctionToDept.iOrg = iOrg
      this.dialogAddFunctionToDept.iFunc = iFunc
      this.dialogAddFunctionToDept.open = true
    },
    saveDraft() {
      const opt = {
        route: '/desktop/statistics/saveCompositionDraft',
        body: this.composition
      }
      useFetch(opt).then((r) => {
        if (r.error) return
        this.$q.notify('Rascunho salvo com sucesso')
      })
    },
    deleteUserFromFunction(iOrg, iFunc, iUser) {
      this.composition.congregations[iOrg].organismFunctions[iFunc].functionUsers.splice(iUser, 1)
    },
    clearDialogAddFunction() {
      this.dialogAddFunction= {
        open: false,
        iFunc: null,
        iOrg: null,
        functionName: null,
        userSelected: null
      }
    },
    confirmAddUserToFunction() {
      this.composition.congregations[this.dialogAddFunction.iOrg].organismFunctions[this.dialogAddFunction.iFunc].functionUsers.push({
        userId:  this.dialogAddFunction.userSelected._id,
        userName: this.dialogAddFunction.userSelected.userName
      })
      this.clearDialogAddFunction()
    },
    getUsers(val, update, abort) {
      if(val.length < 3) {
        this.$q.notify('Digite no mínimo 3 caracteres')
        abort()
        return
      }
      let route
      if (this.dialogAddFunction.functionName === 'Pastor') {
        route = "/desktop/adm/getPastores" 
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
    addFunctionUser(iFunc, iOrg, functionName) {
      this.dialogAddFunction.iFunc = iFunc,
      this.dialogAddFunction.iOrg = iOrg,
      this.dialogAddFunction.functionName = functionName
      this.dialogAddFunction.open = true
    },
    getCompositionByUserId() {
      const opt = {
        route: '/desktop/statistics/getCompositionByUserId'
      }
      useFetch(opt).then((r) => {
        if (r.error) return 
        this.composition = r.data
      })
    }
  }
})
</script>
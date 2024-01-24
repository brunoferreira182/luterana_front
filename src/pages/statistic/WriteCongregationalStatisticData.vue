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
        class="q-ma-sm"
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
            <q-expansion-item
              :label="org.organismChildName"
              class="bg-grey-2 q-pa-sm text-left"
              style="border-radius: 1rem;"
            >
              <q-list bordered class="q-mb-sm">
                <q-expansion-item
                  class="q-mt-sm q-mx-sm bg-grey-2"
                  label="Funções"
                  style="border-radius: .7rem;"
                >
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
                </q-expansion-item>
              </q-list>
              <q-list bordered class="q-mb-sm">
                <q-expansion-item
                  default-opened
                  label="Departamentos"
                  class="q-mt-sm q-mx-sm bg-grey-2 text-left"
                  style="border-radius: .7rem;"
                > 
                  <q-list>
                    <div 
                      v-for="(dep, iDep) in org.depts"
                      :key="dep"
                    >
                      <!-- Fazer o for em todos, e dar destaque aos que esxistem em chip ou o número no avatar -->
                      <q-item 
                        clickable 
                        v-ripple
                        @click="openDepartamentDetail(iOrg, iDep)"
                      >
                        <q-item-section avatar>
                          <q-avatar
                            :color="dep.existingDepartaments.length === 0 ? 'grey' : 'primary'" 
                            text-color="white"
                          >
                            {{ dep.existingDepartaments.length }}
                          </q-avatar>
                        </q-item-section>
                        <q-item-section>{{dep.organismConfigName}}</q-item-section>
                      </q-item>

                    </div>
                  </q-list>
                  <div class="text-left q-ma-md text-h6">
                    <q-btn
                      color="primary"
                      flat
                      rounded
                      icon="add"
                      label="Adicionar novo departamento"
                      @click="addNewDepartament(iOrg)"
                    >
                      <q-tooltip>Adicionar Departamento</q-tooltip>
                    </q-btn>
                  </div>
                  <!-- <div  
                    class="text-left"
                    v-for="(dep, iDep) in org.depts"
                    :key="dep"
                  >
                    <div v-if="dep.existingDepartaments.length > 0">
                      <q-list
                        class="text-left q-pa-sm q-ma-sm"
                        style="border-radius: .3rem;"
                        v-for="(departament, iExistsDept) in dep.existingDepartaments"
                        :key="departament"
                      >
                        <q-expansion-item 
                          :label="dep.organismConfigName"
                          class="bg-grey-4"
                          style="border-radius: .5rem;"
                        >
                          <q-item class="no-padding">
                            <q-item-section>
                              <q-item-label class="text-h6">
                                <strong>{{ dep.organismConfigName }}</strong>
                              </q-item-label> 
                              <q-item-label>
                                Nome: {{ departament.departamentName }}
                              </q-item-label>
                                <q-item-label>
                                  <div>
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
                                        {{ func }} 
                                      </q-item>
                                    </q-list>
                                </q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-expansion-item>
                        <div v-if="dep.existingDepartaments.length > 0">
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
                        </div>
                      </q-list> 
                    </div>
                  </div> -->
                </q-expansion-item>
              </q-list>
            </q-expansion-item>
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
      <q-dialog
        v-model="dialogAddCongregation.open"
        @hide="clearDialogAddNewCongrgation"
      > 
        <q-card style="width: 400px;">
          <q-card-section>
            <div class="text-center text-h6">
              Preencha os dados necessários
            </div>  
            <q-input
              class="q-pa-sm"
              label="Nome" 
              hint="Informe o nome"
              v-model="dialogAddCongregation.data.name"
            />
            <q-input
              class="q-pa-sm"
              label="E-mail" 
              hint="Informe o e-mail"
              v-model="dialogAddCongregation.data.email"
            />
            <q-input
              class="q-pa-sm"
              label="Celular" 
              hint="Informe o número de celular"
              mask="(##) #####-####"
              v-model="dialogAddCongregation.data.phone"
            />
          </q-card-section>
          <q-card-section class="q-gutter-md">
            <div class="text-h6">
              Endereço
            </div>
            <q-input
              mask="#####-###"
              class="q-pa-sm"
              label="CEP"
              @keyup="checkCEP"
              v-model="dialogAddCongregation.data.address.cep"
            />
            <q-input
              v-model="dialogAddCongregation.data.address.addressType"
              class="q-pa-sm"
              label="Informe o tipo de endereço (obrigatório)"
              hint="Exemplo: Casa, trabalho, etc..."
            />
            <q-input  label="Logradouro" class="q-pa-sm" v-model="dialogAddCongregation.data.address.street"/>
            <q-input  label="Número" type="number" class="q-pa-sm" v-model="dialogAddCongregation.data.address.number"/>
            <q-input  label="Bairro" class="q-pa-sm" v-model="dialogAddCongregation.data.address.district"/>
            <q-input  label="Complemento" class="q-pa-sm" v-model="dialogAddCongregation.data.address.complement"/>
            <div class="row">
              <div class="col">
                <q-input  label="Cidade" class="q-pa-sm" v-model="dialogAddCongregation.data.address.city"/>
              </div>
              <div class="col q-pl-md">
                <q-input  mask="AA" label="Estado" class="q-pa-sm" v-model="dialogAddCongregation.data.address.state"/>
              </div>
            </div>
          </q-card-section>
          <q-separator class="q-ma-sm"/>
          <q-card-section>
            <div class="text-center text-h6">
              Preencha ao menos uma função para esta congregação
            </div>
            <q-list>
              <q-item
                v-for="(func, iFunc) in dialogAddCongregation.functions"
                :key="func"
              >
                <q-item-section>
                  <q-item-label>
                    <strong>{{ func.description }}</strong>
                    <q-btn
                      color="primary"
                      icon="add"
                      flat
                      rounded
                      @click="addFunctionUserInNewCongregationFunc(func, iFunc)"
                    >
                      <q-tooltip>Adicionar pessoa nesta função</q-tooltip>
                    </q-btn>
                  </q-item-label>
                  <q-item-label
                    v-if="func.users"
                  >
                  <div
                    v-for="(user, iUser) in func.users"
                    :key="user"
                    class="q-ml-sm"
                  >
                    {{ user.userName }}
                    <q-btn
                      color="red"
                      flat
                      rounded
                      icon="delete"
                      @click="removeFunctionUserFromNewCongregation(iFunc, iUser)"
                    >

                    </q-btn>
                  </div>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="text-center">
                <q-item-section>
                  <q-item-label>
                    <q-btn
                      flat
                      label="Voltar"
                      no-caps
                      rounded
                      color="primary"
                      @click="clearDialogAddUserToFunctionInDept"
                    />
                    <q-btn
                      label="Confirmar"
                      unelevated  
                      no-caps
                      rounded
                      color="primary"
                      @click="confirmAddNewOrganism()"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogInsertUserFunctionInNewCongregation.open"
        @hide="clearDialogAddUserFunctionInNewCongregation"
      >
        <q-card style="width: 400px;">
          <q-card-section>
            <div class="text-center text-h6">
              Selecione o usuário que irá ocupar a função
            </div>
          </q-card-section>
          <q-card-section>
            <q-select
              class="q-pa-sm"
              v-model="dialogInsertUserFunctionInNewCongregation.userSelected"
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
              @click="confirmAddUserFunctionInNewCongregation"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogAddNewDepartament.open"
      >
        <q-card style="width: 400px;">
          <q-card-section>
            <q-select
              class="q-pa-sm"
              v-model="dialogInsertUserFunctionInNewCongregation.userSelected"
              filled
              option-label="userName"
              :options="usersOptions"
            >
            </q-select>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogDepartamentDetail.open"
      >
        <q-card
          style="width:400px;"
        >
          <q-card-section 
            class="text-center"
            v-for="dep in dialogDepartamentDetail.data"
            :key="dep"
          >
            <div class="text-h6">
              {{ dep.departamentName }}
            </div>
            <div class="text-left q-ml-sm">
              <strong>Funções:</strong>
            </div>
            <div
              v-for="func in dep.organismFunctions"
              :key="func"
              class="q-my-md text-left q-ml-md"
            >
              {{ func.functionName }}
              <q-btn
                color="primary"
                flat
                rounded
                icon="add"
              >
                <q-tooltip>Adicionar pessoa na função</q-tooltip>
              </q-btn>
              <div
                v-for="user in func.functionUsers"
                :key="user"
                class="q-ml-sm"
              >
                {{ user.userName }}
                <q-btn
                  color="red"
                  flat
                  rounded
                  icon="delete"
                ></q-btn>
              </div>
            </div>
            <q-separator/>
          </q-card-section>
          <q-card-section>
            <q-item
              v-for="(func, iFunc) in dialogDepartamentDetail.data.organismFunctions"
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
                    @click="addFuncToDept(iFunc )"
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
                    @click="removeUserFromFunctionDept(iFunc, iUser)"
                  > 
                    <q-tooltip>Excluir usuário da função</q-tooltip>
                  </q-btn>
                </q-item-label>
              </q-item-section>
            </q-item>
            <div class="text-center q-mt-sm">
              <q-btn
                flat
                label="Voltar"
                no-caps
                rounded
                color="primary"
                @click="clearDialogDepartaments"
              />
              <q-btn
                label="Excluir departamento"
                unelevated  
                no-caps
                rounded
                color="red"
                @click="deleteDepartament()"
              />
            </div>
          </q-card-section>
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
        data: {
          name: '',
          email: '',
          phone: '',
          address: {
            city: '',
            cep: '',
            addressType: '',
            street: '',
            number: '',
            state: '',
            district: '',
            complement: ''
          }
        },
        functions: null,
        organismConfigId: '6525360fd7cd5c09a8d759be'
      },
      dialogInsertUserFunctionInNewCongregation: {
        open: false,
        iFunc: null,
        functionName: null,
        selectedUser: null
      },
      dialogAddNewDepartament: {
        open: false,
        iOrg: null,
        data: null
      },
      dialogDepartamentDetail: {
        open: false,
        data: null,
        iOrg: null,
        iDep: null,
        iExistsDept: null
      }
    }
  }, 
  beforeMount() {
    this.getCompositionByUserId()
  },
  methods: {
    clearDialogDepartaments() {
      this.dialogDepartamentDetail = {
        open: false,
        data: null,
        iOrg: null,
        iDep: null,
        iExistsDept: null
      }
    },
    deleteDepartament() {
      this.composition.congregations[this.dialogDepartamentDetail.iOrg].depts[this.dialogDepartamentDetail.iDep].existingDepartaments.splice(this.dialogDepartamentDetail.iExistsDept, 1)
      this.clearDialogDepartaments()
    },
    openDepartamentDetail(iOrg, iDep) {
      this.dialogDepartamentDetail.data = 
        this.composition.congregations[iOrg]
        .depts[iDep]
        .existingDepartaments
      this.dialogDepartamentDetail.open = true
      this.dialogDepartamentDetail.iOrg = iOrg
      this.dialogDepartamentDetail.iDep = iDep
    },
    addNewDepartament(iOrg) {
      this.dialogAddNewDepartament.iOrg = iOrg
      this.dialogAddNewDepartament.open = true
    },
    clearDialogAddNewCongrgation() {
      this.dialogAddCongregation= {
        open: false,
        data: {
          name: '',
          email: '',
          phone: '',
          address: {
            city: '',
            cep: '',
            addressType: '',
            street: '',
            number: '',
            state: '',
            district: '',
            complement: ''
          }
        },
        functions: null,
        organismConfigId: '6525360fd7cd5c09a8d759be'
      }
    },
    confirmAddNewOrganism() {
      this.dialogAddCongregation.functions.forEach((func, iFunc) => {
        let funcData = func

        if (funcData.users) {
          this.dialogAddCongregation.functions[iFunc] = {
            functionName: funcData.description,
            functionUsers: funcData.users
          }
        }
        else {
          this.dialogAddCongregation.functions[iFunc] = {
            functionName: funcData.description,
            functionUsers: []
          }
        }
      })

      this.composition.congregations.push({
        organismChildConfig: 'Congregação',
        organismChildName: this.dialogAddCongregation.data.name,
        organismFunctions: this.dialogAddCongregation.functions,
        additionalData: {
          email: this.dialogAddCongregation.data.email,
          phone: this.dialogAddCongregation.data.phone,
          address: this.dialogAddCongregation.data.address
        }
      })
      this.clearDialogAddNewCongrgation()
    },
    checkCEP(ev) {
      this.dialogAddCongregation.data.address.cep = ev.target.value;
      if (this.dialogAddCongregation.data.address.cep.length === 9) {
        const opt = {
          route: "/utils/consultZipCode",
          body: {
            zipCode: this.dialogAddCongregation.data.address.cep.replace('-', ''),
          },
        };
        this.$q.loading.show();
        useFetch(opt).then((r) => {
          this.$q.loading.hide
          this.dialogAddCongregation.data.address = {
            cep: ev.target.value,
            city: r.data.localidade,
            state: r.data.uf,
            street: r.data.logradouro,
            district: r.data.bairro
          }
        });
      }
    },
    removeFunctionUserFromNewCongregation(iFunc, iUser) {
      this.dialogAddCongregation.functions[iFunc].users.splice(iUser, 1)
    },
    clearDialogAddUserFunctionInNewCongregation() {
      this.dialogInsertUserFunctionInNewCongregation = {
        open: false,
        iFunc: null,
        functionName: null,
        selectedUser: null
      }
    },
    confirmAddUserFunctionInNewCongregation() {
      if (!this.dialogAddCongregation.functions[this.dialogInsertUserFunctionInNewCongregation.iFunc].users) {
        this.dialogAddCongregation.functions[this.dialogInsertUserFunctionInNewCongregation.iFunc].users = []
      }
      this.dialogAddCongregation.functions[this.dialogInsertUserFunctionInNewCongregation.iFunc].users.push({
        _id: this.dialogInsertUserFunctionInNewCongregation.userSelected._id,
        userName: this.dialogInsertUserFunctionInNewCongregation.userSelected.userName
      })
      this.clearDialogAddUserFunctionInNewCongregation()
    },
    addFunctionUserInNewCongregationFunc(func, iFunc) {
      this.dialogInsertUserFunctionInNewCongregation.open = true
      this.dialogInsertUserFunctionInNewCongregation.functionName = func.description
      this.dialogInsertUserFunctionInNewCongregation.iFunc = iFunc
    },
    getCongregationConfig() {
      const opt = {
        route: '/desktop/statistics/getNewOrganismConfig',
        body: {
          _id: this.dialogAddCongregation.organismConfigId
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) return
        this.dialogAddCongregation.functions = r.data.organismConfigData.functions
      })
    },
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
      console.log(this.dialogDepartamentDetail.iOrg, this.dialogDepartamentDetail.iDep, this.dialogDepartamentDetail.iExistsDept, this.dialogAddFunctionToDept.iFunc)
      this.composition.
      congregations[this.dialogDepartamentDetail.iOrg].
      depts[this.dialogDepartamentDetail.iDep].
      existingDepartaments[this.dialogDepartamentDetail.iExistsDept].
      organismFunctions[this.dialogAddFunctionToDept.iFunc].
      functionUsers.push({
        userName: this.dialogAddFunctionToDept.userSelected.userName,
        _id: this.dialogAddFunctionToDept.userSelected.userIdString
      })
      this.clearDialogAddUserToFunctionInDept()
    },
    removeUserFromFunctionDept(iFunc, iUser) {
      this.composition.congregations[this.dialogDepartamentDetail.iOrg].depts[this.dialogDepartamentDetail.iDep].existingDepartaments[this.dialogDepartamentDetail.iExistsDept].organismFunctions[iFunc].functionUsers.splice(iUser, 1)
    },
    addFuncToDept(iFunc) {
      console.log(iFunc)
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
      if ((this.dialogAddFunction && this.dialogAddFunction.functionName === 'Pastor') || (this.dialogInsertUserFunctionInNewCongregation && this.dialogInsertUserFunctionInNewCongregation.functionName === 'Pastor')) {
        route = "/desktop/adm/getPastores" 
      } else {
        route = '/desktop/adm/getUsers'
      }
      console.log(this.dialogInsertUserFunctionInNewCongregation.functionName, 'essa é a função que estou pedinddo')
      console.log(route, 'é essa rota que esta sendo chamada')
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
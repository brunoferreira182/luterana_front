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
              label="Nova congregação"
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
              v-if="!org.action || org.action !== 'remove'"
              :label="org.organismChildName"
              class="bg-grey-2 q-pa-sm text-left"
              style="border-radius: 1rem;"
            >
              <q-list bordered class="q-mb-sm">
                <q-expansion-item
                  class="q-mt-sm q-mx-sm bg-grey-2"
                  label="Funções"
                  :disable="org.action && org.actions === 'remove'"
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
                      v-for="(user, iUser) in func.functionUsers"
                      :key="user"
                    >
                      <q-item
                        class="no-padding"
                        v-if="!user.action || user.action !== 'remove'"
                      >
                        <q-item-section class="no-padding" >
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
                  :disable="org.action && org.action === 'remove'"
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
                            :color="dep.trueLength === 0 ? 'grey' : 'primary'" 
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
              <q-list bordered>
                <q-expansion-item
                  label="Outras informações"
                  :disable="org.action && org.action === 'remove'"
                  class="q-mt-sm q-mx-sm bg-grey-2 text-left"
                  style="border-radius: .7rem;"
                >
                  <q-select
                    v-model="org.affiliatedOrganism"
                    label="Filiado?"
                    :options="filiatedOptions"
                    class="q-pa-sm"
                  />
                  <q-input
                    label="Data de fundação"
                    class="q-pa-sm"
                    v-model="org.foundationDate"
                  />
                </q-expansion-item>
              </q-list>
              <div class="text-right q-ma-sm">
                <q-btn
                  v-if="(!org.action) || (org.action && org.action === 'add' || org.action && org.action === '')"
                  color="red"
                  rounded
                  @click="openDialogRemoveCongregation(iOrg)"
                  flat
                  unelevated
                  label="Excluir congregação"
                />
                <q-btn
                  v-else-if="org.action && org.action === 'remove'"
                  color="primary"
                  rounded
                  unelevated
                  @click="activateCongregation(iOrg)"
                  label="Ativar congregação"
                />
              </div>
            </q-expansion-item>
          </q-item-label>
        </q-item-section>
      </q-item>
      <div class="q-ma-lg">
        <q-btn
          class="full-width"
          rounded
          unelevated
          no-caps
          label="Descartar Rascunho"
          color="orange"
          @click="discardDraft"
          outline
        ></q-btn>
        <q-btn
          class="full-width q-mt-md"
          rounded
          unelevated
          no-caps
          label="Salvar Rascunho"
          color="primary"
          @click="saveDraft"
        ></q-btn>
        <q-btn
          class="full-width q-mt-md"
          rounded
          unelevated
          no-caps
          label="Salvar oficial"
          color="green"
          @click="saveFinal"
        ></q-btn>
      </div>
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
              @click="clearDialogConfirmAddFunctionUserInNewDept"
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
        @hide="cleanDialogAddNewDepartament"
      >
        <q-card style="width: 400px;">
          <q-card-section class="text-h6 text-center">
            Selecione a configuração
          </q-card-section>
          <q-card-section>
            <q-select
              class="q-pa-sm"
              v-model="dialogAddNewDepartament.departamentSelected"
              @update:model-value="getFunctionsByDepartamentId"
              filled
              option-label="organismConfigName"
              :options="deptConfigs"
            >
            </q-select>
          </q-card-section>
          <q-card-section v-if="dialogAddNewDepartament.functions">
            <div class="text-center text-h6 q-my-sm">
              Preencha ao menos uma função
            </div>
            <div
              v-for="(func, iFunc) in dialogAddNewDepartament.functions" 
              :key="func"
            >
              <strong>{{ func.functionName }}</strong>
              <q-btn
                color="primary"
                icon="add"
                flat
                rounded
                @click="addFunctionUserInNewDepartament(func, iFunc)"
              >
                <q-tooltip>Adicionar pessoa para esta função</q-tooltip>
              </q-btn>
              <div 
                class="q-ml-sm"
                v-for="(user, iUser) in func.functionUsers"
                :key="user"
              >
                {{ user.userName }}
                <q-btn
                  icon="delete"
                  color="red"
                  flat
                  rounded
                  @click="removeUserFromNewDept(iFunc, iUser)"
                >
                </q-btn>
              </div>
            </div>
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
              @click="confirmAddNewDepartament"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogDepartamentDetail.open"
        @hide="clearDialogDepartaments"
      >
        <q-card
          style="width:400px;"
        >
          <q-card-section 
            class="text-center"
            v-for="(dep, iDep) in dialogDepartamentDetail.data"
            :key="dep"
          >
            <div v-if="!dep.action || dep.action !== 'remove'">
              <div class="text-h6">
                {{ dep.departamentName }}
                <q-btn
                  unelevated  
                  icon="delete"
                  size="10px"
                  round
                  no-caps
                  rounded
                  color="red"
                  @click="deleteDepartament(iDep)"
                >
                  <q-tooltip>Excluir Departamento</q-tooltip>
                </q-btn>
              </div>
              <div class="text-left q-ml-sm">
                <strong>Funções:</strong>
              </div>
              <div
                v-for="(func, iFunc) in dep.organismFunctions"
                :key="func"
                class="q-my-md text-left q-ml-md"
              >
                {{ func.functionName }}
                <q-btn
                  color="primary"
                  flat
                  rounded
                  icon="add"
                  @click="addUserFunctioninDept(iDep, iFunc)"
                >
                  <q-tooltip>Adicionar pessoa na função</q-tooltip>
                </q-btn>
                <div
                  v-for="(user, iUser) in func.functionUsers"
                  :key="user"
                  class="q-ml-sm"
                >
                  {{ user.userName }}
                  <q-btn
                    color="red"
                    flat
                    rounded
                    icon="delete"
                    @click="removeUserFromFunctionDept(iDep, iFunc, iUser)"
                  ></q-btn>
                </div>
              </div>
            </div>
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
            <!-- <div class="text-center q-mt-sm">
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
            </div> -->
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogInserFunctionUserInNewDept.open"
        @hide="clearDialogConfirmAddFunctionUserInNewDept"
      >
        <q-card style="width: 400px;">
          <q-card-section class="text-center text-h6">
            Selecione o usuário que irá ocupar a função
          </q-card-section>
          <q-card-section>
            <q-select
              v-model="dialogInserFunctionUserInNewDept.userSelected"
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
              @click="confirmAddFunctionUserInNewDept"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogRemoveCongregation.open"
        @hide="cleanDialogRemoveCongregation"
      >
        <q-card style="width: 400px">
          <q-card-section class="text-center text-h6">
            Deseja remover esta congregação?
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              color="primary"
              rounded
              no-caps
              label="Voltar"
              unelevated
              @click="cleanDialogRemoveCongregation"
            />
            <q-btn
              unelevated
              rounded
              color="red"
              no-caps
              label="Excluir"
              @click="removeCongregation()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
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
        iExistsDept: null,
        data: null,
        departamentSelected: null,
        functions: null
      },
      dialogDepartamentDetail: {
        open: false,
        data: null,
        iOrg: null,
        iDep: null,
        iExistsDept: null
      },
      deptConfigs: null,
      dialogInserFunctionUserInNewDept: {
        open: false,
        iFunc: null,
        selectedUser: null,
        functionName: null
      },
      filiatedOptions: ['Sim', 'Não'],
      dialogRemoveCongregation: {
        open: false,
        iOrg: null
      }
    }
  }, 
  beforeMount() {
    this.getCompositionByUserId()
  },
  methods: {
    activateCongregation(iOrg) {
      console.log(iOrg, 'mas que macaquisse é essa?')
      this.composition.congregations[iOrg].action = ''
    },
    cleanDialogRemoveCongregation() {
      this.dialogRemoveCongregation = {
        open: false,
        iOrg: null
      }
    },
    removeCongregation() {
      if (!this.composition.congregations[this.dialogRemoveCongregation.iOrg].action) {
        this.composition.congregations[this.dialogRemoveCongregation.iOrg].action = 'remove'
      } else {
        this.composition.congregations[this.dialogRemoveCongregation.iOrg].action = 'remove'
      }
      this.cleanDialogRemoveCongregation()
    },
    openDialogRemoveCongregation(iOrg) {
      this.dialogRemoveCongregation.open = true,
      this.dialogRemoveCongregation.iOrg = iOrg
    },
    async saveFinal () {
      let opt = {
        route: '/desktop/statistics/saveCompositionDraft',
        body: this.composition
      }
      opt.body.status = 'sent'
      let r = await useFetch(opt)
      if (r.error) {
        this.$q.notify('Ocorreu um erro. Tente novamente')
        return
      }
      opt = {
        route: '/desktop/statistics/saveCompositionFinal',
      }
      r = await useFetch(opt)
      if (r.error) {
        this.$q.notify('Ocorreu um erro. Tente novamente')
        return
      }
    },
    discardDraft () {
      const opt = {
        route: '/desktop/statistics/discardCompositionDraft',
      }
      useFetch(opt).then((r) => {
        if (r.error) return
        this.$q.notify('Rascunho descartado com sucesso')
        this.getCompositionByUserId()
      })
    },
    cleanDialogAddNewDepartament() {
      this.dialogAddNewDepartament= {
        open: false,
        iOrg: null,
        iExistsDept: null,
        data: null,
        departamentSelected: null,
        functions: null
      }
    },
    confirmAddNewDepartament() {
      this.composition.congregations[this.dialogAddNewDepartament.iOrg].depts.forEach((departament, iDep) => {
        console.log(departament)
        if (departament.organismConfigId === this.dialogAddNewDepartament.departamentSelected.organismConfigId ) {
          let functions = []
          this.dialogAddNewDepartament.functions.forEach((func) => {
            functions.push({
              organismFunctionConfigId: func._id,
              functionName: func.functionName,
              functionUsers: func.functionUsers
            })
          })
    
    
          this.composition.congregations[this.dialogAddNewDepartament.iOrg].depts[iDep].existingDepartaments.push({
            departamentConfigId: this.dialogAddNewDepartament.departamentSelected.organismConfigId,
            departamentName: this.dialogAddNewDepartament.departamentSelected.organismConfigName,
            organismFunctions: functions,
            action: 'add'
          })
        }
      })
      this.cleanDialogAddNewDepartament()
    },
    removeUserFromNewDept(iFunc, iUser) {
      this.dialogAddNewDepartament.functions[iFunc].functionUsers.splice(iUser, 1)
    },
    clearDialogConfirmAddFunctionUserInNewDept() {
      this.dialogInserFunctionUserInNewDept = {
        open: false,
        iFunc: null,
        selectedUser: null,
        functionName: null
      }
    },
    confirmAddFunctionUserInNewDept() {
      if (!this.dialogAddNewDepartament.functions[this.dialogInserFunctionUserInNewDept.iFunc].functionUsers) {
        this.dialogAddNewDepartament.functions[this.dialogInserFunctionUserInNewDept.iFunc].functionUsers = []
      }
      this.dialogAddNewDepartament.functions[this.dialogInserFunctionUserInNewDept.iFunc].functionUsers.push({
        userName: this.dialogInserFunctionUserInNewDept.userSelected.userName,
        userId: this.dialogInserFunctionUserInNewDept.userSelected._id
      })
      this.clearDialogConfirmAddFunctionUserInNewDept()
    },
    addFunctionUserInNewDepartament(func, iFunc) {
      this.dialogInserFunctionUserInNewDept.open = true
      this.dialogInserFunctionUserInNewDept.iFunc = iFunc
      this.dialogInserFunctionUserInNewDept.functionName = func.functionName
    },
    getFunctionsByDepartamentId() {
      const opt = {
        route: '/desktop/statistics/getFunctionsByDepartamentId',
        body: {
          organismConfigId: this.dialogAddNewDepartament.departamentSelected.organismConfigId
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) return
        this.dialogAddNewDepartament.functions = r.data
        console.log(r.data)
      })
    },
    addUserFunctioninDept(iExistsDept, iFunc) {
      this.dialogAddFunctionToDept.iExistsDept = iExistsDept
      this.dialogAddFunctionToDept.iFunc = iFunc
      this.dialogAddFunctionToDept.iDep = this.dialogDepartamentDetail.iDep
      this.dialogAddFunctionToDept.iOrg = this.dialogDepartamentDetail.iOrg
      this.dialogAddFunctionToDept.open = true
    },
    clearDialogDepartaments() {
      this.dialogDepartamentDetail = {
        open: false,
        data: null,
        iOrg: null,
        iDep: null,
        iExistsDept: null
      }
    },
    deleteDepartament(iDep) {
      if (!this.composition.congregations[this.dialogDepartamentDetail.iOrg].depts[this.dialogDepartamentDetail.iDep].existingDepartaments[iDep].action) {
        this.composition.congregations[this.dialogDepartamentDetail.iOrg].depts[this.dialogDepartamentDetail.iDep].existingDepartaments[iDep].action = 'remove'
      } else {
        this.composition.congregations[this.dialogDepartamentDetail.iOrg].depts[this.dialogDepartamentDetail.iDep].existingDepartaments[iDep].action = 'remove'
      }
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
        console.log(funcData, 'cu')
        if (funcData.users) {
          this.dialogAddCongregation.functions[iFunc] = {
            functionName: funcData.description,
            functionUsers: funcData.users,
            organismFunctionConfigId: funcData.organismFunctionId
          }
        }
        else {
          this.dialogAddCongregation.functions[iFunc] = {
            functionName: funcData.description,
            functionUsers: [],
            organismFunctionConfigId: funcData.organismFunctionId
          }
        }
      })

      this.composition.congregations.push({
        organismChildConfig: 'Congregação',
        organismConfigId: '6525360fd7cd5c09a8d759be',
        organismChildName: this.dialogAddCongregation.data.name,
        organismFunctions: this.dialogAddCongregation.functions,
        action: 'add',
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
      this.composition.
      congregations[this.dialogAddFunctionToDept.iOrg].
      depts[this.dialogAddFunctionToDept.iDep].
      existingDepartaments[this.dialogAddFunctionToDept.iExistsDept].
      organismFunctions[this.dialogAddFunctionToDept.iFunc].
      functionUsers.push({
        userName: this.dialogAddFunctionToDept.userSelected.userName,
        _id: this.dialogAddFunctionToDept.userSelected.userIdString,
        action: 'add'
      })
      this.clearDialogAddUserToFunctionInDept()
    },
    removeUserFromFunctionDept(iExistsDept, iFunc, iUser) {
      if (!this.composition.congregations[this.dialogDepartamentDetail.iOrg].depts[this.dialogDepartamentDetail.iDep].existingDepartaments[iExistsDept].organismFunctions[iFunc].functionUsers[iUser].action) {
        this.composition.congregations[this.dialogDepartamentDetail.iOrg].depts[this.dialogDepartamentDetail.iDep].existingDepartaments[iExistsDept].organismFunctions[iFunc].functionUsers[iUser].action =  'remove'
      } else {
        this.composition.congregations[this.dialogDepartamentDetail.iOrg].depts[this.dialogDepartamentDetail.iDep].existingDepartaments[iExistsDept].organismFunctions[iFunc].functionUsers[iUser].action = 'remove'
      }
    },
    saveDraft() {
      const opt = {
        route: '/desktop/statistics/saveCompositionDraft',
        body: this.composition
      }
      opt.body.status = 'notSent'
      useFetch(opt).then((r) => {
        if (r.error) return
        this.$q.notify('Rascunho salvo com sucesso')
      })
    },
    deleteUserFromFunction(iOrg, iFunc, iUser) {
      if (!this.composition.congregations[iOrg].organismFunctions[iFunc].functionUsers[iUser].action) {
        this.composition.congregations[iOrg].organismFunctions[iFunc].functionUsers[iUser].action = 'remove'
      } else {
        this.composition.congregations[iOrg].organismFunctions[iFunc].functionUsers[iUser].action = 'remove'
      }
      
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
        userName: this.dialogAddFunction.userSelected.userName,
        action: 'add'
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
      if ((this.dialogAddFunction && this.dialogAddFunction.functionName === 'Pastor') || (this.dialogInsertUserFunctionInNewCongregation && this.dialogInsertUserFunctionInNewCongregation.functionName === 'Pastor') || (this.dialogInserFunctionUserInNewDept && this.dialogInserFunctionUserInNewDept.functionName === 'Pastor')) {
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
        let depConfigList = []
        this.composition.congregations[0].depts.forEach((dep) => {
          depConfigList.push({
            organismConfigName: dep.organismConfigName,
            organismConfigId: dep.organismConfigId
          })
        })
        this.composition.congregations.forEach((org) => {
          if (org.depts) {
            org.depts.forEach((dep) => {
              let trueLength = dep.existingDepartaments.length
              dep.trueLength = trueLength
            })
          }
        })
        this.deptConfigs = depConfigList
      })
    }
  }
})
</script>
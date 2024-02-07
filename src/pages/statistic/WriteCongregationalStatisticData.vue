<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs align="center">
          <q-breadcrumbs-el 
            style="cursor: pointer;" 
            icon="home" 
            label="Introdução" 
            @click="$router.push('/statistic/introWriteStatisticData')"          
          />
            
            <q-breadcrumbs-el label="Composição" />
        </q-breadcrumbs>
      </div>
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
          <div class="q-my-sm" v-if="pastorsList && pastorsList.length > 0">
            <div class="text-h6">
              Pastores:
            </div>
            <q-list>
              <q-item
                v-for="pastor in pastorsList"
                :key="pastor"
                class="bg-grey-2 q-ma-sm"
                style="border-radius:1rem"
              > 
                {{ pastor.userName }}
              </q-item>
            </q-list>
            <div>
              <q-btn
                color="primary"
                icon="sync_problem"
                label="Solicitar alteração/correção"
                flat
                @click="reportError('changePastor', org.organismChildId)"
                rounded
              >
                <q-tooltip>Solicitar alteração/correção</q-tooltip>
              </q-btn>
            </div>
          </div>
          <div class="q-mt-sm text-left text-h6">
            Congregações:
            <q-btn
              v-if="!status || (status && status.value !== 'sent')"
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
              header-class="text-primary text-h6"
              class="bg-grey-2 q-pa-sm text-left"
              style="border-radius: 1rem;"
            >
              <q-list bordered class="q-mb-sm">
                <div class="text-h6 q-ml-md q-mt-sm q-mb-md">
                  Funções
                </div>
                <div 
                  class="text-left q-ml-lg"
                  v-for="(func, iFunc) in org.organismFunctions" 
                  :key="func"
                >
                  <div v-if="func.functionName !== 'Pastor'">
                    <strong>{{ func.functionName }}:</strong>
                    <q-btn
                      color="primary"
                      flat
                      v-if="(!status &&  func.functionName !== 'Pastor') || (status && status.value !== 'sent') && func.functionName !== 'Pastor'"
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
                              v-if="(!status &&  func.functionName !== 'Pastor') || (status && status.value !== 'sent') && func.functionName !== 'Pastor'"
                              rounded
                              unelevated
                              icon="delete"
                              @click="deleteUserFromFunction(iOrg, iFunc, iUser)"
                            ></q-btn>
                            <q-btn
                              color="primary"
                              icon="sync_problem"
                              v-if="func.functionName === 'Pastor'"
                              dense
                            no-caps
                            label="Solicitar alteração/correção"
                              flat
                              @click="reportError('changePastor', org.organismChildId)"
                              rounded
                            >
                              <q-tooltip>Solicitar alteração/correção</q-tooltip>
                            </q-btn>
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </div>
                  </div>
                </div>
              </q-list>
              <q-list bordered class="q-mb-sm">
                <div class="text-h6 q-ml-md q-mt-sm q-mb-md">
                  Departamentos
                </div>
                <div 
                  v-for="(dep, iDep) in org.depts"
                  :key="dep"
                >
                  <q-item 
                    v-if="dep.action !== 'naoExiste'"
                    :clickable="dep.trueLength > 0 ? true : false"
                    v-ripple
                    @click="openSelectDepartamentDetail(iOrg, iDep)"
                  >
                    <q-item-section avatar>
                      <q-avatar
                        :color="dep.trueLength === 0 ? 'grey' : 'primary'" 
                        text-color="white"
                      >
                        {{ dep.trueLength }} 
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>{{dep.organismConfigName}}</q-item-section>
                    <q-item-section side>
                      <q-btn
                        color="primary"
                        flat
                        rounded
                        icon="add"
                        label="departamento"
                        @click="addNewDepartament(iOrg, iDep)"
                      />
                    </q-item-section>
                  </q-item>
                  <q-separator class="q-mx-lg"/>
                </div>
                <!-- <div class="text-left q-ma-md text-h6">
                  <q-btn
                    color="primary"
                    flat
                    v-if="!status || (status && status.value !== 'sent')"
                    rounded
                    icon="add"
                    label="Adicionar novo departamento"
                    @click="addNewDepartament(iOrg)"
                  >
                    <q-tooltip>Adicionar Departamento</q-tooltip>
                  </q-btn>
                </div> -->
              </q-list>
              <q-list bordered>
                <div class="text-h6 q-ml-md q-mt-sm q-mb-md">
                  Outras informações
                </div>
                <div class="q-ma-md">
                  <q-select
                    v-model="org.affiliatedOrganism"
                    readonly
                    label="Filiado?"
                    :options="filiatedOptions"
                    class="q-pa-sm"
                  />
                  <q-btn
                    color="primary"
                    icon="sync_problem"
                    dense
                    no-caps
                    label="Solicitar alteração/correção"
                    flat
                    @click="reportError('isAffiliated', org.organismChildId)"
                    rounded
                  >
                    <q-tooltip>Solicitar alteração/correção</q-tooltip>
                  </q-btn>
                  <div class="row items-center">  
                    <q-input
                      :disable="composition.congregations[iOrg].semFundacao"
                      label="Data de fundação"
                      class="q-pa-sm"
                      mask="##/##/####"
                      v-model="composition.congregations[iOrg].foundationDate"
                    />
                    <div class="col">  
                      <q-checkbox
                      v-if="!composition.congregations[iOrg].foundationDate"
                      label="Não sei"
                      v-model="composition.congregations[iOrg].semFundacao"
                      />
                    </div>  
                  </div>
                  <div class="text-h6 q-my-sm q-ml-sm" v-if="composition.congregations[iOrg] && composition.congregations[iOrg].value && composition.congregations[iOrg].value.length > 0">
                    Quando ocorre o culto:
                  </div>
                  <q-list
                    bordered
                    class="q-mt-sm"
                    v-if="composition.congregations[iOrg] && composition.congregations[iOrg].value && composition.congregations[iOrg].value.length > 0"
                  >
                  <q-item v-for="(day, iDay) in composition.congregations[iOrg].value" :key="day">
                    <q-item-section v-if="day.model === 'month'">
                      <q-item-label>
                        <strong class="q-mr-sm">Frequência:</strong> {{ day.label }}
                      </q-item-label>
                      <div
                        v-for="week in day.weeks"
                        :key="week"
                        class="q-ml-xs q-py-md row"
                      >
                        <div class="col-4">
                          {{ week.label }}:
                        </div>
                        <q-list class="col-8">
                          <q-item
                            class="no-padding"
                            v-for="val in week.value"
                            :key="val"
                          >
                            <q-item-label>
                              {{ val.day.label }} às {{ val.time }}
                            </q-item-label>
                          </q-item>
                        </q-list>
                      </div>
                    </q-item-section>
                    <q-item-section v-else-if="day.model === 'week'">
                      <q-item-label>
                        <strong class="q-mr-sm">Frequência:</strong> {{ day.label }}
                      </q-item-label>
                      <div
                        v-for="days in day.days"
                        :key="days"
                        class="q-ml-xs q-py-md row"
                      >
                        {{ days.value.label }} às {{ days.value.times.initial }}
                      </div>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn
                        color="red"
                        flat
                        rounded
                        icon="delete"
                        @click="removeDay(iOrg, iDay)"
                      />
                    </q-item-section>
                  </q-item>

                  </q-list>
                  <q-btn
                    label="Adicionar dia e horário do culto"
                    dense
                    no-caps
                    color="primary"
                    unelevated
                    rounded
                    class="q-pa-sm q-my-md"
                    @click="clkAddServices(iOrg)"
                  />
                </div>
              </q-list>
              <q-list bordered class="q-mt-sm">
                <div class="text-h6 q-ml-md q-mt-sm q-mb-md">
                  Secretária contratada
                </div>
                <div class="q-mx-md">
                  <div v-if="org && org.secretary">
                    <q-list
                      bordered
                      class="q-my-sm"
                      v-for="(sec, iSec) in org.secretary"
                      :key="sec"
                    >
                      <q-item
                        class="q-ma-sm"
                      >  
                        <q-item-section>
                          <q-item-label lines="1">
                            <strong>Nome:</strong> {{ sec.user.userName }}
                          </q-item-label>
                          <q-item-label lines="2">
                            <strong>Dia da semana:</strong> 
                          </q-item-label>
                            <div
                              v-for="day in sec.days"
                              :key="day"
                              class="q-ma-sm"
                            >
                              {{day.label}}
                            </div>
                          <q-item-label lines="3">
                            <strong>Hora inicial:</strong> {{sec.initialHour}}
                          </q-item-label>
                          <q-item-label>
                            <strong>Hora final:</strong> {{sec.finalHour}}
                          </q-item-label>
                          <q-item-label lines="4" v-if="sec.obs">
                            <strong>Observções:</strong>
                            {{ sec.obs }}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-btn
                            color="red"
                            flat
                            unelevated
                            rounded
                            icon="delete"
                            @click="removeSecretary(iOrg, iSec)"
                          />
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                  <div class="q-ma-md text-h6">
                    <q-btn
                      label="Secretária"
                      icon="add"
                      color="primary"
                      rounded
                      unelevated
                      @click="addSecretaryToParoquia(iOrg)"
                    />
                  </div>
                  </div>
              </q-list>
              <q-list bordered class="q-mt-sm">
                <div class="text-h6 q-ml-md q-mt-sm q-mb-md">
                  Gestão Paroquial
                </div>
                <q-option-group
                  :options="options"
                  type="radio"
                  v-model="composition.congregations[iOrg].paroquialManagement"
                  @update:model-value="insertParoquialManagementType(iOrg, org)"
                />
                <q-input
                  v-if="org.paroquialManagement === 'outro'"
                  @update:model-value="insertParoquialManagementType(iOrg, org)"
                  label="Outro"
                  class="q-pa-sm"
                  v-model="composition.congregations[iOrg].other"
                />
              </q-list>
              <div class="text-right q-ma-sm">
                <q-btn
                  v-if="((!org.action) || (org.action && org.action === 'add' || org.action && org.action === '')) && (!status || (status && status.value !== 'sent'))"
                  color="red"
                  rounded
                  @click="openDialogRemoveCongregation(iOrg)"
                  flat
                  unelevated
                  label="Excluir congregação"
                />
                <q-btn
                  v-else-if="(org.action && org.action === 'remove') && (!status || (status && status.value !== 'sent'))"
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
      <q-separator 
        class='q-mx-md q-my-sm'
      />
      <div 
        class="q-ma-lg" 
        v-if="!status || (status && status.value !== 'sent')"
      >
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
      <div 
        v-else
        class="q-pa-md text-h6 text-center"
      >
          Esta etapa foi concluida. Os dados estão disponíveis somente para consulta
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
              use-input
              label="Nome do usuário"
              option-label="userName"
              :options="usersOptions"
              @filter="getUsers"
              :loading="false"
              :option-value="(item) => item._id"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.userName }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.email }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Nenhum resultado
                  </q-item-section>
                  <q-item-section class="text-grey">
                    <q-btn 
                      icon="person_add"
                      dense
                      flat
                      no-caps
                      label="Novo usuário"
                      color="primary"
                      @click="dialogAddUser.open = true"
                    ><q-tooltip>Adicionar novo usuário</q-tooltip></q-btn>
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
              use-input
              label="Nome do usuário"
              option-label="userName"
              :options="usersOptions"
              @filter="getUsers"
              :loading="false"
              :option-value="(item) => item._id"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.userName }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.email }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Nenhum resultado
                  </q-item-section>
                  <q-item-section class="text-grey">
                    <q-btn 
                      icon="person_add"
                      dense
                      flat
                      color="primary"
                      @click="dialogAddUser.open = true"
                    ><q-tooltip>Adicionar novo usuário</q-tooltip></q-btn>
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
              label="Número" 
              hint="Informe o número"
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
                      @click="clearDialogAddNewCongrgation"
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
              use-input
              label="Nome do usuário"
              option-label="userName"
              :options="usersOptions"
              @filter="getUsers"
              :loading="false"
              :option-value="(item) => item._id"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.userName }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.email }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Nenhum resultado
                  </q-item-section>
                  <q-item-section class="text-grey">
                    <q-btn 
                      icon="person_add"
                      dense
                      flat
                      color="primary"
                      @click="dialogAddUser.open = true"
                    ><q-tooltip>Adicionar novo usuário</q-tooltip></q-btn>
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
              @click="clearDialogAddUserFunctionInNewCongregation"
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
          <q-card-section>
            <div 
              class="text-center text-h6 q-my-sm"
              v-if="dialogAddNewDepartament.functions"
            >
              Nome do departamento
            </div>
            <q-input
              v-if="dialogAddNewDepartament.functions"
              label="Dê um nome ao departamento"
              v-model="dialogAddNewDepartament.name"
              class="q-pa-sm"
            />
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
              @click="cleanDialogAddNewDepartament"
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
          >
            <div class="text-h6">
              {{ dialogDepartamentDetail.data.departamentName }}
              <q-btn
                class="text-left"
                unelevated  
                icon="delete"
                size="10px"
                round
                no-caps
                rounded
                color="red"
                @click="deleteDepartament()"
              >
                <q-tooltip>Excluir Departamento</q-tooltip>
              </q-btn>
            </div>
          </q-card-section>
          <q-card-section>
            <q-list bordered>
              <q-expansion-item
                label="Funções"
                class="bg-grey-2 q-pa-sm text-left q-ma-sm"
                style="border-radius: 1rem;"
              >
                <div
                  class="text-left q-ml-lg"
                  v-for="(func, iFunc) in dialogDepartamentDetail.data.organismFunctions"
                  :key="func"
                >
                  <strong>{{ func.functionName }}</strong>
                  <q-btn
                    color="primary"
                    flat
                    rounded
                    icon="add"
                    @click="addUserFunctioninDept(iFunc)"
                    size="12px"
                  >
                  </q-btn>
                  <div
                    v-for="(user, iUser) in dialogDepartamentDetail.data.organismFunctions[iFunc].functionUsers"
                    :key="user"
                  >
                    <q-item
                      class="no-padding"
                      v-if="!user.action || (user.action && user.action !== 'remove')"
                    >
                      <q-item-section>
                        <q-item-label>
                          {{ user.userName }}
                          <q-btn
                            color="red"
                            flat
                            rounded
                            unelevated
                            @click="removeUserFromFunctionDept(iFunc, iUser)"
                            icon="delete"
                          />
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>
                </div>
              </q-expansion-item>
            </q-list>
            <q-list bordered class="q-mt-sm">
              <q-expansion-item
                class="bg-grey-2 q-pa-sm text-left q-ma-sm"
                style="border-radius:1rem"
                label="Outros dados"
              >
                <div class="text-h6 q-my-sm q-ml-sm">
                  Quando ocorre o culto:
                </div>
                <div v-if="composition.congregations[this.dialogDepartamentDetail.iOrg].depts[this.dialogDepartamentDetail.iDep].existingDepartaments[this.dialogDepartamentDetail.iExistsDept].diaEHorario">
                  <q-list
                    bordered
                      v-for="(day, iDay) in composition.congregations[this.dialogDepartamentDetail.iOrg].depts[this.dialogDepartamentDetail.iDep].existingDepartaments[this.dialogDepartamentDetail.iExistsDept].diaEHorario"
                      :key="day"
                      class="q-my-sm"
                  >
                    <q-item>
                      <q-item-section>
                        <q-item-label lines="1">
                          Dia: {{ day.day }}
                        </q-item-label>
                        <q-item-label lines="2">
                          Horário: {{ day.hour }}
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          color="red"
                          flat
                          unelevated
                          icon="delete"
                          @click="removeDayInDep(iDay)"
                        />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
                <q-btn
                  label="Adicionar dia e horário"
                  color="primary"
                  unelevated
                  no-caps
                  rounded
                  flat
                  @click="addDayAndHourInDept(iOrg, iDep)"
                  icon="add"
                  class="q-px-sm q-ml-sm"
                />
              </q-expansion-item>
            </q-list>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              @click="clearDialogDepartaments"
              label="Voltar"
              no-caps
              rounded
              unelevated
              color="primary"
              flat
            />
          </q-card-actions>
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
              use-input
              label="Nome do usuário"
              option-label="userName"
              :options="usersOptions"
              @filter="getUsers"
              :loading="false"
              :option-value="(item) => item._id"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.userName }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.email }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Nenhum resultado
                  </q-item-section>
                  <q-item-section class="text-grey">
                    <q-btn 
                      icon="person_add"
                      dense
                      flat
                      color="primary"
                      @click="dialogAddUser.open = true"
                    ><q-tooltip>Adicionar novo usuário</q-tooltip></q-btn>
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
      <q-dialog
        v-model="dialogSelectDepartamentDetail.open"
        @hide="clearDialogSelectDepartamentDetail"
      >
        <q-card style="width: 400px;border-radius:1rem">
          <q-card-section class="text-center text-h6">
            Selecione o departamento
          </q-card-section>
          <q-card-section>
            <div
              v-for="(dep, iExistsDept) in dialogSelectDepartamentDetail.departaments"
              :key="dep"
            >
              <q-item
                v-if="!dep.action || (dep.action && dep.action !== 'remove')"
                class="bg-grey-2 q-my-sm"
                clickable
                style="border-radius:.7rem"
                @click="openDepartamentDetail(iExistsDept)"
              > 
                <div>
                  <strong>{{ dep.departamentName }}</strong>
                </div>
              </q-item>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogAddServices.open"
        @hide="clearDialogAddServices"
      >
        <q-card style="width: 400px;">
          <q-card-section>
            <div>
              <strong>Frequência:</strong>
              <q-select
                class="q-pa-sm"
                filled
                use-input
                label="Selecione a Frequência"
                option-label="label"
                v-model="dialogAddServices.selectedEventOption"
                :options="dialogAddServices.eventsOptions.map(option => ({ ...option }))"
                :loading="false"
                @update:model-value="resetDays"
              />
            </div>
            <div class=q-mt-md v-if="dialogAddServices.selectedEventOption && dialogAddServices.selectedEventOption.model === 'week'">
              <strong>Dias:</strong>
              <div
                v-for="(day, iDay) in dialogAddServices.selectedEventOption.days"
                :key="iDay"
              >
                <div
                  class="row"
                >
                  <q-select
                    class="q-pa-sm col-7"
                    filled
                    label="Selecione o dia"
                    option-label="label"
                    v-model="day.value"
                    :options="dialogAddServices.daysOfWeek"
                    :loading="false"
                  />
                  <q-chip 
                    class="col-2 q-ml-sm"
                    v-if="day.value && day.value.times && day.value.times.initial"
                    color="white"
                    model-value=false
                    flat
                    text-color="primary"
                  >
                    {{ day.value.times.initial }}
                    <q-tooltip>Horário inicial</q-tooltip>
                  </q-chip>
                  <q-btn
                    v-if="day.value && day.value.label"
                    class="col-2"
                    color="primary"
                    flat
                    icon="schedule"
                    rounded
                    @click="addTimeForDay(iDay)"
                  >
                    <q-tooltip>Selecione o horário</q-tooltip>
                  </q-btn>
                </div>
              </div>
              <div
                align="center"
              >
                <q-btn
                  color="primary"
                  rounded
                  unelevated
                  label="confirmar"
                  @click="confirmAddEventsWeek"
                />
              </div>
            </div>
            <div
              v-if="dialogAddServices.selectedEventOption && dialogAddServices.selectedEventOption.model === 'month'"
            >
              <div
                v-for="(week, iWeek) in dialogAddServices.selectedEventOption.weeks"
                :key="week"
              >
                <div class="">
                  <strong>{{ week.label }}:</strong>
                  <q-btn 
                    v-if="(!week.value || !week.value.label) && dialogAddServices.selectedEventOption.num > dialogAddDayInMonth.count"
                    icon="add"
                    color="primary"
                    flat
                    rounded
                    size="12px"
                    @click="addDayInMonth(iWeek)"
                  >
                    <q-tooltip>Adicionar culto</q-tooltip>
                  </q-btn>
                  <div v-if="week.value">
                    <div 
                      v-for="(value, iValue) in week.value"
                      :key="value"
                    >
                      <div class="row">
                        <q-select
                          class="col-5"
                          filled
                          use-input
                          label="Selecione o dia"
                          option-label="label"
                          v-model="value.day"
                          :options="dialogAddServices.daysOfWeek"
                          :loading="false"
                        />
                        <q-chip
                          class="col-2"
                          v-if="value && value.time"
                          color="white"
                          text-color="primary"
                        >
                          {{ value.time }}
                        </q-chip>
                        <q-btn
                          v-if="value.day"
                          class="col-2 q-pa-sm"
                          color="primary"
                          flat
                          icon="schedule"
                          rounded
                          @click="addTimeForDay(iWeek, iValue)"
                        >
                          <q-tooltip>Selecione o horário</q-tooltip>
                        </q-btn>
                        <q-btn
                          class="col-2"
                          color="red"
                          flat
                          icon="delete"
                          rounded
                          @click="removeMonthDay(iWeek, iValue)"
                        >
                          <q-tooltip>Excluir dia</q-tooltip>
                        </q-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </q-card-section>
          <q-card-actions
            align="center"
            v-if="dialogAddDayInMonth 
            && dialogAddServices.selectedEventOption 
            && dialogAddServices.selectedEventOption.num === dialogAddDayInMonth.count"
          >
            <q-btn
              color="primary"
              rounded
              unelevated
              label="confirmar"
              @click="confirmAddEventsMonth"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        @hide="clearTimeForDayDialog"
        v-model="dialogAddTimeForDay.open"
      >
        <q-card style="width: 300px;">
          <q-card-section>
            <div class='text-center text-h6'>
              Horários
            </div>
            <q-input 
              type="time" 
              class="q-my-sm"
              outlined
              label="Início" 
              v-model="dialogAddTimeForDay.initial"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Voltar"
              no-caps
              rounded
              color="primary"
              @click="clearTimeForDayDialog"
            />
            <q-btn
              label="Adicionar"
              unelevated
              no-caps
              rounded
              color="primary"
              @click="confirmAddTimeForDay"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- <q-dialog
        v-model="dialogAddEventsDayAndHour.open"
        @hide="clearDialogAddEventsDayAndHour"
      >
        <q-card
          style="width:400px;border-radius:1rem"
        >
          <q-card-section class="text-center text-h6">
            <strong>Selecione o dia da semana e o horário</strong>
          </q-card-section>
          <q-card-section>
            <q-select
              :options="daysOfWeek"
              v-model="dialogAddEventsDayAndHour.day"
              class="q-px-sm"
              label="Dia da semana"
            />
          </q-card-section>
          <q-card-section>
            <q-input
              label="Informe o horário"
              class="q-px-sm"
              v-model="dialogAddEventsDayAndHour.hour"
              type="time"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              label="Voltar"
              no-caps
              rounded
              @click="clearDialogAddEventsDayAndHour"
              flat
              unelevated
              color="primary"
            />
            <q-btn
              label="Adicionar"
              no-caps
              @click="confirmAddEventsDayAndHour"
              unelevated
              rounded
              color="primary"
            />
          </q-card-actions>
        </q-card>
      </q-dialog> -->
      <q-dialog
        v-model="dialogAddEventsDayAndHourInDep.open"
        @hide="clearDialogAddDayAndHourInDept"
      >
      <q-card
          style="width:400px;border-radius:1rem"
        >
          <q-card-section class="text-center text-h6">
            <strong>Selecione o dia da semana e o horário</strong>
          </q-card-section>
          <q-card-section>
            <q-select
              :options="daysOfWeek"
              v-model="dialogAddEventsDayAndHourInDep.day"
              class="q-px-sm"
              label="Dia da semana"
            />
          </q-card-section>
          <q-card-section>
            <q-input
              label="Informe o horário"
              class="q-px-sm"
              v-model="dialogAddEventsDayAndHourInDep.hour"
              type="time"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              label="Voltar"
              no-caps
              rounded
              @click="clearDialogAddDayAndHourInDept"
              flat
              unelevated
              color="primary"
            />
            <q-btn
              label="Adicionar"
              no-caps
              @click="confirmAddEventsDayAndHourInDept"
              unelevated
              rounded
              color="primary"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        @hide="clearDialogAddSecretary"
        v-model="dialogAddSecretary.open"
      >
        <q-card
          style="width:400px;border-radius:1rem"
        >
          <q-card-section class="text-h6 text-center"> 
            selecione o usuário
          </q-card-section>
          <q-card-section>
            <q-select
              v-model="dialogAddSecretary.userSelected"
              use-input
              label="Nome do usuário"
              option-label="userName"
              :options="usersOptions"
              @filter="getUsers"
              :loading="false"
              :option-value="(item) => item._id"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.userName }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.email }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Nenhum resultado
                  </q-item-section>
                  <q-item-section class="text-grey">
                    <q-btn 
                      icon="person_add"
                      dense
                      flat
                      color="primary"
                      @click="dialogAddUser.open = true"
                    ><q-tooltip>Adicionar novo usuário</q-tooltip></q-btn>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>
          <q-card-section>
            <div class="text-h6 text-center">
              Marque os dias da semana
            </div>
            <div
              class="row"
            >
              <q-checkbox
                v-for="day in dialogAddSecretary.days"
                :key="day"
                class="q-pa-sm col-12"
                v-model="day.selected"
              >
                {{ day.label }}
              </q-checkbox>
            </div>
          </q-card-section>
          <q-card-section>
            <div
              class="text-h6 text-center"
            >
              Selecione os horários
            </div>
            <q-input
              label="Hora inical"
              class="q-px-sm q-mt-sm"
              v-model="dialogAddSecretary.initialHour"
              type="time"
            />
            <q-input
              label="Hora final"
              class="q-px-sm q-mt-sm"
              v-model="dialogAddSecretary.finalHour"
              type="time"
            />
          </q-card-section>
          <q-card-section>
            <div
              class="text-h6 text-center"
            >
              Observações
            </div>
            <q-input
              label="Adicione aqui alguma observação"
              v-model="dialogAddSecretary.obs"
            >

            </q-input>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              label="Sair"
              no-caps
              color="primary"
              @click="clearDialogAddSecretary"
              flat
              rounded
              unelevated
            />
            <q-btn
              label="Confirmar"
              no-caps
              color="primary"
              rounded
              unelevated
              @click="confirmAddSecretary"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </q-page-container>
  <q-dialog
    v-model="dialogReportError.open"
  >
    <q-card style="width: 400px;">
      <q-card-section
        v-if="dialogReportError.type === 'isAffiliated'"
        class="text-h6 text-center"
      >
        Observação:
      </q-card-section>
      <q-card-section
        v-if="dialogReportError.type === 'changePastor'"
        class="text-h6 text-center"
      >
        Informe o substituto desejado:
      </q-card-section>
      <q-card-section>
        <q-select v-if="dialogReportError.type === 'changePastor'"
          v-model="dialogReportError.userSelected"
          use-input
          label="Nome do usuário"
          option-label="userName"
          :options="usersOptions"
          @filter="getUsers"
          :loading="false"
          :option-value="(item) => item._id"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.userName }}</q-item-label>
                <q-item-label caption>{{ scope.opt.email }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Nenhum resultado
              </q-item-section>
              <q-item-section class="text-grey">
                <q-btn 
                  icon="person_add"
                  dense
                  flat
                  color="primary"
                  @click="dialogAddUser.open = true"
                ><q-tooltip>Adicionar novo usuário</q-tooltip></q-btn>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-input v-if="dialogReportError.type === 'isAffiliated'"
          type="textarea"
          label="Informe a alteração"
          v-model="dialogReportError.text"
        />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          flat
          rounded
          color="primary"
          label="Sair"
          no-caps
          unelevated
          @click="clearDialogReportError"
        />
        <q-btn
          rounded
          color="primary"
          unelevated
          label="Confirmar"
          no-caps
          @click="confirmReportError"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog
    v-model="dialogAddUser.open"
  >
    <q-card style="width: 400px; border-radius: 1rem">
      <q-card-section
        class="text-h6 text-center"
      >
        Informe os dados do novo usuário:
      </q-card-section>
      <q-card-section>
        <q-input
          label="Nome completo"
          class="q-px-sm q-mt-sm"
          v-model="dialogAddUser.data.name"
        />
        <q-input
          label="Email do novo usuário"
          class="q-px-sm q-mt-sm"
          v-model="dialogAddUser.data.email"
        />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          flat
          rounded
          color="primary"
          label="Sair"
          no-caps
          unelevated
          @click="clearDialogNewUser"
        />
        <q-btn
          rounded
          color="primary"
          unelevated
          label="Confirmar"
          no-caps
          @click="confirmCreateNewUser"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import useFetch from "src/boot/useFetch";
// import utils from "../../boot/utils";s
import { defineComponent } from "vue";
export default defineComponent({
  name:"WriteCongregationalStatisticData",
  data() {
    return {
      // composition.congregations.foundationDate,
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
      dialogAddUser: {
        open: false,
        data: {
          name: '',
          email: '',
          phone: '',
          document: ''
        }
      },
      dialogAddCongregation: {
        open: false,
        data: {
          name: '',
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
        iDep: null,
        name: null,
        data: null,
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
      },
      dialogReportError: {
        open: false,
        type: null,
        text: '',
        organismId: ''
      },
      dialogSelectDepartamentDetail: {
        open: false,
        departaments: null
      },
      validated: false,
      status: null,
      dialogAddEventsDayAndHour: {
        open: false,
        day: null,
        iOrg: null,
        hour: null
      },
      dialogAddEventsDayAndHourInDep: {
        open: false,
        index: null,
        count: 0,
        initial: null
      },
      organismData: {
        organismConfigId: '',
        fields: [],
        day: null,
        hour: null
      },
      semFoundation: false,
      dialogAddServices: {
        open: false,
        eventsOptions: null,
        daysOfWeek: null,
        selectedEventOption: null,
        selectedDay: null,
        selectedValue: null,
        iOrg: null
      },
      dialogAddDayInMonth: {
        open: false,
        index: null,
        count: 0,
        initial: null
      },
      dialogAddTimeForDay: {
        open: false,
      },
      daysOfWeek: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'],
      dialogAddSecretary: {
        open: false,
        userSelected: null,
        iOrg: null,
        initialHour: null,
        finalHour: null,
        days: [
          {label: 'Segunda-feira', selected: false},
          {label: 'Terça-feira', selected: false},
          {label: 'Quarta-feira', selected: false},
          {label: 'Quinta-feira', selected: false},
          {label: 'Sexta-feira', selected: false},
          {label: 'Sábado', selected: false},
          {label: 'Domingo', selected: false}
        ],
        obs: ''
      },
      options: [
        { label: 'SIPAR', value: 'SIPAR' },
        { label: 'Prover', value: 'Prover', color: 'green' },
        { label: 'Inchurch', value: 'Inchurch', color: 'red' },
        { label: 'F5 Sapi', value: 'F5 Sapi', color: 'yellow-8' },
        { label: 'Não possuo', value: 'Não possuo', color: 'pink-8' },
        { label: 'Outro: Qual', value: 'outro', color: 'purple' }
      ],
      other: '',
      group: null,
      pastorsList: []
    }
  }, 
  beforeMount() {
    this.getCompositionByUserId()
    this.getEventsOptions()
    this.getDaysOfWeek()
  },
  beforeUnmount() {
    if (this.validated && (this.status && this.status.value === 'sent')) return
    this.saveDraft()
  },
  methods: {
    confirmCreateNewUser () {
      const opt = {
        route: '/desktop/statistics/createNewUser',
        body: {
          data: this.dialogAddUser.data,
          userType: ''
        }
      }
      if(this.dialogAddFunction.functionName === 'Pastor'){
        opt.body.userType = 'pastor'
      }
      useFetch(opt).then(() => {
        this.$q.notify('Usuário criado, selecione-o para prosseguir')
        this.dialogAddUser.open = false
        this.dialogAddUser.data = {
          name: '',
          email: '',
          phone: '',
          document: ''
        }
      })
    },
    clearDialogNewUser() {
      this.dialogAddUser.open = false,
      this.dialogAddUser.data = {
        name: '',
        email: '',
        phone: '',
        document: ''
      }
    },
    reportError(type, organismId) {
      this.dialogReportError.open = true,
      this.dialogReportError.organismId = organismId
      this.dialogReportError.type = type
    },
    confirmReportError() {
      const opt = {
        route: '/desktop/statistics/insertErrorReport',
        body: {
          reportData: this.dialogReportError
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) return
        this.$q.notify('Erro reportado com sucesso')
      })
      this.clearDialogReportError()
    },
    clearDialogReportError() {
      this.dialogReportError= {
        open: false,
        type: null,
        text: '',
        organismId: '',
        userSelected: ''
      }
    },  
    insertParoquialManagementType(iOrg, org){
      console.log(org)
      const opt = {
        route: "/desktop/statistics/insertParoquialManagementType",
        body:{
          managementType: this.composition.congregations[iOrg].paroquialManagement,
          organismId: org.organismChildId
        }
      }
      if(this.paroquialManagement === 'outro'){
        opt.body.managementType = this.composition.congregations[iOrg].other
      }
      this.$q.loading.show()
      useFetch(opt).then(() => {
        this.$q.loading.hide()
      });
    },
    clearDialogInserTimeInMonth() {
      this.dialogInsertTimeInMonth.open = false
      this.dialogInsertTimeInMonth.initial = null
    },
    clearTimeForDayDialog() {
      this.dialogAddTimeForDay.initial = null
      this.dialogAddTimeForDay.open = false
    },
    confirmAddEventsMonth() {
      let allHaveTime = true;

      this.dialogAddServices.selectedEventOption.weeks.forEach((w) => {
        if (w.value && w.value.length > 0) {
          const eventsWithTime = w.value.filter((v) => v.time);
          if (eventsWithTime.length > 0) {
            if (!this.composition.congregations[this.dialogAddServices.iOrg].value) {
              this.composition.congregations[this.dialogAddServices.iOrg].value = [];
            }
            this.composition.congregations[this.dialogAddServices.iOrg].value.push({
              ...this.dialogAddServices.selectedEventOption,
              weeks: [{ value: eventsWithTime, label: w.label  }]  
            });
          } else {
            allHaveTime = false;
            this.$q.notify('Preencha o horário para pelo menos um evento.');
          }
        }
      });

      if (allHaveTime) {
        this.clearDialogAddServices();
      }
    },
  
    // confirmAddEventsDayAndHour() {
    //   if (!this.composition.congregations[this.dialogAddEventsDayAndHour.iOrg].diaEHorario) {
    //     this.composition.congregations[this.dialogAddEventsDayAndHour.iOrg].diaEHorario = []
    //   }
    //   this.composition.congregations[this.dialogAddEventsDayAndHour.iOrg].diaEHorario.push({
    //     day: this.dialogAddEventsDayAndHour.day,
    //     hour: this.dialogAddEventsDayAndHour.hour,
    //     action: 'add'
    //   })
    //   this.clearDialogAddEventsDayAndHour()
    // },
    removeMonthDay(iWeek, iValue) {
      this.dialogAddServices.selectedEventOption.weeks[iWeek].value.splice(iValue, 1)
      this.dialogAddDayInMonth.count--
    },
    confirmAddTimeForDay() {
      if (this.dialogAddServices.selectedEventOption.days) {
        this.dialogAddServices.selectedEventOption.days[this.dialogAddServices.selectedDay].value.times.initial = this.dialogAddTimeForDay.initial;
      } else if (this.dialogAddServices.selectedEventOption.weeks) {
        this.dialogAddServices.selectedEventOption.weeks[this.dialogAddServices.selectedDay].value[this.dialogAddServices.selectedValue].time = this.dialogAddTimeForDay.initial;
      }
      this.dialogAddTimeForDay.open = false
    },
    addDayInMonth(i) {
      this.dialogAddServices.selectedEventOption.weeks[i].value.push({
        day: null,
        time: null
      })
      this.dialogAddDayInMonth.count++
    },
    clkAddServices(iOrg) {
      this.dialogAddServices.open = true
      this.dialogAddServices.iOrg = iOrg
    },
    addTimeForDay(iDay, iValue) {
      this.dialogAddServices.selectedDay = iDay
      this.dialogAddServices.selectedValue = iValue
      this.dialogAddTimeForDay.open = true
    },
    addTimeForDayInMonth() {
      this.dialogInsertTimeInMonth.open = true,
      this.dialogInsertTimeInMonth.index = this.dialogAddDayInMonth.index
    },
    getDaysOfWeek() {
      const opt = {
        route: '/desktop/adm/getDaysOfWeek'
      }
      useFetch(opt).then((r) => {
        this.dialogAddServices.daysOfWeek = r.data
      })
    },
    confirmAddEventsWeek() {
      let allHaveTime = true
      this.dialogAddServices.selectedEventOption.days.forEach((d) => {
        if (d.value) {
          if (d.value.times && d.value.times.initial) {
            allHaveTime = true
          }
          if (!d.value.times || !d.value.times.initial) {
            allHaveTime = false
            this.$q.notify('Preencha os horários')
            return
          }
        }
      })
      if (allHaveTime) {
        if (!this.composition.congregations[this.dialogAddServices.iOrg].value) {
          this.composition.congregations[this.dialogAddServices.iOrg].value = [];
        }
        this.composition.congregations[this.dialogAddServices.iOrg].value.push(this.dialogAddServices.selectedEventOption);
        this.clearDialogAddServices()
      }
    },
    clearDialogAddServices() {
      this.dialogAddServices.open = false
      this.dialogAddServices.selectedEventOption = null
      this.dialogAddServices.selectedDay = null
      this.dialogAddServices.selectedValue = null
      this.dialogAddServices.iOrg = null
    },
    getEventsOptions() {
      const opt = {
        route: '/desktop/adm/getEventsOptions'
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente')
        } else {
          this.dialogAddServices.eventsOptions = r.data
        }
      })
    },
    resetDays() {
      this.dialogAddDayInMonth.count = 0
      if (this.dialogAddServices.selectedEventOption.model === 'week') {
        this.dialogAddServices.selectedEventOption.days.forEach((d) => {
          d.value = null
        })
      } else if (this.dialogAddServices.selectedEventOption.model === 'month') {
        this.dialogAddServices.selectedEventOption.weeks.forEach((w) => {
          w.value = []
        })
      }
    },
    removeDay(iOrg, iDay) {
      this.composition
      .congregations[iOrg]
      .value.splice(iDay, 1)
    },
    removeDayInDep(iDay) {
      this.composition
      .congregations[this.dialogDepartamentDetail.iOrg]
      .depts[this.dialogDepartamentDetail.iDep]
      .existingDepartaments[this.dialogDepartamentDetail.iExistsDept]
      .diaEHorario.splice(iDay, 1)
    },
    removeSecretary(iOrg, iSec) {
      this.composition.congregations[iOrg].secretary.splice(iSec, 1)
    },
    confirmAddSecretary() {
      if (!this.dialogAddSecretary.userSelected || !this.dialogAddSecretary.userSelected.userName || !this.dialogAddSecretary.initialHour || !this.dialogAddSecretary.finalHour ) {
        this.$q.notify('Preencha todos os campos para prosseguir')
        returns
      }
      if (!this.composition.congregations[this.dialogAddSecretary.iOrg].secretary) {
        this.composition.congregations[this.dialogAddSecretary.iOrg].secretary = []
      }
      let days = this.dialogAddSecretary.days.filter((day) => day.selected)
      this.composition.congregations[this.dialogAddSecretary.iOrg].secretary.push({
        action: 'add',
        user: {
          userName: this.dialogAddSecretary.userSelected.userName,
          userId: this.dialogAddSecretary.userSelected.userId
        },
        days,
        initialHour: this.dialogAddSecretary.initialHour,
        finalHour: this.dialogAddSecretary.finalHour,
        obs: this.dialogAddSecretary.obs
      })
      this.clearDialogAddSecretary()
    },
    clearDialogAddSecretary() {
      this.dialogAddSecretary = {
        open: false,
        userSelected: null,
        iOrg: null,
        initialHour: null,
        finalHour: null,
        days: [
          {label: 'Segunda-feira', selected: false},
          {label: 'Terça-feira', selected: false},
          {label: 'Quarta-feira', selected: false},
          {label: 'Quinta-feira', selected: false},
          {label: 'Sexta-feira', selected: false},
          {label: 'Sábado', selected: false},
          {label: 'Domingo', selected: false}
        ],
        obs: ''
      }
    },
    addSecretaryToParoquia(iOrg) {
      this.dialogAddSecretary.open = true
      this.dialogAddSecretary.iOrg = iOrg
    },
    clearDialogAddDayAndHourInDept() {
      this.dialogAddEventsDayAndHourInDep = {
        open: false,
        day: null,
        hour: null
      }
    },
    confirmAddEventsDayAndHourInDept() {
      if (!this.composition
      .congregations[this.dialogDepartamentDetail.iOrg]
      .depts[this.dialogDepartamentDetail.iDep]
      .existingDepartaments[this.dialogDepartamentDetail.iExistsDept]
      .diaEHorario) {
        this.composition
      .congregations[this.dialogDepartamentDetail.iOrg]
      .depts[this.dialogDepartamentDetail.iDep]
      .existingDepartaments[this.dialogDepartamentDetail.iExistsDept]
      .diaEHorario = []
      }
      
      this.composition
      .congregations[this.dialogDepartamentDetail.iOrg]
      .depts[this.dialogDepartamentDetail.iDep]
      .existingDepartaments[this.dialogDepartamentDetail.iExistsDept]
      .diaEHorario.push({
        day: this.dialogAddEventsDayAndHourInDep.day,
        hour: this.dialogAddEventsDayAndHourInDep.hour,
        action: 'add'
      })
      this.clearDialogAddDayAndHourInDept()
    },
    addDayAndHourInDept() {
      this.dialogAddEventsDayAndHourInDep.open = true
    }, 
    confirmAddEventsDayAndHour() {
      if (!this.composition.congregations[this.dialogAddEventsDayAndHour.iOrg].diaEHorario) {
        this.composition.congregations[this.dialogAddEventsDayAndHour.iOrg].diaEHorario = []
      }
      this.composition.congregations[this.dialogAddEventsDayAndHour.iOrg].diaEHorario.push({
        day: this.dialogAddEventsDayAndHour.day,
        hour: this.dialogAddEventsDayAndHour.hour,
        action: 'add'
      })
      this.clearDialogAddEventsDayAndHour()
    },
    clearDialogAddEventsDayAndHour() {
      this.dialogAddEventsDayAndHour = {
        open: false,
        day: null,
        hour: null
      }
    },
    addEventsDayAndHour(iOrg) {
      this.dialogAddEventsDayAndHour.open = true
      this.dialogAddEventsDayAndHour.iOrg = iOrg
    },
    clearDialogSelectDepartamentDetail() {
      this.dialogSelectDepartamentDetail = {
        open: false,
        departaments: null
      }
    },
    openSelectDepartamentDetail(iOrg, iDep) {
      this.dialogSelectDepartamentDetail.departaments = this.composition.congregations[iOrg].depts[iDep].existingDepartaments
      this.dialogSelectDepartamentDetail.open = true
      this.dialogDepartamentDetail.iOrg = iOrg
      this.dialogDepartamentDetail.iDep = iDep
    },
    activateCongregation(iOrg) {
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
      this.$q.loading.show()
      r = await useFetch(opt)
      this.$q.loading.hide()
      if (r.error) {
        this.$q.notify('Ocorreu um erro. Tente novamente')
        return
      }
      this.$router.back()
      this.getCompositionByUserId()
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
      let functions = []
      this.dialogAddNewDepartament.functions.forEach((func) => {
        functions.push({
          organismFunctionConfigId: func._id,
          functionName: func.functionName,
          functionUsers: func.functionUsers
        })
      })
      this.composition.congregations[this.dialogAddNewDepartament.iOrg].depts[this.dialogAddNewDepartament.iDep].existingDepartaments.push({
        departamentConfigId: this.composition.congregations[this.dialogAddNewDepartament.iOrg].depts[this.dialogAddNewDepartament.iDep].organismConfigId,
        departamentConfigName: this.composition.congregations[this.dialogAddNewDepartament.iOrg].depts[this.dialogAddNewDepartament.iDep].organismConfigName,
        departamentName: this.dialogAddNewDepartament.name,
        organismFunctions: functions,
        action: 'add'
      })
      this.composition.congregations[this.dialogAddNewDepartament.iOrg].depts[this.dialogAddNewDepartament.iDep].trueLength++
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
    getFunctionsByDepartamentId(id) {
      const opt = {
        route: '/desktop/statistics/getFunctionsByDepartamentId',
        body: {
          organismConfigId: id
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) return
        this.dialogAddNewDepartament.functions = r.data
      })
    },
    addUserFunctioninDept(iFunc) {
      this.dialogAddFunctionToDept.iFunc = iFunc
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
    deleteDepartament() {
      if (!this.composition.congregations[this.dialogDepartamentDetail.iOrg].depts[this.dialogDepartamentDetail.iDep].existingDepartaments[this.dialogDepartamentDetail.iExistsDept].action) {
        this.composition.congregations[this.dialogDepartamentDetail.iOrg].depts[this.dialogDepartamentDetail.iDep].existingDepartaments[this.dialogDepartamentDetail.iExistsDept].action = 'remove'
      } else {
        this.composition.congregations[this.dialogDepartamentDetail.iOrg].depts[this.dialogDepartamentDetail.iDep].existingDepartaments[this.dialogDepartamentDetail.iExistsDept].action = 'remove'
      }
      !this.composition.congregations[this.dialogDepartamentDetail.iOrg].depts[this.dialogDepartamentDetail.iDep].trueLength--
      this.clearDialogDepartaments()
    },
    openDepartamentDetail(iExistsDept) {
      this.dialogDepartamentDetail.data = this.composition.congregations[this.dialogDepartamentDetail.iOrg]
      .depts[this.dialogDepartamentDetail.iDep]
      .existingDepartaments[iExistsDept]
      this.dialogDepartamentDetail.iExistsDept = iExistsDept
      this.dialogDepartamentDetail.open = true
      this.clearDialogSelectDepartamentDetail()
    },
    addNewDepartament(iOrg, iDep) {
      let id = this.composition.congregations[iOrg].depts[iDep].organismConfigId
      this.getFunctionsByDepartamentId(id)
      this.dialogAddNewDepartament.iOrg = iOrg
      this.dialogAddNewDepartament.iDep = iDep
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
      
      let departaments = [] 
      
      this.composition.congregations[0].depts.forEach((dep, iDep)  => {
        departaments.push(dep)
        departaments[iDep].existingDepartaments = []
      })

      this.composition.congregations.push({
        organismChildConfig: 'Congregação',
        organismConfigId: '6525360fd7cd5c09a8d759be',
        organismChildName: this.dialogAddCongregation.data.name,
        organismFunctions: this.dialogAddCongregation.functions,
        depts: departaments,
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
      congregations[this.dialogDepartamentDetail.iOrg].
      depts[this.dialogDepartamentDetail.iDep].
      existingDepartaments[this.dialogDepartamentDetail.iExistsDept].
      organismFunctions[this.dialogAddFunctionToDept.iFunc].
      functionUsers.push({
        userName: this.dialogAddFunctionToDept.userSelected.userName,
        _id: this.dialogAddFunctionToDept.userSelected.userIdString,
        action: 'add'
      })
      this.clearDialogAddUserToFunctionInDept()
    },
    removeUserFromFunctionDept(iFunc, iUser) {
      if (!this.composition.congregations[this.dialogDepartamentDetail.iOrg].depts[this.dialogDepartamentDetail.iDep].existingDepartaments[this.dialogDepartamentDetail.iExistsDept].organismFunctions[iFunc].functionUsers[iUser].action) {
        this.composition.congregations[this.dialogDepartamentDetail.iOrg].depts[this.dialogDepartamentDetail.iDep].existingDepartaments[this.dialogDepartamentDetail.iExistsDept].organismFunctions[iFunc].functionUsers[iUser].action =  'remove'
      } else {
        this.composition.congregations[this.dialogDepartamentDetail.iOrg].depts[this.dialogDepartamentDetail.iDep].existingDepartaments[this.dialogDepartamentDetail.iExistsDept].organismFunctions[iFunc].functionUsers[iUser].action = 'remove'
      }
    },
    saveDraft() {
      const opt = {
        route: '/desktop/statistics/saveCompositionDraft',
        body: this.composition
      }
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) return
        this.$q.notify('Rascunho salvo com sucesso')
        this.getCompositionByUserId()
        this.$router.back()
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
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) return 

        if (!r.data._id) {
          for (let i = 0; i < r.data.congregations.length; i++) {
            for (let j = 0; j < r.data.congregations[i].depts.length; j++) {
              for (let k = 0; k < r.data.congregations[i].depts[j].existingDepartaments.length; k++) {
                if (r.data.congregations[i].depts[j].existingDepartaments[k].organismParentId !== r.data.congregations[i].organismChildId) {
                  r.data.congregations[i].depts[j].existingDepartaments[k].action = 'naoExiste'
                }
              }
            }
          }
        }
        this.composition = r.data
        if (r.data.validated) {
          this.validated = r.data.validated
        }
        if (r.data.status) {
          this.status = r.data.status
        }
        let depConfigList = []
        this.composition.congregations[0].depts.forEach((dep) => {
          depConfigList.push({
            organismConfigName: dep.organismConfigName,
            organismConfigId: dep.organismConfigId
          })
        })
        this.composition.congregations.forEach((org)=> {
          org.organismFunctions.forEach((func) => {
            if (func.functionName === 'Pastor' && func.functionUsers.length > 0) {
              func.functionUsers.forEach((pastor) => {
                const exists = this.pastorsList.some(existPastor => existPastor.userName === pastor.userName);
                if (!exists) {
                  this.pastorsList.push(pastor);
                }
              });
            }
          });
        });
        this.composition.congregations.forEach((org) => {
          
          if (org.depts) {
            org.depts.forEach((dep) => {
              if (dep.existingDepartaments.length > 0) {
                dep.existingDepartaments.forEach((ed, iEd) => {
                  if (ed.action && ed.action === 'naoExiste') {
                    dep.existingDepartaments.splice(iEd, 1)
                  }
                })
              }
              let trueLength = dep.existingDepartaments.length
              dep.trueLength = trueLength
            })
          }
        })
        this.deptConfigs = depConfigList
      })
    },
    clkCheckboxDate(org){
      if(org.foundationDate || org.foundationDate === null ){
        org.foundationDate= '00/00/0000'
        this.semFoundation = false
      }
    }
  }
})
</script>
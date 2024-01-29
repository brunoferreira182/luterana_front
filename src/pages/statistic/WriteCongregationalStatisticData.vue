<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs align="center">
          <q-breadcrumbs-el 
            style="cursor: pointer;" 
            icon="home" 
            label="Introdução" 
            @click="$router.push('/statistic/introWriteStatisticData')"          />
            
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
                      v-if="!status || (status && status.value !== 'sent')"
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
                              v-if="!status || (status && status.value !== 'sent')"
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
                      </q-item>
                    </div>
                  </q-list>
                  <div class="text-left q-ma-md text-h6">
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
                  </div>
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
                    :readonly="status && status.value === 'sent'"
                    label="Filiado?"
                    :options="filiatedOptions"
                    class="q-pa-sm"
                  />
                  <q-input
                    :readonly="status && status.value === 'sent'"
                    label="Data de fundação"
                    class="q-pa-sm"
                    mask="##/##/####"
                    v-model="org.foundationDate"
                  />
                  <div class="text-h6 q-my-sm q-ml-sm">
                    Quando ocorre o evento:
                  </div>
                  <q-list
                  bordered
                    v-for="day in composition.congregations[iOrg].diaEHorario"
                    :key="day"
                  >
                  <q-item
                  
                  >
                    <q-item-section>
                      <q-item-label lines="1">
                        Dia: {{ day.day }}
                      </q-item-label>
                      <q-item-label>
                        Horário: {{ day.hour }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  </q-list>
                  <q-btn
                    label="Adicionar dia e horário do evento"
                    color="primary"
                    unelevated
                    rounded
                    class="q-pa-sm q-my-md"
                    @click="addEventsDayAndHour(iOrg)"
                  />
                </q-expansion-item>
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
          Estes dados já foram preenchidos e estão disponíveis somente para consulta
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
          <q-card-section>
            <div class="text-center text-h6 q-my-sm">
              Nome ao departamento
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

              </q-expansion-item>
            </q-list>
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
        v-model="dialogAddEventsDayAndHour.open"
        @hide="clearDialogAddEventsDayAndHour"
      >
        <q-card
          style="width:400px"
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
        name: null,
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
      daysOfWeek: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo']
    }
  }, 
  beforeMount() {
    this.getCompositionByUserId()
  },
  methods: {
    confirmAddEventsDayAndHour() {
      this.composition.congregations[this.dialogAddEventsDayAndHour.iOrg].diaEHorario.push({
        day: this.dialogAddEventsDayAndHour.day,
        hour: this.dialogAddEventsDayAndHour.hour
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
      r = await useFetch(opt)
      if (r.error) {
        this.$q.notify('Ocorreu um erro. Tente novamente')
        return
      }
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
      this.composition.congregations[this.dialogAddNewDepartament.iOrg].depts.forEach((departament, iDep) => {
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
            departamentConfigName: this.dialogAddNewDepartament.departamentSelected.organismConfigName,
            departamentName: this.dialogAddNewDepartament.name,
            organismFunctions: functions,
            action: 'add'
          })
          this.composition.congregations[this.dialogAddNewDepartament.iOrg].depts[iDep].trueLength++
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
      opt.body.status = 'notSent'
      useFetch(opt).then((r) => {
        if (r.error) return
        this.$q.notify('Rascunho salvo com sucesso')
        this.getCompositionByUserId()
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
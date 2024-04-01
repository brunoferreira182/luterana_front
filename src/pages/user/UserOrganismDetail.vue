<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <q-btn
          v-if="!isMobile" 
          icon="arrow_back_ios"
          flat
          class="q-px-sm"
          dense
          @click="$router.back()"
        >
          <q-tooltip>
            Voltar
          </q-tooltip>
        </q-btn>
        <div class="col-6">
          <div class="text-caption text-capitalize">
            {{ organismConfigName }}
          </div>
          <div :class="`${isMobile ? 'text-h6 text-bold' : 'text-h5'}`" >
            {{ organismName }}
          </div>
          <div class="col-6" v-if="idLegado">
            <q-badge>{{ idLegado }}</q-badge>
          </div>          
        </div>
        <div class="col text-right q-gutter-sm self-center" v-if="!$route.query.isChild && !isMobile">
          <q-btn
            rounded
            no-caps
            unelevated
            icon="person"
            color="secondary"
            label="Dados"
            @click="visionSelected = 'data'"
            :outline="visionSelected === 'data' ? false : true"
          />
          <q-btn
            rounded
            no-caps
            unelevated
            icon="school"
            color="secondary"
            label="Grupos"
            @click="visionSelected = 'groups'"
            :outline="visionSelected === 'groups' ? false : true"
          />
          <q-btn
            v-if="canEdit"
            label="Salvar dados"
            color="primary"
            unelevated
            rounded
            no-caps
            @click="updateOrganism"
          />
        </div>
        <div class="row text-right q-gutter-sm q-mt-sm " v-if="!$route.query.isChild && isMobile">
          <q-btn
            rounded
            no-caps
            unelevated
            icon="person"
            color="secondary"
            label="Dados"
            @click="visionSelected = 'data'"
            :outline="visionSelected === 'data' ? false : true"
          />
          <q-btn
            rounded
            no-caps
            unelevated
            icon="school"
            color="secondary"
            label="Grupos"
            @click="visionSelected = 'groups'"
            :outline="visionSelected === 'groups' ? false : true"
          />
        </div>
      </div>
      <q-separator class="q-mx-md" v-if="!isMobile"/>
      <div v-show="visionSelected === 'data'">
        <div class="row justify-around q-pa-md" v-if="!isMobile">
          <div class="col-7 q-gutter-md q-mt-sm" align="start" >
            <div v-if="existsPastor  && organismConfigName === 'Congregação'">
              <div class="text-h5 no-margin q-px-md" >Pastores:</div>
              <div v-for="(func,funcIndex) in functions" :key="func">
                <CardPastor
                  class="no-margin"
                  v-if="func.functionName === 'Pastor'"
                  :func="func"
                  :funcIndex="funcIndex"
                  @clkOpenDialogSolicitation="clkOpenDialogSolicitation"
                  :showAddUserButton="false"
                  :showInviteUserButton="func.functionName === 'Pastor' ? false : true && this.$route.query.e === 'f' ? false : true"
                />
              </div>
              <q-separator class="q-my-md"/>
            </div>
            <div class="text-h5">
              Vinculado a:
            </div>
            <q-list class="text-h6" v-if="parent && parent.length > 0">
              <q-item 
                v-for="(user, iuser) in parent"
                :key="user"
                class="bg-grey-3 q-ma-sm" 
                style="border-radius: 1rem"
                clickable
                @click="clkShowDialogParentDetail(user, iuser)"
              >
                <q-item-section >
                  <div class="row">
                    {{ user.parentName}} - {{ user.organismConfigName }}
                  </div>
                </q-item-section>
                
              </q-item>
            </q-list>
            <q-list v-else class="text-h6">
              <q-item class="bg-grey-3 q-ma-sm" style="border-radius: 1rem">
                Nenhum vínculo criado
              </q-item>
            </q-list>
            <div  v-if="organismConfigName === 'Paróquia'">
              <div  class="text-h5">Pastor em paróquia:</div>
              <div v-for="(func, funcIndex) in functions" :key="func">
                <cardPastor
                  class="no-margin"
                  v-if="func.functionName === 'Pastor em Paróquia'"
                  :func="func"
                  :funcIndex="funcIndex"
                  @deleteUserFromFunction="dialogOpenDeleteUserFromFunction"
                  :showAddUserButton="false"
                  :canEditPastor="$route.path.includes('/admin') ? true : false"
                  :showInviteUserButton="func.functionName === 'Pastor' ? false : true && this.$route.query.e === 'f' ? false : true"
                />
              </div>
              <q-separator class="q-ma-sm"/>
            </div>
            <div
              v-for="func in functions"
              :key="func"
              class="q-mb-md"
            >
            
              <div
                v-if="func.functionName === 'Secretária Contratada'"
              > 
                <div class="text-h6">
                  Secretária
                  <q-btn
                    color="primary"
                    flat
                    rounded
                    unelevated
                    label="Secretária"
                    icon="add"
                    @click="linkSecretaryToFunction()"
                  />
                </div>
                <q-item
                  style="border-radius: 1rem;"
                  class="bg-grey-2"
                  v-for="user in func.users"
                  :key="user"
                >
                  <q-item-section>
                    {{ user.userName }}
                  </q-item-section>
                  <q-item-section side>
                    <q-btn
                      icon="delete"
                      dense
                      flat
                      color="red"
                      rounded
                      @click.stop="dialogOpenDeleteUserFromFunction(user)"
                    >
                      <q-tooltip>Remover secretária</q-tooltip>
                    </q-btn>
                  </q-item-section>
                </q-item>
              </div>
            </div>
            <div class="text-h5 no-margin q-px-md">
              Dados:
            </div>
            <!-- <q-chip>{{ organismConfigName }}</q-chip> -->
            <div v-if="fields.length" class="text-h5">
              Dados
            </div>
            <div v-for="(field, fieldIndex) in organismData.fields" :key="fieldIndex">
              <div v-if="
                field.type.type === 'string'
                || field.type.type === 'int'
                || field.type.type === 'date'
                || field.type.type === 'cpf'
                || field.type.type === 'cnpj'
                || field.type.type === 'money'
                || field.type.type === 'textarea'
                "
              >
                <q-input
                  :label="field.model === 'chave_ata' || field.model === 'filiada'? 'Estamos importando estes dados...' : field.label"
                  :hint="field.hint"
                  :mask="field.type.mask"
                  v-model="field.value"
                  outlined
                  :readonly="field.onlyAdm"
                >
                </q-input>
              </div>
              <q-file
                v-if="field.type.type === 'image'"
                v-model="files"
                @rejected="onRejected"
                :filter="checkFileType"
                label="Clique aqui para adicionar imagem de perfil"
                outlined
                @input="saveProfilePhoto()"
                :readonly="field.onlyAdm"
              >
                <template #append>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
              <div class="text-right" v-if="field.type.type === 'options'">
                <q-select
                  outlined
                  :label="field.model === 'chave_ata' || field.model === 'filiada'? 'Estamos importando estes dados...' : field.label"
                  option-label="optionName"
                  emit-value
                  map-options
                  :hint="field.hint"
                  v-model="field.value"
                  :options="field.options"
                  :readonly="field.onlyAdm"
                >
                </q-select>
              </div>
              <div v-if="field.type.type === 'attach'">
                <q-item class="bg-grey-3" style="border-radius: 1rem">
                  <q-item-section>
                    <q-item-label class="text-h5">
                      {{ field.label }}
                    </q-item-label>
                    <q-item-label class="text-subtitle1">
                      {{ field.hint }}
                    </q-item-label>
                    <q-item-label>
                      <q-file
                        class="bg-white"
                        v-model="field.value"
                        label="Escolha um ou mais arquivos"
                        outlined
                        use-chips
                        multiple
                        :readonly="field.onlyAdm"
                      >
                        <template v-slot:prepend>
                          <q-icon name="attach_file" />
                        </template>
                      </q-file>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>
              <q-checkbox
                v-if="field.type.type === 'boolean'"
                class="q-pt-lg"
                :label="field.label"
                :hint="field.hint"
                v-model="field.value"
                :readonly="field.onlyAdm"
              />
              <div v-if="field.type.type === 'multiple_select'">
                <div class="text-h5 q-pa-sm bg-grey-3" style="border-radius: 1rem">
                  <div class="q-pl-md q-py-sm">{{ field.label }}:</div>
                  <div class="q-pa-sm">
                    <q-btn
                      v-if="field.multiple || (!field.value || field.value.length === 0)"
                      icon="add"
                      color="primary"
                      outline
                      rounded
                      @click="addDoubleSelection(fieldIndex)"
                      no-caps
                      :disable="field.onlyAdm"
                    >
                      Adicionar nova seleção dupla
                    </q-btn>
                  </div>
                  <div>
                    <div v-if="field.value">
                      <div
                        v-for="(value, valueIndex) in field.value"
                        :key="valueIndex"
                        class="row wrap justify-left q-pa-sm items-left content-center"
                      >
                        <q-select 
                          v-for="(select, selectIndex) in field.selects"
                          :key="'internalSelect' + selectIndex"
                          :label="select.label"
                          option-label="options"
                          emit-value
                          map-options
                          v-model="organismData.fields[fieldIndex].value[valueIndex][selectIndex]"
                          :options="select.options"
                          class="col-5"
                        />
                        <q-btn
                          icon="delete"
                          class="q-ml-lg"
                          rounded
                          flat
                          color="red"
                          @click="organismData.fields[fieldIndex].value.splice(valueIndex, 1)" 
                          />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="field.type.type === 'organism'">
                <div v-if="field.value && field.value.length > 0">
                  <!-- <div class="text-body">{{ field.label }}</div> -->
                  <q-btn
                    :label="`Adicionar ${field.label}`"
                    no-caps
                    rounded
                    flat
                    color="primary"
                    icon="add"
                    v-if="field.multiple || !field.value || field.value ==='' || field.value.length === 0"
                    @click="clkOpenAddOrganismDialog(fieldIndex)"
                    :disable="field.onlyAdm"
                  />
                  <CardOrganism
                    :data="field"
                    :fieldIndex="fieldIndex"
                    @remove="removeThisOrganism"
                  />
                </div>
              </div>
              <div v-if="field.type.type === 'address'">
                <q-btn
                  label="Endereço"
                  no-caps
                  rounded
                  unelevated
                  flat
                  color="primary"
                  icon="add"
                  @click="clkOpenAddressDialog(fieldIndex)"
                  class="q-mt-xs"
                  :disable="field.onlyAdm"
                />
                <CardAddress
                  :data="field.value"
                  :fieldIndex="fieldIndex"
                  @edit="editThisAddress"
                  @remove="removeThisAddress"
                />
              </div>
              <div v-if="field.type.type === 'person'">
                <div v-if="field.value && field.value.length > 0">
                  <div class="text-body">{{ field.label }}</div>
                  <CardPerson
                    :data="field"
                    :fieldIndex="fieldIndex"
                    :canEditPerson="$route.path.includes('/admin') ? true : false"
                    @remove="removeThisPerson"
                  />
                </div>
                <q-btn
                  :label="`Adicionar ${field.label}`"
                  no-caps
                  rounded
                  flat
                  color="primary"
                  icon="add"
                  v-if="field.multiple || !field.value || field.value ==='' || field.value.length === 0"
                  @click="clkOpenAddPersonDialog(fieldIndex)"
                  :disable="field.onlyAdm"
                />
              </div>
              <div v-if="field.type.type === 'maritalStatus'">
                <div v-if="field.value && field.value.length > 0">
                  <div class="text-body">{{ field.label }}</div>
                  <CardMaritalStatus
                    :data="field"
                    :fieldIndex="fieldIndex"
                    @remove="removeThisPerson"
                  />
                </div>
                <q-btn
                  :label="`Modificar ${field.label}`"
                  no-caps
                  rounded
                  flat
                  color="primary"
                  icon="add"
                  v-if="field.multiple || !field.value || field.value ==='' || field.value.length === 0"
                  @click="clkAddMaritalStatus(fieldIndex)"
                  :disable="field.onlyAdm"
                />
              </div>
              <div v-if="field.type.type === 'bank_data'">
                <q-btn
                  label="Adicionar dados bancários"
                  no-caps
                  rounded
                  flat
                  color="primary"
                  @click="clkAddBankData(fieldIndex)"
                  icon="add"
                  :disable="field.onlyAdm"
                />
                <CardBankData
                  :data="field"
                  :fieldIndex="fieldIndex"
                  @edit="editBankData"
                  @remove="removeBankData"
                />
              </div>
              <div v-if="
                field.type.type === 'email'
                || field.type.type === 'phone'
                || field.type.type === 'mobile'
                "
              >
                <q-btn
                  :label="`${field.type.label}`"
                  no-caps
                  flat
                  v-if="field.multiple || (!field.multiple && (!field.value || field.value.length === 0))"
                  icon="add"
                  color="primary"
                  rounded
                  @click="addPhoneMobileEmail(fieldIndex, tabsIndex, field)"
                  class="q-mt-xs"
                  :disable="field.onlyAdm"
                />
                <CardPhoneMobileEmail
                  :data="field.value"
                  :fieldIndex="fieldIndex"
                  @edit="editPhoneMobileEmail"
                  @remove="removePhoneMobileEmail"
                  :showHeader="field.value && field.value.length > 0 ? field.label : false"
                />
              </div>
              <div v-if="field.type.type === 'services'">
                <CardServices
                  v-if="field.value"
                  :data="field.value"
                  :fieldIndex="fieldIndex"
                  :user="`true`"
                  @edit="editServicesData"
                  @remove="removeServicesData"
                />
              </div>
              <div v-if="field.type.type === 'secretary'">
                <CardSecretary
                  v-if="field.value"
                  :data="field.value"
                  :user="`true`"
                  :fieldIndex="fieldIndex"
                  @remove="removeSecretary"
                />
              </div>
            </div>
            
            
            
            <q-dialog v-model="dialogInsertUserInFunction.open" @hide="clearDialogAndFunctions">
              <q-card style="border-radius: 1rem; width: 480px">
                <q-card-section align="center">
                  <div class="text-h6">
                    Informe o usuário que ocupará a função
                  </div>
                </q-card-section>
                <q-card-section class="q-gutter-md">
                  <q-select
                    v-model="dialogInsertUserInFunction.userSelected"
                    filled
                    use-input
                    label="Nome do usuário"
                    option-label="userName"
                    :options="usersOptions"
                    hint="Usuário que ocupará a função"
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
                  <q-input
                    filled
                    label="Data do chamado"
                    type="date"
                    hint="Informe a data início de ocupação da função"
                    v-model="dialogInsertUserInFunction.initialDate"
                  />
                </q-card-section>
                <q-card-actions align="center">
                  <q-btn
                    flat
                    label="Depois"
                    no-caps
                    rounded
                    color="primary"
                    @click="dialogInsertUserInFunction.open = false"
                  />
                  <q-btn
                    unelevated
                    rounded
                    label="Confirmar"
                    no-caps
                    color="primary"
                    @click="addUserToFunction"
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
            <div class="q-ma-lg justify-start" v-if="child && child.length > 0">
              <div class="q-gutter-md">
                <div class="text-h5 col"> Vínculos</div>
                <div class="text-caption text-h6" >
                  Organismos vínculados:
                </div>
                <q-list>
                  <q-item
                    clickable
                    v-for="(user) in child"
                    :key="user"
                    style="border-radius: 1rem;"
                    class="bg-blue-grey-2 q-my-sm q-col-gutteter-md"
                    @click="clkOpenDialogOrganismDetail(user)"
                  >
                    <q-item-section>
                      <q-item-label> {{ user.childName }}</q-item-label>
                      <q-item-label class="text-subtitle1">{{ user.organismConfigName }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
    
            </div>
            <div class="text-center">
              <q-btn
                v-if="canEdit"
                label="Salvar dados"
                color="primary"
                unelevated
                no-caps
                rounded
                class="q-mt-md"
                @click="updateOrganism"
              />
            </div>
            <div class="text-center">
              <q-btn
                v-if="!this.$route.query.e === 'f'"
                label="Salvar dados"
                color="primary"
                no-caps
                rounded
                unelevated
                class="q-mt-md"
                @click="updateOrganism"
              />
            </div>
            <!-- <div class="text-right">
                <q-btn
                  v-if="!this.$route.query.e === 'f'"
                  label="Salvar dados"
                  color="primary"
                  unelevated
                  class="q-mt-md"
                  @click="updateOrganism"
                />
              </div> -->
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
                v-if="func.functionName !== 'Pastor' && func.functionName !== 'Pastor em Paróquia' && func.functionName !== 'Secretária Contratada'"
                :func="func"
                :funcIndex="funcIndex"
                @clkOpenDialogSolicitation="clkOpenDialogSolicitation"
                :showAddUserButton="false"
                :showInviteUserButton="canEdit"
                :isPastor="func.functionName === 'Pastor' ? false : true"
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
                          <q-item-section>
                            <q-btn
                              icon="person_add"
                              dense
                              flat
                              no-caps
                              label="Novo usuário"
                              color="primary"
                              class="q-pa-sm"
                              @click="openDialogAddUser(dialogOpenSolicitation.data.functionName)"
                            />
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
                      <!-- <div class="q-gutter-sm " style="display:flex;">
                        <q-item-label header v-if="canBeDead && canBeDead!==false">Pesquisar entre os falecidos.</q-item-label>
                        <q-item-label header v-else>Não pesquisar entre os falecidos.</q-item-label>
                        <q-toggle v-model="canBeDead"> </q-toggle>
                      </div> -->
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
            <q-separator class="q-mt-lg" v-if="organismConfigName === 'Distrito'"/>
              <div class="q-mt-sm text-left" v-if="organismConfigName === 'Distrito'">
                <div class="row">
                  <div class="text-h6">Coordenação/Representação</div>
                  <div v-for="(func, funcIndex) in functions" :key="funcIndex">
                    <CardFunction
                      v-if="func.group === 'coordination'"   
                      :func="func"
                      :funcIndex="funcIndex"
                      @insertObservation="dialogInsertObservation"
                      @deleteUserFromFunction="dialogOpenDeleteUserFromFunction"
                      @linkUserToFunction="linkUserToFunction"
                      :showAddUserButton="true"
                      :showInviteUserButton="false"
                      :isPastor="func.functionName === 'Pastor' ? false : true"
                    />
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>

      <div v-show="visionSelected === 'groups'">
        <div class="q-ma-lg row justify-start" v-if="childOrganismsData">
          <div class="q-gutter-md">
            <div class="text-h5 col"> Grupos</div>
            <q-btn 
              no-caps
              outline
              icon="add"
              rounded
              @click="dialogInsertNewOrganismGroup.open = true"
              label="Adicionar grupo"
              color="primary"
              v-if="canEdit"
            />
            
            <div class="text-caption text-subtitle1" v-if="childOrganismsData.length">
              Clique em um dos organismos abaixo para exibir detalhes
            </div>
            <q-list v-if="childOrganismsData.length">
              <q-item
                clickable
                style="border-radius: 1rem;"
                v-for="child in childOrganismsData"
                :key="child"
                class="bg-green-3 q-my-sm"
                @click="clkOpenChildOrganismDetail(child)"
              >
                <q-item-section >
                  <q-item-label> {{ child.organismName }}</q-item-label>
                  <q-item-label caption> {{ child.organismConfigName }}</q-item-label>
                  <q-item-label caption lines="2">Criado em {{ child.createdAt }}</q-item-label>
                </q-item-section>
                <!-- <q-item-section side top>
                  <q-btn
                    v-if="child.organismConfigName.toLowerCase() === 'ponto de missão'"
                    icon="delete"
                    flat
                    color="red-8"
                    dense
                    rounded
                    @click="clkOpenDialogDeleteMissionPoint(child)"
                  >
                    <q-tooltip>
                      Remover ponto de missão
                    </q-tooltip>
                  </q-btn>
                </q-item-section> -->
              </q-item>
            </q-list>
            <div v-else class="text-subtitle1">
              Nenhum grupo de organismo criado <q-icon name="warning" color="warning" size="md"/>
            </div>
            <q-dialog v-model="dialogDeleteMissionPoint.open">
              <q-card style="border-radius: 1rem">
                <q-card-section class="text-subtitle1 text-center">
                  Informe para onde serão transferidos os X membros do ponto de missão 
                  <div class="text-bold">{{ dialogDeleteMissionPoint.data.organismName }}?</div> 
                  <q-select
                    v-model="userSelected"
                    filled
                    clearable
                    use-input
                    label="Selecione a congregação"
                    option-label="userName"
                    :options="usersOptions.list"
                    @filter="getUsers"
                    :option-value="(item) => item._id"
                    hint="Digite o nome da congregação para qual irá transferir estes usuários"
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
              </q-card>
            </q-dialog>
          </div>
        </div>
      </div>

      <div v-if="isMobile" class="q-gutter-md">
        <div v-if="organismConfigName === 'Congregação'">
          <div class="text-h6 q-ml-md">
            Vinculado a:
          </div>
          <q-list class="text-h6" v-if="parentData">
            <q-item 
              class="bg-grey-3 q-ma-sm" 
              style="border-radius: 1rem"
              clickable
              @click="clkShowDialogParentDetail()"
            >
              <q-item-section >
                <div class="row">
                  {{ parentData.parentName}} - {{ parentData.parentOrganismConfigName }}
                </div>
              </q-item-section>
              
            </q-item>
          </q-list>
          <q-list v-else class="text-h6">
            <q-item class="bg-grey-3 q-ma-sm" style="border-radius: 1rem">
              Nenhum vínculo criado
            </q-item>
          </q-list>
        </div>
        <q-list bordered v-show="visionSelected === 'data'">
          <q-expansion-item
            group="somegroup"
            class="bg-grey-3"
            header-class="text-primary"
            label="Dados"
          >
            <div class="bg-white q-pa-md">
              <!-- <q-chip>{{ organismConfigName }}</q-chip> -->
              <div
                v-for="(field, fieldIndex) in organismData.fields"
                :key="fieldIndex"
                class="q-py-xs"
              >
                <div v-if="
                  field.type.type === 'string'
                  || field.type.type === 'int'
                  || field.type.type === 'date'
                  || field.type.type === 'cpf'
                  || field.type.type === 'cnpj'
                  || field.type.type === 'money'
                  || field.type.type === 'textarea'
                  "
                >
                  <q-input
                    :label="field.model === 'filiada' || field.model === 'chave_ata' ? 'Estamos importando estes dados' : field.label"
                    :hint="field.hint"
                    :mask="field.type.mask"
                    v-model="field.value"
                    outlined
                    :readonly="field.onlyAdm"
                  >
                  </q-input>
                </div>
                <q-file
                  v-if="field.type.type === 'image'"
                  v-model="files"
                  @rejected="onRejected"
                  :filter="checkFileType"
                  label="Clique aqui para adicionar imagem de perfil"
                  outlined
                  @input="saveProfilePhoto()"
                  :readonly="field.onlyAdm"
                >
                  <template #append>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
                <div class="text-right" v-if="field.type.type === 'options'">
                  <q-select
                    outlined
                    :label="field.model === 'filiada' || field.model === 'chave_ata' ? 'Estamos importando estes dados' : field.label"
                    option-label="optionName"
                    emit-value
                    map-options
                    :hint="field.hint"
                    v-model="field.value"
                    :options="field.options"
                    :readonly="field.onlyAdm"
                  >
                  </q-select>
                </div>
                <div v-if="field.type.type === 'attach'">
                  <q-item class="bg-grey-3" style="border-radius: 1rem">
                    <q-item-section>
                      <q-item-label class="text-h5">
                        {{ field.label }}
                      </q-item-label>
                      <q-item-label class="text-subtitle1">
                        {{ field.hint }}
                      </q-item-label>
                      <q-item-label>
                        <q-file
                          class="bg-white"
                          v-model="field.value"
                          label="Escolha um ou mais arquivos"
                          outlined
                          use-chips
                          multiple
                          :readonly="field.onlyAdm"
                        >
                          <template v-slot:prepend>
                            <q-icon name="attach_file" />
                          </template>
                        </q-file>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <q-checkbox
                  v-if="field.type.type === 'boolean'"
                  class="q-pt-lg"
                  :label="field.label"
                  :hint="field.hint"
                  v-model="field.value"
                  :readonly="field.onlyAdm"
                />
                <div v-if="field.type.type === 'multiple_select'">
                  <div class="text-h5 q-pa-sm bg-grey-3" style="border-radius: 1rem">
                    <div class="q-pl-md q-py-sm">{{ field.label }}:</div>
                    <div class="q-pa-sm">
                      <q-btn
                        v-if="field.multiple || (!field.value || field.value.length === 0)"
                        icon="add"
                        color="primary"
                        outline
                        rounded
                        @click="addDoubleSelection(fieldIndex)"
                        no-caps
                        :disable="field.onlyAdm"
                      >
                        Adicionar nova seleção dupla
                      </q-btn>
                    </div>
                    <div>
                      <div v-if="field.value">
                        <div
                          v-for="(value, valueIndex) in field.value"
                          :key="valueIndex"
                          class="row wrap justify-left q-pa-sm items-left content-center"
                        >
                          <q-select 
                            v-for="(select, selectIndex) in field.selects"
                            :key="'internalSelect' + selectIndex"
                            :label="select.label"
                            option-label="options"
                            emit-value
                            map-options
                            v-model="organismData.fields[fieldIndex].value[valueIndex][selectIndex]"
                            :options="select.options"
                            class="col-5"
                          />
                          <q-btn
                            icon="delete"
                            class="q-ml-lg"
                            rounded
                            flat
                            color="red"
                            @click="organismData.fields[fieldIndex].value.splice(valueIndex, 1)" 
                            />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="field.type.type === 'organism'">
                  <div v-if="field.value && field.value.length > 0">
                    <!-- <div class="text-body">{{ field.label }}</div> -->
                    <q-btn
                      :label="`Adicionar ${field.label}`"
                      no-caps
                      rounded
                      flat
                      color="primary"
                      icon="add"
                      v-if="field.multiple || !field.value || field.value ==='' || field.value.length === 0"
                      @click="clkOpenAddOrganismDialog(fieldIndex)"
                      :disable="field.onlyAdm"
                    />
                    <CardOrganism
                      :data="field"
                      :fieldIndex="fieldIndex"
                      @remove="removeThisOrganism"
                    />
                  </div>
                </div>
                <div v-if="field.type.type === 'address'">
                  <q-btn
                    label="Endereço"
                    no-caps
                    rounded
                    unelevated
                    flat
                    color="primary"
                    icon="add"
                    @click="clkOpenAddressDialog(fieldIndex)"
                    class="q-mt-xs"
                    :disable="field.onlyAdm"
                  />
                  <CardAddress
                    :data="field.value"
                    :fieldIndex="fieldIndex"
                    @edit="editThisAddress"
                    @remove="removeThisAddress"
                  />
                </div>
                <div v-if="field.type.type === 'person'">
                  <div v-if="field.value && field.value.length > 0">
                    <div class="text-body">{{ field.label }}</div>
                    <CardPerson
                      :data="field"
                      :canEdit="$route.path.includes('/admin') ? true : false"
                      :fieldIndex="fieldIndex"
                      @remove="removeThisPerson"
                    />
                  </div>
                  <q-btn
                    :label="`Adicionar ${field.label}`"
                    no-caps
                    rounded
                    flat
                    color="primary"
                    icon="add"
                    v-if="field.multiple || !field.value || field.value ==='' || field.value.length === 0"
                    @click="clkOpenAddPersonDialog(fieldIndex)"
                    :disable="field.onlyAdm"
                  />
                </div>

                <div v-if="field.type.type === 'bank_data'">
                  <q-btn
                    label="Adicionar dados bancários"
                    no-caps
                    rounded
                    flat
                    color="primary"
                    @click="clkAddBankData(fieldIndex)"
                    icon="add"
                    :disable="field.onlyAdm"
                  />
                  <CardBankData
                    :data="field"
                    :fieldIndex="fieldIndex"
                    @edit="editBankData"
                    @remove="removeBankData"
                  />
                </div>
                <div v-if="
                  field.type.type === 'email'
                  || field.type.type === 'phone'
                  || field.type.type === 'mobile'
                  "
                >
                  <q-btn
                    :label="`${field.label}`"
                    no-caps
                    flat
                    v-if="field.multiple || (!field.multiple && (!field.value || field.value.length === 0))"
                    icon="add"
                    color="primary"
                    rounded
                    @click="addPhoneMobileEmail(fieldIndex, tabsIndex, field)"
                    class="q-mt-xs"
                    :disable="field.onlyAdm"
                  />
                  <CardPhoneMobileEmail
                    :data="field.value"
                    :fieldIndex="fieldIndex"
                    @edit="editPhoneMobileEmail"
                    @remove="removePhoneMobileEmail"
                    :showHeader="field.value && field.value.length > 0 ? field.label : false"
                  />
                </div>
                <div v-if="field.type.type === 'services'">
                <CardServices
                  v-if="field.value"
                  :data="field.value"
                  :fieldIndex="fieldIndex"
                  :user="`true`"
                  @edit="editServicesData"
                  @remove="removeServicesData"
                />
              </div>
              <!-- <div v-if="field.type.type === 'secretary'">
                <CardSecretary
                  v-if="field.value"
                  :data="field.value"
                  :user="`true`"
                  :fieldIndex="fieldIndex"
                  @remove="removeSecretary"
                />
              </div> -->
              </div>
              <div class="q-px-sm justify-start" v-if="childOrganismsData">
                <div class="q-gutter-md">
                  <div class="text-h4 col"> Vínculos</div>
                  <div class="text-h6 " >
                    Organismos vínculados:
                  </div>
                  <q-list v-if="relations && relations.length">
                    <q-item
                      clickable
                      v-for="link in relations"
                      :key="link"
                      style="border-radius: 1rem;"
                      class="bg-blue-grey-2 q-my-sm"
                      @click="clkOpenDialogOrganismDetail(link)"
                    >
                      <q-item-section>
                        <q-item-label> {{ link.organismRelationName }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                  <div v-else class="text-caption">
                    Nenhum vínculo de organismo criado <q-icon name="warning" color="warning" size="md"/>
                  </div>
                </div>
              </div>
              <div class="text-right">
                
              </div>
            </div>
          </q-expansion-item>
          <q-expansion-item
            group="somegroup"
            class="bg-grey-3"
            header-class="text-primary"
            label="Funções"
          >
            <div v-for="(func, funcIndex) in functions" :key="func" class="bg-white q-pa-sm">
              <CardFunction
                v-if="func.functionName !== 'Pastor'"
                :func="func"
                :funcIndex="funcIndex"
                @clkOpenDialogSolicitation="clkOpenDialogSolicitation"
                :showAddUserButton="false"
                :isMobile="isMobile"
                :showInviteUserButton="canEdit"
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
                      :options="usersOptions.list"
                      @filter="getUsers"
                      :option-value="(item) => item._id"
                      hint="Digite o nome de quem você vai convidar"
                    >
                      <template v-slot:no-option>
                        <q-item> 
                          <q-item-section>
                            <q-btn
                              icon="person_add"
                              dense
                              flat
                              no-caps
                              label="Novo usuário"
                              color="primary"
                              class="q-pa-sm"
                              @click="openDialogAddUser(dialogOpenSolicitation.data.functionName)"
                            />
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
                  <q-card-actions align="center">
                    <q-btn flat label="Depois" no-caps rounded color="primary"
                      @click="dialogOpenSolicitation.open = false" />
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
          </q-expansion-item>
          <q-expansion-item
            v-if="organismConfigName === 'Distrito'"
            group="somegroup"
            class="bg-grey-3"
            header-class="text-primary"
            label="Coordenação/Representação"
          >
            <div v-for="(func, funcIndex) in functions" :key="func" class="bg-white q-pa-sm">
              <CardFunction
                v-if="func.functionName !== 'Pastor' && func.group === 'coordination'"
                :func="func"
                :funcIndex="funcIndex"
                @clkOpenDialogSolicitation="clkOpenDialogSolicitation"
                :showAddUserButton="false"
                :isMobile="isMobile"
                :showInviteUserButton="canEdit"
              />
            </div>
          </q-expansion-item> 
          <q-expansion-item
            group="somegroup"
            class="bg-grey-3"
            header-class="text-primary"
            label="Pastores"
          >
            <div 
              v-for="func in functions" 
              :key="func"
            >
              <div v-if="func.functionName === 'Pastor'">
                Chamados
                <div
                  v-for="pastor in func.users"
                  :key="pastor"
                >
                  <q-item
                    v-if="pastor.functionSubtype === 'chamado'"
                    style="border-radius: 0.5rem;"
                    class="bg-white q-ma-xs"
                  >
                    <q-item-section avatar>
                      <q-icon name="account_circle" size="38px" color="grey"/>
                    </q-item-section>
                    <q-item-section 
                      class="text-wrap" 
                      lines="2" 
                    >
                      {{ pastor.userName}}
                      <div class="text-caption text-grey-7" v-if="pastor.dates && pastor.dates.initialDate">
                        Data início:
                        {{ formatDate(pastor.dates.initialDate) }}
                      </div>
                      <div
                        v-if="pastor.dates && pastor.dates.finalDate"
                        class="text-caption text-grey-7"
                      >
                        Data Fim: {{ formatDate(pastor.dates.finalDate) }}
                      </div>
                    </q-item-section>
                  </q-item>
                </div>
                Atuação
                <div
                  v-for="pastor in func.users"
                  :key="pastor"
                >
                  <q-item
                    v-if="pastor.functionSubtype === 'chamado'"
                    style="border-radius: 0.5rem;"
                    class="bg-white q-ma-xs"
                  >
                    <q-item-section avatar>
                      <q-icon name="account_circle" size="38px" color="grey"/>
                    </q-item-section>
                    <q-item-section 
                      class="text-wrap" 
                      lines="2" 
                    >
                      {{ pastor.userName}}
                      <div class="text-caption text-grey-7" v-if="pastor.dates && pastor.dates.initialDate">
                        Data início:
                        {{ formatDate(pastor.dates.initialDate) }}
                      </div>
                      <div
                        v-if="pastor.dates && pastor.dates.finalDate"
                        class="text-caption text-grey-7"
                      >
                        Data Fim: {{ formatDate(pastor.dates.finalDate) }}
                      </div>
                    </q-item-section>
                  </q-item>
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-list>
      </div>
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
        <q-dialog
          v-model="dialogDeleteUserFromFunction.open"
          @hide="clearDialogAndFunctions"
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
      <DialogOrganismDetail
        :open="dialogChildOrganism.open"
        :orgData="dialogChildOrganism.orgData"
        :orgFields="dialogChildOrganism.orgFields"
        :orgFunc="dialogChildOrganism.orgFunc"
        :isAdm="false"
        @closeDialog="closeDialogOrganismDetail"
      />
      <DialogAddress
        :open="dialogConfirmAddress.open"
        :addressDataProp="dialogConfirmAddress.data"
        @confirmAddress="confirmAddress"
        @closeDialog="clearAddressInputs"
      />
      <DialogPhoneMobileEmail
        :open="dialogAddPhoneMobileEmail.open"
        :dataProp="dialogAddPhoneMobileEmail.data"
        :type="dialogAddPhoneMobileEmail.type"
        @confirm="confirmAddPhoneMobileEmail"
        @closeDialog="clearDialogAddPhoneMobileEmail"
        :hint="dialogAddPhoneMobileEmail.hint"
        :label="dialogAddPhoneMobileEmail.label"
      />

      <q-dialog
        @hide="organismGroupConfigId = ''"
        v-model="dialogInsertNewOrganismGroup.open"
      >
        <q-card style="border-radius: 1rem; width: 580px">
          <div class="q-gutter-md q-pa-md">
            <div class="text-h5"> Criação de grupo</div>
            <div class="text-caption text-subtitle1" v-if="childOrganismsConfigData.length">
              Clique em uma das sugestões abaixo para iniciar a criação de um novo grupo 
            </div>
            <q-list v-if="childOrganismsConfigData.length">
              <q-item
                clickable
                v-for="item in childOrganismsConfigData"
                :key="item"
                style="border-radius: 1rem;"
                @click="clkCreateNewChildOrganism(item)"
                class="bg-grey-3 q-my-sm"
              >
                <q-item-section>
                  <q-item-label class="text-subtitle1"> {{ item.organismConfigName }}</q-item-label>
                </q-item-section>

                <q-item-section side top>
                  <q-icon name="star" color="yellow" />
                </q-item-section>
              </q-item>
            </q-list>
            <div v-else class="text-subtitle1">
              Nenhuma configuração de grupo de organismo <q-icon name="warning" color="warning" size="md"/>
            </div>
          </div>
        </q-card>
      </q-dialog>
      <q-dialog
    v-model="dialogAddServices.open"
  >
    <q-card style="width: 300px;border-radius: 1rem;">
      <q-card-section>
        <div class="text-center text-h6">
          Adicionar horário de culto
        </div>
        <q-select
          outlined
          label="Selecione o dia da semana"
          class="q-pa-sm"
          :options="dialogAddServices.daysOfWeek"
          option-label="label"
          v-model="dialogAddServices.selectedDay"
        />
        <q-input
          label="Selecione o horário"
          outlined
          class="q-pa-sm"
          mask="##:##"
          v-model="dialogAddServices.selectedHour"
        />
        <div class="q-my-md">
          <strong>Selecione uma ou mais opção</strong>
        </div>
        <q-checkbox
          label="Toda semana"
          v-model="dialogAddServices.everyWeek"
          @update:model-value="changeOtherStatus()"
        />
        <q-checkbox
          label="1º semana"
          v-model="dialogAddServices.firstWeek"
          @update:model-value="verifyIfChangeStatus()"
        />
        <q-checkbox
          label="2° semana"
          v-model="dialogAddServices.secondWeek"
          @update:model-value="verifyIfChangeStatus()"
        />
        <q-checkbox
          label="3° semana"
          v-model="dialogAddServices.thirdWeek"
          @update:model-value="verifyIfChangeStatus()"
        />
        <q-checkbox
          label="4° semana"
          v-model="dialogAddServices.fourthWeek"
          @update:model-value="verifyIfChangeStatus()"
        />
        <q-checkbox
          label="5° semana"
          v-model="dialogAddServices.fifthWeek"
          @update:model-value="verifyIfChangeStatus()"
        />
      </q-card-section>
      <q-card-actions
        align="center"
      >
        <q-btn
          color="primary"
          rounded
          unelevated
          no-caps
          flat
          label="Voltar"
          @click="clearDialogAddEvents"
        />
        <q-btn
          color="primary"
          rounded
          unelevated
          no-caps
          label="confirmar"
          @click="confirmAddServiceConfig"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import utils from "../../boot/utils";
import CardFunction from '../../components/CardFunction.vue';
import CardSecretary from '../../components/CardSecretary.vue';
import CardServices from '../../components/CardServices.vue'
import DialogOrganismDetail from '../../components/DialogOrganismDetail.vue';
import DialogAddress from '../../components/DialogAddress.vue';
import CardPastor from '../../components/CardPastor.vue';
import CardAddress from '../../components/CardAddress.vue';
import CardPhoneMobileEmail from '../../components/CardPhoneMobileEmail.vue';
import CardBankData from '../../components/CardBankData.vue';
import DialogPhoneMobileEmail from '../../components/DialogPhoneMobileEmail.vue';
import CardMaritalStatus from '../../components/CardMaritalStatus.vue';
import CardOrganism from '../../components/CardOrganism.vue';
import CardPerson from '../../components/CardPerson.vue';
import useFetch from "../../boot/useFetch";
import { useScreenStore } from "stores/checkIsMobile";
import { date } from "quasar";
export default defineComponent({
  name: "UserOrganismDetail",
  components: {
    CardFunction, CardOrganism, DialogAddress,
    CardAddress, CardPerson, CardMaritalStatus,
    CardBankData, CardPhoneMobileEmail,
    DialogPhoneMobileEmail, CardPastor,
    DialogOrganismDetail, CardSecretary,
    CardServices
  },
  data() {
    return {
      usersOptions: [],
      canBeDead: false, 
      isReplacement: false,
      isMobile: false,
      disableIsReplacement: false,
      hasPermission: '',
      organismName: '',
      userSelected: '',
      myUserIdMongo: '',
      organism: null,
      fields: [],
      openDialogVinculateUserToTitle: false,
      dialogConfirmAddress: {
        open: false,
        fieldIndex: null,
        tabsIndex: null,
        valueIndex: null,
        data: {
          cep: "",
          street: "",
          number: "",
          city: "",
          state: "",
          district: "",
          complement: "",
          addressType: ''
        }
      },
      dialogFormation: {
        open: false,
        tabsIndex: null,
        fieldIndex: null,
        data: {
          value: '',
          type: ''
        },
        action: null,
        iValue: null
      },
      dialogAddBankData: {
        open: false,
        fieldIndex: null,
        tabsIndex: null,
        iValue: null,
        userHasDoc: {
          hasDoc: false,
          doc: ''
        },
        data: {
          bank: '',
          agency: '',
          account: '',
          pix: ''
        }
      },
      dialogAddUser: {
        param: null,
        open: false,
        data: {
          name: '',
          email: '',
          phone: '',
          document: ''
        }
      },
      addOrganism: {
        dialogOpen: false,
        fieldIndex: null,
        tabIndex: null,
        organismsOptions: null,
        organismSelected: null,
        data: {
          name: ''
        },
      },
      canEdit: false,
      relations: null,
      addPerson: {
        dialogOpen: false,
        fieldIndex: null,
        tabIndex: null,
        usersOptions: null,
        userSelected: null,
        data: {
          name: '',
        },
      },
      dialogAddServices: {
        open: false,
        daysOfWeek: [
          {label: 'Domingo', value: 'sunday' },
          {label: 'Segunda-feira', value: 'monday' },
          {label: 'Terça-feira', value: 'monday' },
          {label: 'Quarta-feira', value: 'wednesday' },
          {label: 'Quinta-feira', value: 'thursday' },
          {label: 'Sexta-feira', value: 'friday' },
          {label: 'Sábado', value: 'saturday' }
        ],
        edit: false,
        selectedDay: null,
        selectedHour: null,
        fieldIndex: null,
        iValue: null,
        everyWeek: false,
        firstWeek: false,
        secondWeek: false,
        thirdWeek: false,
        fourthWeek: false,
        fifthWeek: false,
      },
      maritalStatus: {
        open: false,
        tabsIndex: null,
        fieldIndex: null,
        data: {
          status: '',
          spouses: []
        },
        action: null,
        iValue: null
      },
      dialogAddPhoneMobileEmail: {
        hint: null,
        type: null,
        open: false,
        tabsIndex: null,
        fieldIndex: null,
        data: {
          value: '',
          type: ''
        },
        action: null,
        iValue: null
      },
      // organismConfigOptions: [],
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
      visionSelected: 'data',
      childOrganismsData: null,
      dialogInsertNewOrganismGroup: {
        open: false,
        data: null
      },
      dialogDeleteMissionPoint:{
        data: {},
        open: false,
      },
      existsPastor: false,
      dialogChildOrganism:{
        open: false,
        orgData: {},
        organismRelationId: '',
        orgFunc: [],
        orgFields: [],
      },
      dialogInsertUserInFunction:{
        initialDate: '',
        open: false,
        functionType: '',
        selectedFunc: null,
        selectedFuncIndex: null,
        userSelected: null,
        userInstallation: ''
      },
      idLegado: null,
      child: null,
      parent: null,
      dialogDeleteUserFromFunction: {
        obsText: "",
        finalDate: "",
        open: false,
        userData: {},
      },
    };
  },
  beforeMount() {
    this.isMobile = useScreenStore().isMobile
    this.getUserIdMongo()
    this.getOrganismDetailById();
    // this.getOrganismsConfigs()
    // this.getFunctionsSolicitationsByOrganismId()
    this.getChildOrganismsConfigsByOrganismId()
    this.getChildOrganismsById()
  },
  methods: {
    clearDialogAddEvents() {
      this.dialogAddServices.open = false
      this.dialogAddServices.selectedDay = null
      this.dialogAddServices.selectedHour = null
      this.dialogAddServices.fieldIndex = null
      this.dialogAddServices.everyWeek = false
      this.dialogAddServices.firstWeek = false
      this.dialogAddServices.secondWeek = false
      this.dialogAddServices.thirdWeek = false
      this.dialogAddServices.fourthWeek = false
      this.dialogAddServices.fifthWeek = false
    },
    confirmAddServiceConfig() {
      if (!this.organismData.fields[this.dialogAddServices.fieldIndex].value) {
        this.organismData.fields[this.dialogAddServices.fieldIndex].value = []
      }
      if (this.dialogAddServices.edit) {
        this.organismData.fields[this.dialogAddServices.fieldIndex].value[this.dialogAddServices.iValue] = {
          dayOfWeek: this.dialogAddServices.selectedDay,
          time: this.dialogAddServices.selectedHour,
          configs: {
            everyWeek: this.dialogAddServices.everyWeek,
            firstWeek: this.dialogAddServices.firstWeek,
            secondWeek: this.dialogAddServices.secondWeek,
            thirdWeek: this.dialogAddServices.thirdWeek,
            fourthWeek: this.dialogAddServices.fourthWeek,
            fifthWeek: this.dialogAddServices.fifthWeek
          }
        }
        this.clearDialogAddEvents()
        return 
      } else {
        this.organismData.fields[this.dialogAddServices.fieldIndex].value.push({
          dayOfWeek: this.dialogAddServices.selectedDay,
          time: this.dialogAddServices.selectedHour,
          configs: {
            everyWeek: this.dialogAddServices.everyWeek,
            firstWeek: this.dialogAddServices.firstWeek,
            secondWeek: this.dialogAddServices.secondWeek,
            thirdWeek: this.dialogAddServices.thirdWeek,
            fourthWeek: this.dialogAddServices.fourthWeek,
            fifthWeek: this.dialogAddServices.fifthWeek
          }
        })
        this.clearDialogAddEvents()
      }
    },
    verifyIfChangeStatus() {
      if (this.dialogAddServices.firstWeek === true
        && this.dialogAddServices.secondWeek === true
        && this.dialogAddServices.thirdWeek === true
        && this.dialogAddServices.fourthWeek === true 
        && this.dialogAddServices.fifthWeek === true ) {
          this.dialogAddServices.everyWeek = true
      } else {this.dialogAddServices.everyWeek = false}
    },
    changeOtherStatus() {
      if (this.dialogAddServices.everyWeek === true) {
        this.dialogAddServices.firstWeek = true
        this.dialogAddServices.secondWeek = true
        this.dialogAddServices.thirdWeek = true
        this.dialogAddServices.fourthWeek = true 
        this.dialogAddServices.fifthWeek = true
      } else if (this.dialogAddServices.everyWeek === false) {
        this.dialogAddServices.firstWeek = false
        this.dialogAddServices.secondWeek = false
        this.dialogAddServices.thirdWeek = false
        this.dialogAddServices.fourthWeek = false 
        this.dialogAddServices.fifthWeek = false
      }
    },
    editServicesData(fieldIndex, iValue) {
      this.dialogAddServices.edit = true
      let editData = this.organismData.fields[fieldIndex].value[iValue]
      this.dialogAddServices.fieldIndex = fieldIndex
      this.dialogAddServices.iValue = iValue
      this.dialogAddServices.selectedDay = editData.dayOfWeek
      this.dialogAddServices.selectedHour = editData.time
      this.dialogAddServices.everyWeek = editData.configs.everyWeek
      this.dialogAddServices.firstWeek = editData.configs.firstWeek
      this.dialogAddServices.secondWeek = editData.configs.secondWeek
      this.dialogAddServices.thirdWeek = editData.configs.thirdWeek
      this.dialogAddServices.fourthWeek = editData.configs.fourthWeek
      this.dialogAddServices.fifthWeek = editData.configs.fifthWeek
      this.dialogAddServices.open = true
    },
    removeServicesData(fieldIndex, iValue) {
      this.organismData.fields[fieldIndex].value.splice(iValue, 1)
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
          userFunctionId: this.dialogDeleteUserFromFunction.userData._id,
          finalDate: this.dialogDeleteUserFromFunction.finalDate,
          obsText: this.dialogDeleteUserFromFunction.obsText,
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.getOrganismDetailById();
          this.$q.notify("Usuário inativado com sucesso!");
          this.clearDialogAndFunctions();
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    dialogOpenDeleteUserFromFunction(user) {
      this.dialogDeleteUserFromFunction.open = true;
      this.dialogDeleteUserFromFunction.userData = user;
    },
    addUserToFunction() {
      let organismFunctionId
      const selectedFuncIndex = this.dialogInsertUserInFunction.selectedFunc;
      if (this.dialogInsertUserInFunction.userSelected === "" || this.dialogInsertUserInFunction.initialDate === "") {
        this.$q.notify("Preencha usuário e a data do chamado");
        return;
      }
      if (this.dialogInsertUserInFunction.selectedFunc.functions) {
        organismFunctionId = this.dialogInsertUserInFunction.selectedFunc.functions._id
      } else if (this.dialogInsertUserInFunction.selectedFunc.functionId) {
        organismFunctionId = this.dialogInsertUserInFunction.selectedFunc.functionId
      }
      const opt = {
        route: "/desktop/adm/addUserToFunction",
        body: {
          organismFunctionId: organismFunctionId,
          userIdMongo:  this.dialogInsertUserInFunction.userSelected._id,
          dates: {
            initialDate: this.dialogInsertUserInFunction.initialDate
          }
        }
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify(r.errorMessage)
          this.functions[selectedFuncIndex].users = []
          return
        } else{
          this.$q.notify('Usuário inserido na função!')
          this.getOrganismDetailById()
          this.clearDialogAndFunctions();
        }
      });
    },
    linkSecretaryToFunction() {
      this.functions.forEach((func, ifunc) => {
        if (func.functionName === 'Secretária Contratada') {
          this.dialogInsertUserInFunction.selectedFunc = func;
          this.dialogInsertUserInFunction.functionType = 'Secretária Contratada';
          this.dialogInsertUserInFunction.selectedFuncIndex = ifunc;  
          this.dialogInsertUserInFunction.open = true;
        }
      })
    },
    clearDialogAndFunctions() {
      this.dialogInsertUserInFunction.selectedFuncIndex = null
      this.dialogInsertUserInFunction.selectedFunc = null,
      this.dialogInsertUserInFunction.userSelected = null
      this.dialogInsertUserInFunction.open = false
      this.dialogDeleteUserFromFunction.open = false
      this.dialogDeleteUserFromFunction.finalDate = ''
      this.dialogDeleteUserFromFunction.userData = {}
      this.dialogDeleteUserFromFunction.obsText = ''
      this.dialogInsertUserInFunction.initialDate = ''
    },
    clkShowDialogParentDetail(user) {
      this.dialogChildOrganism.data = user
      this.clkShowDetailOrganism(user.parentId)
    },
    clkShowDetailOrganism(_id) {
      const opt = {
        route: "/desktop/adm/getOrganismDetailById",
        body: {
          organismId: _id,
        },
      };
      useFetch(opt).then((r) => {
        if (r.error) return 
        else {
          this.dialogChildOrganism.orgData = r.data.organismData
          this.dialogChildOrganism.orgFields = r.data.organismData.fields
          this.dialogChildOrganism.orgFunc = r.data.functions
          this.dialogChildOrganism.orgId = r.data._id
          this.dialogChildOrganism.open = true
        }
      })
    },
    closeDialogOrganismDetail() {
      this.dialogChildOrganism.open = false
    },
    clearChildOrganismDetailOnDialog(){
      this.dialogChildOrganism.orgData = {}
      this.dialogChildOrganism.open = false
      this.dialogChildOrganism.organismRelationId = ''
    },
    getChildOrganismDetailOnDialog() {
      const childOrganismId = this.dialogChildOrganism.organismRelationId
      const opt = {
        route: "/desktop/commonUsers/getOrganismDetailById",
        body: {
          organismId: childOrganismId,
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.dialogChildOrganism.orgData = r.data.organismData
          this.dialogChildOrganism.orgFields = r.data.organismData.fields
          this.dialogChildOrganism.orgFunc = r.data.functions
        }
      });
    },
    clkOpenDialogOrganismDetail(link) {
      this.dialogChildOrganism.open = true
      if (link.organismRelationId) {
        this.dialogChildOrganism.organismRelationId = link.organismRelationId
      } else if (link.childId) {
        this.dialogChildOrganism.organismRelationId = link.childId
      }
      this.getChildOrganismDetailOnDialog()
    },
    clkOpenDialogDeleteMissionPoint(child){
      this.dialogDeleteMissionPoint.open = true
      this.dialogDeleteMissionPoint.data = child
    },
    verifyIfHasPastor() {
      this.functions.forEach((func) => {
        if (func.functionName === 'Pastor' && func.users.length) {
          this.existsPastor = true
        }
      })
    },
    verifyCanEdit() {
      this.canEdit = false
      this.functions.forEach((func) => {
        func.users.forEach((user) => {
          const userInfo = utils.presentUserInfo()
          if (user.userId === userInfo.user_id) {
            this.canEdit = true
          } 
        })
      })
    },
    async updateOrganism () {
      const opt = {
        route: '/desktop/users/updateOrganismData',
        body: {
          organismData: this.organismData,
          organismId: this.$route.query.organismId
        }
      }
      this.$q.loading.show()
      const r = await useFetch(opt)
      this.$q.loading.hide()
      if (r.error) {
        this.$q.notify('Ocorreu um erro. Tente novamente.')
        return
      }
      this.getOrganismDetailById()
    },
    async clkCreateNewChildOrganism(item){
      const opt = {
        route: "/desktop/commonUsers/createChildOrganism",
        body: {
          organismData: {
            organismParentId: this.$route.query.organismId,
            organismConfigId: item.organismChildConfigId,
          },
        },
      };
      this.$q.loading.show()
      const r = await useFetch(opt)
      this.$q.loading.hide()
      if (r.error) {
        this.$q.notify('Ocorreu um erro. Tente novamente.')
        return
      }
      this.dialogInsertNewOrganismGroup.open = false
      this.getChildOrganismsById()
    },
    getChildOrganismsConfigsByOrganismId() {
      const organismId = this.$route.query.organismId
      const opt = {
        route: "/desktop/commonUsers/getChildOrganismsConfigsByOrganismId",
        body: {
          parentOrganismId: organismId,
        },
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.childOrganismsConfigData = r.data.childOrganismsConfigs
        }
      });
    },
    confirmCreateNewUser () {
      const opt = {
        route: '/desktop/statistics/createNewUser',
        body: {
          data: this.dialogAddUser.data,
          userType: ''
        }
      }
      // if(this.dialogAddFunction.functionName === 'Pastor'){
      //   opt.body.userType = 'pastor'
      // }

      useFetch(opt).then(() => {
        this.$q.notify('Usuário criado com sucesso')
        if (this.dialogAddUser.param === 'func') {
          this.dialogAddFunction.userSelected = {
            userName: this.dialogAddUser.data.name
          }
        } else if (this.dialogAddUser.param === 'secretary') {
          this.dialogAddSecretary.userSelected = {
            userName: this.dialogAddUser.data.name
          }
        } else if (this.dialogAddUser.param === 'funcInDept') {
          this.dialogAddFunctionToDept.userSelected = {
            userName: this.dialogAddUser.data.name
          }
        }
        this.dialogAddUser.open = false
        this.dialogAddUser.data = {
          name: '',
          email: '',
          phone: '',
          document: ''
        }
      })
    },
    openDialogAddUser(param) {
      this.dialogAddUser.param = param
      this.dialogAddUser.open = true
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
    clkOpenChildOrganismDetail(child){
      const childOrganismId = child.childOrganismId
      const opt = {
        route: "/desktop/adm/getOrganismDetailById",
        body: {
          organismId: childOrganismId
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) return 
        else {
          this.dialogChildOrganism.orgData = r.data.organismData
          this.dialogChildOrganism.orgFields = r.data.organismData.fields
          this.dialogChildOrganism.orgFunc = r.data.functions
          this.dialogChildOrganism.orgId = r.data._id
          this.dialogChildOrganism.open = true
        }
      })
    },
    getChildOrganismsById() {
      const organismId = this.$route.query.organismId
      const opt = {
        route: "/desktop/commonUsers/getChildOrganismsById",
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
          this.childOrganismsData = r.data
        }
      });
    },
    addPhoneMobileEmail(fieldIndex, tabsIndex, field) {
      this.dialogAddPhoneMobileEmail.action = 'add'
      this.dialogAddPhoneMobileEmail.hint = field.hint
      this.dialogAddPhoneMobileEmail.label = field.label
      this.dialogAddPhoneMobileEmail.open = true
      this.dialogAddPhoneMobileEmail.type = field.type
      this.dialogAddPhoneMobileEmail.fieldIndex = fieldIndex
      this.dialogAddPhoneMobileEmail.tabsIndex = tabsIndex
    },
    confirmAddPhoneMobileEmail (data) {
      if (this.dialogAddPhoneMobileEmail.action === 'add') {
        if (!this.organismData.fields[this.dialogAddPhoneMobileEmail.fieldIndex].value){
          this
            .organismData
            .fields[this.dialogAddPhoneMobileEmail.fieldIndex]
            .value = []
        }
        this
          .organismData
          .fields[this.dialogAddPhoneMobileEmail.fieldIndex]
          .value
          .push({...data})
      } else if (this.dialogAddPhoneMobileEmail.action === 'edit') {
        this
          .organismData
          .fields[this.dialogAddPhoneMobileEmail.fieldIndex]
          .value[this.dialogAddPhoneMobileEmail.iValue] = {...data}
      }
      this.dialogAddPhoneMobileEmail.open = false
    },
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
        route: "/desktop/commonUsers/getUsers",
        body: {
          canUseSystem: this.canBeDead,
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
        route: '/desktop/commonUsers/getUserIdMongo',
      }
      useFetch(opt).then(r => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
          return
        } else { this.myUserIdMongo = r.data.userIdMongo }
      })
    },
    clearDialogAddPhoneMobileEmail () {
      this.dialogAddPhoneMobileEmail = {
        type: null,
        open: false,
        tabsIndex: null,
        fieldIndex: null,
        data: {
          value: '',
          type: ''
        },
        options: ['Pessoal', 'Profissional', 'Outro'],
        action: null,
        iValue: null
      }
      this.dialogAddPhoneMobileEmail.open = false
    },
    clearAddressInputs(){
      this.dialogConfirmAddress.data = {
        addressType: '',
        type: "",
        cep: "",
        street: "",
        number: "",
        city: "",
        state: "",
        district: "",
        complement: ""
      }
      this.dialogConfirmAddress.open = false;
    },
    confirmAddress(data) {
      const fieldIndex = this.dialogConfirmAddress.fieldIndex
      const valueIndex = this.dialogConfirmAddress.valueIndex
      if (this.dialogConfirmAddress.action === 'add') {
        if (!this.organismData.fields[fieldIndex].value)
          this.organismData.fields[fieldIndex].value = []
        this.organismData.fields[fieldIndex].value.push({
          type: data.addressType,
          cep: data.cep,
          street: data.street,
          number: data.number,
          city: data.city,
          state: data.state,
          district: data.district,
          complement: data.complement
        });
      } else if (this.dialogConfirmAddress.action === 'edit') {
        this.organismData.fields[fieldIndex].value[valueIndex] = {
          type: data.addressType,
          cep: data.cep,
          street: data.street,
          number: data.number,
          city: data.city,
          state: data.state,
          district: data.district,
          complement: data.complement
        }
      }
      this.clearAddressInputs()
    },
    editThisAddress(fieldIndex, tabsIndex, valueIndex){
      this.dialogConfirmAddress = {
        open: true,
        fieldIndex,
        tabsIndex,
        valueIndex,
        action: 'edit',
        data: {
          cep: this.organismData.fields[fieldIndex].value[valueIndex].cep,
          addressType: this.organismData.fields[fieldIndex].value[valueIndex].type,
          street: this.organismData.fields[fieldIndex].value[valueIndex].street,
          number: this.organismData.fields[fieldIndex].value[valueIndex].number,
          district: this.organismData.fields[fieldIndex].value[valueIndex].district,
          complement: this.organismData.fields[fieldIndex].value[valueIndex].complement,
          city: this.organismData.fields[fieldIndex].value[valueIndex].city,
          state: this.organismData.fields[fieldIndex].value[valueIndex].state,
        }
      }
    },
    removeThisAddress(fieldIndex, valueIndex) {
      this.organismData.fields[fieldIndex].value.splice(valueIndex, 1);
    },
    clkOpenAddressDialog(fieldIndex, tabIndex) {
      this.dialogConfirmAddress.action = 'add'
      this.dialogConfirmAddress.open = true
      this.dialogConfirmAddress.fieldIndex = fieldIndex
      this.dialogConfirmAddress.tabsIndex = tabIndex
    },
    editPhoneMobileEmail (fieldIndex, tabsIndex, field, value, iValue) {
      this.dialogAddPhoneMobileEmail.open = true
      // this.dialogAddPhoneMobileEmail.type = field.type
      this.dialogAddPhoneMobileEmail.type = this.organismData.fields[fieldIndex].type
      this.dialogAddPhoneMobileEmail.fieldIndex = fieldIndex
      this.dialogAddPhoneMobileEmail.tabsIndex = tabsIndex
      this.dialogAddPhoneMobileEmail.data = {...value}
      this.dialogAddPhoneMobileEmail.action = 'edit'
      this.dialogAddPhoneMobileEmail.iValue = iValue
    },
    removePhoneMobileEmail (fieldIndex, tabsIndex, field, value, iValue) {
      this
        .organismData
        .fields[fieldIndex]
        .value
        .splice(iValue, 1)
    },
    clkOpenDialogSolicitation(func) {
      this.dialogOpenSolicitation.open = true;
      // if(func.functionNumOfOccupants === func.numOfUser){
      //   this.isReplacement = true
      //   this.disableIsReplacement = true
      //   this.dialogOpenSolicitation.data = func
      //   this.dialogOpenSolicitation.functionId = func.functionId
      // }else if(func.functionNumOfOccupants < func.numOfUser){
      //   this.dialogOpenSolicitation.data = func
      //   this.dialogOpenSolicitation.functionId = func.functionId
      // }
      this.dialogOpenSolicitation.data = func
      this.dialogOpenSolicitation.functionId = func.functionId
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
      // if (this.userSelected._id === this.myUserIdMongo) {
      //   this.$q.notify('Você já participa desta função')
      //   return
      // }
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
          this.$q.notify("Convite enviado com sucesso!");
          this.getOrganismDetailById()
          this.getFunctionsSolicitationsByOrganismId()
          this.dialogOpenSolicitation.open = false
        }
      });
    },
    // getOrganismsConfigs() {
    //   const opt = {
    //     route: "/desktop/adm/getOrganismsConfigs",
    //   };
    //   useFetch(opt).then((r) => {
    //     if (r.error) {
    //       this.$q.notify("Ocorreu um erro, tente novamente por favor");
    //     } else {
    //       this.organismConfigOptions = r.data
    //     }
    //   });
    // },
    formatDate(newDate) {
      return date.formatDate(newDate, "DD/MM/YYYY");
    },
    getOrganismDetailById() {
      const organismId = this.$route.query.organismId
      const opt = {
        route: "/desktop/commonUsers/getOrganismDetailById",
        body: {
          organismId: organismId,
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
          return
        }
        this.functions = r.data.functions
        this.hasPermission = r.data.hasPermission
        this.organismName = r.data.organismData.organismName
        this.organismData.fields = r.data.organismData.fields;
        this.organismConfigName = r.data.organismData.organismConfigName
        this.relations = r.data.relations
        this.idLegado = r.data.idLegado
        this.child = r.data.relations.child
        this.parent = r.data.relations.parent
        this.visionSelected = 'data'
        this.verifyCanEdit()
        this.verifyIfHasPastor()
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

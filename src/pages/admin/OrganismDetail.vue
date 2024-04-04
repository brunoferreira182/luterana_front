<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col text-capitalize"> 
          <div class="text-h5">{{ organismName }}</div>
          <q-badge :style="{background: organismConfigStyle}" size="large">{{ organismConfigName }} - {{ idLegado }}</q-badge>
        </div>
        <div class="col text-right self-center">
          <!-- <q-btn
            no-caps
            color="red"
            flat
            class="q-mr-sm"
            rounded
            icon="delete"
            unelevated
            @click="dialogCloseOrganism.open = true"
            label="Encerrar organismo"
          /> -->
          <q-btn
            no-caps
            color="primary"
            rounded
            icon="bookmark"
            unelevated
            @click="updateOrganismData"
            label="Salvar Edição"
          />
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
        <q-tab name="organismData" label="Dados do organismo" v-if="!parentOrganismId"/>
        <q-tab name="afiliatesOrganismsList" label="Lista configuração de grupos" v-if="!parentOrganismId"/>
      </q-tabs>
      <q-separator v-if="!parentOrganismId" />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="organismData">
          <div class="row justify-around">
            <div class="col-7 q-gutter-md" align="start">
              <div class="text-h6" v-if="organismChildData && organismChildData.length > 0">
                Vínculos
                <span v-if="$route.path.includes('/admin')">
                  <q-btn
                    icon="folder"
                    color="primary"
                    size="15px"
                    dense
                    rounded
                    no-caps
                    unelevated
                    @click="dialogLinks = true"
                  >
                    <q-tooltip>Gerenciar vínculos</q-tooltip>
                  </q-btn>
                </span>
              </div>
              <q-list class="q-ml-md q-px-sm" v-if="organismChildData && organismChildData.length > 0">
                <q-item 
                  v-for="(child, ichild) in organismChildData" 
                  :key="child" 
                  class="bg-grey-3 q-ma-xs" 
                  style="border-radius: 0.5rem"
                  clickable
                  @click="clkShowDialogLink(child)"
                >
                  <q-item-section>
                    <q-item-label class="q-mt-sx text-bold" lines="1">
                      {{ child.childName }}
                      <q-badge
                        class="q-ml-sm"
                        :style="{ color: child.organismConfigStyle}" 
                        size="15px" 
                        outline
                      >
                        {{ child.organismConfigName }}
                      </q-badge>
                    </q-item-label>
                    <q-item-label class="text-subtitle1 text-bold flex justify-end" lines="2">
                      Pastores:
                      <q-btn
                        icon="add"
                        color="primary"
                        size="9px"
                        dense
                        flat
                        rounded
                        no-caps
                        @click.stop="linkPastorToChildOrganisms(child, ichild)"
                      >
                        <q-tooltip>Adicionar pastor</q-tooltip>
                      </q-btn>
                    </q-item-label>
                    <q-item-label 
                      v-for="pastor in child.functions.users" 
                      :key="pastor" 
                      class="text-subtitle2" lines="3"
                    >
                      {{ pastor.userName }}
                      <!-- <q-btn
                        icon="sync"
                        flat
                        dense
                        color="primary"
                        size="9px"
                        rounded
                        @click.stop="swapPastorToFunctionInCongregacao(pastor)"
                      >
                        <q-tooltip>Trocar pastor</q-tooltip>
                      </q-btn> -->
                      <q-btn
                        icon="delete"
                        dense
                        flat
                        color="red"
                        size="9px"
                        rounded
                        @click.stop="dialogOpenDeletePastorFromFunction(pastor)"
                      >
                        <q-tooltip>Remover pastor</q-tooltip>
                      </q-btn>
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>
                      <q-icon
                        class="q-mr-md"
                        size="25px"
                        v-if="child && child.organismRelationIsMain && child.organismRelationIsMain === 'SIM'" 
                        color="secondary" 
                        name="home"
                      ></q-icon>
                    </q-item-label>
                  </q-item-section>
                </q-item> 
              </q-list>
              <!-- <div class="text-h6">
                Histórico Pastoral
                <q-btn
                  icon="add"
                  color="primary"
                  round
                  size="12px"
                  unelevated
                  @click="addPastoralStatus"
                >
                  <q-tooltip>Adicionar histórico pastoral</q-tooltip>
                </q-btn>
              </div> 
              <div v-if="pastoralStatusData">
                <q-list>
                  <q-item 
                    v-for="status in pastoralStatusData"
                    :key="status"
                    class="bg-grey-3 q-ma-sm q-mx-md"
                    style="border-radius: 1rem;"
                  >
                    <q-item-section>
                      <q-item-label lines="1">
                        <strong>Pastor: </strong>{{ status.userData.name }}
                      </q-item-label>
                      <q-item-label lines="2" class="text-capitalize">
                        <strong>Status:</strong> {{ status.pastoralStatusData.status.label }}
                      </q-item-label>
                      <q-item-label lines="3" class="text-capitalize">
                        <strong>Sub-status:</strong> {{ status.pastoralStatusData.subStatus.label }}
                      </q-item-label>
                      <q-item-label lines="4" class="text-capitalize">
                        <strong>Local:</strong> {{ status.pastoralStatusData.local.label }}
                      </q-item-label>
                      <q-item-label lines="5">
                        <div>
                          <strong>Data inicial:</strong> {{ status.dates.initialDate }}
                        </div>
                        <div v-if="status.dates.finalDate && status.dates.finalDate !== '' ">
                          <strong>Data Final:</strong> {{ status.dates.finalDate }}
                        </div>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>
                        <q-btn 
                          color="primary" 
                          flat 
                          round
                          icon="edit" 
                          rounded
                          @click="editStatus(status)"
                        >
                          <q-tooltip>Editar status</q-tooltip>
                        </q-btn>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item 
                    v-for="status in inactivePastoralStatusData"
                    :key="status"
                    class="bg-grey-3 q-ma-sm q-mx-md"
                    style="border-radius: 1rem;"
                  >
                    <q-item-section>
                      <q-item-label lines="1">
                        <strong>Pastor: </strong>{{ status.userData.name }}
                      </q-item-label>
                      <q-item-label lines="2" class="text-capitalize">
                        <strong>Status:</strong> {{ status.pastoralStatusData.status.label }}
                      </q-item-label>
                      <q-item-label lines="3" class="text-capitalize">
                        <strong>Sub-status:</strong> {{ status.pastoralStatusData.subStatus.label }}
                      </q-item-label>
                      <q-item-label lines="4" class="text-capitalize">
                        <strong>Local:</strong> {{ status.pastoralStatusData.local.label }}
                      </q-item-label>
                      <q-item-label lines="5">
                        <div>
                          <strong>Data inicial:</strong> {{ status.dates.initialDate }}
                        </div>
                        <div v-if="status.dates.finalDate && status.dates.finalDate !== '' ">
                          <strong>Data Final:</strong> {{ status.dates.finalDate }}
                        </div>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div> -->
              <div v-if="organismConfigName === 'Congregação' || organismConfigName === 'Paróquia' || organismConfigName !== 'Ponto de Missão'">
                <div class="text-h6">
                  Vinculado a
                  <q-btn
                    icon="edit"
                    flat
                    color="primary"
                    rounded
                    unelevated
                  >
                    <q-tooltip>Alterar Vínculo</q-tooltip>
                  </q-btn>
                </div>
                <q-list class="q-px-xs" v-if="organismParentData && organismParentData.length > 0">
                  <q-item 
                    class="bg-grey-3 q-ma-sm" 
                    style="border-radius: 0.5rem"
                    clickable
                    v-for="parent in organismParentData"
                    :key="parent"
                    @click="clkShowDialogParentDetail(parent)"
                  >
                    <q-item-section >
                      <div class="row">
                        <div class="q-mt-sm">{{ parent.parentName}}</div>
                        <q-chip
                          class="q-ml-sm"
                          :style="{ color: parent.organismConfigStyle}" 
                          size="15px" 
                          outline
                        >{{ parent.organismConfigName }}</q-chip>
                        
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
              <div v-if="organismConfigName === 'Congregação'">
                <div class="text-h6" v-if="$route.path.includes('/admin')">
                  Pastores
                  <span>
                    <q-btn
                      icon="add"
                      color="primary"
                      align="center"
                      size="15px"
                      dense
                      rounded
                      flat
                      no-caps
                      @click="linkPastorToFunction()"
                    >
                      <q-tooltip>Adicionar pastor</q-tooltip>
                    </q-btn>
                    <q-btn
                      color="red"
                      @click="testDialog"
                    />
                  </span>
                </div>
                <div v-for="(func, funcIndex) in functions" :key="func">
                  <cardPastor
                    class="no-margin"
                    v-if="func.functionName === 'Pastor'"
                    :func="func"
                    :funcIndex="funcIndex"
                    @dialogOpenDeletePastorFromFunction="dialogOpenDeletePastorFromFunction"
                    @swapPastorToFunctionPastor="swapPastorToFunctionInCongregacao"
                    :showAddUserButton="false"
                    :canEditPastor="$route.path.includes('/admin') ? true : false"
                    :showInviteUserButton="func.functionName === 'Pastor' ? false : true && this.$route.query.e === 'f' ? false : true"
                  />
                </div>
              </div>
              <div v-if="organismConfigName === 'Congregação' || organismConfigName === 'Ponto de Missão'">
                <div
                  v-for="func in functions"
                  :key="func"
                >
                  <div v-if="func.functionName === 'Secretária Contratada'">
                    <div class="text-h6">
                      {{ func.functionName }}
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
                      class="q-ml-sm bg-grey-2"
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
                
              </div>
              <div  v-if="organismConfigName === 'Paróquia' && hidePastorInParoquia === false">
                <!-- <q-separator class="q-mx-md q-mb-md" /> -->
                <div class="text-h6" v-if="$route.path.includes('/admin')">
                  Pastores em paróquia
                  <span>
                    <q-btn
                      icon="add"
                      color="primary"
                      size="15px"
                      dense
                      rounded
                      no-caps
                      unelevated
                      @click="addPastorFunctionInParoquia()"
                    >
                      <q-tooltip>Adicionar pastor</q-tooltip>
                    </q-btn>
                  </span>
                </div>
                <div v-for="(func, funcIndex) in functions" :key="func">
                  <cardPastor
                    class="no-margin"
                    v-if="func.functionName === 'Pastor em Paróquia' && !func.properties.data.properties.hideFunctionDetail === true"
                    :func="func"
                    :funcIndex="funcIndex"
                    @deleteUserFromFunction="dialogOpenDeletePastorFromFunction"
                    @swapPastorToFunctionPastor="swapPastorToFunctionPastor"
                    :showAddUserButton="false"
                    :canEditPastor="$route.path.includes('/admin') ? true : false"
                    :showInviteUserButton="func.functionName === 'Pastor' ? false : true && this.$route.query.e === 'f' ? false : true"
                  />
                  
                </div>
              </div>
              <div v-if="organismData.fields.length" class="text-h6">
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
                    :label="field.label"
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
                  :readonly="field.onlyAdm"
                >
                  <template #append>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
                <div class="text-right" v-if="field.type.type === 'options'">
                  <q-select
                    outlined
                    :label="field.label"
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
                          v-for="(valueIndex) in field.value"
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
                            v-model="organismData.fields[fieldIndex].value"
                            :options="select.options"
                            class="col-5"
                          />
                          <q-btn
                            icon="delete"
                            class="q-ml-lg"
                            rounded
                            flat
                            color="red"
                            @click="organismData.fields[fieldIndex].value[valueIndex][selectIndex]" 
                            />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>  
                <div v-if="field.type.type === 'organism'">
                  <div v-if="field.value && field.value.length > 0">
                    <q-btn
                      :label="`Adicionar ${field.label}`"
                      no-caps
                      rounded
                      flat
                      color="primary"
                      icon="add"
                      v-if="field.multiple || !field.value || field.value ==='' || field.value.length === 0"
                      :disable="field.onlyAdm"
                    />
                    <CardOrganism
                      :data="field"
                      :fieldIndex="fieldIndex"
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
                    :disableButtons="true"
                  />
                </div>
                <div v-if="field.type.type === 'person'">
                  <div v-if="field.value && field.value.length > 0">
                    <div class="text-body">{{ field.label }}</div>
                    <CardPerson
                      :data="field"
                      :fieldIndex="fieldIndex"
                      :disableButtons="true"
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
                    :disable="field.onlyAdm"
                  />
                </div>
                <div v-if="field.type.type === 'maritalStatus'">
                  <div v-if="field.value && field.value.length > 0">
                    <div class="text-body">{{ field.label }}</div>
                    <CardMaritalStatus
                      :data="field"
                      :fieldIndex="fieldIndex"
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
                    :disableButtons="true"
                  />
                </div> 
                <div v-if="
                  field.type.type === 'email'
                  || field.type.type === 'phone'
                  || field.type.type === 'mobile'
                  "
                >
                  <q-btn
                    :label="`${field.type.label}` + ' ' + `${ organismConfigName}`"
                    no-caps
                    flat
                    v-if="field.multiple || (!field.multiple && (!field.value || field.value.length === 0))"
                    icon="add"
                    color="primary"
                    rounded
                    @click="addPhoneMobileEmail(fieldIndex, field)"
                    class="q-mt-xs"
                    :disable="field.onlyAdm"
                  />
                  <CardPhoneMobileEmail
                    :data="field.value"
                    :fieldIndex="fieldIndex"
                    :disableButtons="true"
                    :showHeader="field.value && field.value.length > 0 ? field.label : false"
                  />
                </div> 
                <div v-if="field.type.type === 'formation'">
                  <q-btn
                    label="Formação"
                    no-caps
                    rounded
                    unelevated
                    flat
                    color="primary"
                    icon="add"
                    @click="clkAddFormation(fieldIndex)"
                    class="q-mt-xs"
                    :disable="field.onlyAdm"
                  />
                  <CardFormation
                    :data="field"
                    :fieldIndex="fieldIndex"
                    @edit="editFormation"
                    @remove="removeFormation"
                  />
                </div>     
                <div v-if="field.type.type === 'services'">
                  <q-btn 
                    label="Horário de cultos"
                    no-caps
                    rounded
                    unelevated
                    flat
                    color="primary"
                    icon="add"
                    @click="clkAddServices(fieldIndex)"
                    class="q-mt-xs"
                  />
                  <CardServices
                    v-if="field.value && field.value.length"
                    :data="field.value"
                    :fieldIndex="fieldIndex"
                    @edit="editServicesData"
                    @remove="removeServicesData"
                  />
                </div>
                
                <!-- <div v-if="field.type.type === 'secretary'">
                  <q-btn
                    v-if="!field.value || !field.value.length > 0"
                    label="Secretária"
                    no-caps
                    rounded
                    unelevated
                    flat
                    color="primary"
                    icon="add"
                    class="q-mt-xs"
                    @click="clkAddSecretary(fieldIndex)"
                    :disable="field.onlyAdm"
                  />
                  <CardSecretary
                    v-if="field.value && field.value.length > 0"
                    :data="field.value"
                    :fieldIndex="fieldIndex"
                    :user="`false`"
                    @remove="removeSecretary"
                    @edit="editSecretary"
                  />
                </div> -->
                <div v-if="field.type.type === 'closeDate'">
                  <q-input
                    type="date"
                    :label="field.label"
                    :hint="field.hint"
                    :mask="field.type.mask"
                    v-model="field.value"
                    outlined
                    :readonly="field.onlyAdm"
                  >
                  </q-input>
                </div>
              </div>
              <CardAddress v-if="congregacaoSedeAddress.length > 0"
                :data="congregacaoSedeAddress"
                :fieldIndex="0"
                :disableButtons="true"
              />
              
            </div>
            <q-separator vertical class="q-ma-md"/>
            <div class="col-4">
              <div class="row">
                <div class="text-h6">Funções</div>
              </div>
              <div v-for="(func, funcIndex) in functions" :key="funcIndex">
                <CardFunction
                  v-if="func.functionName !== 'Pastor' && func.functionName !== 'Secretária Contratada' && func.functionName !== 'Pastor em Paróquia' && !func.properties.data.properties.hideFunctionDetail === true && func.group === 'function'"   
                  :func="func"
                  :funcIndex="funcIndex"
                  @insertObservation="dialogInsertObservation"
                  @deleteUserFromFunction="dialogOpenDeleteUserFromFunction"
                  @linkUserToFunction="linkUserToFunction"
                  :showAddUserButton="true"
                  :showInviteUserButton="false"
                  :isPastor="func.functionName === 'Pastor' ? false : true"
                />
                
                <q-dialog v-model="dialogInsertUserInFunction.open" @hide="clearDialogAndFunctions">
                  <q-card style="border-radius: 1rem; width: 480px">
                    <q-card-section align="center">
                      <div class="text-h6" v-if="dialogInsertUserInFunction.functionType !== 'Pastor'">
                        Informe o usuário que ocupará a função
                      </div>
                      <div class="text-h6" v-if="dialogInsertUserInFunction.functionType === 'Pastor'">
                        Informe o pastor que ocupará a função
                      </div>
                      <div v-if="dialogInsertUserInFunction.selectedFunc && dialogInsertUserInFunction.selectedFunc.functionRequiredTitleName">
                        <q-chip color="red-8" outline>
                          Esta função requer o título {{ dialogInsertUserInFunction.selectedFunc.functionRequiredTitleName }}
                        </q-chip>
                      </div>
                    </q-card-section>
                    <q-card-section v-if="dialogInsertUserInFunction.functionType === 'Pastor'" class="q-gutter-y-md">
                      <q-select
                        v-model="organismCallerSelected"
                        filled
                        use-input
                        label="Nome do organismo de chamado"
                        option-label="nome"
                        options-dense
                        readonly
                        :options="filiatedOrganismsList"
                        @filter="getFiliatedOrganismsList"
                        :option-value="(item) => item"
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
                              <q-item-label>{{ scope.opt.nome }}</q-item-label>
                              <q-item-label caption>{{ scope.opt.city }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                    </q-card-section>
                    <q-card-section class="q-gutter-md" v-if="dialogInsertUserInFunction.functionType === 'Pastor'">
                      <q-checkbox
                        v-model="otherOrganism"
                        label="Buscar organismo de outra paróquia"
                      />
                      <q-select
                        v-show="!otherOrganism"
                        v-model="organismCalleeSelected"
                        filled
                        multiple
                        label="Nome do organismo de atuação"
                        option-label="nome"
                        :readonly="sameOrganismCalled ? true : false"
                        :options="organismsFromThisParish"
                        :option-value="(item) => item"
                      >
                        <template v-slot:no-option>
                          <q-item>
                            <q-item-section class="text-grey">
                              Nenhum resultado
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                      <q-select
                        v-show="otherOrganism"
                        v-model="organismCalleeSelected"
                        filled
                        multiple
                        use-input
                        label="Nome do organismo de atuação"
                        option-label="nome"
                        :readonly="sameOrganismCalled ? true : false"
                        :options="filiatedOrganismsList"
                        @filter="getFiliatedOrganismsList"
                        :option-value="(item) => item"
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
                            <q-item-label>{{ scope.opt.nome }}</q-item-label>
                            <q-item-label caption>{{ scope.opt.city }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>
                      </q-select>
                      <q-checkbox
                        label="É o mesmo organismo de chamado"
                        @update:model-value="changeOrganismCaller()"
                        v-model="sameOrganismCalled"
                      />
                      <q-input
                        filled
                        label="Chave-ata"
                        mask="AAA-AAA-###-####-##-a"
                        :rules="[validateAtaKeyFormat]"
                        lazy-rules
                        v-model="dialogInsertUserInFunction.ataKey"
                        hint="Informe a chave-ata"
                      />
                    </q-card-section>
                    <q-card-section class="q-gutter-md">
                      <q-select
                        v-model="dialogInsertUserInFunction.userSelected"
                        filled
                        use-input
                        label="Nome do usuário"
                        option-label="userName"
                        :options="usersOptions"
                        hint="usuário que ocupará a função"
                        @filter="getUsers"
                        :loading="false"
                        :option-value="(item) => item._id"
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
                                @click="openDialogAddUser('secretary')"
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
                      <q-select
                        v-if="dialogInsertUserInFunction.functionType === 'Pastor'"
                        v-model="dialogInsertUserInFunction.userInstallation"
                        filled
                        use-input
                        label="Nome do pastor que instalou"
                        option-label="userName"
                        :options="usersOptions"
                        hint="Pastor que instalou"
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
                        v-if="dialogInsertUserInFunction.functionType === 'Pastor'"
                        filled
                        type="date"
                        label="Data de instalação"
                        v-model="dialogInsertUserInFunction.installationDate"
                      />
                      <q-input
                        v-if="dialogInsertUserInFunction.functionType === 'Pastor'"
                        filled
                        type="date"
                        :readonly="undefinedCallee ? true : false"
                        label="Prazo do chamado"
                        v-model="dialogInsertUserInFunction.calleeDate"
                      />
                      <q-checkbox
                        v-if="dialogInsertUserInFunction.functionType === 'Pastor'"
                        label="Prazo chamado é indefinido"
                        @update:model-value="undefinedCalleeFunction()"
                        v-model="undefinedCallee"
                      />
                      <q-input
                        filled
                        :label="`${dialogInsertUserInFunction.functionType === 'Pastor' ? 'Data do chamado' : 'Data início'}` "
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
                <q-dialog
                  v-model="dialogOpenObservation.open"
                  @hide="clearDialogAndFunctions"
                >
                  <q-card style="border-radius: 1rem; width: 400px">
                    <q-card-section>
                      <div 
                        v-if="dialogOpenObservation.data.obs && dialogOpenObservation.data.obs.length"
                        class="text-subtitle1 text-center"
                      >
                        Histórico de observações:
                      </div>
                      <q-item
                        style="
                          border-radius: 0.5rem;
                          background-color: #e7e7e7;
                          margin: 10px;
                        "
                        v-for="obs in dialogOpenObservation.data.obs"
                        :key="obs"
                      >
                        <q-item-section class="text-wrap">
                          <div class="row justify-end">
                            
                            <div class="col text-capitalize text-bold">
                              <q-avatar size="lg" rounded >
                                <img src="https://cdn.quasar.dev/img/avatar.png" />
                              </q-avatar>
                              {{ obs.createdBy.name }}
                            </div>
                            <div class="col text-right" >
                              <div>
                                Publicado em
                              </div>
                              <div class="text-caption">
                                {{ obs.createdAt.createdAtOnlyDate }}
                              </div>
                            </div>
                          </div>
                          <div>
                            {{ obs.obsText }}
                          </div>
                        </q-item-section>
                      </q-item>
                    </q-card-section>
                    <q-card-section>
                      <div class="text-h6 text-center">
                        Insira uma observação à respeito de
                        {{ dialogOpenObservation.data.userName }}
                      </div>
                    </q-card-section>
                    <q-card-section align="center" class="q-gutter-sm">
                      <q-input
                        filled
                        label="Observação"
                        v-model="dialogOpenObservation.obsText"
                        hint="Insira aqui sua observação"
                      />
                    </q-card-section>
                    <q-card-actions align="center">
                      <q-btn
                        flat
                        label="Depois"
                        no-caps
                        rounded
                        color="primary"
                        @click="dialogOpenObservation.open = false"
                      />
                      <q-btn
                        unelevated
                        rounded
                        label="Confirmar"
                        no-caps
                        color="primary"
                        @click="addObservationForFunctionUser"
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
                <q-dialog
                  v-model="dialogDeletePastorFromFunction.open"
                  @hide="clearDialogAndFunctions"
                >
                  <q-card style="border-radius: 1rem; width: 400px">
                    <q-card-section>
                      <div class="text-h6 text-center">
                        Tem certeza que deseja inativar
                        {{ dialogDeletePastorFromFunction.userData.userName }}?
                      </div>
                    </q-card-section>
                    <q-card-section align="center" class="q-gutter-sm">
                      <q-input
                        filled
                        label="Observação"
                        v-model="dialogDeletePastorFromFunction.obsText"
                        hint="Informe o motivo"
                      />
                      <q-input
                        filled
                        type="date"
                        label="Data de desinstalação"
                        v-model="dialogDeletePastorFromFunction.finalDate"
                        hint="Informe a data de desinstalação de ocupação da função"
                      />
                      <q-select
                        v-model="dialogDeletePastorFromFunction.uninstallerUser"
                        filled
                        use-input
                        label="Nome do usuário que desinstalou"
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
                    <q-card-actions align="center">
                      <q-btn
                        flat
                        label="Depois"
                        no-caps
                        rounded
                        color="primary"
                        @click="dialogDeletePastorFromFunction.open = false"
                      />
                      <q-btn
                        unelevated
                        rounded
                        label="Confirmar"
                        no-caps
                        color="primary"
                        @click="desinstallPastorFunction"
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
                <q-dialog v-model="dialogLinks" @hide="clearDialogAndFunctions">
                  <q-card style="width: 500px; border-radius: 1rem;">
                    <div class=" q-mt-sm text-h6 text-center">
                      Vínculos
                    </div>
                    <q-card-section>
                      <div>
                        <div>
                          <q-separator/>
                          <div class="text-subtitle2 q-ma-sm">
                            Vincular novo organismo
                          </div>
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
                          <q-list bordered class="q-mt-sm" v-if="organismSelected !== ''">
                            <div class="list-container">
                              <q-item
                                clickable
                                :disable="organismLinks.includes(organism)"
                                @click="clkSaveVinculo(organism)"
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
                            </div>
                          </q-list>
                        </div>
                        <q-separator vertical />
                        <div>
                          <div class="text-subtitle2 q-ma-sm q-mt-lg">
                            Organismos vinculados:
                          </div>
                          <q-list v-if="relations">
                            <q-item
                              clickable
                              v-for="link, i in relations"
                              :key="link"
                              style="border-radius: 1rem;"
                              class="bg-grey-3 q-ma-sm"
                              @click="goToParentOrganismDetail(link)"
                            >
                              <q-item-section>
                                <q-item-label class="text-subtitle1"> {{ link.organismRelationName }}</q-item-label>
                                <q-item-label>{{ link.organismConfigName }}</q-item-label>
                              </q-item-section>
                              <q-item-section side top>
                                <q-btn
                                icon="delete"
                                color="red"
                                flat
                                rounded
                                style="width: 10px;"
                                @click="removeRelation(i)"
                                >
                              </q-btn>
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </div>
                      </div>
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
                        @click="clkSaveLink"
                        color="primary"
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
                <!-- <q-dialog full-height full-width v-model="dialogLinks" @hide="clearDialogAndFunctions">
                  <q-card>
                    <q-card-section>
                      <div class="text-h6 text-center">
                        Vínculos
                      </div>
                    </q-card-section>
                    <q-card-section>
                      <div class="row">
                        <div class="col-5">
                          <q-separator/>
                          <div class="text-subtitle2 q-ma-sm">
                            Vincular novo organismo
                          </div>
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
                          <q-list bordered class="q-mt-sm" v-if="organismSelected !== ''">
                            <q-item
                              clickable
                              :disable="organismLinks.includes(organism)"
                              @click="clkSaveVinculo(organism)"
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
                        </div>
                        <q-separator vertical />
                        <div class="col">
                          <q-separator/>
                          <div class="text-subtitle2 q-ma-sm">
                            Organismos vinculados:
                          </div>
                          <q-chip
                            v-for="(parent, i) in relations"
                            :key="parent"
                          >
                          {{ parent.organismRelationName }}
                          <q-btn
                            icon="close"
                            flat
                            rounded
                            style="width: 10px;"
                            @click="removeRelation(i)"
                            >
                          </q-btn>
                        </q-chip>
                        </div>
                      </div>
                    </q-card-section>
                    <q-card-actions align="center" class="absolute-bottom">
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
                        @click="clkSaveLink"
                        color="primary"
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog> -->
                <q-dialog v-model="dialogInserPastorInParoquia.open" @hide="clearDialogInsertPastor">
                  <q-card style="border-radius: 1rem; width: 400px">
                    <q-card-section align="center">
                      <div class="text-h6">
                        Informe o pastor que ocupará a função
                      </div>
                    </q-card-section>
                    <q-card-section align="center">
                      <q-select
                        v-model="dialogInserPastorInParoquia.pastorSelected"
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
                    <q-card-section align="center">
                      <q-input
                        filled
                        label="Data início"
                        type="date"
                        hint="Informe a data início de ocupação da função"
                        v-model="dialogInserPastorInParoquia.initialDate"
                      />
                    </q-card-section>
                    <q-card-actions align="center">
                      <q-btn
                        flat
                        label="Depois"
                        no-caps
                        rounded
                        color="primary"
                        @click="dialogInserPastorInParoquia.open = false"
                      />
                      <q-btn
                        unelevated
                        rounded
                        label="Confirmar"
                        no-caps
                        color="primary"
                        @click="insertPastorToFunctionParoquia"
                      />
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
        </q-tab-panel>
        <q-tab-panel name="afiliatesOrganismsList">
          <q-dialog
            @hide="organismGroupConfigId = ''"
            v-model="dialogInsertNewOrganismGroup"
          >
            <q-card style="border-radius: 1rem; width: 580px">
              <div class="q-gutter-md q-pa-md">
                <div class="text-h5"> Criação de grupos de organismos</div>
                <q-list v-if="childOrganismsConfigData.length">
                  <q-item
                    clickable
                    v-for="item in childOrganismsConfigData"
                    :key="item"
                    style="border-radius: 1rem;"
                    @click="clkCreateNewChildOrganism(item)"
                    class="bg-grey-3 q-ma-sm"
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
              <q-card-actions align="center">
                <q-btn
                  flat
                  label="Depois"
                  no-caps
                  rounded
                  color="primary"
                  @click="dialogInsertNewOrganismGroup = false"
                />
                <!-- <q-btn
                  unelevated
                  rounded
                  label="Confirmar"
                  no-caps
                  color="primary"
                  @click="createNewChildOrganismUsingGroupConfig"
                /> -->
              </q-card-actions>
            </q-card>
          </q-dialog>
          <div class="row justify-start">
            <div class="col-8 q-gutter-md">
              <div class="row">
                <div class="text-h5 col"> Grupo de organismo criados</div>
                <div class="col">
                  <q-btn 
                    no-caps
                    outline
                    icon="add"
                    rounded
                    @click="dialogInsertNewOrganismGroup = true"
                    label="Adicionar grupo"
                    />
                  </div>
              </div>
              <div class="text-caption text-subtitle1" v-if="childOrganismsData.length">
                Clique em um dos organismos abaixo para exibir detalhes
              </div>
              <q-list v-if="childOrganismsData.length">
                <q-item
                  clickable
                  v-for="child in childOrganismsData"
                  :key="child"
                  style="border-radius: 1rem;"
                  @click="clkOpenChildOrganismDetail(child)"
                  class="bg-green-3 q-ma-sm"
                >
                  <q-item-section>
                    <q-item-label class="text-subtitle1"> {{ child.organismName }}</q-item-label>
                    <q-item-label caption lines="2">Criado em {{ child.createdAt }}</q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <q-icon name="star" color="yellow" />
                  </q-item-section>
                </q-item>
              </q-list>
              <div v-else class="text-subtitle1">
                Nenhum grupo de organismo criado <q-icon name="warning" color="warning" size="md"/>
              </div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
      <q-dialog v-model="dialogSwapPastorFromFunction.open" @hide="clearDialogSwapData">
        <q-card style="border-radius: 1rem">
          <q-card-section>
            <div class="text-h6 text-center">Substituição</div>
            <div>O usuário será substituido da função</div>
          </q-card-section>
          <q-card-section align="center" class="q-gutter-sm">
            <q-input
              v-model="dialogSwapPastorFromFunction.observation"
              filled
              label="Observação"
              hint="Informe o motivo"
              class="q-pa-sm q-mb-lg"
            />
            <q-input
              filled
              type="date"
              v-model="dialogSwapPastorFromFunction.finalDate"
              label="Data final"
              hint="Informe a data final de ocupação da função"
              class="q-pa-sm q-mb-lg"
            />
            <q-select
              class="q-pa-sm"
              filled
              use-input
              label="Nome do usuário"
              option-label="userName"
              v-model="dialogSwapPastorFromFunction.newUser"
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
          <q-card-actions align="center">
            <q-btn
              flat
              label="Voltar"
              no-caps
              rounded
              @click="clearDialogSwapData"
              color="primary"
            />
            <q-btn
              v-if="dialogSwapPastorFromFunction.isPastorFromParoquia === false"
              label="Confirma"
              no-caps
              @click="clkConfirmSwapUser"
              rounded
              color="primary"
            />
            <q-btn
              v-else-if="dialogSwapPastorFromFunction.isPastorFromParoquia === true"
              label="Confirma"
              no-caps
              @click="clkConfirmSwapPastor"
              rounded
              color="primary"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogCloseOrganism.open"
      >
        <q-card style="border-radius: 1rem; width: 400px">
          <q-card-section align="center" class="text-h6">
            Encerrar organismo?
          </q-card-section>
          <q-card-section>
            <q-input 
              type="date" 
              v-model="dialogCloseOrganism.finalDate"
              filled
              label="Data fim"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Depois"
              no-caps
              rounded
              color="primary"
              @click="dialogCloseOrganism.open = false"
            />
            <q-btn
              flat
              label="Encerrar"
              no-caps
              rounded
              color="red"
              @click="confirmCloseOrganism"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- <q-dialog
        v-model="dialogAddSecretary.open"
        @hide="clearSecretarydialog"
      >
        <q-card style="width: 800px;">
          <q-card-section align="center" class="text-h6">
            Selecione o usuário
            <q-select
              class="q-pa-sm"
              filled
              use-input
              label="Nome do usuário"
              option-label="userName"
              v-model="dialogAddSecretary.selectedUser"
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
          <q-card-section align="left" class="text-h6 no-padding q-ml-lg">
            Dias
            <q-btn
              color=primary
              flat
              icon="add"
              @click="insertDay"
            >
              <q-tooltip>
                Adicionar dia
              </q-tooltip>            
            </q-btn>
          </q-card-section>
          <q-card-section>
            <div 
              class="row q-mb-lg no-padding q-ml-lg" 
              v-for="(day, iDay) in dialogAddSecretary.days"
              :key="day"  
            >
              <q-select 
                class="col-4 q-pa-sm"
                type="text" 
                label='Dia'
                :options="diasDaSemana"
                v-model="dialogAddSecretary.days[iDay].value"
              />
              <div class="column q-ml-md">
                <q-chip
                  class="row q-mr-xl"  
                  size="10px"
                  color="primary" 
                  text-color="white"
                  v-for="(time, iTime) in dialogAddSecretary.days[iDay].time"
                  :key="time"
                >
                  {{ time.initial }} - {{ time.final }}
                  <q-btn
                    icon="close"
                    flat
                    color="primary"
                    class="bg-white q-ml-sm"
                    round
                    @click="removeTime(iDay, iTime)"
                    size="4px"
                  />
                </q-chip>
              </div>
              <q-btn
                class="q-ml-xl"
                v-if="day.value !== ''"
                icon="more_time"
                color="primary"
                flat
                round
                @click="addTime(iDay)"
              >
              <q-tooltip>
                Adicionar horário
              </q-tooltip>
              </q-btn>
              <q-btn
                icon="delete"
                round
                @click="removeDay(iDay)"
                flat
                color="red"
                rounded
              />
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Depois"
              no-caps
              rounded
              color="primary"
              @click="clearSecretarydialog"
            />
            <q-btn
              label="Adicionar"
              unelevated
              no-caps
              rounded
              color="primary"
              @click="confirmAddSecretary"
            />
          </q-card-actions>
        </q-card>
      </q-dialog> -->
      <q-dialog
        @hide="clearTimeDialog"
        v-model="dialogAddTime.open"
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
              v-model="dialogAddTime.initial"
            />
            <q-input 
              type="time" 
              label="Fim" 
              outlined
              v-model="dialogAddTime.final"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Voltar"
              no-caps
              rounded
              color="primary"
              @click="clearTimeDialog"
            />
            <q-btn
              label="Adicionar"
              unelevated
              no-caps
              rounded
              color="primary"
              @click="confirmAddTime"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </q-page-container>
  <DialogPhoneMobileEmail
    :open="dialogAddPhoneMobileEmail.open"
    :dataProp="dialogAddPhoneMobileEmail.data"
    :type="dialogAddPhoneMobileEmail.type"
    @confirm="confirmAddPhoneMobileEmail"
    @closeDialog="clearDialogAddPhoneMobileEmail"
  />
  <DialogAddress
    :open="dialogConfirmAddress.open"
    :addressDataProp="dialogConfirmAddress.data"
    @confirmAddress="confirmAddress"
    @closeDialog="clearAddressInputs"
  />
  <!-- <DialogAddServices
    :open="dialogAddServices.open"
    :action="dialogAddServices.action"
    :editData="this.dialogAddServices.data"
    @addServicesData="confirmServicesData"
    @closeDialog="closeDialogAddServices"
  /> -->
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
  <q-dialog
    v-model="dialogAddDayInMonth.open"
  >
    <q-card style="width:300px">
      <q-card-section>
        <strong class="q-ma-md">Selecione o dia:</strong>
        <div
          class="row"
        >
          <q-select
            class="q-pa-sm col-10"
            filled
            use-input
            label="Selecione o dia"
            option-label="label"
            :options="dialogAddServices.daysOfWeek"
            v-model="dialogAddServices.selectedEventOption.weeks[dialogAddDayInMonth.index].value"
            :loading="false"
          />
          <q-btn
            class="col-2 q-pa-sm"
            color="primary"
            flat
            icon="schedule"
            rounded
            @click="addTimeForDayInMonth()"
          >
            <q-tooltip>Selecione o horário</q-tooltip>
          </q-btn>
        </div>
        <q-chip 
          v-if="dialogAddServices.selectedEventOption.weeks[dialogAddDayInMonth.index].value 
          && dialogAddServices.selectedEventOption.weeks[dialogAddDayInMonth.index].value.times 
          && dialogAddServices.selectedEventOption.weeks[dialogAddDayInMonth.index].value.times.initial"
          color="primary"
          text-color="white"
        >
          {{ dialogAddServices.selectedEventOption.weeks[dialogAddDayInMonth.index].value.times.initial }}
          <q-tooltip>Horário de início</q-tooltip>
        </q-chip>
      </q-card-section>
      <q-card-actions align=center>
        <q-btn
          color="primary"
          @click="confirmAddDayInMonth"
        >
          Confirmar
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog
    @hide="clearDialogInserTimeInMonth"
    v-model="dialogInsertTimeInMonth.open"
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
          v-model="dialogInsertTimeInMonth.initial"
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
          @click="confirmAddTimeForDayInMonth"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <DialogOrganismDetail
    :open="dialogShowOtherDetail.open"
    :orgData="dialogShowOtherDetail.orgData"
    :orgFields="dialogShowOtherDetail.orgFields"
    :orgFunc="dialogShowOtherDetail.orgFunc"
    :isAdm="true"
    @closeDialog="closeDialogOrganismDetail"
    @goToDetail="goToDetail"
  />
  <DialogAddPastoralStatus
    :pastoralStatusTypes="pastoralStatusTypes"
    :open="dialogAddPastoralStatus.open"
    :editStatus="statusData"
    :route="`organism`"
    @closeDialog="closeDialogPastoralStatus"
    @confirm="clkCreatePastoralStatus"
  />
  <DialogAddStatus
    :open="dialogAddStatus.open"
    @closeDialog="clearDialogAddStatus"
    @confirm="confirmAddStatus"
  />

</template>
<script>
import { defineComponent } from "vue";
import CardPastor from '../../components/CardPastor.vue'
import CardServices from '../../components/CardServices.vue'
import CardOrganism from '../../components/CardOrganism.vue'
import CardPhoneMobileEmail from '../../components/CardPhoneMobileEmail.vue'
import CardBankData from '../../components/CardBankData.vue'
import DialogPhoneMobileEmail from '../../components/DialogPhoneMobileEmail.vue'
import CardFunction from '../../components/CardFunction.vue'
// import DialogAddPerson from '../../components/DialogAddPerson.vue'
import CardFormation from '../../components/CardFormation.vue'
import CardAddress from '../../components/CardAddress.vue'
import DialogAddPastoralStatus from '../../components/DialogAddPastoralStatus.vue'
import DialogAddStatus from '../../components/DialogAddStatus.vue'
import CardPerson from '../../components/CardPerson.vue'
import DialogOrganismDetail from '../../components/DialogOrganismDetail.vue'
import DialogAddress from '../../components/DialogAddress.vue'
import { savedOrganismList } from "stores/organismList";
import CardMaritalStatus from '../../components/CardMaritalStatus.vue'
import useFetch from "../../boot/useFetch";
import { date } from "quasar";
export default defineComponent({
  name: "OrganismDetail",
  components: {
    CardFunction, CardOrganism, DialogAddress,
    CardAddress, CardPerson, CardMaritalStatus,
    CardBankData, CardPhoneMobileEmail, CardFormation,
    DialogPhoneMobileEmail, CardPastor, DialogOrganismDetail, 
    DialogAddPastoralStatus, CardServices, DialogAddStatus
  },
  data() {
    return {
      dialogAddStatus: {
        open: false
      },
      diasDaSemana: [
        { label: 'Domingo', value: 'domingo' },
        { label: 'Segunda-feira', value: 'segunda-feira' },
        { label: 'Terça-feira', value: 'terça-feira' },
        { label: 'Quarta-feira', value: 'quarta-feira' },
        { label: 'Quinta-feira', value: 'quinta-feira' },
        { label: 'Sexta-feira', value: 'sexta-feira' },
        { label: 'Sábado', value: 'sábado' }
      ],
      tab: 'organismData',
      lastFuncIndex: -1,
      usersOptions: [],
      otherOrganism: false,
      filiatedOrganismsList: [],
      organismVinculated: '',
      organismTypeId: null,
      organismName: '',
      organismConfigStyle: '',
      userSelected: '',
      organism: null,
      fields: [],
      selectedFunc: "",
      selectedFuncIndex: "",
      organismConfigOptions: [],
      solicitationData: [],
      newOrganism: {},
      organismSelected: '',
      addPerson: {
        dialogOpen: false,
        fieldIndex: null,
        usersOptions: null,
        userSelected: null,
        data: {
          name: '',
        },
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
      dialogInsertUserInFunction:{
        initialDate: '',
        open: false,
        functionType: '',
        selectedFunc: null,
        selectedFuncIndex: null,
        userSelected: null,
        userInstallation: ''
      },
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
      dialogAddPhoneMobileEmail: {
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
      dialogInsertNewOrganismGroup: false,
      dialogDeletePastorFromFunction: {
        obsText: "",
        finalDate: "",
        functionUserId: "",
        ataKey: '',
        uninstallerUser: '',
        open: false,
        userData: {},
      },
      dialogAddSecretary: {
        open: false,
        fieldIndex: null,
        action: 'add',
        selectedUser: '',
        days: [],
        time: []
      },
      dialogDeleteUserFromFunction: {
        obsText: "",
        finalDate: "",
        functionUserId: "",
        open: false,
        userData: {},
      },
      dialogOpenObservation: {
        open: false,
        functionUserId: "",
        obsText: "",
        data: {},
      },
      dialogCloseOrganism: {
        open: false,
        finalDate: ''
      },
      organismData: {
        organismConfigId: '',
        fields: [],
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
      organismGroupConfigId: '',
      dialogAddBankData: {
        open: false,
        tabsIndex: null,
        fieldIndex: null,
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
      functions: [],
      organismList: [],
      organismLinks: [],
      childOrganismsData: [],
      parentOrganism: [],
      childOrganism: [],
      
      linkedOrganismsData: [],
      organismConfigsList: [],
      childOrganismsConfigData: [],
      organismConfigName: '',
      dialogLinks: false,
      parentOrganismId: '',
      organismConfigId: '',
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: "",
      },
      relations: [],
      loadingState: false,
      organismRelationId: '',
      selectedFuncIndexToInserPastor: null,
      congregacaoSedeAddress: '',
      parentData: null,
      dialogShowOtherDetail: {
        open: false,
        orgData: {},
        orgFields: [],
        orgFunc: [],
        orgId: null
      },
      otherData: null,
      idLegado: null,
      dialogInserPastorInParoquia: {
        open: false,
        user: null,
        pastorSelected: null,
        initialDate: null,
        funcId: null
      },
      hidePastorInParoquia: false,
      dialogSwapPastorFromFunction: {
        open: false,
        data: null,
        observation: null,
        finalDate: null,
        newUser: null,
        isPastorFromParoquia: false
      },
      dialogAddTime: {
        open: false,
        index: null,
        initial: null,
        final: null
      },
      organismParentData: null,
      organismChildData: null,
      pastoralStatusData: null,
      inactivePastoralStatusData: null,
      dialogAddPastoralStatus: {
        open: false
      },
      pastoralStatusTypes: null,
      statusData: null,
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
      dialogAddTimeForDay: {
        open: false,
      },
      dialogAddDayInMonth: {
        open: false,
        index: null,
        count: 0,
        initial: null
      },
      dialogInsertTimeInMonth: {
        open: false,
        index: null,
        initial: null
      },
      sameOrganismCalled: false,
      undefinedCallee: false,
      organismCallerSelected: '',
      organismCalleeSelected: [],
      organismsFromThisParish: [],
    };
  },
  watch: {
    $route(to, from) {
      if (to.query.organismId !== from.query.organismId) {
        this.getOrganismDetailById();
      }
    }
  },
  mounted() {
    this.$q.loading.hide()
  },
  beforeMount(){
    this.getOrganismDetailById();
    this.getOrganismsConfigs()
    this.getParentOrganismsById()
    this.getChildOrganismsConfigsByOrganismId()
    this.getChildOrganismsById()
    this.getPastoralStatusTypes()
    this.getEventsOptions()
    this.getDaysOfWeek()
    this.getParishChildOrganismsList()
  },
  unmounted() {
    const currentRoute = this.$route
    if (currentRoute && !currentRoute.path.includes('/admin/organismsList')) {
      this.clearOrganismStore()
    }
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

      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify(r.errorMessage)
          return
        }
        this.$q.notify('Usuário criado com sucesso')
        if (this.dialogAddUser.param === 'secretary') {
          this.dialogAddSecretary.userSelected = {
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
        this.usersOptions = []
        this.clearDialogConfirmAddFunctionUser()
        this.$q.notify('Digite novamente o nome para adicionar')
      })
    },
    openDialogAddUser(param) {
      this.dialogAddUser.param = param
      this.dialogAddUser.open = true
    },
    confirmAddStatus(status, data) {
      let qry
      console.log(data, status)
      if (status === 'license' ) {
        qry = {
          subtype: status,
          licenseOption: data.selectedlicenseOption,
          dates: {
            initialDate: data.initialDate,
            finalDate: data.finalDate
          },
          deadline: null,
        }
        if (!data.noDeadline) {
          qry.deadline = data.deadline
        }
      } else if (status === 'trainee') {
        qry = {
          subtype: status,
          organismSelected: data.organismSelected.organismId,
          guildingPastor: data.guildingPastor.userIdString,
          dates: {
            initialDate: data.initialDate,
            finalDate: data.finalDate
          },
          deadline: null,
        }
        if (!data.noDeadline) {
          qry.deadline = data.deadline
        }
      } else if (status === 'ceded') {
        qry = {
          subtype: status,
          local: data.local,
          where: data.where,
          dates: {
            initialDate: data.initialDate,
            finalDate: data.finalDate
          },
          deadline: null,
        }
        if (!data.noDeadline) {
          qry.deadline = data.deadline
        }
      } else if (status === 'retired') {
        qry = {
          subtype: status,
          dates: {
            initialDate: data.initialDate,
            finalDate: data.finalDate
          },
          deadline: null,
        }
        if (!data.noDeadline) {
          qry.deadline = data.deadline
        }
      } else if (status === 'student') {
        qry = {
          subtype: status,
          selectedGoal: data.selectedGoal,
          where: data.where,
          dates: {
            initialDate: data.initialDate,
            finalDate: data.finalDate
          },
          deadline: null,
        }
        if (!data.noDeadline) {
          qry.deadline = data.deadline
        }
      } else if (status === 'withoutCall') {
        qry = {
          subtype: status,
          position: data.optionSelected,
          dates: {
            initialDate: data.initialDate,
            finalDate: data.finalDate
          },
          deadline: null
        }
        if (!data.noDeadline) {
          qry.deadline = data.deadline
        }
      } else if (status === 'withCall') {
        qry = {
          caller: data.selectedCallOption,
          selectedPastor: data.selectedPastor,
          dates: {
            initialDate: data.initialDate,
            finalDate: data.finalDate
          },
          organism: data.selectedOrganism,
          deadline: null
        }
        if (!data.noDeadline) {
          qry.deadline = data.deadline
        }
      }
    },
    clearDialogAddStatus() {
      this.dialogAddStatus.open = false
    },
    testDialog() {
      this.dialogAddStatus.open = true
    },
    async getParishChildOrganismsList() {
      const opt = {
        route: '/desktop/adm/getChildOrganismsFromParishByChildId',
        body: {
          organismChildId: this.$route.query.organismId
        }
      }
      const r = await useFetch(opt)
      if (r.error) return
      this.organismsFromThisParish = r.data
    },
    getFiliatedOrganismsList(val, update, abort) {
      if(val.length < 3) {
        this.$q.notify('Digite no mínimo 3 caracteres')
        abort()
        return
      }
      const opt = {
        route: "/desktop/adm/getFiliatedOrganismsList",
        body: {
          searchString: val,
          page: 1,
          rowsPerPage: 50
        }
      };
      useFetch(opt).then((r) => {
        update(() => {
          this.filiatedOrganismsList = r.data.list;
        })
      });
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
    getOrganismCallerData() {
      this.organismCallerSelected = {
        city: this.organismData.fields[7].value[0].city,
        organismId: this.$route.query.organismId,
        organismConfigName: this.organismConfigName,
        organismStyle: this.organismConfigStyle,
        organismConfigId: this.organismConfigId,
        nome: this.organismData.fields[0].value,
        apelido: this.organismData.fields[1].value,
        endereco: this.organismData.fields[7].value
      }
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
    validateAtaKeyFormat(value) {
      const regex = /^([A-Z]{3}-[A-Z]{3}-\d{3}-\d{4}-\d{2}-[a-z])$/;
      if (regex.test(value)) {
        return true;
      }else{
        return this.$q.notify('Formato inválido. Por favor, revise os dados digitados na chave-ata');
      }
    },
    undefinedCalleeFunction(){
      this.undefinedCallee ? this.undefinedCallee = false :this.dialogInsertUserInFunction.calleeDate = ''
    },
    changeOrganismCaller() {
      this.sameOrganismCalled === true ? this.organismCalleeSelected = [] : this.organismCalleeSelected.push(this.organismCallerSelected) 
    },
    goToDetail() {
      this.$router.push('/admin/organismDetail?organismId=' + this.dialogShowOtherDetail.orgId )
    },
    clearDialogAddServices() {
      this.dialogAddServices.open = false
      this.dialogAddServices.selectedEventOption = null
      this.dialogAddServices.selectedDay = null
      this.dialogAddServices.selectedValue = null
      this.dialogAddServices.fieldIndex = null
    },
    clearTimeForDayDialog() {
      this.dialogAddTimeForDay.initial = null
      this.dialogAddTimeForDay.open = false
    },
    clearDialogInserTimeInMonth() {
      this.dialogInsertTimeInMonth.open = false
      this.dialogInsertTimeInMonth.initial = null
    },
    confirmAddDayInMonth() {
      this.dialogAddDayInMonth.count++
      this.dialogAddDayInMonth.open = false
    },
    confirmAddTimeForDayInMonth() {
      this.dialogAddServices.selectedEventOption.weeks[this.dialogAddDayInMonth.index].value.times.initial = this.dialogInsertTimeInMonth.initial

      this.dialogAddTimeForDay.initial = null
      this.dialogInsertTimeInMonth.open = false
    },
    addTimeForDayInMonth() {
      this.dialogInsertTimeInMonth.open = true,
      this.dialogInsertTimeInMonth.index = this.dialogAddDayInMonth.index
    },
    addDayInMonth(i) {
      this.dialogAddServices.selectedEventOption.weeks[i].value.push({
        day: null,
        time: null
      })
      this.dialogAddDayInMonth.count++
    },
    confirmAddTimeForDay() {
      if (this.dialogAddServices.selectedEventOption.days) {
        this.dialogAddServices.selectedEventOption.days[this.dialogAddServices.selectedDay].value.times.initial = this.dialogAddTimeForDay.initial;
      } else if (this.dialogAddServices.selectedEventOption.weeks) {
        this.dialogAddServices.selectedEventOption.weeks[this.dialogAddServices.selectedDay].value[this.dialogAddServices.selectedValue].time = this.dialogAddTimeForDay.initial;
      }
      this.dialogAddTimeForDay.open = false
    },
    addTimeForDay(iDay, iValue) {
      this.dialogAddServices.selectedDay = iDay
      this.dialogAddServices.selectedValue = iValue
      this.dialogAddTimeForDay.open = true
    },
    getDaysOfWeek() {
      const opt = {
        route: '/desktop/adm/getDaysOfWeek'
      }
      useFetch(opt).then((r) => {
        this.dialogAddServices.daysOfWeek = r.data
      })
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
    removeTime(iDay, iTime) {
      this.dialogAddSecretary.days[iDay].time.splice(iTime, 1)
    },
    editSecretary(fieldIndex) {
      this.dialogAddSecretary.selectedUser = this.organismData.fields[fieldIndex].value[0].user
      this.dialogAddSecretary.days = this.organismData.fields[fieldIndex].value[0].days
      this.dialogAddSecretary.fieldIndex = fieldIndex
      this.dialogAddSecretary.action = 'edit'
      this.dialogAddSecretary.open = true
    },
    closeDialogPastoralStatus() {
      this.statusData = null
      this.dialogAddPastoralStatus.open = false
    },
    editStatus(status) {
      this.statusData = status
      this.dialogAddPastoralStatus.open = true
    },
    clkCreatePastoralStatus(organism, initialDate, finalDate, status, subStatus, local, user, editId) {
      if (editId !== '') {
        const opt = {
          route: '/desktop/adm/updatePastoralStatus',
          body: {
            userId: user._id,
            initialDate: initialDate,
            finalDate: finalDate,
            organismId: this.$route.query.organismId,
            statusId: status._id,
            subStatusId: subStatus._id,
            localId: local._id,
            editId : editId
          }
        }
        useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente.')
          return
        } else {
          this.$q.notify('Status atualizado com sucesso')
          this.getOrganismDetailById()
          this.clearDialogAddPastoralStatus()
        }
      })
      return
      }
      const opt = {
        route: '/desktop/adm/createPastoralStatus',
        body: {
          userId: user._id,
          initialDate: initialDate,
          finalDate: finalDate,
          organismId: this.$route.query.organismId,
          statusId: status._id,
          subStatusId: subStatus._id,
          localId: local._id
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente.')
          return
        } else {
          this.$q.notify('Status adicionado com sucesso')
          this.getOrganismDetailById()
          this.clearDialogAddPastoralStatus()
        }
      })
    },
    clearDialogAddPastoralStatus () {
      this.dialogAddPastoralStatus.open = false
    },
    getPastoralStatusTypes () {
      const opt = {
        route: '/desktop/adm/getPastoralStatusTypes'
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde')
        } else {
          this.pastoralStatusTypes = r.data
        }
      })
    },
    addPastoralStatus() {
      this.dialogAddPastoralStatus.open = true
    },
    verifyPastoralStatus() {
      if (this.pastoralStatusData && this.pastoralStatusData.length > 0) {
        this.inactivePastoralStatusData = []
        let activeStatus = []
        this.pastoralStatusData.forEach((status) => {
          if (status.dates.finalDate && status.dates.finalDate !== '') {
            this.inactivePastoralStatusData.push(status)
          } else if (!status.dates.finalDate || status.dates.finalDate === '') {
            activeStatus.push(status)
            this.pastoralStatusData = activeStatus
          }
        })
      }
    },
    clearTimeDialog() {
      this.dialogAddTime.initial = null
      this.dialogAddTime.final = null
      this.dialogAddTime.index = null
      this.dialogAddTime.open = false
    },
    confirmAddTime () {
      if (!this.dialogAddSecretary.days[this.dialogAddTime.index].time) {
        this.dialogAddSecretary.days[this.dialogAddTime.index].time = []
      }
      this.dialogAddSecretary.days[this.dialogAddTime.index].time.push({initial: this.dialogAddTime.initial, final: this.dialogAddTime.final})
      this.dialogAddTime.open = false
    },
    addTime(i) {
      this.dialogAddTime.open = true
      this.dialogAddTime.index= i
    },
    removeDay(i) {
      this.dialogAddSecretary.days.splice(i, 1)
    },
    insertDay() {
      this.dialogAddSecretary.days.push({ value: ''});
    },
    removeSecretary(fieldIndex, isecretary) {
      this.organismData.fields[fieldIndex].value.splice(isecretary, 1);
    },
    clearOrganismStore() {
      savedOrganismList().list =[],
      savedOrganismList().page = 1,
      savedOrganismList().rowsPerPage = 10,
      savedOrganismList().rowsNumber = 0,
      savedOrganismList().sortBy = '',
      savedOrganismList().selectFilter = '',
      savedOrganismList().filterCity = ''
    },
    clearDialogSwapData(){
      this.dialogSwapPastorFromFunction.open = false
      this.dialogSwapPastorFromFunction.data = null
      this.dialogSwapPastorFromFunction.observation = null
      this.dialogSwapPastorFromFunction.finalDate = null
      this.dialogSwapPastorFromFunction.newUser = null
    },
    clkConfirmSwapUser() {
      const organismFunctionUserId = this.dialogSwapPastorFromFunction.data._id
      const finalDate = this.dialogSwapPastorFromFunction.finalDate
      const newUser = this.dialogSwapPastorFromFunction.newUser
      const observation = this.dialogSwapPastorFromFunction.observation
      const opt = {
        route: '/desktop/adm/swapUserFromFunction',
        body: {
          organismFunctionUserId: organismFunctionUserId,
          obs: observation,
          finalDate: finalDate,
          newUser: newUser
        }
      }
      useFetch(opt).then((r) => {
        this.clearDialogSwapData()
        if (r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente')
        } else {
          this.getOrganismDetailById()
        }
      })
    },
    clkAddMaritalStatus (fieldIndex, tabsIndex) {
      this.maritalStatus = {
        open: true,
        tabsIndex,
        fieldIndex,
        data: {
          status: '',
          spouses: []
        },
        action: 'add',
      }
    },
    // confirmCloseOrganism() {
    //   const opt = {
    //     route: '/desktop/adm/closeOrganism',
    //     body: {
    //       organismId: this.$route.query.organismId,
    //       finalDate: this.dialogCloseOrganism.finalDate
    //     }
    //   } 
    //   useFetch(opt).then((r) => {
    //     if (r.error) {
    //       this.$q.notify('Ocorreu um erro, tente novamente')
    //       this.dialogCloseOrganism.open = false
    //     } else {
    //   ;    this.$q.notify('Organismo encerrado com sucesso')
    //       this.dialogCloseOrganism.open = false
    //       this.$router.push('/admin/organismsList')
    //     }
    //   })
    // },
    clkConfirmSwapPastor() {
      const organismFunctionUserId = this.dialogSwapPastorFromFunction.data._id
      const finalDate = this.dialogSwapPastorFromFunction.finalDate
      const newUser = this.dialogSwapPastorFromFunction.newUser
      const observation = this.dialogSwapPastorFromFunction.observation
      const organismId = this.$route.query.organismId
      const opt = {
        route: '/desktop/adm/swapPastorInPastorFunctionInParoquia',
        body: {
          organismFunctionUserId: organismFunctionUserId,
          obs: observation,
          finalDate: finalDate,
          newUser: newUser,
          organismId
        }
      }
      useFetch(opt).then((r) => {
        this.clearDialogSwapData()
        if (r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente')
        } else {
          this.getOrganismDetailById()
        }
      })
    },
    swapPastorToFunctionInCongregacao(pastor) {
      this.dialogSwapPastorFromFunction.data = pastor
      this.dialogSwapPastorFromFunction.open = true
      this.dialogSwapPastorFromFunction.isPastorFromParoquia = false
    },
    swapPastorToFunctionPastor(user) {
      this.dialogSwapPastorFromFunction.data = user
      this.dialogSwapPastorFromFunction.open = true
      this.dialogSwapPastorFromFunction.isPastorFromParoquia = true
    },
    verifyPastorInParoquia() {
      this.functions.forEach((func) => {
        if (func.functionName === 'Pastor em Paróquia'){
          this.dialogInserPastorInParoquia.funcId = func._id
          if (func.properties.data.properties.hideFunctionDetail === true) {
            this.hidePastorInParoquia = true
          }
        }
      })
    },
    clearDialogInsertPastor() {
      this.dialogInserPastorInParoquia.open = false
      this.dialogInserPastorInParoquia.pastorSelected = null
      this.dialogInserPastorInParoquia.initialDate = null
      this.dialogInserPastorInParoquia.funcId = null
    },
    insertPastorToFunctionParoquia() {
      const opt = {
        route: '/desktop/adm/addPastorToPastorFunctionInParoquia',
        body: {
          userId: this.dialogInserPastorInParoquia.pastorSelected.userId,
          dates: {
            initialDate: this.dialogInserPastorInParoquia.initialDate
          },
          organismFunctionId: this.dialogInserPastorInParoquia.funcId
        }
      } 
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente')
          this.clearDialogInsertPastor()
        } else {
          this.$q.notify('Pastor inserido')
          this.clearDialogInsertPastor()
          this.getOrganismDetailById()
          this.getOrganismsConfigs()
          this.getParentOrganismsById()
          this.getChildOrganismsConfigsByOrganismId()
          this.getChildOrganismsById()
        }
      })
    },
    clkShowDialogLink (child) {
      const opt = {
        route: "/desktop/adm/getOrganismDetailById",
        body: {
          organismId: child.childId,
        },
      };
      useFetch(opt).then((r) => {
        if (r.error) return 
        else {
          this.dialogShowOtherDetail.orgData = r.data.organismData
          this.dialogShowOtherDetail.orgFields = r.data.organismData.fields
          this.dialogShowOtherDetail.orgFunc = r.data.functions
          this.dialogShowOtherDetail.orgId = r.data._id
          this.dialogShowOtherDetail.open = true
        }
      })
    },
    closeDialogOrganismDetail() {
      this.dialogShowOtherDetail.open = false
    },
    routeToDetail() {
      this.$router.push('/admin/organismDetail?organismId=' + this.dialogShowOtherDetail.orgId)
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
          this.dialogShowOtherDetail.orgData = r.data.organismData
          this.dialogShowOtherDetail.orgFields = r.data.organismData.fields
          this.dialogShowOtherDetail.orgFunc = r.data.functions
          this.dialogShowOtherDetail.orgId = r.data._id
          this.dialogShowOtherDetail.open = true
        }
      })
    },
    clkShowDialogParentDetail(parent) {
      this.clkShowDetailOrganism(parent.parentId)
    },
    confirmAddSecretary() {
      if (!this.organismData.fields[this.dialogAddSecretary.fieldIndex].value) {
        this.organismData.fields[this.dialogAddSecretary.fieldIndex].value = []
      }
      if (this.dialogAddSecretary.action === 'edit' 
        && this.organismData.fields[this.dialogAddSecretary.fieldIndex].value.length > 0) {
          this.organismData.fields[this.dialogAddSecretary.fieldIndex].value.splice(0, 1)
        }
      this.organismData.fields[this.dialogAddSecretary.fieldIndex].value.push({
        days: this.dialogAddSecretary.days,
        user: {
          userName: this.dialogAddSecretary.selectedUser.userName,
          _id: this.dialogAddSecretary.selectedUser._id
        }
      }
      )
      this.$q.notify('Secretária adicionada com sucesso')
      this.clearSecretarydialog()
    },
    // closeDialogAddServices () {
    //   this.dialogAddServices.open = false
    //   this.dialogAddServices.fieldIndex = null
    //   this.dialogAddServices.action = 'add'
    //   this.dialogAddServices.data = null
    // },
    clkAddServices(fieldIndex) {
      this.dialogAddServices.open = true
      this.dialogAddServices.fieldIndex = fieldIndex
    },
    clearSecretarydialog() {
      this.dialogAddSecretary.open = false
      this.dialogAddSecretary.fieldIndex = null
      this.dialogAddSecretary.action = 'add'
      this.dialogAddSecretary.selectedUser = ''
      this.dialogAddSecretary.days = null
    },
    clkAddSecretary(fieldIndex) {
      this.dialogAddSecretary.fieldIndex = fieldIndex,
      this.dialogAddSecretary.action == 'add',
      this.dialogAddSecretary.open = true
    },
    verifyIfHasPastor() {
      this.functions.forEach((func) => {
        if (func.functionName === 'Pastor' && func.users.length) {
          this.existsPastor = true
        }
      })
    },
    goToParentOrganismDetail(parent) {
      const organismRelationId = parent.organismRelationId
      this.$router.replace('/admin/organismDetail?organismId=' + organismRelationId)
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
    clkOpenAddressDialog(fieldIndex) {
      this.dialogConfirmAddress.action = 'add'
      this.dialogConfirmAddress.open = true
      this.dialogConfirmAddress.fieldIndex = fieldIndex
    },
    // confirmServicesData(freq, day, time) {
    //   this.dialogAddServices.open = false
    //   if (this.dialogAddServices.action === 'add') {
    //     if (!this.organismData.fields[this.dialogAddServices.fieldIndex].value) {
    //       this.organismData.fields[this.dialogAddServices.fieldIndex].value = []
    //     }
    //     this.organismData.fields[this.dialogAddServices.fieldIndex].value.push({
    //       frequency: freq, 
    //       days: day,
    //       time: time
    //     })
    //   } else if (this.dialogAddServices.action === 'edit') {
    //     this.organismData.fields[this.dialogAddServices.fieldIndex]
    //     .value[this.dialogAddServices.ivalue] = {
    //       frequency: freq, 
    //       days: day,
    //       time: time
    //     }
    //   }
    // },
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
    removeThisAddress(fieldIndex, valueIndex) {
      this.organismData.fields[fieldIndex].value.splice(valueIndex, 1);
    },
    clkSaveLink() {
      this.dialogLinks = false
      this.$q.notify("Vínculos criados com sucesso.")
    },
    removeServicesData (fieldIndex, iValue) {
      this.organismData.fields[fieldIndex].value.splice(iValue, 1)
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
    removeFormation (fieldIndex, tabsIndex, field, value, iValue) {
      this
        .userData
        .userDataTabs[tabsIndex]
        .fields[fieldIndex]
        .value
        .splice(iValue, 1)
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
    removePhoneMobileEmail (fieldIndex, iValue) {
      this
        .organismData
        .fields[fieldIndex]
        .value
        .splice(iValue, 1)
    },
    addPhoneMobileEmail(fieldIndex, field) {
      this.dialogAddPhoneMobileEmail.action = 'add'
      this.dialogAddPhoneMobileEmail.hint = field.hint
      this.dialogAddPhoneMobileEmail.label = field.label
      this.dialogAddPhoneMobileEmail.open = true
      this.dialogAddPhoneMobileEmail.type = field.type
      this.dialogAddPhoneMobileEmail.fieldIndex = fieldIndex
      // this.dialogAddPhoneMobileEmail.tabsIndex = tabsIndex
    },
    getUserVisionPermissionByOrganismId() {
      const opt = {
        route: "/desktop/adm/getUserVisionPermissionByOrganismId",
        body: {
          organismId: this.$route.query.organismId
        }
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } 
      });
    },
    editPhoneMobileEmail(fieldIndex, tabsIndex, field, value, iValue) {
      this.dialogAddPhoneMobileEmail.open = true
      this.dialogAddPhoneMobileEmail.type = field.type
      this.dialogAddPhoneMobileEmail.fieldIndex = fieldIndex
      this.dialogAddPhoneMobileEmail.tabsIndex = tabsIndex
      this.dialogAddPhoneMobileEmail.data = {...value}
      this.dialogAddPhoneMobileEmail.action = 'edit'
      this.dialogAddPhoneMobileEmail.iValue = iValue
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
          if(r.data){
            this.solicitationData = r.data
          } else {
            this.solicitationData = 0
          }
        }
      });
    },
    getChildOrganismConfig() {
      const opt = {
        route: "/desktop/adm/getChildOrganismConfig",
        body: {
          parentOrganismConfigId: organismId
        }
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.organismConfigOptions = r.data
        }
      });
    },
    getOrganismsConfigsListBySearchString(val, update) {
      const opt = {
        route: "/desktop/config/getOrganismsConfigs",
        body: {
          searchString: val,
        }
      }
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente')
          return
        }else {
          update(() => {
            this.organismConfigsList = r.data
          })
        }
      })
    },
    getOrganismsConfigsList() {
      const opt = {
        route: "/desktop/config/getOrganismsConfigsList",
        body: {
          searchString: this.searchString,
          page: this.pagination.page,
          isActive: 1,
          rowsPerPage: this.pagination.rowsPerPage
        }
      }
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente')
          return
        }else {
          this.organismConfigsList = r.data.list
        }
      })
    },
    getChildOrganismsById() {
      const organismId = this.$route.query.organismId
      const opt = {
        route: "/desktop/adm/getChildOrganismsById",
        body: {
          organismId: organismId,
        },
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.childOrganismsData = r.data
        }
      });
    },
    getChildOrganismsConfigsByOrganismId() {
      const organismId = this.$route.query.organismId
      const opt = {
        route: "/desktop/adm/getChildOrganismsConfigsByOrganismId",
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
    getOrganismDetailById() {
      const organismId = this.$route.query.organismId
      const opt = {
        route: "/desktop/adm/getOrganismDetailById",
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
          // this.pastoralStatusData = r.data.pastoralStatus.data
          this.organismParentData = r.data.relations.parent
          this.organismChildData = r.data.relations.child
          if (this.organismConfigName === 'Paróquia') {
            if (this.organismChildData.length === 1) {
              this.$router.push('/admin/organismDetail?organismId=' + this.organismChildData[0].childId)
            }
          }
          this.parentData = r.data.parentData
          this.idLegado = r.data.idLegado
          this.verifyPastoralStatus()
          this.verifyIfHasPastor()
          this.verifyPastorInParoquia()
          for(let i = 0; r.data.relations.length > i; i++) {
            if(r.data.relations[i].organismRelationIsMain === 'SIM') {
              this.congregacaoSedeAddress = r.data.relations[i].organismRelationAddress
            }
          }
        }
      });
    },
    removeRelation(i) {
      const opt = {
        route:"/desktop/adm/inactivateRelationById",
        body: {
          relationId: this.relations[i].relationId
        }
      }
      useFetch(opt).then((r) => {
        if(r.error) {
          this.$q.notify("Ocorreu um erro")
          return
        }
        this.getOrganismDetailById()
        this.$q.notify("Vínculo cancelado")
      })
    },
    clkOpenChildOrganismDetail(child){
      const childOrganismId = child.childOrganismId
      this.$router.push('/admin/organismDetail?organismId=' + childOrganismId)
      setTimeout(() => {
        location.reload()
      }, 200)
    },
    // createNewChildOrganismUsingGroupConfig(){
    //   if(this.organismGroupConfigId === ''){
    //     this.$q.notify('Selecione uma sugestão ou uma configuração de sua preferência')
    //   }else{
    //     const organismGroupConfigId = this.organismGroupConfigId._id
    //     const organismParentId = this.$route.query.organismId
    //     this.$router.push('/admin/createChildOrganism?organismChildConfigId=' + organismGroupConfigId + '&organismParentId=' + organismParentId)
    //   }
    // },

    async clkCreateNewChildOrganism(item){
      const opt = {
          route: "/desktop/adm/createChildOrganism",
          body: {
            organismData: {
              organismParentId: this.$route.query.organismId,
              organismConfigId: item.organismChildConfigId,
              fields: [{
                label: "Nome",
                type: {
                  type: "string",
                },
                hint: "Informe o nome",
                required: true,
                model: "nome",
                value: item.organismConfigName
              }]
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
        this.dialogInsertNewOrganismGroup = false
        this.getChildOrganismsById()
      // const organismChildConfigId = item.organismChildConfigId
      // const organismParentId = this.$route.query.organismId
      // this.$router.push('/admin/createChildOrganism?organismChildConfigId=' + organismChildConfigId + '&organismParentId=' + organismParentId)
    },
    async getLinkedOrganismConfig() {
      if (!this.organismConfigId) {
        await new Promise(resolve => {
          const interval = setInterval(() => {
            if (this.organismConfigId) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
        });
      }
      const opt = {
        route: "/desktop/adm/getLinkedOrganismConfig",
        body: {
          organismConfigId: this.organismConfigId
        }
      };
      useFetch(opt).then(r => {
        this.linkedOrganismsData = r.data;
      });
    },
    getOrganismsConfigs() {
      const opt = {
        route: "/desktop/adm/getOrganismsConfigs",
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.organismConfigOptions = r.data.list
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
    updateOrganismData(){
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
        route: '/desktop/adm/updateOrganismData',
        body: {
          organismData: this.organismData,
          organismId: organismId
        }
      }
      this.$q.loading.show()
      useFetch(opt).then(r => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente')
        } else {
          this.$q.notify('Organismo editado com sucesso!')
          this.getOrganismDetailById()
        }
      })
      // if (this.checkRequiredFields()) {
      // } else {
      //   this.$q.notify("Há campos obrigatórios não preenchidos");
      // }
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
    clkSaveVinculo(organism){
      const organismLinkId = organism.organismId
      const organismId = this.$route.query.organismId
      const opt = {
        route: '/desktop/adm/createRelation',
        body: {
          organismId: organismId,
          organismLinkId: organismLinkId
        }
      }
      this.$q.loading.show()
      useFetch(opt).then(r => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify(r.errorMessage)
        } else {
          this.$q.notify('Vínculo salvo com sucesso!')
          this.getOrganismDetailById()
          this.getParentOrganismsById()
        }
      })
    },
    dialogInsertObservation(user) {
      this.dialogOpenObservation.data = user;
      this.dialogOpenObservation.open = true;
      this.dialogOpenObservation.functionUserId = user.userIdMongo
    },
    addObservationForFunctionUser() {
      if (
        this.dialogOpenObservation.obsText === ''
      ) {
        this.$q.notify("Preencha o campo observação");
        return;
      }
      const opt = {
        route: "/desktop/adm/addObservationForFunctionUser",
        body: {
          obsText: this.dialogOpenObservation.obsText,
          functionUserId: this.dialogOpenObservation.functionUserId
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.getOrganismDetailById();
          this.$q.notify("Observação inserida com sucesso!");
          this.clearDialogAndFunctions();
        }
      });
    },
    clearDialogAndFunctions() {
      this.undefinedCallee = false
      this.selectedFunc = {};
      this.userSelected = "";
      this.dialogInsertUserInFunction.ataKey = ''
      this.functionSelected = "";
      this.dialogOpenObservation.data = {};
      this.dialogDeleteUserFromFunction.data = {};
      this.dialogDeleteUserFromFunction.finalDate = "";
      this.dialogDeleteUserFromFunction.functionUserId = "";
      this.dialogDeleteUserFromFunction.obsText = "";
      this.dialogDeletePastorFromFunction.data = {};
      this.dialogDeletePastorFromFunction.finalDate = "";
      this.dialogDeletePastorFromFunction.functionUserId = "";
      this.dialogDeletePastorFromFunction.obsText = "";
      this.dialogOpenObservation.obsText = "";
      this.dialogDeleteUserFromFunction.open = false;
      this.dialogDeletePastorFromFunction.open = false;
      this.dialogDeletePastorFromFunction.uninstallerUser = ''
      this.dialogOpenObservation.open = false;
      this.dialogInsertUserInFunction.open = false;
      this.dialogInsertUserInFunction.initialDate = '',
      this.dialogInsertUserInFunction.functionType = '',
      this.dialogInsertUserInFunction.open = false,
      this.organismCalleeSelected = []
      this.sameOrganismCalled = false
      this.organismCallerSelected = ''
      this.dialogInsertUserInFunction.installationDate = ''
      this.dialogInsertUserInFunction.calleeDate = ''
      this.dialogInsertUserInFunction.userInstallation = ''
      this.dialogInsertUserInFunction.selectedFunc = null,
      this.dialogInsertUserInFunction.userSelected = null
    },
    dialogOpenDeleteUserFromFunction(user) {
      this.dialogDeleteUserFromFunction.open = true;
      this.dialogDeleteUserFromFunction.userData = user;
    },
    dialogOpenDeletePastorFromFunction(pastor) {
      this.dialogDeletePastorFromFunction.open = true;
      this.dialogDeletePastorFromFunction.userData = pastor;
    },
    getOrganismsList(val, update, abort) {
      if(val.length < 3) {
        this.$q.notify('Digite no mínimo 3 caracteres')
        abort()
        return
      }
      const opt = {
        route: "/desktop/adm/getOrganismsList",
        body: {
          searchString: val,
          page: 1,
          rowsPerPage: 50
        }
      };
      useFetch(opt).then((r) => {
        update(() => {
  
          this.organismList = r.data.list;
        })
      });
    },
    addUserToFunction() {
      let organismFunctionId
      const selectedFuncIndex = this.dialogInsertUserInFunction.selectedFunc;
      if(
        this.dialogInsertUserInFunction.functionType === 'Pastor'
      ){
        if(
        (this.dialogInsertUserInFunction.calleeDate === '' && !this.undefinedCallee) ||
        !this.organismCalleeSelected.length > 0 ||
        this.organismCallerSelected === '' ||
        !this.dialogInsertUserInFunction.userSelected
        ){
          this.$q.notify("Preencha data de instalação, organismo que atende, o pastor e quem chamou");
          return;
        }
      }
      if (this.dialogInsertUserInFunction.userSelected === "") {
        this.$q.notify("Preencha usuário e a data do chamado");
        return;
      }
      if (this.verifyIfUserIsAlreadyInFunction(selectedFuncIndex, this.dialogInsertUserInFunction.userSelected.userIdMongo) === true) {
        this.$q.notify('Usuário já incluído nesta função')
        return
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
      if(this.dialogInsertUserInFunction.functionType === 'Pastor'){
        let organismsCalledIds = []
        this.organismCalleeSelected.forEach((organism) => {
          organismsCalledIds.push({_id: organism.organismId})
        })

        opt.body.subtype = 'chamado'
        opt.body.organismCallerId = this.organismCallerSelected.organismId

        opt.body.organismCalledId = organismsCalledIds,
        opt.body.ataKey = this.dialogInsertUserInFunction.ataKey ? this.dialogInsertUserInFunction.ataKey : ''
        opt.body.installation = {
          date: this.dialogInsertUserInFunction.installationDate,
          userIdInstallation: this.dialogInsertUserInFunction.userInstallation._id
        }
        opt.body.call = {
          date: this.dialogInsertUserInFunction.initialDate,
          finalDate: this.undefinedCallee ? 'undefined' : this.dialogInsertUserInFunction.calleeDate
        }
      }
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
    verifyIfUserIsAlreadyInFunction (functionIndex, userIdToVerify) {
      let ret = false
      if ( this.functions && this.functions[functionIndex] && this.functions[functionIndex].functions) {
        this.functions[functionIndex].functions.users.forEach(u => {
          if (u.userId === userIdToVerify) ret = true
        }) 
      } else if (this.functions && this.functions[functionIndex] && this.functions[functionIndex].users) {
        this.functions[functionIndex].users.forEach(u => {
          if (u.userId === userIdToVerify) ret = true
        }) 
      }
      return ret
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
    desinstallPastorFunction() {
      if (
        this.dialogDeletePastorFromFunction.uninstallerUser === ""
      ) {
        this.$q.notify("Preencha o usuário que desinstalou para prosseguir!");
        return;
      }
      const opt = {
        route: "/desktop/adm/desinstallPastorFunction",
        body: {
          functionSubtype: 'chamado',
          uninstallerUserId: this.dialogDeletePastorFromFunction.uninstallerUser._id,
          userFunctionId: this.dialogDeletePastorFromFunction.userData._id,
          desinstalationDate: this.dialogDeletePastorFromFunction.finalDate,
          obs: this.dialogDeletePastorFromFunction.obsText,
          
        },
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
          return
        }
        this.getOrganismDetailById();
        this.$q.notify("Pastor deletado com sucesso!");
        this.clearDialogAndFunctions();
      });
    },
    inactivatePastorFromFunction() {
      if (
        this.dialogDeletePastorFromFunction.uninstallerUser === ""
      ) {
        this.$q.notify("Preencha o usuário que desinstalou para prosseguir!");
        return;
      }
      const organismId = this.$route.query.organismId
      const opt = {
        
        route: "/desktop/adm/inactivatePastorInPastorFunctionInParoquia",
        body: {
          userFunctionId: this.dialogDeletePastorFromFunction.userData._id,
          finalDate: this.dialogDeletePastorFromFunction.finalDate,
          obsText: this.dialogDeletePastorFromFunction.obsText,
          uninstallerUserId: this.dialogDeletePastorFromFunction.uninstallerUser._id,
          organismId
        },
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
          return
        }
        this.getOrganismDetailById();
        this.$q.notify("Pastor deletado com sucesso!");
        this.clearDialogAndFunctions();
      });
    },
    getUsers(val, update, abort) {
      if(val.length < 3) {
        this.$q.notify('Digite no mínimo 3 caracteres')
        abort()
        return
      }
      let route
      if (this.dialogAddSecretary.open = true) {
        route = "/desktop/adm/getUsers" 
      }
      else if (this.dialogInsertUserInFunction.selectedFunc !== null && this.dialogInsertUserInFunction.open === true && this.dialogInsertUserInFunction.functionType !== 'Pastor') {
        route = "/desktop/adm/getUsers"
      } else if (this.dialogSwapPastorFromFunction.open === true) {
        route = "/desktop/adm/getPastores"
      } else if (this.dialogInsertUserInFunction.selectedFunc && this.dialogInsertUserInFunction.functionType === 'Pastor') {
        route = "/desktop/adm/getPastores" 
      } else if (this.dialogInserPastorInParoquia.open = true && this.dialogInserPastorInParoquia.user === 'Pastor') {
        route = "/desktop/adm/getPastores" 
      } else if (this.dialogInsertUserInFunction.open && this.dialogInsertUserInFunction.functionType === 'Pastor') {
        route = "/desktop/adm/getPastores" 
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
      if (this.dialogInsertUserInFunction.selectedFunc && this.dialogInsertUserInFunction.selectedFunc.functionRequiredTitleId) {
        opt.body.filterByTitleId = this.dialogInsertUserInFunction.selectedFunc.functionRequiredTitleId
      }
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if(r.error){ this.$q.notify(r.errorMessage) }

        update(() => {
          this.usersOptions = r.data.list
        })
      });
    },
    formatDate(newDate) {
      return date.formatDate(newDate, "DD/MM/YYYY");
    },
    linkPastorToChildOrganisms(child, ichild) {
        this.dialogInsertUserInFunction.selectedFunc = child;
        this.dialogInsertUserInFunction.selectedFuncIndex = ichild;  
        this.dialogInsertUserInFunction.functionType = 'Pastor'
        this.dialogInsertUserInFunction.open = true;
        this.getOrganismCallerData()
    },
    linkPastorToFunction() {
      this.functions.forEach((func, ifunc) => {
        if (func.functionName === 'Pastor') {
          this.dialogInsertUserInFunction.selectedFunc = func;
          this.dialogInsertUserInFunction.functionType = 'Pastor';
          this.dialogInsertUserInFunction.selectedFuncIndex = ifunc;  
          this.dialogInsertUserInFunction.open = true;
        }
      })
      this.getOrganismCallerData()
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
      this.getOrganismCallerData()
    },
    addPastorFunctionInParoquia() {
      this.dialogInserPastorInParoquia.open = true
      this.dialogInserPastorInParoquia.user = 'Pastor'
    },
    linkUserToFunction(func, funcIndex) {
      this.dialogInsertUserInFunction.selectedFunc = func;
      this.dialogInsertUserInFunction.selectedFuncIndex = funcIndex;  
      this.dialogInsertUserInFunction.functionType = 'Usuário';
      this.dialogInsertUserInFunction.open = true;
      this.getOrganismCallerData()
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
<style scoped>
.list-container {
  max-height: 300px;
  overflow-y: auto;
}

.dialogStyle {
  border-radius: 1rem;
  width: 700px;
}
</style>
<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col text-capitalize"> 
          <div class="text-h5">{{ organismName }}</div>
          <q-badge :style="{background: organismConfigStyle}" size="large">{{ organismConfigName }} - {{ idLegado }}</q-badge>
        </div>
        <div class="col text-right self-center">
          <q-btn
            no-caps
            color="primary"
            rounded
            icon="bookmark"
            unelevated
            @click="updateOrganism"
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
              <div class="text-h6" v-if="relations.length > 0">
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
              <q-list class="q-ml-md q-px-sm" v-if="relations.length > 0">
                <q-item 
                  v-for="(link, i) in relations" 
                  :key="link" 
                  class="bg-grey-3 q-ma-xs" 
                  style="border-radius: 0.5rem"
                  clickable
                  @click="clkShowDialogLink(link)"
                >
                  <q-item-section>
                    <q-item-label class="q-mt-sx text-bold" lines="1">
                      {{ link.organismRelationName }}
                      <q-badge
                      class="q-ml-sm"
                      :style="{ color: link.organismConfigStyle}" 
                        size="15px" 
                        outline
                        >
                        {{ link.organismConfigName }}
                      </q-badge>
                    </q-item-label>
                    <q-item-label class="text-subtitle1 text-bold" lines="2">
                      Pastores:
                      <q-btn
                        icon="add"
                        color="primary"
                        size="8px"
                        dense
                        rounded
                        no-caps
                        unelevated
                        @click.stop="linkPastorToChildOrganisms(i)"
                      >
                        <q-tooltip>Adicionar pastor</q-tooltip>
                      </q-btn>
                    </q-item-label>
                    <q-item-label 
                      v-for="(child) in link.functions[0].users" 
                      :key="child" 
                      class="text-subtitle2" lines="3"
                    >
                      {{ child.userName }}
                      <!-- v-if="canEditPastor" -->
                      <q-btn
                      icon="delete"
                      flat
                      color="red"
                      size="10px"
                      @click.stop="dialogOpenDeleteUserFromFunction(child)"
                      :disable="disableButtons"
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
                        v-if="link.organismRelationIsMain === 'SIM'" 
                        color="secondary" 
                        name="home"
                      ></q-icon>
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator/>
              </q-list>
              
              <div v-if="organismConfigName === 'Congregação'">
                <div class="text-h6">
                  Vinculado a
                </div>
                <q-list class="q-px-xs" v-if="parentData">
                  <q-item 
                    class="bg-grey-3 q-ma-sm" 
                    style="border-radius: 0.5rem"
                    clickable
                    @click="clkShowDialogParentDetail()"
                  >
                    <q-item-section >
                      <div class="row">
                        <div class="q-mt-sm">{{ parentData.parentName}}</div>
                        <q-chip
                          class="q-ml-sm"
                          :style="{ color: parentData.parentConfigStyle}" 
                          size="15px" 
                          outline
                        >{{ parentData.parentOrganismConfigName }}</q-chip>
                        
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
                <q-separator class="q-mx-lg q-mb-md" />
                <div class="text-h6" v-if="$route.path.includes('/admin')">
                  Pastores
                  <span>
                    <q-btn
                      icon="add"
                      color="primary"
                      size="15px"
                      dense
                      rounded
                      no-caps
                      unelevated
                      @click="linkPastorToFunction()"
                    >
                      <q-tooltip>Adicionar pastor</q-tooltip>
                    </q-btn>
                  </span>
                </div>
                <div v-for="(func, funcIndex) in functions" :key="func">
                  <cardPastor
                    class="no-margin"
                    v-if="func.functionName === 'Pastor'"
                    :func="func"
                    :funcIndex="funcIndex"
                    @deleteUserFromFunction="dialogOpenDeleteUserFromFunction"
                    :showAddUserButton="false"
                    :canEditPastor="$route.path.includes('/admin') ? true : false"
                    :showInviteUserButton="func.functionName === 'Pastor' ? false : true && this.$route.query.e === 'f' ? false : true"
                  />
                </div>
              </div>
              <div  v-if="organismConfigName === 'Paróquia'">
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
                    @deleteUserFromFunction="dialogOpenDeleteUserFromFunction"
                    :showAddUserButton="false"
                    :canEditPastor="$route.path.includes('/admin') ? true : false"
                    :showInviteUserButton="func.functionName === 'Pastor' ? false : true && this.$route.query.e === 'f' ? false : true"
                  />
                  
                </div>
              </div>
              <div v-if="organismData.fields.length" class="text-h6">
                <q-separator class="q-mx-md q-mb-md" />
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
                      @click="clkOpenAddOrganismDialog(fieldIndex)"
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
                <div v-if="field.type.type === 'services_per_week'">
                  <q-btn 
                    v-if="!field.value"
                    label="Quantidade de cultos"
                    no-caps
                    rounded
                    unelevated
                    flat
                    color="primary"
                    icon="add"
                    @click="clkAddServicesPerWeek(fieldIndex)"
                    class="q-mt-xs"
                  />
                  <CardServices
                    v-if="field.value"
                    :data="field.value"
                    :fieldIndex="fieldIndex"
                    @edit="editServicesData"
                    @remove="removeServicesData"
                    />
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
                v-if="func.functionName !== 'Pastor' && func.functionName !== 'Pastor em Paróquia' && !func.properties.data.properties.hideFunctionDetail === true"
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
                  <q-card style="border-radius: 1rem; width: 400px">
                    <q-card-section align="center">
                      <div class="text-h6">
                        Informe o usuário que ocupará a função
                      </div>
                      <div v-if="dialogInsertUserInFunction.selectedFunc && dialogInsertUserInFunction.selectedFunc.functionRequiredTitleName">
                        <q-chip color="red-8" outline>
                          Esta função requer o título {{ dialogInsertUserInFunction.selectedFunc.functionRequiredTitleName }}
                        </q-chip>
                      </div>
                    </q-card-section>
                    <q-card-section align="center">
                      <q-select
                        v-model="dialogInsertUserInFunction.userSelected"
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
  <DialogAddEventsDate
    :open="dialogAddServices.open"
    @addServicesData="confirmServicesData"
    @closeDialog="closeDialogAddServices"
  />
  <DialogOrganismDetail
    :open="dialogShowOtherDetail.open"
    :orgData="dialogShowOtherDetail.orgData"
    :orgFields="dialogShowOtherDetail.orgFields"
    :orgFunc="dialogShowOtherDetail.orgFunc"
    :isAdm="true"
    @closeDialog="closeDialogOrganismDetail"
    @goToDetail="routeToDetail"
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
import CardFormation from '../../components/CardFormation.vue'
import CardAddress from '../../components/CardAddress.vue'
import CardPerson from '../../components/CardPerson.vue'
import DialogAddEventsDate from '../../components/DialogAddEventsDate.vue'
import DialogOrganismDetail from '../../components/DialogOrganismDetail.vue'
import DialogAddress from '../../components/DialogAddress.vue'
import CardMaritalStatus from '../../components/CardMaritalStatus.vue'
import useFetch from "../../boot/useFetch";
import { date } from "quasar";
export default defineComponent({
  name: "OrganismDetail",
  components: {
    CardFunction, CardOrganism, DialogAddress,
    CardAddress, CardPerson, CardMaritalStatus,
    CardBankData, CardPhoneMobileEmail, CardFormation,
    DialogPhoneMobileEmail, CardPastor, DialogAddEventsDate,
    CardServices, DialogOrganismDetail
  },
  data() {
    return {
      tab: 'organismData',
      lastFuncIndex: -1,
      usersOptions: [],
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
      dialogInsertUserInFunction:{
        initialDate: '',
        open: false,
        selectedFunc: null,
        userSelected: null
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
      dialogAddServices: {
        open: false,
        fieldIndex: null,
        action: 'add', 
        data: null
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
        pastorSelected: null,
        initialDate: null,
        funcId: null
      }
    };
  },
  watch: {
    $route(to) {
      if (to.path === '/admin/organismDetail') {
        this.getOrganismDetailById();
      }
    }
  },
  mounted() {
    this.$q.loading.hide()
  },
  created(){
    this.getOrganismDetailById();
  },
  beforeMount(){
    // this.getOrganismsList()
    this.getOrganismsConfigs()
    this.getParentOrganismsById()
    this.getChildOrganismsConfigsByOrganismId()
    this.getChildOrganismsById()
    // this.getOrganismsConfigsList()
    // this.getUserVisionPermissionByOrganismId()
  },
  methods: {
    verifyPastorInParoquia() {
      this.functions.forEach((func) => {
        if (func.functionName === 'Pastor em Paróquia'){
          this.dialogInserPastorInParoquia.funcId = func._id
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
    clkShowDialogLink (i) {
      const opt = {
        route: "/desktop/adm/getOrganismDetailById",
        body: {
          organismId: i.childInReation,
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
      console.log(this.dialogShowOtherDetail.orgId)
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
    clkShowDialogParentDetail() {
      this.dialogShowOtherDetail.data = this.parentData
      this.clkShowDetailOrganism(this.parentData._id)
    },
    closeDialogAddServices () {
      this.dialogAddServices.open = false
      this.dialogAddServices.fieldIndex = null
      this.dialogAddServices.action = 'add'
      this.dialogAddServices.data = null
    },
    clkAddServicesPerWeek(fieldIndex) {
      this.dialogAddServices.fieldIndex = fieldIndex
      this.dialogAddServices.action = 'add'
      this.dialogAddServices.open = true
    },
    verifyIfHasPastor() {
      this.functions.forEach((func) => {
        if (func.functionName === 'Pastor' && func.users.length) {
          this.existsPastor = true
        }
      })
    },
    goToParentOrganismDetail(parent) {
      console.log('luisito suarezs', parent)
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
    confirmServicesData(freq, day, time) {
      this.dialogAddServices.open = false
      if (this.dialogAddServices.action === 'add') {
        if (!this.organismData.fields[this.dialogAddServices.fieldIndex].value) {
          this.organismData.fields[this.dialogAddServices.fieldIndex].value = []
        }
        this.organismData.fields[this.dialogAddServices.fieldIndex].value.push({
          frequency: freq, 
          days: day,
          times: time
        })
      } else if (this.dialogAddServices.action === 'edit') {
        this.organismData.fields[this.dialogAddServices.fieldIndex]
        .value[this.dialogAddServices.ivalue] = {
          frequency: freq, 
          days: day,
          times: time
        }
      }
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
    removeThisAddress(fieldIndex, valueIndex) {
      this.organismData.fields[fieldIndex].value.splice(valueIndex, 1);
    },
    clkSaveLink() {
      this.dialogLinks = false
      this.$q.notify("Vínculos criados com sucesso.")
    },
    removeServicesData (fieldIndex, tabsIndex, field, value, iValue) {
      this.organismData.fields[fieldIndex].value.splice(iValue, 1)
    },
    editServicesData(fieldIndex, tabsIndex, field, value, ivalue) {
      this.dialogAddServices.action = 'edit'
      this.dialogAddServices.open = true
      this.dialogAddServices.fieldIndex = fieldIndex
      this.dialogAddServices.tabsIndex = tabsIndex
      this.dialogAddServices.data = {...value}
      this.dialogAddServices.ivalue = ivalue
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
    addPhoneMobileEmail(fieldIndex, tabsIndex, field) {
      this.dialogAddPhoneMobileEmail.action = 'add'
      this.dialogAddPhoneMobileEmail.hint = field.hint
      this.dialogAddPhoneMobileEmail.label = field.label
      this.dialogAddPhoneMobileEmail.open = true
      this.dialogAddPhoneMobileEmail.type = field.type
      this.dialogAddPhoneMobileEmail.fieldIndex = fieldIndex
      this.dialogAddPhoneMobileEmail.tabsIndex = tabsIndex
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
          this.organismData.fields = r.data.organismData.fields;
          this.organismConfigName = r.data.organismData.organismConfigName
          this.functions = r.data.functions
          this.relations = r.data.relations
          this.parentData = r.data.parentData
          this.idLegado = r.data.idLegado
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
      // this.organismData.fields.forEach((field) => {
      //   if (field.required && (!field.value || field.value === "")) {
      //     allRight = false;
      //   }
      // });
      return allRight;
    },
    updateOrganism(){
      if (this.checkRequiredFields()) {
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
      } else {
        this.$q.notify("Há campos obrigatórios não preenchidos");
      }
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
      this.selectedFunc = {};
      this.userSelected = "";
      this.functionSelected = "";
      this.dialogOpenObservation.data = {};
      this.dialogDeleteUserFromFunction.data = {};
      this.dialogDeleteUserFromFunction.finalDate = "";
      this.dialogDeleteUserFromFunction.functionUserId = "";
      this.dialogDeleteUserFromFunction.obsText = "";
      this.dialogOpenObservation.obsText = "";
      this.dialogDeleteUserFromFunction.open = false;
      this.dialogOpenObservation.open = false;
      this.dialogInsertUserInFunction.open = false;
    },
    dialogOpenDeleteUserFromFunction(user) {
      this.dialogDeleteUserFromFunction.open = true;
      this.dialogDeleteUserFromFunction.userData = user;
    },
    getOrganismsList(val) {
      const opt = {
        route: "/desktop/adm/getOrganismsList",
        body: {
          searchString: val,
          page: 1,
          rowsPerPage: 50
        }
      };
      useFetch(opt).then((r) => {
        this.organismList = r.data.list;
      });
    },

    addUserToFunction() {
      const selectedFuncIndex = this.dialogInsertUserInFunction.selectedFunc;
      if (this.dialogInsertUserInFunction.userSelected === "" || this.dialogInsertUserInFunction.initialDate === "") {
        this.$q.notify("Preencha usuário e a data início");
        return;
      }
      if (this.verifyIfUserIsAlreadyInFunction(selectedFuncIndex, this.dialogInsertUserInFunction.userSelected.userId)) {
        this.$q.notify('Usuário já incluído nesta função')
        return
      }
      const opt = {
        route: "/desktop/adm/addUserToFunction",
        body: {
          organismFunctionId: this.dialogInsertUserInFunction.selectedFunc._id,
          userId:  this.dialogInsertUserInFunction.userSelected.userId,
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
    verifyIfUserIsAlreadyInFunction (functionIndex, userIdToVerify) {
      let ret = false
      if (this.functions[functionIndex.users.length > 0]) {
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
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
          return
        }
        this.getOrganismDetailById();
        this.$q.notify("Usuário deletado com sucesso!");
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
      if (this.dialogInsertUserInFunction.selectedFunc && this.dialogInsertUserInFunction.selectedFunc._id !== '6530496b892eac36fc130cb2') {
        route = "/desktop/adm/getUsers"
      } else if (this.dialogInsertUserInFunction.selectedFunc && this.dialogInsertUserInFunction.selectedFunc._id === '6530496b892eac36fc130cb2'){
        route = "/desktop/adm/getPastores" 
      } else if (this.dialogInserPastorInParoquia. open = true) route = "/desktop/adm/getPastores"
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
          this.usersOptions = r.data.list;
        })
      });
    },
    formatDate(newDate) {
      return date.formatDate(newDate, "DD/MM/YYYY");
    },
    linkPastorToChildOrganisms(i) {
      this.relations[i].functions.forEach((func, ifunc) => {
        this.dialogInsertUserInFunction.selectedFunc = func;
        this.dialogInsertUserInFunction.selectedFuncIndex = ifunc;  
        this.dialogInsertUserInFunction.open = true;
      })
    },
    linkPastorToFunction() {
      this.functions.forEach((func, ifunc) => {
        if (func.functionName === 'Pastor') {
          this.dialogInsertUserInFunction.selectedFunc = func;
          this.dialogInsertUserInFunction.selectedFuncIndex = ifunc;  
          this.dialogInsertUserInFunction.open = true;
        }
      })
    },
    addPastorFunctionInParoquia() {
      this.dialogInserPastorInParoquia.open = true
    },
    linkUserToFunction(func, funcIndex) {
      this.dialogInsertUserInFunction.selectedFuncIndex = funcIndex;
      this.dialogInsertUserInFunction.selectedFunc = func
      this.dialogInsertUserInFunction.open = true;
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
</style>
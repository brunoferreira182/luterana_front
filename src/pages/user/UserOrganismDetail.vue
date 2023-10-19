<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6">
          <div class="text-h5">
            {{ organismName }}
          </div>
          <div class="text-caption text-capitalize">
            detalhe do organismo 
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
            rounded
            no-caps
            unelevated
            icon="school"
            color="secondary"
            label="Vínculos"
            @click="visionSelected = 'links'"
            :outline="visionSelected === 'links' ? false : true"
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
          <q-btn
            rounded
            no-caps
            unelevated
            icon="school"
            color="secondary"
            label="Vínculos"
            @click="visionSelected = 'links'"
            :outline="visionSelected === 'links' ? false : true"
          />
        </div>
      </div>
      <q-separator class="q-mx-md" v-if="!isMobile"/>
      <div v-show="visionSelected === 'data'">
        <div class="row justify-around q-pa-md" v-if="!isMobile">
          <div class="col-7 q-gutter-md q-mt-sm" align="start" >
            <div class="text-h5 no-margin q-px-md">
              Dados
            </div>
            <q-chip>{{ organismConfigName }}</q-chip>
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

            </div>

            <div class="text-right">
                <q-btn
                  v-if="!this.$route.query.e === 'f'"
                  label="Salvar dados"
                  color="primary"
                  unelevated
                  class="q-mt-md"
                  @click="updateOrganism"
                />
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
                :showAddUserButton="false"
                :showInviteUserButton="func.functionName === 'Pastor' ? false : true && this.$route.query.e === 'f' ? false : true"
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
            />
            
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
                class="bg-green-3 q-my-sm"
              >
                <q-item-section>
                  <q-item-label> {{ child.organismName }}</q-item-label>
                  <q-item-label caption> {{ child.organismConfigName }}</q-item-label>
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
      </div>
      <div v-show="visionSelected === 'links'" v-if="!isMobile">
        <div class="q-ma-lg justify-start" v-if="childOrganismsData">
          <div class="q-gutter-md">
            <div class="text-h5 col"> Vínculos</div>
            <div class="text-caption text-h6" >
              Organismos vínculados:
            </div>
            <q-list v-if="relations && relations.length">
              <q-item
                clickable
                v-for="link in relations"
                :key="link"
                style="border-radius: 1rem;"
                class="bg-blue-grey-2 q-my-sm q-col-gutteter-md"
                @click="goToOrganismDetail(link.organismRelationId)"
              >
                <q-item-section>
                  <q-item-label> {{ link.organismRelationName }}</q-item-label>
                  <q-item-label class="text-subtitle1">{{ link.organismConfigName }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <div v-else class="text-subtitle1">
              Nenhum vínculo de organismo criado <q-icon name="warning" color="warning" size="md"/>
            </div>
          </div>
        </div>
      </div>



      <div v-if="isMobile" class="q-gutter-md">
        <q-list bordered v-show="visionSelected === 'data'">
          <q-expansion-item
            group="somegroup"
            class="bg-grey-3"
            header-class="text-primary"
            label="Dados"
          >
            <div class="bg-white q-pa-md">
              <q-chip>{{ organismConfigName }}</q-chip>
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

                

              </div>
              <div class="text-right">
                <q-btn
                  label="Salvar dados"
                  color="primary"
                  unelevated
                  class="q-mt-md"
                  @click="updateOrganism"
                />
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
                :func="func"
                :funcIndex="funcIndex"
                @clkOpenDialogSolicitation="clkOpenDialogSolicitation"
                :showAddUserButton="false"
                :isMobile="isMobile"
                :showInviteUserButton="func.functionName === 'Pastor' ? false : true"
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
        </q-list>
        <div v-show="visionSelected === 'links'">
          <div class="q-ma-lg justify-start" v-if="childOrganismsData">
            <div class="q-gutter-md">
              <div class="text-h5 col"> Vínculos</div>
              <div class="text-caption text-h6" >
                Organismos vínculados:
              </div>
              <div v-if="relations">
                <q-list v-if="relations.length">
                  <q-item
                    clickable
                    v-for="link in relations"
                    :key="link"
                    style="border-radius: 1rem;"
                    class="bg-blue-grey-2 q-my-sm"
                    @click="goToOrganismDetail(link.organismRelationId)"
                  >
                    <q-item-section>
                      <q-item-label> {{ link.organismRelationName }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
              <div v-else class="text-subtitle1">
              Nenhum vínculo de organismo criado <q-icon name="warning" color="warning" size="md"/>
            </div>
            </div>
          </div>
        </div>
      </div>
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
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import CardFunction from '../../components/CardFunction.vue'
import CardAddress from '../../components/CardAddress.vue'
import CardPhoneMobileEmail from '../../components/CardPhoneMobileEmail.vue'
import DialogAddress from '../../components/DialogAddress.vue'
import CardBankData from '../../components/CardBankData.vue'
import DialogPhoneMobileEmail from '../../components/DialogPhoneMobileEmail.vue'
import CardMaritalStatus from '../../components/CardMaritalStatus.vue'
import CardOrganism from '../../components/CardOrganism.vue'
import CardPerson from '../../components/CardPerson.vue'
import useFetch from "../../boot/useFetch";
import { useScreenStore } from "stores/checkIsMobile";
import { date } from "quasar";
export default defineComponent({
  name: "UserOrganismDetail",
  components: {
    CardFunction, CardOrganism, DialogAddress,
    CardAddress, CardPerson, CardMaritalStatus,
    CardBankData, CardPhoneMobileEmail,
    DialogPhoneMobileEmail
  },
  data() {
    return {
      usersOptions: [],
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
      }
    };
  },
  mounted() {
    this.$q.loading.hide()
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
  watch: {
    $route (to) {
      if (to.path === '/user/userOrganismDetail' || to.path === '/user/userOrganismChildDetail') {
        this.getOrganismDetailById();
        // this.getOrganismsConfigs()
      }
    }
  },
  methods: {
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
    goToOrganismDetail(id) {
      this.$router.push("/user/userOrganismDetail?organismId=" + id + "&e=f")
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
    clkOpenChildOrganismDetail(child){
      const childOrganismId = child.childOrganismId
      this.$router.push('/user/userOrganismDetail?organismId=' + childOrganismId + '&isChild=true')
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
          this.usersOptions = r.data;
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
      console.log(data,' aqui data')
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
      this.dialogAddPhoneMobileEmail.type = field.type
      this.dialogAddPhoneMobileEmail.fieldIndex = fieldIndex
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
      console.log(func)
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
        this.visionSelected = 'data'
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

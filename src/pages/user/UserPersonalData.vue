<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md row justify-between">
        <div class="col text-h5 text-capitalize" v-if="!isMobile">
          Preencher dados pessoais
        </div>
        <div class="col-5 text-subtitle1 text-capitalize" v-if="isMobile">
          Preencher dados pessoais
        </div>
        <div class="col-5 self-center" v-if="isMobile">
          <q-btn
            no-caps
            dense
            rounded
            unelevated
            class="q-pa-sm"
            color="primary"
            icon="bookmark"
            :label="isSaving ? '' : 'Salvar Dados'"
            @click="salvar"
            :disable="isSaving"
          >
            <q-spinner-dots v-if="isSaving" color="white" size="1em" />
          </q-btn>
        </div>
      </div>
      <q-separator />
      
      <div v-if="!isMobile">
        <q-splitter
          v-model="splitterModel"
          style="height: 100vh;"
          v-show="visionSelected === 'personalData'"
        >
          <template v-slot:before>
            <q-tabs
              v-if="userData && userData.userDataTabs"
              v-model="tab"
              vertical
              align="left"
              class="text-left flex-center"
              no-caps
              active-bg-color="blue-1"
              indicator-color="primary"
              inline-label
              @update:model-value="addBar = false"
            >
              <template v-for="(tabs, i) in userData.userDataTabs" :key="i">
                <q-tab 
                  v-if="userType === 'user' ? tabs.tabLabel !== 'Dados pastorais' : tabs.tabLabel"
                  class="flex-left flex"
                  :name="tabs.tabValue" 
                  :label="tabs.tabLabel" 
                />
                <q-separator/>
              </template>
              <div class="text-center q-my-md">
                <q-btn
                  no-caps
                  rounded
                  unelevated
                  class="q-pa-sm"
                  color="primary"
                  icon="bookmark"
                  :label="isSaving ? '' : 'Salvar Dados'"
                  @click="salvar"
                  :disable="isSaving"
                >
                  <q-spinner-dots v-if="isSaving" color="white" size="1em" />
                </q-btn>
              </div>
            </q-tabs>
          </template>
          <template v-slot:after>
            <q-tab-panels 
              v-show="userData && userData.userDataTabs"
              animated 
              swipeable
              transition-prev="jump-up"
              transition-next="jump-up"
              class="bg-accent"
              :model-value="tab"
            >
              <q-tab-panel 
                v-for="(tabs, tabsIndex) in userData.userDataTabs"
                :key="tabsIndex"
                :name="tabs.tabValue" 
              >
                <div v-if="tabs.tabLabel !== 'Dados pastorais'">
                  <q-btn
                    no-caps
                    rounded
                    unelevated
                    class="q-pa-sm"
                    color="primary"
                    @click="clkAddPastoralData"
                    v-if="tab === 'dados_pastorais'"
                  >
                    Solicitar alterações
                  </q-btn>
                  <div v-if="tabs.tabLabel === 'Dados obrigatórios'">
                    <div  class="row justify-center">
                      <q-item-section avatar>
                        <q-img 
                          style="border-radius: 1rem"
                          :src="userData.profileImage ? utils.makeFileUrl(userData.profileImage) : avatar" 
                          width="208px" 
                          height="208px"
                        />
                      </q-item-section>
                    </div>
                    <div class="row justify-center q-pa-md">
                      <div class="col-4 q-px-lg">
                        <q-file
                          v-model="userImg"
                          label="Clique para inserir foto"
                          borderless
                          clearable
                          class="q-px-lg"
                          @update:model-value="addUserImage()"
                          accept=".png, .jpg, image/*"
                          @rejected="rejectUserPhoto"
                          max-files="1"
                        >
                          <template v-slot:prepend>
                            <q-icon name="photo_camera" />
                          </template>
                        </q-file>
                      </div>
                    </div>
                  </div>
                  <div
                    v-for="(field, fieldIndex) in tabs.fields"
                    :key="fieldIndex"
                    class="q-my-md"
                  >
                    <div class="row q-gutter-sm justify-left items-left">
                      <div class="col q-mx-lg">
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
                            :readonly="tabs.onlyAdm"
                          />
                        </div>
                        <q-file
                          v-if="field.type.type === 'image'"
                          v-model="files"
                          @rejected="onRejected"
                          :filter="checkFileType"
                          label="Clique aqui para adicionar imagem de perfil"
                          outlined
                          @input="saveProfilePhoto()"
                          :readonly="tabs.onlyAdm"
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
                            :readonly="tabs.onlyAdm"
                          >
                          </q-select>
                        </div>
    
                        <!-- <div v-if="field.type.type === 'attach'">
                          <q-btn
                          :label="`Adicionar ${field.label}`"
                          no-caps
                          rounded
                          flat
                          color="primary"
                          icon="add"
                          v-if="field.multiple || !field.value || field.value ==='' || field.value.length === 0"
                          :disable="tabs.onlyAdm"
                          @click="clkOpenAttachDialog(fieldIndex, tabsIndex)"
                        />
                        <CardAttach
                          :data="field"
                          :fieldIndex="fieldIndex"
                          :tabsIndex="tabsIndex"
                          @remove="removeAttach"
                          @edit="editAttach"
                        />
                        </div> -->
    
                        <q-checkbox
                          v-if="field.type.type === 'boolean'"
                          class="q-pt-lg"
                          :label="field.label"
                          :hint="field.hint"
                          v-model="field.value"
                          :readonly="tabs.onlyAdm"
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
                                @click="addDoubleSelection(tabsIndex, fieldIndex)"
                                no-caps
                                :disable="tabs.onlyAdm"
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
                                    v-model="userData.userDataTabs[tabsIndex].fields[fieldIndex].value[valueIndex][selectIndex]"
                                    :options="select.options"
                                    class="col-5"
                                  />
                                  <q-btn
                                    icon="delete"
                                    class="q-ml-lg"
                                    rounded
                                    flat
                                    color="red"
                                    @click="userData.userDataTabs[tabsIndex].fields[fieldIndex].value.splice(valueIndex, 1)" 
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
                              @click="clkOpenAddOrganismDialog(fieldIndex, tabsIndex)"
                              :disable="tabs.onlyAdm"
                            />
                            <CardOrganism
                              :data="field"
                              :fieldIndex="fieldIndex"
                              :tabsIndex="tabsIndex"
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
                            @click="clkOpenAddressDialog(fieldIndex, tabsIndex)"
                            class="q-mt-xs"
                            :disable="tabs.onlyAdm"
                          />
                          <CardAddress
                            :data="field.value"
                            :fieldIndex="fieldIndex"
                            :tabsIndex="tabsIndex"
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
                              :tabsIndex="tabsIndex"
                              @click="clkShowDetailPerson(field)"
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
                            @click="clkOpenAddPersonDialog(fieldIndex, tabsIndex)"
                            :disable="tabs.onlyAdm"
                          />
                        </div>
    
                        <div v-if="field.type.type === 'maritalStatus'">
                          <q-list
                            style="border-radius: 1rem"
                            class="bg-grey-3"
                            separator
                          >
                            <q-item>
                              <q-item-section>
                                <q-item-label class="text-capitalize">
                                  Estamos importando seus dados conjugais
                                </q-item-label>
                              </q-item-section>
                            </q-item>
                          </q-list>
                          <!-- <div v-if="field.value && field.value.length > 0">
                            <div class="text-body">{{ field.label }}</div>
                            <CardMaritalStatus
                              :data="field"
                              :fieldIndex="fieldIndex"
                              :tabsIndex="tabsIndex"
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
                            @click="clkAddMaritalStatus(fieldIndex, tabsIndex)"
                            :disable="tabs.onlyAdm"
                          /> -->
                        </div>
                        <div v-if="field.type.type === 'bank_data'">
                          <q-btn
                            label="Adicionar dados bancários"
                            no-caps
                            rounded
                            flat
                            color="primary"
                            @click="clkAddBankData(fieldIndex, tabsIndex)"
                            icon="add"
                            :disable="tabs.onlyAdm"
                          />
                          <CardBankData
                            :data="field"
                            :fieldIndex="fieldIndex"
                            :tabsIndex="tabsIndex"
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
                            :disable="tabs.onlyAdm"
                          />
                          <CardPhoneMobileEmail
                            :data="field.value"
                            :fieldIndex="fieldIndex"
                            :tabsIndex="tabsIndex"
                            @edit="editPhoneMobileEmail"
                            @remove="removePhoneMobileEmail"
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
                            @click="clkAddFormation(fieldIndex, tabsIndex)"
                            class="q-mt-xs"
                            :disable="tabs.onlyAdm"
                          />
                          <CardFormation
                            :data="field"
                            :fieldIndex="fieldIndex"
                            :tabsIndex="tabsIndex"
                            @edit="editFormation"
                            @remove="removeFormation"
                          />
                        </div>
                        <div v-if="field.type.type === 'social_network'">
                          <q-btn
                            label="Rede social"
                            no-caps
                            rounded
                            unelevated
                            flat
                            color="primary"
                            icon="add"
                            @click="clkAddSocialNetwork(fieldIndex, tabsIndex)"
                            class="q-mt-xs"
                            :disable="tabs.onlyAdm"
                          />
                          <CardSocialNetwork
                            :data="field.value"
                            :fieldIndex="fieldIndex"
                            :tabsIndex="tabsIndex"
                            @edit="editSocialNetwork"
                            @remove="removeSocialNetwork"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-h6 text-center q-pa-md">
                  Em construção...
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </template>
        </q-splitter>
      </div>
      <div v-if="isMobile">
        <q-list bordered>
          <q-expansion-item
            v-for="(tabs, tabsIndex) in userData.userDataTabs" :key="tabsIndex"
            group="somegroup"
            class="bg-grey-3"
            header-class="text-primary"
            :label="tabs.tabLabel"
          >
            <q-card>
              <div v-if="tabs.tabLabel === 'Dados obrigatórios'">
                <div  class="row justify-center">
                  <q-item-section avatar class="q-px-md q-pa-md">
                    <q-img 
                      style="border-radius: 1rem"
                      :src="userImg !== null ? userPhoto : avatar" 
                      width="208px" 
                      height="208px"
                    />
                  </q-item-section>
                </div>
                <div class="row justify-center q-pa-md text-center">
                  <div class="col q-px-xl">
                    <q-file
                      v-model="userImg"
                      label="Clique para inserir foto"
                      borderless
                      clearable
                      class="q-px-lg"
                      @update:model-value="addUserImage()"
                      accept=".png, .jpg, image/*"
                      @rejected="rejectUserPhoto"
                      max-files="1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="photo_camera" />
                      </template>
                    </q-file>
                  </div>
                </div>
              </div>
              <q-card-section v-if="tabs.tabLabel !== 'Dados pastorais'">
                <div
                  v-for="(field, fieldIndex) in tabs.fields"
                  :key="fieldIndex"
                  class="q-my-md"
                >
                  <div class="row q-gutter-sm justify-left items-left">
                    <div class="col q-mx-lg">
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
                          :readonly="tabs.onlyAdm"
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
                        :readonly="tabs.onlyAdm"
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
                          :readonly="tabs.onlyAdm"
                        >
                        </q-select>
                      </div>
  
                      <!-- <div v-if="field.type.type === 'attach'">
                        <q-btn
                          :label="`Adicionar ${field.label}`"
                          no-caps
                          rounded
                          flat
                          color="primary"
                          icon="add"
                          v-if="field.multiple || !field.value || field.value ==='' || field.value.length === 0"
                          :disable="tabs.onlyAdm"
                        />
                        <CardAttach
                          :data="field.value"
                          :fieldIndex="fieldIndex"
                          :tabsIndex="tabsIndex"
                          @edit="editAttach"
                          @remove="removeAttach"
                        />
                      </div> -->
                      <q-checkbox
                        v-if="field.type.type === 'boolean'"
                        class="q-pt-lg"
                        :label="field.label"
                        :hint="field.hint"
                        v-model="field.value"
                        :readonly="tabs.onlyAdm"
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
                              @click="addDoubleSelection(tabsIndex, fieldIndex)"
                              no-caps
                              :disable="tabs.onlyAdm"
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
                                  v-model="userData.userDataTabs[tabsIndex].fields[fieldIndex].value[valueIndex][selectIndex]"
                                  :options="select.options"
                                  class="col-5"
                                />
                                <q-btn
                                  icon="delete"
                                  class="q-ml-lg"
                                  rounded
                                  flat
                                  color="red"
                                  @click="userData.userDataTabs[tabsIndex].fields[fieldIndex].value.splice(valueIndex, 1)" 
                                  />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
  
                      <div v-if="field.type.type === 'organism'">
                        <div>
                          <q-btn
                            :label="`Adicionar ${field.label}`"
                            no-caps
                            rounded
                            flat
                            color="primary"
                            icon="add"
                            v-if="field.multiple || !field.value || field.value ==='' || field.value.length === 0"
                            @click="clkOpenAddOrganismDialog(fieldIndex, tabsIndex)"
                            :disable="tabs.onlyAdm"
                          />
                          <CardOrganism
                            :data="field"
                            :fieldIndex="fieldIndex"
                            :tabsIndex="tabsIndex"
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
                          @click="clkOpenAddressDialog(fieldIndex, tabsIndex)"
                          class="q-mt-xs"
                          :disable="tabs.onlyAdm"
                        />
                        <CardAddress
                          :data="field.value"
                          :fieldIndex="fieldIndex"
                          :tabsIndex="tabsIndex"
                          @edit="editThisAddress"
                          @remove="removeThisAddress"
                        />
                      </div>
                      <div v-if="field.type.type === 'person'">
                        <div v-if="field.value && field.value.length > 0">
                          <div class="text-body">{{ field.label }}</div>
                          <CardPerson
                            @click="clkShowDetailPerson(field)"
                            :data="field"
                            :fieldIndex="fieldIndex"
                            :tabsIndex="tabsIndex"
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
                          @click="clkOpenAddPersonDialog(fieldIndex, tabsIndex)"
                          :disable="tabs.onlyAdm"
                        />
                      </div>
                      <div v-if="field.type.type === 'maritalStatus'">
                        <q-list
                            style="border-radius: 1rem"
                            class="bg-grey-3"
                            separator
                          >
                            <q-item>
                              <q-item-section>
                                <q-item-label class="text-capitalize">
                                  Estamos importando seus dados conjugais
                                </q-item-label>
                              </q-item-section>
                            </q-item>
                          </q-list>
                        <div v-if="field.value && field.value.length > 0">
                          <div class="text-body">{{ field.label }}</div>
                          <CardMaritalStatus
                            :data="field"
                            :fieldIndex="fieldIndex"
                            :tabsIndex="tabsIndex"
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
                          @click="clkAddMaritalStatus(fieldIndex, tabsIndex)"
                          :disable="tabs.onlyAdm"
                        />
                      </div>
                      <div v-if="field.type.type === 'bank_data'">
                        <q-btn
                          label="Adicionar dados bancários"
                          no-caps
                          rounded
                          flat
                          color="primary"
                          @click="clkAddBankData(fieldIndex, tabsIndex)"
                          icon="add"
                          :disable="tabs.onlyAdm"
                        />
                        <CardBankData
                          :data="field"
                          :fieldIndex="fieldIndex"
                          :tabsIndex="tabsIndex"
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
                          :disable="tabs.onlyAdm"
                        />
                        <CardPhoneMobileEmail
                          :data="field.value"
                          :fieldIndex="fieldIndex"
                          :tabsIndex="tabsIndex"
                          @edit="editPhoneMobileEmail"
                          @remove="removePhoneMobileEmail"
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
                          @click="clkAddFormation(fieldIndex, tabsIndex)"
                          class="q-mt-xs"
                          :disable="tabs.onlyAdm"
                        />
                        <CardFormation
                          :data="field"
                          :fieldIndex="fieldIndex"
                          :tabsIndex="tabsIndex"
                          @edit="editFormation"
                          @remove="removeFormation"
                        />
                        
                      </div>
                      <div v-if="field.type.type === 'social_network'">
                        <q-btn
                          label="Rede social"
                          no-caps
                          rounded
                          unelevated
                          flat
                          color="primary"
                          icon="add"
                          @click="clkAddSocialNetwork(fieldIndex, tabsIndex)"
                          class="q-mt-xs"
                          :disable="tabs.onlyAdm"
                        />
                        <CardSocialNetwork
                          :data="field.value"
                          :fieldIndex="fieldIndex"
                          :tabsIndex="tabsIndex"
                          @edit="editSocialNetwork"
                          @remove="removeSocialNetwork"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
              <div v-else class="text-h6 text-center q-pa-md">
                Em construção...
              </div>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>

      <DialogMaritalStatus
        :open="maritalStatus.open"
        :dataProp="maritalStatus.data"
        @addPerson="confirmAddPerson"
        @closeDialog="clearMaritalStatus"
      />
      <DialogUserTitle
        :open="openDialogVinculateUserToTitle"
        @closeDialog="openDialogVinculateUserToTitle = false"
        @confirm="createUserTitle"
      />
      <DialogAddress
        :open="dialogConfirmAddress.open"
        :addressDataProp="dialogConfirmAddress.data"
        @confirmAddress="confirmAddress"
        @closeDialog="clearAddressInputs"
      />

      <DialogAddPerson
        :open="addPerson.dialogOpen"
        @closeDialog="closeAddPersonDialog"
        @addPerson="confirmAddPerson"
      />
      
      <DialogAddOrganism
        :open="addOrganism.dialogOpen"
        @closeDialog="clearOrganismInputs"
        @addOrganism="confirmAddOrganism"
      />

      <DialogAddAttach
        :open="dialogAddAttach.open"
        @closeDialog="clearAttachInputs"
        @addAttach="confirmAddAttach"
      />

      <q-dialog v-model="deleteTitle.openDialog">
        <q-card style="border-radius: 1rem; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">
              Confirma deletar o título?
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Não"
              no-caps
              rounded
              color="primary"
              @click="deleteTitle.openDialog = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="clkConfirmDeleteTitle"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="dialogShowOtherData.open" v-if="otherData">
        <q-card  style="border-radius: 1rem; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">
              {{ otherData.userDataTabs[0].fields[0].value }}
            </div>
          </q-card-section>
          <q-card-section>
            <q-expansion-item
              dense
              dense-toggle
              expand-separator
              :label="otherData.userDataTabs[0].tabLabel"
            >
              <q-card>
                <q-card-section>
                  <q-input
                    v-for="otherField in otherData.userDataTabs[0].fields"
                    :key="otherField"
                    :label="otherField.label"
                    :hint="otherField.hint"
                    :mask="otherField.type.mask"
                    v-model="otherField.value"
                    outlined
                    readonly
                  >
                  </q-input>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-card-section>
          <q-card-section>
            <q-expansion-item
              dense
              dense-toggle
              expand-separator
              :label="otherData.userDataTabs[1].tabLabel"
            >
              <q-card>
                <q-card-section
                  v-for="(otherField, i) in otherData.userDataTabs[1].fields"
                  :key="otherField"
                >
                {{ otherData.userDataTabs[1].fields[i].label }}:
                  <CardPerson
                    v-if="otherField.value"
                    :data="otherField"
                    :tabsIndex="i"
                  />
                  <div v-else> Nenhum dado inserido</div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-card-section>
          <q-card-section>
            <q-expansion-item
              dense
              dense-toggle
              expand-separator
              :label="otherData.userDataTabs[2].tabLabel"
            >
              <q-card>
                <q-card-section
                  v-for="(otherField, i) in otherData.userDataTabs[2].fields"
                  :key="otherField"
                >
                  {{ otherData.userDataTabs[2].fields[i].label }}:
                  <CardPhoneMobileEmail
                    v-if="otherField.value"
                    :data="otherField.value"
                    :tabsIndex="i"
                    :disable="disableButtons"
                  />
                  <div v-else>Nenhum dado inserido</div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-card-section>
          <q-card-section>
            <q-expansion-item
              dense
              dense-toggle
              expand-separator
              :label="otherData.userDataTabs[3].tabLabel"
            >
              <q-card>
                <q-card-section 
                  v-for="(otherField, i) in otherData.userDataTabs[3].fields"
                  :key="otherField"
                >
                  <CardAddress
                    v-if="otherField.value"
                    :data="otherField.value"
                    :tabsIndex="i"
                  />
                  <div v-else>Nenhum dado inserido</div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-card-section>
          <q-card-actions align="center">
            
            <q-btn
              unelevated
              rounded
              label="Sair"
              no-caps
              color="primary"
              @click="dialogShowOtherData.open=false"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <DialogBankData
        :open="dialogAddBankData.open"
        :dataProp="dialogAddBankData.data"
        :docProp="dialogAddBankData.userHasDoc.doc"
        :hasDoc="dialogAddBankData.userHasDoc.hasDoc"
        @confirm="confirmAddBankData"
        @closeDialog="clearBankDataInputs"
      />

      <DialogPhoneMobileEmail
        :open="dialogAddPhoneMobileEmail.open"
        :dataProp="dialogAddPhoneMobileEmail.data"
        :type="dialogAddPhoneMobileEmail.type"
        @confirm="confirmAddPhoneMobileEmail"
        @closeDialog="clearDialogAddPhoneMobileEmail"
      />
      <DialogRemovePhoneMobileEmail
        :dataType="dialogRemovePhoneMobileEmail.dataType"
        :open="dialogRemovePhoneMobileEmail.open"
        :type="dialogAddPhoneMobileEmail.type"
        @confirm="confirmRemovePhoneMobileEmail"
        @closeDialog="clearDialogAddPhoneMobileEmail"
      />
      <DialogAddSocialNetwork
        :open="dialogAddSocialNetwork.open"
        :dataProp="dialogAddSocialNetwork.data"
        :type="dialogAddSocialNetwork.type"
        @confirm="confirmAddSocialNetwork"
        @closeDialog="clearDialogSocialNetwork"
      />

      <DialogFormation
        :open="dialogFormation.open"
        :dataProp="dialogFormation.data"
        :fieldIndex="dialogFormation.fieldIndex"
        :tabsIndex="dialogFormation.tabsIndex"
        @confirm="confirmFormation"
        @closeDialog="clearFormationInputs"
      />

      <DialogAddPastoralData
        :open="dialogAddPastoralData.open"
        :dataProps="dialogAddPastoralData.data"
        @closeDialog="closeAddPastoralDataDialog"
        @confirm="savePastoralDataSugestion"
      />
      
    </q-page>
  </q-page-container>
</template>

<script setup>

import useFetch from "../../boot/useFetch";
import DialogAddPerson from '../../components/DialogAddPerson.vue'
import DialogAddSocialNetwork from  '../../components/DialogAddSocialNetwork.vue'
import DialogAddress from '../../components/DialogAddress.vue'
import DialogAddOrganism from '../../components/DialogAddOrganism.vue'
import DialogBankData from '../../components/DialogBankData.vue'
import DialogPhoneMobileEmail from '../../components/DialogPhoneMobileEmail.vue'
import DialogUserTitle from '../../components/DialogUserTitle.vue'
import DialogFormation from '../../components/DialogFormation.vue'
import DialogMaritalStatus from '../../components/DialogMaritalStatus.vue'
import DialogAddPastoralData from '../../components/DialogAddPastoralData.vue'
import CardSocialNetwork from '../../components/CardSocialNetwork.vue'
// import CardAttach from '../../components/CardAttach.vue'
// import DialogAddAttach from '../../components/DialogAddAttach.vue'
import CardAddress from '../../components/CardAddress.vue'
import CardPhoneMobileEmail from '../../components/CardPhoneMobileEmail.vue'
import CardBankData from '../../components/CardBankData.vue'
import CardPerson from '../../components/CardPerson.vue'
import CardOrganism from '../../components/CardOrganism.vue'
import CardFormation from '../../components/CardFormation.vue'
import DialogRemovePhoneMobileEmail from '../../components/DialogRemovePhoneMobileEmail.vue'
import avatar from '../../assets/avatar.svg'
import utils from '../../boot/utils'
</script>

<script>
import { defineComponent } from "vue";
import { useScreenStore } from "stores/checkIsMobile";
export default defineComponent({
  name: "UserPersonalData",
  data() {
    return {
      dialogShowOtherData: {
        open: false
      },
      otherData: null,
      userImg:null,
      isMobileState: useScreenStore().checkScreenSize(),
      isMobile: false,
      deleteTitle: {
        openDialog: false,
        titleId: null
      },
      openDialogVinculateUserToTitle: false,
      tab: "",
      tabTitles: "",
      userType: '',
      visionSelected: 'personalData',
      isSaving: false,
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
      splitterModel: 25,
      userData: {},
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
      files: '',
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
      dialogRemovePhoneMobileEmail: {
        dataType: null,
        open: false,
        tabsIndex: null,
        fieldIndex: null,
        iValue: null
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
      dialogAddSocialNetwork: {
        type: null,
        open: false,
        tabsIndex: null,
        fieldIndex: null,
        data: {
          name: '',
          value: '',
          type: ''
        },
        action: null,
        iValue: null
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
      maritalStatus: {
        open: false,
        tabsIndex: null,
        fieldIndex: null,
        data: {
          status: '',
          spouses: []
        },
        action: null,
        iValue: null,
      },
      userPhoto: null,
      dialogAddPastoralData: {
        open: false,
        data: null,
        fields: null
      },
      dialogAddAttach: {
        open: false,
        data: null,
        tabsIndex: null,
        fieldIndex: null,
        iValue: null,
        action: 'add'
      }
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getUsersConfig()
    this.isMobile = useScreenStore().isMobile
  },
  methods: {
    editAttach(fieldIndex, tabsIndex, field, value, iValue) {
      this.dialogAddAttach.open = true,
      this.dialogAddAttach.fieldIndex = fieldIndex
      this.dialogAddAttach.tabsIndex = tabsIndex
      this.dialogAddAttach.data = {...value}
      this.dialogAddAttach.iValue = iValue
      this.dialogAddAttach.action = 'edit'
    },
    confirmAddAttach(attach) {
      if (this.dialogAddAttach.action === 'add') {
        if (!this.userData.userDataTabs[this.dialogAddAttach.tabsIndex].fields[this.dialogAddAttach.fieldIndex].value) {
          this.userData.userDataTabs[this.dialogAddAttach.tabsIndex].fields[this.dialogAddAttach.fieldIndex].value = []
        }
        this
          .userData
          .userDataTabs[this.dialogAddAttach.tabsIndex]
          .fields[this.dialogAddAttach.fieldIndex]
          .value.push({attach: attach._value.__key})
        this.dialogAddAttach.open = false
      } else if (this.dialogAddAttach.action === 'edit') {
        console.log(this.dialogAddAttach.iValue)
        this
          .userData
          .userDataTabs[this.dialogAddAttach.tabsIndex]
          .fields[this.dialogAddAttach.fieldIndex]
          .value[this.dialogAddAttach.iValue] = attach._value.__key
      }
    },
    clkOpenAttachDialog(fieldIndex, tabsIndex, iValue) {
      this.dialogAddAttach.fieldIndex = fieldIndex
      this.dialogAddAttach.tabsIndex = tabsIndex
      this.dialogAddAttach.iValue = iValue
      this.dialogAddAttach.open = true
    },
    editSocialNetwork(fieldIndex, tabsIndex, field, value, iValue) {
      this.dialogAddSocialNetwork = {
        open: true,
        tabsIndex,
        fieldIndex,
        data: {...value},
        action: 'edit',
        iValue,
        field
      }
    },
    removeAttach(fieldIndex, tabsIndex, field, value, iValue) {
      console.log(this
        .userData
        .userDataTabs[tabsIndex]
        .fields[fieldIndex]
        .value)
        console.log(iValue)
      this
        .userData
        .userDataTabs[tabsIndex]
        .fields[fieldIndex]
        .value
        .splice(iValue, 1)
    },
    removeSocialNetwork(fieldIndex, tabsIndex, field, value, iValue) {
      this
        .userData
        .userDataTabs[tabsIndex]
        .fields[fieldIndex]
        .value
        .splice(iValue, 1)
    },
    rejectUserPhoto(){
      $q.notify({
        type: 'negative',
        message: 'Os formatos de imagem aceitos são jpg e png'
      })
    },
    addUserImage() {
      const file = [{file:this.userImg,name:'userPhoto'}]
      const opt = {
        route: "/desktop/user/addUserImage",
        file: null
      };
      if(this.userImg !== null){
        opt.file = file
        // this.userPhoto = URL.createObjectURL(this.userImg);
      }
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        } this.$q.notify('Imagem inserida com sucesso!')
        this.getUserDetailById()
      });
    },
    confirmAddSocialNetwork(data) {
      if (this.dialogAddSocialNetwork.action === 'add') {
        if (!this.userData.userDataTabs[this.dialogAddSocialNetwork.tabsIndex].fields[this.dialogAddSocialNetwork.fieldIndex].value){
          this.userData.userDataTabs[this.dialogAddSocialNetwork.tabsIndex].fields[this.dialogAddSocialNetwork.fieldIndex].value = []
        }
        this.userData.userDataTabs[this.dialogAddSocialNetwork.tabsIndex].fields[this.dialogAddSocialNetwork.fieldIndex].value.push({...data})
      } else if (this.dialogAddSocialNetwork.action === 'edit') {
        this
          .userData
          .userDataTabs[this.dialogAddSocialNetwork.tabsIndex]
          .fields[this.dialogAddSocialNetwork.fieldIndex]
          .value[this.dialogAddSocialNetwork.iValue] = {...data}
      }
      this.dialogAddSocialNetwork.open = false
    },
    clearDialogSocialNetwork() {
      this.dialogAddSocialNetwork = {
        open: false,
      }
    },
    async savePastoralDataSugestion (data) {
      const opt = {
        route: '/desktop/users/savePastoralDataSuggestion',
        body: {
          data
        }
      }
      this.$q.loading.show()
      const r = useFetch(opt)
      this.$q.loading.hide()
      if (r.error) {
        this.$q.notify('Ocorreu um erro. Tente novamente')
        return
      }
      this.$q.notify('Solicitação encaminhada com sucesso')
      this.getUsersConfig()
    },
    clkAddPastoralData () {
      this.dialogAddPastoralData.open = true
      this.dialogAddPastoralData.data = {...this.dialogAddPastoralData.fields}
    },
    closeAddPastoralDataDialog () {
      this.dialogAddPastoralData.open = true
      this.dialogAddPastoralData.data = {...this.dialogAddPastoralData.fields}
    },
    clearMaritalStatus () {
      this.maritalStatus = {
        open: false,
        tabsIndex: null,
        fieldIndex: null,
        data: null,
        action: null,
      }
    },
    // closeDialog() {
    //   thius.dialogAddPastoralData.open = false
    // },
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
    removeFormation (fieldIndex, tabsIndex, field, value, iValue) {
      this
        .userData
        .userDataTabs[tabsIndex]
        .fields[fieldIndex]
        .value
        .splice(iValue, 1)
    },
    editFormation (fieldIndex, tabsIndex, field, value, iValue) {
      this.dialogFormation = {
        open: true,
        tabsIndex,
        fieldIndex,
        data: {...value},
        action: 'edit',
        iValue,
        field
      }
    },
    clkAddFormation (fieldIndex, tabsIndex) {
      this.dialogFormation = {
        open: true,
        tabsIndex,
        fieldIndex,
        data: {
          value: '',
          type: ''
        },
        action: 'add',
        iValue: null
      }
    },
    clkAddSocialNetwork (fieldIndex, tabsIndex) {
      this.dialogAddSocialNetwork = {
        open: true,
        fieldIndex,
        tabsIndex,
        data: {
          value: '',
          type: ''
        },
        action: 'add',
        iValue: null
      }
    },
    confirmFormation (data) {
      if (this.dialogFormation.action === 'add') {
        if (!this.userData.userDataTabs[this.dialogFormation.tabsIndex].fields[this.dialogFormation.fieldIndex].value)
          this
            .userData
            .userDataTabs[this.dialogFormation.tabsIndex]
            .fields[this.dialogFormation.fieldIndex]
            .value = []
        this
          .userData
          .userDataTabs[this.dialogFormation.tabsIndex]
          .fields[this.dialogFormation.fieldIndex]
          .value.push(data)
      } else if (this.dialogFormation.action === 'edit') {
        this
          .userData
          .userDataTabs[this.dialogFormation.tabsIndex]
          .fields[this.dialogFormation.fieldIndex]
          .value[this.dialogFormation.iValue] = data
      }
      this.clearFormationInputs()
      
    },
    clearFormationInputs () {
      this.dialogFormation = {
        open: false,
        tabsIndex: null,
        fieldIndex: null,
        data: {
          value: '',
          type: ''
        },
        action: null,
        iValue: null
      }
    },
    editBankData (fieldIndex, tabsIndex, field, value, iValue) {
      this.dialogAddBankData.userHasDoc = this.verifyIfUserHasDocument()
      this.dialogAddBankData.open = true
      this.dialogAddBankData.fieldIndex = fieldIndex
      this.dialogAddBankData.tabsIndex = tabsIndex
      this.dialogAddBankData.data = {...value}
      this.dialogAddBankData.iValue = iValue
      this.dialogAddBankData.action = 'edit'
    },
    removeBankData (fieldIndex, tabsIndex, field, value, iValue) {
      this
        .userData
        .userDataTabs[tabsIndex]
        .fields[fieldIndex]
        .value
        .splice(iValue, 1)
    },
    clkShowDetailPerson(field) {
      const opt = {
        route: '/desktop/users/getOtherUserDetailById',
        body: {
          _id: field.value[0]._id
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) return 
        else {
          this.otherData = r.data
          this.dialogShowOtherData.open = true
        }
      })
    },
    clearDialogAddPhoneMobileEmail () {
      this.dialogRemovePhoneMobileEmail = {
        open: false,
        dataType: null,
        tabsIndex: null,
        fieldIndex: null,
        iValue: null
      }
      this.dialogRemovePhoneMobileEmail.open = false
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
    verifyIfUserHasDocument () {
      let hasDoc = false
      let doc = ''
      let tabWithDoc
      let fieldWithDoc
      this.userData.userDataTabs.forEach((userTab, iTab) => {
        userTab.fields.forEach((userField, iField) => {
          if (userField.model === 'cpf' || userField.model === 'cnpj' || userField.model === 'documento') {
            tabWithDoc = iTab
            fieldWithDoc = iField
          }
          if ((userField.model === 'cpf' && userField.value && userField.value !== '')
          || (userField.model === 'cnpj' && userField.value && userField.value !== '')
          || (userField.model === 'documento' && userField.value && userField.value !== '')) {
            hasDoc = true
            doc = userField.value
          }
        })
      })
      return { hasDoc, tabWithDoc, doc, fieldWithDoc }
    },
    clearBankDataInputs () {
      this.dialogAddBankData.data = {
        bank: '',
        agency: '',
        account: '',
        pix: ''
      }
      this.dialogAddBankData.userHasDoc = {
        hasDoc: false,
        doc: ''
      }
      this.dialogAddBankData.open = false
    },
    confirmAddBankData (data, doc) {
      if (this.dialogAddBankData.action === 'add') {
        if (!this.userData.userDataTabs[this.dialogAddBankData.tabsIndex].fields[this.dialogAddBankData.fieldIndex].value)
          this.userData.userDataTabs[this.dialogAddBankData.tabsIndex].fields[this.dialogAddBankData.fieldIndex].value = []
        this
          .userData
          .userDataTabs[this.dialogAddBankData.tabsIndex]
          .fields[this.dialogAddBankData.fieldIndex]
          .value.push({
            bank: data.bank,
            agency: data.agency,
            account: data.account,
            pix: data.pix,
          });
        this.userData
          .userDataTabs[this.dialogAddBankData.userHasDoc.tabWithDoc]
          .fields[this.dialogAddBankData.userHasDoc.fieldWithDoc]
          .value = doc
      } else if (this.dialogAddBankData.action === 'edit') {
        this
          .userData
          .userDataTabs[this.dialogAddBankData.tabsIndex]
          .fields[this.dialogAddBankData.fieldIndex]
          .value[this.dialogAddBankData.iValue] = { ...data }
      }
      this.dialogAddBankData.open = false
      this.updateUserData()
    },
    clkAddBankData(fieldIndex, tabsIndex) {
      const userHasDoc = this.verifyIfUserHasDocument()
      this.dialogAddBankData.userHasDoc = userHasDoc
      this.dialogAddBankData.open = true
      this.dialogAddBankData.fieldIndex = fieldIndex
      this.dialogAddBankData.tabsIndex = tabsIndex
      this.dialogAddBankData.action = 'add'
    },
    saveProfilePhoto() {
      const opt = {
        route:'/desktop/commonUsers/addProfilePhotoById',
        file: [
          {
            name: 'foto',
            file: this.files
          }
        ]
      }
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente')
          return
        } else{
          this.$q.notify('Imagem inserida com sucesso!'); 
        }
      })
    },
    onRejected() {
      this.$q.notify({
        type: 'negative',
        message: `O arquivo precisa ser em formato PNG ou JPG.`
      })
    },
    checkFileType (files) {
      return files.filter(file => file.type === 'image/png' || file.type === 'image/jpeg')
    },
    clkConfirmDeleteTitle() {
      const opt = {
        route: '/desktop/commonUsers/inactivateUserTitle',
        body: {
          userTitleId: this.deleteTitle.titleId
        }
      };
      
      useFetch(opt).then(r => {
        if (r.error) {
          this.$q.notify(r.errorMessage)
          return
        }
        this.deleteTitle.openDialog = false
        this.deleteTitle.titleId = null
        this.getUserDetailById()
      })
    },
    clkDeleteTitle(titleId) {
      this.deleteTitle.titleId = titleId
      this.deleteTitle.openDialog = true
    },
    updateUserTitle(i) {
      const opt = {
        route:'/desktop/commonUsers/updateUserTitleFields',
        body:  {
          titleFields: i.titleFields,
          userTitleId: i._id,
        }
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente')
          return
        } else{
          this.$q.notify('Título atualizado com sucesso!'); 
          this.getUserDetailById()
        }
      });
    },
    createUserTitle(titleSelected){
      const opt = {
        route:'/desktop/commonUsers/createUserTitle',
        body: {
          titleConfigId: titleSelected._id
        }
      };
      this.openDialogVinculateUserToTitle = false
      useFetch(opt).then((r)=> {
        this.$q.loading.hide()
        if(r.error) {
          this.$q.notify("Erro ao inserir título, tente novamente mais tarde")
          return
        }
        this.getUserDetailById()
      })
    },
    addDoubleSelection(tabsIndex, fieldIndex){
      if (!this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value) {
        this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value = []
      }
      this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value.push([])
    },
    removeThisPerson(fieldIndex, tabsIndex, personIndex) {
      this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value.splice(personIndex, 1);
      this.closeAddPersonDialog()
      this.updateUserData()
    },
    removeThisOrganism(fieldIndex, tabsIndex, organismIndex) {
      this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value.splice(organismIndex, 1);
      this.clearOrganismInputs()
    },
    clearOrganismInputs() {
      this.addOrganism.dialogOpen = false
      this.addOrganism.organismSelected = null
    },
    closeAddPersonDialog () {
      this.addPerson.userSelected = null
      this.addPerson.dialogOpen = false
    },
    getUserByString (val, update) {
      if (val < 2) return
      const opt = {
        route: '/desktop/users/getUsersList',
        body: {
          searchString: val
        }
      }
      useFetch(opt).then(r => {
        if (r.error) return this.$q.notify(r.errorMessage)
        update(() => {
          this.addPerson.usersOptions = r.data.list
        })
      })
    },
    
    confirmAddPerson (userSelected) {
      this.addPerson.userSelected = userSelected
      if (!this.userData.userDataTabs[this.addPerson.tabIndex].fields[this.addPerson.fieldIndex].multiple)
        this.userData.userDataTabs[this.addPerson.tabIndex].fields[this.addPerson.fieldIndex].value = [ this.addPerson.userSelected ]
      else {
        if (!this.userData.userDataTabs[this.addPerson.tabIndex].fields[this.addPerson.fieldIndex].value
          || this.userData.userDataTabs[this.addPerson.tabIndex].fields[this.addPerson.fieldIndex].value === ''
          ) {
            this.userData.userDataTabs[this.addPerson.tabIndex].fields[this.addPerson.fieldIndex].value = [ this.addPerson.userSelected ]
        } else {
          this.userData.userDataTabs[this.addPerson.tabIndex].fields[this.addPerson.fieldIndex].value.push(this.addPerson.userSelected)
        }
      }
      this.updateUserData()
      this.closeAddPersonDialog()
      this.addPerson.dialogOpen = false
    },
    confirmAddOrganism(organismSelected) {
      if (!this.userData.userDataTabs[this.addOrganism.tabIndex].fields[this.addOrganism.fieldIndex].multiple)
        this.userData.userDataTabs[this.addOrganism.tabIndex].fields[this.addOrganism.fieldIndex].value = [ organismSelected ]
      else {
        if (!this.userData.userDataTabs[this.addOrganism.tabIndex].fields[this.addOrganism.fieldIndex].value
          || this.userData.userDataTabs[this.addOrganism.tabIndex].fields[this.addOrganism.fieldIndex].value === ''
          ) {
            this.userData.userDataTabs[this.addOrganism.tabIndex].fields[this.addOrganism.fieldIndex].value = [ organismSelected ]
        } else {
          this.userData.userDataTabs[this.addOrganism.tabIndex].fields[this.addOrganism.fieldIndex].value.push(organismSelected)
        }
      }
      this.clearOrganismInputs()
    },
    clkOpenAddPersonDialog (fieldIndex, tabIndex) {
      this.addPerson.fieldIndex = fieldIndex
      this.addPerson.tabIndex = tabIndex
      this.addPerson.dialogOpen = true
    },
    clkOpenAddOrganismDialog(fieldIndex, tabIndex) {
      this.addOrganism.fieldIndex = fieldIndex
      this.addOrganism.tabIndex = tabIndex
      this.addOrganism.dialogOpen = true
    },
    clkOpenAddressDialog(fieldIndex, tabIndex) {
      this.dialogConfirmAddress.action = 'add'
      this.dialogConfirmAddress.open = true
      this.dialogConfirmAddress.fieldIndex = fieldIndex
      this.dialogConfirmAddress.tabsIndex = tabIndex
    },
    salvar() {
      this.isSaving = true;
      this.updateUserData();
      setTimeout(() => {
        this.isSaving = false;
      }, 1000);
    },
    addPhoneMobileEmail(fieldIndex, tabsIndex, field) {
      this.dialogAddPhoneMobileEmail.action = 'add'
      this.dialogAddPhoneMobileEmail.open = true
      this.dialogAddPhoneMobileEmail.type = field.type
      this.dialogAddPhoneMobileEmail.fieldIndex = fieldIndex
      this.dialogAddPhoneMobileEmail.tabsIndex = tabsIndex
    },
    confirmAddPhoneMobileEmail (data) {
      if (this.dialogAddPhoneMobileEmail.action === 'add') {
        if (!this.userData.userDataTabs[this.dialogAddPhoneMobileEmail.tabsIndex].fields[this.dialogAddPhoneMobileEmail.fieldIndex].value){
          this.userData.userDataTabs[this.dialogAddPhoneMobileEmail.tabsIndex].fields[this.dialogAddPhoneMobileEmail.fieldIndex].value = []
        }
        this.userData.userDataTabs[this.dialogAddPhoneMobileEmail.tabsIndex].fields[this.dialogAddPhoneMobileEmail.fieldIndex].value.push({...data})
      } else if (this.dialogAddPhoneMobileEmail.action === 'edit') {
        this
          .userData
          .userDataTabs[this.dialogAddPhoneMobileEmail.tabsIndex]
          .fields[this.dialogAddPhoneMobileEmail.fieldIndex]
          .value[this.dialogAddPhoneMobileEmail.iValue] = {...data}
      }
      this.dialogAddPhoneMobileEmail.open = false
      this.updateUserData()
    },
    editPhoneMobileEmail (fieldIndex, tabsIndex, field, value, iValue) {
      this.dialogAddPhoneMobileEmail.open = true
      this.dialogAddPhoneMobileEmail.type = this.userData.userDataTabs[tabsIndex].fields[fieldIndex].type
      this.dialogAddPhoneMobileEmail.fieldIndex = fieldIndex
      this.dialogAddPhoneMobileEmail.tabsIndex = tabsIndex
      this.dialogAddPhoneMobileEmail.data = {...value}
      this.dialogAddPhoneMobileEmail.action = 'edit'
      this.dialogAddPhoneMobileEmail.iValue = iValue
    },
    removePhoneMobileEmail (fieldIndex, tabsIndex, field, value, iValue) {
      this.dialogRemovePhoneMobileEmail.open = true
      this.dialogRemovePhoneMobileEmail.fieldIndex = fieldIndex
      this.dialogRemovePhoneMobileEmail.tabsIndex = tabsIndex
      this.dialogRemovePhoneMobileEmail.iValue = iValue
      this.updateUserData()
    },
    confirmRemovePhoneMobileEmail(){
      this
        .userData
        .userDataTabs[this.dialogRemovePhoneMobileEmail.tabsIndex]
        .fields[this.dialogRemovePhoneMobileEmail.fieldIndex]
        .value
        .splice(this.dialogRemovePhoneMobileEmail.iValue , 1)
        this.dialogRemovePhoneMobileEmail.open = false
        this.updateUserData()
    },
    confirmAddress(data) {
      const fieldIndex = this.dialogConfirmAddress.fieldIndex
      const tabsIndex = this.dialogConfirmAddress.tabsIndex
      const valueIndex = this.dialogConfirmAddress.valueIndex
      if (this.dialogConfirmAddress.action === 'add') {
        if (!this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value)
          this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value = []
        this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value.push({
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
        this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value[valueIndex] = {
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
      this.updateUserData()
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
    removePhone(i) {
      this.userData.generalData.phones.splice(i, 1);
      this.updateUserData()
    },
    removeAddress(i) {
      this.userData.generalData.address.splice(i, 1);
      this.updateUserData()
    },
    removeEmail(i) {
      this.userData.generalData.email.splice(i, 1);
      this.updateUserData()
    },
    getUsersConfig() {
      const opt = {
        route: "/desktop/users/getUserConfig",
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if (!r.error) {
          this.userData = r.data
          r.data.userDataTabs[0] ? this.tab = r.data.userDataTabs[0].tabValue : this.tab = ''
          this.getUserDetailById()
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente");
        }
      });
    },
    updateUserData() {
      const opt = {
        route: "/desktop/user/updateUserData",
        body: {
          userDataTabs: this.userData.userDataTabs,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if (!r.error) {
          this.$q.notify("Usuário atualizado com sucesso!");
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente");
        }
      });
    },
    removeThisAddress(fieldIndex, tabsIndex, valueIndex) {
      this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value.splice(valueIndex, 1);
    },
    editThisAddress(fieldIndex, tabsIndex, valueIndex){
      this.dialogConfirmAddress = {
        open: true,
        fieldIndex,
        tabsIndex,
        valueIndex,
        action: 'edit',
        data: {
          cep: this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value[valueIndex].cep,
          addressType: this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value[valueIndex].type,
          street: this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value[valueIndex].street,
          number: this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value[valueIndex].number,
          district: this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value[valueIndex].district,
          complement: this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value[valueIndex].complement,
          city: this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value[valueIndex].city,
          state: this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value[valueIndex].state,
        }
      }
    },
    getUserDetailById(){
      const opt = {
        route:"/desktop/user/getUserDetailById"
      }
      useFetch(opt).then((r) => {
        if(r.error) {
          return
        }
        // this.userDetail = r.data
        this.userType = r.data.userType
        this.mountUserData(r.data)
      })
    },
    mountUserData (userDetail) {
      this.dialogAddPastoralData.fields = {
        fields: {...this.userData.userDataTabs[this.userData.userDataTabs.length - 1].fields}
      }
      this.userData.userDataTabs.forEach((configTab, iConfigTab) => {
        configTab.fields.forEach((configField, iConfigField) => {
          userDetail.userDataTabs.forEach((userTab) => {
            userTab.fields.forEach((userField) => {
              if (configField.model === userField.model && userField.value) {
                this.userData.userDataTabs[iConfigTab].fields[iConfigField].value = userField.value
              }
            })
          })
        })
      })
      this.userData.profileImage = userDetail.profileImage
    },
  },
});
</script>
<style scoped>
.flex-center{
  justify-content: flex-start;
}
</style>


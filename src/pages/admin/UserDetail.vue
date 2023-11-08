<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="row">
          <q-item-section avatar>
            <q-img 
              style="border-radius: 1rem"
              :src="userProfileImage ? utils.makeFileUrl(userProfileImage) : avatar" 
              width="74px" 
              height="74px"
            />
          </q-item-section>
        </div>
        <div class="col text-h5 text-capitalize" v-if="userData && userData.userDataTabs">
          {{ userData.userDataTabs[0].fields[0].value }} 
        </div>
        <div class="col q-gutter-sm text-right">
          <q-btn
            color="red-8"
            rounded
            outline
            icon="delete"
            size="md"
            no-caps
            label="Inativar"
            @click="openDialogRemoveUser = true"
          />
          <q-btn
            color="primary"
            rounded
            unelevated
            no-caps
            label="Vínculos"
            @click="dialogShowLinks.open = true"
          />
        </div>
      </div>
      <q-separator class="q-mx-md"/>
      <div v-if="userData && userData.userDataTabs">
        <q-list bordered>
          <div v-for="(tabs, i) in userData.userDataTabs" :key="i">
            <q-expansion-item
              v-if="userType === 'user' ? tabs.tabLabel !== 'Dados pastorais' : tabs.tabLabel"
              group="somegroup"
              class="bg-grey-3"
              header-class="text-primary"
              :label="tabs.tabLabel"
            >
              <q-card>
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
                            :readonly="!tabs.onlyAdm"
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
                          :readonly="!tabs.onlyAdm"
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
                            :readonly="!tabs.onlyAdm"
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
                                  :readonly="!tabs.onlyAdm"
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
                          :readonly="!tabs.onlyAdm"
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
                                :disable="!tabs.onlyAdm"
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
                            <q-btn
                              :label="`Adicionar ${field.label}`"
                              no-caps
                              rounded
                              flat
                              color="primary"
                              icon="add"
                              v-if="field.multiple || !field.value || field.value ==='' || field.value.length === 0"
                              @click="clkOpenAddOrganismDialog(fieldIndex, tabsIndex)"
                              :disable="!tabs.onlyAdm"
                            />
                            <CardOrganism
                              :data="field"
                              :fieldIndex="fieldIndex"
                              :tabsIndex="tabsIndex"
                              :disableButtons="!tabs.onlyAdm"
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
                            :disable="!tabs.onlyAdm"
                          />
                          <CardAddress
                            :data="field.value"
                            :fieldIndex="fieldIndex"
                            :tabsIndex="tabsIndex"
                            :disableButtons="!tabs.onlyAdm"
                          />
                        </div>
    
                        <div v-if="field.type.type === 'person'">
                          <div v-if="field.value && field.value.length > 0">
                            <div class="text-body">{{ field.label }}</div>
                            <CardPerson
                              :data="field"
                              :fieldIndex="fieldIndex"
                              :tabsIndex="tabsIndex"
                              :disableButtons="!tabs.onlyAdm"
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
                            :disable="!tabs.onlyAdm"
                          />
                        </div>
    
                        <div v-if="field.type.type === 'maritalStatus'">
                          <div v-if="field.value && field.value.length > 0">
                            <div class="text-body">{{ field.label }}</div>
                            <CardMaritalStatus
                              :data="field"
                              :fieldIndex="fieldIndex"
                              :tabsIndex="tabsIndex"
                              :disableButtons="!tabs.onlyAdm"
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
                            :disable="!tabs.onlyAdm"
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
                            :disable="!tabs.onlyAdm"
                          />
                          <CardBankData
                            :data="field"
                            :fieldIndex="fieldIndex"
                            :tabsIndex="tabsIndex"
                            :disableButtons="!tabs.onlyAdm"
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
                            :disable="!tabs.onlyAdm"
                          />
                          <CardPhoneMobileEmail
                            :data="field.value"
                            :fieldIndex="fieldIndex"
                            :tabsIndex="tabsIndex"
                            :disableButtons="!tabs.onlyAdm"
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
                            :disable="!tabs.onlyAdm"
                          />
                          <CardFormation
                            :data="field"
                            :fieldIndex="fieldIndex"
                            :tabsIndex="tabsIndex"
                            :disableButtons="!tabs.onlyAdm"
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
          </div>
        </q-list>
      </div>
      
      <!-- <q-splitter
        v-model="splitterModel"
        style="height: 100vh;"
        v-show="visionSelected === 'personalData'"
      >
        <template v-slot:before>
          <q-tabs
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
                class="flex-left flex"
                :name="tabs.tabValue" 
                :label="tabs.tabLabel" 
              />
              <q-separator/>
            </template>
            <template v-if="userForms && userForms.length">
              <q-tab 
                class="flex-left flex"
                name="forms" 
                label="Formulários" 
                icon="feed"
              />
              <q-separator />
            </template>
          </q-tabs>
        </template>
        <template v-slot:after>
          <q-tab-panels 
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
              <q-list class="text-left text-h6">
                <q-item>
                  <q-item-section>{{ tabs.tabLabel }}:</q-item-section>
                </q-item>
              </q-list>
              <div
                v-for="(field, fieldIndex) in tabs.fields"
                :key="fieldIndex"
                class="q-my-md"
              >
                <div class="row q-gutter-sm justify-left items-left">
                  <div class="col q-mx-lg">
                    <div v-if="
                      field.type.type !== 'boolean'
                      && field.type.type !== 'address'
                      && field.type.type !== 'options'
                      && field.type.type !== 'person'
                      && field.type.type !== 'organism'
                      && field.type.type !== 'attach'
                      && field.type.type !== 'multiple_select'
                      && field.type.type !== 'bank_data'
                      && field.type.type !== 'email'
                      && field.type.type !== 'phone'
                      && field.type.type !== 'mobile'
                    "
                    >
                      <q-input
                        :label="field.label"
                        :hint="field.hint"
                        :mask="field.type.mask"
                        v-model="field.value"
                        outlined
                      >
                      </q-input>
                    </div>
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
                      />
                    </div>
                    <div class="text-center" v-if="field.type.type === 'multiple_select'">
                      <div
                        v-for="(value, valueIndex) in field.value"
                        :key="valueIndex"
                        class="q-pa-sm"
                      >
                        <div class="col text-h5 q-pa-sm" style="border-radius: 1rem">
                          <div class="q-pl-md q-py-sm">
                            {{ field.label }}:
                          </div>
                          <div class="row text-center justify-center">
                            <q-select
                              v-for="(select, selectIndex) in field.selects"
                              :key="select"
                              outlined
                              disable
                              :label="select.label"
                              emit-value
                              map-options
                              v-model="userData.userDataTabs[tabsIndex].fields[fieldIndex].value[valueIndex][selectIndex]"
                              style="width: 50%;"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div v-if="field.type.type === 'address'">
                      <div class="text-body2">Endereços</div>
                      <q-list
                        class="bg-grey-3"
                        style="border-radius: 1rem"
                        v-if="field.value"
                        separator
                      >
                        <q-item
                          v-for="(item, i) in field.value"
                          :key="item + i"
                        >
                          <q-item-section>
                            <q-item-label class="text-capitalize">
                              {{ item.street }}, {{ item.number }}
                            </q-item-label>
                            <q-item-label caption>
                              {{ item.district }} - {{ item.city }}
                            </q-item-label>
                            <q-item-label caption>
                              CEP
                              {{ item.cep }}
                            </q-item-label>
                            <q-item-label caption>
                              Complemento:
                              {{ item.complement }}
                            </q-item-label>
                            <q-item-label caption class="text-capitalize">
                              <q-badge>{{ item.type }}</q-badge>
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>

                    <div v-if="field.type.type === 'attach'">
                      <q-item>
                        <q-item-section>
                          <q-item-label class="text-h5">
                            {{ field.label }}
                          </q-item-label>
                          <q-item-label class="text-subtitle1">
                            {{ field.hint }}
                          </q-item-label>
                          <q-item-label v-for="docs in field.value" :key="docs">
                              {{ docs.__key }}
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </div>

                    <q-checkbox
                      v-if="field.type.type === 'boolean'"
                      class="q-pt-lg"
                      readonly
                      :label="field.label"
                      :hint="field.hint"
                      v-model="field.value"
                    />

                    <div v-if="field.type.type === 'person'">
                      <div v-if="field.value && field.value.length > 0">
                        <div class="text-body">{{ field.label }}</div>
                        <q-list class="no-margin">
                          <q-item
                            v-for="(item, i) in field.value"
                            :key="item + i"
                            style="border-radius: 1rem"
                            class="bg-grey-3 q-ma-sm q-pa-md"
                          >
                            <q-item-section>
                              <q-item-label class="text-capitalize">
                                {{ item.userName }}
                              </q-item-label>
                              <q-item-label caption>
                                {{ item.email }}
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </div>
                    </div>
                    <div v-if="field.type.type === 'organism'">
                      <div v-if="field.value && field.value.length > 0">
                        <div class="text-body">{{ field.label }}</div>
                        <q-list class="no-margin">
                          <q-item
                            v-for="(item, i) in field.value"
                            :key="item + i"
                            style="border-radius: 1rem"
                            class="bg-grey-3 q-ma-sm q-pa-md"
                          >
                            <q-item-section>
                              <q-item-label class="text-capitalize">
                                {{ item.organismName }}
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </div>
                    </div>

                    <div v-if="field.type.type === 'bank_data'">
                      <div class="text-body2">Dados bancários</div>
                      <q-list
                        v-if="field.value"
                        separator
                        style="border-radius: 1rem"
                        class="bg-grey-3"
                      >
                        <q-item
                          v-for="(item, i) in field.value"
                          :key="item + i"
                        >
                          <q-item-section>
                            <q-item-label class="text-capitalize">
                              {{ item.bank }}
                            </q-item-label>
                            <q-item-label caption>
                              Agência {{ item.agency }}
                            </q-item-label>
                            <q-item-label caption>
                              Agência {{ item.account }}
                            </q-item-label>
                            <q-item-label caption v-if="item.pix !== ''">
                              Pix {{ item.pix }}
                            </q-item-label>
                            <q-item-label></q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>

                    <div v-if="
                      field.type.type === 'email'
                      || field.type.type === 'phone'
                      || field.type.type === 'mobile'
                      "
                    >
                      <div class="text-body2">{{ field.type.label }}</div>
                      <q-list
                        class="bg-grey-3"
                        v-if="field.value"
                        style="border-radius: 1rem"
                        separator
                      >
                        <q-item
                          v-for="(value, iValue) in field.value"
                          :key="'multField' + iValue"
                        >
                          <q-item-section>
                            <q-item-label>
                              {{ value.value }}
                            </q-item-label>
                            <q-item-label caption >
                              <q-badge>{{ value.type }}</q-badge>
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>

                  </div>
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel
              name="forms"
            >
              <div class="text-body1 q-pa-sm" v-if="userForms && userForms.length">
                Formulários direcionados ao usuário
              </div>
              <div class="text-caption q-pa-sm" v-if="userForms && userForms.length">
                Utilize os botões abaixo para preencher um formulário
              </div>
              <div class="row" v-if="userForms && userForms.length">
                <div
                  class="col q-px-xs"
                >
                  <q-btn
                    v-for="form in userForms"
                    :key="form"
                    no-caps
                    class="q-ma-sm"
                    outline
                    unelevated
                    color="primary"
                    @click="openUserFormDialog(form)"
                    :label="form.formName"
                  />
                </div>
                <div class="row full-width q-pa-md">
                  <div class="col-12">
                    <div class="text-body1 q-pa-sm" v-if="savedForms && savedForms.length">
                      Formulários enviados
                    </div>
                    <q-list>
                      <q-item
                        class="form-list"
                        v-for="item in savedForms"
                        :key="item"
                      >
                        <q-item-section class="texr-wrap" lines="2">
                          <q-item-label class="text-h6">{{ item.formName }}</q-item-label>
                          <div v-for="field in item.fields" :key="field">
                            <q-item-label class="text-subtitle2">
                              {{ field.label }}
                            </q-item-label>
                            <q-item-label caption>
                              {{ field.type.label }}
                            </q-item-label>
                          </div>
                        </q-item-section>
                        <q-item-section side top>
                          <q-item-label caption>{{ item.createdAt.createdAtLocale }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                </div>
              </div>
              
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter> -->

      <div v-show="visionSelected === 'titles'">
        
        <q-splitter
          v-model="splitterModel"
          style="height: 100vh;"
          v-if="userDetail"
        >
          <template v-slot:before>
            <q-tabs
              v-model="tabTitles"
              vertical
              align="left"
              class="text-left "
              no-caps
              active-bg-color="blue-1"
              indicator-color="primary"
              inline-label
              @update:model-value="addBar = false"
            >
              <template v-for="(tab) in userDetail.userTitleData" :key="tab._id">
                <q-tab 
                  class="flex-left flex"
                  :name="tab._id" 
                  :label="tab.titleName" 
                >
                <q-icon
                  v-if="tab.status.status === 'pendingApproval'"
                  name="error"
                  flat
                  size="sm"
                  color="orange"
                />
                </q-tab>
                <q-separator/>
              </template>
              <div class="text-center">
                <q-btn
                  color="secondary"
                  rounded
                  icon="add"
                  class="q-ma-md"
                  label="Adicionar"
                  unelevated
                  @click="openDialogVinculateUserToTitle = true"
                  no-caps
                />
              </div>
            </q-tabs>
          </template>
          <template v-slot:after>
            <q-tab-panels 
              animated 
              swipeable
              transition-prev="jump-up"
              transition-next="jump-up"
              class="bg-accent"
              :model-value="tabTitles"
            >
              <q-tab-panel 
                v-for="(tab, tabIndex) in userDetail.userTitleData"
                :key="tab._id"
                :name="tab._id" 
              >
                <div class="row">
                  <div 
                    class="col text-h6"
                  >
                  {{ tab.titleName }}:</div>
                  <div 
                    v-if="tab.status.status === 'pendingApproval'"
                    class="q-mr-lg"
                  >
                  <q-btn
                    label="Aprovar título"
                    color="green"
                    icon="done"
                    rounded
                    flat
                    @click="clkActiveTitle(tabIndex)"
                    no-caps
                  />
                </div>
                <q-btn
                  label="Excluir título"
                  color="red"
                  icon="close"
                  rounded
                  flat
                  @click="clkInactiveTitle(tabIndex)"
                  no-caps
                />
                </div>
                <div class="row q-gutter-sm justify-left items-left q-mt-sm">
                  <div class="col q-mx-lg">
                    <div
                    class="q-my-md"
                      v-for="(field, fieldIndex) in tab.titleFields"
                      :key="fieldIndex"
                    >
                      <div v-if="field.type.type !== 'boolean' && field.type.type !== 'address' ">
                        <q-input
                          :label="field.label"
                          :hint="field.hint"
                          :type="field.type.type"
                          v-model="field.value"
                          outlined
                        >
                          <template
                            v-if="field.multiple"
                            #append
                          >
                            <q-btn
                              disabled
                              icon="add"
                              color="primary"
                              flat
                              round
                              @click="addMultipleField"
                            >
                              <q-tooltip
                                >Adicionar multiplo
                                {{ field.type.label }}</q-tooltip
                              >
                            </q-btn>
                          </template>
                        </q-input>
                      </div>
                      <div class="text-right" v-if="field.type.type === 'address'">
                        <q-btn
                          label="Adicionar um endereço"
                          no-caps
                          rounded
                          unelevated
                          outline
                          color="primary"
                          @click="clkOpenAddressDialog(fieldIndex, tabsIndex)"
                        />
                      </div>
                      <div
                        v-if="field.type.type === 'address' && !field.address"
                        class="text-subtilte1 text-start"
                      >
                        <div class="text-h6">Endereços</div>
                        Nenhum endereço vinculado
                      </div>
                      <q-list
                        class="no-margin"
                        v-if="field.address"
                      >
                        <q-item
                          v-for="(item, i) in field.address"
                          :key="item + i"
                          style="border-radius: 1rem"
                          class="bg-grey-3 q-ma-sm q-pa-md"
                        >
                        <q-item-section>
                          <q-item-label lines="3" class="text-capitalize">
                            {{ item.street }}, {{ item.number }}
                          </q-item-label>
                          <q-item-label caption>
                            {{ item.district }} - {{ item.city }}
                          </q-item-label>
                          <q-item-label caption>
                            CEP
                            {{ item.cep }}
                          </q-item-label>
                          <q-item-label></q-item-label>
                        </q-item-section>
                        <q-item-section side top>
                          <q-item-label caption class="text-capitalize">{{
                            item.type
                          }}</q-item-label>
                        </q-item-section>
                        </q-item>
                      </q-list>
                      <q-checkbox
                        v-if="field.type.type === 'boolean'"
                        class="q-pt-lg"
                        readonly
                        :label="field.label"
                        :hint="field.hint"
                        v-model="field.value"
                      />
                    </div>
                    <div 
                      class="col-6 q-gutter-sm text-right"
                    >
                      <q-btn
                        rounded
                        no-caps
                        unelevated
                        color="primary"
                        label="Salvar"
                        @click="updateUserTitle(tab)"
                      />
                    </div>
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </template>
        </q-splitter>
      </div>

      <q-dialog v-model="userFormDialog.open" @before-show="getFormDetailById">
        <q-card style="border-radius: 1rem; min-width: 650px">
          <q-card-section>
            <div
              class="q-gutter-sm"
              v-if="userFormDialog.data.length"
            >
            <div class="text-h6 text-center">Dados do formulário</div>
              <div v-for="(field, i) in userFormDialog.data" :key="i">
                <q-input
                  v-if="field.type.type !== 'boolean' && field.type.type !== 'wisiwig'"
                  v-model="field.value"
                  outlined
                  :type="getInputType(field.type.type)"
                  :reverse-fill-mask="field.type.type === 'money'"
                  :prefix="field.type.type === 'money' ? 'R$' : null"
                  :label="field.label + (field.required ? '' : ' (Opcional)')"
                  :mask="field.type.mask"
                  :hint="field.hint"
                />
                <q-editor 
                  v-if="field.type.type === 'wisiwig'"
                  v-model="field.type.label" 
                  min-height="5rem" 
                />
                <q-checkbox
                  v-else-if="field.type.type === 'boolean'"
                  :label="field.label"
                  v-model="field.model"
                ></q-checkbox>
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="center" class="q-mb-md">
            <q-btn
              no-caps
              unelevated
              rounded
              color="primary"
              @click="saveFormData"
              label="Enviar formulário"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="openDialogVinculateUserToTitle">
        <q-card style="border-radius: 1rem; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">
              Informe o título que o usuário irá receber
            </div>
          </q-card-section>
          <q-card-section align="center">
            <q-select
              v-model="titleSelected"
              filled
              use-input
              label="Nome do título"
              option-label="titleName"
              :options="titleOptions"
              @filter="getTitleNamesList"
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
              label="Depois"
              no-caps
              rounded
              color="primary"
              @click="openDialogVinculateUserToTitle = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="createUserTitle"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

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
      <q-dialog v-model="dialogShowLinks.open">
        <q-card style="border-radius: 1rem; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">
              Vínculos:
            </div>
          </q-card-section>
          <q-card-section>
            <q-list v-if="userLinks">
              <q-item
                clickable
                v-for="link in userLinks"
                :key="link"
                style="border-radius: 1rem;"
                class="bg-blue-grey-2 q-ma-sm"
                @click="goToOrganismDetail(link.organismId)"
              >
                <q-item-section>
                  <q-item-label class="text-subtitle1"> {{ link.organismName }}</q-item-label>
                  <q-item-label>Função: {{ link.functionConfigName }}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-icon name="star" color="yellow" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Sair"
              no-caps
              rounded
              color="primary"
              @click="dialogShowLinks.open = false"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="openDialogRemoveUser">
        <q-card style="border-radius: 1rem; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">
              Tem certeza que deseja remover este usuário? 
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              no-caps
              label="Sair"
              flat
              @click="openDialogRemoveUser = false"
              color="primary"
            />
            <q-btn
              no-caps
              label="Confirmar"
              unelevated
              rounded
              @click="removeUser"
              color="primary"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogLinkDetail.open"
      >
        <q-card style="width: 800px; max-width: 100vw; border-radius: 1rem">
          <q-btn icon="close" size="large" class="q-ma-sm" flat round dense v-close-popup/>
          <div class="row justify-center q-py-lg" >
            <div class="text-h5 text-center">
              {{ dialogLinkDetail.data.organismData.organismName }}
              <div class="text-caption text-capitalize">
                {{ dialogLinkDetail.data.organismData.organismConfigName }}
              </div>
            </div>
            <div class="col-12 q-gutter-md q-mt-sm" align="start" >
              <div class="text-h6">
                Dados
              </div>
              <div v-for="(field, fieldIndex) in dialogLinkDetail.data.organismData.fields" :key="fieldIndex">
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
                    :label="field.model === 'chave_ata' || field.model === 'filiada'? 'Estamos imporando estes dados...' : field.label"
                    :hint="field.hint"
                    :mask="field.type.mask"
                    v-model="field.value"
                    outlined
                    readonly
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
                  readonly
                >
                  <template #append>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
                <div class="text-right" v-if="field.type.type === 'options'">
                  <q-select
                    outlined
                    :label="field.model === 'chave_ata' || field.model === 'filiada'? 'Estamos imporando estes dados...' : field.label"
                    option-label="optionName"
                    emit-value
                    map-options
                    :hint="field.hint"
                    v-model="field.value"
                    :options="field.options"
                    readonly
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
                  readonly
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
                        disable
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
                      disable
                    />
                    <CardOrganism
                      :data="field"
                      :fieldIndex="fieldIndex"
                      @remove="removeThisOrganism"
                      :disableButtons="true"
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
                    disable
                  />
                  <CardAddress
                    :data="field.value"
                    :fieldIndex="fieldIndex"
                    :disableButtons="true"
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
                    disable
                  />
                </div>
                <div v-if="field.type.type === 'maritalStatus'">
                  <div v-if="field.value && field.value.length > 0">
                    <div class="text-body">{{ field.label }}</div>
                    <CardMaritalStatus
                      :data="field"
                      :fieldIndex="fieldIndex"
                      :disableButtons="true"
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
                    disable
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
                    disable
                  />
                  <CardBankData
                    :data="field"
                    :fieldIndex="fieldIndex"
                    @edit="editBankData"
                    :disableButtons="true"
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
                    disable
                  />
                  <CardPhoneMobileEmail
                    :data="field.value"
                    :fieldIndex="fieldIndex"
                    :disableButtons="true"
                    @edit="editPhoneMobileEmail"
                    @remove="removePhoneMobileEmail"
                    :showHeader="field.value && field.value.length > 0 ? field.label : false"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="text-h6 q-pa-md">
            Funções
          </div>
          <q-card
            style="border-radius: 1rem"
            class="bg-grey-3 q-ma-sm q-pa-sm q"
            flat
            v-for="orgFunc in dialogLinkDetail.data.functions"
            :key="orgFunc"
          >
            <div class="text-subtitle1 text-subtitle2 q-px-md">
              {{ orgFunc.functionName }}
            </div>
            <div v-if="orgFunc.users && orgFunc.users.length">
              <q-item
                v-for="orgUser in orgFunc.users"
                :key="orgUser"
                style="border-radius: 0.5rem;"
                class="bg-white q-ma-xs"
              >
                <q-item-section avatar>
                  <q-icon name="account_circle" size="38px" color="grey"/>
                </q-item-section>
                <q-item-section class="text-wrap" lines="2" v-if="orgUser.userName">
                  {{ orgUser.userName }}
                </q-item-section>
              </q-item>
            </div>
            <div class="q-px-md " v-else>
              Nenhum usuário nesta função
            </div>
          </q-card>
          <q-card-actions align="center">
            <q-btn
              no-caps
              label="Sair"
              flat
              @click="clearLinkDialog"
              color="primary"
            />
            <q-btn
              no-caps
              label="Ir para o organismo"
              unelevated
              rounded
              @click="pushToLinkDetail"
              color="primary"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </q-page-container>
</template>

<script setup>
import CardAddress from '../../components/CardAddress.vue'
import CardPhoneMobileEmail from '../../components/CardPhoneMobileEmail.vue'
import CardBankData from '../../components/CardBankData.vue'
import CardPerson from '../../components/CardPerson.vue'
import CardOrganism from '../../components/CardOrganism.vue'
import CardFormation from '../../components/CardFormation.vue'
import CardMaritalStatus from '../../components/CardMaritalStatus.vue'
import utils from '../../boot/utils'
import avatar from '../../assets/avatar.svg'
</script>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: "UserDetail",
  data() {
    return {
      selectIndex: null,
      tab: "",
      openDialogRemoveUser: false,
      tabTitles: "",
      userType: '',
      isSaving: false,
      newPhone: "",
      userTitleName: '',
      newAddress: "",
      newEmail: "",
      allPermissions: [],
      userPermissions: [],
      formattedPermissions: [],
      userId: null,
      userData: [],
      titleSelected: '',
      titleOptions: [],
      openDialogVinculateUserToTitle: false,
      dialogInactiveUser: {
        open: false,
      },
      dialogShowLinks: {
        open: false,
        data: null
      },
      dialogBecomePastor: {
        selectPastor: [
          {label: 'Pastor', type: 'pastor'},
          {label: 'Pastor estagiário', type: 'pastor'},
          {label: 'Ex-Pastor', type: 'ex-pastor'},
        ],
        open: false,
      },
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: "",
      },
      userProfileImage: null,
      userName: '',
      splitterModel: 25,
      titleFields: [],
      savedForms: [],
      visionSelected: 'personalData',
      userDetail: null,
      deleteTitle: {
        openDialog: false,
        titleId: null
      },
      userForms: {},
      userFormDialog: {
        formId: '',
        data: {},
        open: false,
      },
      userLinks: null,
      dialogLinkDetail: {
        open: false,
        data: null
      }
    };
  },
  mounted() {
    this.$q.loading.hide();
    this.chkVisionSelected()
  },
  beforeMount() {
    // this.getUsersConfig()
    this.getUserDetailById();
  },
  methods: {
    pushToLinkDetail() {
      this.$router.push('/admin/organismDetail?organismId=' + this.dialogLinkDetail.data._id)
    },
    clearLinkDialog() {
      this.dialogLinkDetail.open = false,
      this.dialogLinkDetail.data = null
    },
    removeUser(){
      const opt = {
        route:'/desktop/adm/removeUser',
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if(r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente mais tarde.")
        }
        else {
          this.$q.notify("Usuário removido!")
          this.openDialogRemoveUser = false
          this.$router.back()
        }
      })
    },
    openUserFormDialog(form){
      this.userFormDialog.formId = form._id
      this.userFormDialog.open = true
    },
    chkVisionSelected() {
      if(this.$route.query.pending) {
        this.visionSelected = 'titles'
      }
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
    goToOrganismDetail(id) {
      const opt = {
        route: "/desktop/adm/getOrganismDetailById",
        body: {
          organismId: id,
        },
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente")
          return
        } else {
          this.dialogLinkDetail.data = r.data
          this.dialogLinkDetail.open = true
        }
      })
    },
    saveFormData(){
      const opt = {
        route:'/desktop/adm/saveFormData',
        body: {
          userId: this.$route.query.userId,
          formId: this.userFormDialog.formId,
          fields: this.userFormDialog.data,
          formStatus: 'sent'
        }
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if(r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente mais tarde.")
        }
        else {
          this.$q.notify("Formulário enviado!")
          this.userFormDialog.open = false
          this.getUserDetailById();
        }
      })
    },
    clkInactiveTitle(i){
      const opt = {
        route:'/desktop/adm/updateUserTitle',
        body: {
          userTitleId: this.userDetail.userTitleData[i]._id,
          titleFields: this.userDetail.userTitleData[i].titleFields,
          newStatus: 'inactive'
        }
      };
      useFetch(opt).then((r) => {
        if(r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente mais tarde.")
        }
        else {
          this.$q.notify("Título recusado.")
          this.getUserDetailById();
        }
      })
    },
    clkActiveTitle(i){
      const opt = {
        route:'/desktop/adm/updateUserTitle',
        body: {
          userTitleId: this.userDetail.userTitleData[i]._id,
          titleFields: this.userDetail.userTitleData[i].titleFields,
          newStatus: 'active'
        }
      };
      useFetch(opt).then((r) => {
        if(!r.error) {
          this.$q.notify("Título aceito.")
          this.getUserDetailById();
        }
        else {
          this.$q.notify("Ocorreu um erro, tente novamente mais tarde.")
        }
      })
    },
    updateUserTitle(i){
      const opt = {
        route: "/desktop/adm/updateUserTitle",
        body: {
          userTitleId: i._id,
          titleFields: i.titleFields
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
    indetifyIndex(i) {
      this.selectIndex = i
    },
    clkConfirmDeleteTitle () {
      const opt = {
        route: "/desktop/adm/inactivateUserTitle",
        body: {
          titleId: this.deleteTitle.titleId
        }
      }
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
    getUsersConfig(userType) {
      const opt = {
        route: "/desktop/adm/getUsersConfig",
      };
      if (userType) opt.body = { userType }
      return useFetch(opt)
    },
    getFormDetailById() {
      const opt = {
        route: "/desktop/adm/getFormDetailById",
        body: {
          formId: this.userFormDialog.formId
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if(r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente")
          return
        } this.userFormDialog.data = r.data.fields
      });
    },
    
    getUserDetailById() {
      const userId = this.$route.query.userId;
      const opt = {
        route: "/desktop/adm/getUserDetailById",
        body: {
          _id: userId,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(async (r) => {
        if(r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente")
          return
        }
        // this.userDetail = r.data
        this.$q.loading.show();
        const userConfig = await this.getUsersConfig(r.data.userType)
        this.$q.loading.hide();
        if (userConfig.error) {
          this.$q.notify("Ocorreu um erro, tente novamente");
          return
        }
        this.userLinks =r.data.userLinksToOrganisms.data
        this.userData = userConfig.data
        this.userType = r.data.userType
        this.userProfileImage = r.data.profileImage
        // this.tab = r.data.userDataTabs[0].tabValue
        this.mountUserData(r.data)
      });
    },
    mountUserData (userDetail) {
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
    },
    getTitleNamesList(val, update) {
      const opt = {
        route: "/desktop/adm/getTitleNamesList",
        body: {
          searchString: val,
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage
        }
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        update(() => {
          this.titleOptions = r.data.list;
        })
      });
    },
    getTitleConfigsDetailById() {
      const opt = {
        route: "/desktop/config/getTitleConfigsDetailById",
        body: {
          titleConfigsId: this.titleSelected._id
        }
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        // this.titleName = r.data.titleName
        this.titleFields = r.data.titleFields;
      });
    },
    createUserTitle() {
      if (this.userAlreadyHasTitle()) {
        this.$q.notify('Usuário já tem este título')
        return
      }
      const opt = {
        route: "/desktop/adm/createUserTitle",
        body: {
          titleConfigId: this.titleSelected._id,
          userId: this.$route.query.userId
        }
      };
      this.openDialogVinculateUserToTitle = false
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if (r.error) {
          this.$q.notify("Erro ao inserir título, tente novamente mais tarde.")
          return
        }
        this.getUserDetailById()
        this.getTitleConfigsDetailById()
        this.tabTitles = 
        this.$q.notify('Preencha os dados do título')
      });
    },
    userAlreadyHasTitle () {
      if (!this.userDetail.userTitleData || this.userDetail.userTitleData.length === 0) return false
      let ret = false
      this.userDetail.userTitleData.forEach(ut => {
        if (ut.titleConfigId === this.titleSelected._id) ret = true
      })
      return ret
    },
    getCompanyPermissions() {
      const opt = {
        route: "/auth/getCompanyPermissions",
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.allPermissions = r.data;
        this.getUserPermissionsOnly();
      });
    },
    getUserPermissionsOnly() {
      const opt = {
        route: "/auth/getUserPermissionsOnly",
        body: {
          userId: this.userId,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.userPermissions = r.data;
        this.formattedPermissions = this.allPermissions.map((permission) => {
          if (
            this.userPermissions.some((e) => e.id === permission.permissionId)
          ) {
            permission.value = true;
          } else permission.value = false;
          return permission;
        });
      });
    },
    changeUserPermission(permissionId, newStatus) {
      const opt = {
        route: "/auth/changeUserPermission",
        body: {
          userId: this.userId,
          permissionId: permissionId,
          newStatus: newStatus ? 1 : 0,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify(
            "ERRO ao atualizar permissão! Tente novamente mais tarde."
          );
        } else {
          this.$q.notify("Permissão atualizada!");
          this.getCompanyPermissions();
        }
      });
    },
  },
});
</script>
<style scoped>
.form-list{
  border-radius: 0.5rem;
  background-color: #ebebeb;
}
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.flex-center{
  justify-content: flex-start;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
.footer {
  height: 52px;
  position: fixed;
  bottom: 0px;
}
.separator {
  position: fixed;
  top: 118px;
  border-left: 2px solid rgb(216, 216, 216);
  height: 806px;
}
</style>

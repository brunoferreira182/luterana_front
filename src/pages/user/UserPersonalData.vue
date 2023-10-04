<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col text-h5 text-capitalize">
          Preencher dados pessoais
          <span class="q-gutter-sm">
            
          </span>
        </div>
        <div class="col text-right q-gutter-sm">
          <q-btn
            rounded
            no-caps
            unelevated
            icon="person"
            color="secondary"
            label="Dados pessoais"
            @click="visionSelected = 'personalData'"
            :outline="visionSelected === 'personalData' ? false : true"
          />
          <q-btn
            rounded
            no-caps
            unelevated
            icon="school"
            color="secondary"
            label="Títulos"
            @click="visionSelected = 'titles'"
            :outline="visionSelected === 'titles' ? false : true"
          />
        </div>
      </div>
      <q-separator/>
      <q-splitter
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
                      && field.type.type !== 'attach'
                      && field.type.type !== 'organism'
                      && field.type.type !== 'multiple_select'
                      && field.type.type !== 'image'
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
                    <q-file
                      v-if="field.type.type === 'image'"
                      v-model="files"
                      @rejected="onRejected"
                      :filter="checkFileType"
                      label="Clique aqui para adicionar imagem de perfil"
                      outlined
                      @input="saveProfilePhoto()"
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
                      >
                      </q-select>
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
                      />
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
                          <q-item-section side>
                            <q-item-label>
                            <q-btn
                              icon="edit"
                              flat
                              round
                              color="primary"
                              @click="editThisAddress(fieldIndex, tabsIndex, i)"
                            >
                            </q-btn>
                            <q-btn
                              icon="delete"
                              flat
                              round
                              color="red"
                              @click="removeThisAddress(fieldIndex, tabsIndex, i)"
                            >
                            </q-btn>
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
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
                      readonly
                      :label="field.label"
                      :hint="field.hint"
                      v-model="field.value"
                    />

                    <div v-if="field.type.type === 'person'">
                      <div v-if="field.value && field.value.length > 0">
                        <div class="text-body">{{ field.label }}</div>
                        <q-list
                          style="border-radius: 1rem"
                          class="bg-grey-3"
                          separator
                        >
                          <q-item
                            v-for="(item, i) in field.value"
                            :key="item + i"
                          >
                            <q-item-section>
                              <q-item-label class="text-capitalize">
                                {{ item.userName }}
                              </q-item-label>
                              <q-item-label caption>
                                {{ item.email }}
                              </q-item-label>
                            </q-item-section>
                            <q-item-section side>
                              <q-item-label>
                                <q-btn
                                  icon="delete"
                                  flat
                                  color="red"
                                  @click="removeThisPerson(fieldIndex, tabsIndex, i)"
                                />
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
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
                      />
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
                            <q-item-section side>
                              <q-item-label>
                                <q-btn
                                  icon="delete"
                                  flat
                                  color="red"
                                  @click="removeThisOrganism(fieldIndex, tabsIndex, i)"
                                />
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </div>
                      <q-btn
                        :label="`Adicionar ${field.label}`"
                        no-caps
                        rounded
                        unelevated
                        outline
                        color="primary"
                        icon="add"
                        v-if="field.multiple || !field.value || field.value ==='' || field.value.length === 0"
                        @click="clkOpenAddOrganismDialog(fieldIndex, tabsIndex)"
                      />
                    </div>

                    <div v-if="field.type.type === 'multiple_select'">
                      <div class="text-h5 q-pa-sm bg-grey-3" style="border-radius: 1rem">
                        <div class="q-pl-md q-py-sm">
                          {{ field.label }}:
                        </div>
                        <div 
                          class="q-pa-sm"
                        >
                          <q-btn
                            v-if="field.multiple || (!field.value || field.value.length === 0)"
                            icon="add"
                            color="primary"
                            outline
                            rounded
                            @click="addDoubleSelection(tabsIndex, fieldIndex)"
                            no-caps
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

                    <div v-if="field.type.type === 'bank_data'">
                      <q-btn
                        label="Adicionar dados bancários"
                        no-caps
                        rounded
                        flat
                        color="primary"
                        @click="clkAddBankData(fieldIndex, tabsIndex)"
                        icon="add"
                      />
                      <q-list
                        v-if="field.value"
                        style="border-radius: 1rem"
                        class="bg-grey-3"
                        separator
                      >
                        <q-item
                          v-for="(value, iValue) in field.value"
                          :key="value + iValue"
                        >
                          <q-item-section>
                            <q-item-label class="text-capitalize">
                              {{ value.bank }}
                            </q-item-label>
                            <q-item-label caption>
                              Agência {{ value.agency }}
                            </q-item-label>
                            <q-item-label caption>
                              Agência {{ value.account }}
                            </q-item-label>
                            <q-item-label caption v-if="value.pix !== ''">
                              Pix {{ value.pix }}
                            </q-item-label>
                            <q-item-label></q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-item-label>
                              <q-btn
                                icon="edit"
                                flat
                                round
                                color="primary"
                                @click="editBankData(fieldIndex, tabsIndex, field, value, iValue)"
                              ><q-tooltip>Editar {{ field.type.label }}</q-tooltip></q-btn>
                              <q-btn
                                icon="delete"
                                flat
                                round
                                color="red"
                                @click="removeBankData(fieldIndex, tabsIndex, field, value, iValue)"
                              ><q-tooltip>Excluir {{ field.type.label }}</q-tooltip></q-btn>
                            </q-item-label>
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
                      />
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
                          <q-item-section side>
                            <q-item-label>
                            <q-btn
                              icon="edit"
                              flat
                              round
                              color="primary"
                              @click="editPhoneMobileEmail(fieldIndex, tabsIndex, field, value, iValue)"
                            ><q-tooltip>Editar este {{ field.type.label }}</q-tooltip></q-btn>
                            <q-btn
                              icon="delete"
                              flat
                              round
                              color="red"
                              @click="removePhoneMobileEmail(fieldIndex, tabsIndex, field, value, iValue)"
                            ><q-tooltip>Excluir este {{ field.type.label }}</q-tooltip></q-btn>
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>

                  </div>
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
      <q-splitter
        v-model="splitterModel"
        style="height: 100vh;"
        v-show="visionSelected === 'titles'"
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
              />
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
              v-for="(tab) in userDetail.userTitleData"
              :key="tab._id"
              :name="tab._id" 
            >
              <div class="row">
                <div class="col text-h6">{{ tab.titleName }}:</div>
                <q-btn
                  v-if="tab.status.status === 'pendingApproval'"
                  icon="pending"
                  label="Aguardando validação"
                  no-caps
                  flat
                  color="warning"
                />
                <q-btn
                  v-else
                  icon="check_circle"
                  label="Título confirmado"
                  no-caps
                  flat
                  color="positive"
                />
                <q-btn
                    label="Excluir título"
                    color="red"
                    icon="delete"
                    rounded
                    flat
                    outline
                    @click="clkDeleteTitle(tab._id)"
                    no-caps
                  />
              </div>
              <div class="row q-gutter-sm justify-left items-left">
                <div class="col q-mx-lg">
                  <div
                    class="q-my-md"
                    v-for="(field, fieldIndex) in tab.titleFields"
                    :key="fieldIndex"
                  >
                    <div v-if="field.type.type !== 'boolean' && field.type.type !== 'address' ">
                      <q-input
                        :label="field.label"
                        :type="field.type.type"
                        v-model="field.value"
                        outlined
                      >
                        <template
                          v-if="field.multiple"
                          #append
                        >
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div 
                    class="col-6 q-gutter-sm text-center"
                  >
                    <q-btn
                      rounded
                      no-caps
                      unelevated
                      class="full-width"
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
              label="Nome do título"
              option-label="titleName"
              :options="titleOptions"
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
      
      
      <DialogAddress
        :open="dialogConfirmAddress.open"
        :addressDataProp="dialogConfirmAddress.data"
        @confirmAddress="addAddress"
      />

      <DialogAddPerson
        :open="addPerson.dialogOpen"
        @closeDialog="closeAddPersonDialog"
        @addPerson="confirmAddPerson"
      />
      

      <q-dialog v-model="addOrganism.dialogOpen" @hide="clearOrganismInputs">
        <q-card style="border-radius: 1rem; height: 150x; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">Selecione o organismo</div>
          </q-card-section>
          <q-card-section class="q-gutter-md">
            <q-select
              v-model="addOrganism.organismSelected"
              filled
              use-input
              label="Nome do organismo"
              option-label="organismName"
              :options="addOrganism.organismsOptions"
              @filter="getOrganismByString"
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
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Voltar"
              no-caps
              color="primary"
              @click="addOrganism.dialogOpen = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="confirmAddOrganism"
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

      <q-dialog v-model="dialogAddBankData.open" @hide="clearBankDataInputs">
        <q-card style="border-radius: 1rem; height: 150x; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">Informe os bancários</div>
          </q-card-section>
          <q-card-section class="q-gutter-md">
            <q-input
              outlined
              label="Seu documento"
              v-model="dialogAddBankData.userHasDoc.doc"
              :disable="dialogAddBankData.userHasDoc?.hasDoc"
              mask="###.###.###-##"
            />
            <q-input
              outlined
              label="Banco"
              v-model="dialogAddBankData.data.bank"
              hint="Ex: Banco do Brasil, Bradesco, etc" />
            <q-input
              outlined
              label="Agência"
              v-model="dialogAddBankData.data.agency"
              hint="Número da agência" />
            <q-input
              outlined
              label="Conta"
              v-model="dialogAddBankData.data.account"
              hint="Número da conta" />
            <q-input
              outlined
              label="Chave PIX"
              v-model="dialogAddBankData.data.pix"
              hint="Chave PIX" />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Depois"
              no-caps
              color="primary"
              @click="dialogAddBankData.open = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="confirmAddBankData"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="dialogAddPhoneMobileEmail.open" @hide="clearDialogAddPhoneMobileEmail">
        <q-card style="border-radius: 1rem; height: 150x; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">Informe os dados</div>
          </q-card-section>
          <q-card-section class="q-gutter-md">
            <q-input
              label="Celular"
              hint="Informe seu celular"
              mask="(##) #####-####"
              v-model="dialogAddPhoneMobileEmail.data.value"
              outlined
              v-if="dialogAddPhoneMobileEmail.type.type === 'mobile'"
            />
            <q-input
              label="Telefone fixo"
              hint="Informe seu telefone fixo"
              mask="(##) ####-####"
              v-model="dialogAddPhoneMobileEmail.data.value"
              outlined
              v-else-if="dialogAddPhoneMobileEmail.type.type === 'phone'"
            />
            <q-input
              label="Email"
              hint="Informe seu email"
              v-model="dialogAddPhoneMobileEmail.data.value"
              outlined
              v-else-if="dialogAddPhoneMobileEmail.type.type === 'email'"
            />
            <q-select
              :options="dialogAddPhoneMobileEmail.options"
              v-model="dialogAddPhoneMobileEmail.data.type"
              outlined
              label="Tipo"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Depois"
              no-caps
              color="primary"
              @click="dialogAddPhoneMobileEmail.open = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="confirmAddPhoneMobileEmail"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </q-page>
  </q-page-container>
</template>

<script setup>
import useFetch from "../../boot/useFetch";
// import utils from '../../boot/utils'
import DialogAddPerson from '../../components/DialogAddPerson.vue'
import DialogAddress from '../../components/DialogAddress.vue'
</script>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserPersonalData",
  data() {
    return {
      deleteTitle: {
        openDialog: false,
        titleId: null
      },
      titleOptions: [],
      titleSelected: '',
      openDialogVinculateUserToTitle: false,
      tab: "",
      tabTitles: "",
      visionSelected: 'personalData',
      isSaving: false,
      newPhone: "",
      addressType: "",
      newEmail: "",
      value: '',
      typeSelectedAddress: null,
      fieldIndex: null,
      tabsIndex: null,
      dialogConfirmAddress: {
        open: false,
        fieldIndex: null,
        tabsIndex: null,
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
      userDetail: [],
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
      dialogAddPhoneMobileEmail: {
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
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getUsersConfig()
    this.getTitleNamesList()
  },
  methods: {
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
    },
    verifyIfUserHasDocument () {
      let hasDoc = false
      let doc = ''
      let tabWithDoc
      let fieldWithDoc
      this.userDetail.userDataTabs.forEach((userTab, iTab) => {
        // console.log(userTab, iTab, 'userTab aqui')
        userTab.fields.forEach((userField, iField) => {
          // console.log(userField, iTab, 'userField aqui')
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
    },
    confirmAddBankData () {
      const data = this.dialogAddBankData.data
      let errorMessage = ''
      if (this.dialogAddBankData.userHasDoc.doc === '') errorMessage = 'Preencha o documento'
      else if (data.bank === '') errorMessage = 'Preencha o banco'
      else if (data.bank !== '' && data.agency === '') errorMessage = 'Preencha a agência'
      else if (data.bank !== '' && data.agency !== '' && data.account === '') errorMessage = 'Preencha a conta'
      if (errorMessage !== '') {
        this.$q.notify(errorMessage)
        return
      }

      if (this.dialogAddBankData.action === 'add') {
        if (!this.userData.userDataTabs[this.dialogAddBankData.tabsIndex].fields[this.dialogAddBankData.fieldIndex].value)
          this.userData.userDataTabs[this.dialogAddBankData.tabsIndex].fields[this.dialogAddBankData.fieldIndex].value = []
        this
          .userData
          .userDataTabs[this.dialogAddBankData.tabsIndex]
          .fields[this.dialogAddBankData.fieldIndex]
          .value.push({
            bank: this.dialogAddBankData.data.bank,
            agency: this.dialogAddBankData.data.agency,
            account: this.dialogAddBankData.data.account,
            pix: this.dialogAddBankData.data.pix,
          });
        this.userData
          .userDataTabs[this.dialogAddBankData.userHasDoc.tabWithDoc]
          .fields[this.dialogAddBankData.userHasDoc.fieldWithDoc]
          .value = this.dialogAddBankData.userHasDoc.doc
      } else if (this.dialogAddBankData.action === 'edit') {
        this
          .userData
          .userDataTabs[this.dialogAddBankData.tabsIndex]
          .fields[this.dialogAddBankData.fieldIndex]
          .value[this.dialogAddBankData.iValue] = { ...this.dialogAddBankData.data }
      }
      this.dialogAddBankData.open = false
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
      console.log(this.files)
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
    createUserTitle(){
      const opt = {
        route:'/desktop/commonUsers/createUserTitle',
        body: {
          titleConfigId: this.titleSelected._id
        }
      };
      this.titleSelected = ''
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
    getTitleNamesList() {
      const opt = {
        route: '/desktop/commonUsers/getTitlesList',
      };
      useFetch(opt).then((r) => {
        this.titleOptions = r.data;
      });
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
    },
    removeThisOrganism(fieldIndex, tabsIndex, organismIndex) {
      this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value.splice(organismIndex, 1);
      this.clearOrganismInputs()
    },
    clearOrganismInputs() {
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
    getOrganismByString(val, update) {
      if (val < 2) return
      const opt = {
        route: '/desktop/adm/getOrganismsNames',
        body: {
          searchString: val
        }
      }
      useFetch(opt).then(r => {
        if (r.error) return this.$q.notify(r.errorMessage)
        update(() => {
          this.addOrganism.organismsOptions = r.data
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
      this.closeAddPersonDialog()
      this.addPerson.dialogOpen = false
    },
    confirmAddOrganism() {
      if (!this.userData.userDataTabs[this.addOrganism.tabIndex].fields[this.addOrganism.fieldIndex].multiple)
        this.userData.userDataTabs[this.addOrganism.tabIndex].fields[this.addOrganism.fieldIndex].value = [ this.addOrganism.organismSelected ]
      else {
        if (!this.userData.userDataTabs[this.addOrganism.tabIndex].fields[this.Organism.fieldIndex].value
          || this.userData.userDataTabs[this.addOrganism.tabIndex].fields[this.addOrganism.fieldIndex].value === ''
          ) {
            this.userData.userDataTabs[this.addOrganism.tabIndex].fields[this.addOrganism.fieldIndex].value = [ this.addOrganism.organismSelected ]
        } else {
          this.userData.userDataTabs[this.addOrganism.tabIndex].fields[this.addOrganism.fieldIndex].value.push(this.addOrganism.organismSelected)
        }
      }
      this.clearOrganismInputs()
      this.addOrganism.dialogOpen = false
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
      this.dialogConfirmAddress.open = true
      this.dialogConfirmAddress.fieldIndex = fieldIndex
      this.dialogConfirmAddress.tabsIndex = tabIndex
    },
    salvar() {
      this.isSaving = true;
      this.clkCreateUser();
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
    confirmAddPhoneMobileEmail () {
      if (this.dialogAddPhoneMobileEmail.action === 'add') {
        if (!this.userData.userDataTabs[this.dialogAddPhoneMobileEmail.tabsIndex].fields[this.dialogAddPhoneMobileEmail.fieldIndex].value)
          this.userData.userDataTabs[this.dialogAddPhoneMobileEmail.tabsIndex].fields[this.dialogAddPhoneMobileEmail.fieldIndex].value = []
        this.userData.userDataTabs[this.dialogAddPhoneMobileEmail.tabsIndex].fields[this.dialogAddPhoneMobileEmail.fieldIndex].value.push({
          value: this.dialogAddPhoneMobileEmail.data.value,
          type: this.dialogAddPhoneMobileEmail.data.type
        })
      } else if (this.dialogAddPhoneMobileEmail.action === 'edit') {
        this
          .userData
          .userDataTabs[this.dialogAddPhoneMobileEmail.tabsIndex]
          .fields[this.dialogAddPhoneMobileEmail.fieldIndex]
          .value[this.dialogAddPhoneMobileEmail.iValue] = {
            value: this.dialogAddPhoneMobileEmail.data.value,
            type: this.dialogAddPhoneMobileEmail.data.type
          }
      }
      this.dialogAddPhoneMobileEmail.open = false
    },
    editPhoneMobileEmail (fieldIndex, tabsIndex, field, value, iValue) {
      this.dialogAddPhoneMobileEmail.open = true
      this.dialogAddPhoneMobileEmail.type = field.type
      this.dialogAddPhoneMobileEmail.fieldIndex = fieldIndex
      this.dialogAddPhoneMobileEmail.tabsIndex = tabsIndex
      this.dialogAddPhoneMobileEmail.data = {...value}
      this.dialogAddPhoneMobileEmail.action = 'edit'
      this.dialogAddPhoneMobileEmail.iValue = iValue
    },
    removePhoneMobileEmail (fieldIndex, tabsIndex, field, value, iValue) {
      this
        .userData
        .userDataTabs[tabsIndex]
        .fields[fieldIndex]
        .value
        .splice(iValue, 1)
    },
    addAddress(data) {
      if(data.addressType === "") {
        this.$q.notify("Preencha o tipo de endereço")
        return
      }
      const fieldIndex = this.dialogConfirmAddress.fieldIndex
      const tabsIndex = this.dialogConfirmAddress.tabsIndex
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
      this.dialogConfirmAddress.open = false;
      this.clearAddressInputs()
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
    },
    removePhone(i) {
      this.userData.generalData.phones.splice(i, 1);
    },
    removeAddress(i) {
      this.userData.generalData.address.splice(i, 1);
    },
    removeEmail(i) {
      this.userData.generalData.email.splice(i, 1);
    },
    getUsersConfig() {
      const opt = {
        route: "/desktop/adm/getUsersConfig",
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if (!r.error) {
          this.userData = r.data
          this.tab = r.data.userDataTabs[0].tabValue
          this.getUserDetailById()
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente");
        }
      });
    },
    clkCreateUser() {
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
          this.$q.notify("Usuário cadastrado com sucesso!");
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente");
        }
      });
    },
    removeThisAddress(fieldIndex, tabsIndex, addressIndex) {
      this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value.splice(addressIndex, 1);
    },
    editThisAddress(fieldIndex, tabsIndex, addressIndex){
      this.dialogConfirmAddress.open = true
      console.log(this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value[0])
      this.cep = this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value[0].cep
      this.addressType = this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value[0].type
      this.street = this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value[0].street
      this.number = this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value[0].number
      this.district = this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value[0].district
      this.complement = this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value[0].complement
      this.city = this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value[0].city
      this.state = this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value[0].state
      this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value.splice(addressIndex, 1);
    },
    getUserDetailById(){
      const opt = {
        route:"/desktop/user/getUserDetailById"
      }
      useFetch(opt).then((r) => {
        if(r.error) {
          console.log("Ocorreu um erro, tente novamente kakak")
          return
        }
        this.userDetail = r.data
        this.mountUserData()
      })
    },
    mountUserData () {
      this.userData.userDataTabs.forEach((configTab, iConfigTab) => {
        configTab.fields.forEach((configField, iConfigField) => {
          this.userDetail.userDataTabs.forEach((userTab) => {
            userTab.fields.forEach((userField) => {
              if (configField.model === userField.model && userField.value) {
                this.userData.userDataTabs[iConfigTab].fields[iConfigField].value = userField.value
              }
            })
          })
        })
      })
    }
  },
});
</script>
<style scoped>
.flex-center{
  justify-content: flex-start;
}
</style>


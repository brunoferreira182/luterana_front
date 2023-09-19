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
          <!-- <q-btn
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
          </q-btn> -->
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
                      && field.type.type !== 'multiple_select'"
                    >
                      <q-input
                        :label="field.label"
                        :hint="field.hint"
                        :mask="field.type.mask"
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
                    <div
                      v-if="field.type.type === 'address' && (!field.value || field.value.length === 0)"
                      class="text-subtilte1 text-start"
                    >
                      <div class="text-h6">Endereços</div>
                      Nenhum endereço vinculado
                    </div>
                    <div v-if="field.type.type === 'address'">
                      <q-list class="no-margin" v-if="field.value">
                        <q-item
                          v-for="(item, i) in field.value"
                          :key="item + i"
                          style="border-radius: 1rem"
                          class="bg-grey-3 q-ma-sm q-pa-md"
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
                            <q-item-label></q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-item-label caption class="text-capitalize">
                              <q-badge>{{ item.type }}</q-badge>
                            </q-item-label>
                            <q-item-label>
                            <q-btn
                              icon="edit"
                              flat
                              color="primary"
                              @click="editThisAddress(fieldIndex, tabsIndex, i)"
                            >
                            </q-btn>
                            <q-btn
                              icon="delete"
                              flat
                              color="red"
                              @click="removeThisAddress(fieldIndex, tabsIndex, i)"
                            >
                            </q-btn>
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                      <q-btn
                        label="Adicionar endereço"
                        no-caps
                        rounded
                        unelevated
                        outline
                        color="primary"
                        icon="add"
                        @click="clkOpenAddressDialog(fieldIndex, tabsIndex)"
                      />
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
                      <!-- <div class="text-body">{{ field.label }}</div> -->
                      <!-- <div
                        v-if="(!field.value || field.value.length === 0)"
                        class="text-subtilte1 text-start"
                      >Nenhuma pessoa vinculada</div> -->
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
                        unelevated
                        outline
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
                <div class="col text-h6">{{ tab.titleName }}</div>
                <q-btn
                  v-if="tab.status.status === 'pendingApproval'"
                  icon="pending"
                  label="Aguardando validação"
                  no-caps
                  flat
                  color="warning"
                />
                <q-btn
                  v-else-if="tab.status.status === 'recused'"
                  icon="cancel"
                  label="Título negado"
                  no-caps
                  flat
                  color="negative"
                />
                <q-btn
                  v-else
                  icon="check_circle"
                  label="Título confirmado"
                  no-caps
                  flat
                  color="positive"
                />
              </div>
              <div class="row justify-center items-start">
                  <div class="col-8 q-pa-md q-gutter-md">
                    <div
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
      <q-dialog v-model="dialogConfirmEmail.open">
        <q-card style="border-radius: 1rem; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">Selecione o tipo de e-mail</div>
          </q-card-section>
          <q-card-section>
            <q-select
              outlined
              :options="emailType"
              label="Tipo (opcional)"
              v-model="typeSelectedEmail"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Depois"
              no-caps
              color="primary"
              @click="dialogConfirmEmail.open = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="addEmail"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="dialogConfirmPhone.open">
        <q-card style="border-radius: 1rem; height: 150x; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">Selecione o tipo de telefone</div>
          </q-card-section>
          <q-card-section>
            <q-select
              outlined
              :options="phoneType"
              label="Tipo (opcional)"
              v-model="typeSelectedPhone"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Depois"
              no-caps
              color="primary"
              @click="dialogConfirmPhone.open = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="addPhone"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="dialogConfirmAddress.open" @hide="clearAddressInputs">
        <q-card style="border-radius: 1rem; height: 150x; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">Informe os dados de endereço</div>
          </q-card-section>
          <q-card-section class="q-gutter-md">
            <q-input mask="########" outlined label="CEP" v-model="cep" @keyup="checkCEP" />
            <q-input
              outlined
              label="Informe o tipo de endereço (obrigatório)"
              hint="Exemplo: Casa, trabalho, etc..."
              v-model="addressType"
            />
            <q-input outlined label="Logradouro" v-model="street" />
            <q-input outlined label="Número" type="number" v-model="number" />
            <q-input outlined label="Bairro" v-model="district" />
            <q-input outlined label="Complemento" v-model="complement" />
            <div class="row">
              <div class="col">
                <q-input outlined label="Cidade" v-model="city" />
              </div>
              <div class="col q-pl-md">
                <q-input outlined mask="AA" label="Estado" v-model="state" />
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Depois"
              no-caps
              color="primary"
              @click="dialogConfirmAddress.open = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="addAddress"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="addPerson.dialogOpen" @hide="clearPersonInputs">
        <q-card style="border-radius: 1rem; height: 150x; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">Selecione a pessoa</div>
          </q-card-section>
          <q-card-section class="q-gutter-md">
            <q-select
              v-model="addPerson.userSelected"
              filled
              use-input
              label="Nome do usuário"
              option-label="userName"
              :options="addPerson.usersOptions"
              @filter="getUserByString"
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
              @click="addPerson.dialogOpen = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="confirmAddPerson"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
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
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
// import utils from '../../boot/utils'
export default defineComponent({
  name: "UserPersonalData",
  data() {
    return {
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
      typeSelectedPhone: null,
      typeSelectedAddress: null,
      typeSelectedEmail: null,
      dialogConfirmPhone: {
        open: false,
      },
      dialogConfirmEmail: {
        open: false,
      },
      fieldIndex: null,
      tabsIndex: null,
      dialogConfirmAddress: {
        open: false,
      },
      cep: "",
      street: "",
      number: "",
      city: "",
      state: "",
      district: "",
      complement: "",
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
      files: null
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
      this.clearPersonInputs()
    },
    removeThisOrganism(fieldIndex, tabsIndex, organismIndex) {
      this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value.splice(organismIndex, 1);
      this.clearOrganismInputs()
    },
    clearOrganismInputs() {
      this.addOrganism.organismSelected = null
    },
    clearPersonInputs () {
      this.addPerson.userSelected = null
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
    confirmAddPerson () {
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
      this.clearPersonInputs()
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
    checkCEP(ev) {
      this.cep = ev.target.value;
      if (this.cep.length === 8) {
        const opt = {
          route: "/utils/consultZipCode",
          body: {
            zipCode: this.cep,
          },
        };
        this.$q.loading.show();
        useFetch(opt).then((r) => {
          this.$q.loading.hide();
          this.street = r.data.logradouro;
          this.city = r.data.localidade;
          this.state = r.data.uf;
          this.district = r.data.bairro;
        });
      }
    },
    clkOpenAddressDialog(fieldIndex, tabIndex){
      this.dialogConfirmAddress.open = true
      this.fieldIndex = fieldIndex
      this.tabsIndex = tabIndex
    },
    salvar() {
      this.isSaving = true;
      this.clkCreateUser();
      setTimeout(() => {
        this.isSaving = false;
      }, 1000);
    },

    addPhone() {
      this.dialogConfirmPhone.open = false;
      this.userData.generalData.phones.push({
        phone: this.newPhone,
        type: this.typeSelectedPhone,
      });
      this.newPhone = "";
    },

    addEmail() {
      if (this.newEmail === "") {
        this.$q.notify("Preencha o campo e-mail antes de continuar");
        return;
      } else {
        this.userData.generalData.email.push({
          email: this.newEmail,
          type: this.typeSelectedEmail,
        });
        this.newEmail = "";
        this.dialogConfirmAddress.open = false;
      }
    },
    addMultipleField(){
      this.$q.notify('Diálogo de multiplos dados não implementado')
    },
    addAddress() {
      if(this.addressType === "") {
        this.$q.notify("Preencha o tipo de endereço")
        return
      }
      const fieldIndex = this.fieldIndex
      const tabsIndex = this.tabsIndex
      if (!this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value)
        this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value = []
      this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value.push({
        type: this.addressType,
        cep: this.cep,
        street: this.street,
        number: this.number,
        city: this.city,
        state: this.state,
        district: this.district,
        complement: this.complement
      });
      this.dialogConfirmAddress.open = false;
      this.clearAddressInputs()


      // if (!this.userData.userDataTabs[tabsIndex].fields[fieldIndex].address) {
      //   this.userData.userDataTabs[tabsIndex].fields[fieldIndex].address = [];
      //   this.userData.userDataTabs[tabsIndex].fields[fieldIndex].address.push({
      //     type: this.addressType,
      //     cep: this.cep,
      //     street: this.street,
      //     number: this.number,
      //     city: this.city,
      //     state: this.state,
      //     district: this.district,
      //   });
      //   this.dialogConfirmAddress.open = false;
      //   this.clearAddressInputs()
      // } else {
      //   this.userData.userDataTabs[tabsIndex].fields[fieldIndex].address.push({
      //     type: this.addressType,
      //     cep: this.cep,
      //     street: this.street,
      //     number: this.number,
      //     city: this.city,
      //     state: this.state,
      //     district: this.district,
      //   });
      //   this.clearAddressInputs()
      //   this.dialogConfirmAddress.open = false;
      // }
    },
    clearAddressInputs(){
      this.addressType = ''
      this.type = "";
      this.cep = "";
      this.street = "";
      this.number = "";
      this.city = "";
      this.state = "";
      this.district = "";
      this.complement = "";
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
      // if(
      //   this.userData.name === '' ||
      //   this.userData.email === '' ||
      //   this.userData.user === '' ||
      //   this.userData.mobile === ''
      // ){ this.$q.notify('Preencha todos os campos'); return; }
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
        // else {
        //   this.userDetail = r.data
        //   this.userData.userDataTabs[0].fields[0].value = this.userDetail.userDataTabs[0].fields[0].value
        //   this.userData.userDataTabs[0].fields[1].value = this.userDetail.userDataTabs[0].fields[1].value
        //   this.userData.userDataTabs[0].fields[2].value = this.userDetail.userDataTabs[0].fields[2].value
        //   this.userData.userDataTabs[0].fields[3].value = this.userDetail.userDataTabs[0].fields[3].value
        // }
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


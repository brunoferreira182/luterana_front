<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize" v-if="userType === 'user'">novo usuário</div>
        <div class="col-6 text-h5 text-capitalize" v-if="userType === 'pastor'">novo pastor</div>
        <div class="col text-right">
          <q-btn
            no-caps
            rounded
            unelevated
            color="primary"
            :label="isSaving ? '' : 'Salvar'"
            @click="salvar"
            :disable="isSaving"
          >
            <q-spinner-dots v-if="isSaving" color="white" size="1em" />
          </q-btn>
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <q-list bordered>
        <div v-for="(tabs, tabsIndex) in userData.userDataTabs" :key="tabsIndex">
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
  
                      <!-- <div v-if="field.type.type === 'attach'">
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
                      </div> -->
  
                      <q-checkbox
                        v-if="field.type.type === 'boolean'"
                        class="q-pt-lg"
                        :label="field.label"
                        :hint="field.hint"
                        v-model="field.value"
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
                        />
                      </div>
  
                      <!-- <div v-if="field.type.type === 'maritalStatus'">
                        <div v-if="field.value && field.value.length > 0">
                          <div class="text-body">{{ field.label }}</div>
                          <CardMaritalStatus
                            :data="field"
                            :fieldIndex="fieldIndex"
                            :tabsIndex="tabsIndex"
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
                        />
                      </div> -->
  
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
                        />
                        <CardFormation
                          :data="field"
                          :fieldIndex="fieldIndex"
                          :tabsIndex="tabsIndex"
                          @edit="editFormation"
                          @remove="removeFormation"
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
import CardAddress from '../../components/CardAddress.vue'
import CardPhoneMobileEmail from '../../components/CardPhoneMobileEmail.vue'
import CardBankData from '../../components/CardBankData.vue'
import CardPerson from '../../components/CardPerson.vue'
import CardOrganism from '../../components/CardOrganism.vue'
import CardFormation from '../../components/CardFormation.vue'
// import CardMaritalStatus from '../../components/CardMaritalStatus.vue'
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
import DialogRemovePhoneMobileEmail from '../../components/DialogRemovePhoneMobileEmail.vue'
</script>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: "CreateUser",
  data() {
    return {
      tab: "",
      isSaving: false,
      files: [],
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
      dialogAddPastoralData: {
        open: false,
        data: null,
        fields: null
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
      openDialogVinculateUserToTitle: false,
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
      fieldIndex: null,
      tabsIndex: null,
      cep: "",
      street: "",
      number: "",
      city: "",
      state: "",
      district: "",
      userData: {},
      userType: null
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getUsersConfig()
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
      this.clkCreateUser()
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
    },
    confirmRemovePhoneMobileEmail(){
      this
        .userData
        .userDataTabs[this.dialogRemovePhoneMobileEmail.tabsIndex]
        .fields[this.dialogRemovePhoneMobileEmail.fieldIndex]
        .value
        .splice(this.dialogRemovePhoneMobileEmail.iValue , 1)
        this.dialogRemovePhoneMobileEmail.open = false
    },
    confirmAddress(data) {
      const fieldIndex = this.dialogConfirmAddress.fieldIndex
      const tabsIndex = this.dialogConfirmAddress.tabsIndex
      const valueIndex = this.dialogConfirmAddress.valueIndex
      console.log(fieldIndex, 'fi',  tabsIndex, 'ts', valueIndex, 'vi')
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
    //Não substituir
    getUsersConfig() {
      let selectedType = null
      if (this.$route.query.configType === 'user') selectedType = 'user'
      if (this.$route.query.configType === 'pastor') selectedType = 'pastor'
      if (selectedType === 'user') this.userType = 'user'
      if (selectedType === 'pastor') this.userType = 'pastor'
      const opt = {
        route: "/desktop/adm/getUsersConfig",
        body: {
          userType: selectedType
        }
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if (!r.error) {
          this.userData = r.data
          this.tab = r.data.userDataTabs[0].tabValue
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
        route: "/desktop/adm/createNewUser",
        body: {
          userDataTabs: this.userData.userDataTabs,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if (r.error) {
          this.$q.notify(r.errorMessage);
        } else {
          this.$q.notify("Usuário cadastrado com sucesso!");
          this.$router.push("/admin/usersList");
        }
      });
    },
  },
});
</script>
<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
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

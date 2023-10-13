<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-12 text-capitalize">
          <div class="text-h5">
            {{ organismName }}
          </div>
          <div class="text-caption">
            detalhe do organismo 
          </div>
        </div>
      </div>
      <q-separator class="q-mx-md" v-if="!isMobile"/>
      <div class="row justify-around q-pa-md" v-if="!isMobile">
        <div class="col-7 q-gutter-md q-mt-sm" align="start" >
          <div class="text-h5 no-margin q-px-md">
            Dados
          </div>
          <q-select outlined label="Nome da configuração" option-label="organismConfigName"
            :option-value="(item) => item._id" emit-value readonly map-options
            hint="O tipo de configuração que está aplicado" v-model="organismConfigName"
            :options="organismConfigOptions" />
          <div v-if="fields.length" class="text-h5">
            Dados
          </div>
          <div v-for="(field, fieldIndex) in organismData.fields" :key="fieldIndex">
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
                          :data="field"
                          :fieldIndex="fieldIndex"
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
  
                    </div>
                  </div>
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
      <div v-if="isMobile" class="q-gutter-md">
        <q-list bordered>
          <q-expansion-item
            group="somegroup"
            class="bg-grey-3"
            header-class="text-primary"
            label="Dados"
          >
            <div class="bg-white q-pa-md">
              <q-select class="q-py-md" outlined label="Nome da configuração" option-label="organismConfigName"
                :option-value="(item) => item._id" emit-value readonly map-options
                hint="O tipo de configuração que está aplicado" v-model="organismConfigName"
                :options="organismConfigOptions" />
              <div v-if="fields.length" class="text-h5">
                Dados
              </div>
              <div v-for="(field, i) in organismData.fields" :key="i" class="q-py-md">
               
                <q-input v-if="field.type.type !== 'boolean'" v-model="field.value" outlined readonly
                  :type="getInputType(field.type.type)" :reverse-fill-mask="field.type.type === 'money'"
                  :prefix="field.type.type === 'money' ? 'R$' : null"
                  :label="field.label + (field.required ? '' : ' (Opcional)')" :mask="field.type.mask" :hint="field.hint" />
                <q-checkbox v-else-if="field.type.type === 'boolean'" :label="field.label" readonly
                  v-model="newOrganism[field.model]"></q-checkbox>
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
                      @click="sendFunctionSolicitation" 
                    />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </div>
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
      <DialogPhoneMobileEmail
        :open="dialogAddPhoneMobileEmail.open"
        :dataProp="dialogAddPhoneMobileEmail.data"
        :type="dialogAddPhoneMobileEmail.type"
        @confirm="confirmAddPhoneMobileEmail"
        @closeDialog="clearDialogAddPhoneMobileEmail"
      />
      <DialogBankData
        :open="dialogAddBankData.open"
        :dataProp="dialogAddBankData.data"
        :docProp="dialogAddBankData.userHasDoc.doc"
        :hasDoc="dialogAddBankData.userHasDoc.hasDoc"
        @confirm="confirmAddBankData"
        @closeDialog="clearBankDataInputs"
      />
      <DialogFormation
        :open="dialogFormation.open"
        :dataProp="dialogFormation.data"
        :fieldIndex="dialogFormation.fieldIndex"
        :tabsIndex="dialogFormation.tabsIndex"
        @confirm="confirmFormation"
        @closeDialog="clearFormationInputs"
      />
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import CardFunction from '../../components/CardFunction.vue'
import CardAddress from '../../components/CardAddress.vue'
import CardPhoneMobileEmail from '../../components/CardPhoneMobileEmail.vue'
import DialogAddPerson from '../../components/DialogAddPerson.vue'
import DialogFormation from '../../components/DialogFormation.vue'
import DialogUserTitle from '../../components/DialogUserTitle.vue'
import DialogAddress from '../../components/DialogAddress.vue'
import CardBankData from '../../components/CardBankData.vue'
import DialogMaritalStatus from '../../components/DialogMaritalStatus.vue'
import DialogBankData from '../../components/DialogBankData.vue'
import CardFormation from '../../components/CardFormation.vue'
import DialogAddOrganism from '../../components/DialogAddOrganism.vue'
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
    CardFunction, CardOrganism,
    CardAddress, CardPerson,
    CardMaritalStatus, CardBankData, 
    CardPhoneMobileEmail, DialogPhoneMobileEmail,
    CardFormation, DialogAddPerson,
    DialogFormation, DialogUserTitle,
    DialogAddress, DialogMaritalStatus,
    DialogBankData, DialogAddOrganism
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
      organismConfigOptions: [],
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
    };
  },
  mounted() {
    this.$q.loading.hide()
  },
  beforeMount() {
    this.isMobile = useScreenStore().isMobile
    this.getUserIdMongo()
    this.getOrganismDetailById();
    this.getOrganismsConfigs()
    this.getFunctionsSolicitationsByOrganismId()
  },
  methods: {
    addPhoneMobileEmail(fieldIndex, tabsIndex, field) {
      this.dialogAddPhoneMobileEmail.action = 'add'
      this.dialogAddPhoneMobileEmail.open = true
      this.dialogAddPhoneMobileEmail.type = field.type
      this.dialogAddPhoneMobileEmail.fieldIndex = fieldIndex
      this.dialogAddPhoneMobileEmail.tabsIndex = tabsIndex
    },
    confirmAddPhoneMobileEmail (data) {
      if (this.dialogAddPhoneMobileEmail.action === 'add') {
        if (!organismData.fields[this.dialogAddPhoneMobileEmail.fieldIndex].value){
          organismData.fields[this.dialogAddPhoneMobileEmail.fieldIndex].value = []
        }
        organismData.fields[this.dialogAddPhoneMobileEmail.fieldIndex].value.push({
          value: data.value,
          type: data.type
        })
      } else if (this.dialogAddPhoneMobileEmail.action === 'edit') {
        this
          .organismData
          .fields[this.dialogAddPhoneMobileEmail.fieldIndex]
          .value[this.dialogAddPhoneMobileEmail.iValue] = {
            value: data.value,
            type: data.type
          }
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
        route: '/desktop/adm/getUserIdMongo',
      }
      useFetch(opt).then(r => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
          return
        } else { this.myUserIdMongo = r.data.userIdMongo }
      })
    },
    confirmAddPerson (userSelected) {
      this.addPerson.userSelected = userSelected
      if (!organismData.fields[this.addPerson.fieldIndex].multiple)
        organismData.fields[this.addPerson.fieldIndex].value = [ this.addPerson.userSelected ]
      else {
        if (!organismData.fields[this.addPerson.fieldIndex].value
          || organismData.fields[this.addPerson.fieldIndex].value === ''
          ) {
            organismData.fields[this.addPerson.fieldIndex].value = [ this.addPerson.userSelected ]
        } else {
          organismData.fields[this.addPerson.fieldIndex].value.push(this.addPerson.userSelected)
        }
      }
      this.closeAddPersonDialog()
      this.addPerson.dialogOpen = false
    },
    closeAddPersonDialog () {
      this.addPerson.userSelected = null
      this.addPerson.dialogOpen = false
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
    confirmFormation (data) {
      if (this.dialogFormation.action === 'add') {
        if (!this.organismData.fields[this.dialogFormation.fieldIndex].value)
          this
            .organismData
            .fields[this.dialogFormation.fieldIndex]
            .value = []
        this
          .organismData
          .fields[this.dialogFormation.fieldIndex]
          .value.push(data)
      } else if (this.dialogFormation.action === 'edit') {
        this
          .organismData
          .fields[this.dialogFormation.fieldIndex]
          .value[this.dialogFormation.iValue] = data
      }
      this.clearFormationInputs()
    },
    confirmAddBankData (data, doc) {
      if (this.dialogAddBankData.action === 'add') {
        if (!thisorganismData.fields[this.dialogAddBankData.fieldIndex].value)
          thisorganismData.fields[this.dialogAddBankData.fieldIndex].value = []
        this
          .organismData
          .fields[this.dialogAddBankData.fieldIndex]
          .value.push({
            bank: data.bank,
            agency: data.agency,
            account: data.account,
            pix: data.pix,
          });
        this.organismData
          .fields[this.dialogAddBankData.userHasDoc.fieldWithDoc]
          .value = doc
      } else if (this.dialogAddBankData.action === 'edit') {
        this
          .organismData
          .fields[this.dialogAddBankData.fieldIndex]
          .value[this.dialogAddBankData.iValue] = { ...data }
      }
      this.dialogAddBankData.open = false
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
    confirmAddOrganism(organismSelected) {
      if (!thisorganismData.fields[this.addOrganism.fieldIndex].multiple)
        thisorganismData.fields[this.addOrganism.fieldIndex].value = [ organismSelected ]
      else {
        if (!thisorganismData.fields[this.addOrganism.fieldIndex].value
          || thisorganismData.fields[this.addOrganism.fieldIndex].value === ''
          ) {
            thisorganismData.fields[this.addOrganism.fieldIndex].value = [ organismSelected ]
        } else {
          thisorganismData.fields[this.addOrganism.fieldIndex].value.push(organismSelected)
        }
      }
      this.clearOrganismInputs()
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
    clearOrganismInputs() {
      this.addOrganism.dialogOpen = false
      this.addOrganism.organismSelected = null
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
    clearMaritalStatus () {
      this.maritalStatus = {
        open: false,
        tabsIndex: null,
        fieldIndex: null,
        data: null,
        action: null,
      }
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
      if (this.userSelected._id === this.myUserIdMongo) {
        this.$q.notify('Você já participa desta função')
        return
      }
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
    getOrganismsConfigs() {
      const opt = {
        route: "/desktop/adm/getOrganismsConfigs",
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.organismConfigOptions = r.data
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
    formatDate(newDate) {
      return date.formatDate(newDate, "DD/MM/YYYY");
    },
    getOrganismDetailById() {
      const organismId = this.$route.query.organismId
      const opt = {
        route: "/desktop/adm/getOrganismDetailById",
        body: {
          organismId: organismId,
        },
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.functions = r.data.functions
          this.hasPermission = r.data.hasPermission
          this.organismName = r.data.organismData.organismName
          this.organismData.fields = r.data.organismData.fields;
          this.organismConfigName = r.data.organismData.organismConfigName
        }
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

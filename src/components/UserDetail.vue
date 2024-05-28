<template>
  <q-page-container class="no-padding">
    <q-page>
      <div
        class="q-pa-md q-ml-sm row justify-between"
      >
        <div 
          class="row"
        >
          <q-item-section avatar v-if="data && data.userProfileImage">
            <q-img
              style="border-radius: 1rem"
              :src="data.userProfileImage ? utils.makeFileUrl(data.userProfileImage) : avatar" 
              width="74px" 
              height="74px"
            />
          </q-item-section>
        </div>
        <div class="col" v-if="data && data.userData && data.userData.userDataTabs">
          <div class="text-capitalize  text-h5 ">
            {{ data.userData.userDataTabs[0].fields[0].value }} 
          </div>
          <div class="text-subtitle1" v-if="data.canUseSystem">
            Acesso ao sistema: 
            <q-badge color="green">Sim</q-badge>
            <q-btn
              v-if="data.canEdit"
              icon="sync"
              color="primary"
              rounded
              size="12px"
              flat
              @click="updateCanUseSystem(false)"
            >
              <q-tooltip>Alterar status de acesso</q-tooltip>
            </q-btn>
          </div>
          <div class="text-subtitle1" v-else-if="!data.canUseSystem">
            Acesso ao sistema: 
            <q-badge color="red">Não</q-badge>
            <q-btn
              v-if="data.canEdit"
              icon="sync"
              color="primary"
              rounded
              size="12px"
              flat
              @click="updateCanUseSystem(true)"
            >
              <q-tooltip>Alterar status de acesso</q-tooltip>
            </q-btn>
          </div>
          <div class="text-subtitle1" v-if="data.canEdit && data.userIsAdm">
            Pode editar dados?
            <q-badge v-if="data.userCanEdit" color="green">Sim</q-badge>
            <q-badge v-else color="red">Não</q-badge>
            <q-btn
              v-if="data.canEdit"
              icon="sync"
              color="primary"
              rounded
              size="12px"
              flat
              @click="updateCanEdit(userCanEdit)"
            >
              <q-tooltip>Alterar status de usuário</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
      <q-separator class="q-mx-md"/>
      <div 
        v-if="data.userData && data.userData.userDataTabs && data.userData.userDataTabs[7] && data.userData.userDataTabs[7].tabValue === 'dados_pastorais'"
      >
        <div
          class="text-h6 q-ma-sm q-ml-md"
        >
          Vínculos:
          <q-btn
            v-if="data.canEdit"            
            icon="add"
            color="primary"
            size="12px"
            dense
            flat
            rounded
            no-caps
            @click.stop="openDialogAddStatusToPastor"
          />
        </div>
        <div class="q-ml-sm">
          <q-tree
            v-if="data.statusTree"
            class="q-ml-sm"
            :nodes="data.statusTree"
            accordion
            node-key="label"
            ref="tree"
          >
          <template v-slot:default-header="prop">
            <div v-if="prop.node.type === 'Chamado'">
              <q-icon
                name="donut_small"
                color="primary"
                size="20px"
                class="q-mr-sm"
              />
              <span class="text-weight-bold">{{ prop.node.label }}</span>
              <q-btn
                v-if="data.canEdit"
                color="primary"
                icon="add"
                flat
                rounded
                size="8px"
                @click.stop="addAtuacaoToPastor(prop.node)"
              />
              <q-btn
                v-if="data.canEdit"
                color="primary"
                icon="edit"
                flat
                rounded
                size="8px"
                @click.stop="editCall(prop.node)"
              />
              <q-btn
                v-if="data.canEdit"
                @click.stop="removeCall(prop.node)"
                color="red"
                rounded
                icon="delete"
                flat
                size="8px"
              />
              <q-btn
                v-if="data.canEdit"
                @click.stop="goToOrganismDetailFromTree(prop.node)"
                color="primary"
                rounded
                icon="arrow_forward"
                flat
                size="8px"
              >
                <q-tooltip>
                  Ir para o organismo
                </q-tooltip>
              </q-btn>
            </div>
            <div v-if="prop.node.type === 'Atuação'">
              <q-icon
                name="my_location"
                color="primary"
                size="20px"
                class="q-mr-sm"
              />
              <span class="">{{ prop.node.label }}</span>
              <q-btn
                v-if="data.canEdit"
                color="primary"
                rounded
                icon="edit"
                flat
                size="8px"
                @click.stop="editAct(prop.node)"
              /> 
              <q-btn
                v-if="data.canEdit"
                size="8px"
                color="red"
                rounded
                icon="delete"
                flat
                @click.stop="removeAct(prop.node)"
              />
              <!-- <q-btn
                @click.stop="goToOrganismDetailFromTree(prop.node)"
                color="primary"
                rounded
                icon="arrow_forward"
                flat
                size="8px"
              >
                <q-tooltip>
                  Ir para o organismo
                </q-tooltip>
              </q-btn> -->
            </div>
          </template>
          <template v-slot:default-body="prop">
            <div v-if="prop.node.type === 'Chamado'">
              <span class="text-weight-light">Data inicial: {{ prop.node.dates.initialDate }}</span>
              <div v-if="prop.node.deadline" class="text-weight-light">Prazo final: {{ prop.node.deadline }}</div>
              <div v-if="!prop.node.deadline" class="text-weight-light">Prazo final:  indefinido</div>

            </div>
          </template>
          </q-tree>
          <div v-if="data.otherLinks">
            <q-list>
              <q-item
                v-for="(link, i) in data.otherLinks"
                :key="link"
                class="bg-grey-2 q-ma-md"
                style="border-radius:1rem"
              > 
                <q-item-section
                  v-if="link.linkType === 'Sem chamado'"
                >
                  <q-item-label lines="1">
                    Tipo: {{ link.linkType }}
                  </q-item-label>
                  <q-item-label lines="2">
                    Motivo: {{ link.reason }}
                  </q-item-label>
                  <q-item-label lines="3">
                    Data inicial: {{ link.dates.initialDate }} / Data final: {{link.dates.finalDate}}
                  </q-item-label>
                  <q-item-label lines="4" v-if="link.deadline !== ''">
                    Prazo final: {{link.deadline}}
                  </q-item-label>
                </q-item-section>
                <q-item-section
                  v-if="link.linkType === 'Licença'"
                >
                  <q-item-label lines="1">
                    Tipo: {{ link.linkType }}
                  </q-item-label>
                  <q-item-label lines="2">
                    Motivo: {{ link.reason }}
                  </q-item-label>
                  <q-item-label lines="3">
                    Data inicial: {{ link.dates.initialDate }} / Data final: {{link.dates.finalDate}}
                  </q-item-label>
                  <q-item-label lines="4" v-if="link.deadline !== ''">
                    Prazo final: {{link.deadline}}
                  </q-item-label>
                </q-item-section>
                <q-item-section
                  v-if="link.linkType === 'Cedido'"
                > 
                  <q-item-label lines="1">
                    Tipo: {{link.linkType}}
                  </q-item-label>
                  <q-item-label lines="2">
                    Denominação: {{link.denomination}}
                  </q-item-label>
                  <q-item-label lines="3">
                    Organismo: {{link.organismName}}
                  </q-item-label>
                  <q-item-label lines="4">
                    Data inicial: {{ link.dates.initialDate }} / Data final: {{link.dates.finalDate}}
                  </q-item-label>
                  <q-item-label lines="5" v-if="link.deadline !== ''">
                    Prazo final: {{link.deadline}}
                  </q-item-label>
                </q-item-section>
                <q-item-section v-if="link.linkType === 'Aposentado'">
                  <q-item-label lines="1">
                    Tipo: {{link.linkType}}
                  </q-item-label>
                  <q-item-label lines="2">
                    Data inicial: {{ link.dates.initialDate }} / Data final: {{link.dates.finalDate}}
                  </q-item-label>
                  <q-item-label lines="3" v-if="link.deadline !== ''">
                    Prazo final: {{link.deadline}}
                  </q-item-label>
                </q-item-section>
                <q-item-section v-if="link.linkType === 'Estudante'">
                  <q-item-label lines="1">
                    Tipo: {{link.linkType}}
                  </q-item-label>
                  <q-item-label lines="2">
                    Motivo: {{link.goal}}
                  </q-item-label>
                  <q-item-label lines="3">
                    Local: {{link.local}}
                  </q-item-label>
                  <q-item-label lines="4">
                    Data inicial: {{ link.dates.initialDate }} / Data final: {{link.dates.finalDate}}
                  </q-item-label>
                  <q-item-label lines="5" v-if="link.deadline !== ''">
                    Prazo final: {{link.deadline}}
                  </q-item-label>
                </q-item-section>
                <q-item-section v-if="link.linkType === 'Estagiário'">
                  <q-item-label lines="1">
                    Tipo: {{link.linkType}}
                  </q-item-label>
                  <q-item-label lines="2" >
                    Pastor orientador: {{ link.pastorName }}
                  </q-item-label>
                  <q-item-label lines="3" >
                    Congregação: {{ link.organismName }}
                  </q-item-label>
                  <q-item-label lines="4">
                    Data inicial: {{ link.dates.initialDate }} / Data final: {{link.dates.finalDate}}
                  </q-item-label>
                  <q-item-label lines="5" v-if="link.deadline !== ''">
                    Prazo final: {{link.deadline}}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>
                    <q-btn
                      icon="edit"
                      color="primary"
                      rounded
                      flat
                      unelevated
                      class="q-mx-sm"
                      @click="editLink(link)"
                    />
                    <q-btn
                      icon="delete"
                      color="red"
                      rounded
                      flat
                      unelevated
                      class="q-mx-sm"
                      @click="removeLink(i)"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
        <q-separator class="q-mx-lg"/>
        <div class="q-my-sm">
          <q-expansion-item
            label="Hitórico de vínculos"
            dense-toggle
            class="q-mx-md"
          >
            <q-list>
              <q-item
                v-for="link in data.legacyLinks"
                :key="link"
                class="bg-grey-2 q-my-sm q-mx-md"
                style="border-radius: 1rem;"
              >
                <q-item-section>
                  <q-item-label lines="1">
                    {{ link.functionConfigName }} - {{ link.organismName }}
                  </q-item-label>
                  <q-item-label lines="2">
                    Data inicial: {{ link.functionDates.initialDate }}
                  </q-item-label>
                  <q-item-label lines="3">
                    Data Final: {{ link.functionDates.finalDate }}
                  </q-item-label>
                </q-item-section> 
              </q-item>
            </q-list>
          </q-expansion-item>
        </div>
        <!-- TESTETESTETESTETESTE -->
        <q-list bordered>
          <div v-for="(tabs, i) in data.userData.userDataTabs" :key="i">
            <q-expansion-item
              v-if="data.userType === 'user' ? tabs.tabLabel !== 'Dados pastorais' : tabs.tabLabel"
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
                          field.type.type === 'string' && field.label === 'E-mail'"
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
                        <div v-if="field.type.type === 'int'
                          || field.type.type === 'date'
                          || field.type.type === 'cpf'
                          || field.type.type === 'cnpj'
                          || field.type.type === 'money'
                          || field.type.type === 'textarea'
                          || (field.type.type === 'string' && field.label === 'Nome')
                          "
                        >
                          <q-input
                            :label="field.label"
                            :hint="field.hint"
                            :mask="field.type.mask"
                            v-model="field.value"
                            outlined
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
                                @click="addDoubleSelection(i, fieldIndex)"
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
                                    v-model="userData.userDataTabs[i].fields[fieldIndex].value[valueIndex][selectIndex]"
                                    :options="select.options"
                                    class="col-5"
                                  />
                                  <q-btn
                                    icon="delete"
                                    class="q-ml-lg"
                                    rounded
                                    flat
                                    color="red"
                                    @click="userData.userDataTabs[i].fields[fieldIndex].value.splice(valueIndex, 1)" 
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
                              v-if="(field.multiple || !field.value || field.value ==='' || field.value.length === 0) && data.canEdit"
                              @click="clkOpenAddOrganismDialog(fieldIndex, i)"
                            />
                            <CardOrganism
                              :data="field"
                              :fieldIndex="fieldIndex"
                              :tabsIndex="i"
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
                            @click="clkOpenAddressDialog(fieldIndex, i)"
                            class="q-mt-xs"
                          />
                          <CardAddress
                            :data="field.value"
                            :fieldIndex="fieldIndex"
                            :tabsIndex="i"
                            @remove="removeAddress"
                          />
                        </div>
                        <div v-if="field.type.type === 'person'">
                          <div v-if="field.value && field.value.length > 0">
                            <div class="text-body">{{ field.label }}</div>
                            <CardPerson
                              :data="field"
                              :fieldIndex="fieldIndex"
                              :tabsIndex="i"
                              :canEdit="data.canEdit"
                              @remove="removePerson"
                            />
                          </div>
                          <q-btn
                            :label="`Adicionar ${field.label}`"
                            no-caps
                            rounded
                            flat
                            color="primary"
                            icon="add"
                            v-if="(field.multiple || !field.value || field.value ==='' || field.value.length === 0) && data.canEdit"
                            @click="clkOpenAddPersonDialog(fieldIndex, i, field.label)"
                          />
                        </div>
                        <div v-if="field.type.type === 'maritalStatus'">
                          <div v-if="field.value && field.value.length > 0">
                            <div class="text-body">{{ field.label }}</div>
                            <CardMaritalStatus
                              :data="field.value"
                              :fieldIndex="fieldIndex"
                              :tabsIndex="i"
                              :canEdit="data.canEdit"
                              @remove="removeMaritalStatus"
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
                            @click="clkAddMaritalStatus(fieldIndex, i)"
                          />
                        </div>
                        <div v-if="field.type.type === 'bank_data'">
                          <q-btn
                            label="Adicionar dados bancários"
                            no-caps
                            rounded
                            flat
                            color="primary"
                            @click="clkAddBankData(fieldIndex, i)"
                            icon="add"
                          />
                          <CardBankData
                            :data="field"
                            :fieldIndex="fieldIndex"
                            :tabsIndex="i"
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
                            @click="addDialogPhoneMobileEmail(fieldIndex, i, field)"
                            class="q-mt-xs"
                          />
                          <CardPhoneMobileEmail
                            :data="field.value"
                            :fieldIndex="fieldIndex"
                            :tabsIndex="i"
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
                            class="q-mt-xs"
                          />
                          <CardFormation
                            :data="field"
                            :fieldIndex="fieldIndex"
                            :tabsIndex="i"
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
      <DialogAddStatus
        v-if="data.userData && data.userData.userDataTabs && data.userData.userDataTabs[0].fields[0].value"
        :open="data.dialogAddStatus.open"
        :userId="props.userId"
        :userName="data.userData.userDataTabs[0].fields[0].value"
        @closeDialog="clearDialogAddStatus"
        @confirm="confirmAddStatus"
      />
      <DialogAddActing
        v-if="data.userData && data.userData.userDataTabs && data.userData.userDataTabs[0] && data.dialogActing.organismCallerSelected "
        :open="data.dialogActing.open"
        :userName="data.userData.userDataTabs[0].fields[0].value"
        :userId="props.userId"
        :organismName="data.dialogActing.organismCallerSelected.nome"
        :organismId="data.dialogActing.organismCallerSelected.organismId"
        @confirm="confirmAddActing"
      />
    
    </q-page>
  </q-page-container>
</template>

<script setup>

  const props = defineProps(['userId', 'adm', 'user'])
  import { onBeforeMount, ref } from 'vue';
  import utils from '../boot/utils'
  import useFetch from 'src/boot/useFetch';
  import avatar from '../assets/avatar.svg'
  import CardOrganism from '../components/CardOrganism.vue'
  import CardAddress from '../components/CardAddress.vue'
  import CardPerson from '../components/CardPerson.vue'
  import CardMaritalStatus from '../components/CardMaritalStatus.vue'
  import CardBankData from '../components/CardBankData.vue'
  import CardPhoneMobileEmail from '../components/CardPhoneMobileEmail.vue'
  import CardFormation from '../components/CardFormation.vue'
  import DialogAddStatus from '../components/DialogAddStatus.vue'
  import DialogAddActing from '../components/DialogAddActing.vue'

  const data = ref({
    userIsAdm: false,
    canEdit: false,
    callList: [],
    otherLinks: null,
    legacyLinks: null,
    userCanEdit: false,
    userLinks: null,
    userType: null,
    canUseSystem: false,
    pastoralStatusData: null,
    userProfileImage: null,
    tab: null,
    userData: null,
    statusTree: null,
    pastoralStatusTypes: null,
    dialogAddStatus: {
      open:false,
      functionId: null
    },
    dialogActing: {
      open: false,
      organismCallerSelected: null,
      call: null,
      callId: null
    },
  })

  onBeforeMount(() => {
    startView()
  })

  async function startView() {
    const permStatus = await utils.getPermissionStatus('ADMIN')
    if (permStatus.data === 'onMaitenance') {
      this.$router.push('/maitenancePage')
      return
    }

    if (props.adm) {
      verifyIfHAsAdmPermission()
      getUserCanEditStatus()
      getUserDetailById()
      getPastoralStatusTypes()
    }
  }

  function addAtuacaoToPastor(call) {
    data.value.dialogActing.organismCallerSelected = {
      nome: call.organismName,
      organismId: call.organismId,
    }
    data.value.dialogActing.open = true
    data.value.dialogActing.call = call
    data.value.dialogActing.callId = call.callId
  }

  async function confirmAddActing(info) {
    data.value = info._value; 
    const opt = {
      route: '/desktop/adm/insertActingToCall',
      body: {
        data: info,
        callId: data.value.dialogActing.callId, 
        userId: data.value.$route.query.userId 
      }
    };
    let r = await useFetch(opt);
    if (r.error) return;
    clearDialogActing(); 
    startView();
  }

  async function confirmAddStatus(status, info) {
    const opt = {
      route: '/desktop/adm/insertPastorStatus',
      body: {
        status,
        data: info,
        functionId: data.value.dialogAddStatus.functionId
      }
    }
    let r = await useFetch(opt)
    if (r.error) return
    clearDialogAddStatus()
  }

  function openDialogAddStatusToPastor() {
    data.value.dialogAddStatus.open = true
  }

  function clearDialogAddStatus() {
    data.value.dialogAddStatus.open = false
  }

  async function verifyIfHAsAdmPermission() {
    const opt = {
      route: '/desktop/adm/verifyIfUserHasAdmPermission',
      body: {
        userId: props.userId
      }
    }
    let r = await useFetch(opt)
    if (r.error) return
    data.value.userIsAdm = r.data
  }

  async function getUserCanEditStatus(){
    const opt = {
      route: '/desktop/users/getUserCanEditStatus'
    }
    let r = await useFetch(opt)
    if (r.error) return
    data.value.canEdit = r.data
  }

  async function getUserDetailById() {
    const userId = props.userId;
    const opt = {
      route: "/desktop/adm/getUserDetailById",
      body: {
        _id: userId,
      },
    };
    let r = await useFetch(opt)
    if (r.error) {
      this.$q.notify("Ocorreu um erro, tente novamente")
      return
    }
    const userConfig = await getUsersConfig(r.data.userType)
    if (userConfig.error) {
      this.$q.notify("Ocorreu um erro, tente novamente");
      return
    }
    if (r.data && r.data.userLinksToOrganisms && r.data.userLinksToOrganisms.links.length > 0) {
      data.value.callList = r.data.userLinksToOrganisms.links;
    }
    if (r.data && r.data.userLinksToOrganisms && r.data.userLinksToOrganisms.otherLinks && r.data.userLinksToOrganisms.otherLinks.length > 0) {
      data.value.otherLinks = r.data.userLinksToOrganisms.otherLinks;
    }
    data.value.userCanEdit = r.data.canEdit
    data.value.userLinks = r.data.userLinksToOrganisms.data
    data.value.userType = r.data.userType
    data.value.userData = userConfig.data
    data.value.canUseSystem = r.data.canUseSystem
    if (r.data.pastoralStatus && r.data.pastoralStatus.data) {
      data.value.pastoralStatusData = r.data.pastoralStatus.data
    }
    if (r.data.legacyLinks) {
      data.value.legacyLinks = r.data.legacyLinks
    }
    data.value.userProfileImage = r.data.profileImage
    data.value.tab = r.data.userDataTabs[0].tabValue
    verifyLinksToOrganize()
    mountUserData(r.data)
    mountTree()
    //   this.verifyInactiveStatus()
  }

  function verifyLinksToOrganize() {
    let congregationLinks = [];
    let parishLinks = [];
    if (data.value.userLinks && data.value.userLinks.length === 2) {
      data.value.userLinks.forEach((link, i) => {
        if (link.organismConfigName === 'Distrito') {
          data.value.userLinks.splice(i, 1);
        }
        if (link.organismConfigName === 'Congregação') {
          congregationLinks.push({
            index: i
          });
        }
        if (link.organismConfigName === 'Paróquia') {
          parishLinks.push({
            index: i
          });
        }
        if (congregationLinks.length > 0) {
          if (parishLinks.length > 0) {
            parishLinks.forEach((pl) => {
              data.value.userLinks.splice(pl.index, 1); 
            });
          }
        }
      });
    }
  }


  async function getPastoralStatusTypes() {
    const opt = {
      route: '/desktop/adm/getPastoralStatusTypes'
    }
    let r = await useFetch(opt)
    if (r.error) return
    data.value.pastoralStatusTypes = r.data
  }

  function mountUserData(userDetail) {
    data.value.userData.userDataTabs.forEach((configTab, iConfigTab) => {
      configTab.fields.forEach((configField, iConfigField) => {
        userDetail.userDataTabs.forEach((userTab) => {
          userTab.fields.forEach((userField) => {
            if (configField.model === userField.model && userField.value) {
              data.value.userData.userDataTabs[iConfigTab].fields[iConfigField].value = userField.value
            }
          })
        })
      })
    })
  }
  
  function mountTree() {
    let tree = []
    data.value.callList.forEach((item, i) => {
      tree.push({
        label: item.functionConfigName + ' - ' + item.organismName,
        children: [],
        type: 'Chamado',
        callId: item._id,
        deadline: item.deadline,
        dates: {
          initialDate: item.functionDates.initialDate
        },
        organismFunctionUserId: item.organismFunctionUserId,
        organismId: item.organismId,
        organismName: item.organismName
      })
      if (item.functionsAtuacao && item.functionsAtuacao.length > 0) {
        item.functionsAtuacao.forEach((act) => {
          tree[i].children.push({
            label: act.organismName,
            type: 'Atuação',
            organismId: act.organismId,
            actId: act._id,
            organismName: act.organismName,
            dates: {
              initialDate: act.functionDates.initialDate
            }
          })
        })
      }
    })
    data.value.statusTree = tree
  }

  async function getUsersConfig(userType) {
    const opt = {
      route: "/desktop/adm/getUsersConfig",
    };
    if (userType) opt.body = { userType }
    return await useFetch(opt)
  }

</script>
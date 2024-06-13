<template>
  <q-page-container class="no-padding">
    <q-page>
      <!-- <UserDetail
        :userId="$route.query.userId"
        :adm="true"
      /> -->
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
        <div class="col" v-if="userData && userData.userDataTabs">
          <div class="text-capitalize  text-h5 ">
            {{ userData.userDataTabs[0].fields[0].value }} 
          </div>
          <div class="text-subtitle1" v-if="canUseSystem">
            Acesso ao sistema: 
            <q-badge color="green">Sim</q-badge>
            <q-btn
              v-if="canEdit"
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
          <div class="text-subtitle1" v-else-if="!canUseSystem">
            Acesso ao sistema: 
            <q-badge color="red">Não</q-badge>
            <q-btn
              v-if="canEdit"
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
          <div class="text-subtitle1" v-if="canEdit && userIsAdm">
            Pode editar dados?
            <q-badge v-if="userCanEdit" color="green">Sim</q-badge>
            <q-badge v-else color="red">Não</q-badge>
            <q-btn
              v-if="canEdit"
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
          <!-- <div class="text-subtitle1" v-else-if="!canEdit">
            Pode editar dados?
            <q-badge color="red">Não</q-badge>
            <q-btn
              v-if="canEdit"
              icon="sync"
              color="primary"
              rounded
              size="12px"
              flat
              @click="updateCanEdit(true)"
            >
              <q-tooltip>Alterar status de usuário</q-tooltip>
            </q-btn>
          </div> -->
        </div>
        
        <div class="col q-gutter-sm text-right">
          <q-btn 
            color="primary"
            @click="openDialogUserPdfInfo"
            label="Ficha cadastral"
            rounded
            no-caps
            outline
          />
          <q-btn
            v-if="userType && userType === 'pastor' && canEdit"
            color="secondary"
            rounded
            outline
            size="md"
            no-caps
            label="Tornar ex-pastor"
            @click="dialogchangeUserType.open = true"
          />
          <q-btn
            v-if="canEdit"
            icon="delete"
            color="red-8"
            rounded
            outline
            size="md"
            no-caps
            label="Inativar"
            @click="openDialogRemoveUser = true"
          />
          <q-btn
            v-if="canEdit"
            color="primary"
            rounded
            unelevated
            :disable="canEdit ? false : true"
            no-caps
            label="Atualizar Dados"
            @click="updateUserData()"
          />
        </div>
      </div>
      <q-separator class="q-mx-md"/>
      <div v-if="userData && userData.userDataTabs">
        <div v-if="userData && userData.userDataTabs[7] && userData.userDataTabs[7].tabValue === 'dados_pastorais'">
          <div class="text-h6 q-ma-sm q-ml-md">
            Vínculos:
            <q-btn
              v-if="canEdit"            
              icon="add"
              color="primary"
              size="12px"
              dense
              flat
              rounded
              no-caps
              @click.stop="openDialogAddCallToPastor"
            />
          </div>
          <div class="q-ml-sm">
            <q-tree
              v-if="statusTree && statusTree.length > 0"
              class="q-mx-md"
              :nodes="statusTree"
              accordion
              node-key="label"
              ref="tree"
            >
              <template v-slot:default-header="prop">
                <div v-if="prop.node.type === 'Chamado'" >
                  <q-icon
                    name="donut_small"
                    color="primary"
                    size="20px"
                    class="q-mr-sm"
                  />
                  <span class="text-weight-bold">{{ prop.node.label }} - {{ prop.node.type }}</span>
                  <q-btn
                    class="q-ml-sm"
                    v-if="canEdit"
                    color="primary"
                    icon="add"
                    flat
                    round
                    size="12px"
                    @click.stop="addAtuacaoToPastor(prop.node)"
                  >
                    <q-tooltip>
                      Adicionar atuação
                    </q-tooltip>
                  </q-btn>
                  <q-btn
                    v-if="canEdit"
                    color="primary"
                    icon="edit"
                    flat
                    round
                    size="12px"
                    @click.stop="editCall(prop.node)"
                  >
                    <q-tooltip>
                      Editar vínculo
                    </q-tooltip>
                  </q-btn>
                  <q-btn
                    v-if="canEdit"
                    @click.stop="goToOrganismDetailFromTree(prop.node)"
                    color="primary"
                    round
                    icon="arrow_forward"
                    flat
                    size="12px"
                  >
                    <q-tooltip>
                      Ir para o organismo
                    </q-tooltip>
                  </q-btn>
                  <div class="text-weight-ligth q-ml-lg text-grey-6">Data inicial: {{ prop.node.dates.initialDate }}</div>
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
                    class="q-ml-sm"
                    v-if="canEdit"
                    color="primary"
                    round
                    icon="edit"
                    flat
                    size="8px"
                    @click.stop="editAct(prop.node)"
                  > 
                    <q-tooltip>Editar chamado</q-tooltip>
                  </q-btn>
                  <div class="text-weight-ligth q-ml-lg text-grey-6">Data inicial: {{ prop.node.dates.initialDate }}</div>
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
              <!-- <template v-slot:default-body="prop">
                <div v-if="prop.node.type === 'Chamado'">
                  <span class="">Data inicial: {{ prop.node.dates.initialDate }}</span>
                  <div v-if="prop.node.deadline" class="text-weight-light">Prazo final: {{ prop.node.deadline }}</div>
                </div>
              </template> -->
            </q-tree>
            <div v-if="otherLinks">
              <q-list>
                <q-item
                  v-for="(link) in otherLinks"
                  :key="link"
                  class="bg-grey-2 q-ma-md"
                  style="border-radius:1rem"
                > 
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
                      Data inicial: {{ link.dates.initialDate }}
                    </q-item-label>
                    <q-item-label lines="4">
                      Data final: {{link.dates.finalDate}}
                    </q-item-label>
                    <q-item-label lines="5" v-if="link.deadline !== ''">
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
                      Data inicial: {{ link.dates.initialDate }}
                    </q-item-label>
                    <q-item-label lines="5">
                      Data final: {{link.dates.finalDate}}
                    </q-item-label>
                    <q-item-label lines="6" v-if="link.deadline !== ''">
                      Prazo final: {{link.deadline}}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section v-if="link.linkType === 'Aposentado'">
                    <q-item-label lines="1">
                      Tipo: {{link.linkType}}
                    </q-item-label>
                    <q-item-label lines="2">
                      Data inicial: {{ link.dates.initialDate }}
                    </q-item-label>
                    <q-item-label lines="3">
                      Data final: {{link.dates.finalDate}}
                    </q-item-label>
                    <q-item-label lines="4" v-if="link.deadline !== ''">
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
                      Data inicial: {{ link.dates.initialDate }}
                    </q-item-label>
                    <q-item-label lines="5">
                      Data final: {{link.dates.finalDate}}
                    </q-item-label>
                    <q-item-label lines="6" v-if="link.deadline !== ''">
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
                      Data inicial: {{ link.dates.initialDate }}
                    </q-item-label>
                    <q-item-label lines="5">
                      Data final: {{link.dates.finalDate}}
                    </q-item-label>
                    <q-item-label lines="6" v-if="link.deadline !== ''">
                      Prazo final: {{link.deadline}}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section
                    v-if="link.linkType === 'Sem chamado'"
                  >
                    <q-item-section>
                      <q-item-label lines="1">
                        Tipo: {{link.linkType}}
                      </q-item-label>
                      <q-item-label lines="2">
                        Posição: {{link.position}}
                      </q-item-label>
                      <q-item-label lines="3">
                      Data inicial: {{ link.dates.initialDate }}
                    </q-item-label>
                    <q-item-label lines="4">
                      Data final: {{link.dates.finalDate}}
                    </q-item-label>
                    <q-item-label lines="5" v-if="link.deadline !== ''">
                      Prazo final: {{link.deadline}}
                    </q-item-label>
                    </q-item-section>
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
                      >
                        <q-tooltip>
                          Editar vínculo
                        </q-tooltip>                      
                      </q-btn>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
          <q-separator class="q-mx-md"/>
          <div class="q-my-sm">
            <q-expansion-item
              label="Histórico de vínculos"
              dense-toggle
              class="text-h6"
            >
              <q-list class="text-subtitle1 q-mx-sm">
                <q-item
                  v-for="link in legacyLinks"
                  :key="link"
                  class="bg-grey-2 q-my-sm q-ml-md q-mr-sm"
                  style="border-radius: 1rem"
                  :clickable="(link.linkType === 'Atuação' && link.organismFunctionUserId) ? true : false"
                  @click="openDialogCallDetail(link)"
                >
                  <q-item-section
                    v-if="link.linkType === 'Sem chamado'"
                  >
                    <q-item-label lines="1">
                      Tipo: {{ link.linkType }}
                    </q-item-label>
                    <q-item-label lines="2">
                      Posição: {{ link.position }}
                    </q-item-label>
                    
                    <q-item-label lines="3">
                      Data inicial: {{ link.dates.initialDate }}
                    </q-item-label>
                    <q-item-label lines="4">
                      Data final: {{link.dates.finalDate}}
                    </q-item-label>
                    <q-item-label lines="5" v-if="link.deadline !== ''">
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
                      Data inicial: {{ link.dates.initialDate }}
                    </q-item-label>
                    <q-item-label lines="4">
                      Data final: {{link.dates.finalDate}}
                    </q-item-label>
                    <q-item-label lines="5" v-if="link.deadline !== ''">
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
                      Data inicial: {{ link.dates.initialDate }}
                    </q-item-label>
                    <q-item-label lines="5">
                      Data final: {{link.dates.finalDate}}
                    </q-item-label>
                    <q-item-label lines="6" v-if="link.deadline !== ''">
                      Prazo final: {{link.deadline}}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section v-if="link.linkType === 'Aposentado'">
                    <q-item-label lines="1">
                      Tipo: {{link.linkType}}
                    </q-item-label>
                    <q-item-label lines="2">
                      Data inicial: {{ link.dates.initialDate }}
                    </q-item-label>
                    <q-item-label lines="3">
                      Data final: {{link.dates.finalDate}}
                    </q-item-label>
                    <q-item-label lines="4" v-if="link.deadline !== ''">
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
                      Data inicial: {{ link.dates.initialDate }}
                    </q-item-label>
                    <q-item-label lines="5">
                      Data final: {{link.dates.finalDate}}
                    </q-item-label>
                    <q-item-label lines="6" v-if="link.deadline !== ''">
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
                      Data inicial: {{ link.dates.initialDate }}
                    </q-item-label>
                    <q-item-label lines="5">
                      Data final: {{link.dates.finalDate}}
                    </q-item-label>
                    <q-item-label lines="6" v-if="link.deadline !== ''">
                      Prazo final: {{link.deadline}}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section v-if="link.linkType === 'Atuação'">
                    <q-item-label lines="1">
                      Tipo: {{link.linkType}}
                    </q-item-label>
                    <q-item-label lines="2">
                      {{ link.functionConfigName }} - {{ link.organismName }}
                    </q-item-label>
                    <q-item-label lines="3">
                      Data inicial: {{ link.functionDates.initialDate }}
                    </q-item-label>
                    <q-item-label lines="4">
                      Data Final: {{ link.functionDates.finalDate }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </div>
        </div>
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
                              v-if="(field.multiple || !field.value || field.value ==='' || field.value.length === 0) && canEdit"
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
                              :canEdit="canEdit"
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
                            v-if="(field.multiple || !field.value || field.value ==='' || field.value.length === 0) && canEdit"
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
                              :canEdit="canEdit"
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
                        <div v-if="field.type.type === 'social_network'">
                          <q-btn
                            label="Rede social"
                            no-caps
                            rounded
                            unelevated
                            flat
                            color="primary"
                            icon="add"
                            @click="clkAddSocialNetwork(fieldIndex, i)"
                            class="q-mt-xs"
                            :disable="tabs.onlyAdm"
                          />
                          <CardSocialNetwork
                            :data="field.value"
                            :fieldIndex="fieldIndex"
                            :tabsIndex="i"
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
          </div>
        </q-list>
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
              :disable="canEdit"
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
              :disable="canEdit"
              color="primary"
              @click="clkConfirmDeleteTitle"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- <q-dialog v-model="dialogAddCallToPastor.open" @hide="clearDialogAndFunctions">
        <q-card style="border-radius: 1rem; width: 400px">
          <q-card-section align="center">
            <div class="text-h6" v-if="dialogAddCallToPastor.functionType === 'Pastor'">
              Adicionando {{ dialogAddCallToPastor.subtype === 'chamado' ? 'chamado' : 'atuação' }} para {{ userData.userDataTabs[0].fields[0].value }}
            </div>
            <div v-if="dialogAddCallToPastor.selectedFunc && dialogAddCallToPastor.selectedFunc.functionRequiredTitleName">
              <q-chip color="red-8" outline>
                Esta função requer o título {{ dialogAddCallToPastor.selectedFunc.functionRequiredTitleName }}
              </q-chip>
            </div>
          </q-card-section>
          <q-card-section v-if="dialogAddCallToPastor.functionType === 'Pastor' && dialogAddCallToPastor.action !== 'edit'" class="q-gutter-y-md">
            <q-select
              v-model="dialogAddCallToPastor.organismCallerSelected"
              filled
              use-input
              label="Nome do organismo de chamado"
              option-label="nome"
              :readonly="dialogAddCallToPastor.subtype === 'atuacao' ? true : false"
              options-dense
              @update:model-value="getOrganismDetailD()"
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
          <q-card-section class="q-gutter-md" v-if="dialogAddCallToPastor.functionType === 'Pastor'">
            <q-checkbox
              v-if="dialogAddCallToPastor.action === 'add'"
              v-model="otherOrganism"
              label="Buscar organismo de outra paróquia"
            />
            <q-select
              v-if="dialogAddCallToPastor.action === 'add'"
              v-show="!otherOrganism"
              v-model="dialogAddCallToPastor.organismAtuationSelected"
              filled
              multiple
              label="Nome do organismo de atuação"
              option-label="nome"
              options-dense
              :options="actingOrganismsList"
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
            <q-select
              v-show="otherOrganism"
              v-model="dialogAddCallToPastor.organismAtuationSelected"
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
              v-if="dialogAddCallToPastor.action === 'add'"
              label="É o mesmo organismo de chamado"
              @update:model-value="changeOrganismCaller()"
              v-model="dialogAddCallToPastor.sameOrganismCalled"
            />
            <q-input
              v-if="dialogAddCallToPastor.subtype !== 'atuacao'"
              filled
              label="Chave-ata"
              mask="AAA-AAA-###-####-##-a"
              :rules="[validateAtaKeyFormat]"
              lazy-rules
              v-model="dialogAddCallToPastor.ataKey"
              hint="Informe a chave-ata"
            />
          </q-card-section>
          <q-card-section
            v-if="dialogAddCallToPastor.subtype !== 'atuacao'"
          >
            <q-input
            v-if="dialogAddCallToPastor.functionType === 'Pastor'"
            filled
            type="date"
            label="Prazo do chamado"
            v-model="dialogAddCallToPastor.calleeDate"
            />
            <q-checkbox
            v-if="dialogAddCallToPastor.functionType === 'Pastor'"
            label="Prazo chamado é indefinido"
            @update:model-value="undefinedCalleeFunction()"
            v-model="dialogAddCallToPastor.undefinedCallee"
            />
          </q-card-section>
          <q-card-section class="q-gutter-md">
            <q-select
              v-if="dialogAddCallToPastor.functionType === 'Pastor' && dialogAddCallToPastor.subtype !== 'atuacao'"
              v-model="dialogAddCallToPastor.userInstallation"
              filled
              use-input
              label="nome do pastor que instalou"
              option-label="userName"
              :options="pastorsOptions"
              hint="Usuário que instalou"
              @filter="getPastors"
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
              v-if="dialogAddCallToPastor.functionType === 'Pastor'"
              filled
              type="date"
              label="Data de instalação"
              v-model="dialogAddCallToPastor.installationDate"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Depois"
              no-caps
              rounded
              color="primary"
              @click="dialogAddCallToPastor.open = false"
            />
            <q-btn
              unelevated
              rounded
              :disable="canEdit"
              label="Confirmar"
              no-caps
              color="primary"
              @click="addUserToFunction"
            />
          </q-card-actions>
        </q-card>
      </q-dialog> -->

      <q-dialog v-model="dialogSwapUserFromFunction.open" @hide="clearDialogSwapData">
        <q-card style="border-radius: 1rem">
          <q-card-section>
            <div class="text-h6 text-center">Substituição</div>
            <div>O usuário será substituido da função</div>
          </q-card-section>
          <q-card-section align="center" class="q-gutter-sm">
            <q-input
              v-model="dialogSwapUserFromFunction.observation"
              filled
              label="Observação"
              hint="Informe o motivo"
              class="q-pa-sm q-mb-lg"
            />
            <q-input
              filled
              type="date"
              v-model="dialogSwapUserFromFunction.finalDate"
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
              v-model="dialogSwapUserFromFunction.newUser"
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
              label="Confirma"
              no-caps
              @click="clkConfirmSwapUser"
              rounded
              :disable="canEdit"
              color="primary"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      
      <DialogAddPastoralStatus
        :pastoralStatusTypes="pastoralStatusTypes"
        :open="dialogAddPastoralStatus.open"
        :editStatus="statusData"
        :route="`user`"
        @closeDialog="closeDialogPastoralStatus"
        @confirm="clkCreatePastoralStatus"
      />

      <DialogOrganismDetail
        :open="dialogLinkDetail.open"
        :orgData="dialogLinkDetail.orgData"
        :orgFields="dialogLinkDetail.orgFields"
        :orgFunc="dialogLinkDetail.orgFunc"
        :isAdm="true"
        @closeDialog="closeDialogOrganismDetail"
        @goToDetail="routeToDetail"
      />

      <q-dialog v-model="openDialogRemoveUser">
        <q-card style="border-radius: 1rem; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">
              Tem certeza que deseja inativar este usuário? 
            </div>
            <div class = "q-px-sm">
              Causa da morte:
              <q-checkbox rounded v-if="otherDead===false" v-model="isDeadbyDeath">Falecimento</q-checkbox>
              <q-checkbox rounded v-if="isDeadbyDeath===false" v-model="otherDead">Outro</q-checkbox>
            </div>
            <q-input :readonly= "isDeadbyDeath===false"  v-model="dateOfDead" label="Data de falecimento" outlined type="date"></q-input>
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
              :disable="canEdit ? false : true"
              @click="InactivateUser"
              color="primary"
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
              Tem certeza que deseja remover {{ dialogDeletePastorFromFunction.type === 'chamado' ? 'chamado' : 'atuação' }} de
              {{ userData.userDataTabs[0].fields[0].value }}?
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
              :options="pastorsOptions"
              @filter="getPastors"
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
              :disable="canEdit"
              label="Confirmar"
              no-caps
              color="primary"
              @click="desinstallPastorFunction"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogchangeUserType.open"
      >
        <q-card style="width: 300px; border-radius: 1rem;">
          <q-card-section>
            <div
              class="text-center text-h6" 
            >
              Tornar ex-pastor
            </div>      
          </q-card-section>
          <q-card-section>
            <div>
              <strong>Motivo:</strong>
            </div>
            <q-input
              type="textarea"
              v-model="dialogchangeUserType.reason"
              outlined
            />
          </q-card-section>
          <q-card-section>
            <div>
              <strong>Data:</strong>
            </div>
            <q-input
              mask="##/##/####"
              v-model="dialogchangeUserType.date"
              outlined
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              color="primary"
              flat
              rounded
              unelevated
              label="Voltar"
              no-caps
            />
            <q-btn
              color="primary"
              rounded
              unelevated
              label="Confirmar"
              no-caps
              :disable="canEdit ? false : true"
              @click="confirmChangeUserType"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogRemoveCall.open"
      >
        <q-card style="width: 300px;border-radius: 1rem;">
          <q-card-section class="text-h6 text-center">
            Deseja excluir este chamado?
          </q-card-section>
          <q-card-section>
            <q-input
              label="Data fim"
              outlined
              mask="##/##/####"
              class="q-pa-sm"
              v-model="dialogRemoveCall.finalDate"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              @click="clearDialogRemoveCall"            
              color="primary"
              label="Voltar"
              flat
              no-caps
              unelevated
              rounded
            />
            <q-btn
              unelevated
              color="primary"
              rounded
              label="Confirmar"
              no-caps
              @click="confirmRemoveCall"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogRemoveActing.open"
      >
        <q-card
          style="width: 300px;border-radius: 1rem"
        >
          <q-card-section class="text-h6 text-center">
            Remover Atuação
          </q-card-section>
          <q-card-section>
            <q-input
              label="Data fim"
              outlined
              mask="##/##/####"
              class="q-pa-sm"
              v-model="dialogRemoveActing.finalDate"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              @click="clearDialogRemoveActing"            
              color="primary"
              label="Voltar"
              flat
              no-caps
              unelevated
              rounded
            />
            <q-btn
              unelevated
              color="primary"
              rounded
              label="Confirmar"
              no-caps
              @click="confirmRemoveActing"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog 
        v-model="dialogEditCall.open"
        @hide="clearDialogEditCall"
      >
        <q-card
          style="width: 300px;border-radius: 1rem"
        >
          <q-card-section class="text-h6 text-center">
            Editar dados do chamado
          </q-card-section>
          <q-card-section>
            <q-select
              v-model="dialogEditCall.selectedOrganism"
              outlined
              use-input
              label="Nome do organismo de chamado"
              option-label="nome"
              options-dense
              class="q-pa-sm"
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
            <q-select
              v-model="dialogEditCall.data.userInstaller"
              outlined
              use-input
              label="Quem instalou"
              option-label="userName"
              options-dense
              class="q-pa-sm"
              :options="usersOptions"
              @filter="getUsers"
              :option-value="(item) => item"
            />
            <q-input
              outlined
              v-model="dialogEditCall.data.ataKeyInstallation"
              label="Chave ata instalação"
              class="q-pa-sm"
            />
            <q-input
              outlined
              v-model="dialogEditCall.data.dates.initialDate"
              mask="##/##/####"
              label="Data de instalação"
              class="q-pa-sm"
            />
            <q-input
              outlined
              v-model="dialogEditCall.data.ataKeyUninstallation"
              label="Chave ata desinstalação"
              class="q-pa-sm"
            />
            <q-input
              outlined
              v-model="dialogEditCall.data.dates.finalDate"
              mask="##/##/####"
              label="Data de desinstalação"
              class="q-pa-sm"
            />
            <q-select
              v-model="dialogEditCall.data.userUninstaller"
              outlined
              use-input
              label="Quem desinstalou"
              option-label="userName"
              options-dense
              class="q-pa-sm"
              :options="usersOptions"
              @filter="getUsers"
              :option-value="(item) => item"
            />
            <q-input
              label="Prazo do chamado"
              mask="##/##/####"
              class="q-pa-sm"
              outlined
              :disable="dialogEditCall.disable"
              v-model="dialogEditCall.data.deadline"
            />
            <q-checkbox
              label="Prazo do chamado é indefinido"
              v-model="dialogEditCall.noDeadline"
              @update:model-value="changeDeadlineStatus"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              @click="clearDialogEditCall"            
              color="primary"
              label="Voltar"
              flat
              no-caps
              unelevated
              rounded
            />
            <q-btn
              unelevated
              color="primary"
              rounded
              label="Confirmar"
              no-caps
              @click="confirmEditCall"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogEditAct.open"
        @hide="clearDialogEditAct"
      >
        <q-card
          style="width:300px;border-radius:1rem"
        >
          <q-card-section class="text-h6 text-center">
            Editar Atuação
          </q-card-section>
          <q-card-section>
            <q-select
              v-model="dialogEditAct.selectedOrganism"
              outlined
              use-input
              label="Nome do organismo de chamado"
              option-label="nome"
              options-dense
              class="q-pa-sm"
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
            <q-input
              label="Data inicial"
              v-model="dialogEditAct.data.dates.initialDate"
              class="q-pa-sm"
              outlined
              mask="##/##/####"
            />
            <q-input
              label="Data final"
              v-model="dialogEditAct.data.dates.finalDate"
              class="q-pa-sm"
              outlined
              mask="##/##/####"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              @click="clearDialogEditAct"            
              color="primary"
              label="Voltar"
              flat
              no-caps
              unelevated
              rounded
            />
            <q-btn
              unelevated
              color="primary"
              rounded
              label="Confirmar"
              no-caps
              @click="confirmEditAct"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <DialogAddPerson
        :open="dialogAddPerson.open"
        @addPerson="confirmAddPerson"
        @closeDialog="clearDialogAddPerson"
      />
      <DialogMaritalStatus
        :open="dialogAddMaritalStatus.open"
        :dataProp="dialogAddMaritalStatus.data"
        @addPerson="addMaritalStatus"
        @closeDialog="clearDialogAddMaritalStatus"
      />
      <DialogPhoneMobileEmail
        :open="dialogPhoneMobileEmail.open"
        :dataProp="dialogPhoneMobileEmail.dataProp"
        :type="dialogPhoneMobileEmail.type"
        :label="dialogPhoneMobileEmail.label"
        :hint="dialogPhoneMobileEmail.hint"
        @confirm="confirmAddPhoneEmail"
        @closeDialog="clearDdialogAddPhoneEmail"
      />
      <DialogAddAddress
        :open="dialogAddAddress.open"
        @confirmAddress="confirmAddAddress"
        @closeDialog="clearDialogAddAddress"
      />
      <DialogAddStatus
        v-if="userData && userData.userDataTabs && userData.userDataTabs[0].fields[0].value"
        :open="dialogAddStatus.open"
        :userId="$route.query.userId"
        :userName="userData.userDataTabs[0].fields[0].value"
        @closeDialog="clearDialogAddStatus"
        @confirm="confirmAddStatus"
      />
      <DialogAddActing
        v-if="userData && userData.userDataTabs && userData.userDataTabs[0] && dialogActing.organismCallerSelected "
        :open="dialogActing.open"
        :userName="userData.userDataTabs[0].fields[0].value"
        :userId="$route.query.userId"
        :organismName="dialogActing.organismCallerSelected.nome"
        :organismId="dialogActing.organismCallerSelected.organismId"
        @confirm="confirmAddActing"
        @clearDialog="clearDialogAddActing"
      />
      <q-dialog
        v-model="dialogEditLink.open"
        @hide="clearDialogEditLink"
      >
        <q-card style="width: 300px;border-radius:1rem">
          <q-card-section v-if="dialogEditLink.link.linkType === 'Estagiário'">
            <div class="text-center text-h6 q-mb-md">
              {{ dialogEditLink.link.linkType }}
            </div>
            <div class="q-mb-md" >
              <q-select
                v-model="dialogEditLink.link.selectedPastor"
                label="Pastor orientador"
                use-input
                @filter="getPastors"
                :options="pastorsOptions"
                outlined
                option-label="userName"
              />
            </div>
            <div class="q-mb-md" >
              <q-select
                v-model="dialogEditLink.link.selectedOrganism"
                label="Congregação"
                use-input
                @filter="getOrganismsList"
                :options="organismList"
                outlined
                option-label="nome"
              />
            </div>
            <div class="q-mb-sm">
              <q-input
                label="Data inicial"
                v-model="dialogEditLink.link.dates.initialDate"
                outlined
                mask="##/##/####"
              />
            </div>
            <div class="q-mb-sm">
              <q-input
                label="Data final"
                v-model="dialogEditLink.link.dates.finalDate"
                outlined
                mask="##/##/####"
              />
            </div>
            <div class="q-mb-sm">
              <q-input
                label="Prazo final"
                v-model="dialogEditLink.link.deadline"
                outlined
                mask="##/##/####"
                @update:model-value="verifyNoDeadline"
              />
            </div>
            <q-checkbox
              label="Prazo do chamado é indefinido"
              v-model="dialogEditLink.noDeadline"
              @update:model-value="changeDeadlineLinkStatus"
            />
          </q-card-section>
          <q-card-section
            v-if="dialogEditLink.link.linkType === 'Sem chamado'"
          >
            <div class="text-center text-h6 q-mb-md">
              {{ dialogEditLink.link.linkType }}
            </div>
            <div>
              <q-input
                label="Posição"
                v-model="dialogEditLink.link.position"
                outlined
                class="q-mb-sm"
              />
              <div class="q-mb-sm">
              <q-input
                label="Data inicial"
                v-model="dialogEditLink.link.dates.initialDate"
                outlined
                mask="##/##/####"
              />
            </div>
            <div class="q-mb-sm">
              <q-input
                label="Data final"
                v-model="dialogEditLink.link.dates.finalDate"
                outlined
                mask="##/##/####"
              />
            </div>
            <div class="q-mb-sm">
              <q-input
                label="Prazo final"
                v-model="dialogEditLink.link.deadline"
                outlined
                mask="##/##/####"
                @update:model-value="verifyNoDeadline"
              />
            </div>
            <q-checkbox
              label="Prazo do chamado é indefinido"
              v-model="dialogEditLink.noDeadline"
              @update:model-value="changeDeadlineLinkStatus"
            />
            </div>
          </q-card-section>
          <q-card-section v-if="dialogEditLink.link.linkType === 'Licença'">
            <div class="text-center text-h6 q-mb-md">
              {{ dialogEditLink.link.linkType }}
            </div>
            <div class="q-mb-sm">
              <q-select
                label="Motivo"
                :options="['Saúde', 'Estudos', 'Interesse', 'Outro']"
                v-model="dialogEditLink.link.reason"
                outlined
              />
            </div>
            <div class="q-mb-sm">
              <q-input
                label="Data inicial"
                v-model="dialogEditLink.link.dates.initialDate"
                outlined
                mask="##/##/####"
              />
            </div>
            <div class="q-mb-sm">
              <q-input
                label="Data final"
                v-model="dialogEditLink.link.dates.finalDate"
                outlined
                mask="##/##/####"
              />
            </div>
            <div class="q-mb-sm">
              <q-input
                label="Prazo final"
                v-model="dialogEditLink.link.deadline"
                @update:model-value="verifyNoDeadline"
                outlined
                mask="##/##/####"
              />
            </div>
            <q-checkbox
              label="Prazo do chamado é indefinido"
              v-model="dialogEditLink.noDeadline"
              @update:model-value="changeDeadlineLinkStatus"
            />
          </q-card-section>
          <q-card-section
            v-if="dialogEditLink.link.linkType === 'Cedido'"
          >
            <div class="text-center text-h6 q-mb-md">
              {{ dialogEditLink.link.linkType }}
            </div>
            <div class="q-mb-sm">
              <q-select
                label="Qual igreja"
                :options="['Outra denominação', 'Igreja irmã']"
                outlined
                v-model="dialogEditLink.link.denomination"
                @update:model-value="getOrganismsDenominationList"
              />
            </div>
            <div class="q-mb-sm">
              <q-select
                :options="dialogEditLink.organismsoptions"
                outlined
                option-label="organismName"
                v-model="dialogEditLink.link.selectedOrganism"
              />
            </div>
            <div class="q-mb-sm">
              <q-input
                label="Data inicial"
                v-model="dialogEditLink.link.dates.initialDate"
                outlined
                mask="##/##/####"
              />
            </div>
            <div class="q-mb-sm">
              <q-input
                label="Data final"
                v-model="dialogEditLink.link.dates.finalDate"
                outlined
                mask="##/##/####"
              />
            </div>
            <div class="q-mb-sm">
              <q-input
                label="Prazo final"
                v-model="dialogEditLink.link.deadline"
                @update:model-value="verifyNoDeadline"
                outlined
                mask="##/##/####"
              />
            </div>
            <q-checkbox
              label="Prazo do chamado é indefinido"
              v-model="dialogEditLink.noDeadline"
              @update:model-value="changeDeadlineLinkStatus"
            />
          </q-card-section>
          <q-card-section
            v-if="dialogEditLink.link.linkType === 'Aposentado'" 
          >
            <div class="text-center text-h6 q-mb-md">
              {{ dialogEditLink.link.linkType }}
            </div>
            <div class="q-mb-sm">
              <q-input
                label="Data inicial"
                v-model="dialogEditLink.link.dates.initialDate"
                outlined
                mask="##/##/####"
              />
            </div>
            <div class="q-mb-sm">
              <q-input
                label="Data final"
                v-model="dialogEditLink.link.dates.finalDate"
                outlined
                mask="##/##/####"
              />
            </div>
            <div class="q-mb-sm">
              <q-input
                label="Prazo final"
                v-model="dialogEditLink.link.deadline"
                @update:model-value="verifyNoDeadline"
                outlined
                mask="##/##/####"
              />
            </div>
            <q-checkbox
              label="Prazo do chamado é indefinido"
              v-model="dialogEditLink.noDeadline"
              @update:model-value="changeDeadlineLinkStatus"
            />
          </q-card-section>
          <q-card-section
            v-if="dialogEditLink.link.linkType === 'Estudante'" 
          >
            <div class="text-center text-h6 q-mb-md">
              {{ dialogEditLink.link.linkType }}
            </div>
            <div class="q-mb-sm">
              <q-select
                label="Finalidade"
                :options="['Intercâmbio', 'Pós-pastoral']"
                v-model="dialogEditLink.link.goal"
                outlined
              />
            </div>
            <div class="q-mb-sm">
              <q-input
                label="Local"
                outlined
                v-model="dialogEditLink.link.local"
              >
              </q-input>
            </div>
            <div class="q-mb-sm">
              <q-input
                label="Data inicial"
                v-model="dialogEditLink.link.dates.initialDate"
                outlined
                mask="##/##/####"
              />
            </div>
            <div class="q-mb-sm">
              <q-input
                label="Data final"
                v-model="dialogEditLink.link.dates.finalDate"
                outlined
                mask="##/##/####"
              />
            </div>
            <div class="q-mb-sm">
              <q-input
                label="Prazo final"
                v-model="dialogEditLink.link.deadline"
                @update:model-value="verifyNoDeadline"
                outlined
                mask="##/##/####"
              />
            </div>
            <q-checkbox
              label="Prazo do chamado é indefinido"
              v-model="dialogEditLink.noDeadline"
              @update:model-value="changeDeadlineLinkStatus"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              label="Voltar"
              color="primary"
              flat
              rounded
              unelevated
              no-caps
              @click="clearDialogEditLink"
            />
            <q-btn
              label="Confirmar"
              color="primary"
              rounded
              unelevated
              no-caps
              @click="confirmEditLink"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogRemoveLink.open"
      >
        <q-card style="width: 300px">
          <q-card-section class="text-center text-h6" >
            Deseja realmente inativar esse vínculo?
          </q-card-section>
          <q-card-section>
            <q-input
              outlined
              v-model="dialogRemoveLink.link.dates.finalDate"
              label="Data fim"
              mask="##/##/####"
            />
          </q-card-section>
          <q-card-actions align="center"   >
            <q-btn
              label="Cancelar"
              color="primary"
              no-caps
              rounded
              unelevated
              flat
              @click="clearDialogRemoveLink"
            />
            <q-btn
              label="Confirmar"
              color="primary"
              no-caps
              rounded
              unelevated
              @click="confirmRemoveLink"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogUserInfo.open"
      >
        <q-card 
          style="max-width: 1000px"
        >
          <PdfUserInfo
            :data="userData.userDataTabs"
            :userId="$route.query.userId"
            :userImage="userProfileImage"
            @closeDialog="closeDialogShowPdfInfo"
          />
        </q-card>
      </q-dialog>
      <DialogAddSocialNetwork
        :open="dialogAddSocialNetwork.open"
        :dataProp="dialogAddSocialNetwork.data"
        :type="dialogAddSocialNetwork.type"
        @confirm="confirmAddSocialNetwork"
        @closeDialog="clearDialogSocialNetwork"
      />
      <q-dialog
        v-model="dialogCallDetail.open"
      >
        <q-card style="border-radius:1rem;width: 500px">
          <q-card-section class="text-center text-h6">
            {{dialogCallDetail.data.status}} - {{dialogCallDetail.data.functionName}}
          </q-card-section>
          <q-card-section>
            <div>
              <strong>Organismo:</strong> {{dialogCallDetail.data.organismName}}
            </div>
            <div>
              <strong>Data inicial:</strong> {{ dialogCallDetail.data.dates.initialDate }}
            </div>
            <div>
              <strong>Data final:</strong> {{ dialogCallDetail.data.dates.finalDate }}
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              label="Voltar"
              color="primary"
              rounded
              no-caps
              unelevated
              @click="clearDialogCallDetail"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </q-page-container>
</template>

<script setup>
import CardSocialNetwork from '../../components/CardSocialNetwork.vue'
import PdfUserInfo from '../../components/PdfUserInfo.vue'
import DialogAddSocialNetwork from  '../../components/DialogAddSocialNetwork.vue'
import CardAddress from '../../components/CardAddress.vue'
import DialogAddAddress from '../../components/DialogAddress.vue'
import DialogPhoneMobileEmail from '../../components/DialogPhoneMobileEmail.vue'
import DialogAddActing from '../../components/DialogAddActing.vue'
import DialogOrganismDetail from '../../components/DialogOrganismDetail.vue'
import DialogMaritalStatus from '../../components/DialogMaritalStatus.vue'
import DialogAddPerson from '../../components/DialogAddPerson.vue'
import CardPhoneMobileEmail from '../../components/CardPhoneMobileEmail.vue'
import DialogAddStatus from '../../components/DialogAddStatus.vue'
import CardBankData from '../../components/CardBankData.vue'
import CardPerson from '../../components/CardPerson.vue'
import DialogAddPastoralStatus from '../../components/DialogAddPastoralStatus.vue'
import CardOrganism from '../../components/CardOrganism.vue'
import CardFormation from '../../components/CardFormation.vue'
import CardMaritalStatus from '../../components/CardMaritalStatus.vue'
import utils from '../../boot/utils'
import avatar from '../../assets/avatar.svg'
// import UserDetail from '../../components/UserDetail.vue'
// import UserDetail from '../../components/UserDetail.vue'
// import html2pdf from 'html2pdf.js';
</script>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: "UserDetail",
  data() {
    return {
      dialogUserInfo: {
        open: false
      },
      userCanEdit: false,
      dialogRemoveCall: {
        open: false,
        data: null,
        finalDate: ''
      },
      dialogActing: {
        open: false,
        organismCallerSelected: null,
        call: null,
        callId: null
      },
      dialogAddStatus: {
        open: false,
        functionId: null
      },
      dialogchangeUserType: {
        open: false,
        reason: '',
        date: ''
      },
      canUseSystem: null,
      selectIndex: null,
      tab: "",
      openDialogRemoveUser: false,
      canEdit: false,
      dateOfDead: '',
      isDeadbyDeath: false, 
      otherDead: false,
      tabTitles: "",
      userType: '',
      isSaving: false,
      newPhone: "",
      userTitleName: '',
      newAddress: "",
      newEmail: "",
      allPermissions: [],
      userPermissions: [],
      organismList: [],
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
      usersOptions: [],
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
      filiatedOrganismsList: [],
      userForms: {},
      userFormDialog: {
        formId: '',
        data: {},
        open: false,
      },
      callList: [],
      actingList: [],
      dialogLinkDetail: {
        open: false,
        orgData: {},
        orgFields: [],
        orgFunc: [],
        orgId: null
      },
      dialogRemoveUserFromFunction: {
        open: false,
        organismFunctionId: null,
        obsText: null,
        finalDate: null
      },
      dialogSwapUserFromFunction: {
        open: false,
        data: null,
        observation: null,
        finalDate: null,
        newUser: null
      },
      pastoralStatusTypes: null,
      organismsOptions: null,
      dialogAddPastoralStatus: {
        open: false,
        organism: null,
        initialDate: '',
        finalDate: '',
        status: null,
        subStatus: null,
        local: null
      },
      pastoralStatusData: null,
      inactiveStatus: null,
      statusData: null,
      undefinedCallee: false,
      organismCallerSelected: '',
      organismCalleeSelected: [],
      functions: [],
      dialogAddCallToPastor: {
        open: false,
        pastorSelected: null,
        functionType: '',
        selectedFunc: null,
        organismCallerSelected: null,
        organismAtuationSelected: null,
        ataKey: '', 
        userSelected: null, 
        sameOrganismCalled: false,
        userInstallation: null,
        installationDate: '',
        calleeDate: '',
        undefinedCallee: false,
        initialDate: '',
        action: '',
        subtype: ''
      },
      dialogDeletePastorFromFunction: {
        obsText: "",
        finalDate: "",
        functionUserId: "",
        ataKey: '',
        uninstallerUser: '',
        open: false,
        userData: {},
        type: ''
      },
      setReadOnlyOrganismCaller: false,
      setDisableOrganismCallerCheckbox: false,
      pastorsOptions: [],
      actingOrganismsList: [],
      dialogAddPerson: {
        open: false,
        fieldIndex: null,
        tabsIndex: null,
        selectedPerson: null,
        label: null
      },
      pastorsList: null,
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
      dialogAddMaritalStatus: {
        open:false,
        fieldIndex: null,
        tabsIndex: null,
        data: null
      },
      dialogPhoneMobileEmail: {
        open: false,
        type: '',
        label: '',
        hint: '',
        dataProp: null,
        fieldIndex: null,
        tabsIndex: null
      },
      dialogAddAddress: {
        open: false,
        fieldIndex: null,
        tabsIndex: null
      },
      otherOrganism: false,
      statusTree: null,
      dialogRemoveActing: {
        open: false,
        data: null,
        finalDate: ''
      },
      dialogEditCall: {
        open: false,
        data: null,
        selectedOrganism: null,
        noDeadline: false,
        disable: false,
      },
      dialogEditAct: {
        open: false,
        selectedOrganism: null,
        data: null
      },
      userIsAdm: null,
      legacyLinks: null,
      otherLinks: null,
      dialogEditLink:{
        open: false,
        link: null,
        selectedOrganism: null,
        selectedPastor: null,
        organismsoptions: [],
        noDeadline: null
      },
      dialogRemoveLink:{
        linkId: null,
        link: null,
        open: false
      },
      dialogCallDetail: {
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
    this.startView()
  },
  methods: {
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
    removeSocialNetwork(fieldIndex, tabsIndex, field, value, iValue) {
      this
        .userData
        .userDataTabs[tabsIndex]
        .fields[fieldIndex]
        .value
        .splice(iValue, 1)
    },
    verifyNoDeadline() {
      if (this.dialogEditLink.link.deadline !== '') {
        this.dialogEditLink.noDeadline = false
      }
    },
    changeDeadlineLinkStatus() {
      if (this.dialogEditLink.noDeadline) this.dialogEditLink.link.deadline = ''
    },
    clearDialogCallDetail() {
      this.dialogCallDetail.open = false
      this.dialogCallDetail.data = null
    },
    async openDialogCallDetail(link) {
      let callId = link.organismFunctionUserId
      const opt = {
        route: '/desktop/adm/getCallDetailByCallId',
        body: {
          callId
        }
      }
      let r = await useFetch(opt)
      if (r.error) return
      else {
        this.dialogCallDetail.data = r.data
        this.dialogCallDetail.open = true
      }
    },
    async confirmRemoveLink() {
      const opt = {
        route: '/desktop/adm/removeLink',
        body: {
          linkId: this.dialogRemoveLink.linkId,
          finalDate: this.dialogRemoveLink.link.dates.finalDate
        }
      }
      let r = await useFetch(opt)
      if (r.error) return
      this.clearDialogRemoveLink()
      this.startView()
    },
    clearDialogRemoveLink() {
      this.dialogRemoveLink = {
        linkId: null,
        link: null,
        open: false
      }
    },
    closeDialogShowPdfInfo() {
      this.dialogUserInfo.open = false
    },
    openDialogUserPdfInfo() {
      this.dialogUserInfo.open = true
    },
    openDialogremoveLink(link) {
      this.dialogRemoveLink.linkId = link.linkId
      this.dialogRemoveLink.link = link
      this.dialogRemoveLink.open = true
    },  
    async confirmEditLink() {
      const opt = {
        route: '/desktop/adm/confirmEditPastorLink',
        body: {
          link: this.dialogEditLink.link
        }
      }
      let r = await useFetch(opt)
      if (r.error) return
      else {
        this.clearDialogEditLink()
        this.startView()
      }
    },
    clearDialogEditLink() {
      this.dialogEditLink.open = false
      this.dialogEditLink.link = null
      this.dialogEditLink.organismsoptions = []
      this.dialogEditLink.selectedOrganism = null
      this.dialogEditLink.selectedPastor = null
    },
    async getOrganismsDenominationList() {
      this.dialogEditLink.link.organismName = ''
      this.dialogEditLink.link.organismId = ''
      this.dialogEditLink.link.selectedOrganism.organismId = ''
      this.dialogEditLink.link.selectedOrganism.organismName = ''
      if (this.dialogEditLink.link.denomination === 'Outra denominação') {
        const opt = {
          route: '/desktop/adm/getOtherDenomination'
        }
        let r = await useFetch(opt)
        if (r.error) return
        this.dialogEditLink.organismsoptions = r.data
      } else if (this.dialogEditLink.link.denomination === 'Igreja irmã') {
        const opt = {
          route: '/desktop/adm/getSisterChurch'
        }
        let r = await useFetch(opt)
        if (r.error) return
        this.dialogEditLink.organismsoptions = r.data
      }
    },
    editLink(link) {
      if (link.deadline) {
        this.dialogEditLink.noDeadline = false
      } else this.dialogEditLink.noDeadline = true
      this.dialogEditLink.open = true
      this.dialogEditLink.link = {...link}
      if (link.linkType === 'Cedido') {
        this.dialogEditLink.link.selectedOrganism = {
          organismName: link.organismName,
          organismId: link.organismId
        }
      } else if (link.linkType === 'Estagiário') {
        this.dialogEditLink.link.selectedOrganism = {
          nome: link.organismName,
          organismId: link.organismId
        }
        this.dialogEditLink.link.selectedPastor = {
          userName: link.pastorName,
          _id: link.pastorId
        }
      }
    },
    goToOrganismDetailFromTree(data) {
      this.$router.push('/admin/organismDetail?organismId=' + data.organismId)
    },
    clearDialogAddActing() {
      this.dialogActing = {
        open: false,
        organismCallerSelected: null,
        call: null,
        callId: null
      }
    },
    async confirmEditAct() {
      if (!this.dialogEditAct.selectedOrganism 
      || this.dialogEditAct.selectedOrganism ==='' 
      || this.dialogEditAct.data.dates.initialDate === '' 
      ) {
        this.$q.notify('Preencha todos os dados antes de contiuar')
        return
      }
      this.dialogEditAct.data.organismId = this.dialogEditAct.selectedOrganism.organismId
      this.dialogEditAct.data.organismName = this.dialogEditAct.selectedOrganism.nome
      const opt = {
        route: '/desktop/adm/editActing',
        body: {
          actData: this.dialogEditAct.data
        }
      }
      let r = await useFetch(opt)
      if (r.error) return
      this.clearDialogEditAct()
      this.startView()
    },
    clearDialogEditAct() {
      this.dialogEditAct = {
        open: false,
        selectedOrganism: null,
        data: null
      }
    },
    editAct(data) {
      this.dialogEditAct.data = {...data}
      this.dialogEditAct.selectedOrganism = {
        nome: data.organismName,
        organismId: data.organismId
      }
      this.dialogEditAct.open = true
    },
    changeDeadlineStatus() {
      if (this.dialogEditCall.noDeadline) {
        this.dialogEditCall.data.deadline = null
        this.dialogEditCall.disable = true
        this.dialogEditCall.noDeadline = true
      } else {
        this.dialogEditCall.noDeadline = false
        this.dialogEditCall.disable = false
      } 
    },
    async confirmEditCall() {
      if (!this.dialogEditCall.selectedOrganism 
      || this.dialogEditCall.selectedOrganism ==='' 
      || this.dialogEditCall.data.dates.initialDate === '' 
      || (!this.dialogEditCall.data.deadline && !this.dialogEditCall.noDeadline)) {
        this.$q.notify('Preencha todos os dados antes de contiuar')
        return
      }
      this.dialogEditCall.data.organismId = this.dialogEditCall.selectedOrganism.organismId
      this.dialogEditCall.data.organismName = this.dialogEditCall.selectedOrganism.nome
      const opt = {
        route: '/desktop/adm/editCallData',
        body: {
          callData: this.dialogEditCall.data
        }
      }
      let r = await useFetch(opt)
      if (r.error) return
      this.clearDialogEditCall()
      this.startView()
    },
    clearDialogEditCall() {
      this.dialogEditCall = {
        open: false,
        data: null,
        selectedOrganism: null
      }
    },
    editCall(data) {
      if (data.deadline) {
        this.dialogEditCall.noDeadline = false
      } else this.dialogEditCall.noDeadline = true
      this.dialogEditCall.data = {...data}
      this.dialogEditCall.selectedOrganism = {
        nome: data.organismName,
        organismId: data.organismId
      }
      if (!data.userInstallerData) {
        data.userInstaller = null
      } else if (data.userInstallerData && data.userInstallerData.userName !== '') {
        this.dialogEditCall.data.userInstaller = data.userInstallerData
      }
      if (!data.ataKeyInstallation) {
        data.ataKeyInstallation = ''
      }
      if (!data.ataKeyUninstallation) {
        data.ataKeyUninstallation = ''
      }
      if (!data.userUninstallerData) {
        data.userUninstallerData = null
      } else if (data.userUninstallerData && data.userUninstallerData.userName !== '') {
        this.dialogEditCall.data.userUninstaller = data.userUninstallerData
      }
      this.dialogEditCall.open = true
    },
    async confirmRemoveActing() {
      if (this.dialogRemoveActing.finalDate === '') {
        this.$q.notify('Preencha a data fim para prosseguir')
        return
      }
      const opt = {
        route: '/desktop/adm/inactivateActing',
        body: {
          actId: this.dialogRemoveActing.data.actId,
          finalDate: this.dialogRemoveActing.finalDate
        }
      }
      let r = await useFetch(opt)
      if (r.error) return
      this.clearDialogRemoveActing()
      this.startView()
    },
    clearDialogRemoveActing() {
      this.dialogRemoveActing = {
        open: false,
        data: null,
        finalDate: '' 
      }
    },
    removeAct(data) {
      this.dialogRemoveActing.data = data
      this.dialogRemoveActing.open = true
    },
    clearDialogACting() {
      this.dialogActing = {
        open: false,
        organismCallerSelected: null,
        call: null,
        callId: null
      }
    },
    async confirmRemoveCall() {
      if (this.dialogRemoveCall.finalDate === '') {
        this.$q.notify('Preencha a data fim para prosseguir.')
        return
      }
      const opt = {
        route: '/desktop/adm/inactivateCall',
        body: {
          callId: this.dialogRemoveCall.data.callId,
          finalDate: this.dialogRemoveCall.finalDate
        }
      }
      let r = await useFetch(opt)
      if (r.error) return
      this.clearDialogRemoveCall()
      this.startView()
    },
    clearDialogRemoveCall() {
      this.dialogRemoveCall = {
        open: false,
        data: null,
        finalDate: ''
      }
    },
    removeCall(data) {
      this.dialogRemoveCall.data = data
      this.dialogRemoveCall.open = true
    },  
    mountTree() {
      let tree = []
      this.callList.forEach((item, i) => {
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
          organismName: item.organismName,
          ataKeyInstallation: item.ataKeyInstallation ? item.ataKeyInstallation : '',
          ataKeyUninstallation: item.ataKeyUninstallation ? item.ataKeyUninstallation : '',
          userInstallerData: item.userInstallerData ? item.userInstallerData : null,
          userUninstallerData: item.userUninstallerData ? item.userUninstallerData : null
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
      this.statusTree = tree
    },
    async confirmAddActing(data) {
      data = data._value
      const opt = {
        route: '/desktop/adm/insertActingToCall',
        body: {
          data: data,
          callId: this.dialogActing.callId,
          userId: this.$route.query.userId
        }
      }
      let r = await useFetch(opt)
      if (r.error) return
      this.clearDialogACting()
      this.startView()
    },
    async startView () {
      const permStatus = await utils.getPermissionStatus('ADMIN')
      if (permStatus.data === 'onMaitenance') {
        this.$router.push('/maitenancePage')
        return
      }
      this.verifyIfHAsAdmPermission()
      this.getUserCanEditStatus()
      this.getStatusByUserId()
      // this.getUsersConfig()
      this.getUserDetailById();
      this.getPastoralStatusTypes()
    },
    async getStatusByUserId() {
      const opt = {
        route: '/desktop/adm/getStatusByUserId'
      }
      let r = await useFetch(opt)
      if (r.error) return
    },
    async verifyIfHAsAdmPermission() {
      const opt = {
        route: '/desktop/adm/verifyIfUserHasAdmPermission',
        body: {
          userId: this.$route.query.userId
        }
      }
      let r = await useFetch(opt)
      if (r.error) return
      this.userIsAdm = r.data
    },
    async confirmAddStatus(status, data) {
      const opt = {
        route: '/desktop/adm/insertPastorStatus',
        body: {
          status,
          data,
          functionId: this.dialogAddStatus.functionId
        }
      }
      let r = await useFetch(opt)
      if (r.error) return
      this.clearDialogAddStatus()
      this.startView()
    },
    clearDialogAddStatus() {
      this.dialogAddStatus.open = false
    },
    getUserCanEditStatus(){
      const opt = {
        route: '/desktop/users/getUserCanEditStatus'
      }
      useFetch(opt).then(r => {
        this.canEdit = r.data
      })
    },
    clearDialogChangeUserType() {
      this.dialogchangeUserType = {
        open: false,
        reason: '',
        date: ''
      }
    },
    async confirmChangeUserType() {
      if (this.dialogchangeUserType.reason === '' || this.dialogchangeUserType.date === '') {
        this.$q.notify('Preencha o motivo e a data para prosseguir')
        return
      }
      const opt = {
        route: '/desktop/adm/changeUserTypeFromPastorToUser',
        body: {
          userId: this.$route.query.userId,
          reason: this.dialogchangeUserType.reason,
          date: this.dialogchangeUserType.date
        }
      }
      let r = await useFetch(opt)
      if (r.error) return
      this.clearDialogChangeUserType()
      this.getUserDetailById()
    },
    editMaritalStatus(fieldIndex, tabsIndex, i) {
      let field = this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value[i].partner
      this.dialogAddMaritalStatus.open = true
      this.dialogAddMaritalStatus.data = field
    },
    clearDialogAddAddress() {
      this.dialogAddAddress = {
        open: false,
        fieldIndex: null,
        tabsIndex: null
      }
    },
    confirmAddAddress(value) {
      if (!this.userData.userDataTabs[this.dialogAddAddress.tabsIndex].fields[this.dialogAddAddress.fieldIndex].value) {
        this.userData.userDataTabs[this.dialogAddAddress.tabsIndex].fields[this.dialogAddAddress.fieldIndex].value = []
      }
      this.userData.userDataTabs[this.dialogAddAddress.tabsIndex].fields[this.dialogAddAddress.fieldIndex].value.push({
        cep: value.cep,
        city: value.city,
        complement: value.complement,
        number: value.number,
        state: value.state,
        street: value.street
      })
      this.clearDialogAddAddress()
    },
    clkOpenAddressDialog(fieldIndex, tabsIndex) {
      this.dialogAddAddress.open = true
      this.dialogAddAddress.fieldIndex = fieldIndex
      this.dialogAddAddress.tabsIndex = tabsIndex
    },
    clearDdialogAddPhoneEmail() {
      this.dialogPhoneMobileEmail = {
        open: false,
        type: '',
        label: '',
        hint: '',
        dataProp: null,
        fieldIndex: null,
        tabsIndex: null
      }
    },
    confirmAddPhoneEmail(value) {
      if (!this.userData.userDataTabs[this.dialogPhoneMobileEmail.tabsIndex].fields[this.dialogPhoneMobileEmail.fieldIndex].value) {
        this.userData.userDataTabs[this.dialogPhoneMobileEmail.tabsIndex].fields[this.dialogPhoneMobileEmail.fieldIndex].value = []
      }
      this.userData.userDataTabs[this.dialogPhoneMobileEmail.tabsIndex].fields[this.dialogPhoneMobileEmail.fieldIndex].value.push({
        allowPublication: value.allowPublication,
        type: value.type,
        value: value.value
      })
      this.clearDdialogAddPhoneEmail()
    },
    addDialogPhoneMobileEmail(fieldIndex, tabsIndex, field) {
      this.dialogPhoneMobileEmail.open = true
      this.dialogPhoneMobileEmail.fieldIndex = fieldIndex
      this.dialogPhoneMobileEmail.tabsIndex = tabsIndex
      this.dialogPhoneMobileEmail.type = field.type
    },
    clearDialogAddMaritalStatus() {
      this.dialogAddMaritalStatus.open = false,
      this.dialogAddMaritalStatus.fieldIndex = null,
      this.dialogAddMaritalStatus.tabsIndex = null,
      this.dialogAddMaritalStatus.data = null
    },
    async addMaritalStatus(value) {
      const opt = {
        route: '/desktop/adm/addMaritalRelation',
        body: {
          value: value,
          userId: this.$route.query.userId
        },
      }
      let r = await useFetch(opt)
      if (r.error) return
      this.getUserDetailById()
      this.clearDialogAddMaritalStatus()
    },
    clkAddMaritalStatus(fieldIndex, tabsIndex) {
      this.dialogAddMaritalStatus.fieldIndex = fieldIndex
      this.dialogAddMaritalStatus.tabsIndex = tabsIndex
      this.dialogAddMaritalStatus.data = this.userData
        .userDataTabs[tabsIndex]
        .fields[fieldIndex]
        .value
      this.dialogAddMaritalStatus.open = true
    },
    clearDialogAddPerson() {
      this.dialogAddPerson.open = false
      this.dialogAddPerson.fieldIndex = null
      this.dialogAddPerson.tabsIndex = null
      this.dialogAddPerson.selectedPerson = null
    },
    async confirmAddPerson(value) {
      let type
      if (this.dialogAddPerson.label === 'Pai' || this.dialogAddPerson.label === 'Mãe') {
        let gender
        if (this.dialogAddPerson.label === 'Pai') gender = 'M'
        else if (this.dialogAddPerson.label === 'Mãe') gender = 'F'
        const opt = {
          route: '/desktop/adm/addUserParentRelation',
          body: {
            parentId: value._id,
            childId: this.$route.query.userId,
            gender,
            type: 'parentalRelation',
            label: 'Pais'
          }
        }
        let r = await useFetch(opt)
        if (r.error) return
      } else if (this.dialogAddPerson.label === 'Filho(s)') {
        type = 'parentalRelation'
        const opt = {
          route: '/desktop/adm/addUserParentRelation',
          body: {
            childId: value._id,
            parentId: this.$route.query.userId,
            type,
            label: 'Filho(s)'
          }
        }
        let r = await useFetch(opt)
        if (r.error) return
      }
      this.clearDialogAddPerson()
      this.getUserDetailById()
    },
    clkOpenAddPersonDialog(fieldIndex, tabsIndex, label) {
      this.dialogAddPerson.fieldIndex = fieldIndex
      this.dialogAddPerson.tabsIndex = tabsIndex
      this.dialogAddPerson.label = label
      this.dialogAddPerson.open = true
    },
    removeAddress(fieldIndex, tabsIndex, i) {
      this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value.splice(i, 1)
    },
    removePhoneMobileEmail(fieldIndex, tabsIndex, field, value, iValue) { 
      this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value.splice(iValue, 1)
    },  
    async removePerson(fieldIndex, tabsIndex, i) {
      let field = this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value[i]
      let label = this.userData.userDataTabs[tabsIndex].fields[fieldIndex].label
      if (label === 'Pai' || label === 'Mãe') {
        const opt = {
          route: '/desktop/adm/removeParentalRelation',
          body: {
            relationId: field.relationId
          }
        }
        let r = await useFetch(opt)
        if (r.error) return
        this.getUserDetailById()
      } else if (label === 'Filho(s)') {
        const opt = {
          route: '/desktop/adm/removeUserChildRelation',
          body: {
            relationId: field.relationId
          }
        }
        let r = await useFetch(opt)
        if (r.error) return
        // this.updateUserData()
        this.getUserDetailById()
      }
    },
    async removeMaritalStatus(fieldIndex, tabsIndex, i) {
      let field = this.userData.userDataTabs[tabsIndex].fields[fieldIndex].value[i].partner
      const opt = {
        route: '/desktop/adm/removeMaritalRelation',
        body: {
          relationId: field.relationId
        }
      }
      let r = await useFetch(opt)
      if (r.error) return
      this.getUserDetailById()
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
          userFunctionId: this.dialogDeletePastorFromFunction.userData,
          desinstalationDate: this.dialogDeletePastorFromFunction.finalDate,
          obs: this.dialogDeletePastorFromFunction.obsText,
        },
      };
      if(this.dialogDeletePastorFromFunction.type === 'atuation'){
        opt.body.functionSubtype = 'atuacao'
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
          return
        }
        this.$q.notify({
          message: `${"Pastor removido da" + this.dialogDeletePastorFromFunction.type === 'atuation' ? 'Atuação' : 'Chamado' + "com sucesso!"}`
        });
        this.clearDialogAndFunctions();
        this.getUserDetailById();
      });
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
    validateAtaKeyFormat(value) {
      const regex = /^([A-Z]{3}-[A-Z]{3}-\d{3}-\d{4}-\d{2}-[a-z])$/;
      if (regex.test(value)) {
        return true;
      } else{
        return this.$q.notify('Formato inválido. Por favor, revise os dados digitados na chave-ata');
      }
    },
    undefinedCalleeFunction(){
      this.dialogAddCallToPastor.undefinedCallee ? this.dialogAddCallToPastor.undefinedCallee = false : this.dialogAddCallToPastor.calleeDate = ''
    },
    openDialogAddCallToPastor() {
      if ((this.callList && this.callList.length > 0) || (this.otherLinks && this.otherLinks.length > 0)) {
        this.$q.notify('Para adicionar um vínculo, é necessário que os outros estejam inativos.')
        return
      }
      this.dialogAddStatus.open = true
      // this.dialogAddCallToPastor.functionType = 'Pastor'
      // this.dialogAddCallToPastor.subtype = 'chamado'
      // this.dialogAddCallToPastor.open = true
      // this.dialogAddCallToPastor.action = 'add'
    },
    addAtuacaoToPastor(call) {
      this.dialogActing.organismCallerSelected = {
        nome: call.organismName,
        organismId: call.organismId,
      }
      this.dialogActing.open = true
      this.dialogActing.call = call
      this.dialogActing.callId = call.callId
    },
    clearDialogAndFunctions() {
      this.dialogRemoveUserFromFunction.finalDate = "";
      this.dialogRemoveUserFromFunction.functionUserId = "";
      this.dialogRemoveUserFromFunction.obsText = "";
      this.dialogRemoveUserFromFunction.data = {};
      this.dialogDeletePastorFromFunction.type = ''
      this.dialogRemoveUserFromFunction.finalDate = "";
      this.dialogAddCallToPastor.functionSelected = ''
      this.dialogRemoveUserFromFunction.functionUserId = "";
      this.dialogRemoveUserFromFunction.open = false;
      this.dialogAddCallToPastor.open = false;
      this.dialogAddCallToPastor.initialDate = '',
      this.dialogAddCallToPastor.functionType = '',
      this.dialogAddCallToPastor.open = false,
      this.dialogAddCallToPastor.organismAtuationSelected = null
      this.dialogAddCallToPastor.organismCallerSelected = null
      this.dialogAddCallToPastor.open = false
      this.dialogAddCallToPastor.subtype = ''
      this.dialogAddCallToPastor.installationDate = ''
      this.dialogAddCallToPastor.calleeDate = ''
      this.dialogAddCallToPastor.ataKey = ''
      this.dialogAddCallToPastor.userInstallation = ''
      this.dialogAddCallToPastor.action = ''
      this.dialogAddCallToPastor.selectedFunc = null,
      this.dialogDeletePastorFromFunction.open = false
      this.dialogDeletePastorFromFunction.obsText = ''
      this.dialogDeletePastorFromFunction.finalDate = ''
      this.dialogDeletePastorFromFunction.userData = {}
      this.dialogDeletePastorFromFunction.uninstallerUser = ''
      this.dialogAddCallToPastor.userSelected = null
      this.dialogAddCallToPastor.sameOrganismCalled = false
      this.dialogAddCallToPastor.undefinedCallee = false
      this.setReadOnlyOrganismCaller = false
      this.setDisableOrganismCallerCheckbox = false
    },
    changeOrganismCaller(){
      this.dialogAddCallToPastor.sameOrganismCalled === true ? this.dialogAddCallToPastor.organismAtuationSelected = [] : 
      this.dialogAddCallToPastor.organismAtuationSelected = this.dialogAddCallToPastor.organismCallerSelected
    },
    linkPastorToFunction() {
      this.dialogAddCallToPastor.open = true;
    },
    async getActingOptions() {
      if (!this.dialogAddCallToPastor.organismCallerSelected.organismId) return
      const callerId = this.dialogAddCallToPastor.organismCallerSelected.organismId
      const opt = {
        route: '/desktop/adm/getActingOrganismsByParishId',
        body: {
          callerId
        }
      }
      let r = await useFetch(opt)
      if (r.error) return
      this.actingOrganismsList = r.data
    },
    getOrganismDetailD() {
      this.getActingOptions()
      if (!this.dialogAddCallToPastor.organismCallerSelected.organismId) return
      const organismIdSelected = this.dialogAddCallToPastor.organismCallerSelected.organismId
      const opt = {
        route: "/desktop/adm/getOrganismDetailById",
        body: {
          organismId: organismIdSelected,
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.functions = r.data.functions
          for (const func of this.functions) {
            if (func.functionName && func.functionName.toLowerCase() === this.dialogAddCallToPastor.functionType.toLowerCase()) {
              this.dialogAddCallToPastor.selectedfunc = func.functionId;
              break;
            }
          }
        }
      });
    },
    InactivateUser(){
      if (this.isDeadbyDeath===true && this.isDeadbyDeath){
        if (!this.dateOfDead || this.dateOfDead===''){
          return this.$q.notify('insira a data de falecimento!')
        }
      }
      const opt = {
        route: '/desktop/adm/inactivateUserWhenDead',
        body: {
          userId: this.$route.query.userId,
        }
      } 
      if (this.isDeadbyDeath===true && this.isDeadbyDeath){
        opt.body.date = this.dateOfDead
      }
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.$q.notify('Usuário inativo com sucesso!')
          this.openDialogRemoveUser = false
          this.openDialogInactivateWhenDead = false
        } 
      })
    },
    async addUserToFunction() {
      if (this.dialogAddCallToPastor.subtype === 'atuacao') {
        if (!this.dialogAddCallToPastor.organismCallerSelected.organismId || 
            (!this.dialogAddCallToPastor.organismAtuationSelected.organismId && 
            !this.dialogAddCallToPastor.sameOrganismCalled) || 
          this.dialogAddCallToPastor.installationDate === '') {
          this.$q.notify('Preencha todos os dados para continuar');
          return;
        }
        const opt = {
          route: "/desktop/adm/addUserToFunction",
          body: {
            organismFunctionId: this.dialogAddCallToPastor.selectedfunc,
            userIdMongo: this.$route.query.userId,
            dates: {
              initialDate: this.dialogAddCallToPastor.installationDate
            }
          }
        }
        opt.body.organismCallerId = this.dialogAddCallToPastor.organismCallerSelected.organismId
        let calledList = []
        await this.dialogAddCallToPastor.organismAtuationSelected.forEach((org) => {
          calledList.push({orgId: org.organismId})
        })
        opt.body.organismCalledId = calledList
        this.$q.loading.show()
        let r = await useFetch(opt)
        if (r.error) {
          this.$q.notify(r.errorMessage)
          this.functions[selectedFuncIndex].users = []
          return
        } else {
          this.$q.notify('Usuário inserido na função!')
          this.getUserDetailById()  
          this.clearDialogAndFunctions();
          return
        }
      }


      if(
        (this.dialogAddCallToPastor.calleeDate === '' && !this.dialogAddCallToPastor.undefinedCallee) ||
        !this.dialogAddCallToPastor.organismCallerSelected ||
        !this.dialogAddCallToPastor.organismAtuationSelected
      ){
        this.$q.notify("Preencha prazo do chamado e organismo que atende e quem chamou");
        return;
      }

      const opt = {
        route: "/desktop/adm/addUserToFunction",
        body: {
          organismFunctionId: this.dialogAddCallToPastor.selectedfunc,
          userIdMongo: this.$route.query.userId,
          dates: {
            initialDate: this.dialogAddCallToPastor.installationDate
          }
        }
      };
      if(this.dialogAddCallToPastor.functionType === 'Pastor'){
        this.dialogAddCallToPastor.subtype === 'chamado' ? opt.body.subtype = 'chamado' : opt.body.subtype = 'atuacao'
        opt.body.organismCallerId = this.dialogAddCallToPastor.organismCallerSelected.organismId
        let calledList = []
        await this.dialogAddCallToPastor.organismAtuationSelected.forEach((org) => {
          calledList.push({orgId: org.organismId})
        })
        opt.body.organismCalledId = calledList,
        opt.body.ataKey = this.dialogAddCallToPastor.ataKey ? this.dialogAddCallToPastor.ataKey : ''
        opt.body.installation = {
          date: this.dialogAddCallToPastor.installationDate ? this.dialogAddCallToPastor.installationDate : null,
        }
        if (this.dialogAddCallToPastor.userInstallation && this.dialogAddCallToPastor.userInstallation._id) {
          opt.body.installation.userIdInstallation = this.dialogAddCallToPastor.userInstallation._id
        } else {
          opt.body.installation.userIdInstallation = null
        }
        opt.body.call = {
          finalDate: this.dialogAddCallToPastor.undefinedCallee ? 'undefined' : this.dialogAddCallToPastor.calleeDate
        }
      }
      this.$q.loading.show()
      let r = await useFetch(opt)
      if (r.error) {
        this.$q.notify(r.errorMessage)
        this.functions[selectedFuncIndex].users = []
        return
      } else {
        this.$q.notify('Usuário inserido na função!')
        this.getUserDetailById()  
        this.clearDialogAndFunctions();
      }
    },
    verifyLinks() {
      let congregationLinks = []
      let parishLinks = []
      if (this.userLinks && this.userLinks.length === 2) {
        this.userLinks.forEach((link, i) => {
          if (link.organismConfigName === 'Distrito') {
            this.userLinks.splice(i, 1)
          }
          if (link.organismConfigName === 'Congregação') {
            congregationLinks.push({
              index: i
            })
          }
          if (link.organismConfigName === 'Paróquia') {
            parishLinks.push({
              index: i
            })
          }
          if (congregationLinks.length > 0) {
            if (parishLinks.length > 0) {
              parishLinks.forEach((pl) => {
                this.userLinks.splice(pl.index, 1)
              })
            }
          }
        })
      }
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
          route: '/desktop/adm/updateUserPastoralStatus',
          body: {
            userId: this.$route.query.userId,
            initialDate: initialDate,
            finalDate: finalDate,
            organismId: organism._id,
            statusId: status._id,
            subStatusId: subStatus._id,
            localId: local._id,
            statusId: editId
          }
        }
        useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente.')
          return
        } else {
          this.$q.notify('Status atualizado com sucesso')
          this.getUserDetailById()
          this.clearDialogAddPastoralStatus()
        }
      })
      }
      const opt = {
        route: '/desktop/adm/createPastoralStatus',
        body: {
          userId: this.$route.query.userId,
          initialDate: initialDate,
          finalDate: finalDate,
          organismId: organism._id,
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
          this.getUserDetailById()
          this.clearDialogAddPastoralStatus()
        }
      })
    },
    verifyInactiveStatus() {
      this.inactiveStatus = []
      let activeStatus = []
      if (this.pastoralStatusData && this.pastoralStatusData.length > 0) {
        this.pastoralStatusData.forEach((status) => {
          if (status.dates.finalDate && status.dates.finalDate !== '') {
            this.inactiveStatus.push(status)
          } else if (!status.dates.finalDate || status.dates.finalDate === "") {
            activeStatus.push(status)
            this.pastoralStatusData = activeStatus
          }
        })
      }
    },
    clkConfirmAddPastoralStatus () {
      if (!this.dialogAddPastoralStatus.organism
          || !this.dialogAddPastoralStatus.initialDate
          || !this.dialogAddPastoralStatus.status
          || !this.dialogAddPastoralStatus.subStatus
          || !this.dialogAddPastoralStatus.local
      ) {
        this.$q.notify("Preencha todos os campos antes de confirmar")
        return
      } else {
        const opt = {
          route: '/desktop/adm/createPastoralStatus',
          body: {
            userId: this.$route.query.userId,
            initialDate: this.dialogAddPastoralStatus.initialDate,
            finalDate: this.dialogAddPastoralStatus.finalDate,
            organismId: this.dialogAddPastoralStatus.organism._id,
            statusId: this.dialogAddPastoralStatus.status._id,
            subStatusId: this.dialogAddPastoralStatus.subStatus._id,
            localId: this.dialogAddPastoralStatus.local._id
          }
        }
        useFetch(opt).then((r) => {
          if (r.error) {
            this.$q.notify('Ocorreu um erro, tente novamente.')
            return
          } else {
            this.$q.notify('Status adicionado com sucesso')
            this.getUserDetailById()
            this.clearDialogAddPastoralStatus()
          }
        })
      }
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
    getOrganisms (val, update, abort) {
      if(val.length < 3) {
        this.$q.notify('Digite no mínimo 3 caracteres')
        abort()
        return
      }
      const opt = {
        route: '/desktop/adm/getOrganismsListInUser',
        body: {
          searchString: val,
          isActive: 1,
          page: 1,
          rowsPerPage: 50
        }
      }
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if(r.error){ this.$q.notify(r.errorMessage) }

        update(() => {
          this.organismsOptions = r.data.list;
        })
      });
    },
    clearDialogAddPastoralStatus () {
      this.dialogAddPastoralStatus.open = false
    },
    addPastoralStatus() {
      this.dialogAddPastoralStatus.open = true
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
    updateCanEdit(status){
      let  canEdit = true
      if (status) {
        canEdit = false
      }
      const opt = {
        route: '/desktop/adm/updateCanEdit',
        body: {
          userId : this.$route.query.userId,
          canEdit: canEdit
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente')
        } else {
          this.$q.notify('Status de acesso alterado')
          this.getUserDetailById()
        }
      })
    },
    updateCanUseSystem (status) {
      const opt = {
        route: '/desktop/adm/updateCanUseSystem',
        body: {
          userId : this.$route.query.userId,
          update: status
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente')
        } else {
          this.$q.notify('Status de acesso alterado')
          this.getUserDetailById()
        }
      })
    },
    routeToDetail() {
      this.$router.push('/admin/organismDetail?organismId=' + this.dialogLinkDetail.orgId)
    },
    closeDialogOrganismDetail() {
      this.dialogLinkDetail.open = false
    },
    updateUserData() {
      const opt = {
        route: '/desktop/adm/updateUserData',
        body: {
          userDataTabs: this.userData.userDataTabs,
          userId: this.$route.query.userId,
          canEdit: this.canEdit
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente.')
        } else {
          this.$q.notify('Dados atualizados.')
          this.getUserDetailById()
        }
      })
    },
    clkConfirmSwapUser() {
      const organismFunctionUserId = this.dialogSwapUserFromFunction.data._id
      const finalDate = this.dialogSwapUserFromFunction.finalDate
      const newUser = this.dialogSwapUserFromFunction.newUser
      const observation = this.dialogSwapUserFromFunction.observation
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
          this.getUserDetailById()
        }
      })
    },
    clearDialogSwapData(){
      this.dialogSwapUserFromFunction.open = false
      this.dialogSwapUserFromFunction.data = null
      this.dialogSwapUserFromFunction.observation = null
      this.dialogSwapUserFromFunction.finalDate = null
      this.dialogSwapUserFromFunction.newUser = null
    },
    getPastors(val, update, abort) {
      if(val.length < 3) {
        this.$q.notify('Digite no mínimo 3 caracteres')
        abort()
        return
      }
      const opt = {
        route: "/desktop/adm/getPastores",
        body: {
          searchString: val,
          isActive: 1,
          page: 1,
          rowsPerPage: 50
        }
      }
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if(r.error){ this.$q.notify(r.errorMessage) }

        update(() => {
          this.pastorsOptions = r.data.list;
        })
      });
    },
    getUsers(val, update, abort) {
      if(val.length < 3) {
        this.$q.notify('Digite no mínimo 3 caracteres')
        abort()
        return
      }
      const opt = {
        route: "/desktop/adm/getUsers",
        body: {
          searchString: val,
          isActive: 1,
          page: 1,
          rowsPerPage: 50
        }
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
    swapUserFromFunction(link) {
      this.dialogSwapUserFromFunction.data = link
      this.dialogSwapUserFromFunction.open = true
    },
    removeUserFromFunction (link) {
      this.dialogRemoveUserFromFunction.open = true
      this.dialogRemoveUserFromFunction.organismFunctionUserId = link.organismFunctionUserId
    },
    pushToLinkDetail() {
      this.$router.push('/admin/organismDetail?organismId=' + this.dialogLinkDetail.data._id)
    },
    clearLinkDialog() {
      this.dialogLinkDetail.open = false,
      this.dialogLinkDetail.data = null
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
          this.dialogLinkDetail.orgData = r.data.organismData
          this.dialogLinkDetail.orgFields = r.data.organismData.fields
          this.dialogLinkDetail.orgFunc = r.data.functions
          this.dialogLinkDetail.orgId = r.data._id
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
        const userConfig = await this.getUsersConfig(r.data.userType)
        if (userConfig.error) {
          this.$q.notify("Ocorreu um erro, tente novamente");
          return
        }
        console.log(userConfig, 'caralho caralho caralho caralho carralho caralho racalho')
        if (r.data && r.data.userLinksToOrganisms && r.data.userLinksToOrganisms.links && r.data.userLinksToOrganisms.links.length > 0) {
          let links = r.data.userLinksToOrganisms.links
          links.forEach((link) => {
            if (link.functionSubtype === 'chamado') {
              this.callList.push(link)
            } 
          })
        }
        if (r.data && r.data.userLinksToOrganisms && r.data.userLinksToOrganisms.otherLinks && r.data.userLinksToOrganisms.otherLinks.length > 0) {
          this.otherLinks = r.data.userLinksToOrganisms.otherLinks
        }
        this.otherLinks = r.data.userLinksToOrganisms.otherLinks
        this.userCanEdit = r.data.canEdit
        this.callList = r.data.userLinksToOrganisms.links
        // this.userLinks = r.data.userLinksToOrganisms.data
        this.userData = userConfig.data
        this.userType = r.data.userType
        this.canUseSystem = r.data.canUseSystem
        if (r.data.pastoralStatus && r.data.pastoralStatus.data) {
          this.pastoralStatusData = r.data.pastoralStatus.data
        }
        if (r.data.legacyLinks) {
          this.legacyLinks = r.data.legacyLinks
        }
        this.userProfileImage = r.data.profileImage
        // this.tab = r.data.userDataTabs[0].tabValue
        this.verifyLinks()
        this.mountUserData(r.data)
        this.verifyInactiveStatus()
        this.$q.loading.hide();
        this.mountTree()
      });
    },
    mountUserData (userDetail) {
      console.log(this.userData, 'console 1')
      console.log(this.userData.userDataTabs, 'console 2')
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
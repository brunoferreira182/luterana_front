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

          <div class="text-subtitle1" v-if="canUseSystem">
            Acesso ao sistema: 
            <q-badge color="green">Sim</q-badge>
            <q-btn
              icon="sync"
              color="primary"
              rounded
              size="9px"
              flat
              @click="updateCanUseSystem(false)"
            >
              <q-tooltip>Alterar status de acesso</q-tooltip>
            </q-btn>
          </div>
          <div class="text-subtitle1" v-if="!canUseSystem">
            Acesso ao sistema: 
            <q-badge color="red">Não</q-badge>
            <q-btn
              icon="sync"
              color="primary"
              rounded
              size="9px"
              flat
              @click="updateCanUseSystem(true)"
            >
              <q-tooltip>Alterar status de acesso</q-tooltip>
            </q-btn>
          </div>
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
            label="Atualizar email"
            @click="updateUserEmail"
          />
        </div>
      </div>
      <q-separator class="q-mx-md"/>
      <div v-if="userData && userData.userDataTabs">
        <div>
          <div class="text-h6 q-ma-sm q-ml-md">
            Vínculos:
          </div>
          <q-list v-if="userLinks && userLinks.length > 0">
            <q-item
              clickable
              v-for="link in userLinks"
              :key="link"
              style="border-radius: 1rem;"
              class="bg-grey-3 q-ma-sm q-mx-md"
            >
              <q-item-section class="cursor-pointer" @click="goToOrganismDetail(link.organismId)">
                <q-item-label class="text-subtitle1"> <strong>{{ link.organismName }} - {{ link.organismConfigName }}</strong></q-item-label>
                <q-item-label v-if="link.organismCity && link.organismCity.city"><strong>Cidade: </strong>{{ link.organismCity.city }}</q-item-label>
                <q-item-label><strong>Função: </strong>{{ link.functionConfigName }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label>
                  <q-btn
                    icon="delete"
                    color="red"
                    round
                    @click="removeUserFromFunction(link)"
                    flat
                  >
                    <q-tooltip>Remover usuário</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="refresh"
                    color="primary"
                    round
                    @click="swapUserFromFunction(link)"
                    flat
                  >
                    <q-tooltip>Trocar por outro usuário</q-tooltip>
                  </q-btn>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-list v-else>
            <q-item>
              Nenhum vínculo criado
            </q-item>
          </q-list>
        </div>
        <q-separator class="q-mx-md"/>
        <div class="text-h6 q-ma-sm q-ml-md">
          Histórico pastoral:
          <q-btn
            icon="add"
            color="primary"
            flat
            @click="addPastoralStatus"
          >
            <q-tooltip>Adicionar histórico</q-tooltip>
          </q-btn>
        </div>
        <div v-if="pastoralStatusData">
          <q-list>
            <q-item 
              v-for="status in pastoralStatusData"
              :key="status"
              class="bg-grey-3 q-ma-sm q-mx-md"
              style="border-radius: 1rem;"
            >
              <q-item-section>
                <q-item-label lines="1" class="text-capitalize">
                  <strong>Status:</strong> {{ status.pastoralStatusData.status.label }}
                </q-item-label>
                <q-item-label lines="2" class="text-capitalize">
                  <strong>Sub-status:</strong> {{ status.pastoralStatusData.subStatus.label }}
                </q-item-label>
                <q-item-label lines="3" class="text-capitalize">
                  <strong>Local:</strong> {{ status.pastoralStatusData.local.label }}
                </q-item-label>
                <q-item-label lines="4">
                  <strong>{{ status.organismData.name }} - {{ status.organismData.config }}</strong>
                </q-item-label>
                <q-item-label lines="5">
                  <div>
                    <strong>Data inicial:</strong> {{ status.dates.initialDate }}
                  </div>
                  <div v-if="status.dates.finalDate && status.dates.finalDate !== '' ">
                    <strong>Data Final:</strong> {{ status.dates.finalDate }}
                  </div>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label>
                  <q-btn 
                    color="primary" 
                    flat 
                    round
                    icon="edit" 
                    rounded
                    @click="editStatus(status)"
                  >
                    <q-tooltip>Editar status</q-tooltip>
                  </q-btn>
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item 
              v-for="status in inactiveStatus"
              :key="status"
              class="bg-grey-3 q-ma-sm q-mx-md q-mb-sm"
              style="border-radius: 1rem;"
            >
              <q-item-section>
                <q-item-label lines="1" class="text-capitalize">
                  <strong>Status:</strong> {{ status.pastoralStatusData.status.label }}
                </q-item-label>
                <q-item-label lines="2" class="text-capitalize">
                  <strong>Sub-status:</strong> {{ status.pastoralStatusData.subStatus.label }}
                </q-item-label>
                <q-item-label lines="3" class="text-capitalize">
                  <strong>Local:</strong> {{ status.pastoralStatusData.local.label }}
                </q-item-label>
                <q-item-label lines="4">
                  <strong>{{ status.organismData.name }} - {{ status.organismData.config }}</strong>
                </q-item-label>
                <q-item-label lines="5">
                  <div>
                    <strong>Data inicial:</strong> {{ status.dates.initialDate }}
                  </div>
                  <div v-if="status.dates.finalDate && status.dates.finalDate !== '' ">
                    <strong>Data Final:</strong> {{ status.dates.finalDate }}
                  </div>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
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
                                @click="addDoubleSelection(i, fieldIndex)"
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
                              v-if="field.multiple || !field.value || field.value ==='' || field.value.length === 0"
                              @click="clkOpenAddOrganismDialog(fieldIndex, i)"
                              :disable="!tabs.onlyAdm"
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
                            :disable="!tabs.onlyAdm"
                          />
                          <CardAddress
                            :data="field.value"
                            :fieldIndex="fieldIndex"
                            :tabsIndex="i"
                            :disableButtons="!tabs.onlyAdm"
                          />
                        </div>
                        <div v-if="field.type.type === 'person'">
                          <div v-if="field.value && field.value.length > 0">
                            <div class="text-body">{{ field.label }}</div>
                            <CardPerson
                              :data="field"
                              :fieldIndex="fieldIndex"
                              :tabsIndex="i"
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
                            @click="clkOpenAddPersonDialog(fieldIndex, i)"
                            :disable="!tabs.onlyAdm"
                          />
                        </div>
                        <div v-if="field.type.type === 'maritalStatus'">
                          <div v-if="field.value && field.value.length > 0">
                            <div class="text-body">{{ field.label }}</div>
                            <CardMaritalStatus
                              :data="field.value"
                              :fieldIndex="fieldIndex"
                              :tabsIndex="i"
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
                            @click="clkAddMaritalStatus(fieldIndex, i)"
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
                            @click="clkAddBankData(fieldIndex, i)"
                            icon="add"
                            :disable="!tabs.onlyAdm"
                          />
                          <CardBankData
                            :data="field"
                            :fieldIndex="fieldIndex"
                            :tabsIndex="i"
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
                            @click="addPhoneMobileEmail(fieldIndex, i, field)"
                            class="q-mt-xs"
                            :disable="!tabs.onlyAdm"
                          />
                          <CardPhoneMobileEmail
                            :data="field.value"
                            :fieldIndex="fieldIndex"
                            :tabsIndex="i"
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
                            class="q-mt-xs"
                            :disable="!tabs.onlyAdm"
                          />
                          <CardFormation
                            :data="field"
                            :fieldIndex="fieldIndex"
                            :tabsIndex="i"
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


      <!-- <q-dialog v-model="dialogShowLinks.open">
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
              >
                <q-item-section class="cursor-pointer" @click="goToOrganismDetail(link.organismId)">
                  <q-item-label class="text-subtitle1"> {{ link.organismName }}</q-item-label>
                  <q-item-label>Função: {{ link.functionConfigName }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>
                  <q-btn
                    icon="delete"
                    color="red"
                    round
                    @click="removeUserFromFunction(link)"
                    flat
                  >
                    <q-tooltip>Remover usuário</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="refresh"
                    color="primary"
                    round
                    @click="swapUserFromFunction(link)"
                    flat
                  >
                    <q-tooltip>Trocar por outro usuário</q-tooltip>
                  </q-btn>
                  </q-item-label>
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
      </q-dialog> -->
      <q-dialog v-model="dialogRemoveUserFromFunction.open">
        <q-card style="border-radius: 1rem">
          <q-card-section>
            <div class="text-h6 text-center">Confirma?</div>
            <div>O usuário será removido da função</div>
          </q-card-section>
          <q-card-section align="center" class="q-gutter-sm">
            <q-input
              filled
              label="Observação"
              v-model="dialogRemoveUserFromFunction.obsText"
              hint="Informe o motivo"
            />
            <q-input
              filled
              type="date"
              label="Data final"
              v-model="dialogRemoveUserFromFunction.finalDate"
              hint="Informe a data final de ocupação da função"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Voltar"
              no-caps
              rounded
              color="primary"
              @click="dialogRemoveUserFromFunction.open = false"
            />
            <q-btn
              label="Confirma"
              no-caps
              rounded
              color="primary"
              @click="clkConfirmRemoveUserFromFunction"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

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
      <!-- <q-dialog
        v-model="dialogAddPastoralStatus.open"
        @hide="clearDialogAddPastoralStatus"
      >
        <q-card style="border-radius: 1rem; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">
              Adicionar status pastoral: 
            </div>
          </q-card-section>
          <q-card-section>
            <strong>
              Selecione o status:
            </strong>
            <q-select
              class="q-pa-sm"
              outlined
              use-input
              label="Status"
              :option-label="(item) => item.label"
              v-model="dialogAddPastoralStatus.status"
              :options="pastoralStatusTypes.statusTypes"
              :loading="false"
              :option-value="(item) => item._id"
            />
            <strong>
              Selecione o sub-status:
            </strong>
            <q-select
              class="q-pa-sm"
              outlined
              use-input
              label="Sub-status"
              :option-label="(item) => item.label"
              v-model="dialogAddPastoralStatus.subStatus"
              :options="pastoralStatusTypes.subStatusTypes"
              :loading="false"
              :option-value="(item) => item._id"
            />
            <div>
              <strong>
                Selecione o local:
              </strong>
              <q-select
                class="q-pa-sm"
                outlined
                use-input
                label="Local"
                :option-label="(item) => item.label"
                v-model="dialogAddPastoralStatus.local"
                :options="pastoralStatusTypes.localStatusTypes"
                :loading="false"
                :option-value="(item) => item._id"
              />
            </div>
            <strong>
              Selecione o organismo:
            </strong>
            <q-select
              class="q-pa-sm"
              outlined
              use-input
              label="Nome do organismo"
              :option-label="(item) => item.name"
              v-model="dialogAddPastoralStatus.organism"
              :options="organismsOptions"
              @filter="getOrganisms"
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
            </q-select>
            <strong>
              Datas:
            </strong>
            <div class="row">
              <q-input 
                type="date" 
                outlined 
                class="col-6 q-pa-sm" 
                label="Ínicio"
                v-model="dialogAddPastoralStatus.initialDate"
              />
              <q-input 
                type="date" 
                outlined 
                v-model="dialogAddPastoralStatus.finalDate"
                class="col-6 q-pa-sm"
                label="Fim"
              />
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              no-caps
              label="Sair"
              flat
              @click="clearDialogAddPastoralStatus"
              color="primary"
            />
            <q-btn
              no-caps
              label="Confirmar"
              unelevated
              rounded
              @click="clkConfirmAddPastoralStatus"
              color="primary"
            />
          </q-card-actions>
        </q-card>
      </q-dialog> -->
    </q-page>
  </q-page-container>
</template>

<script setup>
import CardAddress from '../../components/CardAddress.vue'
import DialogOrganismDetail from '../../components/DialogOrganismDetail.vue';
import CardPhoneMobileEmail from '../../components/CardPhoneMobileEmail.vue'
import CardBankData from '../../components/CardBankData.vue'
import CardPerson from '../../components/CardPerson.vue'
import DialogAddPastoralStatus from '../../components/DialogAddPastoralStatus.vue'
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
      canUseSystem: null,
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
      userForms: {},
      userFormDialog: {
        formId: '',
        data: {},
        open: false,
      },
      userLinks: null,
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
      statusData: null
    };
  },
  mounted() {
    this.$q.loading.hide();
    this.chkVisionSelected()
  },
  beforeMount() {
    // this.getUsersConfig()
    this.getUserDetailById();
    this.getPastoralStatusTypes()
  },
  methods: {
    verifyLinks() {
      if (this.userLinks && this.userLinks.length === 2){
        this.userLinks.forEach((link, i) => {
          if (link.organismConfigName === 'Paróquia')
          this.userLinks.splice(i, 1)
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
      this.pastoralStatusData.forEach((status) => {
        if (status.dates.finalDate && status.dates.finalDate !== '') {
          this.inactiveStatus.push(status)
        } else if (!status.dates.finalDate || status.dates.finalDate === "") {
          activeStatus.push(status)
          this.pastoralStatusData = activeStatus
        }
      })
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
    getOrganisms (val, update, abort) {
      console.log(val)
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
    updateUserEmail() {
      const opt = {
        route: '/desktop/adm/updateUserEmail',
        body: {
          userDataTabs: this.userData.userDataTabs,
          userId: this.$route.query.userId
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente.')
        } else {
          this.$q.notify('Email atualizado.')
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
      console.log()
      this.dialogSwapUserFromFunction.open = true
    },
    clkConfirmRemoveUserFromFunction () {
      if (
        this.dialogRemoveUserFromFunction.obsText === "" ||
        this.dialogRemoveUserFromFunction.finalDate === ""
      ) {
        this.$q.notify("Preencha observação e data final para prosseguir!");
        return;
      }
      const opt = {
        route: "/desktop/adm/inactivateUserFromFunction",
        body: {
          userFunctionId: this.dialogRemoveUserFromFunction.organismFunctionUserId,
          finalDate: this.dialogRemoveUserFromFunction.finalDate,
          obsText: this.dialogRemoveUserFromFunction.obsText,
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
          return
        }
        this.getUserDetailById()
        this.$q.notify("Usuário removido");
        this.dialogRemoveUserFromFunction.open = false
      });
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
        this.$q.loading.show();
        const userConfig = await this.getUsersConfig(r.data.userType)
        this.$q.loading.hide();
        if (userConfig.error) {
          this.$q.notify("Ocorreu um erro, tente novamente");
          return
        }
        this.userLinks = r.data.userLinksToOrganisms.data
        this.userData = userConfig.data
        this.userType = r.data.userType
        this.canUseSystem = r.data.canUseSystem
        this.pastoralStatusData = r.data.pastoralStatus.data
        this.userProfileImage = r.data.profileImage
        // this.tab = r.data.userDataTabs[0].tabValue
        this.verifyLinks()
        this.mountUserData(r.data)
        this.verifyInactiveStatus()
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

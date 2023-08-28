<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-capitalize"> 
          <div class="text-h5">
            detalhe do organismo {{ organismName }}
          </div>
        </div>
        <div class="col-2 text-right">
          <q-btn
            no-caps
            color="primary"
            rounded
            icon="bookmark"
            flat
            unelevated
            @click="updateOrganism"
            label="Salvar Edição"
          />
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <q-tabs
        v-model="tab"
        dense
        no-caps
        class="text-grey q-py-sm"
        active-color="primary"
        indicator-color="primary"
        inline-label
        align="justify"
        narrow-indicator
      >
        <q-tab name="organismData" label="Dados do organismo" />
        <q-tab name="filiateOrganismData" label="Dados do filiado" 
        />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="organismData">
          <div class="row justify-around">
            <div class="col-7 q-gutter-md" align="start">
              <div class="text-h5">Tipo de configuração de organismo</div>
              <q-select
                outlined
                label="Nome da configuração"
                option-label="organismConfigName"
                :option-value="(item) => item._id"
                emit-value
                map-options
                hint="O tipo de configuração que está aplicado"
                v-model="organismConfigName"
                :options="organismConfigOptions"
              />
              <div v-if="organismList.length">
                <q-btn
                  label="Gerenciar Vínculos"
                  color="primary"
                  rounded
                  no-caps
                  unelevated
                  @click="dialogLinks = true"
                />
              </div>
              <div v-if="fields.length" class="text-h5">
                Dados
              </div>
              <div v-for="(field, i) in organismData.fields" :key="i">
                <q-input
                  v-if="field.type.type !== 'boolean'"
                  v-model="field.value"
                  outlined
                  :type="getInputType(field.type.type)"
                  :reverse-fill-mask="field.type.type === 'money'"
                  :prefix="field.type.type === 'money' ? 'R$' : null"
                  :label="field.label + (field.required ? '' : ' (Opcional)')"
                  :mask="field.type.mask"
                  :hint="field.hint"
                />
                <q-checkbox
                  v-else-if="field.type.type === 'boolean'"
                  :label="field.label"
                  v-model="newOrganism[field.model]"
                ></q-checkbox>
              </div>
            </div>
            <q-separator vertical class="q-ma-md" />
            <div class="col-4">
              <div class="row">
                <div
                  class="text-h5"
                >
                  Funções
                </div>
              </div>
              <div v-for="(func, funcIndex) in functions" :key="funcIndex">
                <q-card
                  style="border-radius: 1rem"
                  class="bg-grey-3 q-ma-sm"
                  flat
                >
                  <q-item>
                    <q-item-section top>
                      <div class="text-subtitle2 text-capitalize">{{ func.functionName }}</div>
                      <div>Descrição: {{ func.functionDescription }}</div>
                      <div class="text-caption text-grey-7">Título necessário: {{ func.functionIsRequired ? func.functionRequiredTitleName : 'nenhum' }}</div>
                      <div>
                        <q-icon name="visibility" color="primary" size="sm"/>
                        <q-chip
                          v-for="(vision,i) in func.visions"
                          :key="i"
                        >
                        {{ vision.name }}
                        </q-chip>
                        <span 
                          class="text-caption text-grey-7"
                          v-if="!func.visions || !func.visions.length"
                        >
                          Nenhuma visão
                        </span>
                      </div>
                    </q-item-section>
                    <q-item-section top side>
                      <div class="text-subtitle2">
                        <q-badge color="orange-8" v-if="func.isRequired">
                          Obrigatório
                        </q-badge>
                      </div>
                    </q-item-section>
                  </q-item>
                  <q-expansion-item
                    color="primary"
                    class="q-pa-sm"
                    icon="group"
                    :label="func.users ? `${func.users.length} Participantes` : '0 Participantes'"
                    caption="Clique para ver ou adicionar"
                  >
                    <q-item
                      v-for="user in func.users"
                      :key="user"
                      style="border-radius: 0.5rem; margin-top: 8px;"
                      class="bg-white"
                    >
                      <q-item-section avatar>
                        <q-avatar rounded>
                          <img src="https://cdn.quasar.dev/img/avatar.png" />
                        </q-avatar>
                      </q-item-section>
                      <q-item-section class="text-capitalize text-wrap" lines="2">
                        {{ user.userName }}
                        <div class="text-caption text-grey-7" v-if="user.dates && user.dates.initialDate">
                          Data Início:
                          {{ formatDate(user.dates.initialDate) }}
                        </div>
                        <div
                          v-if="user.dates && user.dates.finalDate"
                          class="text-caption text-grey-7"
                        >
                          Data Fim: {{ formatDate(user.dates.finalDate) }}
                        </div>
                      </q-item-section>
                      <q-item-section side>
                        <div class="text-grey-8 q-gutter-xs">
                          <q-btn
                            @click="dialogInsertObservation(user)"
                            class="gt-xs"
                            size="12px"
                            color="secondary"
                            flat
                            dense
                            round
                            icon="library_books"
                          >
                            <q-tooltip> Observações </q-tooltip>
                          </q-btn>
                          <q-btn
                            @click="dialogOpenDeleteUserFromFunction(user, funcIndex)"
                            class="gt-xs"
                            size="12px"
                            color="red-8"
                            flat
                            dense
                            round
                            icon="delete"
                          >
                            <q-tooltip> Deletar usuário da função </q-tooltip>
                          </q-btn>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item-section class="q-pa-xs">
                      <q-btn
                        label="Adicionar pessoa"
                        color="primary"
                        dense
                        icon="add"
                        rounded
                        flat
                        no-caps
                        @click="linkUserToFunction(func, funcIndex)"
                      />
                    </q-item-section>
                  </q-expansion-item>
                </q-card>
                <q-dialog v-model="dialogInsertUserInFunction.open" @hide="clearDialogAndFunctions">
                  <q-card style="border-radius: 1rem; width: 400px">
                    <q-card-section>
                      <div class="text-h6 text-center">
                        Informe o usuário que ocupará a função
                      </div>
                    </q-card-section>
                    <q-card-section align="center">
                      <q-select
                        v-model="userSelected"
                        filled
                        use-input
                        label="Nome do usuário"
                        option-label="userName"
                        :options="usersOptions"
                        @filter="getUsers"
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
                    <q-card-section align="center">
                      <q-input
                        filled
                        label="Data início"
                        type="date"
                        hint="Informe a data início de ocupação da função"
                        v-model="dialogInsertUserInFunction.initialDate"
                      />
                    </q-card-section>
                    <q-card-actions align="center">
                      <q-btn
                        flat
                        label="Depois"
                        no-caps
                        rounded
                        color="primary"
                        @click="dialogInsertUserInFunction.open = false"
                      />
                      <q-btn
                        unelevated
                        rounded
                        label="Confirmar"
                        no-caps
                        color="primary"
                        @click="addUserToFunction"
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
                <q-dialog
                  v-model="dialogOpenObservation.open"
                  @hide="clearDialogAndFunctions"
                >
                  <q-card style="border-radius: 1rem; width: 400px">
                    <q-card-section>
                      <div 
                        v-if="dialogOpenObservation.data.obs && dialogOpenObservation.data.obs.length"
                        class="text-subtitle1 text-center"
                      >
                        Histórico de observações:
                      </div>
                      <q-item
                        style="
                          border-radius: 0.5rem;
                          background-color: #e7e7e7;
                          margin: 10px;
                        "
                        v-for="obs in dialogOpenObservation.data.obs"
                        :key="obs"
                      >
                        <q-item-section class="text-wrap">
                          <div class="row justify-end">
                            
                            <div class="col text-capitalize text-bold">
                              <q-avatar size="lg" rounded >
                                <img src="https://cdn.quasar.dev/img/avatar.png" />
                              </q-avatar>
                              {{ obs.createdBy.name }}
                            </div>
                            <div class="col text-right" >
                              <div>
                                Publicado em
                              </div>
                              <div class="text-caption">
                                {{ obs.createdAt.createdAtOnlyDate }}
                              </div>
                            </div>
                          </div>
                          <div>
                            {{ obs.obsText }}
                          </div>
                        </q-item-section>
                      </q-item>
                    </q-card-section>
                    <q-card-section>
                      <div class="text-h6 text-center">
                        Insira uma observação à respeito de
                        {{ dialogOpenObservation.data.userName }}
                      </div>
                    </q-card-section>
                    <q-card-section align="center" class="q-gutter-sm">
                      <q-input
                        filled
                        label="Observação"
                        v-model="dialogOpenObservation.obsText"
                        hint="Insira aqui sua observação"
                      />
                    </q-card-section>
                    <q-card-actions align="center">
                      <q-btn
                        flat
                        label="Depois"
                        no-caps
                        rounded
                        color="primary"
                        @click="dialogOpenObservation.open = false"
                      />
                      <q-btn
                        unelevated
                        rounded
                        label="Confirmar"
                        no-caps
                        color="primary"
                        @click="addObservationForFunctionUser"
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
                <q-dialog
                  v-model="dialogDeleteUserFromFunction.open"
                  @hide="clearDialogAndFunctions"
                >
                  <q-card style="border-radius: 1rem; width: 400px">
                    <q-card-section>
                      <div class="text-h6 text-center">
                        Tem certeza que deseja inativar
                        {{ dialogDeleteUserFromFunction.data.userName }}?
                      </div>
                    </q-card-section>
                    <q-card-section align="center" class="q-gutter-sm">
                      <q-input
                        filled
                        label="Observação"
                        v-model="dialogDeleteUserFromFunction.obsText"
                        hint="Informe o motivo"
                      />
                      <q-input
                        filled
                        type="date"
                        label="Data final"
                        v-model="dialogDeleteUserFromFunction.finalDate"
                        hint="Informe a data final de ocupação da função"
                      />
                    </q-card-section>
                    <q-card-actions align="center">
                      <q-btn
                        flat
                        label="Depois"
                        no-caps
                        rounded
                        color="primary"
                        @click="dialogDeleteUserFromFunction.open = false"
                      />
                      <q-btn
                        unelevated
                        rounded
                        label="Confirmar"
                        no-caps
                        color="primary"
                        @click="inactivateUserFromFunction"
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
                <q-dialog full-height full-width v-model="dialogLinks" @hide="clearDialogAndFunctions">
                  <q-card>
                    <q-card-section>
                      <div class="text-h6 text-center">
                        Vínculos
                      </div>
                    </q-card-section>
                    <q-card-section>
                      <div class="row">
                        <div class="col-6">
                          <q-separator/>
                          <div class="text-subtitle2 q-ma-sm">
                            Organismos filiados vinculados:
                          </div>
                          <div v-if="organismLinks.length">
                            <q-chip 
                              removable 
                              @remove="removeChildRelation(chip)" 
                              v-for="chip in childOrganism" 
                              :key="chip._id"
                            >
                              {{ chip.organismName }}
                            </q-chip>
                            </div>
                          <div v-else-if="!organismLinks.length" class="text-center q-mt-md">Nenhum vínculo.</div>
                        </div>
                        <q-separator vertical />
                        <div class="col">
                          <q-separator/>
                          <div class="text-subtitle2 q-ma-sm">
                            Organismos superiores vinculados:
                          </div>
                          <div v-if="parentOrganism.length">
                            <q-chip removable @remove="removeParentRelation(chip)" v-for="chip in parentOrganism" :key="chip._id">
                              {{ chip.organismName }}
                            </q-chip>
                          </div>
                          <div v-else-if="!parentOrganism.length" class="text-center q-mt-md">Nenhum vínculo.</div>
                        </div>
                      </div>
                      <div v-if="organismLinks.length">
                        <q-chip removable @remove="removeLink(chip,i)" v-for="(chip, i) in organismLinks" :key="i">
                          {{ chip.nome }}
                        </q-chip>
                      </div>
                      <div v-else-if="$router.query === '/admin/createOrganism' && !organismLinks.length" class="text-center q-mt-md">Nenhum vínculo.</div>
                    </q-card-section>
                    <q-card-section>
                      <div class="text-subtitle2 q-mb-sm">Vincular novo organismo:</div>
                      <q-input 
                        label="Buscar"
                        outlined
                        type="search"
                        v-model="organismSelected"
                        hint="Faça uma busca para visualizar os organismos disponíveis"
                        @update:model-value="getOrganismsList"
                      >
                        <template #append>
                          <q-icon v-if="organismSelected !== ''" name="close" @click="organismSelected = ''" class="cursor-pointer" />
                          <q-icon name="search" />
                        </template>
                      </q-input>
                      <q-list bordered class="q-mt-sm">
                        <q-item
                          clickable
                          :disable="organismLinks.includes(organism)"
                          @click="addNewLink(organism,i)"
                          v-for="(organism,i) in organismList"
                          :key="i"
                        >
                          <q-item-section>
                            {{ organism.nome }}
                          </q-item-section>
                          <q-item-section class="text-primary" side>
                            {{ organismLinks.includes(organism) ? 'Adicionado' : 'Adicionar'}}
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-card-section>
                    <q-card-actions align="center">
                      <q-btn
                        flat
                        label="Fechar"
                        no-caps
                        rounded
                        color="primary"
                        @click="dialogLinks = false"
                      />
                      <q-btn
                        label="Salvar vínculo"
                        no-caps
                        unelevated
                        rounded
                        color="primary"
                        @click="clkSaveVinculo"
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
              </div>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="filiateOrganismData" >
          <div class="row justify-around">
            <div class="col-7 q-gutter-md" align="start">
              <div class="text-h5">Tipo de configuração de organismo</div>
              <q-select
                outlined
                label="Nome da configuração"
                option-label="organismConfigName"
                :option-value="(item) => item._id"
                emit-value
                map-options
                hint="O tipo de configuração que está aplicado"
                v-model="organismConfigName"
                :options="organismConfigOptions"
              />
              <div v-if="organismList.length">
                <q-btn
                  label="Gerenciar Vínculos"
                  color="primary"
                  rounded
                  no-caps
                  unelevated
                  @click="dialogLinks = true"
                />
              </div>
              <div v-if="fields.length" class="text-h5">
                Dados
              </div>
              <div v-for="(field, i) in organismData.fields" :key="i">
                <q-input
                  v-if="field.type.type !== 'boolean'"
                  v-model="field.value"
                  outlined
                  :type="getInputType(field.type.type)"
                  :reverse-fill-mask="field.type.type === 'money'"
                  :prefix="field.type.type === 'money' ? 'R$' : null"
                  :label="field.label + (field.required ? '' : ' (Opcional)')"
                  :mask="field.type.mask"
                  :hint="field.hint"
                />
                <q-checkbox
                  v-else-if="field.type.type === 'boolean'"
                  :label="field.label"
                  v-model="newOrganism[field.model]"
                ></q-checkbox>
              </div>
            </div>
            <q-separator vertical class="q-ma-md" />
            <div class="col-4">
              <div class="row">
                <div
                  class="text-h5"
                >
                  Funções
                </div>
              </div>
              <div v-for="(func, funcIndex) in functions" :key="funcIndex">
                <q-card
                  style="border-radius: 1rem"
                  class="bg-grey-3 q-ma-sm"
                  flat
                >
                  <q-item>
                    <q-item-section top>
                      <div class="text-subtitle2 text-capitalize">{{ func.functionName }}</div>
                      <div>Descrição: {{ func.functionDescription }}</div>
                      <div class="text-caption text-grey-7">Título necessário: {{ func.functionIsRequired ? func.functionRequiredTitleName : 'nenhum' }}</div>
                      <div>
                        <q-icon name="visibility" color="primary" size="sm"/>
                        <q-chip
                          v-for="(vision,i) in func.visions"
                          :key="i"
                        >
                        {{ vision.name }}
                        </q-chip>
                        <span 
                          class="text-caption text-grey-7"
                          v-if="!func.visions || !func.visions.length"
                        >
                          Nenhuma visão
                        </span>
                      </div>
                    </q-item-section>
                    <q-item-section top side>
                      <div class="text-subtitle2">
                        <q-badge color="orange-8" v-if="func.isRequired">
                          Obrigatório
                        </q-badge>
                      </div>
                    </q-item-section>
                  </q-item>
                  <q-expansion-item
                    color="primary"
                    class="q-pa-sm"
                    icon="group"
                    :label="func.users ? `${func.users.length} Participantes` : '0 Participantes'"
                    caption="Clique para ver ou adicionar"
                  >
                    <q-item
                      v-for="user in func.users"
                      :key="user"
                      style="border-radius: 0.5rem; margin-top: 8px;"
                      class="bg-white"
                    >
                      <q-item-section avatar>
                        <q-avatar rounded>
                          <img src="https://cdn.quasar.dev/img/avatar.png" />
                        </q-avatar>
                      </q-item-section>
                      <q-item-section class="text-capitalize text-wrap" lines="2">
                        {{ user.userName }}
                        <div class="text-caption text-grey-7" v-if="user.dates && user.dates.initialDate">
                          Data Início:
                          {{ formatDate(user.dates.initialDate) }}
                        </div>
                        <div
                          v-if="user.dates && user.dates.finalDate"
                          class="text-caption text-grey-7"
                        >
                          Data Fim: {{ formatDate(user.dates.finalDate) }}
                        </div>
                      </q-item-section>
                      <q-item-section side>
                        <div class="text-grey-8 q-gutter-xs">
                          <q-btn
                            @click="dialogInsertObservation(user)"
                            class="gt-xs"
                            size="12px"
                            color="secondary"
                            flat
                            dense
                            round
                            icon="library_books"
                          >
                            <q-tooltip> Observações </q-tooltip>
                          </q-btn>
                          <q-btn
                            @click="dialogOpenDeleteUserFromFunction(user, funcIndex)"
                            class="gt-xs"
                            size="12px"
                            color="red-8"
                            flat
                            dense
                            round
                            icon="delete"
                          >
                            <q-tooltip> Deletar usuário da função </q-tooltip>
                          </q-btn>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item-section class="q-pa-xs">
                      <q-btn
                        label="Adicionar pessoa"
                        color="primary"
                        dense
                        icon="add"
                        rounded
                        flat
                        no-caps
                        @click="linkUserToFunction(func, funcIndex)"
                      />
                    </q-item-section>
                  </q-expansion-item>
                </q-card>
                <q-dialog v-model="dialogInsertUserInFunction.open" @hide="clearDialogAndFunctions">
                  <q-card style="border-radius: 1rem; width: 400px">
                    <q-card-section>
                      <div class="text-h6 text-center">
                        Informe o usuário que ocupará a função
                      </div>
                    </q-card-section>
                    <q-card-section align="center">
                      <q-select
                        v-model="userSelected"
                        filled
                        use-input
                        label="Nome do usuário"
                        option-label="userName"
                        :options="usersOptions"
                        @filter="getUsers"
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
                    <q-card-section align="center">
                      <q-input
                        filled
                        label="Data início"
                        type="date"
                        hint="Informe a data início de ocupação da função"
                        v-model="dialogInsertUserInFunction.initialDate"
                      />
                    </q-card-section>
                    <q-card-actions align="center">
                      <q-btn
                        flat
                        label="Depois"
                        no-caps
                        rounded
                        color="primary"
                        @click="dialogInsertUserInFunction.open = false"
                      />
                      <q-btn
                        unelevated
                        rounded
                        label="Confirmar"
                        no-caps
                        color="primary"
                        @click="addUserToFunction"
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
                <q-dialog
                  v-model="dialogOpenObservation.open"
                  @hide="clearDialogAndFunctions"
                >
                  <q-card style="border-radius: 1rem; width: 400px">
                    <q-card-section>
                      <div 
                        v-if="dialogOpenObservation.data.obs && dialogOpenObservation.data.obs.length"
                        class="text-subtitle1 text-center"
                      >
                        Histórico de observações:
                      </div>
                      <q-item
                        style="
                          border-radius: 0.5rem;
                          background-color: #e7e7e7;
                          margin: 10px;
                        "
                        v-for="obs in dialogOpenObservation.data.obs"
                        :key="obs"
                      >
                        <q-item-section class="text-wrap">
                          <div class="row justify-end">
                            
                            <div class="col text-capitalize text-bold">
                              <q-avatar size="lg" rounded >
                                <img src="https://cdn.quasar.dev/img/avatar.png" />
                              </q-avatar>
                              {{ obs.createdBy.name }}
                            </div>
                            <div class="col text-right" >
                              <div>
                                Publicado em
                              </div>
                              <div class="text-caption">
                                {{ obs.createdAt.createdAtOnlyDate }}
                              </div>
                            </div>
                          </div>
                          <div>
                            {{ obs.obsText }}
                          </div>
                        </q-item-section>
                      </q-item>
                    </q-card-section>
                    <q-card-section>
                      <div class="text-h6 text-center">
                        Insira uma observação à respeito de
                        {{ dialogOpenObservation.data.userName }}
                      </div>
                    </q-card-section>
                    <q-card-section align="center" class="q-gutter-sm">
                      <q-input
                        filled
                        label="Observação"
                        v-model="dialogOpenObservation.obsText"
                        hint="Insira aqui sua observação"
                      />
                    </q-card-section>
                    <q-card-actions align="center">
                      <q-btn
                        flat
                        label="Depois"
                        no-caps
                        rounded
                        color="primary"
                        @click="dialogOpenObservation.open = false"
                      />
                      <q-btn
                        unelevated
                        rounded
                        label="Confirmar"
                        no-caps
                        color="primary"
                        @click="addObservationForFunctionUser"
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
                <q-dialog
                  v-model="dialogDeleteUserFromFunction.open"
                  @hide="clearDialogAndFunctions"
                >
                  <q-card style="border-radius: 1rem; width: 400px">
                    <q-card-section>
                      <div class="text-h6 text-center">
                        Tem certeza que deseja inativar
                        {{ dialogDeleteUserFromFunction.data.userName }}?
                      </div>
                    </q-card-section>
                    <q-card-section align="center" class="q-gutter-sm">
                      <q-input
                        filled
                        label="Observação"
                        v-model="dialogDeleteUserFromFunction.obsText"
                        hint="Informe o motivo"
                      />
                      <q-input
                        filled
                        type="date"
                        label="Data final"
                        v-model="dialogDeleteUserFromFunction.finalDate"
                        hint="Informe a data final de ocupação da função"
                      />
                    </q-card-section>
                    <q-card-actions align="center">
                      <q-btn
                        flat
                        label="Depois"
                        no-caps
                        rounded
                        color="primary"
                        @click="dialogDeleteUserFromFunction.open = false"
                      />
                      <q-btn
                        unelevated
                        rounded
                        label="Confirmar"
                        no-caps
                        color="primary"
                        @click="inactivateUserFromFunction"
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
                <q-dialog full-height full-width v-model="dialogLinks" @hide="clearDialogAndFunctions">
                  <q-card>
                    <q-card-section>
                      <div class="text-h6 text-center">
                        Vínculos
                      </div>
                    </q-card-section>
                    <q-card-section>
                      <div class="row">
                        <div class="col-6">
                          <q-separator/>
                          <div class="text-subtitle2 q-ma-sm">
                            Organismos filiados vinculados:
                          </div>
                          <div v-if="organismLinks.length">
                            <q-chip 
                              removable 
                              @remove="removeChildRelation(chip)" 
                              v-for="chip in childOrganism" 
                              :key="chip._id"
                            >
                              {{ chip.organismName }}
                            </q-chip>
                            </div>
                          <div v-else-if="!organismLinks.length" class="text-center q-mt-md">Nenhum vínculo.</div>
                        </div>
                        <q-separator vertical />
                        <div class="col">
                          <q-separator/>
                          <div class="text-subtitle2 q-ma-sm">
                            Organismos superiores vinculados:
                          </div>
                          <div v-if="parentOrganism.length">
                            <q-chip removable @remove="removeParentRelation(chip)" v-for="chip in parentOrganism" :key="chip._id">
                              {{ chip.organismName }}
                            </q-chip>
                          </div>
                          <div v-else-if="!parentOrganism.length" class="text-center q-mt-md">Nenhum vínculo.</div>
                        </div>
                      </div>
                      <div v-if="organismLinks.length">
                        <q-chip removable @remove="removeLink(chip,i)" v-for="(chip, i) in organismLinks" :key="i">
                          {{ chip.nome }}
                        </q-chip>
                      </div>
                      <div v-else-if="$router.query === '/admin/createOrganism' && !organismLinks.length" class="text-center q-mt-md">Nenhum vínculo.</div>
                    </q-card-section>
                    <q-card-section>
                      <div class="text-subtitle2 q-mb-sm">Vincular novo organismo:</div>
                      <q-input 
                        label="Buscar"
                        outlined
                        type="search"
                        v-model="organismSelected"
                        hint="Faça uma busca para visualizar os organismos disponíveis"
                        @update:model-value="getOrganismsList"
                      >
                        <template #append>
                          <q-icon v-if="organismSelected !== ''" name="close" @click="organismSelected = ''" class="cursor-pointer" />
                          <q-icon name="search" />
                        </template>
                      </q-input>
                      <q-list bordered class="q-mt-sm">
                        <q-item
                          clickable
                          :disable="organismLinks.includes(organism)"
                          @click="addNewLink(organism,i)"
                          v-for="(organism,i) in organismList"
                          :key="i"
                        >
                          <q-item-section>
                            {{ organism.nome }}
                          </q-item-section>
                          <q-item-section class="text-primary" side>
                            {{ organismLinks.includes(organism) ? 'Adicionado' : 'Adicionar'}}
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-card-section>
                    <q-card-actions align="center">
                      <q-btn
                        flat
                        label="Fechar"
                        no-caps
                        rounded
                        color="primary"
                        @click="dialogLinks = false"
                      />
                      <q-btn
                        label="Salvar vínculo"
                        no-caps
                        unelevated
                        rounded
                        color="primary"
                        @click="clkSaveVinculo"
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
              </div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import { date } from "quasar";
export default defineComponent({
  name: "OrganismDetail",
  data() {
    return {
      tab: 'organismData',
      usersOptions: [],
      organismVinculated: '',
      organismTypeId: null,
      organismName: '',
      userSelected: '',
      organism: null,
      fields: [],
      selectedFunc: "",
      selectedFuncIndex: "",
      organismConfigOptions: [],
      newOrganism: {},
      organismSelected: '',
      dialogInsertUserInFunction:{
        initialDate: '',
        open: false,
      },
      dialogDeleteUserFromFunction: {
        obsText: "",
        finalDate: "",
        functionUserId: "",
        open: false,
        data: {},
      },
      dialogOpenObservation: {
        open: false,
        functionUserId: "",
        obsText: "",
        data: {},
      },
      organismData: {
        organismConfigId: null,
        fields: [],
      },
      functions: [],
      organismList: [],
      organismLinks: [],
      parentOrganism: [],
      childOrganism: [],
      linkedOrganismsData: [],
      organismConfigName: '',
      organismSearch: '',
      dialogLinks: false
    };
  },
  mounted() {
    this.$q.loading.hide()
  },
  beforeMount(){
    this.getOrganismDetailById();
    this.getOrganismsList()
    this.getOrganismsConfigs()
    this.getParentOrganismsById()
    this.getLinkedOrganismConfig()
    // this.getChildOrganismsById()
  },
  methods: {
    getLinkedOrganismConfig() {
      const opt = {
        route: "/desktop/adm/getLinkedOrganismConfig",
        body: {
          organismConfigId: this.organismData.organismConfigId
        }
      };
      useFetch(opt).then(r => {
        this.linkedOrganismsData = r.data
      })
    },
    filterInOrganismLinks(val){
      console.log(val)
    },
    getOrganismsConfigs() {
      const opt = {
        route: "/desktop/adm/getOrganismsConfigs",
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.organismConfigOptions = r.data
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
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
    updateOrganism(){
      if (this.checkRequiredFields()) {
        const userData = [];
        for (const func of this.functions) {
          if (func.users && func.users.length > 0) {
            for (const user of func.users) {
              userData.push({
                organismFunctionConfigId: user.organismFunctionConfigId,
                userId: user.userId,
                dates: {
                  initialDate: user.initialDate
                }
              });
            }
          }
        }
        const organismId = this.$route.query.organismId
        const opt = {
          route: '/desktop/adm/removeParentRelation',
          body: {
            organismData: this.organismData,
            functions: userData,
            organismId: organismId
          }
        }
        this.$q.loading.show()
        useFetch(opt).then(r => {
          this.$q.loading.hide()
          if(r.error){
            this.$q.notify('Ocorreu um erro, tente novamente')
          } else {
            this.$q.notify('Organismo editado com sucesso!')
            this.getOrganismDetailById()
          }
        })
      } else {
        this.$q.notify("Há campos obrigatórios não preenchidos");
      }
    },
    removeParentRelation(chip){
      const organismParentId = chip._id
      const opt = {
        route: '/desktop/adm/removeParentRelation',
        body: {
          organismId: organismParentId
        }
      }
      this.$q.loading.show()
      useFetch(opt).then(r => {
        this.$q.loading.hide()
        if(!r.error){
          this.$q.notify('Vínculo removido com sucesso!')
          this.getParentOrganismsById()
        } else {
          this.$q.notify('Ocorreu um erro, tente novamente')
        }
      })
    },
    removeChildRelation(chip){
      const organismChildId = chip._id
      const opt = {
        route: '/desktop/adm/removeChildRelation',
        body: {
          organismId: organismChildId
        }
      }
      this.$q.loading.show()
      useFetch(opt).then(r => {
        this.$q.loading.hide()
        if(!r.error){
          this.$q.notify('Vínculo removido com sucesso!')
          this.getChildOrganismsById()
        } else {
          this.$q.notify('Ocorreu um erro, tente novamente')
        }
      })
    },
    clkSaveVinculo(){
      const organismLinksIds = this.organismLinks.map(organism => organism.organismId)
      const organismId = this.$route.query.organismId
      const opt = {
        route: '/desktop/adm/createRelation',
        body: {
          organismId: organismId,
          organismLinks: organismLinksIds
        }
      }
      this.$q.loading.show()
      useFetch(opt).then(r => {
        this.$q.loading.hide()
        if(!r.error){
          this.$q.notify('Vínculo salvo com sucesso!')
          this.dialogLinks = false
          this.getParentOrganismsById()
        } else {
          this.$q.notify('Ocorreu um erro, tente novamente')
        }
      })
    },
    dialogInsertObservation(user) {
      this.dialogOpenObservation.data = user;
      this.dialogOpenObservation.open = true;
      this.dialogOpenObservation.functionUserId = user.userIdMongo
    },
    addObservationForFunctionUser() {
      if (
        this.dialogOpenObservation.obsText === ''
      ) {
        this.$q.notify("Preencha o campo observação");
        return;
      }
      const opt = {
        route: "/desktop/adm/addObservationForFunctionUser",
        body: {
          obsText: this.dialogOpenObservation.obsText,
          functionUserId: this.dialogOpenObservation.functionUserId
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.getOrganismDetailById();
          this.$q.notify("Observação inserida com sucesso!");
          this.clearDialogAndFunctions();
        }
      });
    },
    clearDialogAndFunctions() {
      this.selectedFunc = {};
      this.userSelected = "";
      this.functionSelected = "";
      this.dialogOpenObservation.data = {};
      this.dialogDeleteUserFromFunction.data = {};
      this.dialogDeleteUserFromFunction.finalDate = "";
      this.dialogDeleteUserFromFunction.functionUserId = "";
      this.dialogDeleteUserFromFunction.obsText = "";
      this.dialogOpenObservation.obsText = "";
      this.dialogDeleteUserFromFunction.open = false;
      this.dialogOpenObservation.open = false;
      this.dialogInsertUserInFunction.open = false;
    },
    dialogOpenDeleteUserFromFunction(user, funcIndex) {
      this.dialogDeleteUserFromFunction.open = true;
      this.dialogDeleteUserFromFunction.data = user;
      this.dialogDeleteUserFromFunction.functionUserId = user.userIdMongo;
      this.dialogDeleteUserFromFunction.funcIndex = funcIndex;
    },
    getOrganismsList(val) {
      const opt = {
        route: "/desktop/adm/getOrganismsList",
        body: {
          searchString: val
        }
      };
      useFetch(opt).then((r) => {
        this.organismList = r.data.list;
      });
    },
    addUserToFunction() {
      const selectedFuncIndex = this.selectedFuncIndex;
      if (this.userSelected === "" || this.dialogInsertUserInFunction.initialDate === "") {
        this.$q.notify("Preencha usuário e a data início");
        return;
      }
      this.functions[selectedFuncIndex].users.push({
        organismFunctionConfigId: this.selectedFunc.functionConfigId,
        userId: this.userSelected._id,
        initialDate: this.dialogInsertUserInFunction.initialDate,
      });
      const organismId = this.$route.query.organismId;
      let userData = {}
      for (const user of this.functions[selectedFuncIndex].users) {
        userData = {
          organismFunctionConfigId: user.organismFunctionConfigId,
          userId: user.userId,
          dates: {
            initialDate: user.initialDate
          }
        };
      }
      const opt = {
        route: "/desktop/adm/addUserToFunction",
        body: {
          organismId: organismId,
          functionData: userData
        }
      };
      useFetch(opt).then((r) => {
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente')
        } else{
          this.getOrganismDetailById()
          this.clearDialogAndFunctions();
        }
      });
    },
    getChildOrganismsById() {
      const childOrganismId = this.$route.query.organismId
      const opt = {
        route: "/desktop/adm/getChildOrganismsById",
        body: {
          organismId: childOrganismId
        }
      };
      useFetch(opt).then((r) => {
        this.childOrganism = r.data;
      });
    },
    getParentOrganismsById() {
      const parentOrganismId = this.$route.query.organismId
      const opt = {
        route: "/desktop/adm/getParentOrganismsById",
        body: {
          organismId: parentOrganismId
        }
      };
      useFetch(opt).then((r) => {
        this.parentOrganism = r.data;
      });
    },
    inactivateUserFromFunction() {
      if (
        this.dialogDeleteUserFromFunction.obsText === "" ||
        this.dialogDeleteUserFromFunction.finalDate === ""
      ) {
        this.$q.notify("Preencha observação e data final para prosseguir!");
        return;
      }
      const opt = {
        route: "/desktop/adm/inactivateUserFromFunction",
        body: {
          functionUserId: this.dialogDeleteUserFromFunction.functionUserId,
          finalDate: this.dialogDeleteUserFromFunction.finalDate,
          obsText: this.dialogDeleteUserFromFunction.obsText,
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.getOrganismDetailById();
          this.$q.notify("Usuário deletado com sucesso!");
          this.clearDialogAndFunctions();
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    getUsers(val, update) {
      console.log(val, 'AUQI VAL')
      const opt = {
        route: "/desktop/adm/getUsers",
        body: {
          searchString: val,
          isActive: 1,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        update(() => {
          this.usersOptions = r.data;
        })
      });
    },
    formatDate(newDate) {
      return date.formatDate(newDate, "DD/MM/YYYY");
    },
    linkUserToFunction(func, funcIndex ) {
      this.selectedFuncIndex = funcIndex;
      this.selectedFunc = func;
      console.log(this.selectedFunc, 'AQUI SELECTEDFUNC')
      console.log(this.selectedFuncIndex, 'AQUI SELECTEDINDEX')
      this.dialogInsertUserInFunction.open = true;
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
        if (!r.error) {
          this.organismName = r.data.organismData.organismName
          this.organismData.fields = r.data.organismData.fields;
          this.organismConfigName = r.data.organismData.organismConfigName
          this.functions = r.data.functions
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
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
    addNewLink (organism) {
      this.organismLinks.push(organism)
    },
    removeLink(i) {
      this.organismLinks.splice(i,1)
    }
  },
});
</script>

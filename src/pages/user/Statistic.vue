<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md text-center">
        <div class="text-capitalize"> 
          <div class="text-h5 q-mb-sm">
            Estatística 2023
          </div>
          <q-tabs 
            no-caps
            dense
            class="bg-indigo-5 text-white shadow-2 text-caption" 
            style="border-radius: .5rem;"
            v-model="tab"
          >
            <q-tab 
              :disable="pastorDisable"
              name="Dados pastorais" 
              icon="description" 
              label="Dados pastorais" 
            />
            <q-tab 
              :disable="organismDisable"
              name="Dados congregacionais" 
              icon="diversity_2" 
              label="Dados congregacionais"
            />
          </q-tabs>
        </div>
      </div>
      <div>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="Dados pastorais">
            <div>
              <div class="text-h5 q-px-md">1° - Dados pessoais</div>
              <div 
                class="text-h6 q-px-md"
              >
                Nesta seção revise cuidadosamente seus dados, 
                se não tiver uma rede social pessoal, como o Instagram, 
                deixe o campo em branco não insira o da congregação. 
              </div>
              <div
                v-for="(data) in pastorData"
                :key="data"
              >
                <q-input 
                  v-if="data.label 
                    && data.label !== 'Redes sociais'
                    && data.label !== 'Relação conjugal' 
                    && data.label !== 'Relação familiar'
                    && data.label !== 'Filhos'
                    && data.label !== 'Pai'
                    && data.label !== 'Mãe'"
                  outlined
                  class="q-pa-sm q-mx-md"
                  :label="data.label"
                  v-model="data.value"
                  :mask="data.mask"
                >
                </q-input>
                <div
                  v-if="data.label === 'Pai'"
                  class="q-mx-lg"
                >
                  <div class="text-h6">
                      {{data.label}}
                    </div>
                  <q-item
                    class="bg-grey-2"
                    v-if="data.userName"
                    style="border-radius: 1rem;"
                  >
                    <q-item-section>
                      {{data.userName}}
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>
                        <q-btn
                            icon="edit"
                            color="primary"
                            flat
                            rounded
                            @click="editParentName(data.label)"
                          />
                          <q-btn
                            icon="delete"
                            color="red"
                            flat
                            rounded
                            @click="removeParent(data.label)"
                          >
                            <q-tooltip>Remover {{data.label}}</q-tooltip>
                          </q-btn>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <div v-if="!data.userName">
                    <q-btn
                      icon="add"
                      rounded
                      :label="data.label"
                      flat
                      color="primary"
                      @click="addParent(data.label)"
                    >

                    </q-btn>
                  </div>
                </div>
                <div
                  v-if="data.label === 'Mãe'"
                  class="q-mx-lg"
                >
                  <div class="text-h6">
                      {{data.label}}
                    </div>
                  <q-item
                    v-if="data.userName"
                    class="bg-grey-2"
                    style="border-radius: 1rem;"
                  >
                    <q-item-section>
                      {{data.userName}}
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>
                        <q-btn
                          icon="edit"
                          color="primary"
                          flat
                          rounded
                          @click="editParentName(data.label)"
                        />
                        <q-btn
                          icon="delete"
                          color="red"
                          flat
                          rounded
                          @click="removeParent(data.label)"
                        >
                          <q-tooltip>Remover {{ data.label }}</q-tooltip>
                        </q-btn>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <div v-if="!data.userName">
                    <q-btn
                      icon="add"
                      :label="data.label"
                      flat
                      rounded
                      @click="addParent(data.label)"
                      color="primary"
                    >

                    </q-btn>
                  </div>
                </div>
                <div 
                  v-if="data.label === 'Redes sociais'"
                  class="q-mx-lg"
                >
                  <div class="q-mx-sm">
                    <div class="text-h6">
                      {{data.label}}
                    </div>
                    <q-item 
                      class="bg-grey-2 q-my-md"
                      style="border-radius: 1rem;"
                      v-for="(social, iSocial) in data.value"
                      :key="social"
                    >
                      <q-item-section>
                        {{ social.selectedSocialType }}
                        <q-item-label>
                          Nome: {{ social.name }}
                        </q-item-label>
                        <q-item-label>
                          Tipo: {{ social.type }}
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-item-label>
                          <q-btn
                            icon="edit"
                            color="primary"
                            flat
                            rounded
                            @click="editSocialNetwork(social, iSocial)"
                          />
                          <q-btn
                            icon="delete"
                            color="red"
                            flat
                            rounded
                            @click="removeSocialNetwork(iSocial)"
                          >
                            <q-tooltip>Remover rede social</q-tooltip>
                          </q-btn>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>
                  <q-btn
                    label="Rede social"
                    icon="add"
                    color="primary"
                    flat
                    rounded
                    @click="clkAddNewSocialNetwork"
                  >
                    <q-tooltip>Adicionar rede social</q-tooltip>
                  </q-btn>
                </div>
                <div v-if="data.label === 'Relação conjugal'" class="q-mx-lg">
                  <div class="q-mx-sm">
                    <div class="text-h6">
                      {{ data.label }}
                    </div>
                    <q-item
                      v-if="data.partner"
                      class="bg-grey-2"
                      style="border-radius: 1rem;"
                    >
                      <q-item-section>
                        <q-item-label>
                          Nome: {{ data.partner.userName }}
                        </q-item-label>
                        <q-item-label>
                          Data inicial: {{ data.partner.dates.initialDate }}
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-item-label>
                          <q-btn
                            icon="edit"
                            color="primary"
                            flat
                            rounded
                            @click="editMaritalStatus(data.partner)"
                          >
                            <q-tooltip>Alterar relação conjugal</q-tooltip>
                          </q-btn>
                          <q-btn
                            icon="delete"
                            color="red"
                            rounded
                            flat
                            @click="removeMaritalRelation"
                          >
                            <q-tooltip>Remover relação conjugal</q-tooltip>
                          </q-btn>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>
                  <q-btn
                    v-if="!pastorData.maritalRelation.partner || !pastorData.maritalRelation.partner._id"
                    color="primary"
                    flat
                    rounded
                    icon="add"
                    label="Adicionar relação"
                    @click="addMaritalRelation"
                  >
                    <q-tooltip>Adicionar sua relação conjugal</q-tooltip>
                  </q-btn>
                </div>
                <div v-if="data.label === 'Filhos'" class="q-mx-lg q-mt-md">
                  <div class="q-mx-sm">
                    <div class="text-h6">
                      {{ data.label }}
                    </div>
                    <q-item
                      class="bg-grey-2 q-my-sm"
                      style="border-radius: 1rem;"
                      v-for="(child, iChild) in data.child"
                      :key="child"
                    >
                      <q-item-section >
                        {{ child.userName }}
                      </q-item-section>
                      <q-item-section side>
                        <q-item-label>
                          <q-btn
                            icon="edit"
                            color="primary"
                            rounded
                            unelevated
                            flat
                            @click="openDialogEditChild(child, iChild)"
                          >
                            <q-tooltip>Alterar filho</q-tooltip>
                          </q-btn>
                          <q-btn
                            icon="delete"
                            color="red"
                            rounded
                            unelevated
                            flat
                            @click="removeChild(iChild)"
                          >
                            <q-tooltip>Remover filho</q-tooltip>
                          </q-btn>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>
                  <q-btn
                    label="Filho"
                    icon="add"
                    color="primary"
                    flat
                    rounded
                    @click="clkAddNewChild"
                  >
                    <q-tooltip>Adicionar Filho</q-tooltip>
                  </q-btn>
                    
                </div>
              </div>
              <q-separator class="q-ma-sm q-my-md"/>
            </div>
            <div>
              <div class="text-h5">2° - Vida pastoral</div>
              <div class="text-h6 q-mb-sm">
                Nestes campos vamos conferir a sua vida acadêmica, ministerial dentro da Igreja.
              </div>
              <div>
                <div class="text-h6 q-pa-sm q-pl-lg q-ml-sm">Formações</div>
                <q-list>
                  <q-item
                    style="border-radius: 1rem;"
                    class="q-pa-sm q-ma-sm bg-grey-2"
                    v-for="(formation, i) in pastorFormations"
                    :key="formation"
                  >
                    <q-item-section class="q-pa-sm">
                      <q-item-label lines="1">
                        {{ formation.formation.course }} - {{ formation.formation.conclusionYear }}
                      </q-item-label>
                      <q-item-label lines="2">
                        {{ formation.formation.level }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>
                        <q-btn
                          color="primary"
                          flat
                          rounded
                          @click="editFormation(formation, i)"
                          icon="edit"
                        >
                          <q-tooltip>Editar formação</q-tooltip>
                        </q-btn>
                        <q-btn
                          color="red"
                          flat
                          @click="removeFormation(i)"
                          rounded
                          icon="delete"
                        >
                          <q-tooltip>Remover formação</q-tooltip>
                        </q-btn>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                <q-btn
                  color="primary"
                  icon="add"
                  label="Adicionar formação"
                  flat
                  @click="addFormation"
                  rounded
                >
                  <q-tooltip>Adicionar formação</q-tooltip>
                </q-btn>
                <q-separator class="q-ma-sm"/>
              </div>
              <div>
                <div class="text-h6 q-pa-sm q-pl-lg q-ml-sm">Histórico de vínculos</div>
                <q-list>
                  <q-item 
                    style="border-radius: 1rem;"
                    class="q-pa-sm q-ma-sm bg-grey-2"
                    v-for="(link, i) in pastorLink"
                    :key="link"
                  >
                    <q-item-section class="q-pa-sm">
                      <q-item-label lines="1">
                        {{ link.linkData.label }} - {{ link.organismData.name }}
                      </q-item-label>
                      <q-item-label lines="2">
                        {{ link.organismData.city }}/{{ link.organismData.state }}
                      </q-item-label>
                      <q-item-label lines="3">
                        Data início: {{ link.linkData.dates.initialDate }}
                      </q-item-label>
                      <q-item-label lines="4">
                        Data fim: {{ link.linkData.dates.finalDate }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>
                        <q-btn
                          icon="edit"
                          color="primary"
                          @click="editLink(link, i)"
                          flat
                          rounded
                        />
                        <q-btn
                          icon="delete"
                          @click="removeLink(i)"
                          color="red"
                          flat
                          rounded
                        >
                          <q-tooltip>Remover rede social</q-tooltip>
                        </q-btn>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                <q-btn
                  label="Histórico"
                  icon="add"
                  flat
                  color="primary"
                  @click="addNewLink"
                >
                  <q-tooltip>Adicionar novo vínculo</q-tooltip>
                </q-btn>
              </div>
              <q-separator class="q-ma-sm q-my-md"/>
            </div>
            <div>
              <div class="text-h5">3° - Atividades pastoral</div>
              <div class="text-h6 q-mb-md">
                Pastor, estes dados são do seu ministério, caso tenha trocado de congregação ao longo do ano de 2023, 
                insira somente os dados de visita da congregação/paróquia que começou o trabalho em 2023, no final do 
                bloco há um campo para inserir os dados da congregação na qual fazia parte no início de 2023.
              </div>
              <div>
                <q-item 
                  v-for="item in pastorActivities" 
                  :key="item"
                >
                  <q-item-section>
                    <p class=" q-pl-lg no-margin"> {{item.title}}</p>
                    <div class="row q-pa-sm q-pl-lg q-gutter-md" > 
                      <q-input filled v-model="item.quantity" label="Quantidade de visitas">
                          <template v-slot:prepend>
                          </template>
                      </q-input>
                      <q-input filled v-model="item.people" label="Pessoas de pessoas ">
                          <template v-slot:prepend>
                          </template>
                      </q-input>
                    </div>
                    <q-separator class="q-ma-sm q-my-md"/>
                  </q-item-section>
                </q-item>
              </div>
              <div>
                <div class="text-h6 q-mb-md">
                  Caso venha de outra congregação, preencha as informações das visitas que fizeste em 2023 no local anterior:
                </div>
                <q-item 
                  v-for="item in lastOrganismPastorActivities" 
                  :key="item"
                >
                  <q-item-section>
                    <p class=" q-pl-lg no-margin"> {{item.title}}</p>
                    <div class="row q-pa-sm q-pl-lg q-gutter-md" > 
                      <q-input filled v-model="item.quantity" label="Quantidade de visitas">
                          <template v-slot:prepend>
                          </template>
                      </q-input>
                      <q-input filled v-model="item.people" label="Pessoas de pessoas ">
                          <template v-slot:prepend>
                          </template>
                      </q-input>
                    </div>
                    <q-separator class="q-ma-sm q-my-md"/>
                  </q-item-section>
                </q-item>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
      <q-dialog
        v-model="dialogEditChild.open"
      >
        <q-card style="width: 400px;">
          <q-card-section class="text-h6">
            Alterar usuário
          </q-card-section>
          <q-card-section>
            <q-select
              v-model="dialogEditChild.newChild"
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
          <q-card-actions align="center">
            <q-btn label="Sair" color="primary" unelevated flat @click="cancelChangeChild"/>
            <q-btn label="Confirmar" color="primary" unelevated @click="confirmChangeChild"/>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogEditMaritalStatus.open"
      >
        <q-card style="width: 400px;">
          <q-card-section>
            <div class="text-h6 q-pa-sm">
              Alterar relação?
            </div>
            <q-select
              class="q-pa-sm"
              v-model="dialogEditMaritalStatus.status.userName"
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
            <div class="q-pa-sm text-h6">
              Datas:
            </div>
            <q-input
              v-model="dialogEditMaritalStatus.status.dates.initialDate"
              outlined
              mask="##/##/####"
              class="q-pa-sm"
              label="Data inicial"
            />
            <q-input
              v-model="dialogEditMaritalStatus.status.dates.finalDate"
              outlined
              class="q-pa-sm"
              mask="##/##/####"
              label="Data final"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              label="Depois"
              color="primary"
              flat
              unelevated
            />
            <q-btn
              label="Confirmar"
              color="primary"
              @click="confirmEditMaritalRelation"
              unelevated
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogEditSocialNetwork.open"
        @hide="clearDialogEditSocialNetwork"
      >
        <q-card style="width: 300px;">
          <q-card-section>
            <strong>Alterar rede social</strong>
          </q-card-section>
          <q-card-section>
            <q-select 
              v-model="dialogEditSocialNetwork.social.selectedSocialType"
              :options="socialNetworkTypes"
              outlined
              label="Qual a rede social?"
              hint="Selecione a rede"
            />
          </q-card-section>
          <q-card-section v-if="dialogEditSocialNetwork.socialType !== 'Site pessoal'">
            <q-input 
              outlined
              v-model="dialogEditSocialNetwork.social.name"
              label="Nome de perfil"
              hint="Seu nome de perfil na rede social"
            />
          </q-card-section>
          <q-card-section>
            <q-select
              outlined
              v-model="dialogEditSocialNetwork.social.type"
              label="Tipo de rede"
              hint="Tipo de perfil"
              :options="profileTypeOptions"
            >
            </q-select>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              label="Cancelar"
              color="primary"
              flat
              @click="clearDialogEditSocialNetwork"
              unelevated
              rounded
            />
            <q-btn
              label="Confirmar"
              color="primary"
              @click="confirmChangeSocialNetwork"
              rounded
              unelevated
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogAddNewSocialNetwork.open"
        @hide="clearDialogAddNewSocialNetwork()"
      >
        <q-card style="width: 500px;">
          <q-card-section>
            <q-select 
              :options="socialNetworkTypes"
              v-model="dialogAddNewSocialNetwork.socialType"
              label="Qual a rede social?"
              outlined
              hint="Selecione a rede"
            />
          </q-card-section>
          <q-card-section>
            <q-input 
              v-model="dialogAddNewSocialNetwork.name"
              label="Nome de perfil"
              hint="Seu nome de perfil na rede social"
              outlined
            />
          </q-card-section>
          <q-card-section>
            <q-select
              outlined
              v-model="dialogAddNewSocialNetwork.type"
              label="Tipo de rede"
              hint="Tipo de perfil"
              :options="profileTypeOptions"
            >
            </q-select>
          </q-card-section>
          <!-- <q-card-section>
            <q-input 
              outlined
              v-model="dialogAddNewSocialNetwork.name"
              label="Link da página"
              :prefix="prefix"
            >
            </q-input>
          </q-card-section> -->
          <q-card-actions align="center">
            <q-btn
              label="Sair"
              color="primary"
              flat
              unelevated
              rounded
              @click="clearDialogAddNewSocialNetwork"
            />
            <q-btn
              label="Confirmar"
              color="primary"
              @click="confirmAddNewSocialNetwork"
              rounded
              unelevated
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogAddNewChild.open"
      >
        <q-card style="width: 500px;">
          <q-card-section>
            <strong>
              Selecione o usuário
            </strong>
          </q-card-section>
          <q-card-section>
            <q-select
              v-model="dialogAddNewChild.child"
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
          <q-card-actions align="center">
            <q-btn
              label="Sair"
              color="primary"
              flat
              unelevated
              rounded
            />
            <q-btn
              label="Confirmar"
              color="primary"
              @click="confirmAddNewChild"
              rounded
              unelevated
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogAddMaritalRelation.open"
        @hide="clearDialogAddMaritalRelation"
      >
        <q-card style="width: 400px;">
          <q-card-section class="text-h6">
            Adicionar relação conjugal
          </q-card-section>
          <q-card-section>
            <q-select
              class="q-px-sm"
              filled
              v-model="dialogAddMaritalRelation.partner"
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
            <div class="q-pa-sm text-h6">
              Datas:
            </div>
            <q-input
              outlined
              mask="##/##/####"
              v-model="dialogAddMaritalRelation.dates.initialDate"
              class="q-pa-sm"
              label="Data inicial"
            />
            <q-input
              v-model="dialogAddMaritalRelation.dates.finalDate"
              outlined
              mask="##/##/####"
              class="q-pa-sm"
              label="Data final"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              label="Sair"
              @click="clearDialogAddMaritalRelation"
              color="primary"
              flat
              unelevated
              rounded
            />
            <q-btn
              label="Confirmar"
              color="primary"
              @click="confirmAddMaritalRelation"
              rounded
              unelevated
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogEditParentName.open"
        @hide="clearDialogParent"
      >
        <q-card style="width: 400px;">
          <q-card-section class="text-h6">
            Alterar usuário
          </q-card-section>
          <q-card-section>
            <q-select
              class="q-pa-sm"
              filled
              v-model="dialogEditParentName.user"
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
          <q-card-actions align="center">
            <q-btn
              label="Sair"
              @click="clearDialogParent"
              color="primary"
              flat
              unelevated
              rounded
            />
            <q-btn
              label="Confirmar"
              color="primary"
              @click="confirmEditParent"
              rounded
              unelevated
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogAddParent.open"
        @hide="clearDialogAddParent"
      >
        <q-card
          style="width: 400px"
        >
          <q-card-section class="text-h6">
            Selecione o usuário
          </q-card-section>
          <q-card-section>
            <q-select
              class="q-pa-sm"
              filled
              v-model="dialogAddParent.user"
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
          <q-card-actions align="center">
            <q-btn
              label="Sair"
              @click="clearDialogAddParent"
              color="primary"
              flat
              unelevated
              rounded
            />
            <q-btn
              label="Confirmar"
              color="primary"
              @click="confirmAddParent"
              rounded
              unelevated
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogEditFormation.open"
      >
        <q-card style="width: 400px">
          <q-card-section>
            <div class="text-h6">
              Selecione o curso
            </div>
            <q-select
              class="q-pa-sm"
              filled
              v-model="dialogEditFormation.formation"
              label="Nome do curso"
              option-label="label"
              :options="coursesList"
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
          <q-card-section>
            <div class="text-h6">
              Selecione o ano de conclusão
            </div>
            <q-input
              class="q-pa-sm"
              filled
              mask="####"
              label="Ano de conclusão"
              v-model="dialogEditFormation.date"
              >
          </q-input>
          </q-card-section>
          <q-card-section>
            <div class="text-h6">Selecione o tipo de graduação</div>
            <q-select
              class="q-pa-sm"
              filled
              v-model="dialogEditFormation.course"
              label="Tipo de graduação"
              option-label="label"
              :options="formationLevelsList"
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
              label="Sair"
              color="primary"
              flat
              unelevated
              rounded
            />
            <q-btn
              label="Confirmar"
              color="primary"
              @click="confirmEditFormation"
              rounded
              unelevated
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogAddFormation.open"
      >
        <q-card style="width: 400px">
          <q-card-section>
            <div class="text-h6">
              Selcione o curso
            </div>
            <q-select
              class="q-pa-sm"
              filled
              use-input
              v-model="dialogAddFormation.formation"
              label="Nome do curso"
              option-label="label"
              :options="coursesList"
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
          <q-card-section>
            <div class="text-h6">
              Selecione o ano de conclusão
            </div>
            <q-input
              class="q-pa-sm"
              filled
              mask="####"
              label="Ano de conclusão"
              v-model="dialogAddFormation.date"
              >
          </q-input>
          </q-card-section>
          <q-card-section>
            <div class="text-h6">Selecione o tipo de graduação</div>
            <q-select
              class="q-pa-sm"
              filled
              v-model="dialogAddFormation.course"
              label="Tipo de graduação"
              option-label="label"
              :options="formationLevelsList"
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
              label="Sair"
              color="primary"
              flat
              unelevated
              rounded
            />
            <q-btn
              label="Confirmar"
              color="primary"
              @click="confirmAddFormation"
              rounded
              unelevated
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogEditLink.open"
      >
        <q-card style="width:400px">
          <q-card-section>
            <div class="text-h6">
              Vínculo
            </div>
            <q-select
              class="q-pa-sm"
              filled
              v-model="dialogEditLink.linkData" 
              label="Tipo de vínculo"
              option-label="label"
              :options="statusList"
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
          <q-card-section>
            <div class="text-h6">
              Congregação
            </div>
            <q-select
              class="q-pa-sm"
              filled
              v-model="dialogEditLink.organismData" 
              label="Escolha a congregação"
              option-label="name"
              :options="myOrganismsList"
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
          <q-card-section>
            <div class="text-h6"> 
              Datas
            </div>
            <q-input
              v-model="dialogEditLink.dates.initialDate"
              filled
              label="Data início"
              mask="##/##/####"
              class="q-pa-sm"
            >

            </q-input>
            <q-input
              v-model="dialogEditLink.dates.finalDate"
              filled
              mask="##/##/####"
              label="Data fim"
              class="q-pa-sm"
            >

            </q-input>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              label="Sair"
              color="primary"
              flat
              unelevated
              rounded
            />
            <q-btn
              label="Confirmar"
              color="primary"
              rounded
              @click="confirmEditLink"
              unelevated
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogAddLink.open"
      >
        <q-card style="width:400px">
          <q-card-section>
            <div class="text-h6">
              Vínculo
            </div>
            <q-select
              class="q-pa-sm"
              filled
              v-model="dialogAddLink.linkData" 
              label="Tipo de vínculo"
              option-label="label"
              :options="statusList"
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
          <q-card-section>
            <div class="text-h6">
              Congregação
            </div>
            <q-select
              class="q-pa-sm"
              filled
              v-model="dialogAddLink.organismData" 
              label="Escolha a congregação"
              option-label="name"
              :options="myOrganismsList"
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
          <q-card-section>
            <div class="text-h6"> 
              Datas
            </div>
            <q-input
              v-model="dialogAddLink.dates.initialDate"
              filled
              label="Data início"
              mask="##/##/####"
              class="q-pa-sm"
            >

            </q-input>
            <q-input
              v-model="dialogAddLink.dates.finalDate"
              filled
              mask="##/##/####"
              label="Data fim"
              class="q-pa-sm"
            >

            </q-input>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              label="Sair"
              color="primary"
              flat
              unelevated
              rounded
            />
            <q-btn
              label="Confirmar"
              color="primary"
              rounded
              @click="confirmAddLink"
              unelevated
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </q-page-container>
</template>

<script>
import useFetch from "src/boot/useFetch";
import utils from "../../boot/utils";
import { defineComponent } from "vue";
export default defineComponent({
  name:"Statistics",
  data() {
    return {
      tab: 'Dados pastorais',
      pastorDisable: false,
      organismDisable: false,
      financceDisable: false,
      pastorData: null,
      filter: '',
      pagination: {
        sortBy: '',
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: 'desc',
        descending: false,
        searchString: ''
      },
      isUser: true,
      hasSecretary: null,
      dialogEditChild: {
        open: false,
        child: null,
        iChild: null,
        newChild: null
      },
      usersOptions: null,
      dialogEditMaritalStatus: {
        open: false,
        status: null,
      },
      dialogEditSocialNetwork: {
        open: false,
        socialType: null,
        social: null,
        index: null
      },
      socialNetworkTypes: ['Instagram', 'Facebook', 'Youtube', 'Site pessoal'],
      profileTypeOptions: ['Pessoal', 'Profissional'],
      prefix: null,
      dialogAddNewSocialNetwork: {
        open: false,
        socialType: '',
        name: '',
        type: ''
      },
      dialogAddNewChild: {
        open: false,
        child: null
      },
      dialogAddMaritalRelation: {
        open: false,
        partner: null,
        dates: {
          initialDate: '',
          finalDate: ''
        }
      },
      organismListTree: [],
      pastorLink: null,
      pastorFormations: null,
      pastorActivities: [
        { title:'Visitas Missionárias', quantity:'', people:'' },
        { title:'Visitas Pastorais', quantity:'', people:'' },
        { title:'Visitas Enfermos', quantity:'', people:'' }
      ],
      lastOrganismPastorActivities: [
        { title:'Visitas Missionárias', quantity:'', people:'' },
        { title:'Visitas Pastorais', quantity:'', people:'' },
        { title:'Visitas Enfermos', quantity:'', people:'' }
      ],
      dialogEditParentName: {
        open: false,
        user: null,
        parentType: null
      },
      dialogAddParent: {
        open: false,
        user: null,
        parentType: null
      },
      dialogEditFormation: {
        open: false,
        formation: null,
        date: null,
        course: null,
        index: null
      },
      coursesList: null,
      dialogAddFormation: {
        open: false,
        formation: null,
        date: null,
        course: null,
      },
      dialogEditLink: { 
        open: false,
        linkData: null,
        organismData: null,
        organismFunctionId: null,
        organismId: null,
        dates: null,
        index: null
      },
      dialogAddLink: { 
        open: false,
        linkData: null,
        organismData: null,
        organismFunctionId: null,
        dates: {
          initialDate: null,
          finalDate: null
        }
      },
      formationLevelsList: null,
      statusList: null,
      myOrganismsList: null
    }
  },

  beforeMount() {
    this.getUserData()
    this.getPastorDataTabs()
    this.verifyQuery()
    // this.verifyIfIsPastor()
    this.getPastorFormations()
    this.getPastorDataTabs()
    this.getPastorLinks()
    this.getMyOrganismsList()
  },
  methods: {
    clearDialogAddLink() {
      this.dialogAddLink = {
        open: false,
        linkData: null,
        organismData: null,
        organismFunctionId: null,
        dates: {
          initialDate: null,
          finalDate: null
        }
      }
    },
    confirmAddLink() {
      this.pastorLink.push({
        organismId: this.dialogAddLink.organismData._id,
        organismData: {
          city: this.dialogAddLink.organismData.city,
          name: this.dialogAddLink.organismData.name,
          state: this.dialogAddLink.organismData.state
        },
        linkData: {
          _id: this.dialogAddLink.linkData._id,
          label: this.dialogAddLink.linkData.label,
          dates: {
            initialDate: this.dialogAddLink.dates.initialDate,
            finalDate: this.dialogAddLink.dates.finalDate
          }
        }
      })
      this.clearDialogAddLink()
    },
    verifyQuery() {
      let qry = this.$route.query.t
      if (qry) {
        if (qry === 'p') {
          this.tab = 'Dados pastorais'
          this.organismDisable = true,
          this.financceDisable = true
        } else if (qry === 'c') {
          this.tab = 'Dados congregacionais'
          this.financceDisable = true
          this.pastorDisable = true
        }  else if (qry === 'f') {
          this.tab = 'Dados financeiros'
          this.pastorDisable = true
          this.organismDisable = true
        }
      }
    },
    addNewLink() {
      this.dialogAddLink.open = true
      this.getStatusList()
    },
    clearDialogEditLink() {
      this.dialogEditLink = { 
        open: false,
        linkData: null,
        organismData: null,
        organismFunctionId: null,
        organismId: null,
        dates: null,
        index: null
      }
    },
    confirmEditLink() {
      this.pastorLink[this.dialogEditLink.index]  = {
        linkData: {
          _id: this.dialogEditLink.linkData._id,
          label: this.dialogEditLink.label,
          dates: {
            initialDate: this.dialogEditLink.dates.initialDate,
            finalDate: this.dialogEditLink.dates.finalDate
          }
        },
        organismData: {
          city: this.dialogEditLink.organismData.city,
          name: this.dialogEditLink.organismData.name,
          state: this.dialogEditLink.organismData.state
        },
        organismId: this.dialogEditLink.organismId
      }
      this.clearDialogEditLink()
    },
    clearDialogAddFormation() {
      this.dialogAddFormation = {
        open: false,
        formation: null,
        date: null,
        course: null,
      }
    },
    confirmAddFormation() {
      this.pastorFormations.push({
        formation: {
          conclusionYear: this.dialogAddFormation.date,
          course: this.dialogAddFormation.formation.label,
          courseId: this.dialogAddFormation.formation._id,
          level: this.dialogAddFormation.course.label,
          levelId:  this.dialogAddFormation.course._id
        }
      })
      this.clearDialogAddFormation()
    },
    clearDialogEditFormation() {
      this.dialogEditFormation = {
        open: false,
        formation: null,
        date: null,
        course: null,
        index: null
      }
    },
    confirmEditFormation() {
      this.pastorFormations[this.dialogEditFormation.index].formation.course = 
      this.dialogEditFormation.formation.label
      this.pastorFormations[this.dialogEditFormation.index].formation.courseId = 
      this.dialogEditFormation.formation._id
      this.pastorFormations[this.dialogEditFormation.index].formation.conclusionYear =
      this.dialogEditFormation.date
      this.pastorFormations[this.dialogEditFormation.index].formation.level =
      this.dialogEditFormation.course.label
      this.pastorFormations[this.dialogEditFormation.index].formation.levelId =
      this.dialogEditFormation.course._id
      this.clearDialogEditFormation()
    },
    editLink(link, i) {
      this.getStatusList()
      this.dialogEditLink.linkData = {
        label: link.linkData.label,
        _id: link.linkData._id
      },
      this.dialogEditLink.organismData = {
        city: link.organismData.city,
        name: link.organismData.name,
        state: link.organismData.state
      },
      this.dialogEditLink.organismFunctionId = link.organismFunctionId,
      this.dialogEditLink.organismId = link.organismId,
      this.dialogEditLink.dates = {
        initialDate: link.linkData.dates.initialDate,
        finalDate: link.linkData.dates.finalDate
      },
      this.dialogEditLink.index = i
      this.dialogEditLink.open = true
    },
    removeLink(i) {
      this.pastorLink.splice(i, 1)
    },
    addFormation() {
      this.getCoursesList()
      this.getFormationLevelsList()
      this.dialogAddFormation.open = true
    },
    removeFormation(i) {
      this.pastorFormations.splice(i, 1)
    },
    getFormationLevelsList() {
      const opt = {
        route: '/desktop/statistics/getFormationLevel',
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify(r.errorMessage);
          return;
        }
          this.formationLevelsList = r.data
      });
    },
    getMyOrganismsList() {
      const opt = {
        route: '/desktop/statistics/getMyOrganismsList',
      }
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if (r.error) {
          this.$q.notify(r.errorMessage);
          return;
        }
          this.myOrganismsList = r.data;
      });
    },
    getStatusList() {
      const opt = {
        route: '/desktop/statistics/getStatusList',
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify(r.errorMessage);
          return;
        }
          this.statusList = r.data
      });
    },
    getCoursesList() {
      const opt = {
        route: '/desktop/statistics/getFormationType',
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify(r.errorMessage);
          return;
        }
        this.coursesList = r.data
      });
    },
    editFormation(formation, i) {
      this.getCoursesList()
      this.getFormationLevelsList()
      let data = {...formation}
      this.dialogEditFormation.formation = data.formation.course
      this.dialogEditFormation.date = data.formation.conclusionYear
      this.dialogEditFormation.course = data.formation.level
      this.dialogEditFormation.index = i
      this.dialogEditFormation.open = true
    },
    clearDialogAddParent() {
      this.dialogAddParent = {
        open: false,
        user: null,
        parentType: null
      }
    },
    confirmAddParent() {
      if (this.dialogAddParent.parentType === 'Pai') {
        this.pastorData.father.userName = this.dialogAddParent.user.userName
        this.pastorData.father._id = this.dialogAddParent.user._id
      } else if (this.dialogAddParent.parentType === 'Mãe') {
        this.pastorData.mother.userName = this.dialogAddParent.user.userName
        this.pastorData.mother._id = this.dialogAddParent.user._id
      }
      this.clearDialogAddParent()
    },
    addParent(type) {
      this.dialogAddParent.parentType = type,
      this.dialogAddParent.open = true
    },
    removeParent(type) {
      // console.log(type)
      if (type === 'Pai') {
        this.pastorData.father._id = null,
        this.pastorData.father.userName = null
      } else if (type === 'Mãe') {
        this.pastorData.mother._id = null,
        this.pastorData.mother.userName = null
      }
    },
    clearDialogParent() {
      this.dialogEditParentName = {
        open: false,
        user: null,
        parentType: null
      }
    },
    confirmEditParent() {
      if (this.dialogEditParentName.parentType === 'Pai') {
        this.pastorData.father._id = this.dialogEditParentName.user._id,
        this.pastorData.father.userName = this.dialogEditParentName.user.userName
      } else if (this.dialogEditParentName.parentType === 'Mãe') {
        this.pastorData.mother._id = this.dialogEditParentName.user._id,
        this.pastorData.mother.userName = this.dialogEditParentName.user.userName
      } 
      this.clearDialogParent()
    },
    editParentName(parentType) {
      this.dialogEditParentName.open = true,
      this.dialogEditParentName.user = {
        userName: this.pastorData.father.userName,
        _id: this.pastorData.father._id
      }
      this.dialogEditParentName.parentType = parentType
    },
    clkParent (organismParentId) {
      this.$router.push("/user/userOrganismDetail?organismId=" + organismParentId);
    },
    nextPage(e) {
      this.pagination.page = e.pagination.page;
      this.pagination.sortBy = e.pagination.sortBy;
      this.pagination.rowsPerPage = e.pagination.rowsPerPage;
      this.getFinanceStatisticByOrganismId();
    },
    saveAllEntriesAndOutputs() {
      this.allEntries = this.organismsFinancesStatistics.map(row => ({ ...row }));
    },
    getPastorFormations() {
      const opt = {
        route: '/desktop/statistics/getPastorFormationStatistic'
      }
      useFetch(opt).then((r) => {
        this.pastorFormations = r.data
      })
    },
    getPastorLinks() {
      const opt = {
        route: '/desktop/statistics/getPastorLinkStatistic'
      }
      useFetch(opt).then((r) => {
        if (r.error) return
        this.pastorLink = r.data
      })
    },
    clkAddNewSocialNetwork() {
      this.dialogAddNewSocialNetwork.open = true
    },
    clearDialogEditSocialNetwork() {
      this.dialogEditSocialNetwork = {
        open: false,
        socialType: null,
        social: null,
        index: null
      }
    },
    confirmChangeSocialNetwork() {
      this.pastorData.social.value[this.dialogEditSocialNetwork.index].name = 
      this.dialogEditSocialNetwork.social.name
      this.pastorData.social.value[this.dialogEditSocialNetwork.index].selectedSocialType = 
      this.dialogEditSocialNetwork.social.selectedSocialType
      this.pastorData.social.value[this.dialogEditSocialNetwork.index].type = 
      this.dialogEditSocialNetwork.social.type
      this.clearDialogEditSocialNetwork()
    },
    removeSocialNetwork(iSocial) {
      this.pastorData.social.value.splice(iSocial, 1)
    },
    clearDialogAddMaritalRelation() {
      this.dialogAddMaritalRelation.open = false,
      this.dialogAddMaritalRelation.partner = null,
      this.dialogAddMaritalRelation.dates = {
        initialDate: '',
        finalDate: ''
      }
    },
    confirmAddMaritalRelation() {
      this.pastorData.maritalRelation.partner = {
        _id: this.dialogAddMaritalRelation.partner._id,
        userName: this.dialogAddMaritalRelation.partner.userName,
        dates: {
          initialDate: this.dialogAddMaritalRelation.dates.initialDate,
          finalDate:  this.dialogAddMaritalRelation.dates.finalDate
        }
      }
      this.clearDialogAddMaritalRelation()
    },
    addMaritalRelation() {
      this.dialogAddMaritalRelation.open = true
    },
    removeMaritalRelation() {
      this.pastorData.maritalRelation.partner = null
    },
    removeChild(iChild) {
      this.pastorData.parentalRelation.child.splice(iChild, 1)
    },
    clearDialogAddNewChild() {
      this.dialogAddNewChild.open = false,
      this.dialogAddNewChild.child = null
    },
    confirmAddNewChild() {
      this.pastorData.parentalRelation.child.push({
        _id: this.dialogAddNewChild.child._id,
        userName: this.dialogAddNewChild.child.userName
      })
      this.clearDialogAddNewChild()
    },
    clkAddNewChild() {
      this.dialogAddNewChild.open = true
    },
    clearDialogAddNewSocialNetwork() {
      this.dialogAddNewSocialNetwork.open = false,
      this.dialogAddNewSocialNetwork.socialType = '',
      this.dialogAddNewSocialNetwork.name  = '',
      this.dialogAddNewSocialNetwork.type = ''
    },
    confirmAddNewSocialNetwork() {
      if (!this.pastorData.social.value) {
        this.pastorData.social.value = []
      }
      this.pastorData.social.value.push({
        name: this.dialogAddNewSocialNetwork.name,
        selectedSocialType: this.dialogAddNewSocialNetwork.socialType,
        type: this.dialogAddNewSocialNetwork.type
      })
      this.clearDialogAddNewSocialNetwork()
    },
    editSocialNetwork(social, iSocial) {
      this.dialogEditSocialNetwork.open = true
      this.dialogEditSocialNetwork.social = {...social},
      this.dialogEditSocialNetwork.index = iSocial
    },
    confirmEditMaritalRelation() {
      this.dialogEditMaritalStatus.status
      this.pastorData.maritalRelation.partner = {
        _id: this.dialogEditMaritalStatus.status.userName._id,
        userName: this.dialogEditMaritalStatus.status.userName.userName,
        dates: {
          initialDate: this.dialogEditMaritalStatus.status.dates.initialDate,
          finalDate: this.dialogEditMaritalStatus.status.dates.finalDate
        }
      },
      this.dialogEditMaritalStatus.open = false,
      this.dialogEditMaritalStatus.status = null
    },
    editMaritalStatus(data) {
      this.dialogEditMaritalStatus.open = true
      let info = {...data}
      this.dialogEditMaritalStatus.status = info
    },
    confirmChangeChild() {
      this.pastorData.parentalRelation.child[this.dialogEditChild.iChild] =  {
        _id: this.dialogEditChild.newChild._id,
        userName: this.dialogEditChild.newChild.userName
      }
      this.dialogEditChild.open = false
      this.dialogEditChild.newChild = null,
      this.dialogEditChild.child = null
    },
    openDialogEditChild(child, iChild) {
      this.dialogEditChild.open = true,
      this.dialogEditChild.child = child,
      this.dialogEditChild.newChild = child
      this.dialogEditChild.iChild = iChild
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
          this.usersOptions = r.data.list;
        })
      });
    },
    getUserData() {
      const opt = {
        route: "/desktop/commonUsers/getMyOrganisms",
        body: {
          searchString: this.filter,
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage,
          isActive: 1
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        this.userData = r.data.list
      })
    },
    verifyIfIsPastor() {
      const userInfo = utils.presentUserInfo()
      if (userInfo.userType === 'pastor') {
        this.isUser = false
        this.getPastorDataTabs()
      } else {
        this.isUser = true
      }
    },
    getPastorDataTabs() {
      const opt = {
        route: '/desktop/statistics/getPastorStatisticsData'
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente')
        } else {
          this.pastorData = r.data
        }
      })
    }
  }
})
</script>

<style scoped>
.card-finance-table{
  border-radius: .5rem;
  
}
.custom-border {
  border: 1px solid #027be3;
}
</style>
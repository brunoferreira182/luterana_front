<template>
  <q-page-container class="no-padding">
    <q-page> 
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs align="center">
          <q-breadcrumbs-el 
            style="cursor: pointer;" 
            icon="home" 
            label="Introdução" 
            @click="$router.back()"          
          />
            <q-breadcrumbs-el label="Gestão paroquial" />
        </q-breadcrumbs>
      </div>
      <!-- <div class="q-pa-md text-center">
        <div class="text-capitalize"> 
          <div class="row">
            <q-btn 
              class="text-left col-2"
              unelevated
              icon="arrow_back"
              size="large"
              @click="$router.back()"
            >
              <q-tooltip>
                Voltar para introdução
              </q-tooltip>
            </q-btn>
            <div class="text-h5 col-6">
              Dados Pastorais
            </div>
          </div>
        </div>
      </div> -->
      <div>
        <div>
          <div class="text-h5 q-px-md">Dados pessoais</div>
          <div 
            class="text-h6 q-mt-sm q-px-md text-wrap"
          >
            Revise seus dados pessoais.
          </div>
          <div class="q-px-md text-h6">
            Obs.: Insira somente redes sociais pessoais, deixe em branco caso não tenha.
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
              class="q-px-md q-mx-md"
              :label="data.label"
              :rules="data.label === 'Nome' || data.label === 'Contato' ? [val => !!val || '* Campo obrigatório'] : []"
              v-model="data.value"
              :mask="data.mask"
              
              :readonly="status && status.value === 'sent'"
            />
            <div 
              v-if="data.label === 'Redes sociais'"
              class="q-mx-lg"
            >
              <div class="q-mx-sm">
                <div class="text-h6">
                  {{data.label}}
                </div>
                <q-item 
                  class="bg-grey-2"
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
                    <q-item-label
                      v-if="!status || (status && status.value !== 'sent')"
                    >
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
                v-if="!status || (status && status.value !== 'sent')"
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
            <div
              v-if="data.label === 'Pai'"
              class="q-mx-lg q-px-md q-py-sm"
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
                  <q-item-label v-if="!status || (status && status.value !== 'sent')">
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
                  v-if="!status || (status && status.value !== 'sent')"
                  icon="add"
                  rounded
                  :label="data.label"
                  flat
                  color="primary"
                  @click="addParent(data.label)"
                />
              </div>
            </div>
            <div
              v-if="data.label === 'Mãe'"
              class="q-mx-lg q-px-md"
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
                  <q-item-label
                    v-if="!status || (status && status.value !== 'sent')"
                  >
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
              <div v-if="!data.userName && (!status || (status && status.value !== 'sent'))">
                <q-btn
                  icon="add"
                  :label="data.label"
                  flat
                  rounded
                  @click="addParent(data.label)"
                  color="primary"
                />
              </div>
            </div>
            <div v-if="data.label === 'Relação conjugal'" class="q-mx-lg q-px-sm q-py-sm">
              <div class="q-mx-sm">
                <div class="text-h6">
                  Estado civil
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
                  <q-item-section side
                    v-if="!status || (status && status.value !== 'sent')"
                  >
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
                v-if="(!pastorData.maritalRelation.partner || !pastorData.maritalRelation.partner.userName) && (!status || (status && status.value !== 'sent'))"
                color="primary"
                flat
                rounded
                icon="add"
                label="Adicionar"
                @click="addMaritalRelation"
              >
                <q-tooltip>Adicionar cônjuge</q-tooltip>
              </q-btn>
            </div>
            <div v-if="data.label === 'Filhos'" class="q-mx-lg q-mt-md q-px-sm">
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
                  <q-item-section 
                    side
                    v-if="!status || (status && status.value !== 'sent')"
                  >
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
                v-if="!status || (status && status.value !== 'sent')"
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
          <div class="text-h5 q-px-md">Vida pastoral</div>
          <div class="text-h6 q-pa-md text-wrap">
            Confirme seu histórico acadêmico e ministerial.
          </div>
          <div>
            <div class="q-mx-lg q-mt-md q-px-sm text-h6">Formações</div>
            <q-list>
              <q-item
                style="border-radius: 1rem;"
                class="q-ma-md bg-grey-2"
                v-for="(formation) in pastorFormations"
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
              </q-item>
            </q-list>
            <div 
              class="q-ml-lg"
              v-if="!status || (status && status.value !== 'sent')"
            >
              <q-btn
                color="primary"
                icon="sync_problem"
                label="Solicitar alteração/correção"
                flat
                @click="reportError('formations')"
                rounded
              >
                <q-tooltip>Solicitar alteração/correção</q-tooltip>
              </q-btn>
            </div>
          </div>
          <div>
            <div class="q-mx-lg q-mt-md q-px-sm text-h6">Histórico de vínculos</div>
            <q-list>
              <q-item 
                style="border-radius: 1rem;"
                class="q-ma-md bg-grey-2"
                v-for="(link) in pastorLink"
                :key="link"
              >
                <q-item-section class="q-pa-sm">
                  <q-item-label lines="1">
                    {{ link.functionData.name }} 
                  </q-item-label>
                  <q-item-label lines="2">
                    {{ link.organismData.name }} - {{ link.organismData.configName }}
                  </q-item-label>
                  <q-item-label lines="3">
                    Data início: {{ link.functionData.dates.initialDate }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <div>
              <q-btn
              class="q-mx-lg q-my-sm"
              label="Solicitar alteração/correção"
              icon="sync_problem"
              flat
              rounded
              v-if="!status || (status && status.value !== 'sent')"
              color="primary"
              @click="reportError('historic')"
            >
              <q-tooltip>Solicitar alteração/correçãoo</q-tooltip>
            </q-btn>
            </div>
          </div>
          <q-separator class="q-ma-sm q-my-md"/>
        </div>
        <div>
          <div class="text-h5 q-mx-md">Visitas</div>
          <div class="text-h6 text-wrap">
            <div class="text-h6 q-mb-md q-pa-md text-wrap">
              Preencha as visitas realizadas em 2023. Caso tenha trocado de congregação ao longo do ano de 2023, insira somente os dados de visitação da atual congregação/paróquia. No final do bloco, há um campo para inserir os dados da congregação anterior. 
            </div>
          </div>
          <div>
            <q-item 
              v-for="item in pastorActivities" 
              :key="item"
            >
              <q-item-section>
                <p class="no-margin text-h6"> {{item.title}}</p>
                <div class="row q-gutter-x-md" > 
                  <div class="col">
                    <q-input  
                      v-model="item.quantity" 
                      label="Qtde de visitas"
                      type="number"
                      error-message="* Campo obrigatório"
                      :error="item.validatePastorActivities"
                      :rules="[val => !!val]"
                      :readonly="status && status.value === 'sent'"
                    />
                  </div>
                  <div class="col">
                    <q-input  
                      v-model="item.people" 
                      label="Qtde de pessoas"
                      type="number"
                      error-message="* Campo obrigatório"
                      :error="item.validatePastorActivities"
                      :rules="[val => !!val]"
                      :readonly="status && status.value === 'sent'"
                    />
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </div>
          <!-- <div class="q-ml-md">
            <q-checkbox v-model="checkbox">
              Trocou de congregação em 2023?
            </q-checkbox>
          </div> -->
          <!-- <div class="q-ml-md text-h6 q-pa-md">
            Caso venha de outra congregação, clique no botão abaixo para preencher os dados de visitação
          </div> -->
          <div>
            <q-btn
              v-if="!status || (status && status.value !== 'sent')"
              label="Preencher dados da  congregação anterior"
              unelevated
              icon="description"
              no-caps
              flat
              rounded
              class="q-pa-sm q-ma-md"
              color="primary"
              @click="openDialogLastPastoralActivity"
            />
            <q-card class="q-mx-md" v-if="dialogLastPastoralActivity.selectedOrganism || dialogLastPastoralActivity.selectedOrganism !== ''">
              <q-card-section>
                <div class="text-h6">Dados anteriores</div>
                <div class="text-subtitle2">{{ dialogLastPastoralActivity.selectedOrganism }}</div>
                <div class="text-subtitle2">{{ dialogLastPastoralActivity.selectedCity }}</div>
              </q-card-section>
            </q-card>
          </div>
          <!-- <div v-if="checkbox">
            <div class="text-h6 q-mb-md q-mx-md q-pa-sm">
              Preencha as informações das visitas que fizeste em 2023 no local anterior:
            </div>
            <q-item 
              v-for="item in lastOrganismPastorActivities" 
              :key="item"
            >
              <q-item-section>
                <p class=" q-pl-lg no-margin"> {{item.title}}</p>
                <div class="row q-pa-sm q-pl-lg q-gutter-md" > 
                  <q-input  v-model="item.quantity" label="Qtde de visitas">
                  </q-input>
                  <q-input  v-model="item.people" label="Qtde de pessoas ">
                  </q-input>
                </div>
              </q-item-section>
            </q-item>
          </div> -->
        </div>
        <q-separator 
          class='q-mx-md q-my-sm'
        />
        <div 
          class="q-ma-lg" 
          v-if="!status || (status && status.value !== 'sent')"
        >
          <q-btn
            label="Salvar rascunho"
            class="full-width"
            color="primary"
            outline
            rounded
            no-caps
            @click="saveDraft"
          >
            <q-tooltip>
              Salvar rascunhor
            </q-tooltip>
          </q-btn>
          <q-btn
            label="Finalizar etapa"
            class="full-width q-my-md"
            color="green"
            rounded
            unelevated
            no-caps
            @click="saveOficial"
          />
        </div>
        <div
          v-else
          class="q-pa-md text-h6 text-center"
        >
          Esta etapa foi finalizada, os dados estão disponíveis somente para consulta.
        </div>
      </div>
      <q-dialog
        v-model="dialogEditChild.open"
      >
        <q-card style="width: 300px;border-radius:1rem">
          <q-card-section class="text-h6 text-center">
            Alterar usuário
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="dialogEditChild.newChild"
              label="Nome do usuário"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn 
              label="Sair" 
              color="primary" 
              no-caps
              unelevated 
              flat 
              rounded
              @click="cancelChangeChild"
            />
            <q-btn 
              label="Confirmar" 
              color="primary" 
              no-caps
              unelevated 
              rounded
              @click="confirmChangeChild"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogEditMaritalStatus.open"
      >
        <q-card style="width: 300px;border-radius:1rem">
          <q-card-section class="text-h6 text-center">
            Alterar relação
          </q-card-section>
          <q-card-section class="q-pa-sm">
            <q-input
              v-model="dialogEditMaritalStatus.status.userName"
              label="Nome do usuário"
            />
            <div class="text-h6 q-ma-sm">
              Datas:
            </div>
            <q-input
              v-model="dialogEditMaritalStatus.status.dates.initialDate"
              mask="##/##/####"
              class="q-mb-sm"
              label="Data inicial"
            />
            <q-input
              v-model="dialogEditMaritalStatus.status.dates.finalDate"
              mask="##/##/####"
              class="q-mb-sm"
              label="Data final"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              label="Depois"
              color="primary"
              flat
              no-caps
              rounded
              unelevated
            />
            <q-btn
              label="Confirmar"
              color="primary"
              @click="confirmEditMaritalRelation"
              no-caps
              rounded
              unelevated
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogEditSocialNetwork.open"
        @hide="clearDialogEditSocialNetwork"
      >
        <q-card style="width: 300px; border-radius: 1rem;">
          <q-card-section class="text-center text-h6">
            Alterar rede social
          </q-card-section>
          <q-card-section class="q-pa-sm">
            <q-select 
              v-model="dialogEditSocialNetwork.social.selectedSocialType"
              :options="socialNetworkTypes"
              label="Qual a rede social?"
              hint="Selecione a rede"
            />
          </q-card-section>
          <q-card-section 
            v-if="dialogEditSocialNetwork.socialType !== 'Site pessoal'"
            class="q-pa-sm"
          >
            <q-input 
              v-model="dialogEditSocialNetwork.social.name"
              label="Nome de perfil"
              hint="Seu nome de perfil na rede social"
            />
          </q-card-section>
          <q-card-section class="q-pa-sm">
            <q-select
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
              no-caps
              flat
              @click="clearDialogEditSocialNetwork"
              unelevated
              rounded
            />
            <q-btn
              label="Confirmar"
              no-caps
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
        <q-card style="width: 300px;border-radius:1rem ;">
          <q-card-section class="text-center text-h6">
            Adicionar rede social
          </q-card-section>
          <q-card-section class="q-pa-sm">
            <q-select 
              :options="socialNetworkTypes"
              v-model="dialogAddNewSocialNetwork.socialType"
              label="Qual a rede social?"
              hint="Selecione a rede"
            />
          </q-card-section>
          <q-card-section class="q-pa-sm">
            <q-input 
              v-model="dialogAddNewSocialNetwork.name"
              label="Nome de perfil"
              hint="Seu nome de perfil na rede social"
            />
          </q-card-section>
          <q-card-section class="q-pa-sm">
            <q-select
              v-model="dialogAddNewSocialNetwork.type"
              label="Tipo de rede"
              hint="Tipo de perfil"
              :options="profileTypeOptions"
            >
            </q-select>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              label="Sair"
              color="primary"
              no-caps
              flat
              unelevated
              rounded
              @click="clearDialogAddNewSocialNetwork"
            />
            <q-btn
              label="Confirmar"
              color="primary"
              no-caps
              @click="confirmAddNewSocialNetwork"
              rounded
              unelevated
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        @hide="clearDialogAddNewChild()"
        v-model="dialogAddNewChild.open"
      >
        <q-card style="width: 300px;border-radius: 1rem;">
          <q-card-section class="text-h6 text-center">
              Selecione o usuário
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="dialogAddNewChild.child"
              label="Nome do usuário"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              label="Sair"
              color="primary"
              flat
              no-caps
              @click="clearDialogAddNewChild"
              unelevated
              rounded
            />
            <q-btn
              label="Confirmar"
              no-caps
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
        <q-card style="width: 300px;border-radius: 1rem;">
          <q-card-section class="text-h6 text-center">
            Adicionar estado civil
          </q-card-section>
          <q-card-section class="q-pa-sm">
            <q-input
              v-model="dialogAddMaritalRelation.partner"
              label="Nome do usuário"
            />
            <div class="text-h6 q-pa-md">
              Datas:
            </div>
            <q-input
              mask="##/##/####"
              class="q-mb-sm"
              v-model="dialogAddMaritalRelation.dates.initialDate"
              label="Data inicial"
            />
            <q-input
              v-model="dialogAddMaritalRelation.dates.finalDate"
              class="q-mb-sm"
              mask="##/##/####"
              label="Data final"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              label="Sair"
              @click="clearDialogAddMaritalRelation"
              color="primary"
              flat
              no-caps
              unelevated
              rounded
            />
            <q-btn
              label="Confirmar"
              color="primary"
              no-caps
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
        <q-card style="width: 300px;border-radius: 1rem;">
          <q-card-section class="text-h6 text-center">
            Alterar usuário
          </q-card-section>
          <q-card-section class="q-pa-sm">
            <q-input
              v-model="dialogEditParentName.user.userName"
              label="Nome do usuário"
            >
            </q-input>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              label="Sair"
              no-caps
              @click="clearDialogParent"
              color="primary"
              flat
              unelevated
              rounded
            />
            <q-btn
              label="Confirmar"
              no-caps
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
          style="width: 300px;border-radius: 1rem;"
        >
          <q-card-section class="text-h6 text-center">
            Digite o nome
          </q-card-section>
          <q-card-section class="q-pa-sm">
            <q-input
              v-model="dialogAddParent.user"
              label="Nome do usuário"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              no-caps
              label="Sair"
              @click="clearDialogAddParent"
              color="primary"
              flat
              unelevated
              rounded
            />
            <q-btn
              label="Confirmar"
              no-caps
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
          <!-- <q-card-actions align="center">
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
          </q-card-actions> -->
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
      <q-dialog
        v-model="dialogReportError.open"
      >
        <q-card style="width: 400px;">
          <q-card-section class="text-h6 text-center">
            Informe a alteração:
          </q-card-section>
          <q-card-section>
            <q-input
              type="textarea"
              label="Informe a alteração"
              v-model="dialogReportError.text"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              rounded
              color="primary"
              label="Sair"
              no-caps
              unelevated
              @click="clearDialogReportError"
            />
            <q-btn
              rounded
              color="primary"
              unelevated
              label="Confirmar"
              no-caps
              @click="confirmReportError"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogLastPastoralActivity.open"
        @hide="clearDialogLastPastoralActivity"
      >
        <q-card style="width: 480px; border-radius: 1rem;">
          <q-card-section> 
            <div class="text-center text-h6">
              Selecione a congregação
            </div>
            <q-input
              class="q-px-md"
              label="Informe a cidade"
              v-model="dialogLastPastoralActivity.selectedCity"
            />
            <q-select   
              class="q-px-md"
              v-if="dialogLastPastoralActivity.selectedCity !== ''"
              label="selecione a congregação"
              v-model="dialogLastPastoralActivity.selectedOrganism"
              hint="Busque pelo nome"
              option-label="organismName"
              emit-value
              use-input
              map-options
              @filter="getCongregationsByString"
              :options="organismList"
              :readonly="status && status.value === 'sent'"
            >
          </q-select>
          </q-card-section>
          <q-card-section>
            <div class="text-h6">
              Preencha os dados de visitação:
            </div>
            <q-item 
              v-for="item in dialogLastPastoralActivity.lastOrganismPastorActivities" 
              :key="item"
              class="q-mt-md"
            >
              <q-item-section>
                <p class="text-left q-pl-lg no-margin"> <strong>{{item.title}}</strong></p>
                <q-item-label class="row q-pa-sm q-pl-lg q-gutter-md" > 
                  <q-input 
                    v-model="item.quantity" 
                    label="Qtde de visitas"
                    error-message="* Campo obrigatório"
                    :error="item.validatePastorActivities"
                    type="number"
                    :readonly="status && status.value === 'sent'"
                    :rules="[val => !!val]"
                  />
                  <q-input  
                    v-model="item.people" 
                    label="Qtde de pessoas "
                    error-message="* Campo obrigatório"
                    type="number"
                    :error="item.validatePastorActivities"
                    :rules="[val => !!val]"
                    :readonly="status && status.value === 'sent'"
                  />
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              color="primary"
              flat
              rounded
              unelevated
              no-caps
              label="Sair"
              @click="clearDialogLastPastoralActivity"
            />
            <q-btn
              v-if="!status || (status && status.value !== 'sent')"
              color="primary"
              rounded
              unelevated
              no-caps
              label="Confirmar"
              @click="addLastPastoralActivity"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </q-page-container>
</template>

<script>
// import { format } from "quasar";
import useFetch from "src/boot/useFetch";
// import utils from "../../boot/utils";
import { defineComponent } from "vue";
export default defineComponent({
  name:"PastorData",
  data() {
    return {
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
      pastorLink: [],
      pastorFormations: [],
      pastorActivities: [
        { title:'Visitas Missionárias', quantity:'', people:'' },
        { title:'Visitas Pastorais', quantity:'', people:'' },
        { title:'Visitas a Enfermos', quantity:'', people:'' }
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
      myOrganismsList: null,
      dialogReportError: {
        open: false,
        type: null,
        text: ''
      },
      reportedErrors: [],
      dialogLastPastoralActivity: {
        open: false,
        selectedOrganism: '',
        selectedCity: '',
        lastOrganismPastorActivities: [
        { title:'Visitas Missionárias', quantity:'', people:'' },
        { title:'Visitas Pastorais', quantity:'', people:'' },
        { title:'Visitas Enfermos', quantity:'', people:'' }
        ],
      },
      filterValue: '',
      organismList: null,
      lastOrganismPastorActivities: null,
      paroquiaId: null,
      validated: false,
      status: null,
      validatePastorActivities: true,
      canSaveDraft: true,
      saveOnUnmount: true
    }
  },

  beforeMount() {
    this.getMyOrganismsList()
    this.getParoquiaId()
    this.getPastorLinks()
    this.startTimerToSaveDraft();
  },

  beforeUnmount() {
    this.stopTimerToSaveDraft()
    if (this.validated && (this.status && this.status.value === 'sent')) return
    if (!this.canSaveDraft) return
    // if (this.saveOnUnmount) this.saveDraftOnBeforeUnmount()
  },
  methods: {
    startTimerToSaveDraft() {
      this.timerToSave = true;
      this.methodToSaveTimerDraft();
    },
    stopTimerToSaveDraft() {
      this.timerToSave = false;
      clearTimeout(this.timerId);
    },
    methodToSaveTimerDraft() {
      if (this.timerToSave) {
        this.timerId = setTimeout(() => {
          this.saveDraft();
          this.methodToSaveTimerDraft(); 
        }, 300000);
      }
    },
    cancelChangeChild () {
      this.dialogEditChild = {
        open: false,
        child: null,
        iChild: null,
        newChild: null
      }
    },
    clearDialogLastPastoralActivity() {
      this.dialogLastPastoralActivity.open = false
    },
    getParoquiaId() {
      const opt = {
        route: '/desktop/statistics/getParoquiaIdByUserId',
      }
      useFetch(opt).then((r) => {
        if (r.error) return
        this.paroquiaId = r.data.organismId
        this.getPastorDataTabs()
      })
    },
    async saveOficial() {
      if(this.pastorData.name.value === '' || this.pastorData.contact.value === '' ) {
        this.$q.notify('Preencha seu nome e fone para contato')
        return
      }
      const pastorActivities = this.pastorActivities;
      for (const activity of pastorActivities) {
        if (!activity.quantity || !activity.people) {
          activity.validatePastorActivities = this.validatePastorActivities
          this.$q.notify('Preencha todos os campos de visitas em Atividade pastoral');
          return;
        }
        else {
          activity.validatePastorActivities = false
        }
      }

      let regex = /\s/;
      let pastorName = null
      let fatherName = null
      let motherName = null
      let partnerName = null
      let x = 0
      if (this.pastorData && this.pastorData.name && this.pastorData.name.value) {
        pastorName = this.pastorData.name.value
      } 
      if (this.pastorData && this.pastorData.father && this.pastorData.father.userName) {
        fatherName = this.pastorData.father.userName
      } 
      if (this.pastorData && this.pastorData.mother && this.pastorData.mother.userName) {
        motherName = this.pastorData.mother.userName
      } 
      if ( this.pastorData && this.pastorData.maritalRelation && this.pastorData.maritalRelation.partner && this.pastorData.maritalRelation.partner.userName) {
        partnerName = this.pastorData.maritalRelation.partner.userName
      } 

      if (pastorName) {
        if (!regex.test(pastorName)) {
          this.$q.notify('Coloque ao menos um sobrenome em seu nome');
          x = 1
          return;
        }
      } 
      if (fatherName) {
        if (!regex.test(fatherName)) {
          this.$q.notify('Coloque ao menos um sobrenome no nome de seus familiares');
          x = 1
          return;
        }
      } 
      if (motherName) {
        if (!regex.test(motherName)) {
          this.$q.notify('Coloque ao menos um sobrenome no nome de seus familiares');
          x = 1
          return;
        }
      } 
      if (partnerName) {
        if (!regex.test(partnerName)) {
          this.$q.notify('Coloque ao menos um sobrenome no nome de seus familiares');
          x = 1
          return;
        } 
      }
      if (this.pastorData && this.pastorData.parentalRelation && this.pastorData.parentalRelation.child && this.pastorData.parentalRelation.child.length > 0) {
        this.pastorData.parentalRelation.child.forEach((child) => {
          if (child && child.userName) {
            if (!regex.test(child.userName)) {
              this.$q.notify('Coloque ao menos um sobrenome no nome de seus familiares')
              x = 1
              return
            }
          }
        })
      }
      if (x === 0) {
        let pastoralData = {
          pastorData: this.pastorData,
          pastorFormations: this.pastorFormations,
          pastorLinks: this.pastorLink,
          pastorActivities: this.pastorActivities,
          lastPastorActivities: this.lastOrganismPastorActivities,
          reportedErrors: this.reportedErrors
        }
        let opt = {
          route: '/desktop/statistics/insertPastoralStatisticsDraft',
          body: {
            pastoralData: pastoralData,
            organismId: this.paroquiaId
          }
        }
        this.$q.loading.show()
        let r = await useFetch(opt)
        this.$q.loading.hide()
        if  (r.error) {
          this.$q.notify('Ocorreu um erro. Tente novamente.')
          return
        }
        opt = {
          route: '/desktop/statistics/insertPastoralStatisticsDone',
          body: {
            organismId: this.paroquiaId
          }
        }
        this.$q.loading.show()
        useFetch(opt).then((r) => {
          this.$q.loading.hide()
          if (r.error) {
            this.$q.notify('Ocorreu um erro. Tente novamente.')
            return
          }
          this.$q.notify('Dados salvos com sucesso.')
          this.saveOnUnmount = false
          this.$router.back();
          // this.$q.notify('Finalizando etapa...')
        })
        this.canSaveDraft = false
        const promisses = [
          this.getPastorDataTabs(),
          this.getMyOrganismsList(),
          this.getParoquiaId()
        ]
        await Promise.all(promisses)
        setTimeout(() => {
          this.$q.loading.hide()
          this.$q.notify('Etapa finalizada.')
          this.$router.back();
        }, 2000)
      }
    },
    addLastPastoralActivity() {
      const lastOrganismPastorActivities = this.dialogLastPastoralActivity.lastOrganismPastorActivities;
      for (const activity of lastOrganismPastorActivities) {
        if (!activity.quantity || !activity.people) {
          activity.validatePastorActivities = this.validatePastorActivities
          this.$q.notify('Preencha todos os campos nos dados de visitação');
          return;
        }
        else{
          activity.validatePastorActivities = false
        }
      }
      if(!this.dialogLastPastoralActivity.selectedOrganism || this.dialogLastPastoralActivity.selectedOrganism === '' ){
        this.$q.notify('Selecione a congregação');
        return
      }
      this.lastOrganismPastorActivities = {
        selectedOrganism: this.dialogLastPastoralActivity.selectedOrganism._id,
        lastOrganismPastorActivities: this.dialogLastPastoralActivity.lastOrganismPastorActivities
      }
      this.dialogLastPastoralActivity.open = false
      
    },
    getCongregationsByString(val, update, abort) {
      if (val.length < 3) {
        this.$q.notify('Digite no mínimo 3 caracteres')
        abort()
        return
      }
      const opt = {
        route: '/desktop/statistics/getCongregacoesByString',
        body:{
          filterCity: this.dialogLastPastoralActivity.selectedCity,
          filterValue: val,
        }
      }
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        update(() => {
          this.organismList = r.data
        })
      })
    },
    openDialogLastPastoralActivity() {
      this.dialogLastPastoralActivity.open = true
    },
    confirmReportError() {
      const opt = {
        route: '/desktop/statistics/insertPastoralErrorReport',
        body: {
          reportData: this.dialogReportError.text
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) return
        this.$q.notify('Erro reportado com sucesso')
      })
      this.clearDialogReportError()
    },
    clearDialogReportError() {
      this.dialogReportError= {
        open: false,
        type: null,
        text: ''
      }
    },
    reportError(type) {
        this.dialogReportError.open = true,
        this.dialogReportError.type = type
    },
    saveDraftOnBeforeUnmount() {
      let regex = /\s/;
      let pastorName = null
      let fatherName = null
      let motherName = null
      let partnerName = null
      let x = 0
      if (this.pastorData && this.pastorData.name && this.pastorData.name.value) {
        pastorName = this.pastorData.name.value
      } else if (this.pastorData && this.pastorData.father && this.pastorData.father.userName) {
        fatherName = this.pastorData.father.userName
      } else if (this.pastorData && this.pastorData.mother && this.pastorData.mother.userName) {
        motherName = this.pastorData.mother.userName
      } else if ( this.pastorData && this.pastorData.maritalRelation && this.pastorData.maritalRelation.partner && this.pastorData.maritalRelation.partner.userName) {
        partnerName = this.pastorData.maritalRelation.partner.userName
      } 

      if (pastorName) {
        if (!regex.test(pastorName)) {
          this.$q.notify('Coloque ao menos um sobrenome em seu nome');
          x = 1
          return;
        }
      } else if (fatherName) {
        if (!regex.test(fatherName)) {
          this.$q.notify('Coloque ao menos um sobrenome no nome de seus familiares');
          x = 1
          return;
        }
      } else if (motherName) {
        if (!regex.test(motherName)) {
          this.$q.notify('Coloque ao menos um sobrenome no nome de seus familiares');
          x = 1
          return;
        }
      } else if (partnerName) {
        if (!regex.test(partnerName)) {
          this.$q.notify('Coloque ao menos um sobrenome no nome de seus familiares');
          x = 1
          return;
        } 
      }
      if (this.pastorData && this.pastorData.parentalRelation && this.pastorData.parentalRelation.child && this.pastorData.parentalRelation.child.length > 0) {
        this.pastorData.parentalRelation.child.forEach((child) => {
          if (child) {
            if (!regex.test(child)) {
              this.$q.notify('Coloque ao menos um sobrenome no nome de seus familiares')
              x = 1
              return
            }
          }
        })
      }
      if (x === 0)  {
        let pastoralData = {
          pastorData: this.pastorData,
          pastorFormations: this.pastorFormations,
          pastorLinks: this.pastorLink,
          pastorActivities: this.pastorActivities,
          lastPastorActivities: this.lastOrganismPastorActivities,
          reportedErrors: this.reportedErrors
        }
        const opt = {
          route: '/desktop/statistics/insertPastoralStatisticsDraft',
          body: {
            pastoralData: pastoralData,
            organismId: this.paroquiaId
          }
        }
        useFetch(opt).then((r) => {
          if  (r.error) return
          else this.$q.notify('Rascunho salvo com sucesso')
        })
      }
    },
    saveDraft() {
      let regex = /\s/;
      let pastorName = null
      let fatherName = null
      let motherName = null
      let partnerName = null
      let x = 0
      if (this.pastorData && this.pastorData.name && this.pastorData.name.value) {
        pastorName = this.pastorData.name.value
      } else if (this.pastorData && this.pastorData.father && this.pastorData.father.userName) {
        fatherName = this.pastorData.father.userName
      } else if (this.pastorData && this.pastorData.mother && this.pastorData.mother.userName) {
        motherName = this.pastorData.mother.userName
      } else if ( this.pastorData && this.pastorData.maritalRelation && this.pastorData.maritalRelation.partner && this.pastorData.maritalRelation.partner.userName) {
        partnerName = this.pastorData.maritalRelation.partner.userName
      } 

      if (pastorName) {
        if (!regex.test(pastorName)) {
          this.$q.notify('Coloque ao menos um sobrenome em seu nome');
          x = 1
          return;
        }
      } else if (fatherName) {
        if (!regex.test(fatherName)) {
          this.$q.notify('Coloque ao menos um sobrenome no nome de seus familiares');
          x = 1
          return;
        }
      } else if (motherName) {
        if (!regex.test(motherName)) {
          this.$q.notify('Coloque ao menos um sobrenome no nome de seus familiares');
          x = 1
          return;
        }
      } else if (partnerName) {
        if (!regex.test(partnerName)) {
          this.$q.notify('Coloque ao menos um sobrenome no nome de seus familiares');
          x = 1
          return;
        } 
      }
      if (this.pastorData && this.pastorData.parentalRelation && this.pastorData.parentalRelation.child && this.pastorData.parentalRelation.child.length > 0) {
        this.pastorData.parentalRelation.child.forEach((child) => {
          if (child) {
            if (!regex.test(child)) {
              this.$q.notify('Coloque ao menos um sobrenome no nome de seus familiares')
              x = 1
              return
            }
          }
        })
      }
      if (x === 0)  {
        let pastoralData = {
          pastorData: this.pastorData,
          pastorFormations: this.pastorFormations,
          pastorLinks: this.pastorLink,
          pastorActivities: this.pastorActivities,
          lastPastorActivities: this.lastOrganismPastorActivities,
          reportedErrors: this.reportedErrors
        }
        const opt = {
          route: '/desktop/statistics/insertPastoralStatisticsDraft',
          body: {
            pastoralData: pastoralData,
            organismId: this.paroquiaId
          }
        }
        useFetch(opt).then((r) => {
          if  (r.error) return
          else this.$q.notify('Rascunho salvo com sucesso')
          this.$router.back()
          this.getMyOrganismsList()
        })
      }
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
        this.pastorData.father.userName = this.dialogAddParent.user
      } else if (this.dialogAddParent.parentType === 'Mãe') {
        this.pastorData.mother.userName = this.dialogAddParent.user
      }
      this.clearDialogAddParent()
    },
    addParent(type) {
      this.dialogAddParent.parentType = type,
      this.dialogAddParent.open = true
    },
    removeParent(type) {
      if (type === 'Pai') {
        this.pastorData.father._id = null,
        this.pastorData.father.userName = null
      } else if (type === 'Mãe') {
        this.pastorData.mother._id = null,
        this.pastorData.mother.userName = null
        this.pastorData.mother.value = null
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
        this.pastorData.father.userName = this.dialogEditParentName.user.userName
      } else if (this.dialogEditParentName.parentType === 'Mãe') {
        this.pastorData.mother.userName = this.dialogEditParentName.user.userName
      } 
      this.clearDialogParent()
    },
    editParentName(parentType) {
      this.dialogEditParentName.parentType = parentType
      if (parentType === 'Pai') {
        this.dialogEditParentName.user = {
          userName: this.pastorData.father.userName
        }
      } else if (parentType === 'Mãe') {
        this.dialogEditParentName.user = {
          userName: this.pastorData.mother.userName
        }
      }
      this.dialogEditParentName.open = true
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
    getPastorFormations() {
      const opt = {
        route: '/desktop/statistics/getPastorFormationStatistic'
      }
      useFetch(opt).then((r) => {
        this.pastorFormations = r.data
      })
    },
    async getPastorLinks() {
      const opt = {
        route: '/desktop/statistics/getPastorLinkStatistic'
      }
      let r = await useFetch(opt)
      if (r.error) return
      this.pastorLink = r.data
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
        userName: this.dialogAddMaritalRelation.partner,
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
        userName: this.dialogAddNewChild.child
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
      this.pastorData.maritalRelation.partner = {
        userName: this.dialogEditMaritalStatus.status.userName,
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
        userName: this.dialogEditChild.newChild
      }
      this.dialogEditChild.open = false
      this.dialogEditChild.newChild = null,
      this.dialogEditChild.child = null
    },
    openDialogEditChild(child, iChild) {
      this.dialogEditChild.open = true,
      this.dialogEditChild.child = child.userName,
      this.dialogEditChild.newChild = child.userName
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
    getPastorDataTabs() {
      const opt = {
        route: '/desktop/statistics/getPastorStatisticsData',
        body: {
          organismId: this.paroquiaId
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente')
          return
        }
        this.validated = r.data.validated
        this.status = r.data.status
        this.pastorData = r.data.pastoralData.pastorData
        
        if (r.data.pastorFormations && r.data.pastorFormations.length > 0) {
          r.data.pastorFormations.forEach((formation) => {
            this.pastorFormations.push(formation)
          })
        }
        
        if (r.data.pastoralData.pastorActivities){
          this.pastorActivities = r.data.pastoralData.pastorActivities
        }
        
        if (r.data.pastoralData.lastPastorActivities) {
          this.lastOrganismPastorActivities = r.data.pastoralData.lastPastorActivities
          this.dialogLastPastoralActivity.lastOrganismPastorActivities = r.data.pastoralData.lastPastorActivities.lastOrganismPastorActivities
          this.dialogLastPastoralActivity.selectedOrganism = r.data.pastoralData.lastPastorActivities.selectedOrganismName
          this.dialogLastPastoralActivity.selectedCity = r.data.pastoralData.lastPastorActivities.selectedOrganismCity
          
          
        }
        
        if (r.data.pastoralData.pastorLinks) {
          this.pastorLink = r.data.pastoralData.pastorLinks
        }
        if (this.status && this.status.status === 'sent') this.saveOnUnmount = false
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
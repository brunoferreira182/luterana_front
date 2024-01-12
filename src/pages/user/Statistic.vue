<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md">
        <div class="text-capitalize"> 
          <div class="text-center text-h5 q-mb-sm">
            Estatística 2023
          </div>
          <q-tabs 
            class="bg-indigo-5 text-white shadow-2" 
            style="border-radius: .5rem"
            v-model="tab"
          >
            <q-tab 
              name="Dados pastorais" 
              icon="description" 
              label="Dados pastorais" 
            />
            <q-tab 
              name="Dados congregacionais" 
              icon="diversity_2" 
              label="Dados congregacionais"
            />
            <q-tab 
              name="Dados financeiros" 
              icon="request_quote" 
              label="Dados financeiros"
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
                    v-for="formation in pastorFormations"
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
                <q-separator class="q-ma-sm"/>
              </div>
              <div>
                <div class="text-h6 q-pa-sm q-pl-lg q-ml-sm">Histórico de vínculos</div>
                <q-list>
                  <q-item 
                    style="border-radius: 1rem;"
                    class="q-pa-sm q-ma-sm bg-grey-2"
                    v-for="link in pastorLink"
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
                  </q-item>
                </q-list>
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
          <q-tab-panel name="Dados congregacionais" class="q-ma-xm">
            <div class="text-h5 ">
              Este bloco é dedicado às congregações e paróquias.
            </div>
            <div>
              - Para correções, clique na canetinha ao lado da informação;
            </div>
            <div>
              - Caso não deseje concluir a seção no momento, salve as alterações no botão 'Salvar' Rascunho;
            </div>
            <div>
              - Ao terminar a conferência, clique em 'Seguir' para prosseguir.
            </div>
            <q-tree
              default-expand-all
              :nodes="organismListTree"
              node-key="label"
              ref="tree"
              no-transition
            >
              <template v-slot:default-header="prop">
                <div class=" items-center" v-if="prop.node.header">
                  <span class="text-weight-bold text-primary">
                    {{ prop.node.label }}
                  </span>
                  <q-btn
                    icon="navigate_next"
                    round
                    unelevated
                    color="primary"
                    flat
                    v-on:click.stop="clkParent(prop.node.organismId)"
                  >
                    <q-tooltip>Entrar no detalhe do(a) {{ prop.node.type }}</q-tooltip>
                  </q-btn>
                  <div v-if="prop.node.type === 'Congregação'">
                    Data de fundação: {{ prop.node.fundationDate ? prop.node.fundationDate : 'não informado' }}
                    <div>
                      Filiada: {{ prop.node.isFiliated ? prop.node.isFiliated : 'não informado' }}
                    </div>
                    <div>
                      É sede: {{ prop.node.isHeadOffice ? prop.node.isHeadOffice : 'não informado' }}
                    </div>
                  </div>
                  <div v-if="prop.node.type === 'Paróquia'">
                    A paróquia tem secretário(a) contratado? 
                    <q-checkbox
                      class="q-pt-lg"
                      v-model="hasSecretary"
                      label="Sim"
                    />
                    <q-checkbox
                      class="q-pt-lg"
                      v-model="hasSecretary"
                      label="Não"
                    />
                  </div>
                </div>
                <div class="items-center" v-else>
                  <q-icon
                    v-if="prop.node.type === 'Congregação'"
                    name="church"
                    color="blue"
                    size="20px"
                    class="q-mr-sm"
                  />
                  <q-icon
                    v-if="prop.node.type === 'Paróquia'"
                    name="workspaces"
                    color="blue"
                    size="20px"
                    class="q-mr-sm"
                  />
                  <span
                    class="cursor-pointer"
                    @click="$router.push('/user/userOrganismDetail?organismId=' + prop.node.organismId)"
                  >{{ prop.node.label }}
                  </span>
                  <div v-if="prop.node.type === 'Congregação'">
                    Data de fundação: {{ prop.node.fundationDate ? prop.node.fundationDate : 'não informado' }}
                    <div>
                      Filiada: {{ prop.node.isFiliated ? prop.node.isFiliated : 'não informado' }}
                    </div>
                    <div>
                      É sede: {{ prop.node.isHeadOffice ? prop.node.isHeadOffice : 'não informado' }}
                    </div>
                  </div>
                </div>
              </template>
            </q-tree>
          </q-tab-panel>

          <q-tab-panel name="Dados financeiros">
            <q-card class="q-my-lg card-finance-table">
              <q-table
                flat
                card-class="bg-grey-3 text-black"
                class="bg-accent"
                title="Entradas totais anuais"
                :columns="entryValueAnual"
                :rows="entriesOrganismsFinancesStatistics"
                dense
                virtual-scroll
                row-key="_id"
                rows-per-page-label="Registros por página"
                no-data-label="Nenhum dado até o momento"
                no-results-label="A pesquisa não retornou nenhum resultado"
                :rows-per-page-options="[10, 20, 30, 50]"
                :filter="filter"
                :v-model:pagination="pagination"
                @request="nextPage"
              >
                <template v-slot:body-cell-saldoAnterior="props">
                  <q-td :props="props">
                    <q-input 
                      outlined 
                      dense 
                      mask="#.##"
                      reverse-fill-mask
                      v-model="props.row.saldoAnterior" 
                    />
                  </q-td>
                </template>
                <template v-slot:body-cell-receitasRegulares="props">
                  <q-td :props="props" class="q-gutter-y-md">
                    <div class="no-margin">
                      Ofertas dominicais
                      <q-input 
                        outlined 
                        dense 
                        mask="#.##"
                        reverse-fill-mask 
                        v-model="props.row.ofertasDominicais" 
                      />
                    </div>
                    <div class="no-margin">
                      Ofertas mensais
                      <q-input 
                        outlined 
                        dense 
                        mask="#.##"
                        reverse-fill-mask 
                        v-model="props.row.ofertasMensais" 
                      />
                    </div>
                    <div class="no-margin">
                      Receitas de aluguéis
                      <q-input 
                        outlined 
                        dense 
                        mask="#.##"
                        reverse-fill-mask 
                        v-model="props.row.receitasAlugueis" 
                      />
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-ofertasEspeciais="props">
                  <q-td :props="props">
                    <q-input 
                      outlined 
                      dense 
                      mask="#.##"
                      reverse-fill-mask 
                      v-model="props.row.ofertasEspeciais" 
                    />
                  </q-td>
                </template>
                <template v-slot:body-cell-campanhasEspecificas="props">
                  <q-td :props="props">
                    <q-input 
                      outlined 
                      dense 
                      mask="#.##"
                      reverse-fill-mask 
                      v-model="props.row.campanhasEspecificas" 
                    />
                  </q-td>
                </template>
                <template v-slot:body-cell-auxilio="props">
                  <q-td :props="props">
                    <q-input 
                      outlined 
                      dense 
                      mask="#.##"
                      reverse-fill-mask 
                      v-model="props.row.auxilio" 
                    />
                  </q-td>
                </template>
                <template v-slot:body-cell-emprestimos="props">
                  <q-td :props="props">
                    <q-input 
                      outlined 
                      dense 
                      mask="#.##"
                      reverse-fill-mask 
                      v-model="props.row.emprestimos" 
                    />
                  </q-td>
                </template>
                <template v-slot:body-cell-todasOutrasReceitas="props">
                  <q-td :props="props">
                    <q-input 
                      outlined 
                      dense 
                      mask="#.##"
                      reverse-fill-mask 
                      v-model="props.row.todasOutrasReceitas" 
                    />
                  </q-td>
                </template>
              </q-table>
            </q-card>
            <q-card class="card-finance-table">
              <q-table
                card-class="bg-grey-3 text-black"
                flat
                class="bg-accent"
                title="Saídas totais anuais"
                :columns="outputValueAnual"
                :rows="outputsOrganismsFinancesStatistics"
                virtual-scroll
                row-key="_id"
                dense
                rows-per-page-label="Registros por página"
                no-data-label="Nenhum dado até o momento"
                no-results-label="A pesquisa não retornou nenhum resultado"
                :rows-per-page-options="[10, 20, 30, 50]"
                :filter="filter"
                :v-model:pagination="pagination"
                @request="nextPage"
              >
                <template v-slot:body-cell-contribuicaoIelb="props">
                  <q-td :props="props" class="q-gutter-y-md">
                    <div class="no-margin">
                      Ofertas dominicais
                      <q-input 
                        outlined 
                        dense 
                        mask="#.##"
                        reverse-fill-mask 
                        v-model="props.row.ofertasDominicais" 
                      />
                    </div>
                    <div class="no-margin">
                      Ofertas mensais
                      <q-input 
                        outlined 
                        dense 
                        mask="#.##"
                        reverse-fill-mask 
                        v-model="props.row.ofertasMensais" 
                      />
                    </div>
                    <div class="no-margin">
                      Receitas de aluguéis
                      <q-input 
                        outlined 
                        dense 
                        mask="#.##"
                        reverse-fill-mask 
                        v-model="props.row.receitasAlugueis" 
                      />
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-contribuicaoDistrito="props">
                  <q-td :props="props">
                    <q-input 
                      outlined 
                      dense 
                      mask="#.##"
                      reverse-fill-mask 
                      v-model="props.row.contribuicaoDistrito" 
                    />
                  </q-td>
                </template>
                <template v-slot:body-cell-devolucaoEmprestimosIelb="props">
                  <q-td :props="props">
                    <q-input 
                      outlined 
                      dense 
                      mask="#.##"
                      reverse-fill-mask 
                      v-model="props.row.devolucaoEmprestimosIelb" 
                    />
                  </q-td>
                </template>
                <template v-slot:body-cell-todasSaidas="props">
                  <q-td :props="props">
                    <q-input 
                      outlined 
                      dense 
                      mask="#.##"
                      reverse-fill-mask 
                      v-model="props.row.todasSaidas" 
                    />
                  </q-td>
                </template>
              </q-table>
            </q-card>
          </q-tab-panel>
        </q-tab-panels>
        <div class="text-right">
          <q-btn 
            label="Salvar como rascunho" 
            rounded
            color="warning"
            class="q-ma-md"
            no-caps
            @click="saveAllEntriesAndOutputs"
          />
          <q-btn 
            label="Enviar" 
            rounded
            color="green"
            class="q-ma-md"
            no-caps
          />
        </div>
      </div>
      <q-dialog
        v-model="dialogEditChild.open"
      >
        <q-card style="width: 400px;">
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
              class="q-pa-sm"
              label="Data inicial"
            />
            <q-input
              v-model="dialogEditMaritalStatus.status.dates.finalDate"
              outlined
              class="q-pa-sm"
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
        @hide="clearDialogAddMaritalRelation"
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
              v-model="dialogEditSocialNetwork.socialType"
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
    </q-page>
  </q-page-container>
</template>

<script>
import useFetch from "src/boot/useFetch";
import utils from "../../boot/utils";
import { defineComponent } from "vue";
import { useTableColumns } from "stores/tableColumns";
export default defineComponent({
  name:"Statistics",
  data() {
    return {
      tab: 'Dados pastorais',
      allEntries: [],
      table: {
        entry:{
          saldoAnterior: '',
          receitasRegulares: '',
          ofertasEspeciais: '',
          campanhasEspecificas: '',
          auxilio: '',
          emprestimos:'',
          todasOutrasReceitas:'',
        },
        output:{
          contribuicaoIELB: '',
          contribuicaoDistrito: '',
          devolucaoEmprestimoIELB: '',
          todasOutrasSaidas: '',
        },
      },
      entryValueAnual: useTableColumns().entryValueAnual,
      outputValueAnual: useTableColumns().outputValueAnual,
      entriesOrganismsFinancesStatistics:[],
      outputsOrganismsFinancesStatistics:[],
      pastorData: null,
      filter: '',
      pagination: {
        sortBy: '',
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: 'desc',
        descending: false,
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
      }
    }
  },

  beforeMount() {
    this.getUserData()
    this.getPastorDataTabs()
    this.getMyOrganismsWithAllData()
    this.getFinanceStatisticByOrganismId()
    // this.verifyIfIsPastor()
    this.getPastorFormations()
    this.getPastorDataTabs()
    this.getPastorLinks()
  },
  methods: {
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
      console.log("Todas as Entradas Salvas:", this.allEntries);
    },
    
    getFinanceStatisticByOrganismId() {
      const opt = {
        route: "/desktop/statistics/getFinanceStatisticByOrganismId",
        body: {
          organismId: this.$route.query.organismId,
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage,
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        console.log(r, 'POKPAOSKDOPSKDPOA')
        this.outputsOrganismsFinancesStatistics = r.data.list[0].output
        this.entriesOrganismsFinancesStatistics = r.data.list[0].entries
      });
    },
    getMyOrganismsWithAllData() {
      const opt = {
        route: "/desktop/statistics/getMyOrganismsWithAllData",
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
        r.data.count[0] ? this.pagination.rowsNumber = r.data.count[0].count : this.pagination.rowsNumber = 0
        this.mountTree(r.data.list)
      });
    },
    mountTree (list) {
      let tree = []
      list.forEach(org => {
        tree = {
          type: org.organismParentLocal,
          label: org.organismParentLocal + ' ' + org.organismParentName,
          fundationDate: org.parentData.organismParentFundationDate,
          isFiliated: org.parentData.isFiliated,
          isHeadOffice: org.parentData.isHeadOffice,
          header: 'generic',
          organismId: org.organismParentId,
          children: []
        }
        org.childrenData.forEach(child => {
          tree.children.push({
            type: child.organismChildConfig,
            label: child.organismChildConfig + ' ' + child.organismChildName,
            body: 'normal',
            organismId: child.organismChildId
          })
        })
        this.organismListTree.push(tree)
      })
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
    confirmChangeSocialNetwork() {
      this.pastorData.social.value[this.dialogEditSocialNetwork.index].name = 
      this.dialogEditSocialNetwork.social.name
      this.pastorData.social.value[this.dialogEditSocialNetwork.index].selectedSocialType = 
      this.dialogEditSocialNetwork.social.this.dialogEditSocialNetwork.social.selectedSocialType

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
      this.dialogEditMaritalStatus.open = true,
      this.dialogEditMaritalStatus.status = {...data}
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
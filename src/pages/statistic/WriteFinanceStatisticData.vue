<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs align="center">
            <q-breadcrumbs-el 
              style="cursor: pointer;" 
              icon="home" 
              label="Introdução" 
              @click="$router.push('/statistic/selectOrganismToWriteStatisticData')"
              />
              <q-breadcrumbs-el 
              :label="congregationName" 
              style="cursor: pointer;" 
              @click="$router.push('/statistic/completeStatistic?organismId=' + $route.query.organismId)"
            />
            <q-breadcrumbs-el label="Financeiro" />
          </q-breadcrumbs>
        </div>
        <div > 
          <div class="text-h5 text-center">
            Estatística 2023
            <div class="text-h6">Dados Financeiros</div>
          </div>
          <div class="text-center q-py-md">
            <div>
              Soma das entradas da paróquia: R$
              {{ paroquiaData.contributionEntries ? paroquiaData.contributionEntries : 0 }}
            </div>
            <div>
              Soma das saídas da paróquia: R$
              {{ paroquiaData.contributionOutput ? paroquiaData.contributionOutput : 0 }}
            </div>
          </div>
          <div class="row">
            <div class="col q-gutter-y-md">
              <div style="border-radius: 1rem; background-color: rgb(245, 245, 245);" class="q-gutter-y-md q-pa-md">
              
                <div class="text-h5">
                  Entradas
                </div>
                <q-input 
                  prefix="R$"
                  label="Saldo anterior"
                  reverse-fill-mask
                  mask="###.###.###,##"
                  v-model="table.entries.saldoAnterior" 
                />
                <div class="no-margin">
                  <q-input 
                    prefix="R$"
                    label="Ofertas dominicais"
                    reverse-fill-mask
                    mask="###.###.###,##" 
                    v-model="table.entries.receitasRegulares.ofertasDominicais" 
                  />
                </div>
                <div class="no-margin">
                  <q-input 
                    label="Ofertas mensais"
                    prefix="R$"
                    reverse-fill-mask
                    mask="###.###.###,##" 
                    v-model="table.entries.receitasRegulares.ofertasMensais" 
                  />
                </div>
                <div class="no-margin">
                  <q-input 
                    prefix="R$"
                    label="Receitas de aluguéis"
                    @blur="calculateOfferPercents()"
                    reverse-fill-mask
                    mask="###.###.###,##" 
                    v-model="table.entries.receitasRegulares.receitasAlugueis" 
                  />
                </div>
                <div class="no-margin">
                <q-input 
                  prefix="R$"
                  label="Ofertas especiais"
                  reverse-fill-mask
                  mask="###.###.###,##" 
                  v-model="table.entries.ofertasEspeciais" 
                />
                </div>
                <div class="no-margin">
                <q-input 
                  prefix="R$"
                  label="Campanhas específicas"
                  reverse-fill-mask
                  mask="###.###.###,##" 
                  v-model="table.entries.campanhasEspecificas" 
                />
                </div>
                <div class="no-margin">
                <q-input 
                  label="Auxílio"
                  prefix="R$"
                  reverse-fill-mask
                  mask="###.###.###,##" 
                  v-model="table.entries.auxilio" 
                />
                </div>
                <div class="no-margin">
                <q-input 
                  label="Empréstimos"
                  prefix="R$"
                  reverse-fill-mask
                  mask="###.###.###,##" 
                  v-model="table.entries.emprestimos" 
                />
                </div>
                <div class="no-margin">
                <q-input 
                  label="Todas as Outras receitas"
                  prefix="R$"
                  reverse-fill-mask
                  mask="###.###.###,##" 
                  v-model="table.entries.todasOutrasReceitas" 
                /></div>
              </div>
              <div style="border-radius: 1rem; background-color: rgb(245, 245, 245);" class="q-gutter-y-md q-pa-md">
                <div class="text-h5">
                  Saídas
                </div>
                <div class="text-h6">
                  Contribuição registrada na Administração Nacional <q-chip color="grey-8 text-white">R$ {{ contributionOutputSum }}</q-chip>
                </div>
                <div class="text-green" v-if="showContributionCalculatedMore">
                  Contribuição registrada na Administração Nacional e calculado 11% R$ {{ contributionCalculatedMore.toFixed(2) }} <q-icon name="north"/>
                </div>
                <div class="text-red" v-else-if="showContributionCalculatedLess">
                  Contribuição registrada na Administração Nacional 11% R$ {{ contributionCalculatedLess.toFixed(2) }} <q-icon name="south"/>
                </div>
                <div class="no-margin">
                <q-input 
                  label="Contribuição Distrito"
                  prefix="R$"
                  reverse-fill-mask
                  mask="###.###.###,##" 
                  v-model="table.output.contribuicaoDistrito" 
                />
                </div>
                <div class="no-margin">
                <q-input 
                  label="Devolução de empréstimos IELB"
                  prefix="R$"
                  reverse-fill-mask
                  mask="###.###.###,##" 
                  @blur="calculateDiffBetweenEmprestimos()"
                  v-model="table.output.devolucaoEmprestimoIELB" 
                />
                </div>
                <div class="no-margin">
                <q-input 
                  prefix="R$"
                  label="Todas as outras saídas"
                  reverse-fill-mask
                  mask="###.###.###,##" 
                  v-model="table.output.todasSaidas" 
                />
                </div>
              </div>
              <div v-if="showContribuitionNotify" class="text-subtitle1 text-bold q-px-md">
                <div class="text-center">
                  Atenção!
                </div>
                Há difença entre o valor de entrada de contribuição no SGA e saída das contribuições.
                Envie um e-mail com os comprovantes para teste@teste.com
              </div>
              <div v-if="showEmprestimoNotify" class="text-subtitle1 text-bold q-px-md">
                <div class="text-center">
                  Atenção!
                </div>
                Há difença entre o valor do emprestimo no SGA e a devolução de empréstimo.
                Por favor, envie um e-mail com os comprovantes para teste@teste.com
              </div>
              <div class="text-center">
                
                <q-chip
                  v-if="validated"
                  color="green"
                  label="Validado"
                  text-color="white"
                  icon="done"
                />
  
                <q-chip
                  v-if="!validated"
                  color="red"
                  label="Não Validado"
                  text-color="white"
                  icon="warning"
                /><br>
  
                <q-btn
                  label="Salvar rascunho"
                  color="primary"
                  class="q-my-lg"
                  no-caps
                  @click="insertFinanceStatisticsDraft"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import useFetch from "src/boot/useFetch";
import { defineComponent } from "vue";
export default defineComponent({
  name:"WriteFinanceStatisticData",
  data() {
    return {
      congregationName:'',
      pagination: {
        sortBy: '',
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: 'desc',
        descending: false,
        searchString: ''
      },
      validated: false,
      contributionCalculatedMore: '',
      contributionCalculatedLess: '',
      contributionOutputSum: '',
      contributionEntriesSum: '',
      table: {
        entries:{
          saldoAnterior: '',
          receitasRegulares: {
            ofertasDominicais: '',
            ofertasMensais: '',
            receitasAlugueis: '',
          },
          ofertasEspeciais: '',
          campanhasEspecificas: '',
          auxilio: '',
          emprestimos: '',
          todasOutrasReceitas: '',
        },
        output: {
          contribuicaoIELB: {
            ofertasDominicais: '',
            ofertasMensais: '',
            receitasAlugueis: '',
          },
          contribuicaoDistrito: '',
          devolucaoEmprestimoIELB: '',
          todasSaidas: ''
        },
      },
      showEmprestimoNotify: false,
      showContribuitionNotify: false,
      showContributionCalculatedMore: false,
      showContributionCalculatedLess: false,
      paroquiaData: {
        contributionOutput: '',
        contributionEntries: '',
      },
    }
  },
  beforeUnmount(){
    this.insertFinanceStatisticsDraft()
  },
  beforeMount() {
    this.getFinanceStatisticByOrganismId()
    this.getFinanceTotalValueFromParoquia()
    this.getOrganismNameForBreadCrumbs()
  },
  methods: {
  getFinanceTotalValueFromParoquia(){
    const opt = {
      route: "/desktop/statistics/getFinanceTotalValueFromParoquia",
    }
    this.$q.loading.show()
    useFetch(opt).then((r) => {
      this.$q.loading.hide()
      this.paroquiaData = r.data
    });
  },
  calculateDiffBetweenEmprestimos() {
    if(this.table.entries.emprestimos !== this.table.output.devolucaoEmprestimoIELB){
      this.showEmprestimoNotify = true
    }
  },
  calculateOfferPercents(){
    let total = 0
    let outPutTotalPercents = 0
    let ofertasDominicais = +this.table.entries.receitasRegulares.ofertasDominicais.replace(',', '.')
    let ofertasMensais = +this.table.entries.receitasRegulares.ofertasMensais.replace(',', '.')
    let receitasAlugueis = +this.table.entries.receitasRegulares.receitasAlugueis.replace(',', '.')
    total = ofertasDominicais + ofertasMensais + receitasAlugueis
    outPutTotalPercents = +this.contributionOutputSum - +this.contributionOutputSum * 0.11
    if(+total * 0.11 >= outPutTotalPercents){
      this.contributionCalculatedMore = total * 0.11
      this.showContributionCalculatedMore = true
    }else if(+total * 0.11 < outPutTotalPercents){
      this.contributionCalculatedLess = total * 0.11
      this.showContribuitionNotify = true
      this.showContributionCalculatedLess = true
    }
  },
  insertFinanceStatisticsDraft() {
    const opt = {
      route: "/desktop/statistics/insertFinanceStatisticsDraft",
      body: {
        organismId: this.$route.query.organismId,
        financeData: this.table,
        contribuitionOutput: this.contributionOutputSum
      },
    };
    if (Object.keys(this.table.output).length > 0) {
      opt.body.financeData = this.table;
    } else if (Object.keys(this.table.entry).length > 0) {
      opt.body.financeData = this.table;
    }else if (Object.keys(this.table.output).length > 0 || Object.keys(this.table.entry).length > 0){
      opt.body.financeData = this.table
    }
    this.$q.loading.show()
    useFetch(opt).then((r) => {
      this.$q.loading.hide()
      if (r.error) {
        this.$q.notify('Ocorreu um problema, tente novamente mais tarde')
        return
      }
      this.$q.notify('Rascunho salvo com sucesso!')
      this.getFinanceStatisticByOrganismId()
    });
  },
  getOrganismNameForBreadCrumbs() {
  const opt = {
    route: "/desktop/statistics/getCongregacaoByOrganismId",
    body: {
      organismId: this.$route.query.organismId
    },
  };
  useFetch(opt).then((r) => {
    if (r.error) return;
    this.congregationName = r.data.organismName 
  });
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
      if (r.error || !r.data) return
      this.validated = r.data.validated
      this.contributionOutputSum = r.data.contributionOutput
      if (r.data.contributionOutputSGA) {
        this.contributionOutputSum = r.data.contributionOutputSGA
      }
      this.contributionEntriesSum = r.data.contributionEntries
      r.data.financeData && r.data.financeData.output ? this.table.output = r.data.financeData.output :
      this.table.output = {
        contribuicaoIELB: {
          ofertasDominicais: '',
          ofertasMensais: '',
          receitasAlugueis: '',
        },
        contribuicaoDistrito: '',
        devolucaoEmprestimoIELB: '',
        todasSaidas: ''
      },
      r.data.financeData && r.data.financeData.entries ? this.table.entries = r.data.financeData.entries :  
      this.table.entries = {
        saldoAnterior: '',
        receitasRegulares: {
          ofertasDominicais: '',
          ofertasMensais: '',
          receitasAlugueis: '',
        },
        ofertasEspeciais: '',
        campanhasEspecificas: '',
        auxilio: '',
        emprestimos: '',
        todasOutrasReceitas: '',
      }
    });
  },
  }
})
</script>

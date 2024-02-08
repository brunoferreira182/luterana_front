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
          <div
          class="text-center q-mt-lg"
          v-if="otherOrganisms && otherOrganisms.length > 0"
        >
          <div class="text-h6">
            Selecione outras congregações para responder estes dados:
          </div>
          <div>
            <q-chip
              clickable
              v-for="org in otherOrganisms"
              :key="org"
              @click="$router.push('/statistic/writeFinanceStatisticData?organismId=' + org._id)"
            >
              {{ org.name }}
            </q-chip>
          </div>
          <q-separator
            class="q-mt-md q-mx-md"
          ></q-separator>
        </div>
        </div>
        <div class="text-center q-gutter-md"> 
          <div class="text-h5">
            Estatística 2023
            <div class="text-h6">Dados Financeiros</div>
          </div>
          <q-checkbox 
            dense
            label="Dados serão concentrados na congregação sede?"
            v-model="focusOnCongregation"
          />
          <div >
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
                  Contribuição {{ contributionCalculatedMore }} <q-icon name="north"/>
                </div>
                <div class="text-red" v-else-if="showContributionCalculatedLess">
                  Contribuição {{ contributionCalculatedLess }} <q-icon name="south"/> 
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
              <div class="q-ma-sm text-center">
                
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
                  rounded
                  unelevated
                  class="q-my-md full-width"
                  no-caps
                  @click="saveDraft()"
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
      contributionOutputNum: null,
      contributionEntriesSum: '',
      table: {
        entries:{
          saldoAnterior: '',
          receitasRegulares: {
            ofertasDominicais: null,
            ofertasMensais: null,
            receitasAlugueis: null,
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
      focusOnCongregation: false,
      showEmprestimoNotify: false,
      showContribuitionNotify: false,
      showContributionCalculatedMore: false,
      showContributionCalculatedLess: false,
      paroquiaData: {
        contributionOutput: '',
        contributionEntries: '',
      },
      otherOrganisms: [],
    }
  },
  watch: {
    '$route.query.organismId': {
      handler(newOrganismId, oldOrganismId) {
        if (newOrganismId !== oldOrganismId) {
          this.getFinanceStatisticByOrganismId()
          this.getFinanceTotalValueFromParoquia()
          this.getOrganismNameForBreadCrumbs()
          this.getOthersCongregations()
        }
      },
      immediate: true
    }
  },
  // beforeUnmount(){
  //   this.saveDraftOnBeforeUnmount()
  // },
  beforeMount() {
    this.getFinanceStatisticByOrganismId()
    this.getFinanceTotalValueFromParoquia()
    this.getOrganismNameForBreadCrumbs()
    this.getOthersCongregations()
  },
  methods: {
    getOthersCongregations() {
      this.otherOrganisms = []
      const opt = {
        route: '/desktop/statistics/getMyOrganismsList'
      }
      useFetch(opt).then((r) => {
        if (r.error) return
        r.data.forEach((org) => {
          if (org._id !== this.$route.query.organismId) {
            const exists = this.otherOrganisms.some(existOrg => existOrg._id === org._id);
            if (!exists) {
              this.otherOrganisms.push({
                name: org.name,
                _id: org._id
              });
            }
          }
        })       
      })
    },
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
    let contribution = 0
    let contributionPercents = 0
    let ofertasDominicais = +this.table.entries.receitasRegulares.ofertasDominicais.replaceAll('.', '').replace(',', '.')
    let ofertasMensais = +this.table.entries.receitasRegulares.ofertasMensais.replaceAll('.', '').replace(',', '.')
    let receitasAlugueis = +this.table.entries.receitasRegulares.receitasAlugueis.replaceAll('.', '').replace(',', '.')
    total = ofertasDominicais + ofertasMensais + receitasAlugueis
    contribution = (+this.contributionOutputNum/+total)
    contributionPercents = Math.trunc(contribution*100) + '%' 
    
    if(contributionPercents >= '11%'){
      this.contributionCalculatedMore = contributionPercents
      this.showContributionCalculatedMore = true
      this.showContributionCalculatedLess = false
    }else if(contributionPercents < '11%'){
      this.contributionCalculatedLess = contributionPercents
      this.showContribuitionNotify = true
      this.showContributionCalculatedMore = false
      this.showContributionCalculatedLess = true
    }
  },
  saveDraft() {
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
      this.$router.back()
      this.getFinanceStatisticByOrganismId()
    });
  },
  saveDraftOnBeforeUnmount() {
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
      console.log(r, 'kkkkkkkkkk ')
      if (r.error || !r.data) return
      this.validated = r.data.validated
      this.contributionOutputSum = r.data.contributionOutput
      this.contributionOutputNum = r.data.contributionOutputNum
      this.contributionEntriesSum = r.data.contributionEntries
      r.data.financeData && r.data.financeData.output ? this.table.output = r.data.financeData.output :
      this.table.output = {
        contribuicaoIELB: {
          ofertasDominicais: null,
          ofertasMensais: null,
          receitasAlugueis: null,
        },
        contribuicaoDistrito: '',
        devolucaoEmprestimoIELB: '',
        todasSaidas: ''
      },
      r.data.financeData && r.data.financeData.entries ? this.table.entries = r.data.financeData.entries :  
      this.table.entries = {
        saldoAnterior: '',
        receitasRegulares: {
          ofertasDominicais: null,
          ofertasMensais: null,
          receitasAlugueis: null,
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

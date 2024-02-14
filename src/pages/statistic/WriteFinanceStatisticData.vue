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
        <div class="text-left q-gutter-md"> 
          <div class="text-h5 q-px-sm">
            Estatística 2023
            <div class="text-h6">Dados Financeiros</div>
          </div>
          <!-- <q-checkbox 
            class="q-px-sm"
            dense
            label="Dados serão concentrados na congregação sede?"
            v-model="focusOnCongregation"
          /> -->
          <div class="q-ml-lg text-h6">
            Se você só possuir dados da paróquia, insira os mesmos na congregação sede
          </div>
          <div class="text-left q-px-sm">
            <div>
              <!-- Soma das entradas da paróquia -->
              <q-input
                v-model="paroquiaData.contributionEntries"
                prefix="R$"
                readonly
                label="Soma das entradas da paróquia"
                reverse-fill-mask
                mask="###.###.###,##"
              />
              <!-- {{ paroquiaData.contributionEntries ? paroquiaData.contributionEntries : 0 }} -->
            </div>
            <div>
              <!-- Soma das saídas da paróquia -->
              <q-input
                v-model="paroquiaData.contributionOutput"
                prefix="R$"
                readonly
                label="Soma das saídas da paróquia"
                reverse-fill-mask
                mask="###.###.###,##"
              />
              <!-- {{ paroquiaData.contributionOutput ? paroquiaData.contributionOutput : 0 }} -->
            </div>
            <div>
              <q-input
                v-model="saldoCongregacao"
                prefix="R$"
                readonly
                label="Saldo congregação"
                reverse-fill-mask
                mask="###.###.###,##"
              />
            </div>
          </div>
          <div class="row">
            <div class="col q-gutter-y-md">
              <div style="border-radius: 1rem; background-color: rgb(245, 245, 245);" class="q-gutter-y-md q-pa-md">
              
                <div class="text-h5 text-left">
                  Entradas
                </div>
                <q-input
                  prefix="R$"
                  label="Saldo anterior (2022)"
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
                    @blur="calculateOfferPercents()"
                    v-model="table.entries.receitasRegulares.ofertasDominicais"
                  />
                </div>

                <div class="no-margin">
                  <q-input
                    prefix="R$"
                    label="Ofertas mensais"
                    reverse-fill-mask
                    mask="###.###.###,##"
                    @blur="calculateOfferPercents()"
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
                  />
                </div>

                <div class="text-h5">
                  Saídas
                </div>

                <div>
                  <q-banner
                    :class="`${contributionNumber >= 0.11 ? 'bg-green' : 'bg-red-7'} text-white q-mb-lg`"
                  >
                    Contribuição registrada na Administração Nacional:<br>
                    R$
                    <strong class="text-h6">
                      {{ table.output.contributionOnSgaLocal }}
                    </strong><br>
                    <div v-if="table.output.contributionOnSgaLocal && table.output.contributionOnSgaLocal !== '' && table.output.contributionOnSgaLocal > 0">
                    Percentual: 
                    <strong class="text-h6">
                      {{ contributionPercent }}
                    </strong>
                    </div>
                    
                    <br>


                    <template v-slot:action>
                      <q-btn flat color="white" label="Reportar erro" @click="dialogReportValueSGAError = true"/>
                    </template>
                  </q-banner>
                </div>
                <q-dialog v-model="dialogReportValueSGAError">
                  <q-card style="border-radius: 1rem; width: 400px;">
                    <q-card-section class="text-subtitle1 text-center">
                      Se houver diferença no valor, envie os comprovantes para o e-mail da IELB.
                    </q-card-section>
                    <q-card-actions align="center">
                      <q-btn flat label="Entendi" no-caps color="primary" @click="dialogReportValueSGAError = false"/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

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
                />
                <div v-if="(status && status.value !== 'sent') || !status">
                  <q-btn
                    label="Salvar rascunho"
                    color="primary"
                    rounded
                    unelevated
                    class="q-my-sm full-width"
                    no-caps
                    @click="saveDraft()"
                  />
                  <q-btn
                    label="Salvar Oficial"
                    color="orange"
                    rounded
                    unelevated
                    class="full-width q-my-sm"
                    no-caps
                    @click="saveOficial()"
                  />
                </div>
                <div v-else class="text-h6 q-ma-sm">
                  Etapa finalizada
                </div>
                <div class="row q-gutter-sm  q-pt-xs justify-center">
                  <div class="col-6">
                    <q-btn
                      label="Etapa anterior"
                      color="primary"
                      rounded
                      unelevated
                      icon="navigate_before"
                      class="col items-start"
                      no-caps
                      @click="$router.push('/statistic/membersMovement?organismId=' + $route.query.organismId)"
                    />
                  </div>
                </div>
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
      dialogReportValueSGAError: false,
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
      contributionOutputSum: null,
      contributionOutputNum: null,
      contributionEntriesSum: null,
      table: {
        entries:{
          saldoAnterior: "",
          receitasRegulares: {
            ofertasDominicais: "",
            ofertasMensais: "",
            receitasAlugueis: "",
          },
          ofertasEspeciais: "",
          campanhasEspecificas: "",
          auxilio: "",
          emprestimos: "",
          todasOutrasReceitas: "",
        },
        output: {
          contributionOnSga: '',
          contribuicaoDistrito: "",
          devolucaoEmprestimoIELB: "",
          todasSaidas: ""
        },
      },
      focusOnCongregation: false,
      showEmprestimoNotify: false,
      showContribuitionNotify: null,
      showContributionCalculatedMore: false,
      showContributionCalculatedLess: false,
      paroquiaData: {
        contributionOutput: '',
        contributionEntries: '',
      },
      contributionPercent: '',
      contributionNumber: 0,
      saldoCongregacao: '',
      status: null
    }
  },
  // beforeUnmount(){
  //   this.saveDraftOnBeforeUnmount()
  // },
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
      if (r.error) {
        this.$q.notify('Ocorreu um erro ao trazer os dados financeiros da paróquia')
        return
      }
      r.data.contributionEntries = this.formatCurrency(r.data.totalEntradas)
      r.data.contributionOutput = this.formatCurrency(r.data.totalSaidas)
      this.paroquiaData = r.data
      const saldoContribuicao = +r.data.contributionEntries.replaceAll('.', '').replace(',', '');
      const saldoDespesas = +r.data.contributionOutput.replaceAll('.', '').replace(',', '');
      this.saldoCongregacao = saldoContribuicao - saldoDespesas;

    });
  },
  formatCurrency (d) {
    return d.toString().replace('.', ',')
    // return d
  },
  calculateOfferPercents(){
    let ofertasDominicais = +this.table.entries.receitasRegulares.ofertasDominicais.replaceAll('.', '').replace(',', '.')
    let ofertasMensais = +this.table.entries.receitasRegulares.ofertasMensais.replaceAll('.', '').replace(',', '.')
    let receitasAlugueis = +this.table.entries.receitasRegulares.receitasAlugueis.replaceAll('.', '').replace(',', '.')
    let totalReceitas = ofertasDominicais + ofertasMensais + receitasAlugueis
    this.contributionNumber = (+this.table.output.contributionOnSga / +totalReceitas)
    this.contributionPercent = Math.trunc(this.contributionNumber * 100) + '%'
  },
  async saveOficial() {
    const validated = this.validateForm()
    if (!validated) {
      this.$q.notify('Há dados a serem preenchidos. Passe os campos um a um')
      return
    }
    let opt = {
      route: "/desktop/statistics/insertFinanceStatisticsDraft",
      body: {
        organismId: this.$route.query.organismId,
        financeData: this.table,
        contribuitionOutput: this.contributionOutputSum
      },
    };
    opt.body.financeData.totais = this.calculateTotals()
    if (Object.keys(this.table.output).length > 0) {
      opt.body.financeData = this.table;
    } else if (Object.keys(this.table.entry).length > 0) {
      opt.body.financeData = this.table;
    } else if (Object.keys(this.table.output).length > 0 || Object.keys(this.table.entry).length > 0) {
      opt.body.financeData = this.table
    }
    this.$q.loading.show()
    let r = await useFetch(opt)
    this.$q.loading.hide()
    if (r.error) {
      this.$q.notify('Ocorreu um problema, tente novamente mais tarde')
      return
    }
    opt = {
      route: "/desktop/statistics/insertFinanceStatisticDone",
      body: {
        organismId: this.$route.query.organismId,
      },
    };
    r = await useFetch(opt)
    if (r.error) {
      this.$q.notify('Ocorreu um problema, tente novamente mais tarde')
      return
    }
    this.$q.notify('Etapa finalizada com sucesso')
    this.$router.back()
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
    opt.body.financeData.totais = this.calculateTotals()
    if (Object.keys(this.table.output).length > 0) {
      opt.body.financeData = this.table;
    } else if (Object.keys(this.table.entry).length > 0) {
      opt.body.financeData = this.table;
    } else if (Object.keys(this.table.output).length > 0 || Object.keys(this.table.entry).length > 0){
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
    });
  },
  validateForm () {
    let validated = true
    if (this.table.entries.saldoAnterior === '') validated = false
    else if (this.table.entries.receitasRegulares.ofertasDominicais === '') validated = false
    else if (this.table.entries.receitasRegulares.ofertasMensais === '') validated = false
    else if (this.table.entries.receitasRegulares.receitasAlugueis === '') validated = false
    else if (this.table.entries.ofertasEspeciais === '') validated = false
    else if (this.table.entries.campanhasEspecificas === '') validated = false
    else if (this.table.entries.auxilio === '') validated = false
    else if (this.table.entries.emprestimos === '') validated = false
    else if (this.table.entries.todasOutrasReceitas === '') validated = false

    else if (this.table.output.contribuicaoDistrito === '') validated = false
    else if (this.table.output.devolucaoEmprestimoIELB === '') validated = false
    else if (this.table.output.todasSaidas === '') validated = false
    
    return validated
  },
  calculateTotals () {
    const totalEntradas = 
      +this.table.entries.saldoAnterior.replaceAll('.', '').replaceAll(',', '.')
      + +this.table.entries.receitasRegulares.ofertasDominicais.replaceAll('.', '').replaceAll(',', '.')
      + +this.table.entries.receitasRegulares.ofertasMensais.replaceAll('.', '').replaceAll(',', '.')
      + +this.table.entries.receitasRegulares.receitasAlugueis.replaceAll('.', '').replaceAll(',', '.')
      + +this.table.entries.ofertasEspeciais.replaceAll('.', '').replaceAll(',', '.')
      + +this.table.entries.campanhasEspecificas.replaceAll('.', '').replaceAll(',', '.')
      + +this.table.entries.auxilio.replaceAll('.', '').replaceAll(',', '.')
      + +this.table.entries.emprestimos.replaceAll('.', '').replaceAll(',', '.')
      + +this.table.entries.todasOutrasReceitas.replaceAll('.', '').replaceAll(',', '.')
    
    const totalSaidas = 
      +this.table.output.contribuicaoDistrito.replaceAll('.', '').replaceAll(',', '.')
      + +this.table.output.devolucaoEmprestimoIELB.replaceAll('.', '').replaceAll(',', '.')
      + +this.table.output.todasSaidas.replaceAll('.', '').replaceAll(',', '.')

    return { totalSaidas, totalEntradas }

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
    opt.body.financeData.totais = this.calculateTotals()
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
      if (r.error || !r.data) return
      this.validated = r.data.validated
      this.status = r.data.status
      this.contributionOutputSum = r.data.contributionOutput
      this.contributionOutputNum = r.data.contributionOutputNum
      this.contributionEntriesSum = r.data.contributionEntries
      r.data.financeData && r.data.financeData.output ? this.table.output = r.data.financeData.output :
      this.table.output = {
        contribuicaoDistrito: null,
        devolucaoEmprestimoIELB: null,
        todasSaidas: null
      },
      r.data.financeData && r.data.financeData.entries ? this.table.entries = r.data.financeData.entries :  
      this.table.entries = {
        saldoAnterior: '',
        receitasRegulares: {
          ofertasDominicais: null,
          ofertasMensais: null,
          receitasAlugueis: null,
        },
        ofertasEspeciais: null,
        campanhasEspecificas: null,
        auxilio: null,
        emprestimos: null,
        todasOutrasReceitas: null,
      }
    });
  },
  }
})
</script>

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
            Os dados financeiros são individualizados por congregação. Caso só tenha as informações paroquiais, insira os valores na sede da paróquia e coloque 0 nas demais congregações..
          </div>
          <div style="border-radius: 1rem; background-color: rgb(245, 245, 245);" class="q-gutter-y-md q-pa-md">
            <div>
              <div class="text-h6">
                Soma total preenchida na paróquia (automático)
              </div>
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
                  @blur="calculateTotals"
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
                    @blur="calculateTotals"
                  />
                </div>

                <div class="no-margin">
                  <q-input
                    prefix="R$"
                    label="Campanhas específicas"
                    reverse-fill-mask
                    mask="###.###.###,##"
                    v-model="table.entries.campanhasEspecificas"
                    @blur="calculateTotals"
                  />

                </div>

                <div class="no-margin">
                  <q-input
                    label="Auxílio"
                    prefix="R$"
                    reverse-fill-mask
                    mask="###.###.###,##"
                    v-model="table.entries.auxilio"
                    @blur="calculateTotals"
                  />
                </div>

                <div class="no-margin">
                  <q-input
                    label="Empréstimos"
                    prefix="R$"
                    reverse-fill-mask
                    mask="#.###.###,##"
                    v-model="table.entries.emprestimos"
                    @blur="calculateTotals"
                  />
                </div>

                <div class="no-margin">
                  <q-input
                    label="Todas as Outras receitas"
                    prefix="R$"
                    reverse-fill-mask
                    mask="###.###.###,##"
                    v-model="table.entries.todasOutrasReceitas"
                    @blur="calculateTotals"
                  />
                </div>

                <div class="text-h5">
                  Saídas
                </div>

                <div>
                  <q-banner
                    :class="`${contributionNumber >= 0.11 ? 'bg-green' : 'bg-red-7'} text-white q-mb-lg`"
                    v-if="table.output.contributionOnSga > 0 && totalReceitas > 0"
                  >
                    Contribuição registrada na Administração Nacional:<br>
                    R$
                    <strong class="text-h6">
                      {{ table.output.contributionOnSgaLocal }}
                    </strong><br>
                    <div v-if="contributionPercent">
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
                  <q-banner v-else-if="totalReceitas > 0" class="bg-orange text-white q-mb-lg">
                    Não há contribuição registrada na Administração Nacional
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
                    @blur="calculateTotals"
                  />
                </div>

                <div class="no-margin">
                  <q-input
                    label="Devolução de empréstimos IELB"
                    prefix="R$"
                    reverse-fill-mask
                    mask="###.###.###,##"
                    v-model="table.output.devolucaoEmprestimoIELB"
                    @blur="calculateTotals"
                  />
                </div>

                <div class="no-margin">
                  <q-input
                    prefix="R$"
                    label="Todas as outras saídas"
                    reverse-fill-mask
                    mask="###.###.###,##"
                    v-model="table.output.todasSaidas"
                    @blur="calculateTotals"
                  />
                </div>
              </div>
              <div style="border-radius: 1rem; background-color: rgb(245, 245, 245);" class="q-gutter-y-md q-pa-md">
                <div class="text-h6">
                  Saldo em 2023 calculado pelo sistema
                </div>
                <div>
                  <q-input
                    v-model="contributionEntriesSum"
                    prefix="R$"
                    readonly
                    label="Soma entradas da congregação"
                    reverse-fill-mask
                    mask="###.###.###,##"
                  />
                </div>
                <div>
                  <q-input
                    v-model="contributionOutputSum"
                    prefix="R$"
                    readonly
                    label="Soma saídas da congregação"
                    reverse-fill-mask
                    mask="###.###.###,##"
                  />
                </div>
                <div>
                  <q-input
                    v-model="saldoCongregacao"
                    readonly
                    label="Saldo congregação"
                    reverse-fill-mask
                    mask="###.###.###,##"
                    prefix="R$"
                  >
                    <template v-slot:prepend>
                      <q-icon name="arrow_upward" color="green" v-if="saldoCongregacaoNumber >= 0" />
                      <q-icon name="arrow_downward" color="red" v-if="saldoCongregacaoNumber < 0" />
                    </template>
                  </q-input>
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
                <div class="row q-gutter-sm  q-pt-xs justify-start">
                  <div class="col-6">
                    <q-btn
                      label="Etapa anterior"
                      color="primary"
                      rounded
                      unelevated
                      icon="navigate_before"
                      class="col items-start full-width"
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
          campanhasEspecificas2: '',
          auxilio: "",
          emprestimos: "",
          todasOutrasReceitas: "",
        },
        output: {
          contributionOnSga: '',
          contributionOnSgaLocal: '',
          contributionOnSgaLocalNum: '',
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
      status: null,
      saldoCongregacaoNumber: 0,
      totalReceitas: 0
    }
  },
  async beforeUnmount(){
    this.timerToSave = null
    let r = await this.getFinanceStatisticByOrganismId()
    if (r.data && r.data.status && r.data.status.value === 'notSent') this.saveDraft()
  },
  async beforeMount() {
    this.methodToSaveTimerDraft()
    let r = await this.getFinanceStatisticByOrganismId()
    this.putFinanceStatisticByOrganismId(r)
    r = await this.getFinanceTotalValueFromParoquia()
    this.putFinanceTotalValueFromParoquia(r)
  },
  methods: {
    methodToSaveTimerDraft(){
      console.log('snKJNSKJAnksjnaKJN')
      this.timerToSave = true
      
      if (this.timerToSave){
      setTimeout(() => {
        this.saveDraft()
      }, 300000);
    }
  },
  putFinanceStatisticByOrganismId(r) {
    
    if (r.error) return
    this.validated = r.data.validated
    this.status = r.data.status
    // this.contributionOutputSum = r.data.contributionOutput ? r.data.contributionOutput : ''
    this.contributionOutputNum = r.data.contributionOutputNum ? r.data.contributionOutputNum : ''
    // this.contributionEntriesSum = r.data.contributionEntries ? r.data.contributionEntries : ''
    // r.data.contributionOutputNumSGA ? this.table.output.contributionOnSga = r.data.contributionOutputNumSGA : this.table.output.contributionOnSga = 0
    const saldoContribuicao = r.data.contributionEntriesNum ? r.data.contributionEntriesNum : ''
    const saldoDespesas = r.data.contributionOutputNum ? r.data.contributionOutputNum : ''
    const teste = saldoContribuicao - saldoDespesas;
    this.saldoCongregacao = teste.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    r.data.financeData && r.data.financeData.output ? this.table.output = r.data.financeData.output :
    this.table.output = {
      contribuicaoDistrito: '',
      devolucaoEmprestimoIELB: '',
      todasSaidas: ''
    }
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
    if (r.data.contributionOnSgaFirst) {
      this.table.output.contributionOnSga = r.data.contributionOnSgaFirst
      this.table.output.contributionOnSgaLocal = r.data.contributionOnSgaLocal
    } else {
      this.table.output.contributionOnSga = r.data.financeData.output.contributionOnSga
      this.table.output.contributionOnSgaLocal = r.data.financeData.output.contributionOnSgaLocal
      this.table.output.contributionOnSgaLocalNum = r.data.financeData.output.contributionOnSgaLocalNum
    }
    // this.table.output.contributionOnSga = r.data.contributionOnSgaFirst ? r.data.contributionOnSgaFirst : ''
    this.calculateOfferPercents()
  },
  putFinanceTotalValueFromParoquia(r) {
    if (r.error) {
      this.$q.notify('Ocorreu um erro ao trazer os dados financeiros da paróquia')
      return
    }
    r.data.contributionEntries = this.formatCurrency(r.data.totalEntradas)
    r.data.contributionOutput = this.formatCurrency(r.data.totalSaidas)
    this.paroquiaData = r.data
  },
  async getFinanceTotalValueFromParoquia(){
    const opt = {
      route: "/desktop/statistics/getFinanceTotalValueFromParoquia",
    }
    this.$q.loading.show()
    let r = await useFetch(opt)
    this.$q.loading.hide()
    return r
  },
  formatCurrency (d) {
    return d.toString().replace('.', ',')
    // return d
  },
  calculateOfferPercents(){
    let ofertasDominicais = this.formatToNumber(this.table.entries.receitasRegulares.ofertasDominicais)
    let ofertasMensais = this.formatToNumber(this.table.entries.receitasRegulares.ofertasMensais)
    let receitasAlugueis = this.formatToNumber(this.table.entries.receitasRegulares.receitasAlugueis)
    let totalReceitas = ofertasDominicais + ofertasMensais + receitasAlugueis
    this.totalReceitas = totalReceitas
    this.contributionNumber = (+this.table.output.contributionOnSga / +totalReceitas)
    this.contributionPercent = Math.trunc(this.contributionNumber * 100) + '%'
    this.calculateTotals()
  },
  formatFinanceData () {
    const formatted = {
      entries: {
        saldoAnterior: this.formatToNumber(this.table.entries.saldoAnterior),
        auxilio: this.formatToNumber(this.table.entries.auxilio),
        ofertasEspeciais: this.formatToNumber(this.table.entries.ofertasEspeciais),
        emprestimos: this.formatToNumber(this.table.entries.emprestimos),
        campanhasEspecificas: this.formatToNumber(this.table.entries.campanhasEspecificas),
        saldoAnterior: this.formatToNumber(this.table.entries.saldoAnterior),
        todasOutrasReceitas: this.formatToNumber(this.table.entries.todasOutrasReceitas),
        receitasRegulares: {
          ofertasDominicais: this.formatToNumber(this.table.entries.receitasRegulares.ofertasDominicais),
          ofertasMensais: this.formatToNumber(this.table.entries.receitasRegulares.ofertasMensais),
          receitasAlugueis: this.formatToNumber(this.table.entries.receitasRegulares.receitasAlugueis),
        }
      },
      output: {
        contributionOnSga: this.table.output.contributionOnSga,
        contribuicaoDistrito: this.formatToNumber(this.table.output.contribuicaoDistrito),
        devolucaoEmprestimoIELB: this.formatToNumber(this.table.output.devolucaoEmprestimoIELB),
        todasSaidas: this.formatToNumber(this.table.output.devolucaoEmprestimoIELB),
      }
    }
    return formatted
  },
  async saveOficial() {
    const validated = this.validateForm()
    const formatedEntriesAndOutput = this.formatFinanceData()
    if (!validated) {
      this.$q.notify('Há dados a serem preenchidos. Passe os campos um a um')
      return
    }
    let opt = {
      route: "/desktop/statistics/insertFinanceStatisticsDraft",
      body: {
        organismId: this.$route.query.organismId,
        financeData: formatedEntriesAndOutput,
        contribuitionOutput: this.table.output.contributionOnSga
      },
    };
    opt.body.financeData.totais = this.calculateTotals()
    if (Object.keys(this.table.output).length > 0) {
      opt.body.financeData = formatedEntriesAndOutput;
    } else if (Object.keys(this.table.entry).length > 0) {
      opt.body.financeData = formatedEntriesAndOutput;
    } else if (Object.keys(this.table.output).length > 0 || Object.keys(this.table.entry).length > 0) {
      opt.body.financeData = formatedEntriesAndOutput
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
    const formatedEntriesAndOutput = this.formatFinanceData()
    const opt = {
      route: "/desktop/statistics/insertFinanceStatisticsDraft",
      body: {
        organismId: this.$route.query.organismId,
        financeData: formatedEntriesAndOutput,
        contribuitionOutput: this.table.output.contributionOnSga
      },
    };
    opt.body.financeData.totais = this.calculateTotals()
    if (Object.keys(this.table.output).length > 0) {
      opt.body.financeData = formatedEntriesAndOutput;
    } else if (Object.keys(this.table.entry).length > 0) {
      opt.body.financeData = formatedEntriesAndOutput;
    } else if (Object.keys(this.table.output).length > 0 || Object.keys(this.table.entry).length > 0){
      opt.body.financeData = formatedEntriesAndOutput
    }
    this.$q.loading.show()
    useFetch(opt).then((r) => {
      this.$q.loading.hide()
      if (r.error) {
        this.$q.notify('Ocorreu um problema, tente novamente mais tarde')
        return
      }
      this.calculateTotals()
      this.$q.notify('Rascunho salvo com sucesso!')
      this.$router.push('/statistic/completeStatistic?organismId=' + this.$route.query.organismId)
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
    let totalEntradas = 
      this.formatToNumber(this.table.entries.saldoAnterior)
      + this.formatToNumber(this.table.entries.receitasRegulares.ofertasDominicais)
      + this.formatToNumber(this.table.entries.receitasRegulares.ofertasMensais)
      + this.formatToNumber(this.table.entries.receitasRegulares.receitasAlugueis)
      + this.formatToNumber(this.table.entries.ofertasEspeciais)
      + this.formatToNumber(this.table.entries.campanhasEspecificas)
      + this.formatToNumber(this.table.entries.auxilio)
      + this.formatToNumber(this.table.entries.emprestimos)
      + this.formatToNumber(this.table.entries.todasOutrasReceitas)
    
    let totalSaidas = 
      this.formatToNumber(this.table.output.contribuicaoDistrito)
      + this.formatToNumber(this.table.output.devolucaoEmprestimoIELB)
      + this.formatToNumber(this.table.output.todasSaidas)
    
    this.contributionEntriesSum = this.formatToCurrency(totalEntradas)
    this.contributionOutputSum = this.formatToCurrency(totalSaidas)
    this.saldoCongregacao = this.formatToCurrency(totalEntradas - totalSaidas)
    this.saldoCongregacaoNumber = totalEntradas - totalSaidas
    return { totalSaidas, totalEntradas }

  },
  formatToNumber (val) {
    return +val.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.')
  },
  formatToCurrency (v) {
    let inteiro
    let decimal
    if (v % 1 === 0) {
      inteiro = v
      decimal = '00'
    } else {
      inteiro = Math.floor(v)
      decimal = (v % 1).toFixed(2).toString().split('.')
      decimal = decimal[1].length === 1 ? decimal[1] + '0' : decimal[1]
    }

    return inteiro + ',' + decimal
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
  async getFinanceStatisticByOrganismId() {
    const opt = {
      route: "/desktop/statistics/getFinanceStatisticByOrganismId",
      body: {
        organismId: this.$route.query.organismId,
        page: this.pagination.page,
        rowsPerPage: this.pagination.rowsPerPage,
      },
    };
    this.$q.loading.show()
    let r = await useFetch(opt)
    this.$q.loading.hide()
    // this.calculateTotals()
    return r
  },
  }
})
</script>

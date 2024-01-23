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
              @click="$router.push('/statistic/introWriteStatisticData')"
            />
            <q-breadcrumbs-el 
              style="cursor: pointer;" 
              label="Completar estatística" 
              @click="$router.push('/statistic/completeStatistic?organismId=' + $route.query.organismId)"
            />
            <q-breadcrumbs-el label="Financeiro" />
          </q-breadcrumbs>
        </div>
        <div > 
          <div class="text-h5 q-mb-sm text-center">
            Estatística 2023
            <div class="text-h6">Dados Financeiros</div>
          </div>
          <div class="row">
            <div class="col q-gutter-y-md">
              <div style="border-radius: 1rem; background-color: rgb(245, 245, 245);" class="q-gutter-y-md q-pa-md">
              
                <div class="text-h5">
                  Entradas
                </div>
                <q-input 
                  type="number"
                  prefix="R$"
                  label="Saldo anterior"
                  reverse-fill-mask
                  v-model.number="table.entries.saldoAnterior" 
                />
                <div class="no-margin">
                  <q-input 
                    prefix="R$"
                    type="number"
                    label="Ofertas dominicais"
                    reverse-fill-mask 
                    v-model.number="table.entries.receitasRegulares.ofertasDominicais" 
                  />
                </div>
                <div class="no-margin">
                  <q-input 
                    label="Ofertas mensais"
                    prefix="R$"
                    type="number"
                    reverse-fill-mask 
                    v-model.number="table.entries.receitasRegulares.ofertasMensais" 
                  />
                </div>
                <div class="no-margin">
                  <q-input 
                    prefix="R$"
                    type="number"
                    label="Receitas de aluguéis"
                    reverse-fill-mask 
                    v-model.number="table.entries.receitasRegulares.receitasAlugueis" 
                  />
                </div>
                <q-input 
                  prefix="R$"
                  label="Ofertas especiais"
                  reverse-fill-mask 
                  type="number"
                  v-model.number="table.entries.ofertasEspeciais" 
                />
                <q-input 
                  prefix="R$"
                  label="Campanhas específicas"
                  type="number"
                  reverse-fill-mask 
                  v-model.number="table.entries.campanhasEspecificas" 
                />
                <q-input 
                  label="Auxílio"
                  type="number"
                  prefix="R$"
                  reverse-fill-mask 
                  v-model.number="table.entries.auxilio" 
                />
                <q-input 
                  label="Empréstimos"
                  prefix="R$"
                  reverse-fill-mask 
                  type="number"
                  v-model.number="table.entries.emprestimos" 
                />
                <q-input 
                  label="Todas as Outras receitas"
                  prefix="R$"
                  type="number"
                  reverse-fill-mask 
                  v-model.number="table.entries.todasOutrasReceitas" 
                />
              </div>
              <div style="border-radius: 1rem; background-color: rgb(245, 245, 245);" class="q-gutter-y-md q-pa-md">
                <div class="text-h5">
                  Saídas
                </div>
                <div class="text-h6">
                  Contribuição registrada no SGA <q-chip color="blue text-white">R$ {{ contributionOutputSum ? contributionOutputSum : '0' }}</q-chip>
                </div>
                <div class="text-green" v-if="contributionCalculatedMore > 0">
                  Contribuição registrada no SGA e calculado 11% R$ {{ contributionCalculatedMore }} <q-icon name="north"/>
                </div>
                <div class="text-red" v-else-if="contributionCalculatedLess > 0">
                  Contribuição registrada no SGA e calculado 11% R$ {{ contributionCalculatedLess }} <q-icon name="south"/>
                </div>
                <q-input 
                  label="Contribuição Distrito"
                  prefix="R$"
                  type="number"
                  v-model.number="table.output.contribuicaoDistrito" 
                />
                <q-input 
                  label="Devolução de empréstimos IELB"
                  prefix="R$"
                  type="number"
                  reverse-fill-mask 
                  v-model.number="table.output.devolucaoEmprestimoIELB" 
                />
                <q-input 
                  prefix="R$"
                  type="number"
                  label="Todas as outras saídas"
                  reverse-fill-mask 
                  v-model.number="table.output.todasSaidas" 
                />
              </div>
              <q-btn
                label="Salvar como rascunho"
                class="q-ma-md text-center"
                color="yellow-8"
                unelevated
                rounded
                no-caps
                @click="insertFinanceStatisticsDraft"
              />
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
      pagination: {
        sortBy: '',
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: 'desc',
        descending: false,
        searchString: ''
      },
      contributionCalculatedMore: 0,
      contributionCalculatedLess: 0,
      contributionOutputSum: null,
      contributionEntriesSum: null,
      table: {
        entries:{
          saldoAnterior: 0,
          receitasRegulares: {
            ofertasDominicais: 0,
            ofertasMensais: 0,
            receitasAlugueis: 0,
          },
          ofertasEspeciais: 0,
          campanhasEspecificas: 0,
          auxilio: 0,
          emprestimos: 0,
          todasOutrasReceitas: 0,
        },
        output: {
          contribuicaoIELB: {
            ofertasDominicais: 0,
            ofertasMensais: 0,
            receitasAlugueis: 0,
          },
          contribuicaoDistrito: 0,
          devolucaoEmprestimoIELB: 0,
          todasSaidas: 0
        },
  
      },
    }
  },
  beforeMount() {
    this.getFinanceStatisticByOrganismId()
  },
  methods: {
    calculateOfferPercents(){
      const total = null
      
      const outPutTotalPercents = null
      const ofertasDominicais = +this.table.entries.receitasRegulares.ofertasDominicais
      const ofertasMensais = +this.table.entries.receitasRegulares.ofertasMensais
      const receitasAlugueis = +this.table.entries.receitasRegulares.receitasAlugueis
      total = ofertasDominicais + ofertasMensais + receitasAlugueis
      outPutTotalPercents = +this.contributionOutputSum - +this.contributionOutputSum * 0.11
      if(total * 0.11 >= outPutTotalPercents){
        this.contributionCalculatedMore = total * 0.11
        console.log('mais', this.contributionCalculatedMore)
      }else if(total * 0.11 < outPutTotalPercents){
        console.log('menos', this.contributionCalculatedLess)
        this.contributionCalculatedLess = total * 0.11
      }
    },
    insertFinanceStatisticsDraft() {
      this.calculateOfferPercents()
      const opt = {
        route: "/desktop/statistics/insertFinanceStatisticsDraft",
        body: {
          organismId: this.$route.query.organismId,
          financeData: this.table
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
        this.$q.notify('Dados salvos como rascunho')
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
        this.contributionOutputSum = r.data.list[0].contributionOutput
        this.contributionEntriesSum = r.data.list[0].contributionEntries
        // this.table.output = r.data.financeData.output ? r.data.financeData.output : 
        // this.table.output = {
        //   contribuicaoIELB: {
        //     ofertasDominicais: '',
        //     ofertasMensais: '',
        //     receitasAlugueis: '',
        //   },
        //   contribuicaoDistrito: '',
        //   devolucaoEmprestimoIELB: '',
        //   todasSaidas: ''
        // },
        // this.table.entries = r.data.financeData.entries ? r.data.financeData.entries :  
        // this.table.entries = {
        //   saldoAnterior: '',
        //   receitasRegulares: {
        //     ofertasDominicais: '',
        //     ofertasMensais: '',
        //     receitasAlugueis: '',
        //   },
        //   ofertasEspeciais: '',
        //   campanhasEspecificas: '',
        //   auxilio: '',
        //   emprestimos: '',
        //   todasOutrasReceitas: '',
        // }
      });
    },
  }
})
</script>

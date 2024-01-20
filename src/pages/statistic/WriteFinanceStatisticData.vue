<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" label="Introdução" @click="$router.push('/statistic/introWriteStatisticData')"/>
            <q-breadcrumbs-el label="Completar estatística" />
            <q-breadcrumbs-el label="Financeiro"/>
          </q-breadcrumbs>
        </div>
        <div class="text-capitalize"> 
          <div class="text-h5 q-mb-sm text-center">
            Estatística 2023
            <div class="text-h6">Dados Financeiros</div>
          </div>
          <div class="row">
            <div class="col q-gutter-y-md">
              <div class="text-h5">
                Entradas
              </div>
              <q-input 
                outlined 
                type="number"
                prefix="R$"
                label="Saldo anterior"
                reverse-fill-mask
                v-model.number="table.entries.saldoAnterior" 
              />
              <div class="no-margin">
                Receitas regulares
                <q-input 
                  outlined 
                  prefix="R$"
                  type="number"
                  label="Ofertas dominicais"
                  reverse-fill-mask 
                  v-model.number="table.entries.receitasRegulares.ofertasDominicais" 
                />
              </div>
              <div class="no-margin">
                Receitas regulares
                <q-input 
                  outlined 
                  label="Ofertas mensais"
                  prefix="R$"
                  type="number"
                  reverse-fill-mask 
                  v-model.number="table.entries.receitasRegulares.ofertasMensais" 
                />
              </div>
              <div class="no-margin">
                Receitas regulares
                <q-input 
                  outlined 
                  prefix="R$"
                  type="number"
                  label="Receitas de aluguéis"
                  reverse-fill-mask 
                  v-model.number="table.entries.receitasRegulares.receitasAlugueis" 
                />
              </div>
              <q-input 
                outlined 
                prefix="R$"
                label="Ofertas especiais"
                reverse-fill-mask 
                type="number"
                v-model.number="table.entries.ofertasEspeciais" 
              />
              <q-input 
                outlined 
                prefix="R$"
                label="Campanhas específicas"
                type="number"
                reverse-fill-mask 
                v-model.number="table.entries.campanhasEspecificas" 
              />
              <q-input 
                outlined 
                label="Auxílio"
                type="number"
                prefix="R$"
                reverse-fill-mask 
                v-model.number="table.entries.auxilio" 
              />
              <q-input 
                outlined 
                label="Empréstimos"
                prefix="R$"
                reverse-fill-mask 
                type="number"
                v-model.number="table.entries.emprestimos" 
              />
              <q-input 
                outlined 
                label="Todas as Outras receitas"
                prefix="R$"
                type="number"
                reverse-fill-mask 
                v-model.number="table.entries.todasOutrasReceitas" 
              />
              <div class="text-h5">
                Saídas
              </div>
              <div class="no-margin">
                Contribuição IELB
                <q-input 
                  outlined 
                  type="number"
                  label="Ofertas dominicais"
                  prefix="R$"
                  v-model.number="table.output.contribuicaoIELB.ofertasDominicais" 
                />
              </div>
              <div class="no-margin">
                Contribuição IELB
                <q-input 
                  outlined 
                  type="number"
                  prefix="R$"
                  label="Ofertas mensais"
                  v-model.number="table.output.contribuicaoIELB.ofertasMensais" 
                />
              </div>
              <div class="no-margin">
                Contribuição IELB
                <q-input 
                  outlined 
                  label="Receitas de aluguéis"
                  type="number"
                  prefix="R$"
                  reverse-fill-mask 
                  v-model.number="table.output.contribuicaoIELB.receitasAlugueis" 
                />
              </div>
              <q-input 
                outlined 
                label="Contribuição Distrito"
                prefix="R$"
                type="number"
                v-model.number="table.output.contribuicaoDistrito" 
              />
              <q-input 
                outlined 
                label="Devolução de empréstimos IELB"
                prefix="R$"
                type="number"
                reverse-fill-mask 
                v-model.number="table.output.devolucaoEmprestimoIELB" 
              />
              <q-input 
                outlined 
                prefix="R$"
                type="number"
                label="Todas as outras saídas"
                reverse-fill-mask 
                v-model.number="table.output.todasSaidas" 
              />
              <q-btn
                label="Salvar como rascunho"
                class="q-ma-md text-center"
                color="yellow-8"
                unelevated
                rounded
                no-caps
                @click="insertFinanceStatistics"
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
            ofertasMensais: null,
            receitasAlugueis: '',
          },
          contribuicaoDistrito: '',
          devolucaoEmprestimoIELB: '',
          todasSaidas: ''
        }
      },
    }
  },
  beforeMount() {
    this.getFinanceStatisticByOrganismId()
  },
  methods: {
    insertFinanceStatistics() {
      console.log()
      const opt = {
        route: "/desktop/statistics/insertFinanceStatistics",
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
        this.$router.back()
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
        this.table.output = r.data.financeData.output ? r.data.financeData.output : 
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
        this.table.entries = r.data.financeData.entries ? r.data.financeData.entries :  
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

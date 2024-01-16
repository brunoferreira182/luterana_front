<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="text-h5 q-ma-sm">
        Introdução a Estatística 2023!
      </div>
      <div class="q-ma-md text-h6">
        <div>
          Boa notícia! A Estatística 2023 será feita através do Tabula! 
        </div>
        <div>
          Fique atento às instruções para não ter dúvidas na hora de preencher.
        </div>
      </div>
      <div class="q-ma-md q-mt-lg">
        <div class="text-h6 text-wrap q-mb-md">
          1. Em cada sessão do formulário, você poderá observar que existe o ícone <q-icon name="help"><q-tooltip>Dicas aqui</q-tooltip></q-icon>, ele trará informações sobre a etapa presente para tirar possíveis dúvidas.
        </div>
        <div class="text-h6 text-wrap q-mb-md">
          2. Não conseguiu terminar o formulário? Não tem problema! Você pode salvar como rascunho e terminar quando for possível.
        </div>
        <div class="text-h6 text-wrap q-mb-md">
          3. Existe alguma informação desatualizada? Basta clicar no lápis  <q-icon name="edit"/> para editar a informação.
        </div>
      </div>
      <div class="q-ma-md q-mt-lg">
        <div class="text-h5">
          Sobre as etapas:
        </div>
        <div class="text-h6">
          A estatística será dividida em 3 etapas, sendo elas:
        </div>
        <div class="q-mt-md text-h6 text-wrap">
          <div class="q-mt-md">
            <strong>1. Etapa Pastoral:</strong> Este bloco será preenchido somente pelo pastor, dedicado aos dados pastorais.
          </div>
          <div class="q-mt-md">
            <strong>2. Etapa Congregacional:</strong> Este bloco é dedicado às congregações e paróquias.
          </div>
          <div class="q-mt-md">
            <strong>3. Financeiro:</strong> Este bloco é dedicado para os dados financeiros.
          </div>
        </div>
      </div>
      <div class="q-ma-md q-mt-lg">
        <div class="text-h5">
          Status de envio:
        </div>
        <div class="fit column content-center">
          <q-btn
            class="q-ma-sm"
            label="Dados pastorais"
            :color="pastorStatus.color"
            rounded
            @click="goToPastorTab"
            unelevated
          >
            <q-tooltip>{{ pastorStatus.tooltip }}</q-tooltip>
          </q-btn>
          <q-btn
            class="q-ma-sm"
            label="Dados congregacionais"
            :color="organismStatus.color"
            @click="goToCongregationalView"
            rounded
            unelevated
          >
            <q-tooltip>
              {{ organismStatus.tooltip }}
            </q-tooltip>
          </q-btn>
          <q-btn
            class="q-ma-sm"
            label="Dados financeiros"    
            :color="financceData.color"
            rounded    
            @click="goToFinanceView"
            unelevated  
          >
            <q-tooltip>
              {{ financceData.tooltip }}
            </q-tooltip>
          </q-btn>
        </div>
      </div>
      <!-- <div class="q-mt-xl text-right q-mr-xl">
        <q-btn
          color="primary"
          unelevated
          rounded
          no-caps
          label="Prosseguir"
          @click="goToStatistics"
        />
      </div> -->
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "src/boot/useFetch";
export default defineComponent({
  name:"IntroStatistics",
  data() {
    return {
      pastorStatus: {
        color: 'red-8',
        tooltip: 'Bloco ainda não iniciado',
      },
      organismStatus: {
        color:  'red-8',
        tooltip: 'Bloco ainda não iniciado',
      },
      financceData: {
        color: 'red-8',
        tooltip: 'Bloco ainda não iniciado',
      },
      statisticStatus: null
    }
  },
  beforeMount(){
    this.getMyOrganismsToChooseOne()
    this.getStatisticStatus()
  },
  methods: {
    goToFinanceView() {
      this.$router.push('/statistic/writeFinanceStatisticData?organismId=' + this.$route.query.organismId + '&t=f')
    },
    goToCongregationalView() {
      this.$router.push('/statistic/WriteCongregationalStatisticData?organismId=' + this.$route.query.organismId + '&t=c')
    },
    goToPastorTab() {
      this.$router.push('/statistic/PastorData?organismId=' + this.$route.query.organismId + '&t=p')
    },
    verifyStatusTypes() {
      console.log('me chamaram')
      this.statisticStatus.forEach((status) => {
        if (status.type === 'financceStatistics') {
          if (status.status.value === 'draft') {
            this.financceData.color = 'yellow-8'
            this.financceData.tooltip = 'Rascunho imcompleto'
          } else if (status.status.value === 'completeDraft') {
            this.financceData.color = 'green-8'
            this.financceData.tooltip = 'Rascunho completo'
          }
        }
        if (status.type === 'pastoralStatistics') {
          if (status.status.value === 'draft') {
            this.pastorStatus.color = 'yellow-8'
            this.pastorStatus.tooltip = 'Rascunho imcompleto'
          }
        } else if (status.status.type === 'pastoralStatistics') {
          if (status.status.value === 'completeDraft') {
            this.pastorStatus.color = 'green-8'
            this.pastorStatus.tooltip = 'Rascunho completo'
          }
        }
      })
    },
    getStatisticStatus() {
      const opt = {
        route: '/desktop/statistics/getStatisticStatusByOrganismId',
        body: {
          organismId: this.$route.query.organismId
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) return
        this.statisticStatus = r.data
        this.verifyStatusTypes()
      })
    },
    goToStatistics() {
      const organismId = this.$route.query.organismId
      this.$router.push('/user/statistic?organismId=' + organismId)
    },
    getMyOrganismsToChooseOne(){
      const opt = {
        route: "/desktop/statistics/getMyOrganismsToChooseOne",
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        console.log(r, 'CUZIZIZIZIZI')
        // this.organismsFinancesStatistics = r.data.list
      });
    },
  }
})
</script>
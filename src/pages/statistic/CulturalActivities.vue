<template>
  <q-page-container class="no-padding">
    <q-page >
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs align="center">
          <q-breadcrumbs-el 
            style="cursor: pointer" 
            icon="home" 
            label="Introdução" 
            @click="goToIntro"
          />
          <q-breadcrumbs-el 
            :label="congregationName" 
            style="cursor: pointer" 
            class="text-wrap"
            @click="backToChoose"
          />
          <q-breadcrumbs-el label="Atividades cúlticas" />
        </q-breadcrumbs>
      </div>
      <div class="q-ma-lg q-gutter-sm text-h6 text-center">
        Atividades Cúlticas
      </div>
      <div class="row justify-center q-pa-md">
        <div class="col q-gutter-y-md" v-if="culturalActivities && culturalActivities.length > 0">
          <div
            v-for="(cultural, i) in culturalActivities"
            :key="i"
            style="border-radius: 1rem; background-color: rgb(245, 245, 245);"
            class="q-pa-md"
          >
            <div class="text-h5" >
              <u>{{ cultural.organismName }}</u>
            </div>
            <!-- <div class="q-mt-md">
              Culto
            </div> -->
            <q-input
              type="number"
              label="Quantos cultos por pastor *"
              v-model="cultural.activitiesData.cultoData.qtyDadosPastor"
            />
            <q-input
              type="number"
              label="Quantos cultos de leitura *"
              v-model="cultural.activitiesData.cultoData.qtyCultoLeitura"
            />
            <q-input
              type="number"
              label="Soma total de frequência no ano *"
              v-model="cultural.activitiesData.cultoData.somaFrequenciaAnual"
            />
            <div class="q-py-md">
              <div class="q-mt-md">
                Santa Ceia
              </div>
              <div class="row q-gutter-md ">
                <q-input
                  class="col"
                  type="number"
                  label="* Quantidade no ano"
                  v-model="cultural.activitiesData.santaCeiaData.qtyOferecidaAnual"
                />
                <q-input
                  class="col"
                  type="number"
                  label="* Frequencia total comungantes"
                  v-model="cultural.activitiesData.santaCeiaData.somaTotalComungantes"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="q-ma-lg text-center">
        <q-chip
          v-if="validated"
          color="green"
          label="Preenchido"
          text-color="white"
          icon="done"
        />
  
        <q-chip
          v-else-if="!validated && culturalActivities !== null"
          color="orange"
          label="Rascunho"
          text-color="white"
          icon="warning"
        />

        <q-chip
          v-if="!validated && !culturalActivities"
          color="red"
          label="Não preenchido"
          text-color="white"
          icon="warning"
        />
        <div v-if="(status && status.value !== 'sent') || !status">
          <q-btn
            label="Salvar rascunho"
            color="primary"
            rounded
            unelevated
            class="full-width q-my-sm"
            no-caps
            @click="saveDraft"
          />
          <q-btn
            label="Salvar Oficial"
            color="orange"
            rounded
            unelevated
            class="full-width q-my-sm"
            no-caps
            @click="saveOficial"
          />
        </div>
        <div v-else class="text-h6 q-ma-sm">
          Etapa finalizada
        </div>
        <div class="row q-gutter-sm q-pt-xs justify-end">
          <div class="col-6">
            <q-btn
              label="Próxima etapa"
              color="primary"
              rounded
              unelevated
              icon-right="navigate_next"
              class="col items-end full-width"
              no-caps
              @click="$router.push('/statistic/groupActivity?organismId=' + $route.query.organismId)"
            /> 
          </div>
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "src/boot/useFetch";
export default defineComponent({
  name: "CulturalActivities",
  data() {
    return {
      validated: false,
      canNavigate: true,
      timerToSave: null,
      congregationData: {},
      culturalActivities: [],
      congregationName: '',
      status: null
    }
  },

async beforeUnmount(){
    this.stopTimerToSaveDraft()
    const r = await this.getAtividadesCulticas()
    if ((r.data && r.data.status && r.data.status.value === 'notSent') || r.data && !r.data.status) this.saveDraft()
  },
async beforeMount() {
  this.startTimerToSaveDraft()
  const r = await this.getAtividadesCulticas()
  this.putAtividadesCulticasOnData(r)
  this.getOrganismNameForBreadCrumbs()
  },
  methods: {
    backToChoose() {
      if (this.$route.query.parishId) {
        this.$router.push('/statistic/completeStatistic?organismId=' + this.$route.query.organismId + '&parishId=' + this.$route.query.parishId)
      } else this.$router.push('/statistic/completeStatistic?organismId=' + this.$route.query.organismId)
    },
    goToIntro() {
      if (this.$route.query.parishId) {
        this.$router.push('/statistic/IntroWriteStatisticData?parishId=' + this.$route.query.parishId)
      } else {
        this.$router.push('/statistic/IntroWriteStatisticData')
      }
    },
    startTimerToSaveDraft() {
      this.timerToSave = true;
      this.methodToSaveTimerDraft();
    },
    stopTimerToSaveDraft() {
      this.timerToSave = false;
      clearTimeout(this.timerId);
    },
    methodToSaveTimerDraft(){
      if (this.timerToSave){
        this.timerId = setTimeout(() => {
        this.saveDraft()
        this.methodToSaveTimerDraft()
      }, 300000);
    }
  },
    async getAtividadesCulticas() {
      const opt = {
        route: "/desktop/statistics/getAtividadesCulticas",
        body: {
          organismId: this.$route.query.organismId,
        },
      };
      this.$q.loading.show()
      let r = await useFetch(opt)
      this.$q.loading.hide()
      return r
    },
    putAtividadesCulticasOnData(r) {
      if (r.error) return
      if (r.data.status) {
        this.status = r.data.status
      }
      r.data.validated ? this.validated = r.data.validated : this.validated = false
      if (r.data.type && r.data.type === 'atividadesCulticasStatistics') {
        this.culturalActivities = r.data.activitiesData
      } else {
        this.culturalActivities = r.data
      }
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
    saveDraft() {
      for (let i = 0; i < this.culturalActivities.length; i++){
        if (this.culturalActivities[i].activitiesData.cultoData.qtyDadosPastor === '' ||  this.culturalActivities[i].activitiesData.cultoData.qtyCultoLeitura === ''
          ||  this.culturalActivities[i].activitiesData.cultoData.somaFrequenciaAnual === '' ||  this.culturalActivities[i].activitiesData.santaCeiaData.qtyOferecidaAnual === ''
          ||  this.culturalActivities[i].activitiesData.santaCeiaData.somaTotalComungantes === '') return this.$q.notify('Preencha todos os campos antes de salvar!')
        }
      this.extractedData = [];
      this.culturalActivities.forEach((item, index) => {
        const extractedItem = {
          organismName: item.organismName,
          activitiesData: item.activitiesData,
        };
        if (index === 0) {
          //a congregação precisa ser o primeiro índice sempre
          extractedItem.congregationId = item.organismId;
        } else {
          extractedItem.organismId = item.childOrganismId;
        }
        this.extractedData.push(extractedItem);
      });
      const opt = {
        route: "/desktop/statistics/insertAtividadesCulticasStatisticDraft",
        body: {
          organismId: this.$route.query.organismId,
          activitiesData: this.extractedData
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify('Ocorreu um problema, tente novamente mais tarde')
          return
        }
        this.$q.notify('Rascunho salvo com sucesso!')
        this.getAtividadesCulticas()
        return
      });
    },
    async saveOficial(){
      for(let i = 0; i < this.culturalActivities.length; i++){
        if (this.culturalActivities[i].activitiesData.cultoData.qtyDadosPastor === '' ||  this.culturalActivities[i].activitiesData.cultoData.qtyCultoLeitura === ''
        ||  this.culturalActivities[i].activitiesData.cultoData.somaFrequenciaAnual === '' ||  this.culturalActivities[i].activitiesData.santaCeiaData.qtyOferecidaAnual === ''
        ||  this.culturalActivities[i].activitiesData.santaCeiaData.somaTotalComungantes === '') return this.$q.notify('Preencha todos os campos antes de salvar!')
      }
      this.extractedData = [];
      this.culturalActivities.forEach((item, index) => {
        const extractedItem = {
          organismName: item.organismName,
          activitiesData: item.activitiesData,
        };
        if (index === 0) {
          //a congregação precisa ser o primeiro índice sempre
          extractedItem.congregationId = item.organismId;
        } else {
          extractedItem.organismId = item.childOrganismId;
        }
        this.extractedData.push(extractedItem);
      });

      let opt = {
        route: "/desktop/statistics/insertAtividadesCulticasStatisticDraft",
        body: {
          organismId: this.$route.query.organismId,
          activitiesData: this.extractedData
        },
      }
      let r = await useFetch(opt)
      
      if (r.error) return
      
      opt = {
        route: "/desktop/statistics/insertAtividadesCulticasStatisticsDone",
        body: {
          organismId: this.$route.query.organismId,
          activitiesData: this.extractedData
        },
      };
      this.$q.loading.show()
      r = await useFetch(opt)
      this.$q.loading.hide()
      if (r.error) {
        this.$q.notify('Ocorreu um problema, tente novamente mais tarde')
        return
      }
      this.$q.notify('Atividades salvas com sucesso!')
      this.$router.push('/statistic/groupActivity?organismId=' + this.$route.query.organismId)
    },
    handleBackNavigation() {
      if (this.canNavigateBack) {
        this.$router.back();
      } else {
        this.$q.notify('Complete todos os campos antes de salvar!');
      }
    }
  }
})
</script>
<style scoped>
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.item-section {
  position: relative;
}
.form-section {
  position: absolute;
  top: 100%; /* Ajuste conforme necessário para a posição desejada */
  left: 0;
  width: 100%;
  z-index: 1;
}
</style>
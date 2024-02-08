<template>
  <q-page-container class="no-padding">
    <q-page >
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
              class="text-wrap"
              @click="$router.push('/statistic/completeStatistic?organismId=' + $route.query.organismId)"
            />
            <q-breadcrumbs-el label="Atividades cúlticas" />
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
              @click="$router.push('/statistic/culturalActivities?organismId=' + org._id)"
            >
              {{ org.name }}
            </q-chip>
          </div>
          <q-separator
            class="q-mt-md q-mx-md"
          ></q-separator>
        </div>
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
            <div class="q-mt-md">
              Culto
            </div>
            <q-input
              type="number"
              label="Quantos cultos por pastor"
              v-model="cultural.activitiesData.cultoData.qtyCultosPastor"
            />
            <q-input
              type="number"
              label="Quantos cultos de leitura"
              v-model="cultural.activitiesData.cultoData.qtyCultoLeitura"
            />
            <q-input
              type="number"
              label="Soma total de frequência no ano"
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
                  label="Quantidade no ano"
                  v-model="cultural.activitiesData.santaCeiaData.qtyOferecidaAnual"
                />
                <q-input
                  class="col"
                  type="number"
                  label="Frequencia total de comungantes"
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
          label="Validado"
          text-color="white"
          icon="done"
        />
  
        <q-chip
          v-else-if="!validated && culturalActivities !== null"
          color="orange"
          label="Rascunho"
          text-color="white"
          icon="warning"
        /><br>

        <q-chip
          v-if="!validated && !culturalActivities"
          color="red"
          label="Não iniciada"
          text-color="white"
          icon="warning"
        /><br>
  
        <q-btn
          label="Salvar rascunho"
          color="primary"
          rounded
          unelevated
          class="full-width"
          no-caps
          @click="saveDraft"
        />
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
      congregationData: {},
      culturalActivities: [],
      congregationName: '',
      otherOrganisms: []
    }
  },
  watch: {
    '$route.query.organismId': {
      handler(newOrganismId, oldOrganismId) {
        if (newOrganismId !== oldOrganismId) {
          this.getAtividadesCulticas()
          this.getOrganismNameForBreadCrumbs()
          this.getOthersCongregations()
        }
      },
      immediate: true
    }
  },
  beforeUnmount(){
    this.saveDraftOnBeforeUnmount()
  },
  beforeMount() {
    this.getAtividadesCulticas()
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
    getAtividadesCulticas() {
      const opt = {
        route: "/desktop/statistics/getAtividadesCulticas",
        body: {
          organismId: this.$route.query.organismId,
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify('Ocorreu um problema, tente novamente mais tarde')
          return
        }
        r.data.validated ? this.validated = r.data.validated : this.validated = false
        if (r.data.type && r.data.type === 'atividadesCulticasStatistics') {
          this.culturalActivities = r.data.activitiesData
        } else {
          this.culturalActivities = r.data
        }
        
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
    saveDraftOnBeforeUnmount() {
      for(let i = 0; i < this.culturalActivities.length; i++){
        if (this.culturalActivities[i].activitiesData.cultoData.qtyDadosPastor === '' ||  this.culturalActivities[i].activitiesData.cultoData.qtyCultoLeitura === ''
            ||  this.culturalActivities[i].activitiesData.cultoData.somaFrequenciaAnual === '' ||  this.culturalActivities[i].activitiesData.santaCeiaData.qtyOferecidaAnual === ''
            ||  this.culturalActivities[i].activitiesData.santaCeiaData.somaTotalComungantes === '') {
              return this.$q.notify('CAMPOS OBRIGATÓRIOS NÃO PREENCHIDOS!')
            }
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
      });
    },
    saveDraft() {
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
        this.$router.back()
        this.getAtividadesCulticas()
      });
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
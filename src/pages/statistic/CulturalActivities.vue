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
              @click="$router.push('/statistic/completeStatistic?organismId=' + $route.query.organismId)"
            />
            <q-breadcrumbs-el label="Financeiro" />
          </q-breadcrumbs>
        </div>
      <div class="q-ma-lg q-gutter-sm text-h6 text-center">
        Atividades Cúlticas
      </div>
      <div class="row justify-center q-pa-md">
        <div class="col q-gutter-y-md" v-if="culturalActivities && culturalActivities.length > 0">
          <div
            v-for="(item, index) in culturalActivities"
            :key="index"
            style="border-radius: 1rem; background-color: rgb(245, 245, 245);"
            class="q-pa-md"
          >
            <div class="text-h6">
              Culto {{ item.organismName }}
            </div>
            <q-input
              type="number"
              label="Quantos dados por pastor"
              v-model.number="item.activitiesData.cultoData.qtyDadosPastor"
            />
            <q-input
              type="number"
              label="Quantos cultos de leitura"
              v-model.number="item.activitiesData.cultoData.qtyCultoLeitura"
            />
            <q-input
              type="number"
              label="Soma total de frequência no ano"
              v-model.number="item.activitiesData.cultoData.somaFrequenciaAnual"
            />
            <div class="q-py-xl">
              <div class="text-h6">
                Santa-ceia
              </div>
              <q-input
                type="number"
                label="Quantidade oferecida no ano"
                v-model.number="item.activitiesData.santaCeiaData.qtyOferecidaAnual"
              />
              <q-input
                type="number"
                label="Soma total de comungantes"
                v-model.number="item.activitiesData.santaCeiaData.somaTotalComungantes"
              />
            </div>
          </div>
        </div>
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
          @click="insertAtividadesCulticasStatisticDraft"
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
      congregationData:{},
      activitiesData:{
        cultoData: {
          qtyDadosPastor: 0,
          qtyCultoLeitura: 0,
          somaFrequenciaAnual: 0,
        },
        santaCeiaData: {
          qtyOferecidaAnual: 0,
          somaTotalComungantes: 0,
        },
      },
    
    }
  },
  beforeMount() {
    this.getAtividadesCulticas()
    this.getPontosDeMissaoByOrganismId()
    this.getOrganismNameForBreadCrumbs()
  },
  methods: {
    getPontosDeMissaoByOrganismId() {
      const opt = {
        route: "/desktop/statistics/getPontosDeMissaoByOrganismId",
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
        console.log(r)
        this.culturalActivities = r.data.organismList
      });
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
        this.validated = r.data.validated
        this.culturalActivities = r.data.activitiesData
      });
    },
    getOrganismNameForBreadCrumbs() {
    const opt = {
      route: "/desktop/statistics/getCongregacaoByOrganismId",
      body: {
        // organismId: "6530487ab2980d56e0985464",
        organismId: this.$route.query.organismId
      },
    };
      useFetch(opt).then((r) => {
        if (r.error) return;
        this.congregationName = r.data.organismName 
      });
    },
    insertAtividadesCulticasStatisticDraft() {
      this.extractedData = [];
      this.culturalActivities.forEach((item, index) => {
        const extractedItem = {
          organismName: item.organismName,
          activitiesData: item.activitiesData,
        };
        if (index === 0) {
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
        this.$q.notify('Dados salvos como rascunho')
      });
    },
  }
})
</script>
<style>
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
<template>
  <q-page-container class="no-padding">
    <q-page >
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
          <q-breadcrumbs-el label="Atividades cúlticas" />
        </q-breadcrumbs>
      </div>
      <div class="row justify-center q-pa-md">
        <div class="col q-gutter-y-md">
          <div style="border-radius: 1rem; background-color: rgb(245, 245, 245);" class="q-pa-md">
            <div class="text-h5">
              Culto
            </div>
            <q-input 
              type="number"
              label="Quantos dados por pastor"
              v-model.number="activitiesData.cultoData.qtyDadosPastor" 
            />
            <q-input 
              type="number"
              label="Quantos cultos de leitura"
              v-model.number="activitiesData.cultoData.qtyCultoLeitura" 
            />
            <q-input 
              type="number"
              label="Soma total de frequência no ano"
              v-model.number="activitiesData.cultoData.somaFrequenciaAnual" 
            />
          </div>
          <div style="border-radius: 1rem; background-color: rgb(245, 245, 245);" class="q-pa-md">
            <div class="text-h5">
              Santa-ceia
            </div>
            <q-input 
              type="number"
              label="Quantidade oferecida no ano"
              v-model.number="activitiesData.santaCeiaData.qtyOferecidaAnual" 
            />
            <q-input 
              type="number"
              label="Soma total de comungantes"
              v-model.number="activitiesData.santaCeiaData.somaTotalComungantes" 
            />
          </div>
        </div>
      </div>
      <q-btn
        label="Salvar como rascunho"
        class="q-ma-md text-center"
        color="yellow-8"
        unelevated
        rounded
        no-caps
        @click="insertAtividadesCulticasStatisticDraft"
      />
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
  },
  methods: {
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
        this.activitiesData - r.data.activitiesData
        console.log(r)
      });
    },
    insertAtividadesCulticasStatisticDraft() {
      const opt = {
        route: "/desktop/statistics/insertAtividadesCulticasStatisticDraft",
        body: {
          organismId: this.$route.query.organismId,
          activitiesData: this.activitiesData
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
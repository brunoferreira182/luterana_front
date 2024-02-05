<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs align="center">
          <q-breadcrumbs-el 
            style="cursor: pointer;" 
            icon="home" 
            label="Escolher Congregação" 
            @click="$router.push('/statistic/selectOrganismToWriteStatisticData')"
          />
          <q-breadcrumbs-el 
            :label="congregationName"
            style="cursor: pointer;" 
          >
          </q-breadcrumbs-el>
        </q-breadcrumbs>
      </div>
      <div class="fit column q-mt-lg content-center">
        <q-item class="card" clickable @click="$router.push('/statistic/culturalActivities?organismId=' + $route.query.organismId)">
          <q-item-section>
            <q-item-label class="text-h5" />Atividades cúlticas
          </q-item-section>
          <q-chip
            v-if="validationResume.atividadesCulticasStatistics === 't'"
            label="Validado"
            color="green"
            text-color="white"
          />
          <q-chip
            v-if="validationResume.atividadesCulticasStatistics === 'f'"
            label="Em andamento"
            color="orange"
            text-color="white"
          />
          <q-chip
            v-if="!validationResume.atividadesCulticasStatistics"
            label="Não iniciado"
            color="red"
            text-color="white"
          />
        </q-item>
        <q-item class="card" clickable @click="$router.push('/statistic/groupActivity?organismId=' + $route.query.organismId)" >
          <q-item-section>
            Atividades de grupos
          </q-item-section>
          <q-chip
            v-if="validationResume.groupActivity === 't'"
            label="Validado"
            color="green"
            text-color="white"
          />
          <q-chip
            v-if="validationResume.groupActivity === 'f'"
            label="Em andamento"
            color="orange"
            text-color="white"
          />
          <q-chip
            v-if="!validationResume.groupActivity"
            label="Não iniciado"
            color="red"
            text-color="white"
          />
          <!-- <q-chip
            :label="validationResume.groupActivity ? 'Validado' : 'Não validado'"
            :color="validationResume.groupActivity ? 'green' : 'red'"
            text-color="white"
          /> -->
        </q-item>
        <q-item class="card" clickable @click="$router.push('/statistic/membersMovement?organismId=' + $route.query.organismId)">
          <q-item-section>
            <q-item-label class="text-h5"  />Movimento de membros
            
          </q-item-section>
          <q-chip
            v-if="validationResume.membersMovement === 't'"
            label="Validado"
            color="green"
            text-color="white"
          />
          <q-chip
            v-if="validationResume.membersMovement === 'f'"
            label="Em andamento"
            color="orange"
            text-color="white"
          />
          <q-chip
            v-if="!validationResume.membersMovement"
            label="Não iniciado"
            color="red"
            text-color="white"
          />
          <!-- <q-chip
            :label="validationResume.membersMovement ? 'Validado' : 'Não validado'"
            :color="validationResume.membersMovement ? 'green' : 'red'"
            text-color="white"
          /> -->
        </q-item>
        <q-item class="card" clickable @click="$router.push('/statistic/writeFinanceStatisticData?organismId=' + $route.query.organismId)">
          <q-item-section>
            <q-item-label class="text-h5" />Financeiro
          </q-item-section>
          <q-chip
            v-if="validationResume.financeStatistics === 't'"
            label="Validado"
            color="green"
            text-color="white"
          />
          <q-chip
            v-if="validationResume.financeStatistics === 'f'"
            label="Em andamento"
            color="orange"
            text-color="white"
          />
          <q-chip
            v-if="!validationResume.financeStatistics"
            label="Não iniciado"
            color="red"
            text-color="white"
          />
          <!-- <q-chip
            :label="validationResume.financeStatistics ? 'Validado' : 'Não validado'"
            :color="validationResume.financeStatistics ? 'green' : 'red'"
            text-color="white"
          /> -->
        </q-item>
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "src/boot/useFetch";
export default defineComponent({
  name: "CompleteStatistic",
  data() {
    return {
      statisticStatus: null,
      congregationName:'',
      validationResume: {}
    }
  },
  beforeMount() {
    this.getMyOrganismsToChooseOne()
    this.getStatisticStatusByOrganismId()
    this.getValidationResumeByOrganism()
    this.getOrganismNameForBreadCrumbs()
  },
  methods: {
   
    getValidationResumeByOrganism () {
      const opt = {
        route: '/desktop/statistics/getValidationResumeByOrganism',
        body: {
          organismId: this.$route.query.organismId,
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) return
        this.validationResume = r.data
      })
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
    getStatisticStatusByOrganismId() {
      const opt = {
        route: '/desktop/statistics/getStatisticStatusByOrganismId',
        body: {
          organismId: this.$route.query.organismId,
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) return
        this.statisticStatus = r.data
        // this.verifyStatusTypes()
      })
    },
    getMyOrganismsToChooseOne() {
      const opt = {
        route: "/desktop/statistics/getMyOrganismsToChooseOne",
      };
      this.$q.loading.show()
      useFetch(opt).then(() => {
        this.$q.loading.hide()
        // this.organismsFinancesStatistics = r.data.list
      });
    },
  }
})
</script>
<style>
.card {
  border-radius: 1rem;
  height: 9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
  box-shadow: 0px 0px 6px -3px;
}
</style>
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
      <div class="q-pa-sm text-center">
        <q-item class="card" clickable @click="$router.push('/statistic/culturalActivities?organismId=' + $route.query.organismId)">
          <q-item-section>
            <q-item-label class="text-h5" />Atividades cúlticas
          </q-item-section>
          <q-chip
            v-if="validationResume.atividadesCulticasStatistics === 't'"
            label="Etapa finalizada"
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
            label="Etapa finalizada"
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
            label="Etapa finalizada"
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
            label="Etapa finalizada"
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
        <div class="q-px-md">
          <q-btn 
            label="Enviar estatística" 
            rounded 
            color="primary" 
            class="full-width"
            unelevated 
            :disable="canSendStatistic ? false : true"
            @click="insertCongregationalStatisticsDone"
            no-caps 
          />
        </div>
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
      validationResume: {},
      canSendStatistic: null,
    }
  },
  beforeMount() {
    this.getMyOrganismsToChooseOne()
    this.getStatisticStatusByOrganismId()
    this.getValidationResumeByOrganism()
    this.getOrganismNameForBreadCrumbs()
  },
  methods: {
    insertCongregationalStatisticsDone() {
      const opt = {
        route: '/desktop/statistics/insertCongregationalStatisticsDone',
        body: {
          organismId: this.$route.query.organismId,
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) return
        this.$q.notify('Estatística enviada com sucesso')
        this.$router.back()
      })
    },
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
        if (
          this.validationResume &&
          this.validationResume.financeStatistics === 't' &&
          this.validationResume.membersMovement === 't' &&
          this.validationResume.groupActivity === 't' &&
          this.validationResume.atividadesCulticasStatistics === 't'
        ) {
          this.canSendStatistic = true;
        }
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
<style scoped>
.card{
  border-radius: 1rem; 
  height: 9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgb(248, 248, 248);
  margin: 16px;
  box-shadow: 0px 0px 6px -3px;
}
</style>
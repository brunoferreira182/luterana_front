<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs align="center">
          <q-breadcrumbs-el 
            style="cursor: pointer;" 
            icon="home" 
            label="Completar estatística" 
            @click="$router.push('/statistic/completeStatistic?organismId=' + $route.query.organismId)"
          />
          <q-breadcrumbs-el 
            style="cursor: pointer;" 
          > {{ }} SADAS
          </q-breadcrumbs-el>
          <q-breadcrumbs-el label="Atividades de Grupos" />
        </q-breadcrumbs>
      </div>
      <div class="fit column q-mt-lg content-center">
        <q-item class="card" clickable @click="$router.push('/statistic/culturalActivities?organismId=' + $route.query.organismId)">
          <q-item-section>
            <q-item-label class="text-h5" />Atividades cúlticas
          </q-item-section>
          <q-chip
            v-if="validationResume.atividadesCulticasStatistics"
            label="Validado"
            color="green"
            text-color="white"
          />
          <q-chip
            v-else-if="!validationResume.atividadesCulticasStatistics"
            label="Não validado"
            color="red"
            text-color="white"
          />
        </q-item>
        <q-item class="card" clickable @click="$router.push('/statistic/groupActivity?organismId=' + $route.query.organismId)" >
          <q-item-section>
            Atividades de grupos
          </q-item-section>
          <q-chip
            v-if="validationResume.groupsActivities"
            label="Validado"
            color="green"
            text-color="white"
          />
          <q-chip
            v-else-if="!validationResume.groupsActivities"
            label="Não validado"
            color="red"
            text-color="white"
          />
        </q-item>
        <q-item class="card" clickable @click="$router.push('/statistic/membersMovement?organismId=' + $route.query.organismId)">
          <q-item-section>
            <q-item-label class="text-h5"  />Movimento de membros
            
          </q-item-section>
          <q-chip
            v-if="validationResume.membersMovement"
            label="Validado"
            color="green"
            text-color="white"
          />
          <q-chip
            v-else-if="!validationResume.membersMovement"
            label="Não validado"
            color="red"
            text-color="white"
          />
        </q-item>
        <q-item class="card" clickable @click="$router.push('/statistic/writeFinanceStatisticData?organismId=' + $route.query.organismId)">
          <q-item-section>
            <q-item-label class="text-h5" />Financeiro
          </q-item-section>
          <q-chip
            v-if="validationResume.financeStatistics"
            label="Validado"
            color="green"
            text-color="white"
          />
          <q-chip
            v-else-if="!validationResume.financeStatistics"
            label="Não validado"
            color="red"
            text-color="white"
          />
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
      validationResume: {}
    }
  },
  beforeMount() {
    this.getMyOrganismsToChooseOne()
    this.getStatisticStatus()
    this.getValidationResumeByOrganism()
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
    getStatisticStatus() {
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
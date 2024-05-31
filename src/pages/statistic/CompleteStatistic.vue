<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs align="center">
          <q-breadcrumbs-el 
            style="cursor: pointer;" 
            icon="home" 
            label="Escolher Congregação" 
            @click="$router.back()"
          />
          <q-breadcrumbs-el 
            :label="congregationName"
            style="cursor: pointer;" 
          >
          </q-breadcrumbs-el>
        </q-breadcrumbs>
      </div>
      <div class="q-pa-sm text-center">
        <q-item class="card" clickable @click="goToCulturalActivities">
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
        <q-item class="card" clickable @click="goToGroupActivity" >
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
        <q-item class="card" clickable @click="goToMembersMovement">
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
        <q-item class="card" clickable @click="goToFinance">
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
      </div>
      <div class="q-mx-lg">
        <q-btn
          label="Voltar"
          color="primary"
          rounded
          unelevated
          no-caps
          dense
          class="full-width"
          @click="$router.push('/statistic/selectOrganismToWriteStatisticData')"
          />
      </div>
      <q-dialog v-model="dialogErrorSendStatistic.open">
        <q-card style="border-radius: 1rem;">
          <q-card-section class="text-h6 text-center">
            {{ dialogErrorSendStatistic.msg }}
          </q-card-section>
          <q-card-actions align="center">
            <q-btn color="primary" no-caps flat @click="dialogErrorSendStatistic.open = false">
              Entendi
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
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
      dialogErrorSendStatistic: {
        open: false,
        msg: '',
      },
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
    goToCulturalActivities() {
      if (this.$route.query.parishId) {
        this.$router.push('/statistic/culturalActivities?organismId=' + this.$route.query.organismId + '&parishId=' + this.$route.query.parishId)
      } else this.$router.push('/statistic/culturalActivities?organismId=' + this.$route.query.organismId)
    },
    goToGroupActivity() {
      if (this.$route.query.parishId) {
        this.$router.push('/statistic/groupActivity?organismId=' + this.$route.query.organismId + '&parishId=' + this.$route.query.parishId)
      } else this.$router.push('/statistic/groupActivity?organismId=' + this.$route.query.organismId)
    },
    goToMembersMovement() {
      if (this.$route.query.parishId) {
        this.$router.push('/statistic/membersMovement?organismId=' + this.$route.query.organismId + '&parishId=' + this.$route.query.parishId)
      } else this.$router.push('/statistic/membersMovement?organismId=' + this.$route.query.organismId)
    },
    goToFinance() {
      if (this.$route.query.parishId) {
        this.$router.push('/statistic/writeFinanceStatisticData?organismId=' + this.$route.query.organismId + '&parishId=' + this.$route.query.parishId)
      } else this.$router.push('/statistic/writeFinanceStatisticData?organismId=' + this.$route.query.organismId)
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
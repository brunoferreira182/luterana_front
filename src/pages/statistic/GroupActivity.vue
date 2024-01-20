<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class= "row q-ma-md">{{ groupData.name }} Nome do grupo
        <q-item class="row q-pa-lg" >
          <q-input outlined class="row" label="Frequência total ">
            
          </q-input>
        </q-item>
      </div>
        <q-separator></q-separator>
      </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "src/boot/useFetch";
export default defineComponent({
  name: "GroupActivity",
  data() {
    return {
      typeOfGroup: null,
      groupData: {},
      statisticStatus: null
    }
  },
  beforeMount() {
    this.getMyOrganismsToChooseOne()
    this.getStatisticStatus()
  },
  methods: {
    getTypeOfGroup() { 
      this.typeOfGroup = this.groupData.type
    },
    goToCongregationalView() {
      this.$router.push('')
    },
    goToPastorTab() {
      this.$router.push('')
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
    getMyOrganismsToChooseOne() {
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
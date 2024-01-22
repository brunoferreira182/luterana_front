<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pt-md q-ma-md">{{ groupData.name }} Nome do grupo
        <q-item class="card q-gutter-md">
          <q-input :disabled="showInput" v-if="typeOfGroup === 'Jovens' || typeOfGroup === 'Juventude Mirim'" outlined
            label="Padrinhos">

          </q-input>
          <q-input outlined label="Frequência total">

          </q-input>
          <q-input outlined label="Número de encontros">

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
      showInput: false,
      typeOfGroup: '',
      groupData: {},
      statisticStatus: null
    }
  },
  beforeMount() {
    this.getStatisticStatus()
    this.getCongregation()
  },
  methods: {
    getCongregation() {
      const opt = {
        route: '/desktop/statistics/getCongregacaoByOrganismId',
        body: {
          organismId: '6530487ab2980d56e0985464',
         // organismId: this.$route.query.organismId
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) return
        this.groupData = r.data
        //this.typeOfGroup = this.groupData.type
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
</style>
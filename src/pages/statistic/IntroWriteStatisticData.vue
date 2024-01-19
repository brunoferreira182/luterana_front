<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="text-h5 q-ma-md">
        Bem-vindo(a) a Estatística 2023!
      </div>
      <div class="q-ma-md text-h6">
        Selecione a etapa para iniciar
      </div>
      <div class="q-pa-sm">
        <q-card class="card" @click="$router.push('/statistic/pastorData')">
          <q-card-section>
            <q-item-label class="text-h5">Dados pastorais</q-item-label>
          </q-card-section>
        </q-card>
        <q-card class="card">
          <q-card-section>
            <q-item-label class="text-h5">Composição</q-item-label>
          </q-card-section>
        </q-card>
        <q-card class="card">
          <q-card-section>
            <q-item-label class="text-h5">Estatística</q-item-label>
          </q-card-section>
        </q-card>
      </div>
      <div class="text-center">
        <q-checkbox size="lg" v-model="isSIPAR" class="text-h5">
          SIPAR
        </q-checkbox>
      </div>
      <q-list> 

        <!-- <q-item
          v-for="organism in userOrganismList"
          style="border-radius: .5em"
          class="bg-grey-3 q-ma-md"
          :key="organism"
          clickable
          @click="goToIntroductionStatistic(organism.organismId)"
        >
          <q-item-section>
            <q-item-label class="text-h6">{{ organism.organismName }}</q-item-label>
            <q-item-label class="text-subtitle1" lines="2">
              {{ organism.organismConfigName }}
            </q-item-label>
          </q-item-section>
        </q-item> -->
      </q-list>
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
// import useFetch from "src/boot/useFetch";
import utils from "../../boot/utils";
export default defineComponent({
  name:"IntroWriteStatisticData",
  data() {
    return {
      userOrganismList:[],
      isSIPAR: false,
      isPastor: null,
    }
  },
  beforeMount(){
    this.verifyIfIsPastor()
    // this.getParoquiasByUserId()
  },
  methods: {
    verifyIfIsPastor() {
      const userInfo = utils.presentUserInfo()
      if (userInfo.userType === 'pastor') {
        this.isPastor = false
        // this.getPastorDataTabs()} else {
        this.isPastor = true
      }
    },
    goToIntroductionStatistic(organismId) {
      this.$router.push('/statistic/introductionStatistic?organismId=' + organismId)
    },
    // getParoquiasByUserId(){
    //   const opt = {
    //     route: "/desktop/statistics/getParoquiasByUserId",
    //   };
    //   this.$q.loading.show()
    //   useFetch(opt).then((r) => {
    //     this.$q.loading.hide()
    //     this.userOrganismList = r.data.list
    //   });
    // },
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
  margin: 10px;
  box-shadow: 0px 0px 6px -3px;
}
</style>
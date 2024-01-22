<template>
  <q-page-container class="no-padding">
    <q-page class="q-ma-md">
      <div class="text-h6">
        Você está em Paróquia {{ userOrganismList.organismName }}
      </div>
      <div>
        Soma das entradas: R$
        {{ paroquiaData.contributionEntries ? paroquiaData.contributionEntries : 0 }}
      </div>
      <div>
        Soma das saídas: R$
        {{ paroquiaData.contributionOutput ? paroquiaData.contributionOutput : 0 }}
      </div>
      <div class="text-subtitle1">
        Selecione o organismo que deseja escrever os dados de estatística
      </div>
      <q-list> 
        <q-item
          v-for="organism in userOrganismList.childData"
          style="border-radius: .5em"
          class="bg-grey-3 q-my-md"
          :key="organism"
          clickable
          @click="goToCompleteStatistic(organism)"
        >
          <q-item-section>
            <q-item-label class="text-h6">{{ organism.organismName }}</q-item-label>
            <q-item-label class="text-subtitle1" lines="2">
              {{ organism.organismConfigName }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "src/boot/useFetch";
export default defineComponent({
  name:"SelectOrganismToWriteStatisticData",
  data() {
    return {
      userOrganismList:{},
      paroquiaData: {
        contributionOutput: '',
        contributionEntries: '',
      },
    }
  },
  beforeMount(){
    this.getParoquiasByUserId()
    this.getFinanceTotalValueFromParoquia()
  },
  methods: {
    
    getFinanceTotalValueFromParoquia(){
      const opt = {
        route: "/desktop/statistics/getFinanceTotalValueFromParoquia",
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        this.paroquiaData = r.data
      });
    },
    goToCompleteStatistic(organism) {
      this.$router.push('/statistic/completeStatistic?organismId=' + organism.childOrganismId)
    },
    getParoquiasByUserId(){
      const opt = {
        route: "/desktop/statistics/getParoquiasByUserId",
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        this.userOrganismList = r.data
      });
    },
  }
})
</script>
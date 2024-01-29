<template>
  <q-page-container class="no-padding">
    <q-page class="q-ma-md q-gutter-y-md">
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
        Selecione o organismo que deseja escrever os dados de estatística. 
        
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
            <div class="q-mt-md">Progresso:</div>
            <q-linear-progress  size="15px" :value="organism.percentualEstatistica.value" :color="organism.percentualEstatistica.color">
            <div class="absolute-full flex flex-center">
              <q-badge color="white" :text-color="organism.percentualEstatistica.color" :label="organism.percentualEstatistica.label" />
            </div>
          </q-linear-progress>
          </q-item-section>
          
        </q-item>
        <q-btn
          label="Enviar estatística"
          no-caps
          rounded
          @click="allOrganismCompleteValidated ? 'rota pra salvar' : dialogSendStatistic = true"
          class="full-width"
          color="primary"
        />
        <q-dialog v-model="dialogSendStatistic">
          <q-item class="card">
            <q-item-section class="text-h6">
              Atenção
            </q-item-section>
            <q-item-section class="text-subtitle2">
              A estatísica só estará pronta para envio <br/> 
              se todos os progressos estiverem em 100%
            </q-item-section>
            <q-item-section>
              <q-btn
                no-caps
                color="primary"
                rounded
                @click="dialogSendStatistic = false"
                flat
                label="Entendi"
              />
            </q-item-section>
          </q-item>
        </q-dialog>
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
      allMyOrganismsIds: [],
      dialogSendStatistic: false,
      allOrganismCompleteValidated: true,
      validationResume: null,
      stepsNum: 4
    }
  },
  beforeMount(){
    this.getParoquiasByUserId()
    this.getFinanceTotalValueFromParoquia()
  },
  // mounted(){
  //   this.getStatisticStatus()
  // },
  methods: {
    getStatisticStatus(){
      const opt = {
        route: "/desktop/statistics/getStatisticStatus",
        body: {
          organismsIds: this.allMyOrganismsIds
        }
      }
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        console.log(r)
      });
    },
    getFinanceTotalValueFromParoquia(){
      const opt = {
        route: "/desktop/statistics/getFinanceTotalValueFromParoquia",
      }
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
        let value, color
        this.userOrganismList.childData.forEach((org, i) => {
          value = org.statusEstatistica.length / this.stepsNum
          if (value <= .25) color = 'red'
          else if (value <= .5) color = 'orange-7'
          else if (value <= .75) color = 'yellow-8'
          else color = 'green'
          this.userOrganismList.childData[i].percentualEstatistica = {
            value,
            label: Math.trunc((org.statusEstatistica.length / this.stepsNum) * 100) + '%',
            color
          }
        })
        const childData = this.userOrganismList.childData;
        for (let i = 0; i < childData.length; i++) {
          const org = childData[i];
          this.allMyOrganismsIds = org
          if (org.percentualEstatistica && org.percentualEstatistica.value !== 1) {
            this.allOrganismCompleteValidated = false;
            break;
          }
        }
      });
    },
  }
})
</script>
<style scoped>
.card {
  border-radius: 1rem;
  height: 9rem;
  background-color: aliceblue;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
  box-shadow: 0px 0px 6px -3px;
}
</style>
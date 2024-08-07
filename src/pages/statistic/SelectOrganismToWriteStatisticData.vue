<template>
  <q-page-container class="no-padding">
    <q-page class="q-ma-md q-gutter-y-md">
      <div class="text-h6">
        Você está em {{ userOrganismList.organismName }}
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
          :disable="organism.disable"
          @click="goToCompleteStatistic(organism)"
        >
          <q-item-section>
            <q-item-label class="text-h6">{{ organism.organismName }}</q-item-label>
            <div v-if="organism.entregaEstatistica && organism.entregaEstatistica.status && organism.entregaEstatistica.status.value === 'sent'" class="q-mt-md">
              <q-icon name="star" size="sm" color="yellow-8"/>   Estatística entregue
            </div>
            <div class="q-mt-md" v-if="organism.gestaoParoquial && organism.gestaoParoquial.managementType === 'SIPAR'">
              <q-banner rounded class="bg-purple-8 text-white">
                Esta congregação usa SIPAR, não é necessário preencher estatística
              </q-banner>
            </div>
            <div v-else>
              <div v-if="organism.percentualEstatistica">
                <div class="q-mt-md">Progresso:</div>
                <q-linear-progress  size="15px" :value="organism.percentualEstatistica.value" :color="organism.percentualEstatistica.color">
                  <div class="absolute-full flex flex-center">
                    <q-badge color="white" :text-color="organism.percentualEstatistica.color" :label="organism.percentualEstatistica.label" />
                  </div>
                </q-linear-progress>
              </div>
            </div>
          </q-item-section>
        </q-item>
        <div class="q-mx-lg">
          <q-btn
            label="Voltar"
            color="primary"
            rounded
            unelevated
            no-caps
            dense
            class="full-width"
            @click="$router.push('/statistic/introWriteStatisticData')"
          />
        </div>
        <q-dialog v-model="dialogSendStatistic.open">
          <q-item class="card">
            <q-item-section class="text-h6">
              Atenção
            </q-item-section>
            <q-item-section class="text-subtitle2">
              A estatística só estará pronta para envio <br/> 
              se todos os progressos estiverem em 100%
            </q-item-section>
            <q-item-section class="text-subtitle2 text-center">
              <q-item-label class="">
                <div class="">
                  Solicite que os seguintes pastores preencham seus dados
                </div>
                <q-chip v-for="item in dialogSendStatistic.pastorsDataNotSent" :key="item">
                  {{ item }}
                </q-chip>
              </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-btn
                no-caps
                color="primary"
                rounded
                @click="dialogSendStatistic.open = false"
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
      
      organismsIds: [],
      dialogSendStatistic: {
        open: false,
        pastorsDataNotSent: []
      },
      allOrganismCompleteValidated: true,
      validationResume: null,
      stepsNum: 4
    }
  },
  beforeMount(){
    this.getParoquiasByUserId()
    this.getStatusPreStatistic()
  },
  methods: {
    getStatusPreStatistic() {
      const opt = {
        route: '/desktop/statistics/getPreStatisticStatus',
      }
      useFetch(opt).then((r) => {
        if (r.error) return 
        let pastorsarray = []
        pastorsarray = r.data.pastors
        for(const pastor of pastorsarray){
          if(!pastor.preStatistic || pastor.preStatistic.status.value === "notSent"){
            this.dialogSendStatistic.pastorsDataNotSent.push(pastor.name)
          }
        }
      })
    },
    checkCanSendStatistics () {
      let chk = []
      this.userOrganismList.childData.forEach((org) => {
        if (org.percentualEstatistica.value === 1) chk.push('true')
        else if (org.gestaoParoquial && org.gestaoParoquial.managementType === 'SIPAR') chk.push('true')
        else chk.push('false')
      })
      if (chk.includes('false')) {
        this.dialogSendStatistic.open = true
      }
    },
    goToCompleteStatistic(organism) {
      if (organism.gestaoParoquial && organism.gestaoParoquial.managementType === 'SIPAR') return
      if (this.$route.query.parishId) {
        this.$router.push('/statistic/completeStatistic?organismId=' + organism.childOrganismId + '&parishId=' + this.$route.query.parishId)  
      } else this.$router.push('/statistic/completeStatistic?organismId=' + organism.childOrganismId)
    },
    //aqui
    getParoquiasByUserId(){
      const opt = {
        route: "/desktop/statistics/getParoquiasByUserId",
      };
      if (this.$route.query.parishId) {
        opt.body = {}
        opt.body.parishId = this.$route.query.parishId
      }
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        this.userOrganismList = r.data
        if (this.userOrganismList.usuarioEstaEmParoquia) {
          //
        } else {
          for (let i =  0; i < this.userOrganismList.childData.length; i++) {
            let org = this.userOrganismList.childData[i]
            if (!org.usuarioEstaEmCongregacao) {
              org.disable = true
            }
          }
        }
        let value, color
        this.userOrganismList.childData.forEach((org, i) => {
          value = org.statusEstatistica.length / this.stepsNum
          if (value <= .25) color = 'red'
          else if (value <= .5) color = 'orange-7'
          else if (value <= .75) color = 'yellow-8'
          else color = 'green'
          this.userOrganismList.childData[i].percentualEstatistica = {
            value,
            label: Math.trunc((org.statusEstatistica.length / this.stepsNum) * 100 ) + '%',
            color
          }
        })
      });
    },
  }
})
</script>
<style scoped>
.card {
  border-radius: 1rem;
  height: 200px;
  background-color: aliceblue;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
  box-shadow: 0px 0px 6px -3px;
}
</style>
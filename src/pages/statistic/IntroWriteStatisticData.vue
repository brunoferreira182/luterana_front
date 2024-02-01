<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="text-h5 q-ma-md">
        Bem-vindo(a) a Estatística 2023!
      </div>
      <div class="q-pa-sm" v-if="hasParoquia">
        <q-item 
          class="card" 
          :clickable="isPastor ? true : false" 
          :disable="isPastor ? false : true" 
          @click="$router.push('/statistic/pastorData')"
        >
          <q-item-section>
            <q-item-label class="text-h5">Dados pastorais</q-item-label>
          </q-item-section>
          <q-chip
            color="green"
            label="Validado"
            text-color="white"
            v-if="status && status.pastoralStatus === 'sent'"
          />
          <q-chip
            v-else
            color="red"
            label="Não Validado"
            text-color="white"
          />
        </q-item>
        <q-item 
          class="card" 
          :clickable="isPastor ? true : false" 
          :disable="isPastor ? false : true" 
          @click="$router.push('/statistic/writeCongregationalStatisticData')"
        >
          <q-item-section>
            <q-item-label class="text-h5">Composição</q-item-label>
          </q-item-section>
          <q-chip
            color="green"
            label="Validado"
            text-color="white"
            v-if="status && status.compositionStatus === 'sent'"
          />
          <q-chip
            v-else
            color="red"
            label="Não Validado"
            text-color="white"
          />
        </q-item>
        <q-item 
          class="card" 
          :clickable="isPastor ? true : false" 
          :disable="isPastor ? false : true" 
          @click="$router.push('/statistic/paroquialManagement')"
        >
          <q-item-section>
            <q-item-label class="text-h5">Gestão Paroquial</q-item-label>
          </q-item-section>
          <q-chip
            color="green"
            label="Validado"
            text-color="white"
            v-if="status && status.gestaoParoquialStatus === 'sent'"
          />
          <q-chip
            v-else
            color="red"
            label="Não Validado"
            text-color="white"
          />
        </q-item>
        <q-item 
          class="card" 
          :clickable="isPastor ? true : false" 
          :disable="isPastor ? false : true" 
          @click="goToStatistic"
        >
          <q-item-section>
            <q-item-label class="text-h5">Estatística</q-item-label>
          </q-item-section>
        </q-item>
      </div>
      <div 
        v-else
      >
        <div class="text-center text-h6 text-wrap q-pa-md">
          Você não faz parte de nenhuma paróquia. Portanto não precisa responder nenhum dado referente a estatística 2023!
        </div>
        <div class="text-center">
          <q-btn
            color="primary"
            rounded
            unelevated
            label="Voltar"
            @click="$router.back"   
          />
        </div>
      </div>
      <q-dialog
        v-model="dialogNotifystatus.open"
        @hide="clearDialogNotifyStatus"
      >
        <q-card
          style="width:400px; border-radius: 1rem;"
        >
          <q-card-section
            class="text-center text-h6"
          >
            Antes de ir para a estatística, todos os campos devem ser validados
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              color="primary"
              rounded
              unelevated
              no-caps
              label="Voltar"
              @click="clearDialogNotifyStatus"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogSipar.open"
        @hide="clearDialogSipar"
      >
        <q-card
          style="width: 400px;border-radius: 1rem;"
          class="q-pa-md"
        >
          <q-card-section class="text-center text-h6">
            A gestão paroquial foi selecionada como SIPAR, portanto, os dados estatísticos serão preenchidos através do SIPAR
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              color="primary"
              rounded
              unelevated
              no-caps
              label="Voltar"
              @click="clearDialogSipar"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </q-page-container>
</template>

<script>
import useFetch from "src/boot/useFetch";
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
      status: null,
      dialogNotifystatus: {
        open: false
      },
      dialogSipar: {
        open: false
      },
      hasParoquia: true
    }
  },
  beforeMount(){
    this.verifyIfIsPastor()
    this.getStatusPreStatistic()
  },
  methods: {
    clearDialogSipar() {
      this.dialogSipar.open = false
    },
    clearDialogNotifyStatus() {
      this.dialogNotifystatus = {
        open: false
      }
    },
    goToStatistic() {
      if (this.status && this.status.statisticPermission) {
        this.$router.push('/statistic/selectOrganismToWriteStatisticData')
      } else if (this.status.isSipar) {
        this.dialogSipar.open = true
      } else {
        this.dialogNotifystatus.open = true
      }
    },
    getStatusPreStatistic() {
      const opt = {
        route: '/desktop/statistics/getPreStatisticStatus',
      }
      useFetch(opt).then((r) => {
        if (r.error) return 
        this.status = r.data
        if (this.status === false) {
          this.hasParoquia = false
        }
      })
    },
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
<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="text-h5 q-ma-md">
        Bem-vindo(a) a Estatística 2023!
      </div>
      <div class="q-pa-sm text-center" v-if="status">
        <q-item 
          class="card" 
          :clickable="isPastor ? true : false" 
          :disable="isPastor ? false : true" 
          @click="$router.push('/statistic/pastorData')"
        >
          <q-item-section>
            <q-item-label class="text-h5">Dados pastorais</q-item-label>
          </q-item-section>
          <!-- <q-chip
            color="green"
            label="Etapa finalizada"
            text-color="white"
            v-if="status && status.pastoralStatus === 'sent'"
          />
          <q-chip
            v-else
            color="red"
            label="Não Validado"
            text-color="white"
          /> -->
          <div v-if="status && status.pastors && status.pastors.length > 0" class="text-center">
            <q-chip
              v-for="pastor in status.pastors"
              :key="pastor._id"
              :label="pastor.name"
              :outline="!pastor.preStatistic || pastor.preStatistic.status.value !== 'sent'"
              color="green"
              text-color="white"
              :icon="pastor.preStatistic && pastor.preStatistic.status.value === 'sent' ? 'check' : ''"
            />
          </div>
        </q-item>
        <q-item 
          class="card" 
          clickable
          @click="$router.push('/statistic/writeCongregationalStatisticData')"
        >
          <q-item-section >
            <q-item-label class="text-h5">Composição</q-item-label>
          </q-item-section>
          <q-chip>
            {{ cardOrganismName.organismParentLocal }}
            {{ cardOrganismName.organismParentName}}
          </q-chip>
          <q-chip
            color="green"
            label="Etapa finalizada"
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
        <!-- <q-item 
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
        </q-item> -->
        <q-item 
          class="card" 
          clickable 
          @click="goToStatistic"
        >
          <q-item-section>
            <q-item-label class="text-h5">Preenchimento</q-item-label>
          </q-item-section>
        </q-item>
      </div>
      <div v-else>
        <div class="text-center text-h6 text-wrap q-pa-md">
          Por favor peça para o pastor validar a composição para prosseguir com a estatística
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

      <q-dialog
        v-model="dialogPastors.open"
      >
        <q-card
          style="width: 400px;border-radius: 1rem;"
          class="q-pa-md"
        >
          <q-card-section class="text-center text-h6">
            Há pastores que não enviaram os dados pastorais. Verifique e tente novamente.
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              color="primary"
              rounded
              unelevated
              no-caps
              label="Voltar"
              @click="dialogPastors.open = false"
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
      dialogPastors: {
        open: false
      },
      userOrganismList:[],
      isSIPAR: false,
      isPastor: null,
      status: null,
      cardOrganismName: [],
      dialogNotifystatus: {
        open: false
      },
      dialogSipar: {
        open: false
      },
      hasParoquia: false,
      hasCongregacao: false,
      paroquiaId: null,
      congregationsId: []
    }
  },
  beforeMount(){
    this.verifyIfIsPastor()
    this.getCardName()
    this.getStatusPreStatistic()
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
    getCardName() {
      const opt = {
        route: '/desktop/statistics/getCompositionByUserId'
      }
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) return 
        this.cardOrganismName = r.data
      })
    },
    goToStatistic() {
      let chk = true
      if (!chk) {
        this.dialogPastors.open = true
        return
      }
      if (this.status.compositionStatus !== 'sent') {
        this.dialogNotifystatus.open = true
        return
      }
      this.$router.push('/statistic/selectOrganismToWriteStatisticData')

      // if (this.status && this.status.statisticPermission) {
      //   this.$router.push('/statistic/selectOrganismToWriteStatisticData')
      // } else if (this.status.isSipar) {
      //   this.dialogSipar.open = true
      // } else {
      //   this.dialogNotifystatus.open = true
      // }
    },
    getStatusPreStatistic() {
      const opt = {
        route: '/desktop/statistics/getPreStatisticStatus',
      }
      useFetch(opt).then((r) => {
        if (r.error) return 
        this.status = r.data
        // if (r.data.usuarioEstaEmParoquia) {
        //   this.hasParoquia = true
        //   this.paroquiaId = r.data.organismParentId
        // } else {
        //   r.data.congregations.forEach((org) => {
        //     if (org.usuarioEstaEmCongregacao) {
        //       this.hasCongregacao = true
        //       this.congregationsId.push(org.organismChildId)
        //     } 
        //   })
        // }
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
  background-color: rgb(248, 248, 248);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 16px;
  box-shadow: 0px 0px 6px -3px;
}
</style>
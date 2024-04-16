<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="text-center text-h5 q-mt-md">
        Selecione a paróquia que você deseja responder a estatística:
      </div>
      <q-list class="q-mt-md fit column wrap justify-center items-center content-center">
        <q-item
          clickable
          class="card"
          v-for="parish in parishArray"
          :key="parish"
          @click="goToStatistic(parish._id)"
        >
          <q-item-section>
            {{ parish.name }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-page>
  </q-page-container>
</template>
<script>
import useFetch from "src/boot/useFetch";
import { defineComponent } from "vue";

export default defineComponent({
  name: 'ChooseParish',
  data() {
    return {
      parishArray: []
    }
  },
  beforeMount() {
    this.startView()
  },
  methods: {
    startView() {
      this.getParishList()
    },
    async getParishList() {
      const opt = {
        route: '/desktop/statistics/verifyUserParishlength'
      }
      let r = await useFetch(opt)
      if (r.error) return
      console.log(r, 'cu cagado')
      r.data.parishsIds.forEach((parish) => {
        this.parishArray.push({
          name: parish.name,
          _id: parish.parishId
        })
      })
    },
    goToStatistic(id) {
      this.$router.push('/statistic/IntroWriteStatisticData?parishId=' + id)
    }
  }
})
</script>
<style scoped>
.card {
  border-radius: 1rem; 
  height: 9rem;
  width: 20rem;
  display: flex;
  background-color: rgb(248, 248, 248);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 16px;
  box-shadow: 0px 0px 6px -3px;
}

</style>
<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="text-h5 q-ma-md">
        Bem-vindo(a) a Estatística 2023!
      </div>
      <div class="q-ma-md text-h6">
        Selecione o organismo que deseja escrever os dados da estatística.
      </div>
      <q-list>
        <q-item
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
        </q-item>
      </q-list>
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "src/boot/useFetch";
export default defineComponent({
  name:"IntroStatistics",
  data() {
    return {
      userOrganismList:[]
    }
  },
  beforeMount(){
    this.getParoquiasByUserId()
  },
  methods: {
    goToIntroductionStatistic(organismId) {
      this.$router.push('/user/introductionStatistic?organismId=' + organismId)
    },
    getParoquiasByUserId(){
      const opt = {
        route: "/desktop/statistics/getParoquiasByUserId",
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        console.log(r, 'CUZIZIZIZIZI')
        this.userOrganismList = r.data.list
      });
    },
  }
})
</script>
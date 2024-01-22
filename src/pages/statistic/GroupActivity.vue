<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-list class="q-pa-sm">
        <q-item v-for="item in groupData.childData" :key="item">
          <q-item-section class=" item-section" clickable @click="toggleForm(item)">
            <q-item-label > {{ item.organismName }} 
              <q-btn
                round
                flat
                dense
                :icon="item.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                @click="item.expanded = !item.expanded"
              />
            </q-item-label>
            
            <q-slide-transition>
              <div v-show="item.expanded">
                <q-input label="Frequência total"></q-input>
                <q-input label="Número de encontros"></q-input>
                <q-btn type="submit" label="Salvar" @click="submitForm(item)"></q-btn>
              </div>
            </q-slide-transition>
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
  name: "GroupActivity",
  data() {
    return {
      expanded: false,
      groupData: {},
      statisticStatus: null
    }
  },
  beforeMount() {
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
        console.log('grupos',this.groupData)
      })
    },
    toggleForm(item) {
      item.formVisible = !item.formVisible
      if (!item.formData) {
        item.formData = {}
      }
    },
    submitForm(item) {
      // body:this.groupData.childData.organismConfigName
      // Lógica para lidar com o envio do formulário
      console.log("Formulário enviado para", item.organismConfigName);
      // Você pode adicionar lógica adicional aqui, por exemplo, enviar dados para o servidor
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
.item-section {
  position: relative;
}
.form-section {
  position: absolute;
  top: 100%; /* Ajuste conforme necessário para a posição desejada */
  left: 0;
  width: 100%;
  z-index: 1;
}
</style>
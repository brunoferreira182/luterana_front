<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          Criar nova visão
        </div>
        <div class="col text-right">
          <q-btn
            @click="createVision"
            rounded
            color="primary"
            unelevated
            no-caps
            label="Criar visão"
          />
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-around q-pa-md">
        <div class="col-12 q-gutter-md" align="start">
          <div class="text-h5">Nome</div>
          <q-input
            label="Escreva o nome"
            outlined
            hint="Nome da Visão"
            v-model="vision.name"
          />
          <div class="text-h5">Escreva uma descrição de forma sugestiva</div>
          <q-input
            outlined
            autogrow
            hint="Uma descrição completa sobre a visão"
            label="Descrição"
            v-model="vision.description"
          />
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: "CreateVision",
  data() {
    return {
      vision: {
        name: '',
        description: ''
      }
    }
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount(){

  },
  methods: {
    createVision() {
      const opt = {
        route: "/desktop/config/createVision",
        body: {
          visionInfo : this.vision 
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (!r.error) {
          this.$q.notify("Função criada com sucesso!");
          this.vision = {}
          this.$router.push('/config/visionsList')
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
  },
});
</script>
<style scoped>

.separator {
  position: fixed;
  top: 68px;
  border-left: 2px solid rgb(216, 216, 216);
  height: 806px;
}
</style>

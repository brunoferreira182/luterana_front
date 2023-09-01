<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          Novo grupo de funções
        </div>
        <div class="col text-right">
          <q-btn
            @click="inactivateFunctionsGroup"
            rounded
            outline
            color="primary"
            unelevated
            no-caps
            label="Inativar groupo"
          />
        </div>
        <div class="col text-right">
          <q-btn
            @click="updateFunctionsGroup"
            rounded
            color="primary"
            unelevated
            no-caps
            label="Salvar edição"
          />
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-around q-pa-md">
        <div class="col-8 q-gutter-md" align="start">
          <div class="text-h5">Nome</div>
          <q-input
            label="Escreva o nome"
            outlined
            hint="Nome do grupo"
            v-model="functionsGroupData.functionGroupName"
          />
          <div class="text-h5">Escreva uma descrição de forma sugestiva</div>
          <q-input
            outlined
            autogrow
            hint="Uma descrição completa sobre o grupo"
            label="Descrição"
            v-model="functionsGroupData.functionGroupDescription"
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
  name: "FunctionsGroupDetail",
  data() {
    return {
      functionsGroupData: {
        functionGroupName: '',
        functionGroupDescription: '',
      },
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount(){
    this.getFunctionsGroupDetailById()
  },
  methods: {
    inactivateFunctionsGroup() {
      const opt = {
        route: "/desktop/config/inactivateFunctionsGroup",
        body: {
          functionsGroupId: this.$route.query.functionGroupId,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.$q.notify("Grupo alterado com sucesso!");
        }
      });
    },
    updateFunctionsGroup() {
      const opt = {
        route: "/desktop/config/updateFunctionsGroup",
        body: {
          functionsGroupId: this.$route.query.functionGroupId,
          functionsGroupData: this.functionsGroupData
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.getFunctionsGroupDetailById()
          this.$q.notify("Grupo alterado com sucesso!");
        }
      });
    },
    getFunctionsGroupDetailById() {
      const opt = {
        route: "/desktop/config/getFunctionsGroupDetailById",
        body: {
          functionsGroupId: this.$route.query.functionGroupId 
        },
      };
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.functionsGroupData = r.data
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

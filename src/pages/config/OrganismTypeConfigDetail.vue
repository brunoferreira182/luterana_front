<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          tipo de organismo {{ organismTypeData.name }}
        </div>
        <div class="col text-right">
          <q-btn
            @click="updateOrganismType"
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
        <div class="col-6 q-gutter-md" align="start">
          <div class="text-h5">Nome</div>
          <q-input
            label="Escreva o nome"
            outlined
            v-model="organismTypeData.name"
          />
          <div class="text-h5">Escreva uma descrição</div>
          <q-input
            outlined
            autogrow
            hint="Uma descrição completa sobre este tipo de organismo"
            label="Descrição"
            v-model="organismTypeData.description"
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
  name: "CreateOrganismType",
  data() {
    return {
      organismTypeData: {
        name: '',
        description: ''
      }
    }
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount(){
    this.getOrganismTypeById()
  },
  methods: {
    updateOrganismType(){
    },
    getOrganismTypeById() {
      const organismTypeId = this.$route.query.organismTypeId
      const opt = {
        route: "/desktop/config/getOrganismTypeById",
        body: {
          organismTypeId: organismTypeId
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (!r.error) {
          this.organismTypeData = r.data
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
  },
});
</script>

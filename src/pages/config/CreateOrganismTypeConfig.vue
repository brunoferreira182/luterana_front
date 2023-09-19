<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          Criar novo tipo de organismo
        </div>
        <div class="col text-right">
          <q-btn
            @click="createOrganismType"
            rounded
            color="primary"
            unelevated
            no-caps
            label="Criar tipo de organismo"
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
  methods: {
    createOrganismType() {
      const opt = {
        route: "/desktop/config/createOrganismType",
        body: {
          organismTypeData : this.organismTypeData 
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (!r.error) {
          this.$q.notify("Tipo de organismo criado com sucesso!");
          this.vision = {}
          this.$router.push('/config/OrganismTypeConfigList')
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
  },
});
</script>

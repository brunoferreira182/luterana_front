<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">novo tipo de Organismo</div>
        <!-- <div class="col-3">
        </div> -->
      </div>
      <q-separator class="q-mx-md"></q-separator>
      <div class="row justify-center q-pa-md">
        <div class="col-6 q-gutter-md" align="center">
          <q-input
            outlined
            hint="Informe o nome do tipo de organismo"
            label="Nome do tipo de organismo"
            v-model="organismName"
          />
          <q-select
            outlined
            hint="Informe o nível de hierarquia, sendo 1 o mais alto nível e 10 o menor."
            label="Hierarquia"
            :options="positionOptions"
            v-model="position"
          />
          <div class="row justify-center">
            <q-btn
              label="Salvar"
              no-caps
              rounded
              unelevated
              @click="createOrganismsTypes"
              color="primary"
            />
          </div>
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
      organismName: "",
      position: "",
      positionOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  // beforeMount() {
  // },
  methods: {
    createOrganismsTypes() {
      const opt = {
        route: "/desktop/config/createOrganismsTypes",
        body: {
          organismName: this.organismName,
          position: this.position,
        },
      };
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.$q.notify("Organismo cadastrado com sucesso!");
          this.position = "";
          this.organismName = "";
          this.$router.push('/config/organismTypeList')
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
  },
});
</script>

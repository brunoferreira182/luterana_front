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
            class="q-pa-sm"
            icon="bookmark"
            label="Salvar Edição"
          />
          <!-- <q-btn
            @click="dialogDeleteOrganism = true"
            rounded
            outline
            color="primary"
            unelevated
            no-caps
            label="Excluir organismo"
          /> -->
          <q-dialog v-model="dialogDeleteOrganism" @hide="dialogDeleteOrganism = false">
            <q-card style="border-radius: 1rem; ">
              <q-card-section  class="text-h5 text-center">
                Tem certeza que deseja excluir?
              </q-card-section>
              <q-card-actions align="center">
                <q-btn flat outline no-caps label="Cancelar" color="primary" v-close-popup />
                <q-btn 
                  no-caps
                  rounded
                  unelevated
                  color="primary" 
                  v-close-popup 
                  label="Excluir" 
                  @click="deleteOrganism"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
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
  name: "OrganismTypeConfigDetail",
  data() {
    return {
      organismTypeData: {
        name: '',
        description: ''
      },
      dialogDeleteOrganism: false
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
      const opt = {
        route: "/desktop/config/updateOrganismType",
        body: {
          organismTypeId: this.$route.query.organismTypeId,
          organismTypeData: this.organismTypeData
        }
      }
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (!r.error) {
          this.$q.notify("Atualização concluída");
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
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
          this.organismTypeData = r.data.organismTypeData
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    deleteOrganism() {
    },
  },
});
</script>

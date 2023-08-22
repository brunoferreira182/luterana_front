<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          Detalhe da visão {{ vision.name }}
        </div>
        
        <div class="col text-right">
          
          <q-btn
            v-if="isActive === 1"
            @click="dialogInativeVision = true"
            rounded
            class="q-mx-sm q-pa-sm"
            outline
            color="negative"
            unelevated
            no-caps
            label="Inativar visão"
          />
          <q-btn
            v-else
            @click="dialogAtiveVision = true"
            rounded
            outline
            class="q-pa-sm q-mx-sm"
            color="positive"
            unelevated
            no-caps
            label="Ativar visão"
          />
          <q-btn
            @click="updateVision"
            rounded
            color="primary"
            class="q-pa-sm"
            icon="bookmark"
            unelevated
            no-caps
            label="Atualizar visão"
          />
          <q-dialog v-model="dialogInativeVision" @hide="dialogInativeVision = false">
            <q-card style="border-radius: 1rem; ">
              <q-card-section class="text-h5 text-center">
                Tem certeza que deseja inativar?
              </q-card-section>
              <q-card-actions align="center">
                <q-btn flat no-caps label="Cancelar" color="primary" v-close-popup />
                <q-btn 
                  no-caps
                  rounded
                  unelevated
                  label="Inativar" 
                  color="primary" 
                  v-close-popup 
                  @click="inactivateVision"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <q-dialog v-model="dialogAtiveVision" @hide="dialogAtiveVision = false">
            <q-card style="border-radius: 1rem; ">
              <q-card-section  class="text-h5 text-center">
                Tem certeza que deseja ativar?
              </q-card-section>
              <q-card-actions align="center">
                <q-btn 
                  flat 
                  no-caps 
                  label="Cancelar" 
                  color="primary" 
                  v-close-popup 
                />
                <q-btn 
                  no-caps
                  rounded
                  unelevated
                  label="Ativar" 
                  color="primary" 
                  v-close-popup 
                  @click="activateVision"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-around q-pa-md">
        <div class="col-8 q-gutter-md" align="start">
          <q-chip 
          v-if="isActive === 1"
          color="positive" 
          text-color="white" 
          icon="cloud"
          align="right"
          >
            Status: Ativa
          </q-chip>
          <q-chip 
          v-if="isActive === 0"
          color="negative" 
          text-color="white" 
          icon="cloud"
          align="right"
          >
            Status: Inativa
          </q-chip>
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
  name: "VisionDetail",
  data() {
    return {
      vision: {
        name: '',
        description: '',
      },
      dialogInativeVision: false,
      dialogAtiveVision: false,
      isActive: null
    }
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount(){
    this.getVisionDetailById()
  },
  methods: {
    updateVision() {
      const opt = {
        route: "/desktop/config/updateVision",
        body: {
          visionInfo : this.vision,
          visionId: this.$route.query.visionId
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (!r.error) {
          this.$q.notify("Função atualizada com sucesso!");
          this.vision = {}
          this.$router.push('/config/visionsList')
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    getVisionDetailById() {
      const opt = {
        route: "/desktop/config/getVisionDetailById",
        body: {
          visionId : this.$route.query.visionId 
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
          return
        }
          this.isActive = r.data.isActive
          this.vision = r.data.visionInfo
      });
    },
    activateVision(){
      const opt = {
        route: "/desktop/config/activateVision",
        body: {
          visionId: this.$route.query.visionId
        }
      }
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
          return
        }
        this.getVisionDetailById()
        this.$q.notify("Visão ativada com sucesso")
      });
    },
    inactivateVision(){
      const opt = {
        route: "/desktop/config/inactivateVision",
        body: {
          visionId: this.$route.query.visionId,
        },
      }
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
          return
        }
        this.getVisionDetailById()
        this.$q.notify("Visão desativada com sucesso")
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
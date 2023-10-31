<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          {{ attachTitle }}
        </div>
        <div class="col text-right">
          <q-btn
            rounded
            icon="delete"
            unelevated
            outline
            color="red-8"
            no-caps
            @click="removeAttachFile"
            label="Deletar arquivo"
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
            hint="Nome do arquivo"
            v-model="attachTitle"
          />
          <div class="text-h5">Descrição</div>
          <q-input
            outlined
            autogrow
            hint="Uma descrição completa sobre o arquivo"
            label="Descrição"
            v-model="attachDescription"
          />
          <q-img 
            :src="attachData ? utils.makeFileUrl(attachData) : ''" 
            width="208px" 
            height="208px"
          />
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import utils from '../../boot/utils'
export default defineComponent({
  name: "AttachmentsDetail",
  data() {
    return {
      utils,
      attachTitle: '',
      attachDescription: '',
      attachData: null,
    }
  },
  beforeMount(){
    this.getAttachFileDetail()
  },
  methods: {
    removeAttachFile() {
      const opt = {
        route: "/desktop/commonUsers/removeAttachFile",
        body: {
          attachFileId : this.$route.query.attachFileId,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (!r.error) {
          this.$q.notify("Arquivo deletado com sucesso!");
          this.$router.back()
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    getAttachFileDetail() {
      const opt = {
        route: "/desktop/commonUsers/getAttachFileDetail",
        body: {
          attachFileId : this.$route.query.attachFileId,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (!r.error) {
          this.attachTitle = r.data.attachTitle
          this.attachDescription = r.data.attachDescription
          this.attachData = r.data.attach.filename
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

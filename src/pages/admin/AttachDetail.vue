<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm text-h5">
        Informações sobre o documento:
      </div>
      <div class="q-pa-md q-ml-sm">
        <div class="text-h6 text-capitalize">
          Nome: {{ attachDetail.attachTitle }}
        </div>
        <div class="text-h6 q-mt-sm text-capitalize">
          Descrição: {{ attachDetail.attachDescription }}
        </div>
      </div>
      <div class="text-center fixed-bottom q-mb-md">
        <q-btn
          flat
          label="Excluir"
          no-caps
          color="negative"
          rounded
        />
        <q-btn
          unelevated
          label="Fazer download"
          icon="download"
          no-caps
          color="primary"
          rounded
          @click="downloadAttach"
        />
      </div>
      <!-- <q-card style="border-radius: 1rem; height: 150x; width: 400px">
        <div class="text-h6 text-center q-pa-md ">{{ dialogAttachDetail.data.attachDetail.attachTitle }}</div> 
        <q-card-section class="q-gutter-md">
          <q-input
            outlined
            hint="Descrição"
            readonly
          />
          <q-img 
            style="border-radius: 1rem"
            width="138px" 
            height="138px"
          />
        </q-card-section>
      </q-card> -->
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import utils from "../../boot/utils";
export default defineComponent({
  name: "AttachDetail",
  data() {
    return {
      attachDetail: {}
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getAttachDetail();
  },
  methods: {
    getAttachDetail () {
      const opt = {
        route: '/desktop/adm/getAttachDetail',
        body: {
          attachId: this.$route.query.attachId
        }  
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente')
        } else {
          this.attachDetail = r.data
        }
      })
    },
    downloadAttach () {
      utils.downloadFile({
        filename: this.attachDetail.attach[0].filename,
        originalname: this.attachDetail.attach[0].originalname
      })
    },
    // removeAttach() {
    //   const opt = {
    //     route: '/desktop/adm/removeAttachFile',
    //     body: {
    //       attachFileId: this.dialogAttachDetail.data._id
    //     }
    //   }
    //   useFetch(opt).then((r) => {
    //     if (r.error) {
    //       this.$q.notify('Ocorreu um erro, tente novamente')
    //     } else {
    //       this.clearDialogDetail()
    //       this.getAllAttachedFiles()
    //       this.$q.notify('Documento removido com sucesso.')
    //     }
    //   })
    // },
  },
});
</script>
<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between text-h5">
        Informações sobre o documento:
      </div>
      <q-input
        class="q-mx-md q-my-sm"
        label="Nome"
        readonly
        outlined
        v-model="attachDetail.attachTitle"
      />
      <q-input
        class="q-mx-md q-my-sm"
        label="Descrição"
        readonly
        outlined
        v-model="attachDetail.attachDescription"
      />
      <q-list
        class="bg-grey-1 q-ma-md"
        style="border-radius: 1rem;"
        separator
      >
        <q-item
          v-for="(attach, i) in attachDetail.attach"
          :key="attach"
        >
          <q-item-section>
            <q-item-label>
              {{ attach.originalname }}
            </q-item-label>
          </q-item-section>
          <q-item-section side class="no-padding no-margin">
            <q-btn
              icon="download"
              color="primary"
              flat
              rounded
              @click="downloadAttach(i)"
            >
              <q-tooltip>Fazer download</q-tooltip>
            </q-btn>
          </q-item-section> 
        </q-item>
      </q-list>
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
      attachDetail: {},
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getAttachFileDetail();
  },
  methods: {
    getAttachFileDetail() {
      const opt = {
        route: "/desktop/commonUsers/getAttachFileDetail",
        body: {
          attachId : this.$route.query.attachFileId,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(r => {
        this.$q.loading.hide();
        if (!r.error) {
          this.attachDetail = r.data
        } else {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
      });
    },
    downloadAttach (i) {
      utils.downloadFile({
        filename: this.attachDetail.attach[i].filename,
        originalname: this.attachDetail.attach[i].originalname
      })
    }
  },
});
</script>



<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between text-h5">
        Informações sobre o documento:
        <div class="col text-right self-center">
          <q-btn
            no-caps
            color="red"
            rounded
            flat
            icon="delete"
            unelevated
            @click="dialogInactivateDocument.open = true"
            label="Excluir documento"
          />
        </div>
      </div>
      <!-- <div class="q-pa-md q-ml-sm text-h5">
        Informações sobre o documento:
        <q-btn
          class="text-right"
          no-caps
          color="primary"
          rounded
          icon="bookmark"
          unelevated
          @click="updateOrganism"
          label="Salvar Edição"
        />
      </div> -->
      <!-- <div class="q-pa-md q-ml-sm">
        <div class="text-h6 text-capitalize">
          Nome: {{ attachDetail.attachTitle }}
        </div>
        <div class="text-h6 q-mt-sm text-capitalize">
          Descrição: {{ attachDetail.attachDescription }}
        </div>
      </div> -->
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
      <div class="q-pa-md q-ml-sm text-h5">
        Anexos:
        <q-btn 
          color="primary" 
          label="Anexo" 
          unelevated 
          icon="add" 
          flat
        >
          <q-tooltip>Adicionar novo documento</q-tooltip>
          <q-menu anchor="bottom middle" self="top left">
            <div style="width: 400px">
              <q-file 
                class="q-mx-md q-my-sm"
                multiple 
                outlined
                label="Clique aqui para adicionar anexos" 
                hint="Adicione aqui os anexos"
                v-model="documentFiles"
              >
              <template v-slot:after>
                <q-btn round color="primary" @click="addDocument" flat icon="send" />
              </template>
            </q-file>            
            </div>
          </q-menu>
        </q-btn>
      </div>
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
              icon="delete"
              color="red"
              flat
              rounded
              @click="deleteAttach(i)"
            >
              <q-tooltip>Excluir anexo</q-tooltip>
            </q-btn>
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
      <q-dialog v-model="dialogInactivateDocument.open">
        <q-card style="border-radius: 1rem;width: 400px;">
          <q-card-section align="center">
            <div class="text-h6">
              Excluir documento?
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              label="Depois"
              no-caps
              flat
              rounded
              @click="dialogInactivateDocument.open = false"
              color="primary"
            />
            <q-btn
              unelevated
              rounded
              label="Excluir"
              no-caps
              color="red"
              @click="inactivateDocument"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="dialogDeleteAttach.open">
        <q-card style="border-radius: 1rem;width: 400px;">
          <q-card-section align="center">
            <div class="text-h6">
              Excluir documento?
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              label="Depois"
              no-caps
              flat
              rounded
              @click="dialogDeleteAttach.open = false"
              color="primary"
            />
            <q-btn
              unelevated
              rounded
              label="Excluir"
              no-caps
              color="red"
              @click="confirmDeleteAttach"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
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
      dialogInactivateDocument: {
        open: false
      },
      dialogDeleteAttach:{
        open: false,
        index: null
      },
      documentFiles: [],
      filesToSend: []
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getAttachDetail();
  },
  methods: {
    addDocument() {
      this.documentFiles.forEach((file, ifile) => {
        this.filesToSend.push({ file: this.documentFiles[ifile], name: this.documentFiles[ifile].name})
      })
      const opt = {
        route: "/desktop/adm/addNewAttachToDocument",
        body: {
          documentId: this.$route.query.attachId,
        },
        file: this.filesToSend
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente')
          return
        } else {
          this.$q.notify('Anexo criado com sucesso')
          this.documentFiles = []
          this.filesToSend = []
          this.getAttachDetail()
        }
      });
    },
    confirmDeleteAttach() {
      const opt = {
        route: '/desktop/adm/updateAttach',
        body: {
          documentId: this.$route.query.attachId,
          filename: this.attachDetail.attach[this.dialogDeleteAttach.index].filename
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde')
          this.dialogDeleteAttach.open = false
          this.getAttachDetail()
        } else {
          this.$q.notify('Anexo excluído com sucesso')
          this.dialogDeleteAttach.open = false
          this.getAttachDetail()
        }
      })
    },
    deleteAttach(i) {
      this.dialogDeleteAttach.index = i
      this.dialogDeleteAttach.open = true
    },
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
    downloadAttach (i) {
      utils.downloadFile({
        filename: this.attachDetail.attach[i].filename,
        originalname: this.attachDetail.attach[i].originalname
      })
    },
    inactivateDocument () {
      const opt = {
        route: '/desktop/adm/inactivateAttach',
        body: {
          documentId: this.$route.query.attachId
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente')
        } else {
          this.$q.notify('Documento excluído com sucesso')
          this.$router.push('/admin/admDocuments')
        }
      })
    }
  },
});
</script>
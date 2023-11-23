<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat
        class="bg-accent"
        title="Lista de documentos"
        :columns="attachData"
        :rows="attachList"
        row-key="_id"
        virtual-scroll
        rows-per-page-label="Registros por página"
        no-data-label="Nenhum dado inserido até o momento"
        no-results-label="A pesquisa não retornou nenhum resultado"
        :rows-per-page-options="[10, 20, 30, 50]"
        @row-click="goToAttachDetail"
        v-model:pagination="pagination"
        @request="nextPage"
      >
        <template #top-right>
          <q-btn
            color="primary"
            rounded
            unelevated
            label="Anexo"
            icon="add"
            @click="dialogAddAttach.open = true"
          >
          </q-btn>
        </template>
      </q-table>
      <q-dialog v-model="dialogAddAttach.open" @hide="clearDialog()">
        <q-card style="border-radius: 1rem; height: 150x; width: 400px">
          <div class="text-h6 text-center q-pa-md ">Novo anexo</div>
          <q-card-section class="q-gutter-md">
            <q-input
              outlined
              label="Título"
              v-model="dialogAddAttach.title"
            />
            <q-input
              outlined
              label="Descrição"
              autogrow
              v-model="dialogAddAttach.description"
            />
            <q-file 
              multiple 
              outlined
              max-file-size="10000000000000000"
              v-model="dialogAddAttach.files" 
              label="Clique aqui para adicionar anexos" 
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Voltar"
              no-caps
              color="primary"
              rounded
              @click="clearDialog"
            />
            <q-btn
              label="Enviar"
              no-caps
              color="primary"
              rounded
              @click="sendAttach"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="dialogAttachDetail.open" @hide="clearDialogDetail()">
        <q-card class="text-center">
          <div class="text-h5">
            {{ this.dialogAttachDetail.data.attachTitle }}
          </div>
          <q-separator/>
          <q-card-section>
            <q-btn
              color="primary"
              icon="arrow_downward"
              @click="downloadAttach"
            >
              Fazer download
            </q-btn> <br/>
            <div class="q-mt-md">
              Ou
            </div>
          </q-card-section>
            <q-btn
              color='negative'
              flat
              @click="removeAttach"
            >
              Excluir
            </q-btn>
        </q-card>
        <!-- <q-card style="border-radius: 1rem; height: 150x; width: 400px" v-if="dialogAddAttach">
          <div class="text-h6 text-center q-pa-md ">{{ dialogAttachDetail.data.attachDetail.attachTitle }}</div>
          <q-card-section class="q-gutter-md">
            <q-input
              outlined
              hint="Descrição"
              v-model="dialogAttachDetail.attachDetail.data.attachDescription"
              readonly
            />
            <q-img 
              style="border-radius: 1rem"
              :src=" utils.makeFileUrl(dialogAttachDetail.fata.attachDetail.attach.filename)" 
              width="138px" 
              height="138px"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Excluir"
              no-caps
              color="negative"
              rounded
              @click="removeAttach(dialogAttachDetail.attachDetail._id)"
            />
            <q-btn
              unelevated
              label="Voltar"
              no-caps
              color="primary"
              rounded
              @click="clearDialogDetail"
            />
          </q-card-actions>
        </q-card> -->
      </q-dialog>
    </q-page>
  </q-page-container>
</template>
<script setup>
// import utils from '../../boot/utils'
</script>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import { useTableColumns } from "stores/tableColumns";
export default defineComponent({
  name: "admDocuments",
  data() {
    return {
      attachData: useTableColumns().admAttachList,
      attachList: [],
      pagination: {
        page: 1,
        rowsPerPage: 10,
      },
      dialogAddAttach: {
        open: false,
        title: '',
        description: '',
        files: null
      },
      dialogAttachDetail: {
        open: false,
        data: null
      },
      filesToSend: []
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getAllAttachedFiles();
  },
  methods: {
    goToAttachDetail(e, r) {
      this.$router.push('/admin/attachDetail?attachId=' + r._id)
    },
    // getSelectedString() { 
    //   return this.selected.length === 0
    //     ? ""
    //     : `${this.selected.length}
    //   despesa${this.selected.length > 1 ? "s" : ""}
    //   selecionadas de ${this.expensesData.length}`;
    // },
    nextPage(e) {
      this.pagination.page = e.pagination.page;
      this.pagination.sortBy = e.pagination.sortBy;
      this.pagination.rowsPerPage = e.pagination.rowsPerPage;
    },
    downloadAttach () {
      const opt = {
        route: '/desktop/adm/downloadAttachFile',
        body: {
          attachFileId: this.dialogAttachDetail.data._id
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente')
          return
        } else {
          this.dialogAttachDetail.data = null
          this.dialogAttachDetail.open = false
          this.$q.notify('Fazendo o download')
        }
      })
    },
    goToOptions(e, r) {
      this.dialogAttachDetail.open = true
      this.dialogAttachDetail.data = r
    },
    clearDialogDetail() {
      this.dialogAttachDetail.attachDetail = null
      this.dialogAttachDetail.open = false
    },
    sendAttach() {
      if (this.dialogAddAttach.title === '' || this.dialogAddAttach.description === '' || !this.dialogAddAttach.files) {
        this.$q.notify("Preencha todos os campos antes de enviar")
        return
      }
      this.dialogAddAttach.files.forEach((file, ifile) => {
        this.filesToSend.push({ file: this.dialogAddAttach.files[ifile], name: this.dialogAddAttach.files[ifile].name})
      })
      const opt = {
        route: "/desktop/adm/addAttachFiles",
        body: {
          attachTitle: this.dialogAddAttach.title,
          attachDescription: this.dialogAddAttach.description
        },
        file: this.filesToSend
      };
      console.log(opt.file, 'antes do useFetch')
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente')
          return
        } else {
          console.log(opt.file, 'dentro do useFetch')
          this.clearDialog()
          this.getAllAttachedFiles()
        }
      });
    },
    removeAttach() {
      const opt = {
        route: '/desktop/adm/removeAttachFile',
        body: {
          attachFileId: this.dialogAttachDetail.data._id
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente')
        } else {
          this.clearDialogDetail()
          this.getAllAttachedFiles()
          this.$q.notify('Documento removido com sucesso.')
        }
      })
    },
    clearDialog(){
      this.dialogAddAttach.open = false
      this.dialogAddAttach.title = ''
      this.dialogAddAttach.description = ''
      this.dialogAddAttach.files = []
    },
    getAllAttachedFiles() {
      const opt = {
        route: '/desktop/adm/getAllAttachedFiles',
        body: {
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente')
          return
        } else {
          this.attachList = r.data.list
        }
      })
    }
  },
});
</script>
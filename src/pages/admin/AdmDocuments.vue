<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat
        class="bg-accent"
        title="Lista de documentos"
        :columns="suggestionData"
        :rows="suggestionList"
        row-key="_id"
        virtual-scroll
        rows-per-page-label="Registros por página"
        no-data-label="Nenhum dado inserido até o momento"
        no-results-label="A pesquisa não retornou nenhum resultado"
        :rows-per-page-options="[10, 20, 30, 50]"
        @row-click="clkGoToFunctionInOrganismDetail"
        :selected-rows-label="getSelectedString"
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
        <template #body-cell-document="props">
          <q-td :props="props">
            <div v-if="!props.row.document || props.row.document === ''">
              Não informado
            </div>
            <div v-else-if="props.row.document !== ''">
              {{props.row.document}}
            </div>
          </q-td>
        </template>
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-chip
              outline
              v-if="props.row.isActive === 1"
              color="green"
              size="14px"
            >
              Ativo
            </q-chip>
            <q-chip
              outline
              v-else-if="props.row.isActive === 0"
              color="red"
              size="14px"
            >
              Inativo
            </q-chip>
          </q-td>
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
            <q-file outlined v-model="dialogAddAttach.files" label="Clique aqui para adicionar anexos" />
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
              @click="SendAttach"
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
import { useTableColumns } from "stores/tableColumns";

export default defineComponent({
  name: "DocumentList",
  data() {
    return {
      suggestionData: useTableColumns().suggestionList,
      attachList: [],
      pagination: {
        page: 1,
        rowsPerPage: 10,
      },
      dialogAddAttach: {
        open: false,
        title: '',
        description: '',
        files: []
      },
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getAllAttachedFiles();
  },
  methods: {
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
      // this.SendAttach();
    },
    SendAttach() {
      if (this.dialogAddAttach.title === '' || this.dialogAddAttach.description === '') {
        this.$q.notify("Preencha todos os campos antes de enviar")
        return
      }
      console.log(this.dialogAddAttach.files)
      const file = [{file:this.dialogAddAttach.files,name:'userAttach'}]
      const opt = {
        route: "/desktop/adm/addAttachFiles",
        body: {
          attachTitle: this.dialogAddAttach.title,
          attachDescription: this.dialogAddAttach.description
        },
        files: null
      };
      if(opt.files === null){
        opt.files = file
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente')
          return
        } else {
          this.clearDialog()
          this.getAllAttachedFiles()
        }
      });
    },
    clearDialog(){
      this.dialogAddAttach.open = false
      this.dialogAddAttach.title = ''
      this.dialogAddAttach.description = ''
      this.dialogAddAttach.files = []
    },
    getAllAttachedFiles() {
      const opt = {
        route: '/desktop/adm/getAttachedFilesByUserId',
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

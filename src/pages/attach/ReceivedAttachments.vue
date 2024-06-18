<template>
  <q-page-container class="no-padding">
    <q-page>
      
      <div class="text-h6 q-mx-md">
        Anexos
      </div>
      <div class="q-mx-md text-caption">
        Clique para fazer o download
      </div>
      <q-table
        flat
        class="bg-accent"
        :columns="columnsData"
        :rows="attachFiles"
        row-key="_id"
        rows-per-page-label="Registros por página"
        no-data-label="Nenhum arquivo recebido até o momento"
        no-results-label="A pesquisa não retornou nenhum resultado"
        :rows-per-page-options="[10, 20, 30, 50]"
        @row-click="downloadAttach"
        :selected-rows-label="getSelectedString"
        :filter="filter"
        :v-model:pagination="pagination"
        @request="nextPage"
      >
        <template #body-cell-subType="props">
          <q-td :props="props">
            <div class="text-caption" v-if="props.row.subType === 'district'">
              Distrito
            </div>
            <div class="text-caption" v-if="props.row.subType === 'Distrito'">
              Distrito
            </div>
            <div class="text-caption" v-if="props.row.subType === 'general'">
              Todos
            </div>
            <div class="text-caption" v-if="props.row.subType === 'pastors'">
              Todos os pastores
            </div>
            <div class="text-caption" v-if="props.row.subType === 'Geral'">
              Todos
            </div>
            <div class="text-caption" v-if="props.row.subType === 'Pastores'">
              Todos os pastores
            </div>
          </q-td>
        </template>
      </q-table>
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import { useTableColumns } from "stores/tableColumns";
import utils from "../../boot/utils";
export default defineComponent({
  name: "ReceivedAttachments",
  data() {
    return {
      columnsData: useTableColumns().attach,
      attachFiles: [],
      selectStatus: ["Ativos", "Inativos"],
      filter: "",
      pdfUrl: '',
      selectFilter: "Ativos",
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: "",
      },
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getAttachByPastor();
    this.getAttachByUserInSpecificDistrict()
    this.getGeneralAttach()
  },
  methods: {
    async downloadAttach(e, r) {
      if(r.linkForDownload){
        window.open(r.linkForDownload.includes('https://') ? 
        r.linkForDownload : 'https://' + r.linkForDownload)
        return
      }
      await utils.download({
        filename: r.file.filename,
        originalname: r.file.originalname,
        type: r.file.mimetype
      })
    },
    getSelectedString() {
      return this.selected.length === 0
        ? ""
        : `${this.selected.length}
      despesa${this.selected.length > 1 ? "s" : ""}
      selecionadas de ${this.expensesData.length}`;
    },
    nextPage(e) {
      this.pagination.page = e.pagination.page;
      this.pagination.sortBy = e.pagination.sortBy;
      this.pagination.descending = e.pagination.descending;
      this.pagination.rowsPerPage = e.pagination.rowsPerPage;
      this.getStructures();
    },
    getAttachByPastor() {
      const opt = {
        route: "/desktop/attach/getAttachByPastor",
        body: {
          page: this.pagination.page,
          rowsPerPage:this.pagination.rowsPerPage,
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        this.attachFiles = r.data.list
      });
    },
    getGeneralAttach() {
      const opt = {
        route: "/desktop/attach/getGeneralAttach",
        body: {
          page: this.pagination.page,
          rowsPerPage:this.pagination.rowsPerPage,
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(!r.error){
          this.attachFiles.push(...r.data)
        }else{
          this.$q.notify(r.errorMessage)
        }
      });
    },
    getAttachByUserInSpecificDistrict() {
      const opt = {
        route: "/desktop/attach/getAttachByUserInSpecificDistrict",
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(!r.error){
          this.attachFiles.push(...r.data)
        }else{
          this.$q.notify(r.errorMessage)
        }
      });
    },
  },
});
</script>

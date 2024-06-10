<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat
        class="bg-accent"
        title="Anexos"
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
        <!-- <template #top-right>
          <div class="flex row text-right q-gutter-sm items-center">
            <div class="col">
              <q-select
                outlined
                dense
                debounce="300"
                v-model="selectFilter"
                :options="selectStatus"
                @update:model-value="getStructures"
              ></q-select>
            </div>
            <div class="col">
              <q-input
                @keyup="getStructures"
                outlined
                dense
                debounce="300"
                v-model="filter"
                placeholder="Procurar"
              >
                <template #append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
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
        </template> -->
      </q-table>
        <embed :src="pdfUrl" type="application/pdf"  width="1000" height="720"/>
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
    // this.getAttachByPastor();
    this.getAttachByUserInSpecificDistrict()
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
    getAttachByUserInSpecificDistrict() {
      const opt = {
        route: "/desktop/attach/getAttachByUserInSpecificDistrict",
        // body: {
        //   page: this.pagination.page,
        //   rowsPerPage:this.pagination.rowsPerPage,
        // },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        console.log("🚀 ~ useFetch ~ r:", r)
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

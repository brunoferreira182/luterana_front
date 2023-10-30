<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat
        class="bg-accent"
        title="Anexos"
        :columns="columnsData"
        :rows="attachmentsList"
        row-key="_id"
        virtual-scroll
        rows-per-page-label="Registros por página"
        no-data-label="Nenhum dado inserido até o momento"
        no-results-label="A pesquisa não retornou nenhum resultado"
        :rows-per-page-options="[10, 20, 30, 50]"
        :selected-rows-label="getSelectedString"
        @row-click="clkGoToAttachDetail"
        :filter="filter"
        v-model:pagination="pagination"
        @request="nextPage"
      >
        <template #top-right>
          <div class="row justify-end q-gutter-sm items-center">
            <div class="col">
              <q-input
                @keyup="getAttachedFilesByUserId"
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
            <div class="col text-center">
              <q-btn
                @click="$router.push('/user/createAttachments')"
                color="primary"
                unelevated
                no-caps
                rounded
                label="Novo anexo"
                icon="add"
                class="q-pa-sm"
              />
            </div>
          </div>
        </template>
      </q-table>
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import { useTableColumns } from "stores/tableColumns";

export default defineComponent({
  name: "UserAttachments",
  data() {
    return {
      columnsData: useTableColumns().userAttachments,
      attachmentsList: [],
      filter: "",
      selectFilter: "Selecionar",
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: "",
      },
    };
  },
  beforeMount(){
    this.getAttachedFilesByUserId()
  },
  methods: {
    clkGoToAttachDetail(e, r){
      const attachFileId = r._id;
      this.$router.push("/user/attachmentsDetail?attachFileId=" + attachFileId);
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
      this.getAttachedFilesByUserId();
    },
    getAttachedFilesByUserId() {
      const opt = {
        route: "/desktop/commonUsers/getAttachedFilesByUserId",
        body: {
          filterValue: this.filter,
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage
        },
      };
      if (this.selectFilter === "Ativos") {
        opt.body.isActive = 1;
      } else if (this.selectFilter === "Inativos") {
        opt.body.isActive = 0;
      }
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        this.attachmentsList = r.data.list;
        r.data.count[0] ? this.pagination.rowsNumber = r.data.count[0].count : this.pagination.rowsNumber = 0
      });
    },
  },
});
</script>
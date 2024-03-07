<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat
        class="bg-accent"
        title="Lista de solicitações"
        :columns="solicitationsData"
        :rows="solicitationsList"
        row-key="_id"
        virtual-scroll
        rows-per-page-label="Registros por página"
        no-data-label="Nenhum dado inserido até o momento"
        no-results-label="A pesquisa não retornou nenhum resultado"
        :rows-per-page-options="[10, 20, 30, 50]"
        :selected-rows-label="getSelectedString"
        v-model:pagination="pagination"
        @request="nextPage"
      >
        <template #top-right>
        </template>
        <template #body-cell-status="props">
          <q-td :props="props">
            {{ props.row.status.label }}
          </q-td>
          <q-td :props="props">
            <q-btn
              v-if="props.row.status.label  === 'Aguardando aprovação'"
              color="green"
              outline
              rounded
              size="15px"
              class="q-pa-xs"
              @click="approveRequest(props.row.organismId)"
              label="Aprovar"

              >
            </q-btn>
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

export default defineComponent({
  name: "SolicitationList",
  data() {
    return {
      solicitationsData: useTableColumns().solicitationsList,
      solicitationsList: [],
      pagination: {
        page: 1,
        rowsPerPage: 10,
      },
      dialogNewSugestion: {
        open: false,
        suggestionTitle: '',
        suggestionText: ''
      },
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getSolicitationsList();
  },
  methods: {
    approveRequest(id) {
      const opt = {
        route: '/desktop/adm/updateModificationRequest',
        body: {
          organismId: id 
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) return
        this.getSolicitationsList()
      })
    },
      clkGoToFunctionInOrganismDetail(e, r) {
      this.dialogNewSugestion.open = true
      this.dialogNewSugestion.suggestionText = r.suggestionText
      this.dialogNewSugestion.suggestionTitle = r.suggestionTitle
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
      this.pagination.rowsPerPage = e.pagination.rowsPerPage;
      this.getSolicitationsList();
    },
    getSolicitationsList() {
      const opt = {
        route: "/desktop/adm/getSolicitationsList",
        body: {
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage,
        },
      };
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        this.solicitationsList = r.data.list
        this.pagination.rowsNumber = r.data.count[0]
      });
    },
    clearDialog(){
      this.dialogNewSugestion.open = false
      this.dialogNewSugestion.suggestionText = ''
      this.dialogNewSugestion.suggestionTitle = ''
    },
  },
});
</script>

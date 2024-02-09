<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat
        class="bg-accent"
        title="Lista de sugestões"
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
      <q-dialog v-model="dialogNewSugestion.open" @hide="clearDialog()">
        <q-card style="border-radius: 1rem; height: 150x; width: 400px">
          <div class="text-h6 text-center q-pa-md ">Escreva</div>
          <q-card-section class="q-gutter-md">
            <q-input
              outlined
              label="Título"
              v-model="dialogNewSugestion.suggestionTitle"
            />
            <q-input
              outlined
              label="Descrição"
              autogrow
              v-model="dialogNewSugestion.suggestionText"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Voltar"
              no-caps
              color="primary"
              rounded
              @click="dialogNewSugestion.open = false"
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
  name: "SuggestionList",
  data() {
    return {
      suggestionData: useTableColumns().suggestionList,
      suggestionList: [],
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
    this.getSuggestionsList();
  },
  methods: {
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
      this.getSuggestionsList();
    },
    getSuggestionsList() {
      const opt = {
        route: "/desktop/adm/getSuggestionsList",
        body: {
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage,
        },
      };
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        this.suggestionList = r.data.list
        this.pagination.rowsNumber = r.data.count[0].count
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

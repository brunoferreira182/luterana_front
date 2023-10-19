
<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat
        class="bg-accent"
        title="Sugestões"
        :columns="columnsData"
        :rows="suggestionList"
        row-key="_id"
        virtual-scroll
        rows-per-page-label="Registros por página"
        no-data-label="Nenhum dado inserido até o momento"
        no-results-label="A pesquisa não retornou nenhum resultado"
        :rows-per-page-options="[10, 20, 30, 50]"
        @row-click="clkGoToFunctionInOrganismDetail"
        :selected-rows-label="getSelectedString"
        :v-model:pagination="pagination"
        @request="nextPage"
      >
        <template #top-right>
          <div class="q-gutter-sm items-center">
            <div class="col">
              <q-btn
                @click="dialogNewSugestion.open = true"
                color="primary"
                unelevated
                rounded
                no-caps
                class="q-pa-sm"
                icon="add"
                label="Nova sugestão"
              />
            </div>
          </div>
        </template>
      </q-table>
      <q-dialog v-model="dialogNewSugestion.open" @hide="clearDialog()">
        <q-card style="border-radius: 1rem; height: 150x; width: 400px">
          <div class="text-h6 text-center q-pa-md ">Escreva</div>
          <q-card-section class="q-gutter-md">
            <q-select
              outlined
              clearable
              option-label="label"
              emit-value
              hint="Especifique o tipo"
              map-options
              label="Tipo (opcional)"
              :option-value="(item) => item.label"
              :options="suggestionOptions"
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
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="createNewSuggestion"
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
  name: "UserSugestionsList",
  data() {
    return {
      columnsData: useTableColumns().suggestionList,
      suggestionList: [],
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: "",
      },
      suggestionOptions: [
        {label: 'Sugestões sistema'},
        {label: 'Alteração de dados'},
      ],
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
    clearDialog(){
      this.dialogNewSugestion.open = false
      this.dialogNewSugestion.suggestionText = ''
      this.dialogNewSugestion.suggestionTitle = ''
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
      this.pagination.descending = e.pagination.descending;
      this.pagination.rowsPerPage = e.pagination.rowsPerPage;
      this.getSuggestionsList();
    },
    getSuggestionsList() {
      const opt = {
        route: "/desktop/commonUsers/getSuggestionsList",
        body: {
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage
        },
      };
      useFetch(opt).then((r) => {
        this.suggestionList = r.data.list;
        r.data.count[0] ? this.pagination.rowsNumber = r.data.count[0].count : this.pagination.rowsNumber = 0
      });
    },
    createNewSuggestion() {
      if(this.dialogNewSugestion.suggestionText === '' || this.dialogNewSugestion.suggestionTitle === ''){
        this.$q.notify('Preencha todos os campos')
        return
      }
      const opt = {
        route: "/desktop/commonUsers/createNewSuggestion",
        body: {
          suggestionText: this.dialogNewSugestion.suggestionText,
          suggestionTitle: this.dialogNewSugestion.suggestionTitle
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        }else{
          this.getSuggestionsList()
          this.$q.notify('Sugestão enviada com sucesso!')
          this.clearDialog()
        }
      });
    },
  },
});
</script>

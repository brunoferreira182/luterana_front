<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat
        class="bg-accent"
        title="Todas as solicitações"
        :columns="columnsData"
        :rows="functionsList"
        virtual-scroll
        row-key="_id"
        rows-per-page-label="Registros por página"
        no-data-label="Nenhum dado inserido até o momento"
        no-results-label="A pesquisa não retornou nenhum resultado"
        :rows-per-page-options="[10, 20, 30, 50]"
        :selected-rows-label="getSelectedString"
        @row-click="clkOpenSolicitation"
        :filter="filter"
        :v-model:pagination="pagination"
        @request="nextPage"
      >
        <template #top-right>
          <div class="flex row q-gutter-sm items-center text-right">
            <!-- <div class="col">
              <q-select
                outlined
                dense
                debounce="300"
                v-model="selectFilter"
                :options="selectStatus"
                @update:model-value="getAllFunctionsSolicitations"
              ></q-select>
            </div> -->
            <div class="col">
              <q-input
                @keyup="getAllFunctionsSolicitations"
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
      </q-table>
      <q-dialog v-model="dialogOpenSolicitation.open" @hide="clearDialogSolicitation">
        <q-card style="border-radius: 1rem; width: 400px; padding: 10px">
          <q-card-section align="center">
            <div class="text-h6">
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Fechar"
              no-caps
              rounded
              color="primary"
              @click="dialogOpenSolicitation.open = false"
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
  name: "TitlesSolicitationsList",
  data() {
    return {
      columnsData: useTableColumns().allFunctionsSolicitations,
      functionsList: [],
      selectStatus: ["Ativos", "Inativos"],
      filter: "",
      selectFilter: "Selecionar",
      dialogOpenSolicitation: {
        open: false,
        data: {},
        userData: {},
      },
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
    this.getAllFunctionsSolicitations()
  },
  methods: {
    clearDialogSolicitation(){
      this.dialogOpenSolicitation.open = false
      this.dialogOpenSolicitation.data = {}
    },
    clkOpenSolicitation(e, r){
      this.dialogOpenSolicitation.data = r
      this.dialogOpenSolicitation.open = true
      this.getUserDetailById()
    },
    getSelectedString() {
      return this.selected.length === 0
        ? ""
        : `${this.selected.length}
      despesa${this.selected.length > 1 ? "s" : ""}
      selecionadas de ${this.expensesData.length}`;
    },
    getUserDetailById() {
      const opt = {
        route: "/desktop/adm/getUserDetailById",
        body: {
          _id: this.dialogOpenSolicitation.data.userId,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        if(r.error) {
          console.log("Ocorreu um erro, tente novamente kakak")
          return
        }
        this.dialogOpenSolicitation.userData = r.data
      });
    },
    nextPage(e) {
      this.pagination.page = e.pagination.page;
      this.pagination.sortBy = e.pagination.sortBy;
      this.pagination.descending = e.pagination.descending;
      this.pagination.rowsPerPage = e.pagination.rowsPerPage;
      this.getAllFunctionsSolicitations();
    },
    
    getAllFunctionsSolicitations() {
      const opt = {
        route: "/desktop/adm/getAllFunctionsSolicitations",
        body: {
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage,
          searchString: this.filter,
          sortBy: this.pagination.sortBy,
        }
      }
      useFetch(opt).then((r) => {
        if(r.error) {
          console.log("Ocorreu um erro, tente novamente")
          return
        }
        this.functionsList = r.data.list
        this.pagination.rowsNumber = r.data.count[0].count
      })
    },
  },
});
</script>

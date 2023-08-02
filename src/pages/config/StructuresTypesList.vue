<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat
        class="bg-accent"
        title="Tipos de estruturas"
        :columns="columnsData"
        :rows="structuresTypesList"
        virtual-scroll
        row-key="_id"
        rows-per-page-label="Registros por página"
        no-data-label="Nenhum dado foi encontrado"
        no-results-label="A pesquisa não retornou nenhum resultado"
        :rows-per-page-options="[10, 20, 30, 50]"
        @row-click="clkOpenStructureTypeDetail"
        :selected-rows-label="getSelectedString"
        :filter="filter"
        :v-model:pagination="pagination"
        @request="nextPage"
      >
        <template v-slot:top-right>
          <div class="flex row text-right q-gutter-sm items-center">
            <div class="col">
              <q-select
                outlined
                dense
                debounce="300"
                v-model="selectFilter"
                :options="selectStatus"
                @update:model-value="getStructuresTypes"
              ></q-select>
            </div>
            <div class="col">
              <q-input
                @keyup="getStructuresTypes"
                outlined
                dense
                debounce="300"
                v-model="filter"
                placeholder="Procurar"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col">
              <q-btn
                @click="$router.push('/config/createStructureType')"
                color="primary"
                unelevated
                rounded
                no-caps
                icon="add"
              >
                Tipo estrutura
              </q-btn>
            </div>
          </div>
        </template>
        <template v-slot:body-cell-status="props">
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
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import { useTableColumns } from "stores/tableColumns";

export default defineComponent({
  name: "StructuresTypesList",
  data() {
    return {
      columnsData: useTableColumns().structuresTypesList,
      structuresTypesList: [],
      selectStatus: ["Ativos", "Inativos"],
      filter: "",
      selectFilter: "Ativos",
      pagination: {
        page: 0,
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
    this.getStructuresTypes();
  },
  methods: {
    clkOpenStructureTypeDetail(e, r, i) {
      const structureTypeId = r._id;
      this.$router.push("/config/structureTypeDetail?structureTypeId=" + structureTypeId);
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
      this.getStructuresTypes();
    },
    getStructuresTypes() {
      const opt = {
        route: "/desktop/config/getStructuresTypes",
        body: {
          searchString: this.filter,
          page: this.pagination.page,
          isActive: 1,
        },
      };
      if (this.selectFilter === "Ativos") {
        opt.body.isActive = 1;
      } else if (this.selectFilter === "Inativos") {
        opt.body.isActive = 0;
      }
      useFetch(opt).then((r) => {
        this.structuresTypesList = r.data;
      });
    },
  },
});
</script>

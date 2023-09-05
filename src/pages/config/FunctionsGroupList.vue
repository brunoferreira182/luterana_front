<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat
        class="bg-accent"
        title="Grupos de funções"
        :columns="columnsData"
        :rows="functionsGroupList"
        row-key="_id"
        virtual-scroll
        rows-per-page-label="Registros por página"
        no-data-label="Nenhum dado inserido até o momento"
        no-results-label="A pesquisa não retornou nenhum resultado"
        :rows-per-page-options="[10, 20, 30, 50]"
        @row-click="clkOpenTitleDetail"
        :selected-rows-label="getSelectedString"
        :filter="filter"
        v-model:pagination="pagination"
        @request="nextPage"
      >
        <template #top-right>
          <div class="flex row text-right q-gutter-sm items-center">
            <div class="col">
              <q-select
                outlined
                dense
                debounce="300"
                v-model="selectFilter"
                :options="selectStatus"
                @update:model-value="getFunctionsGroupList"
              ></q-select>
            </div>
            <div class="col">
              <q-input
                @keyup="getFunctionsGroupList"
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
            <div class="col">
              <q-btn
                @click="$router.push('/config/createFunctionsGroup')"
                color="primary"
                unelevated
                rounded
                no-caps
                class="q-pa-sm"
                icon="add"
                label="Novo grupo"
              />
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
  name: "FunctionsGroupList",
  data() {
    return {
      columnsData: useTableColumns().functionsGroupList,
      functionsGroupList: [],
      selectStatus: ["Ativos", "Inativos"],
      filter: "",
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
    this.getFunctionsGroupList();
  },
  methods: {
    clkOpenTitleDetail(e, r) {
      const functionGroupId = r._id;
      this.$router.push("/config/functionsGroupDetail?functionGroupId=" + functionGroupId);
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
      this.getFunctionsGroupList();
    },
    getFunctionsGroupList() {
      const opt = {
        route: "/desktop/config/getFunctionsGroupList",
        body: {
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage,
          searchString: this.filter,
          sortBy: this.pagination.sortBy,
        },
      };
      if (this.selectFilter === "Ativos") {
        opt.body.isActive = 1;
      } else if (this.selectFilter === "Inativos") {
        opt.body.isActive = 0;
      }
      useFetch(opt).then((r) => {
        this.functionsGroupList = r.data.list;
        this.pagination.rowsNumber = r.data.count
      });
    },
  },
});
</script>

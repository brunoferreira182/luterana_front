<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat
        class="bg-accent"
        title="Visões"
        :columns="columnsData"
        :rows="visionsConfigList"
        row-key="_id"
        virtual-scroll
        rows-per-page-label="Registros por página"
        no-data-label="Nenhum dado inserido até o momento"
        no-results-label="A pesquisa não retornou nenhum resultado"
        :rows-per-page-options="[10, 20, 30, 50]"
        @row-click="clkOpenVisionDetail"
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
                @update:model-value="getVisionsConfigs"
              ></q-select>
            </div>
            <div class="col">
              <q-input
                @keyup="getVisionsConfigs"
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
                @click="$router.push('/config/createVision')"
                color="primary"
                unelevated
                rounded
                class="q-pa-sm"
                no-caps
                icon="add"
                label="Nova Visão"
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
  name: "TitleConfigurationList",
  data() {
    return {
      columnsData: useTableColumns().visionsConfigList,
      visionsConfigList: [],
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
    this.getVisionsConfigs();
  },
  methods: {
    clkOpenVisionDetail(e, r) {
      const visionId = r._id;
      this.$router.push("/config/visionDetail?visionId=" + visionId);
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
      this.getVisionsConfigs();
    },
    getVisionsConfigs() {
      const opt = {
        route: "/desktop/config/getVisions",
        body: {
          searchString: this.filter,
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage,
          isActive: 1,
        },
      };
      if (this.selectFilter === "Ativos") {
        opt.body.isActive = 1;
      } else if (this.selectFilter === "Inativos") {
        opt.body.isActive = 0;
      }
      useFetch(opt).then((r) => {
        this.visionsConfigList = r.data;
      });
    },
  },
});
</script>

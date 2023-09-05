<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat
        class="bg-accent"
        title="Organismos"
        :columns="columnsData"
        :rows="organismList"
        row-key="_id"
        @row-click="clkOpenOrganismDetail"
        virtual-scroll
        rows-per-page-label="Registros por página"
        no-data-label="Nenhum dado inserido até o momento"
        no-results-label="A pesquisa não retornou nenhum resultado"
        :rows-per-page-options="[10, 20, 30, 50]"
        :filter="filter"
        v-model:pagination="pagination"
        @request="nextPage"
      >
        <template #top-right>
          <div class="col">
            Filtrar por tipo de organismo:
            <q-btn size="sm" class="q-mx-sm" outline color="primary" label="Congregação" />
            <q-btn size="sm" class="q-mx-sm" outline color="primary" label="Financeiro" />
            <q-btn size="sm" class="q-mx-sm" outline color="primary" label="Jovens" />
            <q-btn size="sm" class="q-mx-sm" outline color="primary" label="ORG 4" />
            <q-btn size="sm" class="q-mx-sm" outline color="primary" label="ORG 5" />
          </div>
          <div class="flex row justify-end">
            <div class="col q-px-sm">
              <q-select 
                outlined
                dense
                debounce="300"
                v-model="selectFilter"
                :options="selectStatus"
                @update:model-value="getOrganismsList"
              ></q-select>
            </div>
            <div class="col">
              <q-input
                @keyup="getOrganismsList"
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
            <div class="col text-right">
              <q-btn
                @click="$router.push('/admin/createOrganism')"
                color="primary"
                unelevated
                no-caps
                rounded
                icon="add"
                class="q-pa-sm"
              >
                Criar Organismo
              </q-btn>
            </div>
          </div>
        </template>
        <template #body-cell-document="props">
          <q-td :props="props">
            <q-chip
              outline
              v-if="props.row.organismParentName"
              color="green"
              size="14px"
            >
              {{ props.row.organismParentName }}
            </q-chip>
            <q-chip
              outline
              v-else-if="!props.row.organismParentName"
              color="red"
              size="14px"
            >
              Nenhum grupo
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
  name: "OrganismTypeList",
  data() {
    return {
      columnsData: useTableColumns().organismList,
      organismList: [],
      selectStatus: ["Ativos", "Inativos"],
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
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getOrganismsList();
  },
  methods: {
    clkOpenOrganismDetail(e, r) {
      const organismId = r._id;
      this.$router.push("/admin/organismDetail?organismId=" + organismId);
    },
    nextPage(e) {
      this.pagination.page = e.pagination.page;
      this.pagination.sortBy = e.pagination.sortBy;
      this.pagination.rowsPerPage = e.pagination.rowsPerPage;
      this.getOrganismsList();
    },
    getOrganismsList() {
      const page = this.pagination.page
      const rowsPerPage = this.pagination.rowsPerPage
      const searchString = this.filter
      const sortBy = this.pagination.sortBy
      const opt = {
        route: "/desktop/adm/getOrganismsList",
        body: {
          page: page,
          rowsPerPage: rowsPerPage,
          searchString: searchString,
          sortBy: sortBy,
        },
      };
      if (this.selectFilter === "Ativos") {
        opt.body.isActive = 1;
      } else if (this.selectFilter === "Inativos") {
        opt.body.isActive = 0;
      }
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        this.organismList = r.data.list
        this.pagination.rowsNumber = r.data.count[0].count
      });
    },
  },
});
</script>

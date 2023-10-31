<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat
        class="bg-accent"
        title="Pastores"
        :columns="columnsData"
        :rows="pastorsList"
        row-key="_id"
        rows-per-page-label="Registros por página"
        no-data-label="Nenhum dado inserido até o momento"
        no-results-label="A pesquisa não retornou nenhum resultado"
        :rows-per-page-options="[10, 20, 30, 50]"
        @row-click="clkOpenUserDetail"
        :filter="filter"
        @request="nextPage"
        v-model:pagination="pagination"
        :loading="loading"
        binary-state-sort
      >
        <template #top-right>
          <div class="flex row justify-end">
            <div class="col q-px-sm">
              <q-select
                outlined
                dense
                v-model="selectFilter"
                :options="selectStatus"
                debounce="300"
                @update:model-value="getPastorList"
              ></q-select>
            </div>
            <div class="col">
              <q-input
                @keyup="getPastorList"
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
                @click="$router.push('/admin/createUser?userType=pastor')"
                color="primary"
                unelevated
                no-caps
                rounded
                icon="add"
                class="q-pa-sm"
              >
                Criar pastor
              </q-btn>
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
  name: "pastorsList",
  data() {
    return {
      columnsData: useTableColumns().usersList,
      pastorsList: [],
      selectStatus: ["Ativos", "Inativos"],
      filter: "",
      selectFilter: "Selecionar",
      initialPagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 10
        // rowsNumber: xx if getting data from a server
      },
      pagination: {
        sortBy: '',
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: 'desc',
        descending: false,
      },
      loading: false,
      // pagesNumber: computed(() => {
      //   return Math.ceil(rows.length / this.pagination.value.rowsPerPage)
      // })
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getPastorList();
  },
  methods: {
    getStatusColor(isActive) {
      return isActive === 0 ? "red" : "primary";
    },
    clkOpenUserDetail(e, r) {
      const userId = r._id;
      this.$router.push("/admin/userDetail?userId=" + userId);
    },
    nextPage(e) {
      this.pagination.page = e.pagination.page;
      this.pagination.sortBy = e.pagination.sortBy;
      this.pagination.rowsPerPage = e.pagination.rowsPerPage;
      this.getPastorList();
    },
    getPastorList() {
      const page = this.pagination.page
      const rowsPerPage = this.pagination.rowsPerPage
      const searchString = this.filter
      const sortBy = this.pagination.sortBy
      const opt = {
        route: "/desktop/adm/getPastorList",
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
        this.usersOptions = r.data;
        this.pastorsList = r.data.list
        // let projectList = []
        // r.data.list.forEach(projeto => {
        //   console.log(projeto)
        //   projectList.push({
        //     name: projeto.userName,
        //     status: projeto.status,
        //     _id: projeto._id
        //   })
        // })
        // this.pastorsList = projectList
        this.pagination.rowsNumber = r.data.count[0].count
      });
    },
  },
});
</script>

<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat
        class="bg-accent"
        title="Usuários"
        :columns="columnsData"
        :rows="usersList"
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
            <div class="col">
              <q-input
                @keyup="getUsersList"
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
                Criar usuário
              </q-btn>
            </div>
          </div>
        </template>
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn 
                size="sm" 
                color="primary" 
                unelevated
                round dense 
                @click="props.expand = !props.expand" :icon="props.expand ? 'expand_less' : 'expand_more'" 
              />
            </q-td>
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              @click="clkOpenUserDetail(col, props.row)"
            >
              {{ col.value }}
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props" >
            <q-td colspan="100%" >
              <q-item>
                <q-item-section class="text-wrap">
                  <div class="row">
                    <div class="col" v-if="props.row.userOrganisms.length && props.row.userType === 'Pastor'">
                      <q-chip
                        v-for="organism in props.row.userOrganisms" 
                        :key="organism"
                        :props="props"
                        class="q-pa-lg"
                      >
                        <div class="text-caption text-bold text-wrap text-capitalize" >
                          <div >{{ organism.organismName }}</div>
                          <div class="text-caption">
                            {{ organism.userFunction }}
                          </div>
                        </div> 
                      </q-chip>
                    </div>
                    <div v-else-if="!props.row.userOrganisms.length && props.row.userType === 'Pastor'">
                      Sem chamado
                    </div>
                  </div>
                  </q-item-section>
                </q-item>
            </q-td>
          </q-tr>
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
  name: "UsersList",
  data() {
    return {
      columnsData: useTableColumns().usersList,
      usersList: [],
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
    this.getUsersList();
  },
  methods: {
    getStatusColor(isActive) {
      return isActive === 0 ? "red" : "primary";
    },
    clkOpenUserDetail(c, r) {
      const userId = r._id;
      this.$router.push("/admin/userDetail?userId=" + userId);
    },
    nextPage(e) {
      this.pagination.page = e.pagination.page;
      this.pagination.sortBy = e.pagination.sortBy;
      this.pagination.rowsPerPage = e.pagination.rowsPerPage;
      this.getPastorList();
    },
    getUsersList() {
      const page = this.pagination.page
      const rowsPerPage = this.pagination.rowsPerPage
      const searchString = this.filter
      const sortBy = this.pagination.sortBy
      const opt = {
        route: "/desktop/adm/getUsersList",
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
        this.usersList = r.data.list
        this.usersList.forEach((user) => {
          if (user.userType === 'user') {
            user.userType = 'Usuário'
          } else if (user.userType === 'pastor') {
            user.userType = 'Pastor'
          }
        })
        this.pagination.rowsNumber = r.data.count[0].count
      });
    },
  },
});
</script>

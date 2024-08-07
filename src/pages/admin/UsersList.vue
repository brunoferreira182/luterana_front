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
        @row-click="clkOpenUserDetail"
        virtual-scroll
        rows-per-page-label="Registros por página"
        no-data-label="Nenhum dado inserido até o momento"
        no-results-label="A pesquisa não retornou nenhum resultado"
        :rows-per-page-options="[10, 20, 30, 50, 100, 1000]"
        :filter="filter"
        v-model:pagination="pagination"
        @request="nextPage"
      >
        <template #top>
          <div class="row full-width">
            <q-input
              @keyup="getUsersList"
              class="col-9 q-mr-xl"
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
            <q-btn
              @click="$router.push('/admin/createUser?userType=user')"
              color="primary"
              unelevated
              no-caps
              rounded
              v-if="canEdit"
              icon="add"
              class="q-pa-sm col-2"
            >
              Criar usuário
            </q-btn>
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
          <q-tr :props="props" class="pointer-cursor">
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
import { savedUsersList } from "stores/usersList";
import utils from '../../boot/utils'
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
      usersListTimer: null,
      canEdit: false,
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    // this.getUsersList();
    
    this.startView()
  },
  unmounted() {
    const currentRoute = this.$route
    if (currentRoute && !currentRoute.path.includes('/admin/userDetail')) {
      this.clearUsersStore()
    }
  },
  methods: {
    async startView () {
      const permStatus = await utils.getPermissionStatus('ADMIN')
      if (permStatus.data === 'onMaitenance') {
        this.$router.push('/maitenancePage')
        return
      }
      this.getUserCanEditStatus()
    },
    getUserCanEditStatus(){
      const opt = {
        route: '/desktop/users/getUserCanEditStatus'
      }
      useFetch(opt).then(r => {
        this.canEdit= r.data
      })
    },

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
      this.getUsersList();
    },
    clearUsersStore() {
      savedUsersList().list = [],
      savedUsersList().page = 1,
      savedUsersList().rowsPerPage = 10,
      savedUsersList().rowsNumber = 0,
      savedUsersList().sortBy = '',
      savedUsersList().selectFilter = '',
      savedUsersList().filter = ''
    },
    getUsersList() {
      if (savedUsersList().list.length && savedUsersList().list.length > 0) {
        if (this.pagination.page === 1 &&
          this.pagination.rowsPerPage === 10 &&
          this.pagination.rowsNumber === 0 &&
          this.pagination.sortBy === '' &&
          this.filter === '' &&
          this.selectFilter === '' &&
          this.filter === ''
        ) {
          this.organismList = savedUsersList().list,
          this.pagination.page = savedUsersList().page,
          this.pagination.rowsPerPage = savedUsersList().rowsPerPage,
          this.pagination.rowsNumber = savedUsersList().rowsNumber,
          this.pagination.sortBy = savedUsersList().sortBy,
          this.selectFilter = savedUsersList().selectFilter,
          this.filter = savedUsersList().filter
          return
        }
      }
      if (this.usersListTimer) {
        clearTimeout(this.usersListTimer);
      }
      this.usersListTimer = setTimeout(() => {
        const opt = {
        route: "/desktop/adm/getUsersList",
        body: {
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage,
          searchString: this.filter,
          sortBy: this.pagination.sortBy,
          selectFilter: this.selectFilter,
          descending: this.pagination.descending
        },
      };
      if (this.selectFilter === "Ativos") {
        opt.body.isActive = 1;
      } else if (this.selectFilter === "Inativos") {
        opt.body.isActive = 0;
      }
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        this.usersOptions = r.data;
        this.usersList = r.data.list;
        this.usersList.forEach((user) => {
          if (user.userType === 'user') {
            user.userType = 'Usuário'
          } else if (user.userType === 'pastor') {
            user.userType = 'Pastor'
          }
        })
        this.pagination.rowsNumber = r.data.count[0].count
        savedUsersList().list = r.data.list
        savedUsersList().page = this.pagination.page
        savedUsersList().rowsPerPage = this.pagination.rowsPerPage
        savedUsersList().rowsNumber = this.pagination.rowsNumber
        savedUsersList().sortBy = this.pagination.sortBy
        savedUsersList().selectFilter = this.selectFilter
        savedUsersList().filter = this.filter
      });
      }, 500)
      
    },
  },
});
</script>

<style scoped>
.pointer-cursor {
  cursor: pointer;
}
</style>


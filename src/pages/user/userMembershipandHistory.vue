<template>
  <q-page-container class="no-padding">
    <q-page>  
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col text-h5 text-capitalize">
          Lista de solicitações
        </div>
        <q-btn 
          unelevated
          rounded
          label="Editar"
          no-caps
          color="primary">
          <q-icon name="edit" size="xs" class="q-pl-xs"></q-icon>
        </q-btn>
      </div>
      <q-separator/>
      <!-- <div class="q-pa-md">  -->
        <q-list padding>
          <q-table
              flat
              class="bg-accent"
              title="Histórico de Membresia"
              :columns="columnsData"
              :rows="recivedSolicitations"
              virtual-scroll
              row-key="_id"
              rows-per-page-label="Registros por página"
              no-data-label="Nenhum dado inserido até o momento"
              no-results-label="A pesquisa não retornou nenhum resultado"
              :rows-per-page-options="[10, 20, 30, 50]"
              :filter="filter"
              :v-model:pagination="pagination"
              @request="nextPage"
              >
              <!-- :selected-rows-label="getSelectedString"
              @row-click="" -->
          </q-table>
        </q-list>
          <!-- <q-item-label header>Histórico de Membresia</q-item-label>

            <q-item clickable v-ripple
            >
            v-for="(membership) in membershipHistory"
            :key="membership" 
              <q-item-section>
                <q-item-label>
                  <q-input :label= "'Insira seu Nome'" > </q-input>
                  <q-input :label= "'Insira seu Nome'" > </q-input>
                  <q-input :label= "'Insira seu Nome'" > </q-input>

                </q-item-label>
                <q-item-label caption>
                  Set the content filtering level to restrict
                  apps that can be downloaded
                </q-item-label>
                <q-item-label caption>
                  Set the content filtering level to restrict
                  apps that can be downloaded
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator spaced></q-separator>

        </q-list> 
      </div> -->
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import { useTableColumns } from "stores/tableColumns";
import { useScreenStore } from "stores/checkIsMobile";
import utils from '../../boot/utils'

export default defineComponent({
  name: "UserMembershipandHistory",
  data() {
    return {
      columnsData: useTableColumns().membershipList,
      membershipHistory: [],
      filter: "",
      disableRow: false,
      isMobile: false,
      myUserIdMongo: '',
      hideDiv: false,
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
      this.startView()
  },
  methods: {
    async startView () {
      this.getMembershipandHistory()
      const permStatus = await utils.getPermissionStatus('USER')
      if (permStatus.data === 'onMaitenance') {
        this.$router.push('/maitenancePage')
        return
        }
      this.getUserIdMongo()
      this.getFunctionsSolicitationsByUserId()
      this.isMobile = useScreenStore().isMobile
    },
    getUserIdMongo() {
      const opt = {
        route: '/desktop/adm/getUserIdMongo',
      }
      useFetch(opt).then(r => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro");
          return
        } else { this.myUserIdMongo = r.data.userIdMongo }
      })
    },
    getFunctionsSolicitationsByUserId() {
      const opt = {
        route: "/desktop/commonUsers/getFunctionsSolicitationsByUserId",
        body: {
          searchString: this.filter,
          page: this.pagination.page,
          isActive: 1,
          rowsPerPage: this.pagination.rowsPerPage,
        },
      };
      if (this.selectFilter === "Ativos") {
        opt.body.isActive = 1;
      } else if (this.selectFilter === "Inativos") {
        opt.body.isActive = 0;
      }
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        this.recivedSolicitations = r.data.recivedSolicitations.list
        this.sendedSolicitations = r.data.sendedSolicitations.list
      });
    },
    getMembershipandHistory(){
      const opt = {
        route: "/desktop/users/getMembershipandHistory",
        body: {
          searchString: this.filter,
          page: this.pagination.page,
          isActive: 1,
          rowsPerPage: this.pagination.rowsPerPage,
        },
        // body: {
        // },
      };
      useFetch(opt).then((r) => {
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente por favor')
          return
        }
        this.membershipHistory = r.data.list
        console.log(this.membershipHistory, 'sdasd')
      })
    },
    nextPage(e) {
      this.pagination.page = e.pagination.page;
      this.pagination.sortBy = e.pagination.sortBy;
      this.pagination.descending = e.pagination.descending;
      this.pagination.rowsPerPage = e.pagination.rowsPerPage;
      this.getFunctionsSolicitationsByUserId();
    },
  },
});
</script>

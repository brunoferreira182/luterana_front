<template>
  <q-page-container class="no-padding">
    <q-page>  
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col text-h5 text-capitalize">
          Histórico de Membresia
        </div>
      </div>
      <q-separator/>
        <div> 
          <q-table 
            flat
            class="bg-accent q-pa-md"
            :columns="columnsData"
            :rows="membershipHistory"
            row-key="_id"
            virtual-scroll
            rows-per-page-label="Registros por página"
            no-data-label="Nenhum dado inserido até o momento"
            no-results-label="A pesquisa não retornou nenhum resultado"
            :rows-per-page-options="[10, 20, 30, 50]"
            :filter="filter"
            :v-model:pagination="pagination"
            @request="nextPage"
          >
          <!-- <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                unelevated
                rounded
                no-caps
                size="sm"
                color="primary"
                label="Editar"
                @click="editRow(props.row)"
              />
            </q-td>
          </template> -->
          </q-table>
        </div>
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
  name: "UserMembershipAndHistory",
  data() {
    return {
      columnsData: useTableColumns().membershipList,
      membershipHistory: [],
      filter: "",
      editMembership:{
        open: false,
        initialDate: '',
        finalDate: '',
        organism: {
          _id: '',
          organismName: '',
        },
        delete: false,
      },
      options: [],
      organismSelected: '',
      isMobile: false,
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
      const permStatus = await utils.getPermissionStatus('USER')
      if (permStatus.data === 'onMaitenance') {
        this.$router.push('/maitenancePage')
        return
        }
      this.getUserIdMongo()
      // this.getMembershipandHistory()
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
    async getMembershipandHistory(){
      const visibility = this.columnsData.find( col => col.name === "actions")
      if (visibility) visibility.visible=false
      const opt = {
        route: "/desktop/users/getMembershipAndHistory",
        body: {
          searchString: this.filter,
          page: this.pagination.page,
          isActive: 1,
          rowsPerPage: this.pagination.rowsPerPage,
        },
      };
      useFetch(opt).then((r) => {
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente por favor')
          return
        }
        this.membershipHistory = r.data.list
      })
      },
      //talvez saia
      editRow(row) {
        this.editMembership.open = true
        this.editMembership.initialDate = row.dataInicio
        this.editMembership.finalDate = row.dataFim
        this.editMembership.organism._id = row.organismId
        this.editMembership.organism.organismName = row.organismName
      },
      getOrganismByString(val, update){
      if (val < 2) return
      const opt = {
        route: "/desktop/adm/getOrganismsNames",
        body: {
          searchString: val
        }
      }
      useFetch(opt).then((r) => {
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente por favor')
          return
        }
        update(() => {
          this.options = r.data
        })
      })
    },
    //tbm sai 
    async saveMembership(){
      const opt = {
        route: "/desktop/commonUsers/saveNewMembership",
        body: {
          finalDate: this.addNewMembership.finalDate === '' ? this.editMembership.finalDate : this.addNewMembership.finalDate ,
          initialDate: this.addNewMembership.initialDate === '' ? this.editMembership.initialDate : this.addNewMembership.initialDate, 
          organismSelected: this.organismSelected === '' ? this.editMembership.organism : this.organismSelected 
        }
      }
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente por favor')
          return
        }
        this.$q.notify(r.message)
        // this.getMembershipandHistory()
        this.clearEditMembershipDialog()
        this.clearAddNewMemberDialog()
      })
    },
    //sai tbm 
    clearAddNewMemberDialog(){
      this.addNewMembership.open= false
      this.addNewMembership.initialDate= ''
      this.organismSelected = ''
    },
    //sai tbm
    clearEditMembershipDialog(){
      this.editMembership.open = false
      this.editMembership.initialDate = ''
      this.editMembership.finalDate = ''
      this.editMembership.organism._id = ''
      this.editMembership.organism.organismName = ''
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

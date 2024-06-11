<template>
  <q-page-container class="no-padding">
    <q-page>  
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col text-h5 text-capitalize">
          Histórico de Membresia
        </div>
        <q-btn 
          @click="addNewMembership.open = true"
          unelevated
          rounded
          label="Adicionar"
          no-caps
          size="md"
          color="primary"
          icon-right="add"
          >
        </q-btn>
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
          </q-table>
        </div>
        <q-dialog v-model="addNewMembership.open" @hide="clearDialog()">
        <q-card style="border-radius: 1rem; height: 150x; width: 400px">
          <div class="text-h6 text-center q-pa-md ">Escreva</div>
          <q-card-section class="q-gutter-md">
            <q-input
              outlined
              label="Data de inicio" mask="##/##/####"
              autogrow
              v-model="addNewMembership.initialDate"
            />
          </q-card-section>
          <q-card-section class="q-gutter-md">
            <q-select
              v-model="organismSelected"
              filled
              use-input
              label="Nome do organismo"
              option-label="organismName"
              :options="options"
              @filter="getOrganismByString"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Nenhum resultado
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Voltar"
              no-caps
              color="primary"
              rounded
              @click="addNewMembership.open = false"
            />
            <q-btn
              flat
              label="Salvar"
              no-caps
              color="primary"
              rounded
              @click="saveMembership()"
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
import { useScreenStore } from "stores/checkIsMobile";
import utils from '../../boot/utils'

export default defineComponent({
  name: "UserMembershipandHistory",
  data() {
    return {
      columnsData: useTableColumns().membershipList,
      membershipHistory: [],
      filter: "",
      addNewMembership:{
        open: false,
        initialDate: '',
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
      this.getMembershipandHistory()
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
      const opt = {
        route: "/desktop/users/getMembershipandHistory",
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
        console.log(r, 'sdasd')
      })
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
    async saveMembership(){
      const opt = {
        route: "/desktop/commonUsers/saveNewMembership",
        body: {
          initialDate: this.addNewMembership.initialDate, 
          finalDate: this.addNewMembership.finalDate,
          organismSelected: this.organismSelected
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
      })
      this.$q.loading.hide()
      this.addNewMembership.open= false
      this.addNewMembership.initialDate= ''
      this.organismSelected = ''
      this.getMembershipandHistory()
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

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
        @row-click="clkAddPastorToArray"
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
            @keyup="getPastorList"
            outlined
            class="col-9 q-mr-lg"
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
      </template>
        <!-- <template #top>
        <div class="flex row justify-end q-gutter-sm">
          
          <div class="background-radio flex q-gutter-xs">
            <q-radio 
              dense dark color="white" 
              v-model="canBeDead" val="true" 
              label="Falecidos" 
              style="color: white;">
            </q-radio>
            <q-radio 
              dense dark color="white" 
              v-model="canBeDead" val="false" 
              label="Não Falecidos" 
              style="color: white;">
            </q-radio>
          </div>
          <q-select
            no-caps
            dark
            dense
            class="background-radio"
            v-model="optionValueFilter" 
            :options="optionsFilter" label="Filtro"
          > 
          </q-select> 
          </div>
        </template> -->
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
            <q-td auto-width >
              <q-btn 
                size="sm" 
                color="primary" 
                unelevated
                round dense 
                @click="props.expand = !props.expand" :icon="props.expand ? 'expand_less' : 'expand_more'" 
              />
            </q-td>
            <q-td
              style="cursor: pointer;"
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              @click="clkAddPastorToArray(col, props.row)"
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
      <div class="q-px-md">
        <div class="text-h5">
          Pastores selecionados 
          <q-btn icon="download" flat round color="primary">
            <q-tooltip>
              Baixar ficha pastoral
            </q-tooltip>
          </q-btn>
        </div>
        <div v-if="!pastorsArray.length">
          Nenhum pastor selecionado
        </div>
        <q-chip 
          v-for="item in pastorsArray" 
          :key="item"
          removable
          @remove="removePastorFromArray(i)"
        >
          {{ item.name }}
        </q-chip>
      </div>
      <DialogPdfUserInfo
        :open="dialogUserInfo.open"
        :data="userData.userDataTabs"
        :userId="$route.query.userId"
        :userImage="userProfileImage"
        @closeDialog="closeDialogShowPdfInfo"
      />
    </q-page>
  </q-page-container>
</template>
<script setup>
import { defineComponent, computed } from "vue";
// import DialogPdfUserInfo from '../../components/DialogPdfUserInfo.vue'
import useFetch from "../../boot/useFetch";
import { useTableColumns } from "stores/tableColumns";
import { savedPastorsList } from "stores/pastorsList";
import utils from "../../boot/utils";
</script>
<script>

export default defineComponent({
  name: "PastoralArchive",
  data() {
    return {
      columnsData: useTableColumns().usersList,
      pastorsList: [],
      selectStatus: ["Ativos", "Inativos"],
      filter: "",
      selectFilter: "Selecionar",
      optionValueFilter: "",
      userData: [],
      dialogUserInfo: {
        open: false
      },
      optionsFilter: [
        {
          label: 'Falecido',
          value:  'true'
        },
        {
          label: 'Não falecido',
          value:  'false'
        },
        {
          label: 'Com chamado',
          value: 'withCall'
        },
        {
          label: 'Sem chamado',
          value: 'withoutCall '
        },
        {
          label: 'Cedido',
          value:  'ceded'
        },
        {
          label: 'Licença',
          value:  'license'
        },
        {
          label: 'Estagiário',
          value:  'trainee'
        },
        {
          label: 'Aposentado',
          value:  'retired'
        },
        {
          label: 'Estudante',
          value:  'student'
        },
        {
          label: 'Atuação',
          value:  'acting'
        },
      ],
      canBeDead: "false",
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
      pastorListTimer: null,
      canEdit: false,

      pagesNumber: computed(() => {
        return Math.ceil(rows.length / this.pagination.value.rowsPerPage)
      }),
      pastorsArray: []
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.startView()

    // this.getPastorList();
  },
  unmounted() {
    const currentRoute = this.$route
    if (currentRoute && !currentRoute.path.includes('/admin/userDetail')) {
      this.clearPastorStore()
    }
  },
  // watch:{
  //   optionValueFilter: 'getPastorList'
  // },
  methods: {
    async getUserDetailById(userIdString) {
      const userId = userIdString;
      const opt = {
        route: "/desktop/adm/getUserDetailById",
        body: {
          _id: userId,
        },
      };
      this.$q.loading.show();
      await useFetch(opt).then(async (r) => {
        if(r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente")
          return
        }
        // this.userDetail = r.data
        const userConfig = await this.getUsersConfig(r.data.userType)
        if (userConfig.error) {
          this.$q.notify("Ocorreu um erro, tente novamente");
          return
        }
        if (r.data && r.data.userLinksToOrganisms && r.data.userLinksToOrganisms.links && r.data.userLinksToOrganisms.links.length > 0) {
          let links = r.data.userLinksToOrganisms.links
          links.forEach((link) => {
            if (link.functionSubtype === 'chamado') {
              console.log('HHEHEHEUHFUSAHFSUDFHASUDH')
              this.callList.push(link)
            } 
          })
        }
        if (r.data && r.data.userLinksToOrganisms && r.data.userLinksToOrganisms.otherLinks && r.data.userLinksToOrganisms.otherLinks.length > 0) {
          this.otherLinks = r.data.userLinksToOrganisms.otherLinks
        }
        this.otherLinks = r.data.userLinksToOrganisms.otherLinks
        this.userCanEdit = r.data.canEdit
        this.callList = r.data.userLinksToOrganisms.links
        this.userData = userConfig.data
        this.userType = r.data.userType
        this.canUseSystem = r.data.canUseSystem
        if (r.data.pastoralStatus && r.data.pastoralStatus.data) {
          this.pastoralStatusData = r.data.pastoralStatus.data
        }
        if (r.data.legacyLinks) {
          this.legacyLinks = r.data.legacyLinks
        }
        this.userProfileImage = r.data.profileImage
        this.verifyLinks()
        this.verifyInactiveStatus()
        this.$q.loading.hide();
      });
    },
    getUsersConfig(userType) {
      const opt = {
        route: "/desktop/adm/getUsersConfig",
      };
      if (userType) opt.body = { userType }
      return useFetch(opt)
    },
    verifyInactiveStatus() {
      this.inactiveStatus = []
      let activeStatus = []
      if (this.pastoralStatusData && this.pastoralStatusData.length > 0) {
        this.pastoralStatusData.forEach((status) => {
          if (status.dates.finalDate && status.dates.finalDate !== '') {
            this.inactiveStatus.push(status)
          } else if (!status.dates.finalDate || status.dates.finalDate === "") {
            activeStatus.push(status)
            this.pastoralStatusData = activeStatus
          }
        })
      }
    },
    verifyLinks() {
      let congregationLinks = []
      let parishLinks = []
      if (this.userLinks && this.userLinks.length === 2) {
        this.userLinks.forEach((link, i) => {
          if (link.organismConfigName === 'Distrito') {
            this.userLinks.splice(i, 1)
          }
          if (link.organismConfigName === 'Congregação') {
            congregationLinks.push({
              index: i
            })
          }
          if (link.organismConfigName === 'Paróquia') {
            parishLinks.push({
              index: i
            })
          }
          if (congregationLinks.length > 0) {
            if (parishLinks.length > 0) {
              parishLinks.forEach((pl) => {
                this.userLinks.splice(pl.index, 1)
              })
            }
          }
        })
      }
    },
    // generatePdf() {
    //   let pdf = document.getElementById('pdf')
    //   let configs = {
    //     margin: 0,
    //     filename: `Ficha cadastral de ${props.data[0].fields[0].value}`,
    //     jsPDF: { unit:'mm', format: 'letter', orientation: 'portrait'},
    //     pagebreak: {mode: ['avoid-all']}
    //   }
    //   html2pdf().set(configs).from(pdf).save()
    // },
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
        this.canEdit = r.data
      })
    },

    getStatusColor(isActive) {
      return isActive === 0 ? "red" : "primary";
    },
    clkAddPastorToArray(c, r) {
      const userData = this.getUserDetailById(r.userIdString)
      console.log("🚀 ~ clkAddPastorToArray ~ userData:", userData)
      this.pastorsArray.push(userData)
      
    },
    removePastorFromArray(i){
      this.pastorsArray.splice(i, 1)
    },
    nextPage(e) {
      this.pagination.page = e.pagination.page;
      this.pagination.sortBy = e.pagination.sortBy;
      this.pagination.rowsPerPage = e.pagination.rowsPerPage;
      this.getPastorList();
    },
    clearPastorStore() {
      savedPastorsList().list =[],
      savedPastorsList().page = 1,
      savedPastorsList().rowsPerPage = 10,
      savedPastorsList().rowsNumber = 0,
      savedPastorsList().sortBy = '',
      savedPastorsList().selectFilter = '',
      savedPastorsList().filter = ''
    },
    getPastorList() {
      if (savedPastorsList().list.length && savedPastorsList().list.length > 0) {
        if (this.pagination.page === 1 &&
          this.pagination.rowsPerPage === 10 &&
          this.pagination.rowsNumber === 0 &&
          this.pagination.sortBy === '' &&
          this.filter === '' &&
          this.selectFilter === '' &&
          this.filter === ''
        ) {
          this.organismList = savedPastorsList().list,
          this.pagination.page = savedPastorsList().page,
          this.pagination.rowsPerPage = savedPastorsList().rowsPerPage,
          this.pagination.rowsNumber = savedPastorsList().rowsNumber,
          this.pagination.sortBy = savedPastorsList().sortBy,
          this.selectFilter = savedPastorsList().selectFilter,
          this.filter = savedPastorsList().filter
          return
        }
      }
      if (this.pastorListTimer) {
        clearTimeout(this.pastorListTimer);
      }
      this.pastorListTimer = setTimeout(() => {
        const opt = {
        route: "/desktop/adm/getPastorList",
        body: {
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage,
          searchString: this.filter,
          sortBy: this.pagination.sortBy,
          selectFilter: this.selectFilter,
          descending: this.pagination.descending
        },
      };
      if (this.canBeDead === 'true' && this.canBeDead !== '') opt.body.canUseSystem = "true"
      if (this.optionValueFilter && this.optionValueFilter !== '') opt.body.optionValueFilter = false 
      if (this.selectFilter === "Ativos") {
        opt.body.isActive = 1;
      } else if (this.selectFilter === "Inativos") {
        opt.body.isActive = 0;
      }
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        this.pastorsList = r.data.list;
        this.pastorsList.forEach((pastor) => {
          if (pastor.userType === 'pastor') {
            pastor.userType = 'Pastor'
          }
        })
        this.pagination.rowsNumber = r.data.count[0].count
        savedPastorsList().list = r.data.list
        savedPastorsList().page = this.pagination.page
        savedPastorsList().rowsPerPage = this.pagination.rowsPerPage
        savedPastorsList().rowsNumber = this.pagination.rowsNumber
        savedPastorsList().sortBy = this.pagination.sortBy
        savedPastorsList().selectFilter = this.selectFilter
        savedPastorsList().filter = this.filter
      });
      }, 500)
    },
  },
});
</script>

<style scoped>
.background-radio {
  padding-right: 15px; 
  padding-left: 16px; 
  min-width: 8em;
  background-color: #2a46a1; 
  border-radius: 20px;
}
</style>

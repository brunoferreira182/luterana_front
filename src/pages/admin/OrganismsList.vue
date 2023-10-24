<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table 
        flat class="bg-accent" 
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
        @request="nextPage">
        <template #top-right>
          <div class="flex row q-gutter-sm items-center text-right">
            <div class="col">
              <q-select 
                outlined 
                dense 
                label="Selecionar"
                debounce="300" 
                v-model="selectFilter" 
                :options="selectStatus"
                @update:model-value="getOrganismsList"
              />
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
            <div>
              <q-btn 
                @click="$router.push('/admin/createOrganism')" 
                color="primary" 
                unelevated 
                class="q-pa-sm"
                no-caps 
                rounded 
                dense
                icon="add"
              >
                Criar Organismo
              </q-btn>
            </div>
          </div>
        </template>
        <template #body-cell-organismParentName="props">
          <q-td :props="props">
            <q-chip outline v-if="props.row.organismParentName" color="green" size="14px">
              {{ props.row.organismParentName }}
            </q-chip>
            <q-chip outline v-if="!props.row.organismParentName" color="red" size="14px">
              Nenhum
            </q-chip>
          </q-td>
        </template>
        <template #body-cell-organismConfigName="props">
          <q-td :props="props">
            <q-chip 
              v-if="props.row.organismConfigName" 
              :style="{ color: props.row.organismStyle }" 
              size="14px"
              outline
            >
              {{ props.row.organismConfigName }}
            </q-chip>
          </q-td>
        </template>
        <template #body-cell-endereco="props">
          <q-td :props="props">
            <q-chip 
              v-if="props.row.endereco" 
              :style="{ color: props.row.organismStyle }" 
              size="14px"
              outline
            >
              {{ props.row.endereco }}
            </q-chip>
          </q-td>
        </template>
      </q-table>
      <div class="q-gutter-md q-pa-md">
        <q-chip
          v-for="(name, nameIndex) in organismsConfigsNamesList"
          :key="name"
          class="q-ma-sm"
          outline
          clickable
          :style="{ textTransform: 'capitalize', color: name.organismStyle }"
          :icon="selectedChipIndex === nameIndex ? 'check_circle' : ''"
          @click="filterOrganisms(nameIndex)"
        >
          {{ name.organismConfigName }}
        </q-chip>
      </div>
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import { useTableColumns } from "stores/tableColumns";

export default defineComponent({
  name: "OrganismList",
  data() {
    return {
      columnsData: useTableColumns().organismList,
      organismList: [],
      organismsConfigsNamesList: [],
      selectStatus: ["Ativos", "Inativos"],
      filter: "",
      filterRow: [],
      selectedChipIndex: null,
      selectFilter: '',
      selectedChips: [],
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
    this.getOrganismsConfigsNamesList();
  },
  methods: {
    toggleChipSelection(nameIndex) {
      if (this.isChipSelected(nameIndex)) {
        // Se o chip estiver selecionado, desmarque-o (remova do array)
        this.selectedChips = this.selectedChips.filter((item) => item !== nameIndex);
      } else {
        // Se o chip não estiver selecionado, marque-o (adicione ao array)
        this.selectedChips.push(nameIndex);
      }
      this.getOrganismsList(nameIndex);
    },
    isChipSelected(index) {
      // Verifique se o chip com o índice fornecido está selecionado
      return this.selectedChips.includes(index);
    },
    clkOpenOrganismDetail(e, r) {
      const organismId = r.organismId;
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
      const selectFilter = this.selectFilter
      const opt = {
        route: "/desktop/adm/getOrganismsList",
        body: {
          page: page,
          rowsPerPage: rowsPerPage,
          searchString: searchString,
          sortBy: sortBy,
          selectFilter: selectFilter
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
        this.organismList = r.data.list
        this.pagination.rowsNumber = r.data.count[0].count
      });
    },
    getOrganismsConfigsNamesList() {
      const opt = {
        route: '/desktop/adm/getOrganismsConfigsNamesList',
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente.')
        } else {
          this.organismsConfigsNamesList = r.data
        }
      })
    },
    filterOrganisms(nameIndex) {
      const selectedOrganism = this.organismsConfigsNamesList[nameIndex];
      if (this.selectedChipIndex === nameIndex) {
        // Se o chip já está selecionado, desmarque-o
        this.selectedChipIndex = null;
        this.selectFilter = ''
        this.getOrganismsList();
      } else {
        // Se um chip diferente for selecionado, atualize o índice
        this.selectedChipIndex = nameIndex;
        this.selectFilter = selectedOrganism.organismConfigName;
      }
      this.getOrganismsList();
    },
    // filterOrganisms(nameIndex) {
    //   const selectedOrganism = this.organismsConfigsNamesList[nameIndex];

    //   if (this.selectFilter === selectedOrganism.organismConfigName) {
    //     // Se o chip clicado já está selecionado, desmarque-o
    //     this.selectFilter = null;
    //   } else {
    //     // Se o chip clicado não está selecionado, marque-o (mude a seleção)
    //     this.selectFilter = selectedOrganism.organismConfigName;
    //   }

    //   this.getOrganismsList();
    // }
  },
});
</script>

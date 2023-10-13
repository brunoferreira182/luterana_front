<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat
        class="bg-accent"
        title="Minha rede"
        :columns="isMobile ? columnsDataMobile : columnsData"
        :rows="userOrganismList"
        row-key="_id"
        virtual-scroll
        rows-per-page-label="Registros por página"
        no-data-label="Nenhum dado inserido até o momento"
        no-results-label="A pesquisa não retornou nenhum resultado"
        :rows-per-page-options="[10, 20, 30, 50]"
        @row-click="clkOpenUserOrganismDetail"
        :selected-rows-label="getSelectedString"
        :filter="filter"
        :v-model:pagination="pagination"
        @request="nextPage"
      >
        <template #top-right>
          <div class="flex row justify-end q-gutter-sm items-center">
            <div class="col">
              <q-input
                @keyup="getAllOrganismsByString"
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
      </q-table>
      <div class="text-left">
        <q-btn 
          v-for="(organism, nameIndex) in userOrganismList" 
          :key="organism"
          size="md"
          class="q-ma-sm"
          :style="{ textTransform: 'capitalize', color: organism.organismStyle }"
          outline
          rounded
          @click="filterOrganisms(nameIndex)"
        >
        {{ organism.organismConfigName }}
        </q-btn>
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import { useTableColumns } from "stores/tableColumns";
import { useScreenStore } from "stores/checkIsMobile";

export default defineComponent({
  name: "OrganismsList",
  data() {
    return {
      columnsData: useTableColumns().userOrganismList,
      columnsDataMobile: useTableColumns().userOrganismListMobile,
      isMobile: false,
      searchAllOrganismsList: [],
      userOrganismList: [],
      selectStatus: ["Ativos", "Inativos"],
      filter: "",
      selectFilter: "Selecionar",
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: "",
      },
      verifyBtn: 1
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.isMobile = useScreenStore().isMobile
    this.getAllOrganismsByString();
  },
  methods: {
    clkOpenUserOrganismDetail(e, r) {
      const organismId = r.organismId;
      this.$router.push("/user/userOrganismDetail?organismId=" + organismId);
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
      this.getAllOrganismsByString();
    },
    getAllOrganismsByString() {
      const opt = {
        route: "/desktop/commonUsers/getAllOrganismsByString",
        body: {
          searchString: this.filter,
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage,
          isActive: 1
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        this.userOrganismList = r.data.list
        r.data.count[0] ? this.pagination.rowsNumber = r.data.count[0].count : this.pagination.rowsNumber = 0
      });
    },
    filterOrganisms(nameIndex) {
      const selectedOrganism = this.userOrganismList[nameIndex]
      if (nameIndex >= 0 && nameIndex < this.userOrganismList.length &&
        this.selectFilter !== selectedOrganism.organismConfigName) {
          this.selectFilter = selectedOrganism.organismConfigName 
      } else if(selectedOrganism.organismConfigName === this.userOrganismList[nameIndex].organismConfigName) {
        this.selectFilter = null
      }
      this.getAllOrganismsByString()
    },
  },
});
</script>

<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat
        class="bg-accent"
        title="Pesquisar organismos"
        :columns="columnsData"
        :rows="pageOrganismList"
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
            <div>
              <q-btn
                v-if="verifyBtn === 1"
                icon="person"
                class="q-pa-sm"
                color="primary"
                rounded
                @click="showMyOrganisms"
              >
                Meus organismos
                <q-tooltip
                  transition-show="scale"
                  transition-hide="scale"
                >
                  Exibir todos os organismos
                </q-tooltip>
              </q-btn>
              <q-btn
                v-else
                icon="person"
                rounded
                outline
                class="q-pa-sm"
                color="primary"
                @click="showMyOrganisms"
              >
                Meus organismos
                <q-tooltip
                  transition-show="scale"
                  transition-hide="scale"
                >
                  Exibir os seus organismos
                </q-tooltip>
              </q-btn>
            </div>
            <div class="col">
              <q-select
                outlined
                dense
                debounce="300"
                v-model="selectFilter"
                :options="selectStatus"
                @update:model-value="getAllOrganismsByString"
              ></q-select>
            </div>
            
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
  name: "SearchAllOrganismsList",
  data() {
    return {
      columnsData: useTableColumns().pageOrganismList,
      pageOrganismList:[],
      searchAllOrganismsList: [],
      userOrganismList: [],
      selectStatus: ["Ativos", "Inativos"],
      filter: "",
      selectFilter: "Selecionar",
      pagination: {
        page: 0,
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
    this.getAllOrganismsByString();
    this.getMyOrganismsList();
  },
  methods: {
    clkOpenUserOrganismDetail(e, r) {
      const organismId = r.organismId;
      this.$router.push("/orgs/userOrganismDetail?organismId=" + organismId);
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
      // this.getAllOrganismsByString();
    },
    getAllOrganismsByString() {
      const opt = {
        route: "/desktop/commonUsers/getAllOrganismsByString",
        body: {
          searchString: this.filter,
          page: this.pagination.page,
        },
      };
      if (this.selectFilter === "Ativos") {
        opt.body.isActive = 1;
      } else if (this.selectFilter === "Inativos") {
        opt.body.isActive = 0;
      }
      useFetch(opt).then((r) => {
        this.searchAllOrganismsList = r.data.list;
      });
      this.pageOrganismList = this.userOrganismList
      this.$forceUpdate()
    },
    getMyOrganismsList() {
      const opt = {
        route: "/desktop/commonUsers/getOrganismsByUserId",
        body: {
          filterValue: this.filter,
          page: this.pagination.page,
        },
      };
      if (this.selectFilter === "Ativos") {
        opt.body.isActive = 1;
      } else if (this.selectFilter === "Inativos") {
        opt.body.isActive = 0;
      }
      useFetch(opt).then((r) => {
        this.userOrganismList = r.data.organisms;
        this.pageOrganismList = this.userOrganismList
      });
    },
    showMyOrganisms() {
      if(this.pageOrganismList === this.searchAllOrganismsList) {
        this.pageOrganismList = this.userOrganismList
        this.verifyBtn = 1
      } else {
        this.pageOrganismList = this.searchAllOrganismsList
        this.verifyBtn = 2
      }
    },
    listOfOrganism() {
      this.pageOrganismList = this.userOrganismList
    }
  },
});
</script>

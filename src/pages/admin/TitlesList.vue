<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat
        class="bg-accent"
        title="Títulos"
        :columns="columnsData"
        :rows="titlesList"
        row-key="_id"
        virtual-scroll
        rows-per-page-label="Registros por página"
        no-data-label="Nenhum dado inserido até o momento"
        no-results-label="A pesquisa não retornou nenhum resultado"
        :rows-per-page-options="[10, 20, 30, 50]"
        @row-click="clkOpenTitleDetail"
        :selected-rows-label="getSelectedString"
        :filter="filter"
        v-model:pagination="pagination"
        @request="nextPage"
      >
        <template #top-right>
          <div class="flex row text-right q-gutter-sm items-center">
            <div class="col">
              <q-select
                outlined
                dense
                debounce="300"
                v-model="selectFilter"
                :options="selectStatus"
                @update:model-value="getTitleConfigs"
              ></q-select>
            </div>
            <div class="col">
              <q-input
                @keyup="getTitleConfigs"
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
            <div class="row q-px-sm">
              <q-btn
                v-if="changeBtn === 0"
                @click="replaceTitleList"
                color="primary"
                unelevated
                rounded
                no-caps
                class="q-pa-sm q-mr-sm"
                icon="pending_actions"
                label="Títulos pendentes"
              />
              <q-btn
                v-if="changeBtn === 1"
                @click="replaceTitleList"
                color="primary"
                unelevated
                rounded
                outline
                icon="pending_actions"
                no-caps
                class="q-pa-sm q-mr-sm"
                label="Títulos pendentes"
              />
              <q-btn
                @click="$router.push('/config/createTitleConfig')"
                color="primary"
                unelevated
                rounded
                no-caps
                class="q-pa-sm"
                icon="add"
                label="Novo Título"
              />
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
  name: "TitleConfigurationList",
  data() {
    return {
      changeBtn: 1,
      columnsData: useTableColumns().titleConfigList,
      titlesList: [],
      pendingApprovalList: [],
      selectStatus: ["Ativos", "Inativos"],
      filter: "",
      selectFilter: "Ativos",
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
    this.getTitleConfigs();
    this.showTitleSolicitations();
  },
  methods: {
    replaceTitleList(){
      if(this.titlesList !== this.pendingApprovalList.list && this.columnsData === useTableColumns().titleConfigList) {
        this.changeBtn = 0
        this.columnsData = useTableColumns().approvalList
        this.$q.loading.hide()
        this.titlesList = this.pendingApprovalList.list
      }  else if (this.titlesList === this.pendingApprovalList.list && this.columnsData === useTableColumns().approvalList){
        this.changeBtn = 1
        this.columnsData = useTableColumns().titleConfigList
        this.$q.loading.hide()
        this.getTitleConfigs()
      }
    },
    showTitleSolicitations(){
      const opt = {
        route: '/desktop/adm/getTitlesWaitingApproval',
        body: {
          searchString: this.filter,
          isActive: 1,
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage
        },
      };
      useFetch(opt).then((r)=> {
        if(!r.error){
          this.pendingApprovalList = r.data
        }
        else {
          this.$q.notify("Ocorreu um erro, tente novamente mais tarde")
        }
      })
    },
    clkOpenTitleDetail(e, r) {
      if(this.changeBtn === 1) {
        const _id = r._id;
        this.$router.push("/config/titleConfigDetail?titleId=" + _id);
      } else if (this.changeBtn === 0) {
        const userId = r.user_id
        this.$router.push("/admin/userDetail?userId=" + userId + "&pending=" + 1 )
      }
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
      this.getTitleConfigs();
    },
    getTitleConfigs() {
      const opt = {
        route: "/desktop/config/getTitleConfigsList",
        body: {
          searchString: this.filter,
          isActive: 1,
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage
        },
      };
      if (this.selectFilter === "Ativos") {
        opt.body.isActive = 1;
      } else if (this.selectFilter === "Inativos") {
        opt.body.isActive = 0;
      }
      useFetch(opt).then((r) => {
        this.titlesList = r.data;
      });
    },
  },
});
</script>

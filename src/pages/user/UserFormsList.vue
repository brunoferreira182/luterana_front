<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat
        class="bg-accent"
        title="Usuários"
        :columns="columnsData"
        :rows="formList"
        row-key="_id"
        virtual-scroll
        rows-per-page-label="Registros por página"
        no-data-label="Nenhum dado inserido até o momento"
        no-results-label="A pesquisa não retornou nenhum resultado"
        :rows-per-page-options="[10, 20, 30, 50]"
        :selected-rows-label="getSelectedString"
        :filter="filter"
        v-model:pagination="pagination"
        @request="nextPage"
      >
      <template #top-right>
          <div class="flex row justify-between q-gutter-sm items-center">
            <div class="col">
              <q-input
                @keyup="getFormsByUserId"
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
        <template #body-cell-actionButtons="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              @click="clkOpenFormDetail(props.row)"
              no-caps
              rounded
              dense
              icon="draw"
              unelevated
              color="cyan-8"
            >
              <q-tooltip class="text-body2">
                Clique para preencher este formulário
              </q-tooltip>
            </q-btn>
            <q-btn
              @click="clkMakeFormFilterByRow(props.row)"
              no-caps
              rounded
              dense
              icon="search"
              color="orange-8"
              unelevated
            >
              <q-tooltip class="text-body2">
                Clique para exibir os formulários enviados deste tipo
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>
        <template #body-cell-recurrencyLabel="props">
          <q-td :props="props">
            <q-chip outline v-if="props.row.recurrencyLabel" color="green-8" size="14px">
              {{ props.row.recurrencyLabel }}
            </q-chip>
            <q-chip outline v-if="!props.row.recurrencyLabel" color="red-8" size="14px">
              Sem vigência
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
import utils from "../../boot/utils";
import { useTableColumns } from "stores/tableColumns";

export default defineComponent({
  name: "UserFormsList",
  data() {
    return {
      columnsData: useTableColumns().formList,
      formList: [],
      selectStatus: ["Ativos", "Inativos"],
      filter: "",
      selectFilter: "Selecionar",
      savedForms: false,
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
    this.getFormsByUserId();
  },
  methods: {
    async startView () {
      const permStatus = await utils.getPermissionStatus('USER')
      if (permStatus.data === 'onMaitenance') {
        this.$router.push('/maitenancePage')
        return
      }
      this.getFormsByUserId();
      this.isMobile = useScreenStore().isMobile
    },
    clkMakeFormFilterByRow(row){
      const formId = row._id;
      this.$router.push("/user/userMyFormsList?formId=" + formId);
    },
    clkOpenFormDetail(row) {
      const formId = row._id;
      this.$router.push("/user/userFormDetail?formId=" + formId);
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
      this.getFormsByUserId();
    },
    getSavedFormsByUserId() {
      this.savedForms = true
      const opt = {
        route: "/desktop/commonUsers/getSavedFormsByUserId",
        body: {
          filterValue: this.filter,
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
        this.formList = r.data;
      });
    },
    getFormsByUserId() {
      this.savedForms = false
      const opt = {
        route: "/desktop/commonUsers/getFormsByUserId",
        body: {
          filterValue: this.filter,
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
        this.formList = r.data[0].list;
        this.pagination.rowsNumber = r.data[0].count[0].count
      });
    },
  },
});
</script>
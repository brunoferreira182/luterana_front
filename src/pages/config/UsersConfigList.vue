<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat
        class="bg-accent"
        title="Configurações de usuário"
        :columns="columnsData"
        :rows="usersConfigList"
        row-key="_id"
        virtual-scroll
        rows-per-page-label="Registros por página"
        no-data-label="Nenhum dado inserido até o momento"
        no-results-label="A pesquisa não retornou nenhum resultado"
        :rows-per-page-options="[10, 20, 30, 50]"
        @row-click="clkOpenUserConfigDetail"
        :selected-rows-label="getSelectedString"
        :filter="filter"
        v-model:pagination="pagination"
        @request="nextPage"
      >
        <template v-slot:top-right>
          <div class="flex row q-gutter-sm items-center text-right">
            <div class="col">
              <q-btn
                @click="$router.push('/config/createUserConfig')"
                color="primary"
                unelevated
                no-caps
                label="nova configuração"
                class="text-capitalize"
                rounded
                icon="add"
              />
            </div>
          </div>
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
  name: "UsersConfigList",
  data() {
    return {
      columnsData: useTableColumns().usersConfigList,
      usersConfigList: [],
      selectStatus: ["Ativos", "Inativos"],
      filter: "",
      selectFilter: "Selecionar",
      pagination: {
        page: 0,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: "",
      },
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  // beforeMount() {
  //   this.getOrganismsTypes();
  // },
  methods: {
    clkOpenUserConfigDetail(e, r) {
      const userConfigId = r._id;
      this.$router.push("/config/clkOpenUserConfigDetail?userConfigId=" + userConfigId);
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
      this.getListOfRoles();
    },
    getOrganismsTypes() {
      const opt = {
        route: "/desktop/config/getOrganismsTypes",
        body: {
          searchString: this.filter,
          page: this.pagination.page,
          isActive: 1,
        },
      };
      if (this.selectFilter === "Ativos") {
        opt.body.isActive = 1;
      } else if (this.selectFilter === "Inativos") {
        opt.body.isActive = 0;
      }
      useFetch(opt).then((r) => {
        this.usersConfigList = r.data;
      });
    },
  },
});
</script>

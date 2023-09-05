<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">Minhas estatísticas</div>
        <!-- <div class="col-2 text-center">
          <q-btn
            @click="createOrganism"
            no-caps
            color="primary"
            rounded
            unelevated
            label="Criar organismo"
            />
        </div> -->
      </div>
      <q-separator class="q-mx-md" />
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";

export default defineComponent({
  name: "UserDashboard",
  data() {
    return {
      searchAllOrganismsList: [],
      selectStatus: ["Ativos", "Inativos"],
      filter: "",
      selectFilter: "Selecionar",
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
    this.getAllOrganismsByString();
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
      this.getAllOrganismsByString();
    },
    getAllOrganismsByString() {
      const opt = {
        route: "/desktop/commonUsers/getAllOrganismsByString",
        body: {
          searchString: this.filter,
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
        this.searchAllOrganismsList = r.data.list;
      });
    },
  },
});
</script>

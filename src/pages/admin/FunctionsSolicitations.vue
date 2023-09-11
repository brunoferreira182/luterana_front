<template>
  <q-page-container class="no-padding">
    <q-page>
      
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import { useTableColumns } from "stores/tableColumns";

export default defineComponent({
  name: "TitlesSolicitationsList",
  data() {
    return {
      columnsData: useTableColumns().titlesSolicitationsList,
      functionsList: [],
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
    this.getAllFunctionsSolicitations()
  },
  methods: {
    getAllFunctionsSolicitations() {
      const opt = {
        route: "/desktop/adm/getAllFunctionsSolicitations",
        body: {
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage
        }
      }
      useFetch(opt).then((r) => {
        if(r.error) {
          console.log("Deu erro")
          return
        }
        this.functionsList = r.data
      })
    },
  },
});
</script>

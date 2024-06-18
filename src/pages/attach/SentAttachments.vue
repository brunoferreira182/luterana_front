<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat
        class="bg-accent"
        title="Estruturas"
        :columns="columnsData"
        :rows="attachmentList"
        row-key="_id"
        rows-per-page-label="Registros por página"
        no-data-label="Nenhum dado inserido até o momento"
        no-results-label="A pesquisa não retornou nenhum resultado"
        :rows-per-page-options="[10, 20, 30, 50]"
        @row-click="clkOpenattachmentDetail"
        :selected-rows-label="getSelectedString"
        :filter="filter"
        :v-model:pagination="pagination"
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
                @update:model-value="getattachments"
              ></q-select>
            </div>
            <div class="col">
              <q-input
                @keyup="getattachments"
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
            <div class="col">
              <q-btn
                @click="$router.push('/config/createattachment')"
                color="primary"
                unelevated
                rounded
                no-caps
                class="q-pa-sm"
                icon="add"
              >
                Estrutura
              </q-btn>
            </div>
          </div>
        </template>
        <template #body-cell-subType="props">
          <q-td :props="props">
            <div class="text-caption" v-if="props.row.subType === 'district'">
              Distrito
            </div>
            <div class="text-caption" v-if="props.row.subType === 'Distrito'">
              Distrito
            </div>
            <div class="text-caption" v-if="props.row.subType === 'general'">
              Todos
            </div>
            <div class="text-caption" v-if="props.row.subType === 'pastors'">
              Todos os pastores
            </div>
            <div class="text-caption" v-if="props.row.subType === 'Geral'">
              Todos
            </div>
            <div class="text-caption" v-if="props.row.subType === 'Pastores'">
              Todos os pastores
            </div>
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
  name: "AttachmentsList",
  data() {
    return {
      columnsData: useTableColumns().sentAttachments,
      attachmentList: [],
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
    this.getattachments();
  },
  methods: {
    clkOpenattachmentDetail(e, r) {
      const attachmentId = r._id;
      this.$router.push(
        "/attach/attachmentDetail?attachmentId=" + attachmentId
      );
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
      this.getattachments();
    },
    getattachments() {
      const opt = {
        route: "/desktop/attach/getAttachmentsSentByUser",
        body: {
          searchString: this.filter,
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage,
          isActive: 1,
        },
      };
      if (this.selectFilter === "Ativos") {
        opt.body.isActive = 1;
      } else if (this.selectFilter === "Inativos") {
        opt.body.isActive = 0;
      }
      useFetch(opt).then((r) => {
        this.attachmentList = r.data;
      });
    },
  },
});
</script>

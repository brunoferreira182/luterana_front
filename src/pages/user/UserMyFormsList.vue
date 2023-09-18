<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat
        class="bg-accent"
        title="Formulários enviados"
        :columns="columnsData"
        :rows="formList"
        row-key="_id"
        virtual-scroll
        rows-per-page-label="Registros por página"
        no-data-label="Nenhum dado inserido até o momento"
        no-results-label="A pesquisa não retornou nenhum resultado"
        :rows-per-page-options="[10, 20, 30, 50]"
        @row-click="clkOpenFormDetail"
        :selected-rows-label="getSelectedString"
        :filter="filter"
        :v-model:pagination="pagination"
        @request="nextPage"
      >
        <template #top-right>
          <div class="flex row justify-between q-gutter-sm items-center">
            <div class="col">
              <q-select
                outlined
                dense
                label="Filtro"
                debounce="300"
                v-model="selectFilter"
                :option-value="(item) => item.value"
                :options="selectStatus"
                @update:model-value="getSavedFormsByUserId"
              ></q-select>
            </div>
            <div class="col">
              <q-input
                @keyup="getSavedFormsByUserId"
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
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-chip outline v-if="props.row.status === 'draft'" color="yellow-8" size="14px">
              Rascunho
              <q-icon name="alarm_on" size="xs" class="q-pa-xs"/>
            </q-chip>
            <q-chip outline v-if="props.row.status === 'sent'" color="green-8" size="14px">
              Enviado
              <q-icon name="mark_email_read" size="xs" class="q-pa-sm"/>
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
  name: "UserMyFormsList",
  data() {
    return {
      columnsData: useTableColumns().myFormList,
      formList: [],
      selectStatus: [
        {
          label:  "Enviado", 
          value: 'sent'
        },
        {
          label:  "Rascunho",
          value: 'draft'
        },
        {
          label:  "Todos",
          value: 'all'
        }
      ],
      filter: "",
      selectFilter: "Todos",
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
    this.getSavedFormsByUserId();
  },
  methods: {
    clkOpenFormDetail(e, r,) {
      const savedFormId = r._id;
      this.$router.push("/user/userFormDetail?savedFormId=" + savedFormId);
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
      // this.getSavedFormsByUserId();
    },
    getSavedFormsByUserId() {
      this.savedForms = true
      const opt = {
        route: "/desktop/commonUsers/getSavedFormsByUserId",
        body: {
          filterValue: this.filter,
          formId: this.$route.query.formId,
          page: this.pagination.page,
          formStatus: '',
          rowsPerPage: this.pagination.rowsPerPage
        },
      };
      if (this.selectFilter.value === "draft") {
        opt.body.formStatus = 'draft';
      } else if (this.selectFilter.value === "sent") {
        opt.body.formStatus = 'sent';
      } else if (this.selectFilter.value === "all") {
        opt.body.formStatus = '';
      }
      useFetch(opt).then((r) => {
        this.formList = r.data[0].list;
        this.pagination.rowsNumber = r.data[0].count;
      });
    },
  },
});
</script>

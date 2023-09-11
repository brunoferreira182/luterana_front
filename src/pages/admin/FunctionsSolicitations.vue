<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat
        class="bg-accent"
        title="Todas as solicitações"
        :columns="columnsData"
        :rows="functionsList"
        virtual-scroll
        row-key="_id"
        rows-per-page-label="Registros por página"
        no-data-label="Nenhum dado inserido até o momento"
        no-results-label="A pesquisa não retornou nenhum resultado"
        :rows-per-page-options="[10, 20, 30, 50]"
        :selected-rows-label="getSelectedString"
        @row-click="clkOpenSolicitation"
        :filter="filter"
        :v-model:pagination="pagination"
        @request="nextPage"
      >
        <template #top-right>
          <div class="flex row q-gutter-sm items-center text-right">
            <!-- <div class="col">
              <q-select
                outlined
                dense
                debounce="300"
                v-model="selectFilter"
                :options="selectStatus"
                @update:model-value="getAllFunctionsSolicitations"
              ></q-select>
            </div> -->
            <div class="col">
              <q-input
                @keyup="getAllFunctionsSolicitations"
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
      </q-table>
      <q-dialog v-model="dialogOpenSolicitation.open" @hide="clearDialogSolicitation">
        <q-card style="border-radius: 1rem; width: 600px">
          <q-btn 
            color="red-8"
            flat 
            icon="cancel" 
            @click="dialogOpenSolicitation.open = false"
          >
            <q-tooltip>Fechar</q-tooltip>
          </q-btn>
          <q-card-section align="center">
            <q-splitter
              v-model="splitterModel"
              style="height: 100vh;"
            >
              <template v-slot:before>
                <q-tabs
                  v-model="tab"
                  vertical
                  align="left"
                  class="text-left "
                  no-caps
                  active-bg-color="blue-1"
                  indicator-color="primary"
                  inline-label
                  @update:model-value="addBar = false"
                >
                  <template v-for="(tabs, i) in userData.userDataTabs" :key="i">
                    <q-tab 
                      class="flex-left flex"
                      :name="tabs.tabValue" 
                      :label="tabs.tabLabel" 
                    />
                    <q-separator/>
                  </template>
                </q-tabs>
              </template>
              <template v-slot:after>
                <q-tab-panels 
                  animated 
                  swipeable
                  transition-prev="jump-up"
                  transition-next="jump-up"
                  class="bg-accent"
                  :model-value="tab"
                >
                  <q-tab-panel 
                    v-for="(tabs, tabsIndex) in userData.userDataTabs"
                    :key="tabsIndex"
                    :name="tabs.tabValue" 
                  >
                    <q-list class="text-left text-h6">
                      <q-item>
                        <q-item-section>{{ tabs.tabLabel }}:</q-item-section>
                      </q-item>
                    </q-list>
                    <div
                      v-for="(field, fieldIndex) in tabs.fields"
                      :key="fieldIndex"
                      class="q-my-md"
                    >
                      <div class="row q-gutter-sm justify-left items-left">
                        <div class="col q-mx-lg">
                          <div v-if="
                            field.type.type !== 'boolean'
                            && field.type.type !== 'address'
                            && field.type.type !== 'options'
                            && field.type.type !== 'person'"
                          >
                            <q-input
                              :label="field.label"
                              :hint="field.hint"
                              :mask="field.type.mask"
                              v-model="field.value"
                              outlined
                            >
                            </q-input>
                          </div>

                          <div class="text-right" v-if="field.type.type === 'options'">
                            <q-select
                              outlined
                              :label="field.label"
                              option-label="optionName"
                              emit-value
                              map-options
                              :hint="field.hint"
                              v-model="field.value"
                              :options="field.options"
                            >
                            </q-select>
                          </div>

                          <div
                            v-if="field.type.type === 'address' && (!field.value || field.value.length === 0)"
                            class="text-subtilte1 text-start"
                          >
                            <div class="text-h6">Endereços</div>
                            Nenhum endereço vinculado
                          </div>
                          <div v-if="field.type.type === 'address'">
                            <q-list class="no-margin" v-if="field.value">
                              <q-item
                                v-for="(item, i) in field.value"
                                :key="item + i"
                                style="border-radius: 1rem"
                                class="bg-grey-3 q-ma-sm q-pa-md"
                              >
                                <q-item-section>
                                  <q-item-label class="text-capitalize">
                                    {{ item.street }}, {{ item.number }}
                                  </q-item-label>
                                  <q-item-label caption>
                                    {{ item.district }} - {{ item.city }}
                                  </q-item-label>
                                  <q-item-label caption>
                                    CEP
                                    {{ item.cep }}
                                  </q-item-label>
                                  <q-item-label></q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption class="text-capitalize">
                                    <q-badge>{{ item.type }}</q-badge>
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </div>

                          <q-checkbox
                            v-if="field.type.type === 'boolean'"
                            class="q-pt-lg"
                            readonly
                            :label="field.label"
                            :hint="field.hint"
                            v-model="field.value"
                          />

                          <div v-if="field.type.type === 'person'">
                            <div v-if="field.value && field.value.length > 0">
                              <div class="text-body">{{ field.label }}</div>
                              <q-list class="no-margin">
                                <q-item
                                  v-for="(item, i) in field.value"
                                  :key="item + i"
                                  style="border-radius: 1rem"
                                  class="bg-grey-3 q-ma-sm q-pa-md"
                                >
                                  <q-item-section>
                                    <q-item-label class="text-capitalize">
                                      {{ item.userName }}
                                    </q-item-label>
                                    <q-item-label caption>
                                      {{ item.email }}
                                    </q-item-label>
                                  </q-item-section>
                                </q-item>
                              </q-list>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </template>
            </q-splitter>
          </q-card-section>
        </q-card>
      </q-dialog>
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
      columnsData: useTableColumns().allFunctionsSolicitations,
      splitterModel: 25,
      tab: "",
      functionsList: [],
      selectStatus: ["Ativos", "Inativos"],
      filter: "",
      selectFilter: "Selecionar",
      dialogOpenSolicitation: {
        open: false,
        data: {},
      },
      userData: [],
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
    this.getUsersConfig()
    this.getAllFunctionsSolicitations()
  },
  methods: {
    getUsersConfig() {
      const opt = {
        route: "/desktop/adm/getUsersConfig",
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente");
        } else {
          this.userData = r.data
          this.tab = r.data.userDataTabs[0].tabValue
        }
      });
    },
    clearDialogSolicitation(){
      this.dialogOpenSolicitation.open = false
      this.dialogOpenSolicitation.data = {}
    },
    clkOpenSolicitation(e, r){
      this.dialogOpenSolicitation.data = r
      this.dialogOpenSolicitation.open = true
      this.getUserDetailById()
    },
    getSelectedString() {
      return this.selected.length === 0
        ? ""
        : `${this.selected.length}
      despesa${this.selected.length > 1 ? "s" : ""}
      selecionadas de ${this.expensesData.length}`;
    },
    getUserDetailById() {
      const opt = {
        route: "/desktop/adm/getUserDetailById",
        body: {
          _id: this.dialogOpenSolicitation.data.userId,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if(r.error) {
          console.log("Ocorreu um erro, tente novamente kakak")
          return
        }
        this.userDetail = r.data
        this.mountUserData()
      });
    },
    mountUserData () {
      this.userData.userDataTabs.forEach((configTab, iConfigTab) => {
        configTab.fields.forEach((configField, iConfigField) => {
          this.userDetail.userDataTabs.forEach((userTab) => {
            userTab.fields.forEach((userField) => {
              if (configField.model === userField.model && userField.value) {
                this.userData.userDataTabs[iConfigTab].fields[iConfigField].value = userField.value
              }
            })
          })
        })
      })
    },
    nextPage(e) {
      this.pagination.page = e.pagination.page;
      this.pagination.sortBy = e.pagination.sortBy;
      this.pagination.descending = e.pagination.descending;
      this.pagination.rowsPerPage = e.pagination.rowsPerPage;
      this.getAllFunctionsSolicitations();
    },
    getAllFunctionsSolicitations() {
      const opt = {
        route: "/desktop/adm/getAllFunctionsSolicitations",
        body: {
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage,
          searchString: this.filter,
          sortBy: this.pagination.sortBy,
        }
      }
      useFetch(opt).then((r) => {
        if(r.error) {
          console.log("Ocorreu um erro, tente novamente")
          return
        }
        this.functionsList = r.data.list
        this.pagination.rowsNumber = r.data.count[0].count
      })
    },
  },
});
</script>

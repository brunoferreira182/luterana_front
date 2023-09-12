<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col text-h5 text-capitalize">
          Lista de solicitações
        </div>
      </div>
      <q-separator/>
      <q-splitter
        v-model="splitterModel"
        style="height: 100vh;"
        v-show="visionSelected === 'recived'"
      >
        <template v-slot:before>
          <q-tabs
            v-model="tab"
            vertical
            align="left"
            class="text-left flex-center"
            no-caps
            active-bg-color="blue-1"
            indicator-color="primary"
            inline-label
            @update:model-value="addBar = false"
          >
              <q-tab 
                class="flex-left flex"
                name="Recebidas"
                label="Recebidas"
              />
              <q-separator/>
              <q-tab 
                class="flex-left flex"
                name="Enviadas"
                label="Enviadas"
              />
              <q-separator/>
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
            <q-tab-panel name="Recebidas">
              <q-table
                flat
                class="bg-accent"
                title="Recebidas"
                :columns="columnsData"
                :rows="recivedSolicitations"
                virtual-scroll
                row-key="_id"
                rows-per-page-label="Registros por página"
                no-data-label="Nenhum dado inserido até o momento"
                no-results-label="A pesquisa não retornou nenhum resultado"
                :rows-per-page-options="[10, 20, 30, 50]"
                @row-click="clkOpenSolicitation"
                :selected-rows-label="getSelectedString"
                :filter="filter"
                :v-model:pagination="pagination"
                @request="nextPage"
              >
                <template #top-right>
                  <div class="flex row q-gutter-sm items-center text-right">
                    <div class="col">
                      <q-select
                        outlined
                        dense
                        debounce="300"
                        v-model="selectFilter"
                        :options="selectStatus"
                        @update:model-value="getFunctionsSolicitationsByUserId"
                      ></q-select>
                    </div>
                    <div class="col">
                      <q-input
                        @keyup="getFunctionsSolicitationsByUserId"
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
                      v-if="props.row.status && props.row.status.status === 'accepted'"
                      color="green-8"
                      size="14px"
                    >
                      Aceito
                    </q-chip>
                    <q-chip
                      outline
                      v-else-if="!props.row.status"
                      color="yellow-8"
                      size="14px"
                    >
                      Aguardando
                    </q-chip>
                    <q-chip
                      outline
                      v-else-if="props.row.status && props.row.status.status === 'refused'"
                      color="red-8"
                      size="14px"
                    >
                      Recusado
                    </q-chip>
                  </q-td>
                </template>
              </q-table>
            </q-tab-panel>
            <q-tab-panel name="Enviadas">
              <q-table
                flat
                class="bg-accent"
                title="Enviadas"
                :columns="columnsData"
                :rows="sendedSolicitations"
                virtual-scroll
                row-key="_id"
                rows-per-page-label="Registros por página"
                no-data-label="Nenhum dado inserido até o momento"
                no-results-label="A pesquisa não retornou nenhum resultado"
                :rows-per-page-options="[10, 20, 30, 50]"
                @row-click="clkOpenSolicitation"
                :selected-rows-label="getSelectedString"
                :filter="filter"
                :v-model:pagination="pagination"
                @request="nextPage"
              >
                <template #top-right>
                  <div class="flex row q-gutter-sm items-center text-right">
                    <div class="col">
                      <q-select
                        outlined
                        dense
                        debounce="300"
                        v-model="selectFilter"
                        :options="selectStatus"
                        @update:model-value="getFunctionsSolicitationsByUserId"
                      ></q-select>
                    </div>
                    <div class="col">
                      <q-input
                        @keyup="getFunctionsSolicitationsByUserId"
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
                      v-if="props.row.status && props.row.status.status === 'accepted'"
                      color="green-8"
                      size="14px"
                    >
                      Aceito
                    </q-chip>
                    <q-chip
                      outline
                      v-else-if="!props.row.status"
                      color="yellow-8"
                      size="14px"
                    >
                      Aguardando
                    </q-chip>
                    <q-chip
                      outline
                      v-else-if="props.row.status && props.row.status.status === 'refused'"
                      color="red-8"
                      size="14px"
                    >
                      Recusado
                    </q-chip>
                  </q-td>
                </template>
              </q-table>
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
      <q-dialog v-model="dialogOpenSolicitation.open" @hide="clearDialogSolicitation">
        <q-card style="border-radius: 1rem; width: 400px; padding: 10px">
          <div class="text-center" v-if="hideDiv">
            <img :src="gif" />
          </div>
          <div class="fade" v-if="!hideDiv">
            <q-card-section align="center">
              <div class="text-h6">
                Deseja confirmar sua participação? 
              </div>
              <div class="subtitle2 text-left">
                Organismo: {{ dialogOpenSolicitation.data.organismName }}
              </div>
              <div class="subtitle2 text-left">
                Função: {{ dialogOpenSolicitation.data.functionName }}
              </div>
              
            </q-card-section>
            <q-card-actions align="center">
              <q-btn
                flat
                label="Recusar"
                no-caps
                rounded
                color="primary"
                @click="refuseFunctionSolicitation"
              />
              <q-btn
                unelevated
                rounded
                label="Confirmar"
                no-caps
                color="primary"
                @click="acceptFunctionSolicitation"
              />
            </q-card-actions>
          </div>
        </q-card>
      </q-dialog>
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import gif from 'assets/gif.gif'
import { useTableColumns } from "stores/tableColumns";

export default defineComponent({
  name: "UserSolicitationsList",
  data() {
    return {
      tab: "Recebidas",
      columnsData: useTableColumns().recivedSolicitations,
      recivedSolicitations: [],
      sendedSolicitations:[],
      selectStatus: ["Ativos", "Inativos"],
      filter: "",
      selectFilter: "Selecionar",
      gif,
      disableRow: false,
      dialogOpenSolicitation: {
        open: false,
        data: {},
      },
      myUserIdMongo: '',
      hideDiv: false,
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: "",
      },
      splitterModel: 25,
      visionSelected: 'recived',
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getUserIdMongo()
    this.getFunctionsSolicitationsByUserId();
  },
  methods: {
    getUserIdMongo() {
      const opt = {
        route: '/desktop/adm/getUserIdMongo',
      }
      useFetch(opt).then(r => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro");
          return
        } else { this.myUserIdMongo = r.data.userIdMongo }
      })
    },
    clearDialogSolicitation(){
      this.dialogOpenSolicitation.open = false
      this.hideDiv = false
    },
    refuseFunctionSolicitation(){
      const opt = {
        route: "/desktop/commonUsers/refuseFunctionSolicitation",
        body: {
          functionSolicitationId: this.dialogOpenSolicitation.data._id,
          organismId: this.dialogOpenSolicitation.data.organismId,
        },
      };
      useFetch(opt).then((r) => {
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente por favor')
          return
        }else{ 
          this.$q.notify('Convite recusado!')
          this.dialogOpenSolicitation.open = false
          this.getFunctionsSolicitationsByUserId()
        }
      })
    },
    acceptFunctionSolicitation(){
      const opt = {
        route: "/desktop/commonUsers/acceptFunctionSolicitation",
        body: {
          functionSolicitationId: this.dialogOpenSolicitation.data._id,
          functionId: this.dialogOpenSolicitation.data.organismFunctionConfigId,
          organismId: this.dialogOpenSolicitation.data.organismId,
        },
      };
      useFetch(opt).then((r) => {
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente por favor')
          return
        }
        this.hideDiv = true;
        setTimeout(() => {
          this.hideDiv = false;
          this.dialogOpenSolicitation.open = false
          this.getFunctionsSolicitationsByUserId()
        }, 3800);
      })
    },
    clkOpenSolicitation(e, r){
      switch(!r.status || r.status.status){
        case 'accepted':
          this.$q.notify('O convite já foi aceito')
        break
        case 'refused':
          this.$q.notify('O convite foi recusado')
        break;
        case !r.status:
          this.dialogOpenSolicitation.data = r
          this.dialogOpenSolicitation.open = true
        break
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
      this.getFunctionsSolicitationsByUserId();
    },
    getFunctionsSolicitationsByUserId() {
      const opt = {
        route: "/desktop/commonUsers/getFunctionsSolicitationsByUserId",
        body: {
          searchString: this.filter,
          page: this.pagination.page,
          isActive: 1,
          rowsPerPage: this.pagination.rowsPerPage,
        },
      };
      if (this.selectFilter === "Ativos") {
        opt.body.isActive = 1;
      } else if (this.selectFilter === "Inativos") {
        opt.body.isActive = 0;
      }
      useFetch(opt).then((r) => {
        this.recivedSolicitations = r.data.recivedSolicitations.list
        this.sendedSolicitations = r.data.sendedSolicitations.list
      });
    },
  },
});
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active no <2.1.8 */ {
  opacity: 0;
}
.disabled-row{
  pointer-events: none;
  opacity: 0.5;
}
.flex-center{
  justify-content: flex-start;
}
</style>

<template>
  <q-page-container class="no-padding">
    <q-page>
      <!-- <q-table
        flat
        class="bg-accent"
        title="Minha rede"
        :columns="isMobile ? columnsDataMobile : columnsData"
        :rows="userOrganismList"
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
        :visible-columns="collumns"
        @request="nextPage"
      >
        <template #body-cell-city="props">
          <q-td :props="props">
            <div class="text-bold" v-if="props.row.endereco">{{ props.row.endereco[0].city }}</div>
            <div class="text-caption" v-else-if="!props.row.endereco">Não consta</div>
          </q-td>
        </template>
        <template #body-cell-organismParentName="props">
          <q-td :props="props">
            <q-chip outline v-if="props.row.organismParentName" color="green" size="14px">
              {{ props.row.organismParentName }}
            </q-chip>
            <q-chip outline v-if="!props.row.organismParentName" color="red" size="14px">
              Nenhum
            </q-chip>
          </q-td>
        </template>
        <template #body-cell-organismConfigName="props">
          <q-td :props="props">
            <q-chip 
              v-if="props.row.organismConfigName" 
              :style="{ color: props.row.organismStyle }" 
              size="14px"
              outline
            >
              {{ props.row.organismConfigName.split(' ')[0] }}
            </q-chip>
          </q-td>
        </template>
        <template #body-cell-endereco="props">
          <q-td :props="props">
          </q-td>
        </template>
      </q-table> -->
      <div class="q-pa-md" >
        <q-list class="rounded-borders">
          <div class="text-h6 q-px-sm text-bold">
            Minha Rede
          </div>
          <div v-if="isMobile" class="q-px-sm">
            Clique no ícone <q-icon name="east"></q-icon> para acessar o organismo
          </div>
          <div 
            v-for="org in userOrganismList"
            :key="org"
            class="row q-py-md"
          >
            <q-expansion-item
              :class="`shadow-2 overflow-hidden ${!isMobile ? 'col-11' : 'col-10'}`"
              style="border-radius: 10px"
              default-opened
              expand-separator 
            >
              <template v-slot:header>
                <q-item-section
                  thumbnail
                  :class="`bg-${org.color} text-white q-px-sm`"
                  style="margin-block: -8px"
                >
                  <q-item-label>teste out 2</q-item-label>
                </q-item-section>
                <q-item-section class="q-pl-sm">
                  <q-item-label>
                    <span class="text-weight-bold">{{ org.nome }}</span>
                    <div class="text-caption">
                      {{ org.organismConfigName }}
                    </div>
                  </q-item-label>
                </q-item-section>
                <!-- <q-item-section>
                  <q-item-label>
                    <span class="text-weight-bold">{{ org.nome }}</span>
                  </q-item-label>
                </q-item-section> -->
              </template>
              <q-card>
                <q-card-section>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti
                  commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste
                  eveniet doloribus ullam aliquid.
                </q-card-section>
              </q-card>
            </q-expansion-item> 
            <div :class="`q-px-sm ${!isMobile ? 'col-1' : 'col-2'}`">
              <q-btn 
                flat
                rounded
                @click="clkOpenUserOrganismDetail(org)"
                icon="east"
              >
                <q-tooltip>
                  Ir para organismo
                </q-tooltip>
              </q-btn>
            </div>
          </div>
        </q-list>
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import { useTableColumns } from "stores/tableColumns";
import { useScreenStore } from "stores/checkIsMobile";

export default defineComponent({
  name: "OrganismsList",
  data() {
    return {
      columnsData: useTableColumns().userOrganismList,
      columnsDataMobile: useTableColumns().userOrganismListMobile,
      isMobile: false,
      searchAllOrganismsList: [],
      collumns: ['nome', 'organismConfigName', 'organismParentName', 'city'],
      userOrganismList: [],
      selectStatus: ["Ativos", "Inativos"],
      colors:[
        { name: 'red-8' },
        { name: 'pink-8' },
        { name: 'purple-8' },
        { name: 'deep-purple-8' },
        { name: 'indigo-8' },
        { name: 'blue-8' },
        { name: 'light-blue-8' },
        { name: 'cyan-8' },
        { name: 'teal-8' },
        { name: 'green-8' },
        { name: 'light-green-8' },
        { name: 'lime-8' },
        { name: 'yellow-8' },
        { name: 'amber-8' },
        { name: 'orange-8' },
        { name: 'deep-orange-8' },
        { name: 'brown-8' },
        { name: 'grey-8' },
        { name: 'blue-grey-8' }
      ],
      filter: "",
      selectFilter: "Selecionar",
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: "",
      },
      verifyBtn: 1
    };
  },
  beforeMount() {
    this.isMobile = useScreenStore().isMobile
    this.getAllOrganismsByString();
  },
  methods: {
    clkOpenUserOrganismDetail(org) {
      const organismId = org.organismId;
      this.$router.push("/user/userOrganismDetail?organismId=" + organismId);
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
          rowsPerPage: this.pagination.rowsPerPage,
          isActive: 1
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        this.userOrganismList = r.data.list
        r.data.count[0] ? this.pagination.rowsNumber = r.data.count[0].count : this.pagination.rowsNumber = 0
        this.userOrganismList.forEach((item)=>{
          item.color = this.getRandomColor()
        })
      });
    },
    getRandomColor() {
      const randomIndex = Math.floor(Math.random() * this.colors.length);
      return this.colors[randomIndex].name;
    },
    filterOrganisms(nameIndex) {
      const selectedOrganism = this.userOrganismList[nameIndex]
      if (nameIndex >= 0 && nameIndex < this.userOrganismList.length &&
        this.selectFilter !== selectedOrganism.organismConfigName) {
          this.selectFilter = selectedOrganism.organismConfigName 
      } else if(selectedOrganism.organismConfigName === this.userOrganismList[nameIndex].organismConfigName) {
        this.selectFilter = null
      }
      this.getAllOrganismsByString()
    },
  },
});
</script>

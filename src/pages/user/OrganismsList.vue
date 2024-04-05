<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="text-center q-mt-md text-weight-bold">Minha rede</div>
      <div class="q-pa-md">
        <q-tree
          default-expand-all
          :nodes="organismListTree"
          node-key="label"
          ref="tree"
        >
          <template v-slot:default-header="prop">
            <div class=" items-center" v-if="prop.node.header">
              <!-- <q-icon
                v-if="prop.node.type === 'Congregação'"
                name="church"
                color="blue"
                size="28px"
                class=""
              />
              <q-icon
                name="workspaces"
                color="orange"
                size="28px"
                class="q-mr-sm"
                v-if="prop.node.type === 'Paróquia'"
              /> -->
              <span class="text-weight-bold text-primary">{{ prop.node.label}}</span>
              <q-btn
                icon="navigate_next"
                round
                unelevated
                color="primary"
                flat
                v-on:click.stop="clkParent(prop.node.organismId)"
              >
                <q-tooltip>Entrar no detalhe do(a) {{ prop.node.type }}</q-tooltip>
              </q-btn>
            </div>
            <div class="items-center" v-else>
              <q-icon
                v-if="prop.node.type === 'Congregação'"
                name="church"
                color="blue"
                size="20px"
                class="q-mr-sm"
              />
              <q-icon
                v-if="prop.node.type === 'Paróquia'"
                name="workspaces"
                color="blue"
                size="20px"
                class="q-mr-sm"
              />
              <span
                class="cursor-pointer"
                @click="$router.push('/user/userOrganismDetail?organismId=' + prop.node.organismId)"
              >{{ prop.node.label }}</span>
            </div>
          </template>
        </q-tree>
      </div>
      
      <!-- <div class="q-pa-md" >
        <q-list class="rounded-borders">
          <div class="text-h6 q-px-sm text-bold">
            Minha Rede
          </div>
          <div class="q-px-sm">
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
                  :style="{ 'margin-block': '-8px', 'width': isMobile ? '86px' : '106px' }"
                >
                  <q-item-label>
                    <div class="text-caption">
                      {{ org.organismParentLocal }}
                    </div>
                  </q-item-label>
                </q-item-section>
                <q-item-section 
                  class="q-pl-sm text-capitalize text-weight-bold"
                >
                  <q-item-label>
                    <span>{{ org.organismParentName }}</span>
                  </q-item-label>
                </q-item-section>
              </template>
              <q-card>
                <q-separator></q-separator>
                <q-card-section  class="no-padding">
                  <q-list separator v-if="org.childrenData && org.childrenData.length">
                    <q-item
                      v-for="item in org.childrenData"
                      :key="item"
                    >
                      <q-item-section align="left" class="text-wrap">
                        <q-item-label style="font-size: 18px;">
                          {{ item.organismChildName }}
                        </q-item-label>
                        <div>
                          <q-chip outline>
                            {{ item.organismChildConfig }}
                          </q-chip>
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
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
      </div> -->
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import { useTableColumns } from "stores/tableColumns";
import { useScreenStore } from "stores/checkIsMobile";
// import utils from '../../boot/utils'

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
      verifyBtn: 1,
      organismListTree: []
    };
  },
  beforeMount() {
    this.startView()
  },
  methods: {
    async startView () {
      // const permStatus = await utils.getPermissionStatus('USER')
      // if (permStatus.data === 'onMaitenance') {
      //   this.$router.push('/maitenancePage')
      //   return
      // }
      this.getMyOrganisms();
      this.isMobile = useScreenStore().isMobile
    },
    clkParent (organismParentId) {
      this.$router.push("/user/userOrganismDetail?organismId=" + organismParentId);
    },
    clkOpenUserOrganismDetail(org) {
      const organismParentId = org.organismParentId;
      this.$router.push("/user/userOrganismDetail?organismId=" + organismParentId);
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
      this.getMyOrganisms();
    },
    getMyOrganisms() {
      const opt = {
        route: "/desktop/commonUsers/getMyOrganisms",
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

        this.mountTree(r.data.list)
        
      });
    },
    mountTree (list) {
      let tree = []
      list.forEach(org => {
        tree = {
          type: org.organismParentLocal,
          label: org.organismParentLocal + ' ' + org.organismParentName,
          header: 'generic',
          organismId: org.organismParentId,
          children: []
        }
        org.childrenData.forEach(child => {
          tree.children.push({
            type: child.organismChildConfig,
            label: child.organismChildName,
            body: 'normal',
            organismId: child.organismChildId
          })
        })
        this.organismListTree.push(tree)
        this.$refs.tree.expandAll()
      })
    },
    getRandomColor() {
      if (!this.assignedColors) {
        this.assignedColors = new Set();
      }
      let randomIndex;

      do {
        randomIndex = Math.floor(Math.random() * this.colors.length);
      } while (this.assignedColors.has(this.colors[randomIndex].name));

      this.assignedColors.add(this.colors[randomIndex].name);
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
      this.getMyOrganisms()
    },
  },
});
</script>

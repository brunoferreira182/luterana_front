<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="text-h5 ">
        Este bloco é dedicado às congregações e paróquias.
      </div>
      <div>
        - Para correções, clique na canetinha ao lado da informação;
      </div>
      <div>
        - Caso não deseje concluir a seção no momento, salve as alterações no botão 'Salvar' Rascunho;
      </div>
      <div>
        - Ao terminar a conferência, clique em 'Seguir' para prosseguir.
      </div>
      <q-tree
        default-expand-all
        :nodes="organismListTree"
        node-key="label"
        ref="tree"
        no-transition
      >
        <template v-slot:default-header="prop">
          <div class=" items-center" v-if="prop.node.header">
            <span class="text-weight-bold text-primary">
              {{ prop.node.label }}
            </span>
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
            <div v-if="prop.node.type === 'Congregação'">
              Data de fundação: {{ prop.node.fundationDate ? prop.node.fundationDate : 'não informado' }}
              <div>
                Filiada: {{ prop.node.isFiliated ? prop.node.isFiliated : 'não informado' }}
              </div>
              <div>
                É sede: {{ prop.node.isHeadOffice ? prop.node.isHeadOffice : 'não informado' }}
              </div>
            </div>
            <div v-if="prop.node.type === 'Paróquia'">
              A paróquia tem secretário(a) contratado? 
              <q-checkbox
                class="q-pt-lg"
                v-model="hasSecretary"
                label="Sim"
              />
              <q-checkbox
                class="q-pt-lg"
                v-model="hasSecretary"
                label="Não"
              />
            </div>
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
            >{{ prop.node.label }}
            </span>
            <div v-if="prop.node.type === 'Congregação'">
              Data de fundação: {{ prop.node.fundationDate ? prop.node.fundationDate : 'não informado' }}
              <div>
                Filiada: {{ prop.node.isFiliated ? prop.node.isFiliated : 'não informado' }}
              </div>
              <div>
                É sede: {{ prop.node.isHeadOffice ? prop.node.isHeadOffice : 'não informado' }}
              </div>
            </div>
          </div>
        </template>
      </q-tree>
    </q-page>
  </q-page-container>
</template>
<script>
import useFetch from "src/boot/useFetch";
import utils from "../../boot/utils";
import { defineComponent } from "vue";
export default defineComponent({
  name:"WriteCongregationalStatisticData",
  data() {
    return {
      filter: '',
      pagination: {
        sortBy: '',
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: 'desc',
        descending: false,
        searchString: ''
      },
    }
  },

  beforeMount() {
    this.getMyOrganismsWithAllData()
    // this.verifyIfIsPastor()
  },
  methods: {
    getMyOrganismsWithAllData() {
      const opt = {
        route: "/desktop/statistics/getMyOrganismsWithAllData",
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
        r.data.count[0] ? this.pagination.rowsNumber = r.data.count[0].count : this.pagination.rowsNumber = 0
        this.mountTree(r.data.list)
      });
    },
    mountTree (list) {
      let tree = []
      list.forEach(org => {
        tree = {
          type: org.organismParentLocal,
          label: org.organismParentLocal + ' ' + org.organismParentName,
          fundationDate: org.parentData.organismParentFundationDate,
          isFiliated: org.parentData.isFiliated,
          isHeadOffice: org.parentData.isHeadOffice,
          header: 'generic',
          organismId: org.organismParentId,
          children: []
        }
        org.childrenData.forEach(child => {
          tree.children.push({
            type: child.organismChildConfig,
            label: child.organismChildConfig + ' ' + child.organismChildName,
            body: 'normal',
            organismId: child.organismChildId
          })
        })
        this.organismListTree.push(tree)
      })
    },
    verifyIfIsPastor() {
      const userInfo = utils.presentUserInfo()
      if (userInfo.userType === 'pastor') {
        this.isUser = false
        this.getPastorDataTabs()
      } else {
        this.isUser = true
      }
    },
  }
})
</script>
<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="text-h5 ">
        Composição
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
      <q-item
        v-if="composition"
        style="border-radius: 1rem;"
        class="bg-grey-2 q-ma-sm"
      >
        <q-item-section>
          <div class="text-h6 text-left">
            Paróquia: <strong>{{ composition.organismParentName }}</strong>
          </div>
          <div class="q-mt-sm text-left">
            Congregações:
          </div>
          <q-item-label 
            class="bg-white q-mt-sm text-center"
            style="border-radius: .7rem;"
            v-for="org in composition.congregations"
            :key="org"
          > 
            <div>
              <strong>{{ org.organismChildName }}</strong>
            </div>
            <div class="q-mt-sm bg-grey-2 q-ma-sm" style="border-radius: .5rem;">
              <div class="text-left q-ma-sm">
                Funções:
              </div>
              <div 
                class="text-left q-ml-lg"
                v-for="func in org.organismFunctions" 
                :key="func"
              >
                <strong>{{ func.functionName }}</strong>
                <div
                  v-for="user in func.functionUsers"
                  :key="user"
                  class="q-ml-sm q-pa-sm"
                >
                  {{ user.userName }}
                </div>
              </div>
            </div>
            <div class="q-mt-sm bg-grey-2 q-ma-sm" style="border-radius: .5rem;">
              <div class="text-left q-ma-sm">
                <strong>Departamentos:</strong>
              </div>
              <div
                class="text-left q-ma-sm q-pa-sm q-ml-md bg-white"
                style="border-radius: .3rem;"
                v-for="dep in org.departaments"
                :key="dep"
              >
                {{ dep.departamentName }}
                <div>
                  <div class="q-ml-sm">
                    Funções:
                  </div>
                  <div 
                    v-for="func in dep.organismFunctions"
                    :key="func"
                  >
                    <div class="q-ml-lg">
                      {{ func.functionName }}:
                      <div 
                        class="q-ml-lg"
                        v-for="user in func.functionUsers"
                        :key="user"
                      >
                        {{ user.userName }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>
      <!-- <q-tree
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
              @click.stop="clkParent(prop.node.organismId)"
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
      </q-tree> -->
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
      composition: null
    }
  },

  beforeMount() {
    // this.getMyOrganismsWithAllData()
    this.getCompositionByUserId()
    // this.verifyIfIsPastor()
  },
  methods: {
    getCompositionByUserId() {
      const opt = {
        route: '/desktop/statistics/getCompositionByUserId'
      }
      useFetch(opt).then((r) => {
        if (r.error) return 
        this.composition = r.data
      })
    },
    getMyOrganismsWithAllData() {
      const opt = {
        route: "/desktop/statistics/getMyOrganismsWithAllData",
        body: {
          organismId: this.$route.query.organismId,
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage,
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        this.composition = r.data[0]
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
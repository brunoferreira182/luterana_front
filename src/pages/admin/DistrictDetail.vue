<template>
  <q-page-container class="no-padding">
    <q-page v-if="organismListTree">
      <div class="text-center q-mt-md">
        <div class="col text-capitalize"> 
          <div class="text-h4">Distrito {{ organismName }}</div>
          <q-chip
            :style="{background: organismConfigStyle}"
            text-color="white"
          >
            {{ numOfParishs }} Paróquias | {{numOfCongregations}} Congregaçoes | {{ numOfMissionPoints }} Pontos de Missão | {{numOfPastor}} Pastores
          </q-chip>
        </div>
      </div>
      <div class="q-pa-sm q-ma-lg">
        <div class="text-h6">Composição:</div>
        <q-tree
          class="q-ml-sm"
          default-expand-all
          :nodes="organismListTree"
          node-key="label"
          ref="tree"
        >
          <template v-slot:default-header="prop">
            <div class=" items-center" v-if="prop.node.header">
              <span class="text-weight-bold">{{ prop.node.label }}</span>
              <q-btn
                icon="navigate_next"
                round
                unelevated
                color="primary"
                flat
                v-on:click.stop="clkParent(prop.node.organismId)"
              >
                <q-tooltip>Abrir informações sobre a paróquia {{ prop.node.type }}</q-tooltip>
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
      <q-separator class="q-my-sm q-mx-lg"/>
      <div v-if="functions" class="q-ma-lg">
        <div class="text-h6">
          Funções distritais:
        </div>
        <div class="q-ml-sm">
          <q-tree
            class="q-ml-sm"
            :nodes="functionsListTree"
            node-key="label"
            ref="tree"
          >
          </q-tree>
        </div>
      </div>
      <q-dialog
        v-model="dialogParishDetail.open"
      >
        <q-card
          style="width: 500px;"
        >
          <q-card-section class="text-h6 text-center">
            {{ this.dialogParishDetail.data.organismConfigName + ' - ' + this.dialogParishDetail.data.childName }}
          </q-card-section>
          <q-separator class="q-mx-md"/>
          <q-card-section>
            <div class="text-h6 q-ma-sm">
              Funções:
            </div>
            <div class="q-ml-md">
              <div>
                <strong>{{ this.dialogParishDetail.data.functions.functionName }}:</strong>
                <q-btn
                  color="primary"
                  icon="add"
                  rounded
                  unelevated
                  class="q-pa-sm"
                  flat
                />
              </div>
              <div 
                class="q-ml-sm q-my-sm"
                v-for="user in this.dialogParishDetail.data.functions.users"
                :key="user"
              >
                {{ user.userName }}
                <q-btn
                  color="red"
                  flat
                  unelevated
                  rounded
                  icon="delete"
                  />
              </div>
            </div>
          </q-card-section>
        </q-card>
    </q-dialog>
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: "DistrictDetail",
  data() {
    return {
      parentOrganismId: null,
      organismConfigId: null,
      organismName: null,
      organismConfigStyle: null,
      organismData: {
        fields: null
      },
      organismConfigName: null,
      functions: null,
      organismParentData: null,
      organismChildData: null,
      parentData: null,
      idLegado: null,
      congregacaoSedeAddress: null,
      organismListTree: [],
      functionsListTree: [],
      numOfParishs: null,
      numOfCongregations: 0,
      numOfMissionPoints: 0,
      numOfPastor: 0,
      dialogParishDetail: {
        open: false,
        data: null
      }
    }
  },
  beforeMount() {
    this.getOrganismDetailById()
  },
  methods: {
    clkParent(id) {
      this.organismChildData.forEach((parish) => {
        if (parish.childId === id) {
          this.dialogParishDetail.data = parish
        }
      })
      this.dialogParishDetail.open = true
    },
    mountTreeFunctions() {
      let tree = []
      this.functions.forEach((func) => {
        tree = {
          type: func.group,
          label: func.functionName,
          header: 'generic',
          functionId: func.functionId,
          children: []
        }
        func.users.forEach((user) => {
          tree.children.push({
            type: 'user',
            label: user.userName,
            header: 'normal',
            userId: user.userId,
          })
        })
        this.functionsListTree.push(tree)
      })
    },
    mountTree() {
      let tree = []
      this.organismChildData.forEach((parish) => {
        tree = {
          type: parish.organismConfigName,
          label: parish.organismConfigName + ' ' + parish.childName,
          header: 'generic',
          organismId: parish.childId,
          children: []
        }
        parish.organismChildData.forEach((congregation, iCongregation) => {
          this.numOfCongregations++
          tree.children.push({
            type: congregation.organismConfigName,
            label: congregation.organismConfigName + ' ' + congregation.childName,
            body: 'normal',
            organismId: congregation.childId,
            children: []
          })
          congregation.organismChildData.forEach((dept) => {
            if (dept) {
              tree.children[iCongregation].children.push({
                type: dept.organismChildConfig.organismConfigName,
                label: dept.organismChildConfig.organismConfigName + ' ' + dept.organismChildData.childName,
                body: 'normal',
                organismId: dept._id
              })
            }
            if (dept && dept.organismChildConfig && dept.organismChildConfig.organismConfigName === 'Ponto de Missão') {
              this.numOfMissionPoints++
            }
          })
        })
        this.organismListTree.push(tree)
      })

    },
    getOrganismDetailById() {
      const organismId = this.$route.query.organismId
      const opt = {
        route: "/desktop/adm/getDistrictDetail",
        body: {
          organismId: organismId,
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.parentOrganismId = r.data.organismData.organismParentId
          this.organismConfigId = r.data.organismData.organismConfigId
          this.organismName = r.data.organismData.organismName
          this.organismConfigStyle = r.data.organismData.organismConfigStyle
          this.organismData.fields = r.data.organismData.fields
          this.organismConfigName = r.data.organismData.organismConfigName
          this.functions = r.data.functions
          this.organismParentData = r.data.relations.parent
          this.organismChildData = r.data.relations.child
          if (this.organismConfigName === 'Paróquia') {
            if (this.organismChildData.length === 1) {
              this.$router.push('/admin/organismDetail?organismId=' + this.organismChildData[0].childId)
            }
          }
          this.parentData = r.data.parentData
          this.idLegado = r.data.idLegado
          for(let i = 0; r.data.relations.length > i; i++) {
            if(r.data.relations[i].organismRelationIsMain === 'SIM') {
              this.congregacaoSedeAddress = r.data.relations[i].organismRelationAddress
            }
          }
          this.numOfParishs = this.organismChildData.length
          this.mountTree()
          this.mountTreeFunctions()
          this.organismChildData.forEach((parish) => {
            this.numOfPastor = this.numOfParishs + parish.functions.users.length
          })
        }
      });
    },
  }
})
</script>
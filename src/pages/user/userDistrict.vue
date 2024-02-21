<template>
  <q-page-container class="no-padding">
    <q-page v-if="organismListTree">
      <div class="text-center q-mt-md">
        <div class="col text-capitalize"> 
          <div class="text-h4">Distrito {{ organismName }}</div>
          <div class="fit row wrap justify-center items-start content-start q-mt-md">
            <q-list
              class="q-mx-md"
              v-for="info in districtInfo"
              :key="info"
              bordered
              style="border-radius: 1rem;"
            >
              <q-item class="q-pa-sm">
                <q-item-section class="text-left">
                  {{ info.label }}:
                  <q-item-label class="text-center">
                    {{ info.num }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
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
              >{{ prop.node.label }}</span>
            </div>
            <div
              v-if="prop.node.type === 'Congregação'"
              class="items-center"
            >
              <q-btn
                icon="navigate_next"
                round
                unelevated
                color="primary"
                flat
                v-on:click.stop="openCongregationDetail(prop.node.organismId)"
              >
                <q-tooltip>Abrir informações sobre a congregação {{ prop.node.type }}</q-tooltip>
              </q-btn>
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
            {{ dialogParishDetail.data.organismConfigName + ' - ' + dialogParishDetail.data.childName }}
          </q-card-section>
          <q-separator class="q-mx-md"/>
          <q-card-section>
            <div class="text-h6 q-ma-sm">
              Funções:
            </div>
            <div class="q-ml-md">
              <div
                v-for="(func) in dialogParishDetail.data.functions"
                :key="func"
              >
                {{ func.functionName }}
                <div
                  v-for="(user) in func.users"
                  :key="user"
                  class="q-ml-sm"
                >
                  {{ user.userName }}
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="dialogCongregationDetail.open"
      >
        <q-card
          style="width: 500px;border-radius: 1rem;"
        >
          <q-card-section class="text-h6">
            {{ dialogCongregationDetail.data.childName }}
          </q-card-section>
          <q-card-section>
            <strong>Funções:</strong>
          </q-card-section>
          <q-card-section
            class="q-ml-md"
          >
            <div
              v-for="(func) in dialogCongregationDetail.data.functions"
              :key="func"
            >
              {{ func.functionName }}
              <div
                v-for="(user) in func.users"
                :key="user"
                class="q-ml-sm q-mt-sm"
              >
                {{ user.userName }}
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
        data: null,
        functionId: null
      },
      dialogCongregationDetail: {
        open: false,
        data: null
      },
      usersOptions: null,
      districtInfo: [
        {
          num: 0,
          label: 'Paróquias'
        },
        {
          num: 0,
          label: 'Congregações'
        },
        {
          num: 0,
          label: 'Pontos de Missão'
        },
        { 
          num: 0,
          label: 'Pastores'
        },
      ],
    }
  },
  beforeMount() {
    // this.getOrganismDetailById()
    this.getDistrictId()
  },
  methods: {
    async getDistrictId() {
      const opt = {
        route: '/desktop/users/getDistrictIdByUserId'
      }
      let r = await useFetch(opt)
      if (r.error) return
      this.getOrganismDetailById(r.data.districtId)
    },
    clearDialogParishDetail() {
      this.dialogParishDetail = {
        open: false,
        data: null,
        functionId: null
      }
    },
    clearDialogCongregationDetail() {
      this.dialogCongregationDetail = {
        open: false,
        data: null
      }
    },
    openCongregationDetail(id) {
      this.organismChildData.forEach((parish) => {
        parish.organismChildData.forEach((congregation) => {
          if (congregation.childId === id) {
            this.dialogCongregationDetail.data = congregation
            this.dialogCongregationDetail.open = true
            return
          }
        })
      })
    },
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
        func.users.forEach((user, iUser) => {
          tree.children.push({
            type: 'user',
            label: user.userName,
            header: 'normal',
            userId: user.userId,
            children: []
          })
          if (user.userEmail) {
            tree.children[iUser].children.push({
              type: 'userData',
              label: 'E-mail:' + ' ' + user.userEmail,
              header: 'normal',
              userId: user.userId
            })
          }
          if (user.userPhone) {
            user.userPhone.forEach((num) => {
              tree.children[iUser].children.push({
                type: 'userData',
                label: 'Contato:' + ' ' + num.value,
                header: 'normal',
                userId: user.userId
              })
            })
          }
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
          this.districtInfo.forEach((info) => {
            if (info.label === 'Congregações') {
              info.num++
            }
          })
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
              this.districtInfo.forEach((info) => {
                if (info.label === 'Pontos de Missão') {
                  info.num++
                }
              })
            }
          })
        })
        this.organismListTree.push(tree)
      })
    },
    getOrganismDetailById(id) {
      this.organismListTree = []
      this.functionsListTree = []
      const opt = {
        route: "/desktop/adm/getDistrictDetail",
        body: {
          organismId: id,
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
          this.districtInfo.forEach((info) => {
            if (info.label === 'Paróquias') {
              info.num = this.organismChildData.length
            }
          })
          this.mountTree()
          this.mountTreeFunctions()
          this.organismChildData.forEach((parish) => {
            parish.functions.forEach((func) => {
              if (func.functionName === 'Pastor em Paróquia') {
                func.users.forEach(() => {
                  this.districtInfo.forEach((info) => {
                    if (info.label === 'Pastores') {
                      info.num++
                    }
                  })
                })
              }
            })
          })
        }
      });
    },
  }
})
</script>
<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="text-h5  text-center">
        Composição
      </div>
      <!-- <div>
        - Para correções, clique na canetinha ao lado da informação;
      </div>
      <div>
        - Caso não deseje concluir a seção no momento, salve as alterações no botão 'Salvar' Rascunho;
      </div>
      <div>
        - Ao terminar a conferência, clique em 'Seguir' para prosseguir.
      </div> -->
      <q-item
        v-if="composition"
        style="border-radius: 1rem;"
        class="bg-grey-2 q-ma-sm"
      >
        <q-item-section>
          <div class="text-h6 text-left">
            Paróquia: {{ composition.organismParentName }}
          </div>
          <div class="q-mt-sm text-left text-h6">
            Congregações:
          </div>
          <q-item-label 
            class="bg-white q-mt-sm text-center"
            style="border-radius: .7rem;"
            v-for="(org, iOrg) in composition.congregations"
            :key="org"
          > 
            <div class="text-center text-h6 q-ma-md">
              <strong>{{ org.organismChildName }}</strong>
            </div>
            <div class="q-mt-sm bg-grey-2 q-ma-sm" style="border-radius: .5rem;">
              <div class="text-left q-ma-md text-h6">
                <strong>Funções:</strong>
              </div>
              <div 
                class="text-left q-ml-lg"
                v-for="(func, iFunc) in org.organismFunctions" 
                :key="func"
              >
                <strong>{{ func.functionName }}:</strong>
                <q-btn
                  color="primary"
                  flat
                  rounded
                  icon="add"
                  @click="addFunctionUser(iFunc, iOrg, func.functionName)"
                  size="12px"
                >

                </q-btn>
                <div
                  class="q-ml-sm q-pa-sm"
                >
                  <q-item
                    class="no-padding"
                    v-for="(user, iUser) in func.functionUsers"
                    :key="user"
                  >
                    <q-item-section class="no-padding">
                      <q-item-label>
                        {{ user.userName }}
                        <q-btn
                          color="red"
                          flat
                          rounded
                          unelevated
                          icon="delete"
                          @click="deleteUserFromFunction(iOrg, iFunc, iUser)"
                        ></q-btn>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
              </div>
            </div>
            <div class="q-mt-sm bg-grey-2 q-ma-sm" style="border-radius: .5rem;">
              <div class="text-left q-ma-md text-h6">
                <strong>Departamentos:</strong>
              </div>
              <q-list
                class="text-left q-ma-md q-pa-sm q-ml-md bg-white"
                style="border-radius: .3rem;"
                v-for="dep in org.depts"
                :key="dep"
              >
              <q-item v-if="dep.existingDepartaments.length > 0">
                <q-item-section>
                  <q-item-label>
                    {{ dep.organismConfigName }}
                  </q-item-label>
                  <q-item-label>
                    Nome: {{ dep.departamentName }}
                  </q-item-label>

                </q-item-section>
              </q-item>
                <!-- <div v-if="dep.existingDepartaments.length > 0">
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
                </div>-->
              </q-list> 
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-dialog
        v-model="dialogAddFunction.open"
      >
        <q-card
          style="width: 400px;"
          @hide="clearDialogAddFunction"
        >
          <q-card-section class="text-h6 text-center">
            Selecione o usuário que irá ocupar a função:
          </q-card-section>
          <q-card-section>
            <q-select
              v-model="dialogAddFunction.pastorSelected"
              filled
              use-input
              label="Nome do usuário"
              option-label="userName"
              :options="usersOptions"
              @filter="getUsers"
              :loading="false"
              :option-value="(item) => item._id"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Nenhum resultado
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Voltar"
              no-caps
              rounded
              color="primary"
              @click="clearDialogAddFunction"
            />
            <q-btn
              label="Adicionar"
              unelevated  
              no-caps
              rounded
              color="primary"
              @click="confirmAddUserToFunction"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-btn
        @click="saveDraft"
      ></q-btn>
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
      composition: null,
      dialogAddFunction: {
        open: false,
        iFunc: null,
        iOrg: null,
        functionName: null,
        pastorSelected: null
      },
      usersOptions: null
    }
  },

  beforeMount() {
    // this.getMyOrganismsWithAllData()
    this.getCompositionByUserId()
    // this.verifyIfIsPastor()
  },
  methods: {
    saveDraft() {
      const opt = {
        route: '/desktop/statistics/saveCompositionDraft',
        body: this.composition
      }
      useFetch(opt).then((r) => {
        if (r.error) return
        this.$q.notify('Rascunho salvo com sucesso')
      })
    },
    deleteUserFromFunction(iOrg, iFunc, iUser) {
      this.composition.congregations[iOrg].organismFunctions[iFunc].functionUsers.splice(iUser, 1)
    },
    clearDialogAddFunction() {
      this.dialogAddFunction= {
        open: false,
        iFunc: null,
        iOrg: null,
        functionName: null,
        pastorSelected: null
      }
    },
    confirmAddUserToFunction() {
      this.composition.congregations[this.dialogAddFunction.iOrg].organismFunctions[this.dialogAddFunction.iFunc].functionUsers.push({
        userId:  this.dialogAddFunction.pastorSelected._id,
        userName: this.dialogAddFunction.pastorSelected.userName
      })
      this.clearDialogAddFunction()
    },
    getUsers(val, update, abort) {
      if(val.length < 3) {
        this.$q.notify('Digite no mínimo 3 caracteres')
        abort()
        return
      }
      let route
      if (this.dialogAddFunction.functionName === 'Pastor') {
        route = "/desktop/adm/getPastores" 
      } else {
        route = '/desktop/adm/getUsers'
      }
      
      const opt = {
        route: route,
        body: {
          searchString: val,
          isActive: 1,
          page: 1,
          rowsPerPage: 50
        }
      }
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if(r.error){ this.$q.notify(r.errorMessage) }

        update(() => {
          this.usersOptions = r.data.list;
        })
      });
    },
    addFunctionUser(iFunc, iOrg, functionName) {
      this.dialogAddFunction.iFunc = iFunc,
      this.dialogAddFunction.iOrg = iOrg,
      this.dialogAddFunction.functionName = functionName
      this.dialogAddFunction.open = true
    },
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
<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col text-h5 text-capitalize" v-if="userData.userDataTabs">
          {{ userData.userDataTabs[0].fields[0].value }}
        </div>
        <div class="col q-gutter-sm text-right">
          <q-btn
            rounded
            no-caps
            unelevated
            icon="person"
            color="secondary"
            label="Dados pessoais"
            @click="visionSelected = 'personalData'"
            :outline="visionSelected === 'personalData' ? false : true"
          />
          <q-btn
            rounded
            no-caps
            unelevated
            icon="school"
            color="secondary"
            label="Títulos"
            @click="visionSelected = 'titles'"
            :outline="visionSelected === 'titles' ? false : true"
          />
          <!-- <q-btn
            rounded
            no-caps
            unelevated
            icon="school"
            color="purple-8"
            label="Vincular título"
            @click="openDialogVinculateUserToTitle = true"
          /> -->
          <!-- <q-btn
            rounded
            no-caps
            unelevated
            icon="bookmark"
            color="primary"
            label="Salvar edição"
            @click="clkUpdateUser"
          /> -->
        </div>
      </div>
      <q-separator class="q-mx-md"/>
      
      <q-splitter
        v-model="splitterModel"
        style="height: 100vh;"
        v-show="visionSelected === 'personalData'"
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

      <div v-show="visionSelected === 'titles'">
        
        <q-splitter
          v-model="splitterModel"
          style="height: 100vh;"
          v-if="userDetail"
        >
          <template v-slot:before>
            <q-tabs
              v-model="tabTitles"
              vertical
              align="left"
              class="text-left "
              no-caps
              active-bg-color="blue-1"
              indicator-color="primary"
              inline-label
              @update:model-value="addBar = false"
            >
              <template v-for="(tab) in userDetail.userTitleData" :key="tab._id">
                <q-tab 
                  class="flex-left flex"
                  :name="tab._id" 
                  :label="tab.titleName" 
                />
                <q-separator/>
              </template>
              <div class="text-center">
                <q-btn
                  color="secondary"
                  rounded
                  icon="add"
                  class="q-ma-md"
                  label="Adicionar"
                  unelevated
                  @click="openDialogVinculateUserToTitle = true"
                  no-caps
                />
              </div>
            </q-tabs>
            
          </template>
          <template v-slot:after>
            <q-tab-panels 
              animated 
              swipeable
              transition-prev="jump-up"
              transition-next="jump-up"
              class="bg-accent"
              :model-value="tabTitles"
            >
              <q-tab-panel 
                v-for="(tab) in userDetail.userTitleData"
                :key="tab._id"
                :name="tab._id" 
              >
                <div class="row">
                  <div 
                    class="col text-h6"
                  >
                  {{ tab.titleName }}</div>
                  <q-btn
                    label="Excluir título"
                    color="red"
                    icon="delete"
                    rounded
                    flat
                    outline
                    @click="clkDeleteTitle(tab._id)"
                    no-caps
                  />
                </div>
                <div class="row justify-center items-start">
                  <div class="col-8 q-pa-md q-gutter-md">
                    <div class="text-h5 text-center">Preencha os dados do título</div>
                    <div
                      v-for="(field, fieldIndex) in tab.titleFields"
                      :key="fieldIndex"
                    >
                      <div v-if="field.type.type !== 'boolean' && field.type.type !== 'address' ">
                        <q-input
                          :label="field.label"
                          :hint="field.hint"
                          :type="field.type.type"
                          v-model="field.value"
                          outlined
                        >
                          <template
                            v-if="field.multiple"
                            #append
                          >
                            <q-btn
                              disabled
                              icon="add"
                              color="primary"
                              flat
                              round
                              @click="addMultipleField"
                            >
                              <q-tooltip
                                >Adicionar multiplo
                                {{ field.type.label }}</q-tooltip
                              >
                            </q-btn>
                          </template>
                        </q-input>
                      </div>
                      <div class="text-right" v-if="field.type.type === 'address'">
                        <q-btn
                          label="Adicionar um endereço"
                          no-caps
                          rounded
                          unelevated
                          outline
                          color="primary"
                          @click="clkOpenAddressDialog(fieldIndex, tabsIndex)"
                        />
                      </div>
                      <div
                        v-if="field.type.type === 'address' && !field.address"
                        class="text-subtilte1 text-start"
                      >
                        <div class="text-h6">Endereços</div>
                        Nenhum endereço vinculado
                      </div>
                      <q-list
                        class="no-margin"
                        v-if="field.address"
                      >
                        <q-item
                          v-for="(item, i) in field.address"
                          :key="item + i"
                          style="border-radius: 1rem"
                          class="bg-grey-3 q-ma-sm q-pa-md"
                        >
                        <q-item-section>
                          <q-item-label lines="3" class="text-capitalize">
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
                        <q-item-section side top>
                          <q-item-label caption class="text-capitalize">{{
                            item.type
                          }}</q-item-label>
                        </q-item-section>
                        </q-item>
                      </q-list>
                      <q-checkbox
                        v-if="field.type.type === 'boolean'"
                        class="q-pt-lg"
                        readonly
                        :label="field.label"
                        :hint="field.hint"
                        v-model="field.value"
                      />
                    </div>
                    <div 
                      class="col-6 q-gutter-sm text-center"
                    >
                      <q-btn
                        rounded
                        no-caps
                        unelevated
                        class="full-width"
                        color="primary"
                        label="Salvar"
                        @click="updateUserTitle(tab)"
                      />
                    </div>
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </template>
        </q-splitter>
      </div>
      <q-dialog v-model="openDialogVinculateUserToTitle">
        <q-card style="border-radius: 1rem; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">
              Informe o título que o usuário irá receber
            </div>
          </q-card-section>
          <q-card-section align="center">
            <q-select
              v-model="titleSelected"
              filled
              use-input
              label="Nome do título"
              option-label="titleName"
              :options="titleOptions"
              @filter="getTitleNamesList"
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
              label="Depois"
              no-caps
              rounded
              color="primary"
              @click="openDialogVinculateUserToTitle = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="createUserTitle"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="deleteTitle.openDialog">
        <q-card style="border-radius: 1rem; width: 400px">
          <q-card-section>
            <div class="text-h6 text-center">
              Confirma deletar o título?
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Não"
              no-caps
              rounded
              color="primary"
              @click="deleteTitle.openDialog = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="clkConfirmDeleteTitle"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: "UserDetail",
  data() {
    return {
      selectIndex: null,
      tab: "",
      tabTitles: "",
      isSaving: false,
      newPhone: "",
      userTitleName: '',
      newAddress: "",
      newEmail: "",
      allPermissions: [],
      userPermissions: [],
      formattedPermissions: [],
      userId: null,
      userData: [],
      titleSelected: '',
      titleOptions: [],
      openDialogVinculateUserToTitle: false,
      dialogInactiveUser: {
        open: false,
      },
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: "",
      },
      userName: '',
      splitterModel: 25,
      titleFields: [],
      visionSelected: 'personalData',
      userDetail: null,
      deleteTitle: {
        openDialog: false,
        titleId: null
      }
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getUsersConfig()
    this.getUserDetailById();
  },
  methods: {
    updateUserTitle(i){
      console.log(i)
      const opt = {
        route: "/desktop/adm/updateUserTitle",
        body: {
          userTitleId: i._id,
          titleFields: i.titleFields
        }
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente')
          return
        } else{
          this.$q.notify('Título atualizado com sucesso!'); 
          this.getUserDetailById()
        }
      });
    },
    indetifyIndex(i) {
      console.log(i)
      this.selectIndex = i
    },
    clkConfirmDeleteTitle () {
      const opt = {
        route: "/desktop/adm/inactivateUserTitle",
        body: {
          titleId: this.deleteTitle.titleId
        }
      }
      useFetch(opt).then(r => {
        if (r.error) {
          this.$q.notify(r.errorMessage)
          return
        }
        this.deleteTitle.openDialog = false
        this.deleteTitle.titleId = null
        this.getUserDetailById()
      })
    },
    clkDeleteTitle (titleId) {
      console.log(titleId)
      this.deleteTitle.titleId = titleId
      this.deleteTitle.openDialog = true
    },
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
          this.getUserDetailById()
        }
      });
    },
    getUserDetailById() {
      const userId = this.$route.query.userId;
      const opt = {
        route: "/desktop/adm/getUserDetailById",
        body: {
          _id: userId,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
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
    getTitleNamesList(val, update) {
      const opt = {
        route: "/desktop/adm/getTitleNamesList",
        body: {
          searchString: val,
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage
        }
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        update(() => {
          this.titleOptions = r.data.list;
        })
      });
    },
    getTitleConfigsDetailById() {
      const opt = {
        route: "/desktop/config/getTitleConfigsDetailById",
        body: {
          titleConfigsId: this.titleSelected._id
        }
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        // this.titleName = r.data.titleName
        this.titleFields = r.data.titleFields;
      });
    },
    createUserTitle() {
      if (this.userAlreadyHasTitle()) {
        this.$q.notify('Usuário já tem este título')
        return
      }
      const opt = {
        route: "/desktop/adm/createUserTitle",
        body: {
          titleConfigId: this.titleSelected._id,
          userId: this.$route.query.userId
        }
      };
      this.openDialogVinculateUserToTitle = false
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if (r.error) {
          this.$q.notify("Erro ao inserir título, tente novamente mais tarde.")
          return
        }
        this.getUserDetailById()
        this.getTitleConfigsDetailById()
        this.tabTitles = 
        this.$q.notify('Preencha os dados do título')
      });
    },
    userAlreadyHasTitle () {
      if (!this.userDetail.userTitleData || this.userDetail.userTitleData.length === 0) return false
      let ret = false
      this.userDetail.userTitleData.forEach(ut => {
        if (ut.titleConfigId === this.titleSelected._id) ret = true
      })
      return ret
    },
    getCompanyPermissions() {
      const opt = {
        route: "/auth/getCompanyPermissions",
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.allPermissions = r.data;
        this.getUserPermissionsOnly();
      });
    },
    getUserPermissionsOnly() {
      const opt = {
        route: "/auth/getUserPermissionsOnly",
        body: {
          userId: this.userId,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.userPermissions = r.data;
        this.formattedPermissions = this.allPermissions.map((permission) => {
          if (
            this.userPermissions.some((e) => e.id === permission.permissionId)
          ) {
            permission.value = true;
          } else permission.value = false;
          return permission;
        });
      });
    },
    changeUserPermission(permissionId, newStatus) {
      const opt = {
        route: "/auth/changeUserPermission",
        body: {
          userId: this.userId,
          permissionId: permissionId,
          newStatus: newStatus ? 1 : 0,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify(
            "ERRO ao atualizar permissão! Tente novamente mais tarde."
          );
        } else {
          this.$q.notify("Permissão atualizada!");
          this.getCompanyPermissions();
        }
      });
    },
  },
});
</script>
<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
.footer {
  height: 52px;
  position: fixed;
  bottom: 0px;
}
.separator {
  position: fixed;
  top: 118px;
  border-left: 2px solid rgb(216, 216, 216);
  height: 806px;
}
</style>
